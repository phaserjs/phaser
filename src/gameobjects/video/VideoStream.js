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
var GameObject = require('../GameObject');
var SoundEvents = require('../../sound/events/');
var UUID = require('../../utils/string/UUID');
var VideoRender = require('./VideoRender');
var MATH_CONST = require('../../math/const');

/**
 * @classdesc
 * A Video Game Object.
 * 
 * This Game Object is capable of handling playback of a video from a live video stream, organized over webRTC, which is left to its own concern.
 * This work is largely copied directly from the Video game object type, with affordances given to the creation and handling of elements as it relates to the live stream process.
 *
 * @class VideoStream
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
 */
var VideoStream = new Class({

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

    function VideoStream (scene, x, y)
    {
        GameObject.call(this, scene, 'VideoStream');
        this.key = null;
        this._mediaStream = null;
        /**
         * A reference to the HTML Video Element this Video Game Object is playing.
         * Will be `null` until a video is loaded for playback.
         *
         * @name Phaser.GameObjects.VideoStream#video
         * @type {?HTMLVideoElement}
         * @since 3.20.0
         */
        this.video = null;

        /**
         * The Phaser Texture this Game Object is using to render the video to.
         * Will be `null` until a video is loaded for playback.
         *
         * @name Phaser.GameObjects.VideoStream#videoTexture
         * @type {?Phaser.Textures.Texture}
         * @since 3.20.0
         */
        this.videoTexture = null;

        /**
         * A reference to the TextureSource belong to the `videoTexture` Texture object.
         * Will be `null` until a video is loaded for playback.
         *
         * @name Phaser.GameObjects.VideoStream#videoTextureSource
         * @type {?Phaser.Textures.TextureSource}
         * @since 3.20.0
         */
        this.videoTextureSource = null;

        /**
         * A Phaser CanvasTexture instance that holds the most recent snapshot taken from the video.
         * This will only be set if `snapshot` or `snapshotArea` have been called, and will be `null` until that point.
         *
         * @name Phaser.GameObjects.VideoStream#snapshotTexture
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
         * @name Phaser.GameObjects.VideoStream#flipY
         * @type {boolean}
         * @since 3.20.0
         */
        this.flipY = false;

        /**
         * The key used by the texture as stored in the Texture Manager.
         *
         * @name Phaser.GameObjects.VideoStream#_key
         * @type {string}
         * @private
         * @since 3.20.0
         */
        this._key = UUID();

        /**
         * An internal flag holding the current state of the video lock, should document interaction be required
         * before playback can begin.
         *
         * @name Phaser.GameObjects.VideoStream#touchLocked
         * @type {boolean}
         * @since 3.20.0
         */
        this.touchLocked = true;

        /**
         * Should the video auto play when document interaction is required and happens?
         *
         * @name Phaser.GameObjects.VideoStream#playWhenUnlocked
         * @type {boolean}
         * @since 3.20.0
         */
        this.playWhenUnlocked = false;

        /**
         * When starting playback of a video Phaser will monitor its `readyState` using a `setTimeout` call.
         * The `setTimeout` happens once every `Video.retryInterval` ms. It will carry on monitoring the video
         * state in this manner until the `retryLimit` is reached and then abort.
         *
         * @name Phaser.GameObjects.VideoStreamStream#retryLimit
         * @type {integer}
         * @since 3.20.0
         */
        this.retryLimit = 20;

        /**
         * The current retry attempt.
         *
         * @name Phaser.GameObjects.VideoStream#retry
         * @type {integer}
         * @since 3.20.0
         */
        this.retry = 0;

        /**
         * The number of ms between each retry while monitoring the ready state of a downloading video.
         *
         * @name Phaser.GameObjects.VideoStream#retryInterval
         * @type {integer}
         * @since 3.20.0
         */
        this.retryInterval = 500;

        /**
         * The setTimeout callback ID.
         *
         * @name Phaser.GameObjects.VideoStream#_retryID
         * @type {integer}
         * @private
         * @since 3.20.0
         */
        this._retryID = null;

        /**
         * The video was muted due to a system event, such as the game losing focus.
         *
         * @name Phaser.GameObjects.VideoStream#_systemMuted
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._systemMuted = false;

        /**
         * The video was muted due to game code, not a system event.
         *
         * @name Phaser.GameObjects.VideoStream#_codeMuted
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._codeMuted = false;

        /**
         * The video was paused due to a system event, such as the game losing focus.
         *
         * @name Phaser.GameObjects.VideoStream#_systemPaused
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._systemPaused = false;

        /**
         * The video was paused due to game code, not a system event.
         *
         * @name Phaser.GameObjects.VideoStream#_codePaused
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._codePaused = false;

        /**
         * The locally bound event callback handlers.
         *
         * @name Phaser.GameObjects.VideoStream#_callbacks
         * @type {any}
         * @private
         * @since 3.20.0
         */
        this._callbacks = {
           
        };

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.GameObjects.VideoStream#_crop
         * @type {object}
         * @private
         * @since 3.20.0
         */
        this._crop = this.resetCropObject();

        /**
         * An object containing in and out markers for sequence playback.
         *
         * @name Phaser.GameObjects.VideoStream#markers
         * @type {any}
         * @since 3.20.0
         */
        this.markers = {};

        /**
         * The in marker.
         *
         * @name Phaser.GameObjects.VideoStream#_markerIn
         * @type {integer}
         * @private
         * @since 3.20.0
         */
        this._markerIn = -1;

        /**
         * The out marker.
         *
         * @name Phaser.GameObjects.VideoStream#_markerOut
         * @type {integer}
         * @private
         * @since 3.20.0
         */
        this._markerOut = MATH_CONST.MAX_SAFE_INTEGER;

        /**
         * The last time the TextureSource was updated.
         *
         * @name Phaser.GameObjects.VideoStream#_lastUpdate
         * @type {integer}
         * @private
         * @since 3.20.0
         */
        this._lastUpdate = 0;

        /**
         * The key of the video being played from the Video cache, if any.
         *
         * @name Phaser.GameObjects.VideoStream#_cacheKey
         * @type {string}
         * @private
         * @since 3.20.0
         */
        this._cacheKey = '';

        /**
         * Is the video currently seeking?
         *
         * @name Phaser.GameObjects.VideoStream#_isSeeking
         * @type {boolean}
         * @private
         * @since 3.20.0
         */
        this._isSeeking = false;

        /**
         * Should the Video element that this Video is using, be removed from the DOM
         * when this Video is destroyed?
         *
         * @name Phaser.GameObjects.VideoStream#removeVideoElementOnDestroy
         * @type {boolean}
         * @since 3.21.0
         */
        this.removeVideoElementOnDestroy = false;
        this.is_ready = false;
        this.setPosition(x, y);
        this.initPipeline();
        this.video = null;
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
     * @method Phaser.GameObjects.VideoStream#play
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
        var video = this.video;

        if (!video)
        {
            console.warn('Video not loaded');

            return this;
        }

        video.play();

        return this;
    },

    /**
     * Loads a Video from the given URL, ready for playback with the `Video.play` method.
     * 
     * You can control at what point the browser determines the video as being ready for playback via
     * the `loadEvent` parameter. See https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
     * for more details.
     *
     * @method Phaser.GameObjects.VideoStream#loadURL
     * @since 3.20.0
     * 
     * @param {string} url - The URL of the video to load or be streamed.
     * @param {string} [loadEvent='loadeddata'] - The load event to listen for. Either `loadeddata`, `canplay` or `canplaythrough`.
     * @param {boolean} [noAudio=false] - Does the video have an audio track? If not you can enable auto-playing on it.
     * 
     * @return {this} This Video Game Object for method chaining.
     */
    loadMediaStream: function (videoElement)
    {

        if (this.videoTexture)
        {
            this.scene.sys.textures.remove(this._key);
        }


         
        this.is_ready = true;
        this.video = videoElement;
        this.video.play();
        return this;
    },

    /**
     * Called when the video emits a `timeUpdate` event during playback.
     * 
     * This event is too slow and irregular to be used for actual video timing or texture updating,
     * but we can use it to determine if a video has looped.
     *
     * @method Phaser.GameObjects.VideoStream#timeUpdateHandler
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
     * @method Phaser.GameObjects.VideoStream#preUpdate
     * @private
     * @since 3.20.0
     */
    preUpdate: function ()
    {
      if (this.video) {
        this.updateTexture();
      }
      
    },

    /**
     * Internal callback that monitors the download progress of a video after changing its source.
     *
     * @method Phaser.GameObjects.VideoStream#checkVideoProgress
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
     * @method Phaser.GameObjects.VideoStream#updateTexture
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
     * @method Phaser.GameObjects.VideoStream#getVideoKey
     * @since 3.20.0
     * 
     * @return {string} The key of the video being played from the Video Cache, if any.
     */
    getVideoKey: function ()
    {
        return this._cacheKey;
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
     * @method Phaser.GameObjects.VideoStream#saveTexture
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
     * @method Phaser.GameObjects.VideoStream#removeVideoElement
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
     * @method Phaser.GameObjects.VideoStream#preDestroy
     * @private
     * @since 3.21.0
     */
    preDestroy: function ()
    {
        if (this.removeVideoElementOnDestroy)
        {
            this.removeVideoElement();
        }
    }

});

module.exports = VideoStream;