/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Clamp = require('../../math/Clamp');
var Components = require('../components');
var Events = require('../events');
var GameEvents = require('../../core/events/');
var InputEvents = require('../../input/events/');
var GameObject = require('../GameObject');
var SoundEvents = require('../../sound/events/');
var UUID = require('../../utils/string/UUID');
var VideoRender = require('./VideoRender');
var MATH_CONST = require('../../math/const');

/**
 * @classdesc
 * A Video Game Object.
 *
 * This Game Object is capable of handling playback of a previously loaded video from the Phaser Video Cache,
 * or playing a video based on a given URL. Videos can be either local, or streamed.
 *
 * ```javascript
 * preload () {
 *   this.load.video('pixar', 'nemo.mp4');
 * }
 *
 * create () {
 *   this.add.video(400, 300, 'pixar');
 * }
 * ```
 *
 * To all intents and purposes, a video is a standard Game Object, just like a Sprite. And as such, you can do
 * all the usual things to it, such as scaling, rotating, cropping, tinting, making interactive, giving a
 * physics body, etc.
 *
 * Transparent videos are also possible via the WebM file format. Providing the video file has was encoded with
 * an alpha channel, and providing the browser supports WebM playback (not all of them do), then it will render
 * in-game with full transparency.
 *
 * ### Autoplaying Videos
 *
 * Videos can only autoplay if the browser has been unlocked with an interaction, or satisfies the MEI settings.
 * The policies that control autoplaying are vast and vary between browser.
 * You can, and should, read more about it here: https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
 *
 * If your video doesn't contain any audio, then set the `noAudio` parameter to `true` when the video is _loaded_,
 * and it will often allow the video to play immediately:
 *
 * ```javascript
 * preload () {
 *   this.load.video('pixar', 'nemo.mp4', 'loadeddata', false, true);
 * }
 * ```
 *
 * The 5th parameter in the load call tells Phaser that the video doesn't contain any audio tracks. Video without
 * audio can autoplay without requiring a user interaction. Video with audio cannot do this unless it satisfies
 * the browsers MEI settings. See the MDN Autoplay Guide for further details.
 *
 * Note that due to a bug in IE11 you cannot play a video texture to a Sprite in WebGL. For IE11 force Canvas mode.
 *
 * More details about video playback and the supported media formats can be found on MDN:
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
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
 * @param {string} [key] - Optional key of the Video this Game Object will play, as stored in the Video Cache.
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
         * @type {number}
         * @since 3.20.0
         */
        this.retryLimit = 20;

        /**
         * The current retry attempt.
         *
         * @name Phaser.GameObjects.Video#retry
         * @type {number}
         * @since 3.20.0
         */
        this.retry = 0;

        /**
         * The number of ms between each retry while monitoring the ready state of a downloading video.
         *
         * @name Phaser.GameObjects.Video#retryInterval
         * @type {number}
         * @since 3.20.0
         */
        this.retryInterval = 500;

        /**
         * The setTimeout callback ID.
         *
         * @name Phaser.GameObjects.Video#_retryID
         * @type {number}
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
            play: this.playHandler.bind(this),
            error: this.loadErrorHandler.bind(this),
            end: this.completeHandler.bind(this),
            time: this.timeUpdateHandler.bind(this),
            seeking: this.seekingHandler.bind(this),
            seeked: this.seekedHandler.bind(this)
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
         * @type {number}
         * @private
         * @since 3.20.0
         */
        this._markerIn = -1;

        /**
         * The out marker.
         *
         * @name Phaser.GameObjects.Video#_markerOut
         * @type {number}
         * @private
         * @since 3.20.0
         */
        this._markerOut = MATH_CONST.MAX_SAFE_INTEGER;

        /**
         * The last time the TextureSource was updated.
         *
         * @name Phaser.GameObjects.Video#_lastUpdate
         * @type {number}
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

        /**
         * Should the Video element that this Video is using, be removed from the DOM
         * when this Video is destroyed?
         *
         * @name Phaser.GameObjects.Video#removeVideoElementOnDestroy
         * @type {boolean}
         * @since 3.21.0
         */
        this.removeVideoElementOnDestroy = false;

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

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
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
     * audio can autoplay without requiring a user interaction. Video with audio cannot do this unless it satisfies
     * the browsers MEI settings. See the MDN Autoplay Guide for details.
     *
     * If you need audio in your videos, then you'll have to consider the fact that the video cannot start playing until the
     * user has interacted with the browser, into your game flow.
     *
     * @method Phaser.GameObjects.Video#play
     * @since 3.20.0
     *
     * @param {boolean} [loop=false] - Should the video loop automatically when it reaches the end? Please note that not all browsers support _seamless_ video looping for all encoding formats.
     * @param {number} [markerIn] - Optional in marker time, in seconds, for playback of a sequence of the video.
     * @param {number} [markerOut] - Optional out marker time, in seconds, for playback of a sequence of the video.
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
            playPromise.then(this.playPromiseSuccessHandler.bind(this)).catch(this.playPromiseErrorHandler.bind(this));
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

        //  Set these _after_ calling `play` or they don't fire (useful, thanks browsers)
        video.addEventListener('ended', callbacks.end, true);
        video.addEventListener('timeupdate', callbacks.time, true);
        video.addEventListener('seeking', callbacks.seeking, true);
        video.addEventListener('seeked', callbacks.seeked, true);

        return this;
    },

    /**
     * This method allows you to change the source of the current video element. It works by first stopping the
     * current video, if playing. Then deleting the video texture, if one has been created. Finally, it makes a
     * new video texture and starts playback of the new source through the existing video element.
     *
     * The reason you may wish to do this is because videos that require interaction to unlock, remain in an unlocked
     * state, even if you change the source of the video. By changing the source to a new video you avoid having to
     * go through the unlock process again.
     *
     * @method Phaser.GameObjects.Video#changeSource
     * @since 3.20.0
     *
     * @param {string} key - The key of the Video this Game Object will swap to playing, as stored in the Video Cache.
     * @param {boolean} [autoplay=true] - Should the video start playing immediately, once the swap is complete?
     * @param {boolean} [loop=false] - Should the video loop automatically when it reaches the end? Please note that not all browsers support _seamless_ video looping for all encoding formats.
     * @param {number} [markerIn] - Optional in marker time, in seconds, for playback of a sequence of the video.
     * @param {number} [markerOut] - Optional out marker time, in seconds, for playback of a sequence of the video.
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

            if (this.videoTexture)
            {
                this.scene.sys.textures.remove(this._key);

                this.videoTexture = this.scene.sys.textures.create(this._key, newVideo, newVideo.videoWidth, newVideo.videoHeight);
                this.videoTextureSource = this.videoTexture.source[0];
                this.videoTexture.add('__BASE', 0, 0, 0, newVideo.videoWidth, newVideo.videoHeight);

                this.setTexture(this.videoTexture);
                this.setSizeToFrame();
                this.updateDisplayOrigin();

                this.emit(Events.VIDEO_CREATED, this, newVideo.videoWidth, newVideo.videoHeight);
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
     * plenty of extra padding before and after each sequence to allow for discrepancies in browser seek and currentTime accuracy.
     *
     * See https://github.com/w3c/media-and-entertainment/issues/4 for more details about this issue.
     *
     * @method Phaser.GameObjects.Video#addMarker
     * @since 3.20.0
     *
     * @param {string} key - A unique name to give this marker.
     * @param {number} markerIn - The time, in seconds, representing the start of this marker.
     * @param {number} markerOut - The time, in seconds, representing the end of this marker.
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
     * plenty of extra padding before and after each sequence to allow for discrepancies in browser seek and currentTime accuracy.
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
     * @param {number} [width] - The width of the resulting CanvasTexture.
     * @param {number} [height] - The height of the resulting CanvasTexture.
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
     * @param {number} [x=0] - The horizontal location of the top-left of the area to grab from.
     * @param {number} [y=0] - The vertical location of the top-left of the area to grab from.
     * @param {number} [srcWidth] - The width of area to grab from the video. If not given it will grab the full video dimensions.
     * @param {number} [srcHeight] - The height of area to grab from the video. If not given it will grab the full video dimensions.
     * @param {number} [destWidth] - The destination width of the grab, allowing you to resize it.
     * @param {number} [destHeight] - The destination height of the grab, allowing you to resize it.
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

    /**
     * Stores a copy of this Videos `snapshotTexture` in the Texture Manager using the given key.
     *
     * This texture is created when the `snapshot` or `snapshotArea` methods are called.
     *
     * After doing this, any texture based Game Object, such as a Sprite, can use the contents of the
     * snapshot by using the texture key:
     *
     * ```javascript
     * var vid = this.add.video(0, 0, 'intro');
     *
     * vid.snapshot();
     *
     * vid.saveSnapshotTexture('doodle');
     *
     * this.add.image(400, 300, 'doodle');
     * ```
     *
     * Updating the contents of the `snapshotTexture`, for example by calling `snapshot` again,
     * will automatically update _any_ Game Object that is using it as a texture.
     * Calling `saveSnapshotTexture` again will not save another copy of the same texture,
     * it will just rename the existing one.
     *
     * By default it will create a single base texture. You can add frames to the texture
     * by using the `Texture.add` method. After doing this, you can then allow Game Objects
     * to use a specific frame.
     *
     * @method Phaser.GameObjects.Video#saveSnapshotTexture
     * @since 3.20.0
     *
     * @param {string} key - The unique key to store the texture as within the global Texture Manager.
     *
     * @return {Phaser.Textures.CanvasTexture} The Texture that was saved.
     */
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

    /**
     * Loads a Video from the given URL, ready for playback with the `Video.play` method.
     *
     * You can control at what point the browser determines the video as being ready for playback via
     * the `loadEvent` parameter. See https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
     * for more details.
     *
     * @method Phaser.GameObjects.Video#loadURL
     * @since 3.20.0
     *
     * @param {string} url - The URL of the video to load or be streamed.
     * @param {string} [loadEvent='loadeddata'] - The load event to listen for. Either `loadeddata`, `canplay` or `canplaythrough`.
     * @param {boolean} [noAudio=false] - Does the video have an audio track? If not you can enable auto-playing on it.
     *
     * @return {this} This Video Game Object for method chaining.
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

        video.addEventListener('error', this._callbacks.error, true);

        video.src = url;

        video.load();

        this.video = video;

        return this;
    },

    /**
     * Loads a Video from the given MediaStream object, ready for playback with the `Video.play` method.
     *
     * You can control at what point the browser determines the video as being ready for playback via
     * the `loadEvent` parameter. See https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
     * for more details.
     *
     * @method Phaser.GameObjects.Video#loadMediaStream
     * @since 3.50.0
     *
     * @param {string} stream - The MediaStream object.
     * @param {string} [loadEvent='loadeddata'] - The load event to listen for. Either `loadeddata`, `canplay` or `canplaythrough`.
     * @param {boolean} [noAudio=false] - Does the video have an audio track? If not you can enable auto-playing on it.
     *
     * @return {this} This Video Game Object for method chaining.
     */
    loadMediaStream: function (stream, loadEvent, noAudio)
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

        video.addEventListener('error', this._callbacks.error, true);

        try
        {
            video.srcObject = stream;
        }
        catch (error)
        {
            video.src = window.URL.createObjectURL(stream);
        }

        video.load();

        this.video = video;

        return this;
    },

    /**
     * This internal method is called automatically if the playback Promise resolves successfully.
     *
     * @method Phaser.GameObjects.Video#playPromiseSuccessHandler
     * @fires Phaser.GameObjects.Events#VIDEO_PLAY
     * @private
     * @since 3.20.0
     */
    playPromiseSuccessHandler: function ()
    {
        this._codePaused = false;
        this.touchLocked = false;

        this.emit(Events.VIDEO_PLAY, this);

        if (this._markerIn > -1)
        {
            this.video.currentTime = this._markerIn;
        }
    },

    /**
     * This internal method is called automatically if the playback Promise fails to resolve.
     *
     * @method Phaser.GameObjects.Video#playPromiseErrorHandler
     * @fires Phaser.GameObjects.Events#VIDEO_ERROR
     * @private
     * @since 3.20.0
     *
     * @param {any} error - The Promise resolution error.
     */
    playPromiseErrorHandler: function (error)
    {
        this.scene.sys.input.once(InputEvents.POINTER_DOWN, this.unlockHandler, this);

        this.touchLocked = true;
        this.playWhenUnlocked = true;

        this.emit(Events.VIDEO_ERROR, this, error);
    },

    /**
     * Called when the video emits a `playing` event during load.
     *
     * This is only listened for if the browser doesn't support Promises.
     *
     * @method Phaser.GameObjects.Video#playHandler
     * @fires Phaser.GameObjects.Events#VIDEO_PLAY
     * @since 3.20.0
     */
    playHandler: function ()
    {
        this._codePaused = false;
        this.touchLocked = false;

        this.emit(Events.VIDEO_PLAY, this);

        this.video.removeEventListener('playing', this._callbacks.play, true);
    },

    /**
     * This internal method is called automatically if the video fails to load.
     *
     * @method Phaser.GameObjects.Video#loadErrorHandler
     * @fires Phaser.GameObjects.Events#VIDEO_ERROR
     * @private
     * @since 3.20.0
     *
     * @param {Event} event - The error Event.
     */
    loadErrorHandler: function (event)
    {
        this.stop();

        this.emit(Events.VIDEO_ERROR, this, event);
    },

    /**
     * This internal method is called if the video couldn't be played because it was interaction locked
     * by the browser, but an input event has since been received.
     *
     * @method Phaser.GameObjects.Video#unlockHandler
     * @fires Phaser.GameObjects.Events#VIDEO_UNLOCKED
     * @fires Phaser.GameObjects.Events#VIDEO_PLAY
     * @private
     * @since 3.20.0
     *
     * @param {any} error - The Promise resolution error.
     */
    unlockHandler: function ()
    {
        this.touchLocked = false;
        this.playWhenUnlocked = false;

        this.emit(Events.VIDEO_UNLOCKED, this);

        if (this._markerIn > -1)
        {
            this.video.currentTime = this._markerIn;
        }

        this.video.play();

        this.emit(Events.VIDEO_PLAY, this);
    },

    /**
     * Called when the video completes playback, i.e. reaches an `ended` state.
     *
     * This will never happen if the video is coming from a live stream, where the duration is `Infinity`.
     *
     * @method Phaser.GameObjects.Video#completeHandler
     * @fires Phaser.GameObjects.Events#VIDEO_COMPLETE
     * @since 3.20.0
     */
    completeHandler: function ()
    {
        this.emit(Events.VIDEO_COMPLETE, this);
    },

    /**
     * Called when the video emits a `timeUpdate` event during playback.
     *
     * This event is too slow and irregular to be used for actual video timing or texture updating,
     * but we can use it to determine if a video has looped.
     *
     * @method Phaser.GameObjects.Video#timeUpdateHandler
     * @fires Phaser.GameObjects.Events#VIDEO_LOOP
     * @since 3.20.0
     */
    timeUpdateHandler: function ()
    {
        if (this.video && this.video.currentTime < this._lastUpdate)
        {
            this.emit(Events.VIDEO_LOOP, this);

            this._lastUpdate = 0;
        }
    },

    /**
     * The internal update step.
     *
     * @method Phaser.GameObjects.Video#preUpdate
     * @private
     * @since 3.20.0
     */
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
                    if (video.loop)
                    {
                        video.currentTime = this._markerIn;

                        this.updateTexture();

                        this._lastUpdate = currentTime;

                        this.emit(Events.VIDEO_LOOP, this);
                    }
                    else
                    {
                        this.emit(Events.VIDEO_COMPLETE, this);

                        this.stop();
                    }
                }
            }
        }
    },

    /**
     * Internal callback that monitors the download progress of a video after changing its source.
     *
     * @method Phaser.GameObjects.Video#checkVideoProgress
     * @fires Phaser.GameObjects.Events#VIDEO_TIMEOUT
     * @private
     * @since 3.20.0
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
                this.emit(Events.VIDEO_TIMEOUT, this);
            }
        }
    },

    /**
     * Internal method that is called when enough video data has been received in order to create a texture
     * from it. The texture is assigned to the `Video.videoTexture` property and given a base frame that
     * encompases the whole video size.
     *
     * @method Phaser.GameObjects.Video#updateTexture
     * @since 3.20.0
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

            this.emit(Events.VIDEO_CREATED, this, width, height);
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

    /**
     * Returns the key of the currently played video, as stored in the Video Cache.
     * If the video did not come from the cache this will return an empty string.
     *
     * @method Phaser.GameObjects.Video#getVideoKey
     * @since 3.20.0
     *
     * @return {string} The key of the video being played from the Video Cache, if any.
     */
    getVideoKey: function ()
    {
        return this._cacheKey;
    },

    /**
     * Seeks to a given point in the video. The value is given as a float between 0 and 1,
     * where 0 represents the start of the video and 1 represents the end.
     *
     * Seeking only works if the video has a duration, so will not work for live streams.
     *
     * When seeking begins, this video will emit a `seeking` event. When the video completes
     * seeking (i.e. reaches its designated timestamp) it will emit a `seeked` event.
     *
     * If you wish to seek based on time instead, use the `Video.setCurrentTime` method.
     *
     * @method Phaser.GameObjects.Video#seekTo
     * @since 3.20.0
     *
     * @param {number} value - The point in the video to seek to. A value between 0 and 1.
     *
     * @return {this} This Video Game Object for method chaining.
     */
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
     * A double-precision floating-point value indicating the current playback time in seconds.
     * If the media has not started to play and has not been seeked, this value is the media's initial playback time.
     *
     * @method Phaser.GameObjects.Video#getCurrentTime
     * @since 3.20.0
     *
     * @return {number} A double-precision floating-point value indicating the current playback time in seconds.
     */
    getCurrentTime: function ()
    {
        return (this.video) ? this.video.currentTime : 0;
    },

    /**
     * Seeks to a given playback time in the video. The value is given in _seconds_ or as a string.
     *
     * Seeking only works if the video has a duration, so will not work for live streams.
     *
     * When seeking begins, this video will emit a `seeking` event. When the video completes
     * seeking (i.e. reaches its designated timestamp) it will emit a `seeked` event.
     *
     * You can provide a string prefixed with either a `+` or a `-`, such as `+2.5` or `-2.5`.
     * In this case it will seek to +/- the value given, relative to the _current time_.
     *
     * If you wish to seek based on a duration percentage instead, use the `Video.seekTo` method.
     *
     * @method Phaser.GameObjects.Video#setCurrentTime
     * @since 3.20.0
     *
     * @param {(string|number)} value - The playback time to seek to in seconds. Can be expressed as a string, such as `+2` to seek 2 seconds ahead from the current time.
     *
     * @return {this} This Video Game Object for method chaining.
     */
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

    /**
     * Returns a boolean indicating if this Video is currently seeking, or not.
     *
     * @method Phaser.GameObjects.Video#isSeeking
     * @since 3.20.0
     *
     * @return {boolean} A boolean indicating if this Video is currently seeking, or not.
     */
    isSeeking: function ()
    {
        return this._isSeeking;
    },

    /**
     * Internal seeking handler.
     *
     * @method Phaser.GameObjects.Video#seekingHandler
     * @fires Phaser.GameObjects.Events#VIDEO_SEEKING
     * @private
     * @since 3.20.0
     */
    seekingHandler: function ()
    {
        this._isSeeking = true;

        this.emit(Events.VIDEO_SEEKING, this);
    },

    /**
     * Internal seeked handler.
     *
     * @method Phaser.GameObjects.Video#seekedHandler
     * @fires Phaser.GameObjects.Events#VIDEO_SEEKED
     * @private
     * @since 3.20.0
     */
    seekedHandler: function ()
    {
        this._isSeeking = false;

        this.emit(Events.VIDEO_SEEKED, this);

        var video = this.video;

        if (video)
        {
            this.updateTexture();
        }
    },

    /**
     * Returns the current progress of the video. Progress is defined as a value between 0 (the start)
     * and 1 (the end).
     *
     * Progress can only be returned if the video has a duration, otherwise it will always return zero.
     *
     * @method Phaser.GameObjects.Video#getProgress
     * @since 3.20.0
     *
     * @return {number} The current progress of playback. If the video has no duration, will always return zero.
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
     * A double-precision floating-point value which indicates the duration (total length) of the media in seconds,
     * on the media's timeline. If no media is present on the element, or the media is not valid, the returned value is NaN.
     *
     * If the media has no known end (such as for live streams of unknown duration, web radio, media incoming from WebRTC,
     * and so forth), this value is +Infinity.
     *
     * @method Phaser.GameObjects.Video#getDuration
     * @since 3.20.0
     *
     * @return {number} A double-precision floating-point value indicating the duration of the media in seconds.
     */
    getDuration: function ()
    {
        return (this.video) ? this.video.duration : 0;
    },

    /**
     * Sets the muted state of the currently playing video, if one is loaded.
     *
     * @method Phaser.GameObjects.Video#setMute
     * @since 3.20.0
     *
     * @param {boolean} [value=true] - The mute value. `true` if the video should be muted, otherwise `false`.
     *
     * @return {this} This Video Game Object for method chaining.
     */
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

    /**
     * Returns a boolean indicating if this Video is currently muted.
     *
     * @method Phaser.GameObjects.Video#isMuted
     * @since 3.20.0
     *
     * @return {boolean} A boolean indicating if this Video is currently muted, or not.
     */
    isMuted: function ()
    {
        return this._codeMuted;
    },

    /**
     * Internal global mute handler. Will mute the video, if playing, if the global sound system mutes.
     *
     * @method Phaser.GameObjects.Video#globalMute
     * @private
     * @since 3.20.0
     *
     * @param {(Phaser.Sound.WebAudioSoundManager|Phaser.Sound.HTML5AudioSoundManager)} soundManager - A reference to the Sound Manager that emitted the event.
     * @param {boolean} mute - The mute value. `true` if the Sound Manager is now muted, otherwise `false`.
     */
    globalMute: function (soundManager, value)
    {
        this._systemMuted = value;

        var video = this.video;

        if (video)
        {
            video.muted = (this._codeMuted) ? true : value;
        }
    },

    /**
     * Internal global pause handler. Will pause the video if the Game itself pauses.
     *
     * @method Phaser.GameObjects.Video#globalPause
     * @private
     * @since 3.20.0
     */
    globalPause: function ()
    {
        this._systemPaused = true;

        if (this.video)
        {
            this.video.pause();
        }
    },

    /**
     * Internal global resume handler. Will resume a paused video if the Game itself resumes.
     *
     * @method Phaser.GameObjects.Video#globalResume
     * @private
     * @since 3.20.0
     */
    globalResume: function ()
    {
        this._systemPaused = false;

        if (this.video && !this._codePaused)
        {
            this.video.play();
        }
    },

    /**
     * Sets the paused state of the currently loaded video.
     *
     * If the video is playing, calling this method with `true` will pause playback.
     * If the video is paused, calling this method with `false` will resume playback.
     *
     * If no video is loaded, this method does nothing.
     *
     * @method Phaser.GameObjects.Video#setPaused
     * @since 3.20.0
     *
     * @param {boolean} [value=true] - The paused value. `true` if the video should be paused, `false` to resume it.
     *
     * @return {this} This Video Game Object for method chaining.
     */
    setPaused: function (value)
    {
        if (value === undefined) { value = true; }

        var video = this.video;

        this._codePaused = value;

        if (video)
        {
            if (value)
            {
                if (!video.paused)
                {
                    video.pause();
                }
            }
            else if (!value)
            {
                if (video.paused && !this._systemPaused)
                {
                    video.play();
                }
            }
        }

        return this;
    },

    /**
     * Returns a double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
     *
     * @method Phaser.GameObjects.Video#getVolume
     * @since 3.20.0
     *
     * @return {number} A double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
     */
    getVolume: function ()
    {
        return (this.video) ? this.video.volume : 1;
    },

    /**
     * Sets the volume of the currently playing video.
     *
     * The value given is a double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
     *
     * @method Phaser.GameObjects.Video#setVolume
     * @since 3.20.0
     *
     * @param {number} [value=1] - A double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
     *
     * @return {this} This Video Game Object for method chaining.
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

    /**
     * Returns a double that indicates the rate at which the media is being played back.
     *
     * @method Phaser.GameObjects.Video#getPlaybackRate
     * @since 3.20.0
     *
     * @return {number} A double that indicates the rate at which the media is being played back.
     */
    getPlaybackRate: function ()
    {
        return (this.video) ? this.video.playbackRate : 1;
    },

    /**
     * Sets the playback rate of the current video.
     *
     * The value given is a double that indicates the rate at which the media is being played back.
     *
     * @method Phaser.GameObjects.Video#setPlaybackRate
     * @since 3.20.0
     *
     * @param {number} [rate] - A double that indicates the rate at which the media is being played back.
     *
     * @return {this} This Video Game Object for method chaining.
     */
    setPlaybackRate: function (rate)
    {
        if (this.video)
        {
            this.video.playbackRate = rate;
        }

        return this;
    },

    /**
     * Returns a boolean which indicates whether the media element should start over when it reaches the end.
     *
     * @method Phaser.GameObjects.Video#getLoop
     * @since 3.20.0
     *
     * @return {boolean} A boolean which indicates whether the media element will start over when it reaches the end.
     */
    getLoop: function ()
    {
        return (this.video) ? this.video.loop : false;
    },

    /**
     * Sets the loop state of the current video.
     *
     * The value given is a boolean which indicates whether the media element will start over when it reaches the end.
     *
     * Not all videos can loop, for example live streams.
     *
     * Please note that not all browsers support _seamless_ video looping for all encoding formats.
     *
     * @method Phaser.GameObjects.Video#setLoop
     * @since 3.20.0
     *
     * @param {boolean} [value=true] - A boolean which indicates whether the media element will start over when it reaches the end.
     *
     * @return {this} This Video Game Object for method chaining.
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
     * Returns a boolean which indicates whether the video is currently playing.
     *
     * @method Phaser.GameObjects.Video#isPlaying
     * @since 3.20.0
     *
     * @return {boolean} A boolean which indicates whether the video is playing, or not.
     */
    isPlaying: function ()
    {
        return (this.video) ? !(this.video.paused || this.video.ended) : false;
    },

    /**
     * Returns a boolean which indicates whether the video is currently paused.
     *
     * @method Phaser.GameObjects.Video#isPaused
     * @since 3.20.0
     *
     * @return {boolean} A boolean which indicates whether the video is paused, or not.
     */
    isPaused: function ()
    {
        return ((this.video && this.video.paused) || this._codePaused || this._systemPaused);
    },

    /**
     * Stores this Video in the Texture Manager using the given key as a dynamic texture,
     * which any texture-based Game Object, such as a Sprite, can use as its texture:
     *
     * ```javascript
     * var vid = this.add.video(0, 0, 'intro');
     *
     * vid.play();
     *
     * vid.saveTexture('doodle');
     *
     * this.add.image(400, 300, 'doodle');
     * ```
     *
     * The saved texture is automatically updated as the video plays. If you pause this video,
     * or change its source, then the saved texture updates instantly.
     *
     * Calling `saveTexture` again will not save another copy of the same texture, it will just rename the existing one.
     *
     * By default it will create a single base texture. You can add frames to the texture
     * by using the `Texture.add` method. After doing this, you can then allow Game Objects
     * to use a specific frame.
     *
     * If you intend to save the texture so you can use it as the input for a Shader, you may need to set the
     * `flipY` parameter to `true` if you find the video renders upside down in your shader.
     *
     * @method Phaser.GameObjects.Video#saveTexture
     * @since 3.20.0
     *
     * @param {string} key - The unique key to store the texture as within the global Texture Manager.
     * @param {boolean} [flipY=false] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y` during upload?
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
     * Stops the video playing and clears all internal event listeners.
     *
     * If you only wish to pause playback of the video, and resume it a later time, use the `Video.pause` method instead.
     *
     * If the video hasn't finished downloading, calling this method will not abort the download. To do that you need to
     * call `destroy` instead.
     *
     * @method Phaser.GameObjects.Video#stop
     * @fires Phaser.GameObjects.Events#VIDEO_STOP
     * @since 3.20.0
     *
     * @return {this} This Video Game Object for method chaining.
     */
    stop: function ()
    {
        var video = this.video;

        if (video)
        {
            var callbacks = this._callbacks;

            for (var callback in callbacks)
            {
                video.removeEventListener(callback, callbacks[callback], true);
            }

            video.pause();
        }

        if (this._retryID)
        {
            window.clearTimeout(this._retryID);
        }

        this.emit(Events.VIDEO_STOP, this);

        return this;
    },

    /**
     * Removes the Video element from the DOM by calling parentNode.removeChild on itself.
     *
     * Also removes the autoplay and src attributes and nulls the Video reference.
     *
     * You should not call this method if you were playing a video from the Video Cache that
     * you wish to play again in your game, or if another Video object is also using the same
     * video.
     *
     * If you loaded an external video via `Video.loadURL` then you should call this function
     * to clear up once you are done with the instance.
     *
     * @method Phaser.GameObjects.Video#removeVideoElement
     * @since 3.20.0
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
     * Handles the pre-destroy step for the Video object.
     *
     * This calls `Video.stop` and optionally `Video.removeVideoElement`.
     *
     * If any Sprites are using this Video as their texture it is up to you to manage those.
     *
     * @method Phaser.GameObjects.Video#preDestroy
     * @private
     * @since 3.21.0
     */
    preDestroy: function ()
    {
        this.stop();

        if (this.removeVideoElementOnDestroy)
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
