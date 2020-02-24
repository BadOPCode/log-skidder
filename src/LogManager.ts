import { ConsoleMethod, SearchEventSpecifier, EventLog } from "./types/LogSkidder";
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

    private _generateLogEvent = (eventType: string, data:any[]) => ({
        appName: this._appName,
        eventType,
        data,
    });

    error:ConsoleMethod = (...options:any[]) => {
        this._handlers.process(
            this._generateLogEvent('error', options)
        );
    }

    log:ConsoleMethod = (...options:any[]) => {
        this._handlers.process(
            this._generateLogEvent('log', options)
        );
    }

    warn:ConsoleMethod = (...options:any[]) => {
        this._handlers.process(
            this._generateLogEvent('warn', options)
        );
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
