---
layout: post
title: "Meteor Route Authorizations"
date: 2015-04-12
backgrounds:
    - http://www.branded3.com/uploads/2014/08/503944255.jpg
    - http://avocaventures.com/wp-content/uploads/2014/11/lines-of-code.jpg
thumb: /assets/img/content/meteor-routing.jpg
categories: web development
tags: meteor iron-router roles
comments: true
---

Let’s dive into a probably very common issue of any big Meteor application. Once your website’s structure grows, you will need to create some kind of secured routes for your admin interface, logs, stats and so on.

I will skip the blathering about how awesome Meteor is, or how easy it is to start a very complex web application within minutes with Meteor. I will also try not to waste your time by telling you what Meteor packages are, and how to install them. If you want to learn the basics of Meteor you should definitely checkout this tutorial beforehand: [www.meteor.com/install](https://www.meteor.com/install){:target="_blank"}. Any other “Hello World” tutorial on the web becomes irrelevant.

#### What’s the plan?

We will be trying to redirect any request from the `/admin` route to `/login` (where presumedly our sign in form will reside) if the user is not already logged in. Also anyone trying to hit `/login` while being already logged, will be redirected to a specific route based on his rights.

#### Smart Packages

We will need a couple of packages to do all of these. Let’s install `iron:router` and `alanning:roles`. As far as I know, there are not dozens of ways to do routing in Meteor and basically everyone goes for `iron:router`. Chances are your website already has it. This crawl [medium.com/meteor-secret/what-ive-found-after-scraping-1740-meteor-apps-99a20ac6d252#a653](https://medium.com/meteor-secret/what-ive-found-after-scraping-1740-meteor-apps-99a20ac6d252#a653){:target="_blank"} shows that `iron:router` is one of the most downloaded package. `alanning:roles` will take care of the rights of every one of your users.

To install these do `meteor add iron:router alanning:roles`.

#### Source

Meteor’s file structure is very flexible but one of the only rules is that, when you put files in the `/lib` folder, they will be loaded before anything else. It’s best to place there some of your *helpers*, *constants* or (in our case) *routes*.

<div class="filename">lib/routes.js</div>
{% highlight javascript %}
AdminController = RouteController.extend({
  onBeforeAction: function() {
    var loggedInUser = Meteor.userId(),
      isAdminPath = Router.current().url.indexOf('admin') >= 0;

    if (!!loggedInUser) {
      if (Roles.userIsInRole(loggedInUser, 'admin')) {
        if (!isAdminPath) {
          Router.go('admin');
          this.stop();
        }
      } else {
        Router.go('account');
        this.stop();
      }
    } else {
      if (isAdminPath) {
        Router.go('login');
        this.stop();
      }
    }
    this.next();
  }
});

Router.route('/admin', {
  name: 'admin',
  controller: AdminController
});
Router.route('/login', {
  name: 'login',
  controller: AdminController
});
{% endhighlight %}

You may ask, how to give *admin* roles to someone, so that the `Roles.userIsInRole()` returns `TRUE`? Well, you can hookup every creation of the users with a `Accounts.onCreateUser(function(options, user){});` and inside you should add something like `Roles.addUsersToRoles(user.userId, ['manager','admin']);`.

One thing that I like about `iron:router` is that it uses *controllers* which for me, are like reusable code all the way.

> `onBeforeAction` is - what they call a *hook* and it does exactly what it says on the tin. Any code or tests you need to make before the actual route action will find its place in there.

I think *controllers* are automatically stopped now with the new version of `iron:router` but I didn’t had the time to investigate. In that case `this.stop()` will become redundant.

The best thing about it is that this *controller* can secure any  of you future routes such as:

{% highlight javascript %}
Router.route('/admin/logs', {
  name: 'logs',
  controller: AdminController
});
{% endhighlight %}


#### To conclude

Before doing this I looked at how others were securing their routes and I found a pretty good solution which is `zimme:iron-router-auth`. I always think it’s better to (at least start by) doing your version of code so I was quite happy with mine and stuck to it. There is no point in saying how much I recommend that public package over to my code.

There is of course room for improvement in my *controller*. One of the main drawbacks of developing in Meteor is that everything you write just works and you kinda forget about how you write it. Often my code smells, but since it works from the first minutes, I am happy, forget about it and continue with my good writing flow.

I hope you feel more secure now in your own *admin interfaces*.
