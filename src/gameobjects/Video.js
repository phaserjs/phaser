/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Video object that takes a previously loaded Video from the Phaser Cache and handles playback of it.
* 
* Alternatively it takes a getUserMedia feed from an active webcam and streams the contents of that to
* the Video instead.
* 
* This can be applied to a Sprite as a texture. If multiple Sprites share the same Video texture and playback
* changes (i.e. you pause the video, or seek to a new time) then this change will be seen across all Sprites simultaneously.
* 
* If you need each Sprite to be able to play a video fully independently then you will need one Video object per Sprite.
* Please understand the obvious performance implications of doing this, and the memory required to hold videos in RAM.
*
* On some mobile browsers such as iOS Safari, you cannot play a video until the user has explicitly touched the screen.
* This works in the same way as audio unlocking. Phaser will handle the touch unlocking for you, however unlike with audio
* it's worth noting that every single Video needs to be touch unlocked, not just the first one. You can use the `changeSource`
* method to try and work around this limitation, but see the method help for details.
*
* Small screen devices, especially iPod and iPhone will launch the video in its own native video player, 
* outside of the Safari browser. There is no way to avoid this, it's a device imposed limitation.
*
* @class Phaser.Video
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {string|null} key - The key of the video file in the Phaser.Cache that this Video object should use. If null a `getUserMedia` video stream will be established instead.
* @param {boolean} [captureAudio=false] - If the key is null this controls if audio should be captured along with video in the video stream.
* @param {integer} [width] - If the key is null this width is used to create the video stream. If not provided the video width will be set to the width of the webcam input source.
* @param {integer} [height] - If the key is null this height is used to create the video stream. If not provided the video height will be set to the height of the webcam input source.
*/
Phaser.Video = function (game, key, captureAudio, width, height) {

    if (typeof key === 'undefined') { key = null; }
    if (typeof captureAudio === 'undefined') { captureAudio = false; }

    console.log('create video', key);

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {string} key - The key of the Video in the Cache, if stored there.
    */
    this.key = key;

    /**
    * @property {number} width - The width of the video in pixels.
    */
    this.width = (width) ? width : 0;

    /**
    * @property {number} height - The height of the video in pixels.
    */
    this.height = (height) ? height : 0;

    /**
    * @property {HTMLVideoElement} video - The HTML Video Element that is added to the document.
    */
    this.video = null;

    /**
    * @property {MediaStream} videoStream - The Video Stream data. Only set if this Video is streaming from the webcam via `createVideoStream`.
    */
    this.videoStream = null;

    this.isStreaming = false;

    if (key === null)
    {
        this.createVideoStream(captureAudio, width, height);
    }
    else
    {
        var _video = this.game.cache.getVideo(key);

        if (_video.isBlob)
        {
            this.createVideoFromBlob(_video.data);
        }
        else
        {
            this.video = _video.data;
        }

        this.width = this.video.videoWidth;
        this.height = this.video.videoHeight;
    }

    /**
    * @property {PIXI.BaseTexture} baseTexture - The PIXI.BaseTexture.
    * @default
    */
    this.baseTexture = new PIXI.BaseTexture(this.video);
    this.baseTexture.forceLoaded(this.width, this.height);

    /**
    * @property {PIXI.Texture} texture - The PIXI.Texture.
    * @default
    */
    this.texture = new PIXI.Texture(this.baseTexture);

    /**
    * @property {Phaser.Frame} textureFrame - The Frame this video uses for rendering.
    * @default
    */
    this.textureFrame = new Phaser.Frame(0, 0, 0, this.width, this.height, 'video');

    this.texture.setFrame(this.textureFrame);

    this.texture.valid = false;

    if (key !== null && this.video)
    {
        console.log('canplay?', this.key, 'cp', this.video.canplay, this.width, this.height);
        this.texture.valid = this.video.canplay;
    }

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.VIDEO;

    /**
    * @property {boolean} disableTextureUpload - If true this video will never send its image data to the GPU when its dirty flag is true. This only applies in WebGL.
    */
    this.disableTextureUpload = false;

    /**
    * @property {Phaser.Signal} onPlay - This signal is dispatched when the Video starts to play. It sends 3 parameters: a reference to the Video object, if the video is set to loop or not and the playback rate.
    */
    this.onPlay = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onChangeSource - This signal is dispatched if the Video source is changed. It sends 3 parameters: a reference to the Video object and the new width and height of the new video source.
    */
    this.onChangeSource = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onComplete - This signal is dispatched when the Video completes playback, i.e. enters an 'ended' state. Videos set to loop will never dispatch this signal.
    */
    this.onComplete = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onAccess - This signal is dispatched if the user allows access to their webcam.
    */
    this.onAccess = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onError - This signal is dispatched if an error occurs either getting permission to use the webcam (for a Video Stream) or when trying to play back a video file.
    */
    this.onError = new Phaser.Signal();

    /**
    * @property {boolean} touchLocked - true if this video is currently locked awaiting a touch event. This happens on some mobile devices, such as iOS.
    * @default
    */
    this.touchLocked = false;

    /**
    * A snapshot grabbed from the video. This is initially black. Populate it by calling Video.grab().
    * When called the BitmapData is updated with a grab taken from the current video playing or active video stream.
    * If Phaser has been compiled without BitmapData support this property will always be `null`.
    * 
    * @property {Phaser.BitmapData} snapshot
    * @readOnly
    */
    this.snapshot = null;

    if (Phaser.BitmapData)
    {
        this.snapshot = new Phaser.BitmapData(this.game, '', this.width, this.height);
    }

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
    * @property {boolean} _autoplay - Internal var tracking autoplay when changing source.
    * @private
    * @default
    */
    this._autoplay = false;

    if (!this.game.device.cocoonJS && (this.game.device.iOS || this.game.device.android) || (window['PhaserGlobal'] && window['PhaserGlobal'].fakeiOSTouchLock))
    {
        this.setTouchLock();
    }
    else
    {
        if (_video)
        {
            _video.locked = false;
        }
    }

};

