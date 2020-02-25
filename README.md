# Log Skidder

Log Skidder is a universal system for managing logging events and console output.

[![Build Status](https://travis-ci.org/BadOPCode/log-skidder.svg?branch=master)](https://travis-ci.org/BadOPCode/log-skidder)
[![Maintainability](https://api.codeclimate.com/v1/badges/c350ca6004d344744fa3/maintainability)](https://codeclimate.com/github/BadOPCode/log-skidder/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c350ca6004d344744fa3/test_coverage)](https://codeclimate.com/github/BadOPCode/log-skidder/test_coverage) [![Greenkeeper badge](https://badges.greenkeeper.io/BadOPCode/log-skidder.svg)](https://greenkeeper.io/)


## Description

Log Skidder is designed to be a isomorphic interface for Node JS or browser environments to manage logging.
In a browser multiple applications on a page can use Log Skidder and they will link to a single instance automatically. It provides a common interface for log handlers that are used with events in all applications linked.
It can also capture the console methods as well.  Meaning even apps that are not specifically written for Log Skidder can be caputered and managed.


## Installing

```npm i -D log-skidder```


## How To Implement

To implement into a project you just need to

```
import skid from 'log-skidder';
```

This will bootstrap the Log Skidder system and provide a LogSkidder object.

### LogSkidder Parameters and Methods
    - original: Object that stores the original console methods.
    - hookConsoleMethods(): This method will replace the console methods to the log manager undefined.
    - unhookConsoleMethods(): This will return the original native console methods.
    - group(): This method returns the log manager name specified.  If name is not found it will return a new log manager with the specified group.

In your application bootstrap you will want to make a log manager specifically for your application. To do so just add a line like bellow.

```
const logMgr = skid.group('My App');
```

### LogManager Parameters and Methods
    - error(): Method to use in the exact way you would use console.error
    - log(): Method to use in the exact way you would use console.log
    - warn(): Method to use in the exact way you would use console.warn
    - list(): Returns a list of events that matches the event type parameter specified.

With this log manager you can easily log events. Just use them exactly you would use the console counter parts.
```
logMgr.error("uh oh something broke.");
```
This will log an error for the "My App".  To get a list of errors enter the following.
```
logMgr.list('error');
```
If you want to see all logged events don't specify a type.
```
logMgr.list();
```


## Handlers

In order to make the logging more useful you can add handlers.  A handler is a callback that is ran when a new event of any type is triggered by any attached app.  The handler callback is passed the triggering event as a parameter.
The handler decides what it wants to do with the event given to it.  For example a handler could choose to send to remote logger any errors that come from a particular app name but ignore everything else.
Here is an example of adding a handler in Log Skidder.
```
skid.handlers.add(newEvent => {
    if (newEvent.eventType === 'error') {
        remoteLogger(newEvent);
    }
});
```
But if you want to list off all the events based off of either event type or app name you can do that via the method called search().  The search method takes a single object parameter.  This object can optionally specify either the groupName or the eventType, or both. For an example.
```
skid.search({
    groupName: "My App",
    eventType: "warn",
})

OR

skid.handlers.search({
    groupName: "My App",
    eventType: "warn",
});
```
This will return a list of all the warnings from "My App".  But you can list all events by writing...
```
skid.handlers.search({});
```


## Special Browser Information

If your using this module in your front-end project you can include it in your source if your using Typescript or Babel. Or you can include the module in the page directly. The file dist/log-skidder.js is browser safe.
When Log Skidder is loaded in a browser it will add a object named LogSkidder to the window object.  It can be used exactly like the source compiled one.