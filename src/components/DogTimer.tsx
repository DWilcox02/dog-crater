import '../css/DogGrid.css';
import { useState, useEffect } from 'react';

const DEFAULT_START_TIME = 60000;

interface ControlButtonsProps {
    active: boolean;
    isPaused: boolean;
    handleStart: () => void;
    handlePauseResume: () => void;
    handleReset: () => void;
}

interface TimerProps {
    time: number;
}

function ControlButtons({
    active,
    isPaused,
    handleStart,
    handlePauseResume,
    handleReset,
}: ControlButtonsProps) {
    const StartButton = (
        <div className="btn btn-one btn-start"
            onClick={handleStart}>
            Start
        </div>
    );
    const ActiveButtons = (
        <div className="btn-grp">
            <div className="btn btn-two"
                onClick={handleReset}>
                Reset
            </div>
            <div className="btn btn-one"
                onClick={handlePauseResume}>
                {isPaused ? "Resume" : "Pause"}
            </div>
        </div>
    );

    return (
        <div className="Control-Buttons">
            <div>{active ? ActiveButtons : StartButton}</div>
        </div>
    );
}

function Timer({ time }: TimerProps) {
    return (
        <div className="timer">
            <span className="digits">
                {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
            </span>
            <span className="digits">
                {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
            </span>
            <span className="digits mili-sec">
                {("0" + ((time / 10) % 100)).slice(-2)}
            </span>
        </div>
    );
}

interface DogTimerProps {
    isRunning?: boolean;
    onComplete?: () => void;
    initialDuration?: number;
}

function DogTimer({ isRunning = false, onComplete, initialDuration = DEFAULT_START_TIME }: DogTimerProps) {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(true);

    const [time, setTime] = useState(initialDuration);

    // Reset time if initialDuration changes
    useEffect(() => {
        setTime(initialDuration);
    }, [initialDuration]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                setTime((prevTime) => {

                    if (prevTime <= 10) {
                        setIsActive(false);
                        setIsPaused(true);
                        if (onComplete) onComplete();
                        return 0;
                    }

                    return prevTime - 10;
                });
            }, 10);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, isPaused, onComplete]);

    useEffect(() => {
        if (isRunning) {
            const timeoutId = setTimeout(() => {
                if (time > 0) {
                    setIsActive(true);
                    setIsPaused(false);
                }
            }, 0);
            return () => clearTimeout(timeoutId);
        } else {
            const timeoutId = setTimeout(() => setIsPaused(true), 0);
            return () => clearTimeout(timeoutId);
        }
    }, [isRunning, time]);

    const handleStart = () => {
        if (time > 0) {
            setIsActive(true);
            setIsPaused(false);
        }
    };

    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(initialDuration);
    };

    return (
        <div className="stop-watch">
            <Timer time={time} />
            <ControlButtons
                active={isActive}
                isPaused={isPaused}
                handleStart={handleStart}
                handlePauseResume={handlePauseResume}
                handleReset={handleReset}
            />
        </div>
    );
}

export default DogTimer;