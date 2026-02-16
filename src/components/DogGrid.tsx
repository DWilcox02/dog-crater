import React from 'react';
import '../css/DogGrid.css';
import type { Dog } from "../types/types";
import DogCard from './DogCard';

interface DogGridProps {
  dogs: Dog[];
  selectedDogIndex?: number;
  onStartTimer?: (dog: Dog) => void;
  onStopTimer?: (dog: Dog) => void;
  runningTimers: Record<number, number>; // Map dog_id to duration
}

const DogGrid: React.FC<DogGridProps> = ({ dogs, selectedDogIndex, onStartTimer, onStopTimer, runningTimers }) => {
  return (
    <div className="dog-grid">
      {dogs.map((dog, index) => (
        <DogCard
          key={dog.dog_id}
          dog={dog}
          isSelected={index === selectedDogIndex}
          onStart={onStartTimer}
          onStop={onStopTimer}
          isRunning={!!runningTimers[dog.dog_id]}
          timerDuration={runningTimers[dog.dog_id]}
        />
      ))}
    </div>
  );
};

export default DogGrid;