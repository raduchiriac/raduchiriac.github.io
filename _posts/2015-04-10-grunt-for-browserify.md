---
layout: post
title: "Grunt for Browserify"
date: 2015-04-10
backgrounds:
    - https://dl.dropboxusercontent.com/u/18322837/cdn/Streetwill/code-screen.jpg
    - http://www.branded3.com/uploads/2014/08/503944255.jpg
    - http://avocaventures.com/wp-content/uploads/2014/11/lines-of-code.jpg
thumb: /assets/img/content/grunt.jpg
comments: true
categories: web development
tags: nodejs grunt browserify watchify
author: Radu Chiriac
---

If you - like me, like to use Browserify to speedup the process of developing your web apps, you will very soon feel the need of any sort of tasks that can lead you to a more continuous development ecosystem. Let’s begin.

#### Why Browserify?

Browserify lets you write code for the browser as you would write it in Node.js. Every time you would like to use a NPM package you would do a simple `npm install awesome_package` followed by a `var awesome = require('awesome_package')`. Good news, you can now agnostically use `require()` with Browserify, which will take care of bundling your files, dependency injections and caching.

> You can even create your own modules that you will `require()` in the same way as you would with a package. When you load a module, make sure you start its path by either a `../` or `./` without adding the `.js` extension. `require('data/module1.js');` is wrong, as it will look for a NPM package named *data*.The way to do it is `require('./data/module');`

#### Grunt to the rescue

As more and more peers say “*Hello Gulp, it’s nice to meet you!*”, we will still use Grunt for the time being. Grunt is a task runner that effortlessly lets you automate your pain in the _ss jobs. Before you continue make sure you read this page [http://gruntjs.com/getting-started](http://gruntjs.com/getting-started), where you will learn how to install the *command line interface*, create a `Gruntfile.js` and add a *gruntplugin*.

#### Where are my gruntplugins?

Gruntplugins are half community half official NPM packages that take care of the most common tasks such as: minification, compilation, unit testing, linting. Official packages have the word *contrib* in their name.

In our development process we need at least: Browserify to watch for file changes, bundle all into one big JS file and run a live reloading server. To do that we need to install the followings:

{% highlight perl %}
npm install grunt-browserify grunt-contrib-connect grunt-contrib-watch --save-dev
{% endhighlight %}

#### Source

Lets take a look at the final Gruntfile.js

{% highlight javascript %}
module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      dev: {
        src: 'src/js/main.js',
        dest: 'dist/js/main.bundle.js',
        options: {
          browserifyOptions: {
            debug: true
          }
        }
      }
    },
    watch: {
      dev: {
        files: ['src/js/**/*.js', 'dist/*.html'],
        tasks: ['browserify'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      dev: {
        options: {
          port: 8080,
          base: './dist',
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(require('connect-livereload')());
            return middlewares;
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('serve', ['browserify:dev', 'connect:dev', 'watch:dev']);
};
{% endhighlight %}

`grunt.loadNpmTasks()` loads the above installed gruntplugins and `grunt.registerTask()` creates our task (giving it the alias *serve*). You can even pass parameters to the task as in our case *dev*. Imagine you would have multiple configuration in your *Gruntfile.js* for production and development where in production you would set the `browserifyOptions { debug: false }` for exemple.

> `debug` creates the *sourcemap* for your bundled JS.

`connect` task with `connect-livereload` package creates a server and uses live reload by creating a mirror server on a different port. Your HTTP server will have it’s base in the *dist/* folder.

We are finally ready to run our Gruntfile main task. Go to your terminal and type `grunt serve`. Your web app is currently running port 8080, files were just being bundled and are currently watched for updates. Live reload acts as a middleware  and the browser will automagically reload with the new files.

#### Until next time

As a very proud Meteor developer, I find this kind of development very challenging and time consuming; but once you get pass the boilerplate phase, Grunt can be a lot of fun. I personally like the amount of debug information Grunt tasks give you compared to Meteor. Even if the latter has everything of the above amazingly packed inside the box, it’s often complicated to trace bugs in Meteor if you were to read the terminal output only.

Long live well-written NPM packages!
