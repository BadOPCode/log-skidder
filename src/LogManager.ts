import { ConsoleMethod, SearchEventSpecifier, EventLog } from "./types/LogSkidder";
import { LogHandler } from "./LogHandler";

/**
 * This is a interface that is returned when a application requests to attach
 * to the logger.
 * @class LogManager
 */
export class LogManager {
    private _groupName: string;
    private _handlers: LogHandler;

    constructor(groupName: string, logHandlers: LogHandler) {
        this._groupName = groupName;
        this._handlers = logHandlers;
    }

    private _generateLogEvent = (eventType: string, data:any[]) => ({
        groupName: this._groupName,
        eventType,
        timestamp: new Date(),
        data,
    });

    private _process:ConsoleMethod = (eventType: string, ...options: any[]) => {
        this._handlers.process(
            this._generateLogEvent(eventType, options)
        );
    }

    error:ConsoleMethod = (...options:any[]) => {
        this._process('error', ...options);
    }

    log:ConsoleMethod = (...options:any[]) => {
        this._process('log', ...options);
    }

    warn:ConsoleMethod = (...options:any[]) => {
        this._process('warn', ...options);
    }

    list = (eventType?: string) => {
        const searchParams: SearchEventSpecifier = {
            groupName: this._groupName,
        };

        if (eventType) {
            searchParams.eventType = eventType;
        }

        return this._handlers.search(searchParams);
    }
}
