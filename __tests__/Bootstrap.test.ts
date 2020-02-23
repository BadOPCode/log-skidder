import { Expect, Test, TestFixture, Setup, Teardown } from "alsatian";
import { LogSkidder } from "../src/LogSkidder";

@TestFixture('Bootstrap')
export class FixtureBootstrap {

    @Teardown
    public teardownModuleCache() {
        const name = require.resolve("../src/index");
        delete require.cache[name];
    }

    @Test('Node should return a new LogSkidder')
    public async testNodeBoot() {
        delete global.window;
        import("../src/index").then((boot) => {
            Expect(boot).toBeDefined();
            Expect(boot.default.original).toBeDefined();
        });
    }

    @Test('Browser should return a new LogSkidder when not already loaded')
    public async testBrowserFreshBoot() {
        global.window = {};
        import('../src/index').then((boot) => {
            Expect(global.window.LogSkidder).toBeDefined();
        });
    }

    @Test('Browser should return a existing LogSkidder if already defined')
    public async testBrowserStaleBoot() {
        global.window = {
            LogSkidder: "dummy results"
        };
        import('../src/index').then((boot) => {
            Expect(boot.default).toBe("dummy results");
        });
    }
}
