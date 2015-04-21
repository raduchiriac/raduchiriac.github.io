---
layout: post
title: "Socket.io & AngularJS for Gestured IM"
date: 2014-10-02
backgrounds:
    - http://avocaventures.com/wp-content/uploads/2014/11/lines-of-code.jpg
    - http://www.branded3.com/uploads/2014/08/503944255.jpg
thumb: /assets/img/content/gesture.jpg
categories: web development
comments: true
tags: socket.io angularjs $1recognize
---
Let’s see how I tried to reinvent the old instant messaging that we all know, and transform it into a fun game. The idea I had is to transform the words into gestures that you draw on the screen of your device and communicate it to the others. The game consists into challenging everyone in the *“room”* to draw the same thing and as fast as they can, and to earn points.

This is a small project I developed while I was working full time for [kokmoka.com](http://kokmoka.com){:target="_blank"}, a web agency in Paris. Finally I ended up presenting it on a *lightning talk* during an AngularJS meetup.

#### Some basic stuff to beginning with

The easiest way to do it for me was, by utilising Node.js. We obviously need to install some dependencies (packages) on the server and on the client, as well.

> We will use `NPM` for the server side and `bower` for the client. Keep in mind that `bower` is a NPM package by itself and needs to be installed beforehand. Let’s begin by cloning the repository on our local machine with:
`git clone https://github.com/raduchiriac/lightning-gestures lightninggestures` followed by a `cd lightninggestures`. Currently the wording is mainly in French, unfortunatelly for you English readers.

The file `package.json` is already there, meaning we can start downloading the server dependencies right away with `npm install`. If you don’t see anything when you do `bower -v`, proceed with `npm install -g bower` or otherwise just do a `bower install` to finally grab the client side libraries, too.

#### But how does it work?

This instant messaging became fast the purpose of a game where you have only 10 seconds to draw the figure that the server asks. If you are fast enough, you will earn points based on your speed. Like any other silly game, the more you play the better you get.

Every session has a shape that gets sent to every client connected. There is no database and the scores are held in an Array by the server. Every client has a copy of that Array, too.

<p style="text-align:center;">
<img src="/assets/img/content/geste1.jpg" alt="Geste1" title="Shape drawing" style="max-width: 200px;display:inline-block;">&nbsp;
<img src="/assets/img/content/geste2.jpg" alt="Geste2" title="User profile" style="max-width: 200px;display:inline-block;">
</p>

#### Server side

I used **Socket.io** to communicate between the server and the clients. If you open `models/stopwatch.js`, you will see the file that deals with the timing and synchronisation of all the clients. It emits via `models/stopwatch_config.js` all sorts of events like *“new session”*, *“session ended”*, the remaining time of each session and so on. `stopwatch_config.js` treats all these events.

{% highlight javascript %}
// GETTING THE FIGURE’S NAME FROM THE ARRAY
this.sessionDrawing = this.sessions[Math.floor(Math.random() * this.sessions.length)];
this.sessionTimestamp = new Date().getTime();
this.interval = setInterval(this.onTick, this.second);

// READY, SET, GO !
this.emit('stopwatch:start', {
    'time': this.formatTime(this.duration),
    'drawing': this.sessionDrawing,
    'translation': this.translations[localsessionDrawing],
});
{% endhighlight %}

#### Client side

We don’t really need a MV* framework, but I created some directives and services with **AngularJS** to communicate back to the server and to manipulate the DOM. For our purpose, a single service `public/js/services.js` is enough to listen all the events and call the callback function with a `$scope.$apply()`.

The brain of our game is the library that’s in charge of the recognition of the clients’ drawings on the screen. I used **$1 Unistroke Recognizer** made inside the University of Washington by some clever people. Checkout [depts.washington.edu/aimgroup/proj/dollar/](https://depts.washington.edu/aimgroup/proj/dollar/){:target="_blank"} for more details.

If I understood it properly, this library compares an Array of points sent from the browser with some stock shapes that are already in the library you download. Their shapes/figures are the ones I used too; didn’t bothered to change them. I think there is a way to push your own shapes as Arrays of points, but I am unable to tell you exactly how.

The points’ coordinates are took from the `<canvas>` that fills the entire screen and are stored in this Array on every `touchmove` event. The inquiry is sent to **$1** on the `touchend` event. The `draw` directive can be found in `public/js/directives.js`

{% highlight javascript %}
var result = _r.Recognize(_points);

var drawing = result.Name,
  precision = Math.round(result.Score * 100);
scope.sendMessage(drawing, precision);
{% endhighlight %}

The result from **$1** is sent back to the server who determines if the gesture and the drawing corresponds with the one from the current session. If that’s the case, the server works out the score and broadcasts it to everyone.

{% highlight javascript %}
var timestamp = new Date().getTime(),
  session = stopwatch.getSession(),
  calculated_score = (stopwatch.getDuration() - (timestamp - session.time)) / 1000;

user.score += calculated_score;

if (session.drawing.toLowerCase() == data.drawing) {
  socket.broadcast.emit('send:message', {
    user: user,
    text: data.drawing
  });
  socket.broadcast.emit('set:score', {
    name: name,
    score: user.score,
  });
  fn(true, user.score);
} else {
  fn(false);
}
{% endhighlight %}

#### Give me a tip

How to use an AngularJS filter to show the right position in the users’ score table that is ordered by a property of an Object?

The users are mere Objects that hold their *name* and the *score*: `{name: 'John', score: 50}`. Like you can see in the file `views/index.jade`, the users are ordered by their property of *score*: `li.list-group-item(ng-repeat="user in users | orderBy:'score':true”)`.

After every correct drawing, the servers broadcasts the score but it’s on every client that we have to calculate the right position in the users’ collection. AngularJS has a powerful function `$filter()` to do precisely that kind of job. We use `indexOf()` to find out the index of the desired Object in the newly ordered Array.

{% highlight javascript %}
var ordoredUsers = $filter('orderBy')($scope.users, '-score');
var filterusers = $filter('filter')($scope.users, {
    name: $scope.name
})[0];
$scope.position = ordoredUsers.indexOf(filterusers) + 1;
{% endhighlight %}

#### To conclude

One of the enhancement I would like to add is hopefully the option for anyone to create “*rooms*” where an admin will also insert custom shapes and figures besides the ones **$1** already understands. I will be more than happy to see someone interested in helping me doing that; a PR is more than welcomed. I simply cannot find the time to continue this project anymore.

For geeks, here is again the public repository:
[github.com/raduchiriac/lightning-gestures](https://github.com/raduchiriac/lightning-gestures){:target="_blank"}

Enjoy fast drawing shapes on the screen!
