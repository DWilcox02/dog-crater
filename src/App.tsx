import { useState, useRef, useEffect } from 'react';
import './css/App.css'
import type { Dog } from "./types/types";
import DogGrid from './components/DogGrid'
import { dogs_data } from "./data/sample_data.json";
import { PrimeReactProvider } from "primereact/api";
import { TieredMenu } from 'primereact/tieredmenu';
import type { MenuItem } from 'primereact/menuitem';

function App() {
  // Store dogs in state to allow updates (strikes)
  const [dogs, setDogs] = useState<Dog[]>((dogs_data as unknown) as Dog[]);

  // Store active timers: mapping dog_id -> duration in ms
  const [activeTimers, setActiveTimers] = useState<Record<number, number>>({});

  // Ref for the TieredMenu to handle focus if needed, though mostly automatic with clicking
  const menuRef = useRef<TieredMenu>(null);

  // --- Actions ---

  const addStrike = (dogId: number) => {
    setDogs(prevDogs => prevDogs.map(d =>
      d.dog_id === dogId ? { ...d, strikes: d.strikes + 1 } : d
    ));
  };

  const removeStrike = (dogId: number) => {
    setDogs(prevDogs => prevDogs.map(d =>
      d.dog_id === dogId ? { ...d, strikes: Math.max(0, d.strikes - 1) } : d
    ));
  };

  const startTimer = (dogId: number, durationMinutes: number) => {
    const durationMs = durationMinutes * 60 * 1000;
    setActiveTimers(prev => ({ ...prev, [dogId]: durationMs }));
  };

  const stopTimer = (dogId: number) => {
    setActiveTimers(prev => {
      const next = { ...prev };
      delete next[dogId];
      return next;
    });
  };

  // --- Menu Model Construction ---

  const menuItems: MenuItem[] = dogs.map(dog => {
    const isRunning = !!activeTimers[dog.dog_id];

    return {
      label: dog.name,
      items: [
        {
          label: 'Strikes',
          icon: 'pi pi-exclamation-circle',
          items: [
            {
              label: 'Add Strike',
              icon: 'pi pi-plus',
              command: () => addStrike(dog.dog_id)
            },
            {
              label: 'Remove Strike',
              icon: 'pi pi-minus',
              command: () => removeStrike(dog.dog_id)
            }
          ]
        },
        {
          label: 'Timer',
          icon: 'pi pi-clock',
          // If timer is running, show Stop. Else show Start options.
          items: isRunning ? [
            {
              label: 'Stop',
              icon: 'pi pi-stop-circle',
              command: () => stopTimer(dog.dog_id)
            }
          ] : [
            {
              label: 'Start Timer',
              icon: 'pi pi-play',
              items: [
                {
                  label: '5 Minutes',
                  command: () => startTimer(dog.dog_id, 5)
                },
                {
                  label: '10 Minutes',
                  command: () => startTimer(dog.dog_id, 10)
                },
                {
                  label: '15 Minutes',
                  command: () => startTimer(dog.dog_id, 15)
                }
              ]
            }
          ]
        }
      ]
    };
  });

  // Auto-focus the menu on mount so arrow keys work immediately
  useEffect(() => {
    // Find the menu DOM element and focus it if possible
    const menuElement = document.querySelector('.p-tieredmenu');
    if (menuElement instanceof HTMLElement) {
      menuElement.focus();
    }
  }, []);

  return (
    <PrimeReactProvider>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

        {/* Tiered Menu Control */}
        <div style={{ alignSelf: 'flex-start', marginLeft: '2rem', marginBottom: '1rem' }}>
          <h3>Dog Controls (Use Arrow Keys)</h3>
          <TieredMenu
            model={menuItems}
            ref={menuRef}
            style={{ width: '250px' }}
          />
        </div>

        {/* Visual Grid Representation */}
        <div>
          <DogGrid
            dogs={dogs}
            runningTimers={activeTimers}
            // Optional: Passing these for manual clicks if needed, but menu drives logic now
            onStopTimer={(dog) => stopTimer(dog.dog_id)}
          />
        </div>
      </div>
    </PrimeReactProvider>
  )
}

export default App