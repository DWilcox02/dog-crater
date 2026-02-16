
import React from 'react';
import '../css/DogGrid.css';
import type { Dog } from "../types/types";
import DogCard from './DogCard';

interface DogGridProps {
  dogs: Dog[];
  selectedDogIndex?: number;
  onStartTimer?: (dog: Dog) => void;
  onStopTimer?: (dog: Dog) => void;
  runningDogs?: Set<number>;
}

const DogGrid: React.FC<DogGridProps> = ({ dogs, selectedDogIndex, onStartTimer, onStopTimer, runningDogs }) => {
  return (
    <div className="dog-grid">
      {dogs.map((dog, index) => (
        <DogCard
          key={dog.dog_id}
          dog={dog}
          isSelected={index === selectedDogIndex}
          onStart={onStartTimer}
          onStop={onStopTimer}
          isRunning={runningDogs?.has(dog.dog_id)}
        />
      ))}
    </div>
  );
};

export default DogGrid;