Phaser.Video.prototype = {

    /**
     * Instead of playing a video file this method allows you to stream video data from an attached webcam.
     *
     * As soon as this method is called the user will be prompted by their browser to "Allow" access to the webcam.
     * If they allow it the webcam feed is directed to this Video. Call `Video.play` to start the stream.
     *
     * If they block the webcam the onError signal will be dispatched containing the NavigatorUserMediaError event.
     *
     * You can optionally set a width and height for the stream. If set the input will be cropped to these dimensions.
     * If not given then as soon as the stream has enough data the video dimensions will be changed to match the webcam device.
     * You can listen for this with the onChangeSource signal.
     *
     * @method Phaser.Video#createVideoStream
     * @param {boolean} [captureAudio=false] - Controls if audio should be captured along with video in the video stream.
     * @param {integer} [width] - The width is used to create the video stream. If not provided the video width will be set to the width of the webcam input source.
     * @param {integer} [height] - The height is used to create the video stream. If not provided the video height will be set to the height of the webcam input source.
     * @return {Phaser.Video} This Video object for method chaining.
     */
    createVideoStream: function (captureAudio, width, height) {

        if (typeof captureAudio === 'undefined') { captureAudio = false; }
        if (typeof width === 'undefined') { width = null; }
        if (typeof height === 'undefined') { height = null; }

        if (!this.game.device.getUserMedia)
        {
            return false;
        }

        this.video = document.createElement("video");

        this.video.setAttribute('autoplay', 'autoplay');

        // this.video.controls = false;
        // this.video.autoplay = false;
        // this.video.canplay = false;

        if (width !== null)
        {
            this.video.width = width;
        }

        if (height !== null)
        {
            this.video.height = height;
        }

        if (!navigator.getUserMedia)
        {
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        }

        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

        var self = this;

        console.log('createVideoStream', width, height);

        navigator.getUserMedia({ 
            "audio": captureAudio, 
            "video": true
        },
        function(stream) {

            self.videoStream = stream;

            //  attach the stream to the video

            // Set the source of the video element with the stream from the camera
            if (self.video.mozSrcObject !== undefined)
            {
                self.video.mozSrcObject = stream;
            }
            else
            {
                self.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            }

            self.video.play();
        },
        function(err) {
            self.onError.dispatch(self, err);
        });

        // this.video.addEventListener('loadeddata', function (event) { self.streamLoaded(event); }, false);

        this.video.addEventListener('loadeddata', function () {

            var retry = 10;

            function checkStream () {

                if (retry > 0)
                {
                    if (self.video.videoWidth > 0)
                    {
                        // Patch for Firefox bug where the height can't be read from the video
                        var width = self.video.videoWidth

                        if (isNaN(self.video.videoHeight))
                        {
                            var height = width / (4/3);
                        }

                        console.log('checkStream', retry);
                        self.isStreaming = true;
                        self.updateTexture(null, width, height);
                        self.onAccess.dispatch(self);
                    }
                    else
                    {
                        window.setTimeout(checkStream, 500);
                    }
                }
                else
                {
                    console.warn('Unable to connect to video stream. Webcam error?');
                }

                retry--;
            }

            checkStream();

        }, false);

        return this;

    },

/*
    streamLoaded: function (event) {

        console.log('mozStreamLoaded', arguments);

        if (!this.isStreaming)
        {
            this.video.removeEventListener('canplay', this.mozStreamLoaded, false);

            this.texture.valid = true;

            if (this.video)
            {
                console.log('vwh', this.video.videoWidth, this.video.videoHeight);
            }
      
            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.

            if (this.video.videoHeight)
if (isNaN(height)) {
          height = width / (4/3);
        }

            this.isStreaming = true;
        }

        this.updateTexture();

    },
*/

    /**
     * Creates a new Video element from the given Blob. The Blob must contain the video data in the correct encoded format.
     * This method is typically called by the Phaser.Loader and Phaser.Cache for you, but is exposed publicly for convenience.
     *
     * @method Phaser.Video#createVideoFromBlob
     * @param {Blob} blob - The Blob containing the video data: `Blob([new Uint8Array(data)])`
     * @return {Phaser.Video} This Video object for method chaining.
     */
    createVideoFromBlob: function (blob) {

        var _this = this;

        this.video = document.createElement("video");
        this.video.controls = false;
        this.video.setAttribute('autoplay', 'autoplay');
        this.video.addEventListener('loadeddata', function (event) { _this.updateTexture(event); }, true);
        this.video.src = window.URL.createObjectURL(blob);
        this.video.canplay = true;

        return this;

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
    updateTexture: function (event, width, height) {

        var change = false;

        if (typeof width === 'undefined' || width === null) { width = this.video.videoWidth; change = true; }
        if (typeof height === 'undefined' || height === null) { height = this.video.videoHeight; }

        this.width = width;
        this.height = height;

        console.log('updateTexture ---', this.key, change);
        console.log(width, height);

        this.baseTexture.forceLoaded(width, height);

        this.texture.frame.resize(width, height);
        this.texture.width = width;
        this.texture.height = height;
        this.texture.valid = true;

        if (this.snapshot)
        {
            this.snapshot.resize(width, height);
        }

        if (change && this.key !== null)
        {
            this.video.removeEventListener('canplaythrough', this.updateTexture.bind(this));

            this.onChangeSource.dispatch(this, width, height);

            if (this._autoplay)
            {
                this.video.play();
                this.onPlay.dispatch(this, this.loop, this.playbackRate);
            }
        }

    },

    /**
     * Called when the video completes playback (reaches and ended state).
     * Dispatches the Video.onComplete signal.
     *
     * @method Phaser.Video#complete
     */
    complete: function () {

        this.onComplete.dispatch(this);

    },

    /**
     * Starts this video playing if it's not already doing so.
     *
     * @method Phaser.Video#play
     * @param {boolean} [loop=false] - Should the video loop automatically when it reaches the end? Please note that at present some browsers (i.e. Chrome) do not support *seamless* video looping.
     * @param {number} [playbackRate=1] - The playback rate of the video. 1 is normal speed, 2 is x2 speed, and so on. You cannot set a negative playback rate.
     * @return {Phaser.Video} This Video object for method chaining.
     */
    play: function (loop, playbackRate) {

        console.log('play ---', this.key);

        if (typeof loop === 'undefined') { loop = false; }
        if (typeof playbackRate === 'undefined') { playbackRate = 1; }

        if (this.game.sound.onMute)
        {
            this.game.sound.onMute.add(this.setMute, this);
            this.game.sound.onUnMute.add(this.unsetMute, this);

            if (this.game.sound.mute)
            {
                this.setMute();
            }
        }

        this.game.onPause.add(this.setPause, this);
        this.game.onResume.add(this.setResume, this);

        this.video.addEventListener('ended', this.complete.bind(this), true);

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
                this.video.addEventListener('playing', this.playHandler.bind(this), true);
            }

            this.video.play();

            this.onPlay.dispatch(this, loop, playbackRate);
        }

        return this;

    },

    // canPlayHandler: function () {
    playHandler: function () {

        // console.log('canPlayHandler ---', this.key);
        console.log('playHandler ---', this.key);

        // this.video.removeEventListener('canplay', this.canPlayHandler.bind(this));
        // this.video.removeEventListener('canplaythrough', this.canPlayHandler.bind(this));
        // this.video.removeEventListener('playing', this.canPlayHandler.bind(this));
        this.video.removeEventListener('playing', this.playHandler.bind(this));

        // this.video.canplay = true;

        // if (this.width !== this.texture.width || this.width !== this.baseTexture.width)

        // this.width = width;
        // this.height = height;

        this.updateTexture();

        // this.onPlay.dispatch(this, this.loop, this.playbackRate);

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
    stop: function () {

        if (this.game.sound.onMute)
        {
            this.game.sound.onMute.remove(this.setMute, this);
            this.game.sound.onUnMute.remove(this.unsetMute, this);
        }

        this.game.onPause.remove(this.setPause, this);
        this.game.onResume.remove(this.setResume, this);

        //  Stream or file?

        if (this.videoStream)
        {
            if (this.video.mozSrcObject)
            {
                this.video.mozSrcObject.stop();
                this.video.src = null;
            }
            else
            {
                this.video.src = "";
                this.videoStream.stop();
            }

            this.videoStream = null;
        }
        else
        {
            this.video.removeEventListener('ended', this.complete.bind(this));

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
    * Updates the given Display Objects so they use this Video as their texture.
    * This will replace any texture they will currently have set.
    *
    * @method Phaser.Video#add
    * @param {Phaser.Sprite|Phaser.Sprite[]|Phaser.Image|Phaser.Image[]} object - Either a single Sprite/Image or an Array of Sprites/Images.
    * @return {Phaser.Video} This Video object for method chaining.
    */
    add: function (object) {

        if (Array.isArray(object))
        {
            for (var i = 0; i < object.length; i++)
            {
                if (object[i]['loadTexture'])
                {
                    object[i].loadTexture(this);
                }
            }
        }
        else
        {
            object.loadTexture(this);
        }

        return this;

    },

    /**
    * Creates a new Phaser.Image object, assigns this Video to be its texture, adds it to the world then returns it.
    *
    * @method Phaser.Video#addToWorld
    * @param {number} [x=0] - The x coordinate to place the Image at.
    * @param {number} [y=0] - The y coordinate to place the Image at.
    * @param {number} [anchorX=0] - Set the x anchor point of the Image. A value between 0 and 1, where 0 is the top-left and 1 is bottom-right.
    * @param {number} [anchorY=0] - Set the y anchor point of the Image. A value between 0 and 1, where 0 is the top-left and 1 is bottom-right.
    * @param {number} [scaleX=1] - The horizontal scale factor of the Image. A value of 1 means no scaling. 2 would be twice the size, and so on.
    * @param {number} [scaleY=1] - The vertical scale factor of the Image. A value of 1 means no scaling. 2 would be twice the size, and so on.
    * @return {Phaser.Image} The newly added Image object.
    */
    addToWorld: function (x, y, anchorX, anchorY, scaleX, scaleY) {

        scaleX = scaleX || 1;
        scaleY = scaleY || 1;

        var image = this.game.add.image(x, y, this);

        image.anchor.set(anchorX, anchorY);
        image.scale.set(scaleX, scaleY);

        return image;

    },

    /**
    * If the game is running in WebGL this will push the texture up to the GPU if it's dirty.
    * This is called automatically if the Video is being used by a Sprite, otherwise you need to remember to call it in your render function.
    * If you wish to suppress this functionality set Video.disableTextureUpload to `true`.
    *
    * @method Phaser.Video#render
    */
    render: function () {

        if (!this.disableTextureUpload && this.playing)
        {
            this.baseTexture.dirty();
        }

    },

    /**
    * Internal handler called automatically by the Video.mute setter.
    *
    * @method Phaser.Video#setMute
    * @private
    */
    setMute: function () {

        if (this._muted)
        {
            return;
        }

        this._muted = true;

        this.video.muted = true;

    },

    /**
    * Internal handler called automatically by the Video.mute setter.
    *
    * @method Phaser.Video#unsetMute
    * @private
    */
    unsetMute: function () {

        if (!this._muted || this._codeMuted)
        {
            return;
        }

        this._muted = false;

        this.video.muted = false;

    },

    /**
    * Internal handler called automatically by the Video.paused setter.
    *
    * @method Phaser.Video#setPause
    * @private
    */
    setPause: function () {

        if (this._paused || this.touchLocked)
        {
            return;
        }

        this._paused = true;

        this.video.pause();

    },

    /**
    * Internal handler called automatically by the Video.paused setter.
    *
    * @method Phaser.Video#setResume
    * @private
    */
    setResume: function () {

        if (!this._paused || this._codePaused || this.touchLocked)
        {
            return;
        }

        this._paused = false;

        if (!this.video.ended)
        {
            this.video.play();
        }

    },

    /**
     * On some mobile browsers you cannot play a video until the user has explicitly touched the video to allow it.
     * Phaser handles this via the `setTouchLock` method. However if you have 3 different videos, maybe an "Intro", "Start" and "Game Over"
     * split into three different Video objects, then you will need the user to touch-unlock every single one of them.
     * 
     * You can avoid this by using just one Video object and simply changing the video source. Once a Video element is unlocked it remains
     * unlocked, even if the source changes. So you can use this to your benefit to avoid forcing the user to 'touch' the video yet again.
     *
     * As you'd expect there are limitations. So far we've found that the videos need to be in the same encoding format and bitrate.
     * This method will automatically handle a change in video dimensions, but if you try swapping to a different bitrate we've found it
     * cannot render the new video on iOS (desktop browsers cope better).
     *
     * When the video source is changed the video file is requested over the network. Listen for the `onChangeSource` signal to know
     * when the new video has downloaded enough content to be able to be played. Previous settings such as the volume and loop state
     * are adopted automatically by the new video.
     *
     * @method Phaser.Video#changeSource
     * @param {string} src - The new URL to change the video.src to.
     * @param {boolean} [autoplay=true] - Should the video play automatically after the source has been updated?
     * @return {Phaser.Video} This Video object for method chaining.
     */
    changeSource: function (src, autoplay) {

        console.log('changeSource', this.key);

        if (typeof autoplay === 'undefined') { autoplay = true; }

        this.video.pause();

        this.video.addEventListener('canplaythrough', this.updateTexture.bind(this), true);

        this.video.src = src;

        this.video.load();

        this._autoplay = autoplay;

        if (!autoplay)
        {
            this.paused = true;
        }

        return this;

    },

    /**
    * Sets the Input Manager touch callback to be Video.unlock.
    * Required for mobile video unlocking. Mostly just used internally.
    * 
    * @method Phaser.Video#setTouchLock
    */
    setTouchLock: function () {

        this.game.input.touch.addTouchLockCallback(this.unlock, this);
        this.touchLocked = true;

    },

    /**
    * Enables the video on mobile devices, usually after the first touch.
    * If the SoundManager hasn't been unlocked then this will automatically unlock that as well.
    * Only one video can be pending unlock at any one time.
    * 
    * @method Phaser.Video#unlock
    */
    unlock: function () {

        this.touchLocked = false;

        this.video.play();

        this.onPlay.dispatch(this, this.loop, this.playbackRate);

        if (this.key)
        {
            var _video = this.game.cache.getVideo(this.key);

            if (_video && !_video.isBlob)
            {
                _video.locked = false;
            }
        }

        return true;

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
    grab: function (clear, alpha, blendMode) {

        if (typeof clear === 'undefined') { clear = false; }
        if (typeof alpha === 'undefined') { alpha = 1; }
        if (typeof blendMode === 'undefined') { blendMode = null; }

        if (this.snapshot === null)
        {
            console.warn('Video.grab cannot run because Phaser.BitmapData is unavailable');
            return;
        }

        if (clear)
        {
            this.snapshot.cls();
        }

        this.snapshot.copy(this.video, 0, 0, this.width, this.height, 0, 0, this.width, this.height, 0, 0, 0, 1, 1, alpha, blendMode);

        return this.snapshot;

    },

    /**
     * Destroys the Video object. This calls Video.stop(), then sets the Video src to a blank string and nulls the reference.
     * If any Sprites are using this Video as their texture it is up to you to manage those.
     *
     * @method Phaser.Video#destroy
     */
    destroy: function () {

        this.stop();

        this.video.src = '';
        this.video = null;

        if (this.touchLocked)
        {
            this.game.input.touch.removeTouchLockCallback(this.unlock, this);
        }

    }

};

/**
* @memberof Phaser.Video
* @property {number} currentTime - The current time of the video in seconds. If set the video will attempt to seek to that point in time.
*/
Object.defineProperty(Phaser.Video.prototype, "currentTime", {

    get: function () {

        return (this.video) ? this.video.currentTime : 0;

    },

    set: function (value) {

        this.video.currentTime = value;

    }

});

/**
* @memberof Phaser.Video
* @property {number} duration - The duration of the video in seconds.
* @readOnly
*/
Object.defineProperty(Phaser.Video.prototype, "duration", {

    get: function () {

        return (this.video) ? this.video.duration : 0;

    }

});

/**
* @memberof Phaser.Video
* @property {number} progress - The progress of this video. This is a value between 0 and 1, where 0 is the start and 1 is the end of the video.
* @readOnly
*/
Object.defineProperty(Phaser.Video.prototype, "progress", {

    get: function () {

        return (this.video) ? (this.video.currentTime / this.video.duration) : 0;

    }

});

/**
* @name Phaser.Video#mute
* @property {boolean} mute - Gets or sets the muted state of the Video.
*/
Object.defineProperty(Phaser.Video.prototype, "mute", {

    get: function () {

        return this._muted;

    },

    set: function (value) {

        value = value || null;

        if (value)
        {
            if (this._muted)
            {
                return;
            }

            this._codeMuted = true;
            this.setMute();
        }
        else
        {
            if (!this._muted)
            {
                return;
            }

            this._codeMuted = false;
            this.unsetMute();
        }
    }

});

/**
* Gets or sets the paused state of the Video.
* If the video is still touch locked (such as on iOS devices) this call has no effect.
* 
* @name Phaser.Video#paused
* @property {boolean} paused
*/
Object.defineProperty(Phaser.Video.prototype, "paused", {

    get: function () {

        return this._paused;

    },

    set: function (value) {

        value = value || null;

        if (this.touchLocked)
        {
            return;
        }

        if (value)
        {
            if (this._paused)
            {
                return;
            }

            this._codePaused = true;
            this.setPause();
        }
        else
        {
            if (!this._paused)
            {
                return;
            }

            this._codePaused = false;
            this.setResume();
        }
    }

});

/**
* @name Phaser.Video#volume
* @property {number} volume - Gets or sets the volume of the Video, a value between 0 and 1. The value given is clamped to the range 0 to 1.
*/
Object.defineProperty(Phaser.Video.prototype, "volume", {

    get: function () {

        return (this.video) ? this.video.volume : 1;

    },

    set: function (value) {

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

    }

});

/**
* @name Phaser.Video#playbackRate
* @property {number} playbackRate - Gets or sets the playback rate of the Video. This is the speed at which the video is playing.
*/
Object.defineProperty(Phaser.Video.prototype, "playbackRate", {

    get: function () {

        return (this.video) ? this.video.playbackRate : 1;

    },

    set: function (value) {

        if (this.video)
        {
            this.video.playbackRate = value;
        }

    }

});

/**
* Gets or sets if the Video is set to loop.
* Please note that at present some browsers (i.e. Chrome) do not support *seamless* video looping.
* If the video isn't yet set this will always return false.
* 
* @name Phaser.Video#loop
* @property {boolean} loop
*/
Object.defineProperty(Phaser.Video.prototype, "loop", {

    get: function () {

        return (this.video) ? this.video.loop : false;

    },

    set: function (value) {

        if (value && this.video)
        {
            this.video.loop = 'loop';
        }
        else if (this.video)
        {
            this.video.loop = '';
        }

    }

});

/**
* @name Phaser.Video#playing
* @property {boolean} playing - True if the video is currently playing (and not paused or ended), otherwise false.
* @readOnly
*/
Object.defineProperty(Phaser.Video.prototype, "playing", {

    get: function () {

        return !(this.video.paused && this.video.ended);

    }

});

Phaser.Video.prototype.constructor = Phaser.Video;
