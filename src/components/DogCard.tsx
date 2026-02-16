
import React from 'react';
import '../css/DogGrid.css';
import type { Dog } from "../types/types";
import DogTimer from './DogTimer';
import { TieredMenu } from 'primereact/tieredmenu';


interface DogCardProps {
    dog: Dog;
    isSelected?: boolean;
    onStart?: (dog: Dog) => void;
    initialTime?: number;
    onStop?: (dog: Dog) => void;
    isRunning?: boolean;
}

const DogCard: React.FC<DogCardProps> = ({ dog, isSelected, onStart, onStop, isRunning }) => {


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

    const items = [
        {
            label: 'View',
            items: [
                {
                    label: "Info"
                }
            ]
        },
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
        },
    ];


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
                            <button onClick={handleStart} className="timer-btn start">Start</button>
                            <button onClick={handleStop} className="timer-btn stop">Stop</button>
                        </div>
                    )}
                </div>

                <div className="dog-info">
                    <h3>{dog.name}, {dog.strikes} strike{dog.strikes !== 1 ? 's' : ''}</h3>
                </div>

                <DogTimer isRunning={isRunning} onComplete={handleComplete} />
            </div>
        </>
    )
}

export default DogCard;
