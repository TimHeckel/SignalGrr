SignalGrr
=========

A SignalR server that allows hubs to be defined purely in client-side javascript. This is now available at Appharbor, just create a $.hubConnection("http(s)://signalgrr.apphb.com"). See below for a full example.

This code is 100% due to the hard work of David Fowler, who provided me with the [original sample code](https://github.com/davidfowl/SignalR.Relay).

I updated the code to reflect the latest SignalR (1.0.0 as of this writing) and because I wanted to host it on [AppHarbor](http://appharbor.com) as a simple SignalR hub for some other projects I'm working on.

Now you can spin up new SignalR client-side hubs as easily as this:

```
$(function () {
  var connection = $.hubConnection("http://signalgrr.apphb.com"),
    chat = connection.createProxy('chat');

    chat.on('foo', function (n) {
        console.log(n);
    });

    connection.start().done(function () {
        chat.invoke('foo', "If Jimmy Chitwood transfers to Terhune, we don't have a prayer this year");
    });
});
```