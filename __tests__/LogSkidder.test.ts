import { Expect, Test, TestFixture, SpyOn } from "alsatian";

import { LogSkidder } from '../src/LogSkidder';

@TestFixture("LogSkidder")
export class FixtureLogSkidder {
    public skidder = new LogSkidder();

    @Test("Check if original object has been defined")
    public testOriginal() {
        Expect(this.skidder.original).toBeDefined();
    }

    @Test("If manager is not recognized it passes a new one")
    public testUndefManagers() {
        const undef = this.skidder.group('undefined');
        const newGroup = this.skidder.group('test');
        Expect(newGroup).toBeDefined();
        Expect(newGroup).not.toBe(undef);
    }

    @Test("Method group should interact with registered managers")
    public testManagers() {
        const undef = this.skidder.group('undefined');
        Expect(undef).toBeDefined();
        const testHnd = this.skidder.group('test');
        Expect(testHnd).toBeDefined();

        Expect(testHnd).not.toEqual(undef);
        testHnd.log('Hello World');
        const cmpHnd = this.skidder.group('test');
        Expect(testHnd.list()).toEqual(cmpHnd.list());
    }

    @Test("Test console hook")
    public testHook() {
        const undefMgr = this.skidder.group("undefined");
        SpyOn(undefMgr, "error");
        SpyOn(undefMgr, "log");
        SpyOn(undefMgr, "warn");
        Expect(console.log).not.toEqual(undefMgr.log);
        this.skidder.hookConsoleMethods();
        Expect(console.log).toEqual(undefMgr.log);
        console.error("test");
        Expect(undefMgr.error).toHaveBeenCalled();
        console.log("test");
        Expect(undefMgr.log).toHaveBeenCalled();
        console.warn("test");
        Expect(undefMgr.warn).toHaveBeenCalled();
        this.skidder.unhookConsoleMethods();
        Expect(console.log).not.toEqual(undefMgr.log);
        Expect(console.log).toEqual(this.skidder.original.log);
    }

    @Test("Method search should call handlers search.")
    public testSearch() {
        SpyOn(this.skidder.handlers, "search");
        this.skidder.search({});
        Expect(this.skidder.handlers.search).toHaveBeenCalled();
    }

    @Test("Method remove should call handlers remove.")
    public testRemove() {
        SpyOn(this.skidder.handlers, "remove");
        this.skidder.remove({});
        Expect(this.skidder.handlers.remove).toHaveBeenCalled();
    }

    @Test("Store method should call process")
    public testStore() {
        SpyOn(this.skidder.handlers, "process");
        this.skidder.remove({});
        this.skidder.store({
            eventType: 'test',
            groupName: 'tester',
            timestamp: new Date(),
            data: [ 'hello world' ]
        });
        Expect(this.skidder.handlers.process).toHaveBeenCalled();
        Expect(this.skidder.search({eventType: 'test'}).length).toBe(1);
    }
}