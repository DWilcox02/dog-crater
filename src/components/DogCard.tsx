import React from 'react';
import '../css/DogGrid.css';
import type { Dog } from "../types/types";
import DogTimer from './DogTimer';

interface DogCardProps {
    dog: Dog;
    isSelected?: boolean;
    initialTime?: number;
    onStop?: (dog: Dog) => void;
    dogCrated?: boolean;
    timerDuration?: number;
    endTime?: number;
}

const DogImage: React.FC<{ dog: Dog }> = ({ dog }) => {
    return (
        <div className="dog-image-container">
            <img src={dog.filepath} alt="Dog" className="dog-image" loading="lazy" />
        </div>
    )
}

const DogCard: React.FC<DogCardProps> = ({ dog, isSelected, onStop, dogCrated, timerDuration, endTime }) => {

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
                {/* <DogImage dog={dog} /> */}
                <div className="dog-info">
                    <h3>{dog.name}, {dog.strikes} strike{dog.strikes !== 1 ? 's' : ''}</h3>
                </div>

                <DogTimer
                    isRunning={dogCrated}
                    onComplete={handleComplete}
                    initialDuration={timerDuration}
                    endTime={endTime}
                    key={timerDuration} // Reset timer if duration changes
                />
            </div>
        </>
    )
}

export default DogCard;