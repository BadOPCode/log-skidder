import { ConsoleWriter, EventLog, ConsoleMethod } from "./types/LogSkidder";
import { LogManager } from "./LogManager";
import { LogHandler } from "./LogHandler";

export interface EventManagers {
    [key:string]: LogManager;
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
        // tslint:disable-next-line: no-console
        console.error = this.errorConsoleHandler;
        // tslint:disable-next-line: no-console
        console.log = this.logConsoleHandler;
        // tslint:disable-next-line: no-console
        console.warn = this.warnConsoleHandler;
    }

    Manager(name: string) {
        return this._managers[name] || this._managers.undefined;
    }

    Attach(name: string) {
        this._managers[name] = new LogManager(name, this.handlers);
        return this._managers[name];
    }

    /**
     * Method used to replace the console.error
     * @param ...options:any[]
     * @returns void
     */
    errorConsoleHandler:ConsoleMethod = (...options:any[]) => {
        this.Manager('undefined').error(...options);
    }

    /**
     * Method used to replace the console.log
     * @param ...options:any[]
     * @returns void
     */
    logConsoleHandler:ConsoleMethod = (...options:any[]) => {
        this.Manager('undefined').log(...options);
    }

    /**
     * Method used to replace the console.warn
     * @param ...options:any[]
     * @returns void
     */
    warnConsoleHandler:ConsoleMethod = (...options:any[]) => {
        this.Manager('undefined').warn(...options);
    }
}
