import { ConsoleWriter, EventLog, ConsoleMethod } from "./types/LogSkidder";
import { LogManager } from "./LogManager";
import { LogHandler } from "./LogHandler";

export interface EventManagers {
    [key:string]: LogManager;
}

declare interface Manager {
    [key: string] : ConsoleMethod
}

export class LogSkidder {
    public handlers: LogHandler = new LogHandler();
    private _original: ConsoleWriter;
    private _managers: EventManagers = { undefined: new LogManager('undefined', this.handlers) };

    constructor() {
        this._original = {
            // tslint:disable-next-line: no-console
            error: console.error,
            // tslint:disable-next-line: no-console
            log: console.log,
            // tslint:disable-next-line: no-console
            warn: console.warn,
        }
    }

    get original(): ConsoleWriter {
        return this._original;
    }

    /**
     * Replaces the original console methods with internal handlers.
     */
    hookConsoleMethods() {
        console.error = this.Manager('undefined').error;
        console.log = this.Manager('undefined').log;
        console.warn = this.Manager('undefined').warn;
    }

    unhookConsoleMethods() {
        console.error = this._original.error;
        console.log = this._original.log;
        console.warn = this._original.warn;
    }

    Manager(name: string) {
        return this._managers[name] || this._managers.undefined;
    }

    Attach(name: string) {
        this._managers[name] = new LogManager(name, this.handlers);
        return this._managers[name];
    }
}
