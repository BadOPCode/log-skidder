import { Expect, Test, TestFixture, Setup } from "alsatian";

import { LogSkidder } from "../src/LogSkidder";

@TestFixture("LogManager")
export class FixtureLogManager {
    @Test('List should return managers events')
    public testListEvents() {
        const skid = new LogSkidder();
        skid.hookConsoleMethods();
        console.log('undefined message');
        const mgr = skid.group('tester');
        mgr.log('mgr message');
        Expect(mgr.list().length).toBe(1);
        Expect(skid.handlers.search({}).length).toBe(2);
        Expect(mgr.list('error').length).toBe(0);
    }

    @Test('Put should set a non-predefined event type')
    public testPutEvent() {
        const skid = new LogSkidder();
        const mgr = skid.group('test');
        mgr.put('custom', ['testing']);
        const list = mgr.list('custom');
        Expect(list.length).toBe(1);
        Expect(list[0].eventType).toBe('custom');
    }

    @Test('Clear should remove events from group')
    public testClearEvent() {
        const skid = new LogSkidder();
        const mgr = skid.group('test');
        mgr.put('custom', ['testing']);
        mgr.log('another test');
        mgr.clear();
        let list = mgr.list();
        Expect(list.length).toBe(0);

        mgr.log('test 1');
        mgr.error('test 2');
        mgr.warn('test 3');
        mgr.clear('log');
        list = mgr.list();
        Expect(list.length).toBe(2);
    }
}
