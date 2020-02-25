import { ConsoleMethod, LogEventHandler, EventLog, SearchEventSpecifier } from "./types/LogSkidder";

/**
 * @class LogHandler
 * @description Keeps a list of handlers to be called when a event is triggered.
 *      Stores the events and provides means of parsing.
 */
export class LogHandler {
    private _handlerStack: LogEventHandler[] = [];
    private _eventStack: EventLog[] = [];

    get handlers() {
        return this._handlerStack;
    }

    add = (newHandler: LogEventHandler) => {
        this._handlerStack.push(newHandler);
    }

    process = (incomingEvent: EventLog) => {
        this._eventStack.push(incomingEvent);
        this._handlerStack.forEach((handler:LogEventHandler) => {
            handler(incomingEvent);
        });
    }

    search = (searchSpecifier: SearchEventSpecifier) => {
        return this._eventStack.filter((event:EventLog) => {
            if (searchSpecifier.groupName) {
                if (event.groupName !== searchSpecifier.groupName) {
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