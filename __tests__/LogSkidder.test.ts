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
        Expect(console.log).not.toEqual(this.skidder.logConsoleHandler);
        this.skidder.hookConsoleMethods();
        Expect(console.log).toEqual(this.skidder.logConsoleHandler);
    }

    @Test("console handlers should call the undefined manager")
    public testConsoleHandler() {
        SpyOn(this.skidder.Manager("undefined"), "error");
        SpyOn(this.skidder.Manager("undefined"), "log");
        SpyOn(this.skidder.Manager("undefined"), "warn");
        this.skidder.errorConsoleHandler("test");
        Expect(this.skidder.Manager("undefined").error).toHaveBeenCalled();
        this.skidder.logConsoleHandler("test");
        Expect(this.skidder.Manager("undefined").log).toHaveBeenCalled();
        this.skidder.warnConsoleHandler("test");
        Expect(this.skidder.Manager("undefined").warn).toHaveBeenCalled();
    }
}