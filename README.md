# oauth-example
This is an example on how to use the onetune.fm OAuth API for creating apps. It is written in node.js but you can use any language you want. 

## 1. Creating an app.
I'm going to http://new.onetune.fm/developers and create a new app. I'm going to name it "Emoji playlist", because it will let the user choose a emoji and create a playlist accordingly. I also added a short slogan and specified a redirect URL. Instead of 'localhost', you have to use '127.0.0.1', because localhost does not pass the validator. For your production site, create a seperate app.

![Creating an app](http://i.imgur.com/hKxm0M9.png)

## 2. Getting the client_id and client_secret
The app now appears on the left. Click 'Show credentials' to make the client_id and client_secret appear. For me, it looks like this:

![App details](http://i.imgur.com/fJ2dRPR.png)

We will use these values later!
