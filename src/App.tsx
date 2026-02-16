import { useState, useRef, useEffect } from 'react';
import './css/App.css'
import type { Dog } from "./types/types";
import DogCard from './components/DogCard';
import { dogs_data } from "./data/sample_data.json";
import { PrimeReactProvider } from "primereact/api";
import { TieredMenu } from 'primereact/tieredmenu';
import type { MenuItem } from 'primereact/menuitem';

function App() {
  // Store dogs in state to allow updates (strikes)
  const [dogs, setDogs] = useState<Dog[]>((dogs_data as unknown) as Dog[]);

  // Store active timers: mapping dog_id -> duration in ms
  const [activeTimers, setActiveTimers] = useState<Record<number, number>>({});
  const [crateEndTimes, setCrateEndTimes] = useState<Record<number, number>>({});
  const [isCrated, setIsCrated] = useState<Record<number, boolean>>({});


  // Ref for the TieredMenu to handle focus if needed
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

  const crateDog = (dogId: number, durationMinutes: number) => {
    addStrike(dogId);
    const durationMs = durationMinutes * 60 * 1000;
    setActiveTimers(prev => ({ ...prev, [dogId]: durationMs }));
    setCrateEndTimes(prev => ({ ...prev, [dogId]: Date.now() + durationMs }));
    setIsCrated(prev => ({ ...prev, [dogId]: true }));
  };

  const uncrateDog = (dogId: number) => {
    setActiveTimers(prev => {
      const next = { ...prev };
      delete next[dogId];
      return next;
    });
    setCrateEndTimes(prev => {
      const next = { ...prev };
      delete next[dogId];
      return next;
    });
    setIsCrated(prev => {
      const next = { ...prev };
      delete next[dogId];
      return next;
    })
  };

  // --- Menu Model Construction ---

  const menuItems: MenuItem[] = dogs.map(dog => {
    const dogCrated = isCrated[dog.dog_id];

    return {
      label: dog.name, // Used for accessibility/keys
      // Render the DogCard as the menu item content
      template: (item, options) => {
        return (
          <div className={options.className} onClick={options.onClick} style={{ padding: 0, width: '100%' }}>
            <DogCard
              dog={dog}
              isSelected={false} // Disable overlay buttons, rely on menu actions
              dogCrated={dogCrated}
              timerDuration={activeTimers[dog.dog_id]}
              endTime={crateEndTimes[dog.dog_id]}
            />
          </div>
        );
      },
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
        (dogCrated ? {
          label: 'Uncrate',
          icon: 'pi pi-clock',
          command: () => uncrateDog(dog.dog_id)
        } : {
          label: 'Crate',
          icon: 'pi pi-play',
          items: [
            {
              label: '6 Seconds',
              command: () => crateDog(dog.dog_id, 0.1)
            },
            {
              label: '1 Minute',
              command: () => crateDog(dog.dog_id, 1)
            },
            {
              label: '5 Minutes',
              command: () => crateDog(dog.dog_id, 5)
            },
            {
              label: '10 Minutes',
              command: () => crateDog(dog.dog_id, 10)
            },
            {
              label: '15 Minutes',
              command: () => crateDog(dog.dog_id, 15)
            }
          ]
        })
      ]
    };
  });

  // Auto-focus the menu on mount so arrow keys work immediately
  useEffect(() => {
    const menuElement = document.querySelector('.p-tieredmenu');
    if (menuElement instanceof HTMLElement) {
      menuElement.focus();
    }
  }, []);

  return (
    <PrimeReactProvider>
      <style>{`
        body {
          display: block;
          place-items: unset;
        }
        #root {
          max-width: 100%;
          margin: 0;
          padding: 2rem;
          text-align: left;
        }
        .custom-tiered-menu {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: #ffffff;
          padding: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          width: 280px;
        }
        .custom-tiered-menu .p-submenu-list {
          width: 200px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .custom-tiered-menu .p-menuitem-link {
          padding: 0.75rem 1rem;
          color: #374151;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .custom-tiered-menu .p-menuitem-link:hover,
        .custom-tiered-menu .p-menuitem-active > .p-menuitem-link {
          background-color: #f3f4f6;
        }
        .custom-tiered-menu .p-menuitem-text {
          margin-left: 0.5rem;
        }
        .custom-tiered-menu .p-submenu-icon {
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'flex-start' }}>

        {/* Main Interface: Tiered Menu containing Dog Cards */}
        <div style={{ marginBottom: '1rem' }}>
          <h3>Dog Controls (Use Arrow Keys)</h3>
          <TieredMenu
            model={menuItems}
            ref={menuRef}
            className="custom-tiered-menu"
          />
        </div>

      </div>
    </PrimeReactProvider>
  )
}

export default App