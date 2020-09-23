import { ConsoleMethod, LogEventHandler, EventLog, SearchEventSpecifier } from "./LogSkidder.types";

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

    /**
     * Add a new handler to the handlers stack.
     * @param newHandler
     */
    add = (newHandler: LogEventHandler) => {
        this._handlerStack.push(newHandler);
    }

    /**
     * Add an event to the log stack and run it through the handler stack.
     * @param incomingEvent
     */
    process = (incomingEvent: EventLog) => {
        this._eventStack.push(incomingEvent);
        this._handlerStack.forEach((handler:LogEventHandler) => {
            handler(incomingEvent);
        });
    }

    /**
     * This method returns a list of log objects based on the specifier used.
     * @param searchSpecifier Specifier object of what should be listed.
     */
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

    /**
     * Method to remove specified events from the log stack.
     * @param removeSpecifier Specifier object of what to remove.
     */
    remove = (removeSpecifier: SearchEventSpecifier) => {
        this._eventStack = this._eventStack.filter((event:EventLog) => {
            if (removeSpecifier.groupName) {
                if (event.groupName !== removeSpecifier.groupName) {
                    return true;
                }
            }

            if (removeSpecifier.eventType) {
                if (event.eventType !== removeSpecifier.eventType) {
                    return true;
                }
            }

            return false;
        });
    }
}