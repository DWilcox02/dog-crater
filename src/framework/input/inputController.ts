
import { Command } from "./command";

export class InputController {
  private keyMap: Map<string, Command> = new Map();

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  public bind(key: string, command: Command): void {
    this.keyMap.set(key, command);
  }

  public unbind(key: string): void {
    this.keyMap.delete(key);
  }

  public attach(target: EventTarget): void {
    target.addEventListener("keydown", this.handleKeyDown as EventListener);
  }

  public detach(target: EventTarget): void {
    target.removeEventListener("keydown", this.handleKeyDown as EventListener);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.keyMap.has(event.key)) {
      event.preventDefault();
      this.keyMap.get(event.key)?.execute();
    }
  }
}
