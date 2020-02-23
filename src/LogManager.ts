import { ConsoleMethod, SearchEventSpecifier } from "./types/LogSkidder";
import { LogHandler } from "./LogHandler";

/**
 * This is a interface that is returned when a application requests to attach
 * to the logger.
 * @class LogManager
 */
export class LogManager {
    private _appName: string;
    private _handlers: LogHandler;

    constructor(appName: string, logHandlers: LogHandler) {
        this._appName = appName;
        this._handlers = logHandlers;
    }

    error:ConsoleMethod = (...options:any[]) => {
        this._handlers.process({
            appName: this._appName,
            eventType: 'error',
            data: options,
        });
    }

    log:ConsoleMethod = (...options:any[]) => {
        this._handlers.process({
            appName: this._appName,
            eventType: 'log',
            data: options,
        });
    }

    warn:ConsoleMethod = (...options:any[]) => {
        this._handlers.process({
            appName: this._appName,
            eventType: 'warn',
            data: options,
        });
    }

    list = (eventType?: string) => {
        const searchParams: SearchEventSpecifier = {
            appName: this._appName,
        };

        if (eventType) {
            searchParams.eventType = eventType;
        }

        return this._handlers.search(searchParams);
    }
}
