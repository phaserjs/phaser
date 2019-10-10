/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Clamp = require('../../math/Clamp');
var Components = require('../components');
var GameEvents = require('../../core/events/');
var GameObject = require('../GameObject');
var SoundEvents = require('../../sound/events/');
var UUID = require('../../utils/string/UUID');
var VideoRender = require('./VideoRender');

/**
 * @classdesc
 * A Video Game Object.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
 * 
 * https://developer.mozilla.org/en-US/docs/Web/Media/Formats
 *
 * @class Video
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.20.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} [key] - The key of the Video this Game Object will use to render with, as stored in the Video Cache.
 */
var Video = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScrollFactor,
        Components.Size,
        Components.TextureCrop,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        VideoRender
    ],

    initialize:

    function Video (scene, x, y, key)
    {
        GameObject.call(this, scene, 'Video');

        /**
         * A reference to the HTML Video Element this Video Game Object is playing.
         * Will be `null` until a video is loaded for playback.
         *
         * @name Phaser.GameObjects.Video#video
         * @type {?HTMLVideoElement}
         * @since 3.20.0
         */
        this.video = null;

        /**
         * The Phaser Texture this Game Object is using to render the video to.
         * Will be `null` until a video is loaded for playback.
         *
         * @name Phaser.GameObjects.Video#videoTexture
         * @type {?Phaser.Textures.Texture}
         * @since 3.20.0
         */
        this.videoTexture = null;

        /**
         * A reference to the TextureSource belong to the `videoTexture` Texture object.
         * Will be `null` until a video is loaded for playback.
         *
         * @name Phaser.GameObjects.Video#videoTextureSource
         * @type {?Phaser.Textures.TextureSource}
         * @since 3.20.0
         */
        this.videoTextureSource = null;

        /**
         * A Phaser CanvasTexture instance that holds the most recent snapshot taken from the video.
         * This will only be set if `snapshot` or `snapshotArea` have been called, and will be `null` until that point.
         *
         * @name Phaser.GameObjects.Video#snapshotTexture
         * @type {?Phaser.Textures.CanvasTexture}
         * @since 3.20.0
         */
        this.snapshotTexture = null;

        /**
         * If you have saved this video to a texture via the `saveTexture` method, this controls if the video
         * is rendered with `flipY` in WebGL or not. You often need to set this if you wish to use the video texture
         * as the input source for a shader. If you find your video is appearing upside down within a shader or
         * custom pipeline, flip this property.
         *
         * @name Phaser.GameObjects.Video#flipY
         * @type {boolean}
         * @since 3.20.0
         */
        this.flipY = false;

        /**
         * The key used by the texture as stored in the Texture Manager.
         *
         * @name Phaser.GameObjects.Video#_key
         * @type {string}
         * @private
         * @since 3.20.0
         */
        this._key = UUID();

        /**
         * An internal flag holding the current state of the video lock, should document interaction be required
         * before playback can begin.
         *
         * @name Phaser.GameObjects.Video#touchLocked
         * @type {boolean}
         * @since 3.20.0
         */
        this.touchLocked = true;

        /**
         * Should the video auto play when document interaction is required and happens?
         *
         * @name Phaser.GameObjects.Video#playWhenUnlocked
         * @type {boolean}
         * @since 3.20.0
         */
        this.playWhenUnlocked = false;

        /**
         * When starting playback of a video Phaser will monitor its `readyState` using a `setTimeout` call.
         * The `setTimeout` happens once every `Video.retryInterval` ms. It will carry on monitoring the video
         * state in this manner until the `retryLimit` is reached and then abort.
         *
         * @name Phaser.GameObjects.Video#retryLimit
         * @type {integer}
         * @since 3.20.0
         */
        this.retryLimit = 20;

        /**
         * The current retry attempt.
         *
         * @name Phaser.GameObjects.Video#retry
         * @type {integer}
         * @since 3.20.0
         */
        this.retry = 0;

        /**
         * The number of ms between each retry while monitoring the ready state of a downloading video.
         *
         * @name Phaser.GameObjects.Video#retryInterval
         * @type {integer}
         * @since 3.20.0
         */
        this.retryInterval = 500;

        /**
         * The setTimeout callback ID.
         *
         * @name Phaser.GameObjects.Video#_retryID
         * @type {integer}
         * @private
         * @since 3.20.0
         */
        this._retryID = null;

        /**
         * The video was muted due to a system event, such as the game losing focus.
         *
         * @name Phaser.GameObjects.Video#_systemMuted
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._systemMuted = false;

        /**
         * The video was muted due to game code, not a system event.
         *
         * @name Phaser.GameObjects.Video#_codeMuted
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._codeMuted = false;

        /**
         * The video was paused due to a system event, such as the game losing focus.
         *
         * @name Phaser.GameObjects.Video#_systemPaused
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._systemPaused = false;

        /**
         * The video was paused due to game code, not a system event.
         *
         * @name Phaser.GameObjects.Video#_codePaused
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._codePaused = false;

        /**
         * The locally bound event callback handlers.
         *
         * @name Phaser.GameObjects.Video#_callbacks
         * @type {any}
         * @private
         * @since 3.20.0
         */
        this._callbacks = {
            end: this.completeHandler.bind(this),
            play: this.playHandler.bind(this),
            time: this.timeUpdateHandler.bind(this),
            seeking: this.seekingHandler.bind(this),
            seeked: this.seekedHandler.bind(this),
            loadeddata: this.loadeddataHandler.bind(this),
            canplay: this.canplayHandler.bind(this),
            canplaythrough: this.canplaythroughHandler.bind(this)
        };

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.GameObjects.Video#_crop
         * @type {object}
         * @private
         * @since 3.20.0
         */
        this._crop = this.resetCropObject();

        /**
         * An object containing in and out markers for sequence playback.
         *
         * @name Phaser.GameObjects.Video#markers
         * @type {any}
         * @since 3.20.0
         */
        this.markers = {};

        /**
         * The in marker.
         *
         * @name Phaser.GameObjects.Video#_markerIn
         * @type {integer}
         * @private
         * @since 3.20.0
         */
        this._markerIn = -1;

        /**
         * The out marker.
         *
         * @name Phaser.GameObjects.Video#_markerOut
         * @type {integer}
         * @private
         * @since 3.20.0
         */
        this._markerOut = Number.MAX_SAFE_INTEGER;

        /**
         * The last time the TextureSource was updated.
         *
         * @name Phaser.GameObjects.Video#_lastUpdate
         * @type {integer}
         * @private
         * @since 3.20.0
         */
        this._lastUpdate = 0;

        /**
         * The key of the video being played from the Video cache, if any.
         *
         * @name Phaser.GameObjects.Video#_cacheKey
         * @type {string}
         * @private
         * @since 3.20.0
         */
        this._cacheKey = '';

        /**
         * Is the video currently seeking?
         *
         * @name Phaser.GameObjects.Video#_isSeeking
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._isSeeking = false;

        this.setPosition(x, y);
        this.initPipeline();

        if (key)
        {
            this.changeSource(key, false);
        }

        var game = scene.sys.game.events;

        game.on(GameEvents.PAUSE, this.globalPause, this);
        game.on(GameEvents.RESUME, this.globalResume, this);

        var sound = scene.sys.sound;

        if (sound)
        {
            sound.on(SoundEvents.GLOBAL_MUTE, this.globalMute, this);
        }
    },

    /**
     * Starts this video playing.
     *
     * If the video is already playing, or has been queued to play with `changeSource` then this method just returns.
     * 
     * Videos can only autoplay if the browser has been unlocked. This happens if you have interacted with the browser, i.e.
     * by clicking on it or pressing a key, or due to server settings. The policies that control autoplaying are vast and
     * vary between browser. You can read more here: https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
     * 
     * If your video doesn't contain any audio, then set the `noAudio` parameter to `true` when the video is loaded,
     * and it will often allow the video to play immediately:
     * 
     * ```javascript
     * preload () {
     *   this.load.video('pixar', 'nemo.mp4', 'loadeddata', false, true);
     * }
     * ```
     * 
     * The 5th parameter in the load call tells Phaser that the video doesn't contain any audio tracks. Video without
     * audio can autoplay without a user gesture first. Video with audio cannot.
     * 
     * If need video audio, then you'll have to factor into your game flow the fact that the video cannot start playing
     * until the user has interacted with the browser.
     *
     * @method Phaser.GameObjects.Video#play
     * @since 3.20.0
     * 
     * @param {boolean} [loop=false] - Should the video loop automatically when it reaches the end? Please note that not all browsers support _seamless_ video looping for all encoding formats.
     * @param {integer} [markerIn] - Optional in marker time, in seconds, for playback of a sequence of the video.
     * @param {integer} [markerOut] - Optional out marker time, in seconds, for playback of a sequence of the video.
     * 
     * @return {this} This Video Game Object for method chaining.
     */
    play: function (loop, markerIn, markerOut)
    {
        if ((this.touchLocked && this.playWhenUnlocked) || this.isPlaying())
        {
            return this;
        }

        var video = this.video;

        if (!video)
        {
            console.warn('Video not loaded');

            return this;
        }

        if (loop === undefined) { loop = video.loop; }

        var sound = this.scene.sys.sound;
        
        if (sound && sound.mute)
        {
            //  Mute will be set based on the global mute state of the Sound Manager (if there is one)
            this.setMute(true);
        }

        if (!isNaN(markerIn))
        {
            this._markerIn = markerIn;
        }

        if (!isNaN(markerOut) && markerOut > markerIn)
        {
            this._markerOut = markerOut;
        }

        video.loop = loop;

        var callbacks = this._callbacks;

        var playPromise = video.play();

        if (playPromise !== undefined)
        {
            playPromise.then(this.playSuccessHandler.bind(this)).catch(this.playErrorHandler.bind(this));
        }
        else
        {
            //  Old-school browsers with no Promises
            video.addEventListener('playing', callbacks.play, true);

            //  If video hasn't downloaded properly yet ...
            if (video.readyState < 2)
            {
                this.retry = this.retryLimit;

                this._retryID = window.setTimeout(this.checkVideoProgress.bind(this), this.retryInterval);
            }
        }

        //  Set these after calling `play` or they don't fire (useful, thanks browsers)
        video.addEventListener('ended', callbacks.end, true);
        video.addEventListener('webkitendfullscreen', callbacks.end, true);
        video.addEventListener('timeupdate', callbacks.time, true);

        return this;
    },

    /**
     * TODO
     *
     * @method Phaser.GameObjects.Video#changeSource
     * @since 3.20.0
     * 
     * @param {string} key - The key of the Video this Game Object will swap to playing, as stored in the Video Cache.
     * @param {boolean} [autoplay=true] - Should the video start playing immediately, once the swap is complete?
     * @param {boolean} [loop=false] - Should the video loop automatically when it reaches the end? Please note that not all browsers support _seamless_ video looping for all encoding formats.
     * @param {integer} [markerIn] - Optional in marker time, in seconds, for playback of a sequence of the video.
     * @param {integer} [markerOut] - Optional out marker time, in seconds, for playback of a sequence of the video.
     * 
     * @return {this} This Video Game Object for method chaining.
     */
    changeSource: function (key, autoplay, loop, markerIn, markerOut)
    {
        if (autoplay === undefined) { autoplay = true; }

        var currentVideo = this.video;

        if (currentVideo)
        {
            this.stop();
        }

        var newVideo = this.scene.sys.cache.video.get(key);

        if (newVideo)
        {
            this.video = newVideo;

            this._cacheKey = key;

            this._codePaused = newVideo.paused;
            this._codeMuted = newVideo.muted;

            newVideo.addEventListener('seeking', this._callbacks.seeking, true);
            newVideo.addEventListener('seeked', this._callbacks.seeked, true);

            if (this.videoTexture)
            {
                this.scene.sys.textures.remove(this._key);

                this.videoTexture = this.scene.sys.textures.create(this._key, newVideo, newVideo.videoWidth, newVideo.videoHeight);
                this.videoTextureSource = this.videoTexture.source[0];
                this.videoTexture.add('__BASE', 0, 0, 0, newVideo.videoWidth, newVideo.videoHeight);
        
                this.setTexture(this.videoTexture);
                this.setSizeToFrame();
                this.updateDisplayOrigin();

                this.emit('created', this, newVideo.videoWidth, newVideo.videoHeight);
            }
            else
            {
                this.updateTexture();
            }

            newVideo.currentTime = 0;

            this._lastUpdate = 0;

            if (autoplay)
            {
                this.play(loop, markerIn, markerOut);
            }
        }
        else
        {
            this.video = null;
        }

        return this;
    },

    /**
     * Adds a sequence marker to this video.
     * 
     * Markers allow you to split a video up into sequences, delineated by a start and end time, given in seconds.
     * 
     * You can then play back specific markers via the `playMarker` method.
     * 
     * Note that marker timing is _not_ frame-perfect. You should construct your videos in such a way that you allow for
     * plenty of extra padding before and after each sequence to allow for discrepencies in browser seek and currentTime accuracy.
     * 
     * See https://github.com/w3c/media-and-entertainment/issues/4 for more details about this issue.
     *
     * @method Phaser.GameObjects.Video#addMarker
     * @since 3.20.0
     * 
     * @param {string} key - A unique name to give this marker.
     * @param {integer} markerIn - The time, in seconds, representing the start of this marker.
     * @param {integer} markerOut - The time, in seconds, representing the end of this marker.
     * 
     * @return {this} This Video Game Object for method chaining.
     */
    addMarker: function (key, markerIn, markerOut)
    {
        if (!isNaN(markerIn) && markerIn >= 0 && !isNaN(markerOut))
        {
            this.markers[key] = [ markerIn, markerOut ];
        }

        return this;
    },

    /**
     * Plays a pre-defined sequence in this video.
     * 
     * Markers allow you to split a video up into sequences, delineated by a start and end time, given in seconds and
     * specified via the `addMarker` method.
     * 
     * Note that marker timing is _not_ frame-perfect. You should construct your videos in such a way that you allow for
     * plenty of extra padding before and after each sequence to allow for discrepencies in browser seek and currentTime accuracy.
     * 
     * See https://github.com/w3c/media-and-entertainment/issues/4 for more details about this issue.
     *
     * @method Phaser.GameObjects.Video#playMarker
     * @since 3.20.0
     * 
     * @param {string} key - The name of the marker sequence to play.
     * @param {boolean} [loop=false] - Should the video loop automatically when it reaches the end? Please note that not all browsers support _seamless_ video looping for all encoding formats.
     * 
     * @return {this} This Video Game Object for method chaining.
     */
    playMarker: function (key, loop)
    {
        var marker = this.markers[key];

        if (marker)
        {
            this.play(loop, marker[0], marker[1]);
        }

        return this;
    },

    /**
     * Removes a previously set marker from this video.
     * 
     * If the marker is currently playing it will _not_ stop playback.
     *
     * @method Phaser.GameObjects.Video#removeMarker
     * @since 3.20.0
     * 
     * @param {string} key - The name of the marker to remove.
     * 
     * @return {this} This Video Game Object for method chaining.
     */
    removeMarker: function (key)
    {
        delete this.markers[key];

        return this;
    },

    /**
     * Takes a snapshot of the current frame of the video and renders it to a CanvasTexture object,
     * which is then returned. You can optionally resize the grab by passing a width and height.
     * 
     * This method returns a reference to the `Video.snapshotTexture` object. Calling this method
     * multiple times will overwrite the previous snapshot with the most recent one.
     *
     * @method Phaser.GameObjects.Video#snapshot
     * @since 3.20.0
     * 
     * @param {integer} [width] - The width of the resulting CanvasTexture.
     * @param {integer} [height] - The height of the resulting CanvasTexture.
     * 
     * @return {Phaser.Textures.CanvasTexture} 
     */
    snapshot: function (width, height)
    {
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }

        return this.snapshotArea(0, 0, this.width, this.height, width, height);
    },

    /**
     * Takes a snapshot of the specified area of the current frame of the video and renders it to a CanvasTexture object,
     * which is then returned. You can optionally resize the grab by passing a different `destWidth` and `destHeight`.
     * 
     * This method returns a reference to the `Video.snapshotTexture` object. Calling this method
     * multiple times will overwrite the previous snapshot with the most recent one.
     *
     * @method Phaser.GameObjects.Video#snapshotArea
     * @since 3.20.0
     * 
     * @param {integer} [x=0] - The horizontal location of the top-left of the area to grab from.
     * @param {integer} [y=0] - The vertical location of the top-left of the area to grab from.
     * @param {integer} [srcWidth] - The width of area to grab from the video. If not given it will grab the full video dimensions.
     * @param {integer} [srcHeight] - The height of area to grab from the video. If not given it will grab the full video dimensions.
     * @param {integer} [destWidth] - The destination width of the grab, allowing you to resize it.
     * @param {integer} [destHeight] - The destination height of the grab, allowing you to resize it.
     * 
     * @return {Phaser.Textures.CanvasTexture} 
     */
    snapshotArea: function (x, y, srcWidth, srcHeight, destWidth, destHeight)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (srcWidth === undefined) { srcWidth = this.width; }
        if (srcHeight === undefined) { srcHeight = this.height; }
        if (destWidth === undefined) { destWidth = srcWidth; }
        if (destHeight === undefined) { destHeight = srcHeight; }

        var video = this.video;
        var snap = this.snapshotTexture;

        if (!snap)
        {
            snap = this.scene.sys.textures.createCanvas(UUID(), destWidth, destHeight);

            this.snapshotTexture = snap;

            if (video)
            {
                snap.context.drawImage(video, x, y, srcWidth, srcHeight, 0, 0, destWidth, destHeight);
            }
        }
        else
        {
            snap.setSize(destWidth, destHeight);

            if (video)
            {
                snap.context.drawImage(video, x, y, srcWidth, srcHeight, 0, 0, destWidth, destHeight);
            }
        }

        return snap.update();
    },

    saveSnapshotTexture: function (key)
    {
        if (this.snapshotTexture)
        {
            this.scene.sys.textures.renameTexture(this.snapshotTexture.key, key);
        }
        else
        {
            this.snapshotTexture = this.scene.sys.textures.createCanvas(key, this.width, this.height);
        }

        return this.snapshotTexture;
    },

    loadeddataHandler: function (event)
    {
        console.log('Video.loadeddataHandler');
        console.log(event);

        var video = event.target;

        video.removeEventListener('loadeddata', this._callbacks.loadeddata, true);
    },

    canplayHandler: function (event)
    {
        console.log('Video.canplayHandler');
        console.log(event);

        var video = event.target;

        video.removeEventListener('canplay', this._callbacks.canplay, true);
    },

    canplaythroughHandler: function (event)
    {
        console.log('Video.canplaythroughHandler');
        console.log(event);

        var video = event.target;

        video.removeEventListener('canplaythrough', this._callbacks.canplaythrough, true);
    },

    /**
     * Creates a new Video element from the given URL.
     *
     * @method Phaser.Video#playURL
     * @param {string} url - The URL of the video.
     * @param {boolean} [autoplay=false] - Automatically start the video?
     * @return {Phaser.Video} This Video object for method chaining.
     */
    loadURL: function (url, loadEvent, noAudio)
    {
        if (loadEvent === undefined) { loadEvent = 'loadeddata'; }
        if (noAudio === undefined) { noAudio = false; }

        if (this.video)
        {
            this.stop();
        }

        if (this.videoTexture)
        {
            this.scene.sys.textures.remove(this._key);
        }

        var video = document.createElement('video');
    
        video.controls = false;

        if (noAudio)
        {
            video.muted = true;
            video.defaultMuted = true;

            video.setAttribute('autoplay', 'autoplay');
        }

        video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('preload', 'auto');

        video.addEventListener(loadEvent, this._callbacks[loadEvent], true);

        video.addEventListener('error', function (e)
        {
            console.log('Load Error');
            console.log(e);
        }, true);

        video.addEventListener('loadstart', function ()
        {
            console.log('Load Start');
        }, true);

        video.addEventListener('loadedmetadata', function ()
        {
            console.log('Loaded Meta Data');
        }, true);

        video.addEventListener('emptied', function ()
        {
            console.log('Load Emptied');
        }, true);

        video.src = url;

        video.load();

        this.video = video;

        return this;
    },

    playSuccessHandler: function ()
    {
        console.log('playSuccessHandler');

        this.touchLocked = false;

        if (this._markerIn > -1)
        {
            console.log('jumping to', this._markerIn);

            this.video.currentTime = this._markerIn;
        }
    },

    playErrorHandler: function (error)
    {
        console.log('playErrorHandler');
        console.log(error);

        this.scene.sys.input.once('pointerdown', this.unlockHandler, this);

        this.touchLocked = true;
        this.playWhenUnlocked = true;

        this.emit('error', error);
    },

    unlockHandler: function ()
    {
        this.touchLocked = false;
        this.playWhenUnlocked = false;

        if (this._markerIn > -1)
        {
            console.log('jumping to', this._markerIn);

            this.video.currentTime = this._markerIn;
        }

        this.video.play();
    },

    /**
     * Called when the video completes playback (reaches and ended state).
     * Dispatches the Video.onComplete signal.
     *
     * @method Phaser.Video#completeHandler
     */
    completeHandler: function ()
    {
        console.log('Video has ended!');
    },

    //  The timeUpdate event is so slow and irregular we can't use it for actual video timing.
    //  But, we CAN use it to determine if the video has looped :)
    timeUpdateHandler: function ()
    {
        if (this.video && this.video.currentTime < this._lastUpdate)
        {
            this.emit('loop', this);

            this._lastUpdate = 0;
        }
    },

    /**
     * Called when the video starts to play. Updates the texture.
     *
     * @method Phaser.Video#playHandler
     * @private
     */
    playHandler: function ()
    {
        console.log('playHandler');

        this.touchLocked = false;
       
        this.video.removeEventListener('playing', this._callbacks.play, true);
    },

    preUpdate: function ()
    {
        var video = this.video;

        if (video)
        {
            var currentTime = video.currentTime;

            //  Don't render a new frame unless the video has actually changed time
            if (currentTime !== this._lastUpdate)
            {
                this._lastUpdate = currentTime;

                this.updateTexture();

                if (currentTime >= this._markerOut)
                {
                    console.log('marker out', currentTime, this._markerOut);

                    if (video.loop)
                    {
                        video.currentTime = this._markerIn;

                        this.updateTexture();

                        this._lastUpdate = currentTime;
                    }
                    else
                    {
                        this.stop();
                    }
                }
            }
        }
    },

    /**
     * Stops the video playing.
     *
     * This removes all locally set signals.
     *
     * If you only wish to pause playback of the video, to resume at a later time, use `Video.paused = true` instead.
     * If the video hasn't finished downloading calling `Video.stop` will not abort the download. To do that you need to
     * call `Video.destroy` instead.
     *
     * If you are using a video stream from a webcam then calling Stop will disconnect the MediaStream session and disable the webcam.
     *
     * @method Phaser.Video#stop
     * @return {Phaser.Video} This Video object for method chaining.
     */
    stop: function ()
    {
        //  Stream or file?

        var video = this.video;

        if (video)
        {
            var callbacks = this._callbacks;

            video.removeEventListener('ended', callbacks.end, true);
            video.removeEventListener('webkitendfullscreen', callbacks.end, true);
            video.removeEventListener('timeupdate', callbacks.time, true);
            video.removeEventListener('playing', callbacks.play, true);
            video.removeEventListener('seeking', callbacks.seeking, true);
            video.removeEventListener('seeked', callbacks.seeked, true);

            video.pause();
        }

        return this;
    },

    /**
     * Internal callback that monitors the download progress of a video after changing its source.
     *
     * @method Phaser.Video#checkVideoProgress
     * @private
     */
    checkVideoProgress: function ()
    {
        if (this.video.readyState >= 2)
        {
            //  We've got enough data to update the texture for playback
            this.updateTexture();
        }
        else
        {
            this.retry--;

            if (this.retry > 0)
            {
                this._retryID = window.setTimeout(this.checkVideoProgress.bind(this), this.retryInterval);
            }
            else
            {
                console.warn('Phaser.Video: Unable to start downloading video in time');
            }
        }
    },

    /**
     * Called automatically if the video source changes and updates the internal texture dimensions.
     * Then dispatches the onChangeSource signal.
     *
     * @method Phaser.Video#updateTexture
     * @param {object} [event] - The event which triggered the texture update.
     */
    updateTexture: function ()
    {
        var video = this.video;

        var width = video.videoWidth;
        var height = video.videoHeight;

        if (!this.videoTexture)
        {
            this.videoTexture = this.scene.sys.textures.create(this._key, video, width, height);
            this.videoTextureSource = this.videoTexture.source[0];
            this.videoTexture.add('__BASE', 0, 0, 0, width, height);
    
            this.setTexture(this.videoTexture);
            this.setSizeToFrame();
            this.updateDisplayOrigin();
    
            this.emit('created', this, width, height);
        }
        else
        {
            var textureSource = this.videoTextureSource;

            if (textureSource.source !== video)
            {
                textureSource.source = video;
                textureSource.width = width;
                textureSource.height = height;
            }
            
            textureSource.update();
        }
    },

    getVideoKey: function ()
    {
        return this._cacheKey;
    },

    //  0 to 1
    seekTo: function (value)
    {
        var video = this.video;

        if (video)
        {
            var duration = video.duration;

            if (duration !== Infinity && !isNaN(duration))
            {
                var seekTime = duration * value;

                this.setCurrentTime(seekTime);
            }
        }

        return this;
    },

    /**
     * @name Phaser.Video#currentTime
     * @property {number} currentTime - The current time of the video in seconds. If set the video will attempt to seek to that point in time.
     */
    getCurrentTime: function ()
    {
        return (this.video) ? this.video.currentTime : 0;
    },

    setCurrentTime: function (value)
    {
        var video = this.video;

        if (video)
        {
            if (typeof value === 'string')
            {
                var op = value[0];
                var num = parseFloat(value.substr(1));

                if (op === '+')
                {
                    value = video.currentTime + num;
                }
                else if (op === '-')
                {
                    value = video.currentTime - num;
                }
            }

            video.currentTime = value;

            this._lastUpdate = value;
        }

        return this;
    },

    isSeeking: function ()
    {
        return this._isSeeking;
    },

    seekingHandler: function ()
    {
        this._isSeeking = true;
    },

    seekedHandler: function ()
    {
        this._isSeeking = false;

        var video = this.video;

        if (video)
        {
            this.updateTexture();
        }
    },

    /**
     * @name Phaser.Video#currentTime
     */
    getProgress: function ()
    {
        var video = this.video;

        if (video)
        {
            var now = video.currentTime;
            var duration = video.duration;

            if (duration !== Infinity && !isNaN(duration))
            {
                return now / duration;
            }
        }
        
        return 0;
    },

    /**
     * A double-precision floating-point value which indicates the duration (total length) of the media in seconds, on the media's timeline.
     * If no media is present on the element, or the media is not valid, the returned value is NaN.
     * If the media has no known end (such as for live streams of unknown duration, web radio, media incoming from WebRTC, and so forth),
     * this value is +Infinity.
     * 
     * @name Phaser.Video#duration
     * @property {number} duration - The duration of the video in seconds.
     * @readOnly
     */
    getDuration: function ()
    {
        return (this.video) ? this.video.duration : 0;
    },

    isMuted: function ()
    {
        return this._codeMuted;
    },

    globalMute: function (soundManager, value)
    {
        this._systemMuted = value;

        var video = this.video;

        if (video)
        {
            video.muted = (this._codeMuted) ? true : value;
        }
    },

    setMute: function (value)
    {
        if (value === undefined) { value = true; }

        this._codeMuted = value;

        var video = this.video;

        if (video)
        {
            video.muted = (this._systemMuted) ? true : value;
        }

        return this;
    },

    globalPause: function ()
    {
        this._systemPaused = true;

        if (this.video)
        {
            this.video.pause();
        }
    },

    globalResume: function ()
    {
        this._systemPaused = false;

        if (this.video && !this._codePaused)
        {
            this.video.play();
        }
    },

    pause: function ()
    {
        this._codePaused = true;

        var video = this.video;

        if (video && !video.paused)
        {
            video.pause();
        }

        return this;
    },

    resume: function ()
    {
        this._codePaused = false;

        var video = this.video;

        if (video && video.paused && !this._systemPaused)
        {
            this.play();
        }

        return this;
    },

    getVolume: function ()
    {
        return (this.video) ? this.video.volume : 1;
    },
    
    /**
     * @name Phaser.Video#volume
     * @property {number} volume - Gets or sets the volume of the Video, a value between 0 and 1. The value given is clamped to the range 0 to 1.
     */
    setVolume: function (value)
    {
        if (value === undefined) { value = 1; }

        if (this.video)
        {
            this.video.volume = Clamp(value, 0, 1);
        }

        return this;
    },

    getPlaybackRate: function ()
    {
        return (this.video) ? this.video.playbackRate : 1;
    },

    /**
     * @name Phaser.Video#playbackRate
     * @property {number} playbackRate - Gets or sets the playback rate of the Video. This is the speed at which the video is playing.
     */
    setPlaybackRate: function (rate)
    {
        if (this.video)
        {
            this.video.playbackRate = rate;
        }

        return this;
    },

    getLoop: function ()
    {
        return (this.video) ? this.video.loop : false;
    },

    /**
     * Gets or sets if the Video is set to loop.
     * Please note that at present some browsers do not support *seamless* video looping for all video formats.
     * If the video isn't yet set this will always return false.
     *
     * @name Phaser.Video#loop
     * @property {boolean} loop
     */
    setLoop: function (value)
    {
        if (value === undefined) { value = true; }

        if (this.video)
        {
            this.video.loop = value;
        }

        return this;
    },

    /**
     * @name Phaser.Video#playing
     * @property {boolean} playing - True if the video is currently playing (and not paused or ended), otherwise false.
     * @readOnly
     */
    isPlaying: function ()
    {
        return (this.video) ? !(this.video.paused || this.video.ended) : false;
    },
    
    /**
     * @name Phaser.Video#playing
     * @property {boolean} playing - True if the video is currently playing (and not paused or ended), otherwise false.
     * @readOnly
     */
    isPaused: function ()
    {
        return ((this.video && this.video.paused) || this._codePaused || this._systemPaused);
    },

    /**
     * Stores a copy of this Render Texture in the Texture Manager using the given key.
     * 
     * After doing this, any texture based Game Object, such as a Sprite, can use the contents of this
     * Render Texture by using the texture key:
     * 
     * ```javascript
     * var rt = this.add.renderTexture(0, 0, 128, 128);
     * 
     * // Draw something to the Render Texture
     * 
     * rt.saveTexture('doodle');
     * 
     * this.add.image(400, 300, 'doodle');
     * ```
     * 
     * Updating the contents of this Render Texture will automatically update _any_ Game Object
     * that is using it as a texture. Calling `saveTexture` again will not save another copy
     * of the same texture, it will just rename the key of the existing copy.
     * 
     * By default it will create a single base texture. You can add frames to the texture
     * by using the `Texture.add` method. After doing this, you can then allow Game Objects
     * to use a specific frame from a Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#saveTexture
     * @since 3.12.0
     *
     * @param {string} key - The unique key to store the texture as within the global Texture Manager.
     *
     * @return {Phaser.Textures.Texture} The Texture that was saved.
     */
    saveTexture: function (key, flipY)
    {
        if (flipY === undefined) { flipY = false; }

        if (this.videoTexture)
        {
            this.scene.sys.textures.renameTexture(this._key, key);
        }

        this._key = key;

        this.flipY = flipY;

        if (this.videoTextureSource)
        {
            this.videoTextureSource.setFlipY(flipY);
        }

        return this.videoTexture;
    },

    /**
     * Removes the Video element from the DOM by calling parentNode.removeChild on itself.
     * Also removes the autoplay and src attributes and nulls the reference.
     *
     * @method Phaser.Video#removeVideoElement
     */
    removeVideoElement: function ()
    {
        var video = this.video;

        if (!video)
        {
            return;
        }

        if (video.parentNode)
        {
            video.parentNode.removeChild(video);
        }

        while (video.hasChildNodes())
        {
            video.removeChild(video.firstChild);
        }

        video.removeAttribute('autoplay');
        video.removeAttribute('src');

        this.video = null;
    },

    /**
     * Destroys the Video object. This calls `Video.stop` and then `Video.removeVideoElement`.
     * If any Sprites are using this Video as their texture it is up to you to manage those.
     *
     * @method Phaser.Video#destroy
     */
    destroy: function (removeVideoElement)
    {
        if (removeVideoElement === undefined) { removeVideoElement = true; }

        this.stop();

        if (removeVideoElement)
        {
            this.removeVideoElement();
        }

        var game = this.scene.sys.game.events;

        game.off(GameEvents.PAUSE, this.globalPause, this);
        game.off(GameEvents.RESUME, this.globalResume, this);

        var sound = this.scene.sys.sound;

        if (sound)
        {
            sound.off(SoundEvents.GLOBAL_MUTE, this.globalMute, this);
        }

        if (this._retryID)
        {
            window.clearTimeout(this._retryID);
        }
    }

});

module.exports = Video;
