---
layout: post
title: "Frequency Based Side-chain"
date: 2015-05-03
backgrounds:
    - http://www.pulsarmedia.eu/data/media/843/Ableton%20Live%20Screen%20Wallpaper.jpg
    - http://www.ableton-live-expert.com/wp-content/uploads/2014/04/IMG_0638.jpg
thumb: /assets/img/content/trans.jpg
comments: true
categories: music
share: true
tags: trackspacer ableton live routing
grid: 100
---

Let’s talk about my new favorite way of side-chaining. When you think about side-chaining you instinctively have a compressor in mind, but what if we would side-chain using a given range of frequencies? Think about how a *de-esser* works - processing is only applied on high-frequencies between `4kHz-9kHz` and only on specific consonants.

#### Side what?

Side-chaining often uses a compressor as its main audio input to detect the signal’s volume level, apply that to the gain reduction that will finally reduce the output’s volume after applying a ratio. One common use is in the radio where the microphone’s signal is routed to the side-chain’s input so that whenever someone speaks, the compressor would catch the volume and lower the background music, so that the two won’t clash.

But all that is based on pure signal volume level; let’s see how frequencies come into place to help us be more precise.

#### What’s your frequency?

One of the most underrated plug-ins I know is **TrackSpacer**. Download the demo from here [www.wavesfactory.com/trackspacer.php](http://www.wavesfactory.com/trackspacer.php){:target="_blank"}. We will use that to apply the inverted frequency curve of a given track that presumedly needs to stand out more, to another track. In our case, we will do the classical separation of the *Bass drum* and the *Bass*. They always tend to fight in a dance music track and as you know, it’s always the *Kick* who wins.

We will be using **Ableton Live** as our DAW of choice, but only because it’s a bit more complicated to get it to work in there. You will see that in the end, it’s just a matter of duplicating the right channel followed by proper routing.

This is how our *Arrangement View* looks like:

![Arrangement view](/assets/img/content/trans1.jpg)

This is the unprocessed audio loop of the two channels playing together. Even though it’s only a `128kbps` file, you can hear that when the *Kick* comes in halfway through, there’s a certain clash noticeable on the lower frequencies. (headphones on please).

<audio controls>
  <source src="/assets/img/content/trans1.mp3" type="audio/mpeg">
  Your browser does not support the audio playback.
</audio>

*Bass drum* vs. *Bass*: Only one should win.

#### Master and Servant

First of, you need to identify who is going to be the main channel and who is going to be the slave. Who’s gonna hit very hard and who is gonna duck?

**Step 1.** Duplicate the channel where your *Kick* sits.

![Kick duplication](/assets/img/content/trans2.jpg)

**Step 2.** Add **TrackSpacer** to the *Bass* channel.

**Step 3.** On the duplicated channel route the *Audio Out* to the Bass and choose channels 3/4 for your *External Inputs* like in the image below.

![Kick routing](/assets/img/content/trans3.gif)

**Step 4.** Open up **TrackSpacer** and see how the frequencies and the transients of our *Kick* have an impact on the *Bass*. Play with the knobs - it’s an order.

![TrackSpacer curve](/assets/img/content/trans4.jpg)

Since our source is a *Bass drum*, I set the *high-pass filter* at around `80Hz` and the *low-pass filter* to `20Hz`; so we can safely ignore everything above `80-100Hz`. Do play with these and especially with the *ratio* knob, which is nothing more than the amount of the curve to be applied.

#### To conclude

For fun, I added an *Equaliser* after **TrackSpacer** to have a visual representation of how the plug-in works. This is a *"without and with the side-chain"* animation. You can clearly see how the volume of the lower frequencies ducks for a fair amount once I activate **TrackSpacer**.

![Equaliser's spectrum](/assets/img/content/trans5.gif)

Check out the final audio file as well and compare. The *Bass drum* has its onw place and it no longer clashing with anything. He was actually fighthing before but now he won, by cheating.

<audio controls>
  <source src="/assets/img/content/trans2.mp3" type="audio/mpeg">
  Your browser does not support the audio playback.
</audio>

I tend to use this plug-in a lot these days (even on vocals agains percussions), which makes all of my Live sessions very messy because of all the duplicated channels; but if it sounds better, I can handle mess very well.
