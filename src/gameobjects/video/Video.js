/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var UUID = require('../../utils/string/UUID');
var VideoRender = require('./VideoRender');

/**
 * @classdesc
 * A Video Game Object.
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

    function Video (scene, x, y, key)
    {
        GameObject.call(this, scene, 'Video');

        var textureKey = UUID();

        this.snapshot = scene.sys.textures.createCanvas(textureKey, 8, 8);

        /**
         * @property {HTMLVideoElement} video - The HTML Video Element that is added to the document.
         */
        this.video = null;
        this.videoTexture = null;
        this.videoTextureSource = null;

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
        this.playWhenUnlocked = true;

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
         * @property {boolean} _pending - Internal var tracking play pending.
         * @private
         * @default
         */
        this._pending = false;

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

        /**
         * @property {function} _endCallback - The addEventListener ended function.
         * @private
         */
        this._endCallback = null;

        /**
         * @property {function} _playCallback - The addEventListener playing function.
         * @private
         */
        this._playCallback = null;

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.GameObjects.Image#_crop
         * @type {object}
         * @private
         * @since 3.11.0
         */
        this._crop = this.resetCropObject();

        // if (this.game.device.needsTouchUnlock())
        // {
        //     this.setTouchLock();
        // }
        // else if (_video)
        // {
        //     _video.locked = false;
        // }
    


        this.setTexture(textureKey);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin(0.5, 0.5);
        this.initPipeline();

        var ctx = this.texture.context;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, 8, 8);

        this.texture.refresh();
    },

    /**
     * Starts this video playing.
     *
     * If the video is already playing, or has been queued to play with `changeSource` then this method just returns.
     *
     * @method Phaser.Video#play
     * @param {boolean} [loop=false] - Should the video loop automatically when it reaches the end? Please note that at present some browsers (i.e. Chrome) do not support *seamless* video looping.
     * @param {number} [playbackRate=1] - The playback rate of the video. 1 is normal speed, 2 is x2 speed, and so on. You cannot set a negative playback rate.
     * @return {Phaser.Video} This Video object for method chaining.
     */
    play: function (loop, playbackRate)
    {
        if (loop === undefined) { loop = false; }
        if (playbackRate === undefined) { playbackRate = 1; }

        if (this._pendingChangeSource)
        {
            return this;
        }

        // if (this.game.sound.onMute)
        // {
        //     this.game.sound.onMute.add(this.setMute, this);
        //     this.game.sound.onUnMute.add(this.unsetMute, this);

        //     if (this.game.sound.mute)
        //     {
        //         this.setMute();
        //     }
        // }

        // this.game.onPause.add(this.setPause, this);
        // this.game.onResume.add(this.setResume, this);

        this._endCallback = this.complete.bind(this);

        this.video.addEventListener('ended', this._endCallback, true);
        this.video.addEventListener('webkitendfullscreen', this._endCallback, true);

        if (loop)
        {
            this.video.loop = 'loop';
        }
        else
        {
            this.video.loop = '';
        }

        this.video.playbackRate = playbackRate;

        if (this.touchLocked)
        {
            this._pending = true;
        }
        else
        {
            this._pending = false;

            if (this.key !== null)
            {
                if (this.video.readyState !== 4)
                {
                    this.retry = this.retryLimit;
                    this._retryID = window.setTimeout(this.checkVideoProgress.bind(this), this.retryInterval);
                }
                else
                {
                    this._playCallback = this.playHandler.bind(this);
                    this.video.addEventListener('playing', this._playCallback, true);
                }
            }

            this.video.play();

            // this.onPlay.dispatch(this, loop, playbackRate);
        }

        return this;
    },

    /**
     * Called when the video starts to play. Updates the texture.
     *
     * @method Phaser.Video#playHandler
     * @private
     */
    playHandler: function ()
    {
        this.video.removeEventListener('playing', this._playCallback, true);

        this.updateTexture();
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
        // if (this.game.sound.onMute)
        // {
        //     this.game.sound.onMute.remove(this.setMute, this);
        //     this.game.sound.onUnMute.remove(this.unsetMute, this);
        // }

        // this.game.onPause.remove(this.setPause, this);
        // this.game.onResume.remove(this.setResume, this);

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
        else
        {
            this.video.removeEventListener('ended', this._endCallback, true);
            this.video.removeEventListener('webkitendfullscreen', this._endCallback, true);
            this.video.removeEventListener('playing', this._playCallback, true);

            if (this.touchLocked)
            {
                this._pending = false;
            }
            else
            {
                this.video.pause();
            }
        }

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
        var newSize = false;

        if (width === undefined || width === null) { width = this.video.videoWidth; newSize = true; }
        if (height === undefined || height === null) { height = this.video.videoHeight; }

        //  First we'll update our current CanvasTexture
        if (newSize)
        {
            this.texture.setSize(width, height);
        }

        if (!this.videoTexture)
        {
            this.videoTexture = this.scene.sys.textures.create(UUID(), this.video, width, height);
            this.videoTextureSource = this.videoTexture.source[0];
            this.videoTexture.add('__BASE', 0, 0, 0, width, height);
        }
        else
        {
            var textureSource = this.videoTextureSource;

            textureSource.source = this.video;
            textureSource.width = width;
            textureSource.height = height;
        }

        //  Swap out the canvas texture for the video texture
        // this.canvasTexture = this.texture;
        // this.canvasFrame = this.frame;

        this.texture = this.videoTexture;
        this.frame = this.videoTexture.get();

        this.setSizeToFrame();
        this.setOriginFromFrame();

        if (this._autoplay)
        {
            this.video.play();
        }
    },

    preUpdate: function ()
    {
        if (this.videoTextureSource && this.playing)
        {
            this.videoTextureSource.update();
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
        return (this.video) ? !(this.video.paused && this.video.ended) : false;
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

        if (clear)
        {
            this.snapshot.clear();
        }

        //  Set globalAlpha
        //  Set blendMode

        this.snapshot.draw(0, 0, this.video);

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

        // if (this.touchLocked)
        // {
        //     this.game.input.removeTouchLockCallback(this.unlock, this);
        // }

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
            return (this.video) ? !(this.video.paused && this.video.ended) : false;
        }

    }

});

module.exports = Video;
