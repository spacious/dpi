
# Android HAPI SDK

## Version 1.3

Download the official Android ICE SDK to build apps for Android phones, tablets, wearables, TVs, and more.

## Installation

Everything you need to get started with the Android SDK, and everything you need to know about installing it.

## Quickstart

```java
    GitHubClient client = new GitHubClient().setCredentials("user", "p4ssw0rd");
    Gist gist = new Gist().setDescription("Prints a string to standard out");
    GistFile file = new GistFile().setContent("System.out.println(\"Hello World\");");
    gist.setFiles(Collections.singletonMap("Hello.java", file));
    gist = new GistService(client).createGist(gist);
```
## API

## Event Intent

If all you want to do is add an event to the user's calendar, you can use an `ACTION_INSERT` intent with the data defined by Events.
`CONTENT_URI` in order to start an activity in the Calendar app that creates new events.
Using the intent does not require any permission and you can specify event details with the following extras:

- `Events.TITLE`: Name for the event
- `CalendarContract.EXTRA_EVENT_BEGIN_TIME`: Event begin time in milliseconds from the epoch
- `CalendarContract.EXTRA_EVENT_END_TIME`: Event end time in milliseconds from the epoch
- `Events.EVENT_LOCATION`: Location of the event
- `Events.DESCRIPTION`: Event description
- `Intent.EXTRA_EMAIL`: Email addresses of those to invite
- `Events.RRULE`: The recurrence rule for the event
- `Events.ACCESS_LEVEL`: Whether the event is private or public
- `Events.AVAILABILITY`: Whether the time period of this event allows for other events to be scheduled at the same time

### Devices

![RTL](/images/jb-rtl-arabic-n4.png)