import React from 'react';
import '../css/DogGrid.css';
import type { Dog } from "../types/types";
import DogTimer from './DogTimer';

interface DogCardProps {
    dog: Dog;
    isSelected?: boolean;
    onStart?: (dog: Dog) => void;
    initialTime?: number;
    onStop?: (dog: Dog) => void;
    isRunning?: boolean;
    timerDuration?: number;
}

const DogCard: React.FC<DogCardProps> = ({ dog, isSelected, onStart, onStop, isRunning, timerDuration }) => {

    const handleStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onStart) onStart(dog);
    };

    const handleStop = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onStop) onStop(dog);
    };

    const handleComplete = () => {
        if (onStop) onStop(dog);
    };

    const cardStyle: React.CSSProperties = isSelected ? {
        outline: '4px solid #646cff',
        transform: 'scale(1.02)',
        zIndex: 10
    } : {};

    return (
        <>
            <div
                key={dog.dog_id}
                className="dog-card"
                style={cardStyle}
            >
                <div className="dog-image-container">
                    <img src={dog.filepath} alt="Dog" className="dog-image" loading="lazy" />

                    {/* Hover Menu Overlay */}
                    {(isSelected) && (
                        <div className="dog-card-overlay">
                            {/* Buttons can be used as fallback or alternative to menu */}
                            {!isRunning ? (
                                <button onClick={handleStart} className="timer-btn start">Start</button>
                            ) : (
                                <button onClick={handleStop} className="timer-btn stop">Stop</button>
                            )}
                        </div>
                    )}
                </div>

                <div className="dog-info">
                    <h3>{dog.name}, {dog.strikes} strike{dog.strikes !== 1 ? 's' : ''}</h3>
                </div>

                <DogTimer
                    isRunning={isRunning}
                    onComplete={handleComplete}
                    initialDuration={timerDuration}
                    key={timerDuration} // Reset timer if duration changes
                />
            </div>
        </>
    )
}

export default DogCard;