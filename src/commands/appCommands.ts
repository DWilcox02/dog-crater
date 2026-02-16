
import { Command } from "../framework/input/command";
import type { IAppContext } from "../types/types";

export class MoveSelectionCommand extends Command {
  private context: IAppContext;
  private direction: number;

  constructor(context: IAppContext, direction: number) {
    super();
    this.context = context;
    this.direction = direction;
  }

  execute(): void {
    this.context.moveSelection(this.direction);
  }
}

// Command to start timer
export class StartTimerCommand extends Command {
  private context: IAppContext;

  constructor(context: IAppContext) {
    super();
    this.context = context;
  }

  execute(): void {
    this.context.startTimerForSelected();
  }
}

// Command to stop timer
export class StopTimerCommand extends Command {
  private context: IAppContext;

  constructor(context: IAppContext) {
    super();
    this.context = context;
  }

  execute(): void {
    this.context.stopTimerForSelected();
  }
}
