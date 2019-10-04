/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
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
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
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

    function Video (scene, x, y, key, url)
    {
        GameObject.call(this, scene, 'Video');

        /**
         * @property {HTMLVideoElement} video - The HTML Video Element that is added to the document.
         */
        this.video = null;

        this.videoTexture = null;

        this.videoTextureSource = null;

        this._key = UUID();

        this.snapshot = null;

        /**
         * @property {boolean} touchLocked - true if this video is currently locked awaiting a touch event. This happens on some mobile devices, such as iOS.
         * @default
         */
        this.touchLocked = false;

        /**
         * Start playing the video when it's unlocked.
         * @property {boolean} playWhenUnlocked
         * @default
         */
        this.playWhenUnlocked = false;

        /**
         * @property {integer} timeout - The amount of ms allowed to elapsed before the Video.onTimeout signal is dispatched while waiting for webcam access.
         * @default
         */
        this.timeout = 15000;

        /**
         * @property {integer} _timeOutID - setTimeout ID.
         * @private
         */
        this._timeOutID = null;

        /**
         * @property {MediaStream} videoStream - The Video Stream data. Only set if this Video is streaming from the webcam via `startMediaStream`.
         */
        this.videoStream = null;

        /**
         * @property {boolean} isStreaming - Is there a streaming video source? I.e. from a webcam.
         */
        this.isStreaming = false;

        /**
         * When starting playback of a video Phaser will monitor its readyState using a setTimeout call.
         * The setTimeout happens once every `Video.retryInterval` ms. It will carry on monitoring the video
         * state in this manner until the `retryLimit` is reached and then abort.
         * @property {integer} retryLimit
         * @default
         */
        this.retryLimit = 20;

        /**
         * @property {integer} retry - The current retry attempt.
         * @default
         */
        this.retry = 0;

        /**
         * @property {integer} retryInterval - The number of ms between each retry at monitoring the status of a downloading video.
         * @default
         */
        this.retryInterval = 500;

        /**
         * @property {integer} _retryID - The callback ID of the retry setTimeout.
         * @private
         */
        this._retryID = null;

        /**
         * @property {boolean} _codeMuted - Internal mute tracking var.
         * @private
         * @default
         */
        this._codeMuted = false;

        /**
         * @property {boolean} _muted - Internal mute tracking var.
         * @private
         * @default
         */
        this._muted = false;

        /**
         * @property {boolean} _codePaused - Internal paused tracking var.
         * @private
         * @default
         */
        this._codePaused = false;

        /**
         * @property {boolean} _paused - Internal paused tracking var.
         * @private
         * @default
         */
        this._paused = false;

        /**
         * @property {boolean} _pendingChangeSource - Internal var tracking play pending.
         * @private
         * @default
         */
        this._pendingChangeSource = false;

        /**
         * @property {boolean} _autoplay - Internal var tracking autoplay when changing source.
         * @private
         * @default
         */
        this._autoplay = false;

        this._noAudio = false;

        this._callbacks = {
            end: this.completeHandler.bind(this),
            play: this.playHandler.bind(this),
            time: this.timeUpdateHandler.bind(this)
        };

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.GameObjects.Image#_crop
         * @type {object}
         * @private
         * @since 3.11.0
         */
        this._crop = this.resetCropObject();

        this._textureState = 0;

        this.setPosition(x, y);
        this.initPipeline();

        if (key)
        {
            var _video = scene.sys.cache.video.get(key);

            if (_video)
            {
                this.video = _video;
            }
        }
        else if (url)
        {
            this.createVideoFromURL(url);
        }

        var game = scene.sys.game.events;

        game.on(GameEvents.PAUSE, this.pause, this);
        game.on(GameEvents.RESUME, this.resume, this);

        var sound = scene.sys.sound;

        if (sound)
        {
            sound.on(SoundEvents.GLOBAL_MUTE, this.globalMute, this);
        }
    },

    setNoAudio: function (value)
    {
        if (value === undefined) { value = true; }

        this._noAudio = value;

        return this;
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
     * If your video doesn't contain any audio, then set the `noAudio` parameter to `true` and it will often allow the
     * video the play immediately.
     * 
     * If you do need to hear the audio in your video, then you'll have to assume that the video cannot start playing until
     * the user has interacted with the browser.
     *
     * @method Phaser.Video#play
     * @param {boolean} [loop=false] - Should the video loop automatically when it reaches the end? Please note that at present some browsers (i.e. Chrome) do not support *seamless* video looping.
     * @param {number} [playbackRate=1] - The playback rate of the video. 1 is normal speed, 2 is x2 speed, and so on. You cannot set a negative playback rate.
     * @return {Phaser.Video} This Video object for method chaining.
     */
    play: function (loop, noAudio, playbackRate)
    {
        if (loop === undefined) { loop = false; }
        if (noAudio === undefined) { noAudio = false; }
        if (playbackRate === undefined) { playbackRate = 1; }

        if (this._pendingChangeSource || (this.touchLocked && this.playWhenUnlocked) || this.isPlaying())
        {
            return this;
        }

        this._noAudio = noAudio;

        if (noAudio)
        {
            //  Always overrides what the SoundManager is doing
            this.setMute(true);
        }
        else
        {
            var sound = this.scene.sys.sound;
            
            if (!sound || (sound && !sound.mute))
            {
                this.setMute(false);
            }
        }

        this.video.loop = (loop) ? 'loop' : '';

        this.video.playbackRate = playbackRate;

        this.video.addEventListener('ended', this._callbacks.end, true);
        this.video.addEventListener('webkitendfullscreen', this._callbacks.end, true);
        this.video.addEventListener('timeupdate', this._callbacks.time, true);
        this.video.addEventListener('playing', this._callbacks.play, true);
    
        if (this.video.readyState !== 4)
        {
            this.retry = this.retryLimit;

            this._retryID = window.setTimeout(this.checkVideoProgress.bind(this), this.retryInterval);

            this.video.play();
        }
        else
        {
            this._textureState = 0;

            var playPromise = this.video.play();

            if (playPromise !== undefined)
            {
                playPromise.then(this.playSuccessHandler.bind(this)).catch(this.playErrorHandler.bind(this));
            }
        }

        return this;
    },

    playSuccessHandler: function ()
    {
        this.touchLocked = false;
    },

    playErrorHandler: function (error)
    {
        this.scene.sys.input.once('pointerdown', this.unlockHandler, this);

        this.touchLocked = true;
        this.playWhenUnlocked = true;

        this.emit('error', error);
    },

    unlockHandler: function ()
    {
        this.touchLocked = false;
        this.playWhenUnlocked = false;

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
    },

    timeUpdateHandler: function ()
    {
        this._textureState++;

        this.video.removeEventListener('timeupdate', this._callbacks.time, true);
    },

    /**
     * Called when the video starts to play. Updates the texture.
     *
     * @method Phaser.Video#playHandler
     * @private
     */
    playHandler: function ()
    {
        this._textureState++;
        
        this.video.removeEventListener('playing', this._callbacks.play, true);
    },

    preUpdate: function ()
    {
        if (this._textureState === 3 && this.playing)
        {
            this.videoTextureSource.update();
        }
        else if (this._textureState === 2)
        {
            this.updateTexture();
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

        if (this.isStreaming)
        {
            if (this.video.mozSrcObject)
            {
                this.video.mozSrcObject.stop();
                this.video.src = null;
            }
            else if (this.video.srcObject)
            {
                this.video.srcObject.stop();
                this.video.src = null;
            }
            else
            {
                this.video.src = '';

                if (this.videoStream.active)
                {
                    this.videoStream.active = false;
                }
                else
                if (this.videoStream.getTracks)
                {
                    this.videoStream.getTracks().forEach(function (track)
                    {
                        track.stop();
                    });
                }
                else
                {
                    this.videoStream.stop();
                }
            }

            this.videoStream = null;
            this.isStreaming = false;
        }
        else if (this.video)
        {
            this.video.removeEventListener('ended', this._callbacks.end, true);
            this.video.removeEventListener('webkitendfullscreen', this._callbacks.end, true);
            this.video.removeEventListener('timeupdate', this._callbacks.time, true);
            this.video.removeEventListener('playing', this._callbacks.play, true);

            if (!this.touchLocked)
            {
                this.video.pause();
            }
        }

        return this;
    },

    /**
     * Creates a new Video element from the given Blob. The Blob must contain the video data in the correct encoded format.
     * This method is typically called by the Phaser.Loader and Phaser.Cache for you, but is exposed publicly for convenience.
     *
     * @method Phaser.Video#createVideoFromBlob
     * @param {Blob} blob - The Blob containing the video data.
     * @return {Phaser.Video} This Video object for method chaining.
     */
    createVideoFromBlob: function (blob)
    {
        var _this = this;

        this.video = document.createElement('video');
        this.video.controls = false;
        this.video.setAttribute('autoplay', 'autoplay');
        this.video.setAttribute('playsinline', 'playsinline');
        this.video.addEventListener('loadeddata', function (event) { _this.updateTexture(event); }, true);
        this.video.src = window.URL.createObjectURL(blob);
        this.video.canplay = true;

        return this;
    },

    /**
     * Creates a new Video element from the given URL.
     *
     * @method Phaser.Video#createVideoFromURL
     * @param {string} url - The URL of the video.
     * @param {boolean} [autoplay=false] - Automatically start the video?
     * @return {Phaser.Video} This Video object for method chaining.
     */
    createVideoFromURL: function (url, autoplay)
    {
        if (autoplay === undefined) { autoplay = false; }

        this.video = document.createElement('video');
        this.video.controls = false;

        if (autoplay)
        {
            this.video.setAttribute('autoplay', 'autoplay');
        }

        this.video.src = url;

        this.video.canplay = true;

        this.video.load();

        this.retry = this.retryLimit;

        this._retryID = window.setTimeout(this.checkVideoProgress.bind(this), this.retryInterval);

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
        if (this.video.readyState === 4)
        {
            this._pendingChangeSource = false;

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
                console.warn('Phaser.Video: Unable to start downloading video in time', this.isStreaming);
            }
        }
    },

    /**
     * Called automatically if the video source changes and updates the internal texture dimensions.
     * Then dispatches the onChangeSource signal.
     *
     * @method Phaser.Video#updateTexture
     * @param {object} [event] - The event which triggered the texture update.
     * @param {integer} [width] - The new width of the video. If undefined `video.videoWidth` is used.
     * @param {integer} [height] - The new height of the video. If undefined `video.videoHeight` is used.
     */
    updateTexture: function (event, width, height)
    {
        if (width === undefined || width === null) { width = this.video.videoWidth; }
        if (height === undefined || height === null) { height = this.video.videoHeight; }

        if (!this.videoTexture)
        {
            this.videoTexture = this.scene.sys.textures.create(this._key, this.video, width, height);
            this.videoTextureSource = this.videoTexture.source[0];
            this.videoTexture.add('__BASE', 0, 0, 0, width, height);

            this.texture = this.videoTexture;
            this.frame = this.videoTexture.get();
    
            this.setSizeToFrame();
            this.setOriginFromFrame();
    
            this._textureState = 3;

            this.emit('created', this, width, height);
        }
        else
        {
            var textureSource = this.videoTextureSource;

            textureSource.source = this.video;
            textureSource.width = width;
            textureSource.height = height;
        }
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
        if (this.video)
        {
            this.video.currentTime = value;
        }

        return this;
    },

    /**
     * @name Phaser.Video#duration
     * @property {number} duration - The duration of the video in seconds.
     * @readOnly
     */
    getDuration: function ()
    {
        return (this.video) ? this.video.duration : 0;
    },

    /**
     * @name Phaser.Video#progress
     * @property {number} progress - The progress of this video. This is a value between 0 and 1, where 0 is the start and 1 is the end of the video.
     * @readOnly
     */
    getProgress: function ()
    {
        return (this.video) ? (this.video.currentTime / this.video.duration) : 0;
    },

    isMuted: function ()
    {
        return this._muted;
    },

    globalMute: function (soundManager, value)
    {
        this.setMute(value);
    },

    setMute: function (value)
    {
        if (value === undefined) { value = true; }

        if (value)
        {
            if (!this._muted)
            {
                this._muted = true;
                this._codeMuted = true;
    
                if (this.video)
                {
                    this.video.muted = true;
                }
            }
        }
        else
        {
            // eslint-disable-next-line no-lonely-if
            if (this._muted)
            {
                this._muted = false;
                this._codeMuted = false;
    
                if (this.video)
                {
                    this.video.muted = false;
                }
            }
        }

        return this;
    },

    pause: function ()
    {
        if (this._paused || this.touchLocked)
        {
            return this;
        }

        this._codePaused = true;
        this._paused = true;

        if (this.video)
        {
            this.video.pause();
        }

        return this;
    },

    resume: function ()
    {
        if (!this._paused || this._codePaused || this.touchLocked)
        {
            return this;
        }

        this._codePaused = false;
        this._paused = false;

        if (this.video && !this.video.ended)
        {
            this.video.play();
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

        if (value < 0)
        {
            value = 0;
        }
        else if (value > 1)
        {
            value = 1;
        }

        if (this.video)
        {
            this.video.volume = value;
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
     * Please note that at present some browsers (i.e. Chrome) do not support *seamless* video looping.
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
            this.video.loop = (value) ? 'loop' : '';
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
    saveTexture: function (key)
    {
        if (this.videoTexture)
        {
            this.scene.sys.textures.renameTexture(this._key, key);
        }

        this._key = key;

        return this.videoTexture;
    },

    /**
     * Grabs the current frame from the Video or Video Stream and renders it to the Video.snapshot BitmapData.
     *
     * You can optionally set if the BitmapData should be cleared or not, the alpha and the blend mode of the draw.
     *
     * If you need more advanced control over the grabbing them call `Video.snapshot.copy` directly with the same parameters as BitmapData.copy.
     *
     * @method Phaser.Video#grab
     * @param {boolean} [clear=false] - Should the BitmapData be cleared before the Video is grabbed? Unless you are using alpha or a blend mode you can usually leave this set to false.
     * @param {number} [alpha=1] - The alpha that will be set on the video before drawing. A value between 0 (fully transparent) and 1, opaque.
     * @param {string} [blendMode=null] - The composite blend mode that will be used when drawing. The default is no blend mode at all. This is a Canvas globalCompositeOperation value such as 'lighter' or 'xor'.
     * @return {Phaser.BitmapData} A reference to the Video.snapshot BitmapData object for further method chaining.
     */
    grab: function (clear, alpha, blendMode)
    {
        if (clear === undefined) { clear = false; }
        if (alpha === undefined) { alpha = 1; }
        if (blendMode === undefined) { blendMode = null; }

        var source = this.videoTextureSource;
        var width = (source) ? source.width : 128;
        var height = (source) ? source.height : 128;

        if (!this.snapshot)
        {
            this.snapshot = this.scene.sys.textures.createCanvas(UUID(), width, height);
        }
        else if (this.snapshot.width !== width || this.snapshot.height !== height)
        {
            this.snapshot.setSize(width, height);
        }

        if (clear)
        {
            this.snapshot.clear();
        }

        if (source)
        {
            //  Set globalAlpha
            //  Set blendMode

            this.snapshot.draw(0, 0, source.image);
        }

        return this.snapshot;
    },

    /**
     * Removes the Video element from the DOM by calling parentNode.removeChild on itself.
     * Also removes the autoplay and src attributes and nulls the reference.
     *
     * @method Phaser.Video#removeVideoElement
     */
    removeVideoElement: function ()
    {
        if (!this.video)
        {
            return;
        }

        if (this.video.parentNode)
        {
            this.video.parentNode.removeChild(this.video);
        }

        while (this.video.hasChildNodes())
        {
            this.video.removeChild(this.video.firstChild);
        }

        this.video.removeAttribute('autoplay');
        this.video.removeAttribute('src');

        this.video = null;
    },

    /**
     * Destroys the Video object. This calls `Video.stop` and then `Video.removeVideoElement`.
     * If any Sprites are using this Video as their texture it is up to you to manage those.
     *
     * @method Phaser.Video#destroy
     */
    destroy: function ()
    {
        this.stop();

        this.removeVideoElement();

        var game = this.scene.sys.game.events;

        game.off(GameEvents.PAUSE, this.pause, this);
        game.off(GameEvents.RESUME, this.resume, this);

        var sound = this.scene.sys.sound;

        if (sound)
        {
            sound.off(SoundEvents.GLOBAL_MUTE, this.globalMute, this);
        }

        if (this._retryID)
        {
            window.clearTimeout(this._retryID);
        }
    },

    /**
     * @name Phaser.Video#playing
     * @property {boolean} playing - True if the video is currently playing (and not paused or ended), otherwise false.
     * @readOnly
     */
    playing: {

        get: function ()
        {
            return (this.video) ? !(this.video.paused || this.video.ended) : false;
        }

    }

});

module.exports = Video;
