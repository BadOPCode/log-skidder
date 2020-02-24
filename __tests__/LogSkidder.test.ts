import { Expect, Test, TestFixture, SpyOn } from "alsatian";

import { LogSkidder } from '../src/LogSkidder';

@TestFixture("LogSkidder")
export class FixtureLogSkidder {
    public skidder = new LogSkidder();

    @Test("Check if original object has been defined")
    public testOriginal() {
        Expect(this.skidder.original).toBeDefined();
    }

    @Test("If manager is not recognized it passes the undefined one")
    public testUndefManagers() {
        const undef = this.skidder.Manager('undefined');
        Expect(this.skidder.Manager('test')).toBe(undef);
    }

    @Test("Attach and Manage should interact with registered managers")
    public testManagers() {
        const undef = this.skidder.Manager('undefined');
        const testHnd = this.skidder.Attach('test');
        Expect(testHnd).toBeDefined();
        Expect(testHnd).not.toEqual(undef);
        const cmpHnd = this.skidder.Manager('test');
        Expect(testHnd).toEqual(cmpHnd);
    }

    @Test("Test console hook")
    public testHook() {
        const undefMgr = this.skidder.Manager("undefined");
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
    }
}