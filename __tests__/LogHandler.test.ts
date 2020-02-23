import { Expect, Test, TestFixture, Setup } from "alsatian";

import { LogHandler } from "../src/LogHandler";
import { EventLog } from "../src/types/LogSkidder";

@TestFixture('LogHandler')
export class FixtureLogHandler {

    @Test('Should add a handler to the stack')
    public testAddHandler() {
        let x: number = 0;
        const handler: LogHandler = new LogHandler();
        const dumHandler = (newEvent: EventLog) => {
            x++;
        };

        Expect(handler.handlers).toBeEmpty();
        handler.addHandler(dumHandler);
        Expect(handler.handlers).not.toBeEmpty();
    }

    @Test('Processor should run handler')
    public testProcess() {
        let x: number = 0;
        const handler: LogHandler = new LogHandler();
        const dumHandler = (newEvent: EventLog) => {
            x++;
        };

        handler.addHandler(dumHandler);
        handler.process({
            appName: "undefined",
            eventType: "log",
            data: [ "test" ]
        });
        Expect(x).toBe(1);
    }

    @Test('search should return the processed event')
    public testSearchEvents() {
        const handler: LogHandler = new LogHandler();

        // should be empty because no event happened
        let searchResults = handler.search({});
        Expect(searchResults).toBeEmpty();

        handler.process({
            appName: "undefined",
            eventType: "log",
            data: [ "test" ]
        });

        // should return all events with empty specifier
        searchResults = handler.search({});
        Expect(searchResults).not.toBeEmpty();

        // should return empty when event type hasn't happened
        searchResults = handler.search({eventType:"error"});
        Expect(searchResults).toBeEmpty();

        // should return list when event type has happened
        searchResults = handler.search({eventType:"log"});
        Expect(searchResults).not.toBeEmpty();

        // should return empty when appName doesn't exist
        searchResults = handler.search({appName:"tester"});
        Expect(searchResults).toBeEmpty();

        // should return list when event type has happened
        searchResults = handler.search({appName:"undefined"});
        Expect(searchResults).not.toBeEmpty();
    }
}