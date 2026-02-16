
import { useEffect, useState, useRef } from 'react';
import './css/App.css'
import type { Dog } from "./types/types";
import DogGrid from './components/DogGrid'
import { dogs_data } from "./data/sample_data.json";
import { InputController } from './framework/input/inputController';
import type { IAppContext } from "./types/types";
import { MoveSelectionCommand } from './commands/appCommands';
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";

const dogs: Dog[] = (dogs_data as unknown) as Dog[];

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cratedDogTimes, setCratedDogTimes] = useState<Set<number>>(new Set());

  // Refs are used to access the latest state inside the command execution context
  // without needing to recreate the commands on every render.
  const selectedIndexRef = useRef(selectedIndex);

  // Update both state and ref
  const updateSelection = (index: number) => {
    if (index >= 0 && index < dogs.length) {
      setSelectedIndex(index);
      selectedIndexRef.current = index;
    }
  };

  const handleStartTimer = (dog: Dog) => {
    setCratedDogTimes(prev => new Set(prev).add(dog.dog_id));
  };

  const handleStopTimer = (dog: Dog) => {
    setCratedDogTimes(prev => {
      const next = new Set(prev);
      next.delete(dog.dog_id);
      return next;
    });
  };

  // Initialize Controller and Commands
  useEffect(() => {
    const controller = new InputController();

    // Define the context that commands will operate on
    const appContext: IAppContext = {
      moveSelection: (direction: number) => {
        updateSelection(selectedIndexRef.current + direction);
      },
      startTimerForSelected: () => {
        const dog = dogs[selectedIndexRef.current];
        if (dog) handleStartTimer(dog);
      },
      stopTimerForSelected: () => {
        const dog = dogs[selectedIndexRef.current];
        if (dog) handleStopTimer(dog);
      }
    };

    // Bind Keys to Commands
    controller.bind("ArrowDown", new MoveSelectionCommand(appContext, 1));
    controller.bind("ArrowUp", new MoveSelectionCommand(appContext, -1));
    // controller.bind("ArrowLeft", new Mo)
    // controller.bind(" ", new ToggleActionCommand(appContext)); // Spacebar

    controller.attach(window);

    return () => {
      controller.detach(window);
    };
  }, []);

  return (
    <>
      <PrimeReactProvider>
        <div>
          <DogGrid
            dogs={dogs}
            selectedDogIndex={selectedIndex}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
            runningDogs={cratedDogTimes}
          />
        </div>
      </PrimeReactProvider>
    </>
  )
}

export default App
