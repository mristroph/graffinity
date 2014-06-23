graffinity
==========

Graffinity is an open &amp; infinite canvas. It's for all, by all, shared in real-time.

# Running Locally

You'll need mongodb installed...
``` bash
npm install
mongod --dbpath /tmp &
foreman start
```

Then open a couple of windows and hit up localhost:5000!



# Game Plan

* basic drawing app (DONE)
* synced canvas -- everyone sees everyone elses stuff (DONE)
* persistance -- save all strokes, and load the entire history to each new session (DONE)

* infinity -- add scrolling, make the canvas infinite. lazy load stuff
* everyone in the world can draw together in one, open and infinite canvas
* everyone comes togerther
* world peace <3
