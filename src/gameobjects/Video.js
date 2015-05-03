/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Video object that takes a previously loaded Video from the Phaser Cache and handles playback of it.
* Can be applied to a Sprite as a texture. If multiple Sprites share the same Video texture then playback
* changes on the video will be seen across all Sprites simultaneously. If you need each Sprite to be able to
* play the videos independently (i.e. starting playback at different times) then you will need one Video object
* per Sprite. Please understand the obvious performance implications of doing this, and the memory required
* to hold videos in active RAM.
*
* @class Phaser.Video
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {string} key - The key of the video file stored in the Phaser.Cache that this Video object should use.
*/
Phaser.Video = function (game, key) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {string} key - The key of the BitmapData in the Cache, if stored there.
    */
    this.key = key;

    /**
    * @property {HTMLVideoElement} video - The HTML Video Element that is added to the document.
    */
    this.video = null;

    var _video = this.game.cache.getVideo(key);

    if (_video.isBlob)
    {
        this.createVideoFromBlob(_video.data);
    }
    else
    {
        this.video = _video.data;
    }

    /**
    * @property {number} width - The width of the video in pixels.
    */
    this.width = this.video.videoWidth;

    /**
    * @property {number} height - The height of the video in pixels.
    */
    this.height = this.video.videoHeight;

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

    this.texture.frame = this.textureFrame;

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.VIDEO;

    /**
    * @property {boolean} disableTextureUpload - If disableTextureUpload is true this video will never send its image data to the GPU when its dirty flag is true.
    */
    this.disableTextureUpload = false;

    /**
    * @property {boolean} dirty - If dirty this video will be re-rendered.
    */
    this.dirty = false;

    //  TODO:
    //  onComplete, onStart, onLoop
    //  test out seeking to point within video
    //  test out muting audio!

};

Phaser.Video.prototype = {

    createVideoFromBlob: function (blob) {

        if (this.video !== null)
        {
            //  Kill it, remove listeners, etc
        }

        this.video = document.createElement("video");
        this.video.controls = false;
        this.video.autoplay = false;
        //  Maybe store the Blob, or the XHR response in here? like we do with sound data
        this.video.src = window.URL.createObjectURL(blob);
        this.width = this.video.videoWidth;
        this.height = this.video.videoHeight;

    },

    play: function () {

        this.video.play();

    },

    /**
    * Updates the given objects so that they use this Video as their texture. This will replace any texture they will currently have set.
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
    * @return {Phaser.Video} This Video object for method chaining.
    */
    render: function () {

        if (!this.disableTextureUpload && this.dirty)
        {
            this.baseTexture.dirty();
            this.dirty = false;
        }

        return this;

    }

};

Phaser.Video.prototype.constructor = Phaser.Video;
