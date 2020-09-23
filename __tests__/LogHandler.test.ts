import { Expect, Test, TestFixture, Setup } from "alsatian";

import { LogHandler } from "../src/LogHandler";
import { EventLog } from "../src/types/LogSkidder";

@TestFixture('LogHandler')
export class FixtureLogHandler {

    @Test('Should add a handler to the stack')
    public testHandlerAdd() {
        let x: number = 0;
        const handler: LogHandler = new LogHandler();
        const dumHandler = (newEvent: EventLog) => {
            x++;
        };

        Expect(handler.handlers).toBeEmpty();
        handler.add(dumHandler);
        Expect(handler.handlers).not.toBeEmpty();
    }

    @Test('Processor should run handler')
    public testProcess() {
        let x: number = 0;
        const handler: LogHandler = new LogHandler();
        const dumHandler = (newEvent: EventLog) => {
            x++;
        };

        handler.add(dumHandler);
        handler.process({
            groupName: "undefined",
            eventType: "log",
            data: [ "test" ],
            timestamp: new Date(),
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
            groupName: "undefined",
            eventType: "log",
            data: [ "test" ],
            timestamp: new Date(),
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

        // should return empty when groupName doesn't exist
        searchResults = handler.search({groupName:"tester"});
        Expect(searchResults).toBeEmpty();

        // should return list when event type has happened
        searchResults = handler.search({groupName:"undefined"});
        Expect(searchResults).not.toBeEmpty();
    }

    @Test('remove should only remove matching events')
    public testRemoveEvents() {
        const handler = new LogHandler();
        handler.process({
            groupName: "undefined",
            eventType: "log",
            data: [ "test" ],
            timestamp: new Date(),
        });

        handler.process({
            groupName: "undefined",
            eventType: "error",
            data: [ "test" ],
            timestamp: new Date(),
        });

        handler.process({
            groupName: "tester",
            eventType: "warn",
            data: [ "test" ],
            timestamp: new Date(),
        });

        handler.remove({eventType:'log'});
        let list = handler.search({});
        Expect(list.length).toBe(2);
        Expect(list[0].eventType).toBe('error');

        handler.remove({groupName: 'undefined'});
        list = handler.search({});
        Expect(list.length).toBe(1);
        Expect(list[0].groupName).toBe('tester');

        handler.remove({groupName:'tester', eventType:'warn'});
        list = handler.search({});
        Expect(list.length).toBe(0);
    }
}