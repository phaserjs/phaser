# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## New Feature - Video Game Object

The Video Game Object has been fully recoded in v3.60. Previously, it had issues with RTC streams, switching tabs and preloading too many files at once. We took a good look at the state of video playback in browsers today and decided to re-write the Video Game Object from the ground up, using the new Request Video Frame API. This has resulted in a much more reliable and stable Video Game Object.

![Video Game Object](images/videogameobject.png)

* The Video Game Object now has a much better method of handling user-interaction unlocking. We can detect for input locking by seeing if the Play Promise fails. If it does, we use the `retryInterval` and then try to play the video again. This continues until input is unlocked. This can happen via a tap, click or key press. The Video Game Object itself never needs to listen for this, it just needs to wait for a success Play Promise resolution.
* Use the new `VIDEO_LOCKED` event to know if the video is playback locked due to needing input.
* Previously, the Video Game Object would use the `preUpdate` method to check how far along the video was and then update the source texture. This is now all handled by the Request Video Frame callback, which is only invoked when a video frame is ready. This makes the Video Game Object much more efficient as it will only ever update the source texture when a new frame is decoded by the browser.
* The `VideoFile` Loader File Type now does nothing more than inject a simple small object to the Video Cache. Previously, it would create a Video DOM Element, try to load it as a blob and all kinds of other things. This lead to lots of errors, especially when loading multiple videos at the same time (as the browser would run out of Video elements to use). Under v3.60 each Video Game Object is responsible for its own unique Video DOM element, allowing for much better control and reliability.
* The Loading and Playback callbacks have been split up properly. So the Video Game Object now only creates the loading ones during the load phase, then removes them again. This fixed a number of issues with the video restarting after a tab switch, for example.
* The new `VIDEO_PLAYING` event allows you to listen for the video playback and restarts, especially after lack of data.
* The new `VIDEO_STALLED` event allows you to know when the browser has stalled playback.
* The new `VIDEO_TEXTURE` event allows you to know when the Video Game Object has received its first frame data and created a texture from it.
* The new `VIDEO_UNSUPPORTED` event allows you to know when the Video Game Object has been asked to play a video file that the browser doesn't support (handy for testing if a browser can play WebM for example).
* `Video.loadURL` has a new optional parameter `crossOrigin`. This allows you to specify a cross origin request type when loading the video cross-domain (thanks @rmartell)
* The `Video` config will now detect for `x-m4v` playback support for video formats and store it in the `Video.m4v` property. This is used automatically by the `VideoFile` file loader. Fix #5719 (thanks @patrickkeenan)

## Video Game Object Breaking Changes

* There `loadEvent` parameter when loading a video has been removed.
* There 'asBlob' parameter when loading a video has been removed.

As a result, all methods in the Video class that previously had these in the parameters have been updated to remove them.

You also no longer need to specify them when loading a video:

```js
//  Previously you had to do this. Note the 5 paramters:
this.load.video('wormhole', 'wormhole.mp4', 'loadeddata', false, true);

//  Now, you just specify the key, URL and the 'noAudio' boolean:
this.load.video('wormhole', 'wormhole.mp4', true);
```

* `Video.retryInterval` has changed use. It's now the number of milliseconds to wait before retrying calling `video.play` (i.e. when polling for video unlock)
* `Video.retry` used to hold the current retry attempt. It now holds the elapsed delta time between playback attempts.
* `Video.retryLimit` has been removed.
* The `Video.loadMediaStream` method no longer has the `loadEvent` parameter, and has gained the optional `crossOrigin` parameter.
* The `Video.loadURL` method no longer has the `loadEvent` parameter. It can now also take an array of URLs as the first parameter.
* The `Video.play` method will now create a Request Video Frame callback and a Video.Play promise to handle load success and error.
* The `Video.playHandler` method has been removed.
* `Video.playingHandler` is a new method that specifically handles the `playing` event.
* `Video.legacyPlayHandler` is a new method that specifically handles the `playing` event for legacy browsers that don't support Promises.
* The `Video.saveTexture` method is now asynchronous. Listen for the new `VIDEO_TEXTURE` event to know when the video texture is ready.
* `Video.pause` is a new method that will pause a playing video.
* `Video.resume` is a new method that will resume a paused video.
* The `Video.timeUpdateHandler` method has been removed.
* The `Video.updateTextyre` method has been removed, this is now handled by the Request Animation Frame callback.
* The `VIDEO_TIMEOUT` event has been removed.
* The `Video.removeVideoElementOnDestroy` property has been removed. The Video Element is now always removed when the Video Game Object is destroyed.

### Video Game Object New Methods

* `Video.load` is a new method that loads a video from the Video Cache, ready for playback with the `Video.play` method.
* `Video.addLoadEventHandlers` is a new method that adds the loader specific event handlers to the video element.
* `Video.removeLoadEventHandlers` is a new method that removes the loader specific event handlers from the video element.
* `Video.addEventHandlers` is a new method that adds the playback specific event handlers to the video element.
* `Video.removeEventHandlers` is a new method that removes the playback specific event handlers to the video element.
* `Video.createPlayPromise` is a new method that creates a Promise that will resolve when the video is playing, or reject if it fails to play.
* `Video.playSuccess` is a new internal method that is called automatically if the playback Promise resolves.
* `Video.playError` is a new internal method that is called automatically if the playback Promise errors.
* `Video.stalledHandler` is a new method that is called if a video stalls, for whatever reason.

### Video Game Object New Properties

* `Video.frameReady` is a new property that lets you know if the texture has been created and populated with the first frame of the video, or not.
* `Video.isStalled` is a new read-only property that lets you know if the video is currently stalled or not. This is useful for detecting if the video is buffering or not.
* `Video.failedPlayAttempts` is a new read-only property that lets you know how many times the video has failed to play.
* `Video.metadata` is a new property that contains the VideoFrameCallbackMetadata object, as populated by the Request Video Frame callback.
* `Video.cacheKey` is a new property that contains the key of the curreng video if it came from the Video Cache, otherwise it's empty.
* `Video.isSeeking` is a new read-only property that lets you know if the video is currently seeking or not.

## Video Game Object Bug Fixes

* Video RTC was not reliably working. Fix #6130 (thanks @mshopf)
* If you switched tabs, then return to your game, a completed video would start playing again. It now remains stopped. Fix #5873 (thanks @marcusx2)
* If you had multiple Video Game Objects all using the same video URL, they would conflict in some browsers and only one of the videos would play. They now all use their own unique Video element allowing for multiple playback of exact same video. Fix #5458 (thanks @rexrainbow)
* Often, but intermittently, the Video Game Object would fail emit the `VIDEO_COMPLETE` event. Using the new Request Video Frame approach and better callback handling, this should now be fixed. Fix #6192 (thanks @dino8890)
* The Loader would intermittently not finish loading a video file. This often happened if you queued too many videos at once. Under v3.60 Videos are no longer preloaded at all, instead the Video Game Object manages all of this, meaning this issue no longer happens. Fix #4910 (thanks @micsun-al)
* Calling `setDisplayOrigin` on a `Video` Game Object would cause the origins to be set to `NaN` if the Video was created without an asset key. It will now give Videos a default size, preventing this error, which is reset once a video is loaded. Fix #5560 (thanks @mattjennings)
* The `Video.loadURL` method wouldn't load the video or emit the `VIDEO_CREATED` event unless `noAudio` was specified. A load event handler has been added to resolve this (thanks @samme)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
