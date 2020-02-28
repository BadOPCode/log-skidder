import { LogSkidder } from "./LogSkidder";

declare global {
    interface Window {
        LogSkidder: LogSkidder;
    }
}

const isNodeJS = typeof window !== 'object';
let logSkidder: LogSkidder;

if(isNodeJS) {
   logSkidder = new LogSkidder();
   logSkidder.hookConsoleMethods();
} else {
    if (!window.LogSkidder) {
        window.LogSkidder = new LogSkidder();
        window.LogSkidder.hookConsoleMethods();
    }

    logSkidder = window.LogSkidder;
}

export default logSkidder;