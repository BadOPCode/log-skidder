export type ConsoleMethod = (...options:any[]) => void;

export interface ConsoleWriter {
    error: ConsoleMethod;
    log: ConsoleMethod;
    warn: ConsoleMethod;
}

export interface EventLog {
    groupName: string;
    eventType: string;
    timestamp: Date;
    data: any[];
}

export type LogEventHandler = (newEvent: EventLog) => void;

export interface SearchEventSpecifier {
    groupName?: string;
    eventType?: string;
}
