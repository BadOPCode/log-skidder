export type ConsoleMethod = (...options:any[]) => void;

export interface ConsoleWriter {
    error: ConsoleMethod;
    log: ConsoleMethod;
    warn: ConsoleMethod;
}

export interface EventLog {
    appName: string;
    eventType: string;
    data: any[];
}

export type LogEventHandler = (newEvent: EventLog) => void;

export interface SearchEventSpecifier {
    appName?: string;
    eventType?: string;
}
