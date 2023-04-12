/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var Components = require('../components');
var Events = require('../events');
var GameEvents = require('../../core/events/');
var GameObject = require('../GameObject');
var MATH_CONST = require('../../math/const');
var SoundEvents = require('../../sound/events/');
var UUID = require('../../utils/string/UUID');
var VideoRender = require('./VideoRender');

/**
 * @classdesc
 * A Video Game Object.
 *
 * This Game Object is capable of handling playback of a video file, video stream or media stream.
 *
 * You can optionally 'preload' the video into the Phaser Video Cache:
 *
 * ```javascript
 * preload () {
 *   this.load.video('ripley', 'assets/aliens.mp4');
 * }
 *
 * create () {
 *   this.add.video(400, 300, 'ripley');
 * }
 * ```
 *
 * You don't have to 'preload' the video. You can also play it directly from a URL:
 *
 * ```javascript
 * create () {
 *   this.add.video(400, 300).loadURL('assets/aliens.mp4');
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
 * Playback is handled entirely via the Request Video Frame API, which is supported by most modern browsers.
 * A polyfill is provided for older browsers.
 *
 * ### Autoplaying Videos
 *
 * Videos can only autoplay if the browser has been unlocked with an interaction, or satisfies the MEI settings.
 * The policies that control autoplaying are vast and vary between browser. You can, and should, read more about
 * it here: https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
 *
 * If your video doesn't contain any audio, then set the `noAudio` parameter to `true` when the video is _loaded_,
 * and it will often allow the video to play immediately:
 *
 * ```javascript
 * preload () {
 *   this.load.video('pixar', 'nemo.mp4', true);
 * }
 * ```
 *
 * The 3rd parameter in the load call tells Phaser that the video doesn't contain any audio tracks. Video without
 * audio can autoplay without requiring a user interaction. Video with audio cannot do this unless it satisfies
 * the browsers MEI settings. See the MDN Autoplay Guide for further details.
 *
 * Or:
 *
 * ```javascript
 * create () {
 *   this.add.video(400, 300).loadURL('assets/aliens.mp4', true);
 * }
 * ```
 *
 * You can set the `noAudio` parameter to `true` even if the video does contain audio. It will still allow the video
 * to play immediately, but the audio will not start.
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
 * @extends Phaser.GameObjects.Components.PostPipeline
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
        Components.PostPipeline,
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
         *
         * Will be `undefined` until a video is loaded for playback.
         *
         * @name Phaser.GameObjects.Video#video
         * @type {?HTMLVideoElement}
         * @since 3.20.0
         */
        this.video;

        /**
         * The Phaser Texture this Game Object is using to render the video to.
         *
         * Will be `undefined` until a video is loaded for playback.
         *
         * @name Phaser.GameObjects.Video#videoTexture
         * @type {?Phaser.Textures.Texture}
         * @since 3.20.0
         */
        this.videoTexture;

        /**
         * A reference to the TextureSource backing the `videoTexture` Texture object.
         *
         * Will be `undefined` until a video is loaded for playback.
         *
         * @name Phaser.GameObjects.Video#videoTextureSource
         * @type {?Phaser.Textures.TextureSource}
         * @since 3.20.0
         */
        this.videoTextureSource;

        /**
         * A Phaser `CanvasTexture` instance that holds the most recent snapshot taken from the video.
         *
         * This will only be set if the `snapshot` or `snapshotArea` methods have been called.
         *
         * Until those methods are called, this property will be `undefined`.
         *
         * @name Phaser.GameObjects.Video#snapshotTexture
         * @type {?Phaser.Textures.CanvasTexture}
         * @since 3.20.0
         */
        this.snapshotTexture;

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
         * @readonly
         * @since 3.20.0
         */
        this.touchLocked = false;

        /**
         * Should the video auto play when document interaction is required and happens?
         *
         * @name Phaser.GameObjects.Video#playWhenUnlocked
         * @type {boolean}
         * @since 3.20.0
         */
        this.playWhenUnlocked = false;

        /**
         * Has the video created its texture and populated it with the first frame of video?
         *
         * @name Phaser.GameObjects.Video#frameReady
         * @type {boolean}
         * @since 3.60.0
         */
        this.frameReady = false;

        /**
         * This read-only property returns `true` if the video is currently stalled, i.e. it has stopped
         * playing due to a lack of data, or too much data, but hasn't yet reached the end of the video.
         *
         * This is set if the Video DOM element emits any of the following events:
         *
         * `stalled`
         * `suspend`
         * `waiting`
         *
         * And is cleared if the Video DOM element emits the `playing` event, or handles
         * a requestVideoFrame call.
         *
         * Listen for the Phaser Event `VIDEO_STALLED` to be notified and inspect the event
         * to see which DOM event caused it.
         *
         * Note that being stalled isn't always a negative thing. A video can be stalled if it
         * has downloaded enough data in to its buffer to not need to download any more until
         * the current batch of frames have rendered.
         *
         * @name Phaser.GameObjects.Video#isStalled
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.isStalled = false;

        /**
         * Records the number of times the video has failed to play,
         * typically because the user hasn't interacted with the page yet.
         *
         * @name Phaser.GameObjects.Video#failedPlayAttempts
         * @type {number}
         * @since 3.60.0
         */
        this.failedPlayAttempts = 0;

        /**
         * If the browser supports the Request Video Frame API then this
         * property will hold the metadata that is returned from
         * the callback each time it is invoked.
         *
         * See https://wicg.github.io/video-rvfc/#video-frame-metadata-callback
         * for a complete list of all properties that will be in this object.
         * Likely of most interest is the `mediaTime` property:
         *
         * The media presentation timestamp (PTS) in seconds of the frame presented
         * (e.g. its timestamp on the video.currentTime timeline). MAY have a zero
         * value for live-streams or WebRTC applications.
         *
         * If the browser doesn't support the API then this property will be undefined.
         *
         * @name Phaser.GameObjects.Video#metadata
         * @type {VideoFrameCallbackMetadata}
         * @since 3.60.0
         */
        this.metadata;

        /**
         * The current retry elapsed time.
         *
         * @name Phaser.GameObjects.Video#retry
         * @type {number}
         * @since 3.20.0
         */
        this.retry = 0;

        /**
         * If a video fails to play due to a lack of user interaction, this is the
         * amount of time, in ms, that the video will wait before trying again to
         * play. The default is 500ms.
         *
         * @name Phaser.GameObjects.Video#retryInterval
         * @type {number}
         * @since 3.20.0
         */
        this.retryInterval = 500;

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
            ended: this.completeHandler.bind(this),
            legacy: this.legacyPlayHandler.bind(this),
            playing: this.playingHandler.bind(this),
            seeked: this.seekedHandler.bind(this),
            seeking: this.seekingHandler.bind(this),
            stalled: this.stalledHandler.bind(this),
            suspend: this.stalledHandler.bind(this),
            waiting: this.stalledHandler.bind(this)
        };

        /**
         * The locally bound callback handler specifically for load and load error events.
         *
         * @name Phaser.GameObjects.Video#_loadCallbackHandler
         * @type {function}
         * @private
         * @since 3.60.0
         */
        this._loadCallbackHandler = this.loadErrorHandler.bind(this);

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
        this._markerIn = 0;

        /**
         * The out marker.
         *
         * @name Phaser.GameObjects.Video#_markerOut
         * @type {number}
         * @private
         * @since 3.20.0
         */
        this._markerOut = 0;

        /**
         * Are we playing a marked segment of the video?
         *
         * @name Phaser.GameObjects.Video#_playingMarker
         * @type {boolean}
         * @private
         * @since 3.60.0
         */
        this._playingMarker = false;

        /**
         * The previous frames mediaTime.
         *
         * @name Phaser.GameObjects.Video#_lastUpdate
         * @type {number}
         * @private
         * @since 3.60.0
        */
        this._lastUpdate = 0;

        /**
         * The key of the current video as stored in the Video cache.
         *
         * If the video did not come from the cache this will be an empty string.
         *
         * @name Phaser.GameObjects.Video#cacheKey
         * @type {string}
         * @readonly
         * @since 3.60.0
         */
        this.cacheKey = '';

        /**
         * Is the video currently seeking?
         *
         * This is set to `true` when the `seeking` event is fired,
         * and set to `false` when the `seeked` event is fired.
         *
         * @name Phaser.GameObjects.Video#isSeeking
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.isSeeking = false;

        /**
         * Has Video.play been called? This is reset if a new Video is loaded.
         *
         * @name Phaser.GameObjects.Video#_playCalled
         * @type {boolean}
         * @private
         * @since 3.60.0
         */
        this._playCalled = false;

        /**
         * The Callback ID returned by Request Video Frame.
         *
         * @name Phaser.GameObjects.Video#_rfvCallbackId
         * @type {number}
         * @private
         * @since 3.60.0
         */
        this._rfvCallbackId = 0;

        var game = scene.sys.game;

        /**
         * A reference to Device.Video.
         *
         * @name Phaser.GameObjects.Video#_device
         * @type {string[]}
         * @private
         * @since 3.60.0
         */
        this._device = game.device.video;

        this.setPosition(x, y);
        this.setSize(256, 256);
        this.initPipeline();
        this.initPostPipeline(true);

        game.events.on(GameEvents.PAUSE, this.globalPause, this);
        game.events.on(GameEvents.RESUME, this.globalResume, this);

        var sound = scene.sys.sound;

        if (sound)
        {
            sound.on(SoundEvents.GLOBAL_MUTE, this.globalMute, this);
        }

        if (key)
        {
            this.load(key);
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
     * Loads a Video from the Video Cache, ready for playback with the `Video.play` method.
     *
     * If a video is already playing, this method allows you to change the source of the current video element.
     * It works by first stopping the current video and then starts playback of the new source through the existing video element.
     *
     * The reason you may wish to do this is because videos that require interaction to unlock, remain in an unlocked
     * state, even if you change the source of the video. By changing the source to a new video you avoid having to
     * go through the unlock process again.
     *
     * @method Phaser.GameObjects.Video#load
     * @since 3.60.0
     *
     * @param {string} key - The key of the Video this Game Object will play, as stored in the Video Cache.
     *
     * @return {this} This Video Game Object for method chaining.
     */
    load: function (key)
    {
        var video = this.scene.sys.cache.video.get(key);

        if (video)
        {
            this.cacheKey = key;

            this.loadHandler(video.url, video.noAudio, video.crossOrigin);
        }
        else
        {
            console.warn('No video in cache for key: ' + key);
        }

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
        if (loop === undefined) { loop = false; }

        if (this.cacheKey !== key)
        {
            this.load(key);

            if (autoplay)
            {
                this.play(loop, markerIn, markerOut);
            }
        }
    },

    /**
     * Returns the key of the currently played video, as stored in the Video Cache.
     *
     * If the video did not come from the cache this will return an empty string.
     *
     * @method Phaser.GameObjects.Video#getVideoKey
     * @since 3.20.0
     *
     * @return {string} The key of the video being played from the Video Cache, if any.
     */
    getVideoKey: function ()
    {
        return this.cacheKey;
    },

    /**
     * Loads a Video from the given URL, ready for playback with the `Video.play` method.
     *
     * If a video is already playing, this method allows you to change the source of the current video element.
     * It works by first stopping the current video and then starts playback of the new source through the existing video element.
     *
     * The reason you may wish to do this is because videos that require interaction to unlock, remain in an unlocked
     * state, even if you change the source of the video. By changing the source to a new video you avoid having to
     * go through the unlock process again.
     *
     * @method Phaser.GameObjects.Video#loadURL
     * @since 3.60.0
     *
     * @param {(string|string[]|Phaser.Types.Loader.FileTypes.VideoFileURLConfig|Phaser.Types.Loader.FileTypes.VideoFileURLConfig[])} [urls] - The absolute or relative URL to load the video files from.
     * @param {boolean} [noAudio=false] - Does the video have an audio track? If not you can enable auto-playing on it.
     * @param {string} [crossOrigin] - The value to use for the `crossOrigin` property in the video load request.  Either undefined, `anonymous` or `use-credentials`. If no value is given, `crossorigin` will not be set in the request.
     *
     * @return {this} This Video Game Object for method chaining.
     */
    loadURL: function (urls, noAudio, crossOrigin)
    {
        if (noAudio === undefined) { noAudio = false; }

        var urlConfig = this._device.getVideoURL(urls);

        if (!urlConfig)
        {
            console.warn('No supported video format found for ' + urls);
        }
        else
        {
            this.cacheKey = '';

            this.loadHandler(urlConfig.url, noAudio, crossOrigin);
        }

        return this;
    },

    /**
     * Loads a Video from the given MediaStream object, ready for playback with the `Video.play` method.
     *
     * @method Phaser.GameObjects.Video#loadMediaStream
     * @since 3.50.0
     *
     * @param {string} stream - The MediaStream object.
     * @param {boolean} [noAudio=false] - Does the video have an audio track? If not you can enable auto-playing on it.
     * @param {string} [crossOrigin] - The value to use for the `crossOrigin` property in the video load request.  Either undefined, `anonymous` or `use-credentials`. If no value is given, `crossorigin` will not be set in the request.
     *
     * @return {this} This Video Game Object for method chaining.
     */
    loadMediaStream: function (stream, noAudio, crossOrigin)
    {
        return this.loadHandler(null, noAudio, crossOrigin, stream);
    },

    /**
     * Internal method that loads a Video from the given URL, ready for playback with the
     * `Video.play` method.
     *
     * Normally you don't call this method directly, but instead use the `Video.loadURL` method,
     * or the `Video.load` method if you have preloaded the video.
     *
     * Calling this method will skip checking if the browser supports the given format in
     * the URL, where-as the other two methods enforce these checks.
     *
     * @method Phaser.GameObjects.Video#loadHandler
     * @since 3.60.0
     *
     * @param {string} [url] - The absolute or relative URL to load the video file from. Set to `null` if passing in a MediaStream object.
     * @param {boolean} [noAudio] - Does the video have an audio track? If not you can enable auto-playing on it.
     * @param {string} [crossOrigin] - The value to use for the `crossOrigin` property in the video load request.  Either undefined, `anonymous` or `use-credentials`. If no value is given, `crossorigin` will not be set in the request.
     * @param {string} [stream] - A MediaStream object if this is playing a stream instead of a file.
     *
     * @return {this} This Video Game Object for method chaining.
     */
    loadHandler: function (url, noAudio, crossOrigin, stream)
    {
        if (!noAudio) { noAudio = false; }

        var video = this.video;

        if (video)
        {
            //  Re-use the existing video element

            this.removeLoadEventHandlers();

            this.stop();
        }
        else
        {
            video = document.createElement('video');

            video.controls = false;

            video.setAttribute('playsinline', 'playsinline');
            video.setAttribute('preload', 'auto');
            video.setAttribute('disablePictureInPicture', 'true');
        }

        if (noAudio)
        {
            video.muted = true;
            video.defaultMuted = true;

            video.setAttribute('autoplay', 'autoplay');
        }
        else
        {
            video.muted = false;
            video.defaultMuted = false;

            video.removeAttribute('autoplay');
        }

        if (!crossOrigin)
        {
            video.removeAttribute('crossorigin');
        }
        else
        {
            video.setAttribute('crossorigin', crossOrigin);
        }

        if (stream)
        {
            if ('srcObject' in video)
            {
                try
                {
                    video.srcObject = stream;
                }
                catch (err)
                {
                    if (err.name !== 'TypeError')
                    {
                        throw err;
                    }

                    video.src = URL.createObjectURL(stream);
                }
            }
            else
            {
                video.src = URL.createObjectURL(stream);
            }
        }
        else
        {
            video.src = url;
        }

        this.addLoadEventHandlers();

        this.retry = 0;
        this.video = video;

        this._playCalled = false;

        video.load();

        return this;
    },

    /**
     * This method handles the Request Video Frame callback.
     *
     * It is called by the browser when a new video frame is ready to be displayed.
     *
     * It's also responsible for the creation of the video texture, if it doesn't
     * already exist. If it does, it updates the texture as required.
     *
     * For more details about the Request Video Frame callback, see:
     * https://web.dev/requestvideoframecallback-rvfc
     *
     * @method Phaser.GameObjects.Video#requestVideoFrame
     * @fires Phaser.GameObjects.Events#VIDEO_CREATED
     * @fires Phaser.GameObjects.Events#VIDEO_LOOP
     * @fires Phaser.GameObjects.Events#VIDEO_COMPLETE
     * @fires Phaser.GameObjects.Events#VIDEO_PLAY
     * @fires Phaser.GameObjects.Events#VIDEO_TEXTURE
     * @since 3.60.0
     *
     * @param {DOMHighResTimeStamp} now - The current time in milliseconds.
     * @param {VideoFrameCallbackMetadata} metadata - Useful metadata about the video frame that was most recently presented for composition. See https://wicg.github.io/video-rvfc/#video-frame-metadata-callback
     */
    requestVideoFrame: function (now, metadata)
    {
        var video = this.video;

        if (!video)
        {
            return;
        }

        var width = metadata.width;
        var height = metadata.height;

        var texture = this.videoTexture;
        var textureSource = this.videoTextureSource;
        var newVideo = (!texture || textureSource.source !== video);

        if (newVideo)
        {
            //  First frame of a new video
            this._codePaused = video.paused;
            this._codeMuted = video.muted;

            if (!texture)
            {
                texture = this.scene.sys.textures.create(this._key, video, width, height);

                texture.add('__BASE', 0, 0, 0, width, height);

                this.setTexture(texture);

                this.videoTexture = texture;
                this.videoTextureSource = texture.source[0];

                this.videoTextureSource.setFlipY(this.flipY);

                this.emit(Events.VIDEO_TEXTURE, this, texture);
            }
            else
            {
                //  Re-use the existing texture
                textureSource.source = video;
                textureSource.width = width;
                textureSource.height = height;

                //  Resize base frame
                texture.get().setSize(width, height);
            }

            this.setSizeToFrame();
            this.updateDisplayOrigin();
        }
        else
        {
            textureSource.update();
        }

        this.isStalled = false;

        this.metadata = metadata;

        var currentTime = metadata.mediaTime;

        if (newVideo)
        {
            this._lastUpdate = currentTime;

            this.emit(Events.VIDEO_CREATED, this, width, height);

            if (!this.frameReady)
            {
                this.frameReady = true;

                this.emit(Events.VIDEO_PLAY, this);
            }
        }

        if (this._playingMarker)
        {
            if (currentTime >= this._markerOut)
            {
                if (video.loop)
                {
                    video.currentTime = this._markerIn;

                    this.emit(Events.VIDEO_LOOP, this);
                }
                else
                {
                    this.stop(false);

                    this.emit(Events.VIDEO_COMPLETE, this);
                }
            }
        }
        else if (currentTime < this._lastUpdate)
        {
            this.emit(Events.VIDEO_LOOP, this);
        }

        this._lastUpdate = currentTime;

        this._rfvCallbackId = this.video.requestVideoFrameCallback(this.requestVideoFrame.bind(this));
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
     *   this.load.video('pixar', 'nemo.mp4', true);
     * }
     * ```
     *
     * The 3rd parameter in the load call tells Phaser that the video doesn't contain any audio tracks. Video without
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
        if (markerIn === undefined) { markerIn = -1; }
        if (markerOut === undefined) { markerOut = MATH_CONST.MAX_SAFE_INTEGER; }

        var video = this.video;

        if (!video || this.isPlaying())
        {
            if (!video)
            {
                console.warn('Video not loaded');
            }

            return this;
        }

        //  We can reset these each time play is called, even if the video hasn't started yet

        if (loop === undefined) { loop = video.loop; }

        video.loop = loop;

        this._markerIn = markerIn;
        this._markerOut = markerOut;
        this._playingMarker = (markerIn > -1 && markerOut > markerIn && markerOut < MATH_CONST.MAX_SAFE_INTEGER);

        //  But we go no further if play has already been called

        if (!this._playCalled)
        {
            this._rfvCallbackId = video.requestVideoFrameCallback(this.requestVideoFrame.bind(this));

            this._playCalled = true;

            this.createPlayPromise();
        }

        return this;
    },

    /**
     * Adds the loading specific event handlers to the video element.
     *
     * @method Phaser.GameObjects.Video#addLoadEventHandlers
     * @since 3.60.0
     */
    addLoadEventHandlers: function ()
    {
        var video = this.video;

        if (video)
        {
            video.addEventListener('error', this._loadCallbackHandler);
            video.addEventListener('abort', this._loadCallbackHandler);
        }
    },

    /**
     * Removes the loading specific event handlers from the video element.
     *
     * @method Phaser.GameObjects.Video#removeLoadEventHandlers
     * @since 3.60.0
     */
    removeLoadEventHandlers: function ()
    {
        var video = this.video;

        if (video)
        {
            video.removeEventListener('error', this._loadCallbackHandler);
            video.removeEventListener('abort', this._loadCallbackHandler);
        }
    },

    /**
     * Adds the playback specific event handlers to the video element.
     *
     * @method Phaser.GameObjects.Video#addEventHandlers
     * @since 3.60.0
     */
    addEventHandlers: function ()
    {
        var video = this.video;

        //  Set these _after_ calling `video.play` or they don't fire
        //  (really useful, thanks browsers!)

        if (video)
        {
            var callbacks = this._callbacks;

            for (var callback in callbacks)
            {
                video.addEventListener(callback, callbacks[callback]);
            }
        }
    },

    /**
     * Removes the playback specific event handlers from the video element.
     *
     * @method Phaser.GameObjects.Video#removeEventHandlers
     * @since 3.60.0
     */
    removeEventHandlers: function ()
    {
        var video = this.video;

        if (video)
        {
            var callbacks = this._callbacks;

            for (var callback in callbacks)
            {
                video.removeEventListener(callback, callbacks[callback]);
            }
        }
    },

    /**
     * Creates the video.play promise and adds the success and error handlers to it.
     *
     * Not all browsers support the video.play promise, so this method will fall back to
     * the old-school way of handling the video.play call.
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play#browser_compatibility for details.
     *
     * @method Phaser.GameObjects.Video#createPlayPromise
     * @since 3.60.0
     *
     * @param {boolean} [catchError=true] - Should the error be caught and the video marked as failed to play?
     */
    createPlayPromise: function (catchError)
    {
        if (catchError === undefined) { catchError = true; }

        var video = this.video;

        var playPromise = video.play();

        if (playPromise !== undefined)
        {
            var success = this.playSuccess.bind(this);
            var error = this.playError.bind(this);

            if (!catchError)
            {
                var _this = this;

                error = function ()
                {
                    _this.failedPlayAttempts++;
                };
            }

            playPromise.then(success).catch(error);
        }
        else
        {
            //  Old-school fallback here for pre-2019 browsers
            video.addEventListener('playing', this._callbacks.legacy);

            if (!catchError)
            {
                this.failedPlayAttempts++;
            }
        }
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
        if (!isNaN(markerIn) && markerIn >= 0 && !isNaN(markerOut) && markerOut > markerIn)
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
     * This internal method is called automatically if the playback Promise resolves successfully.
     *
     * @method Phaser.GameObjects.Video#playSuccess
     * @fires Phaser.GameObjects.Events#VIDEO_UNLOCKED
     * @since 3.60.0
     */
    playSuccess: function ()
    {
        if (!this._playCalled)
        {
            //  The stop method has been called but the Promise has resolved
            //  after this, so we need to just abort.
            return;
        }

        this.addEventHandlers();

        this._codePaused = false;

        if (this.touchLocked)
        {
            this.touchLocked = false;

            this.emit(Events.VIDEO_UNLOCKED, this);
        }

        var sound = this.scene.sys.sound;

        if (sound && sound.mute)
        {
            //  Mute will be set based on the global mute state of the Sound Manager (if there is one)
            this.setMute(true);
        }

        if (this._markerIn > -1)
        {
            this.video.currentTime = this._markerIn;
        }
    },

    /**
     * This internal method is called automatically if the playback Promise fails to resolve.
     *
     * @method Phaser.GameObjects.Video#playError
     * @fires Phaser.GameObjects.Events#VIDEO_ERROR
     * @fires Phaser.GameObjects.Events#VIDEO_UNSUPPORTED
     * @fires Phaser.GameObjects.Events#VIDEO_LOCKED
     * @since 3.60.0
     *
     * @param {DOMException} error - The Promise DOM Exception error.
     */
    playError: function (error)
    {
        var name = error.name;

        if (name === 'NotAllowedError')
        {
            this.touchLocked = true;
            this.playWhenUnlocked = true;
            this.failedPlayAttempts = 1;

            this.emit(Events.VIDEO_LOCKED, this);
        }
        else if (name === 'NotSupportedError')
        {
            this.stop(false);

            this.emit(Events.VIDEO_UNSUPPORTED, this, error);
        }
        else
        {
            this.stop(false);

            this.emit(Events.VIDEO_ERROR, this, error);
        }
    },

    /**
     * Called when the video emits a `playing` event.
     *
     * This is the legacy handler for browsers that don't support Promise based playback.
     *
     * @method Phaser.GameObjects.Video#legacyPlayHandler
     * @since 3.60.0
     */
    legacyPlayHandler: function ()
    {
        var video = this.video;

        if (video)
        {
            this.playSuccess();

            video.removeEventListener('playing', this._callbacks.legacy);
        }
    },

    /**
     * Called when the video emits a `playing` event.
     *
     * @method Phaser.GameObjects.Video#playingHandler
     * @fires Phaser.GameObjects.Events#VIDEO_PLAYING
     * @since 3.60.0
     */
    playingHandler: function ()
    {
        this.isStalled = false;

        this.emit(Events.VIDEO_PLAYING, this);
    },

    /**
     * This internal method is called automatically if the video fails to load.
     *
     * @method Phaser.GameObjects.Video#loadErrorHandler
     * @fires Phaser.GameObjects.Events#VIDEO_ERROR
     * @since 3.20.0
     *
     * @param {Event} event - The error Event.
     */
    loadErrorHandler: function (event)
    {
        this.stop(false);

        this.emit(Events.VIDEO_ERROR, this, event);
    },

    /**
     * This internal method is called automatically if the video stalls, for whatever reason.
     *
     * @method Phaser.GameObjects.Video#stalledHandler
     * @fires Phaser.GameObjects.Events#VIDEO_STALLED
     * @since 3.60.0
     *
     * @param {Event} event - The error Event.
     */
    stalledHandler: function (event)
    {
        this.isStalled = true;

        this.emit(Events.VIDEO_STALLED, this, event);
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
        this._playCalled = false;

        this.emit(Events.VIDEO_COMPLETE, this);
    },

    /**
     * The internal update step.
     *
     * @method Phaser.GameObjects.Video#preUpdate
     * @private
     * @since 3.20.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time in ms since the last frame.
     */
    preUpdate: function (time, delta)
    {
        var video = this.video;

        if (!video || !this._playCalled)
        {
            return;
        }

        if (this.touchLocked && this.playWhenUnlocked)
        {
            this.retry += delta;

            if (this.retry >= this.retryInterval)
            {
                this.createPlayPromise(false);

                this.retry = 0;
            }
        }
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
     * Unfortunately, the DOM video element does not guarantee frame-accurate seeking.
     * This has been an ongoing subject of discussion: https://github.com/w3c/media-and-entertainment/issues/4
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
     *
     * If the media has not started to play and has not been seeked, this value is the media's initial playback time.
     *
     * For a more accurate value, use the `Video.metadata.mediaTime` property instead.
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
        }

        return this;
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
        this.isSeeking = true;

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
        this.isSeeking = false;

        this.emit(Events.VIDEO_SEEKED, this);
    },

    /**
     * Returns the current progress of the video as a float.
     *
     * Progress is defined as a value between 0 (the start) and 1 (the end).
     *
     * Progress can only be returned if the video has a duration. Some videos,
     * such as those coming from a live stream, do not have a duration. In this
     * case the method will return -1.
     *
     * @method Phaser.GameObjects.Video#getProgress
     * @since 3.20.0
     *
     * @return {number} The current progress of playback. If the video has no duration, will always return -1.
     */
    getProgress: function ()
    {
        var video = this.video;

        if (video)
        {
            var duration = video.duration;

            if (duration !== Infinity && !isNaN(duration))
            {
                return video.currentTime / duration;
            }
        }

        return -1;
    },

    /**
     * A double-precision floating-point value which indicates the duration (total length) of the media in seconds,
     * on the media's timeline. If no media is present on the element, or the media is not valid, the returned value is NaN.
     *
     * If the media has no known end (such as for live streams of unknown duration, web radio, media incoming from WebRTC,
     * and so forth), this value is +Infinity.
     *
     * If no video has been loaded, this method will return 0.
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

        if (this.video && !this.video.ended)
        {
            this.removeEventHandlers();

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

        if (this.video && !this._codePaused && !this.video.ended)
        {
            this.createPlayPromise();
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
     * If the video has not yet been played, `Video.play` will be called with no parameters.
     *
     * If the video has ended, this method will do nothing.
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

        if (video && !video.ended)
        {
            if (value)
            {
                if (!video.paused)
                {
                    this.removeEventHandlers();

                    video.pause();
                }
            }
            else if (!value)
            {
                if (!this._playCalled)
                {
                    this.play();
                }
                else if (video.paused && !this._systemPaused)
                {
                    this.createPlayPromise();
                }
            }
        }

        return this;
    },

    /**
     * Pauses the current Video, if one is playing.
     *
     * If no video is loaded, this method does nothing.
     *
     * Call `Video.resume` to resume playback.
     *
     * @method Phaser.GameObjects.Video#pause
     * @since 3.60.0
     *
     * @return {this} This Video Game Object for method chaining.
     */
    pause: function ()
    {
        return this.setPaused(true);
    },

    /**
     * Resumes the current Video, if one was previously playing and has been paused.
     *
     * If no video is loaded, this method does nothing.
     *
     * Call `Video.pause` to pause playback.
     *
     * @method Phaser.GameObjects.Video#resume
     * @since 3.60.0
     *
     * @return {this} This Video Game Object for method chaining.
     */
    resume: function ()
    {
        return this.setPaused(false);
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
        return ((this.video && this._playCalled && this.video.paused) || this._codePaused || this._systemPaused);
    },

    /**
     * Stores this Video in the Texture Manager using the given key as a dynamic texture,
     * which any texture-based Game Object, such as a Sprite, can use as its source:
     *
     * ```javascript
     * const vid = this.add.video(0, 0, 'intro');
     *
     * vid.play();
     *
     * vid.saveTexture('doodle');
     *
     * this.add.image(400, 300, 'doodle');
     * ```
     *
     * If the video is not yet playing then you need to listen for the `TEXTURE_READY` event before
     * you can use this texture on a Game Object:
     *
     * ```javascript
     * const vid = this.add.video(0, 0, 'intro');
     *
     * vid.play();
     *
     * vid.once('textureready', (video, texture, key) => {
     *
     *     this.add.image(400, 300, key);
     *
     * });
     *
     * vid.saveTexture('doodle');
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
     * @return {boolean} Returns `true` if the texture is available immediately, otherwise returns `false` and you should listen for the `TEXTURE_READY` event.
     */
    saveTexture: function (key, flipY)
    {
        if (flipY === undefined) { flipY = false; }

        if (this.videoTexture)
        {
            this.scene.sys.textures.renameTexture(this._key, key);
            this.videoTextureSource.setFlipY(flipY);
        }

        this._key = key;
        this.flipY = flipY;

        return (this.videoTexture) ? true : false;
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
     * @param {boolean} [emitStopEvent=true] - Should the `VIDEO_STOP` event be emitted?
     *
     * @return {this} This Video Game Object for method chaining.
     */
    stop: function (emitStopEvent)
    {
        if (emitStopEvent === undefined) { emitStopEvent = true; }

        var video = this.video;

        if (video)
        {
            this.removeEventHandlers();

            video.cancelVideoFrameCallback(this._rfvCallbackId);

            video.pause();
        }

        this.retry = 0;
        this._playCalled = false;

        if (emitStopEvent)
        {
            this.emit(Events.VIDEO_STOP, this);
        }

        return this;
    },

    /**
     * Removes the Video element from the DOM by calling parentNode.removeChild on itself.
     *
     * Also removes the autoplay and src attributes and nulls the `Video.video` reference.
     *
     * If you loaded an external video via `Video.loadURL` then you should call this function
     * to clear up once you are done with the instance, but don't want to destroy this
     * Video Game Object.
     *
     * This method is called automatically by `Video.destroy`.
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
        this.stop(false);

        this.removeLoadEventHandlers();

        this.removeVideoElement();

        var game = this.scene.sys.game.events;

        game.off(GameEvents.PAUSE, this.globalPause, this);
        game.off(GameEvents.RESUME, this.globalResume, this);

        var sound = this.scene.sys.sound;

        if (sound)
        {
            sound.off(SoundEvents.GLOBAL_MUTE, this.globalMute, this);
        }
    }

});

module.exports = Video;
