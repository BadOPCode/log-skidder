import { ConsoleMethod, SearchEventSpecifier, EventLog } from "./LogSkidder.types";
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

    /**
     * Method to define your own event types.
     * @param type Custom event type.
     * @param options Array of strings to record.
     */
    put:ConsoleMethod = (type: string, ...options: any[]) => {
        this._process(type, ...options);
    }

    /**
     * Method to output a error type event.
     * @param options Array of strings to record.
     */
    error:ConsoleMethod = (...options:any[]) => {
        this._process('error', ...options);
    }

    /**
     * Method to output a log type event.
     * @param options Array of strings to record.
     */
    log:ConsoleMethod = (...options:any[]) => {
        this._process('log', ...options);
    }

    /**
     * Method to output a warn type event.
     * @param options Array of strings to record.
     */
    warn:ConsoleMethod = (...options:any[]) => {
        this._process('warn', ...options);
    }

    /**
     * Returns a list of the specified event type.
     * @param eventType Event type to return.
     */
    list = (eventType?: string): EventLog[] => {
        const searchParams: SearchEventSpecifier = {
            groupName: this._groupName,
        };

        if (eventType) {
            searchParams.eventType = eventType;
        }

        return this._handlers.search(searchParams);
    }

    /**
     * Removes logs from stack for this group.
     * @param eventType optional event type to be removed.
     */
    clear = (eventType?: string) => {
        const searchParams: SearchEventSpecifier = {
            groupName: this._groupName,
        };

        if (eventType) {
            searchParams.eventType = eventType;
        }

        return this._handlers.remove(searchParams);
    }
}
