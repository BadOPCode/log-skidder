import { Expect, Test, TestFixture, Setup } from "alsatian";

import { LogSkidder } from "../src/LogSkidder";

@TestFixture("LogManager")
export class FixtureLogManager {
    @Test('List should return managers events')
    public testListEvents() {
        const skid = new LogSkidder();
        skid.hookConsoleMethods();
        console.log('undefined message');
        const mgr = skid.Attach('tester');
        mgr.log('mgr message');
        Expect(mgr.list().length).toBe(1);
        Expect(skid.handlers.search({}).length).toBe(2);
        Expect(mgr.list('error').length).toBe(0);
    }
}
