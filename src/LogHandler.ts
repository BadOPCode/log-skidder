import { ConsoleMethod, LogEventHandler, EventLog, SearchEventSpecifier } from "./types/LogSkidder";

/**
 * @class LogHandler
 * @description Keeps a list of handlers to be called when a event is triggered.
 *      Stores the events and provides means of parsing.
 */
export class LogHandler {
    private _handlers: LogEventHandler[] = [];
    private _eventStack: EventLog[] = [];

    get handlers() {
        return this._handlers;
    }

    addHandler = (newHandler: LogEventHandler) => {
        this._handlers.push(newHandler);
    }

    process = (incomingEvent: EventLog) => {
        this._eventStack.push(incomingEvent);
        this._handlers.forEach((handler:LogEventHandler) => {
            handler(incomingEvent);
        });
    }

    search = (searchSpecifier: SearchEventSpecifier) => {
        return this._eventStack.filter((event:EventLog) => {
            if (searchSpecifier.appName) {
                if (event.appName !== searchSpecifier.appName) {
                    return false;
                }
            }

            if (searchSpecifier.eventType) {
                if (event.eventType !== searchSpecifier.eventType) {
                    return false;
                }
            }

            return true;
        });
    }
}