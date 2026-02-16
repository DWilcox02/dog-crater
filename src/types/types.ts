export interface Dog {
  dog_id: number;
  name: string;
  filepath: string;
  is_in_crate: boolean;
  strikes: number;
}

export interface CrateSession {
  session_id: number;
  dog_id: number;
  start_time: number;
  end_time?: number;
}

export interface IAppContext {
  moveSelection(direction: number): void;
  startTimerForSelected(): void;
  stopTimerForSelected(): void;
}
