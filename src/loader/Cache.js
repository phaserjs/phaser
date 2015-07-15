/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A game only has one instance of a Cache and it is used to store all externally loaded assets such as images, sounds
* and data files as a result of Loader calls. Cached items use string based keys for look-up.
*
* @class Phaser.Cache
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Cache = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * Automatically resolve resource URLs to absolute paths for use with the Cache.getURL method.
    * @property {boolean} autoResolveURL
    */
    this.autoResolveURL = false;

    /**
    * The main cache object into which all resources are placed.
    * @property {object} _cache
    * @private
    */
    this._cache = {
        canvas: {},
        image: {},
        texture: {},
        sound: {},
        video: {},
        text: {},
        json: {},
        xml: {},
        physics: {},
        tilemap: {},
        binary: {},
        bitmapData: {},
        bitmapFont: {
            image: {},
            data: {}
        },
        shader: {},
        renderTexture: {},
        spriteSheet: {},
        atlas: {}
    };

    /**
    * @property {object} _urlMap - Maps URLs to resources.
    * @private
    */
    this._urlMap = {};

    /**
    * @property {Image} _urlResolver - Used to resolve URLs to the absolute path.
    * @private
    */
    this._urlResolver = new Image();

    /**
    * @property {string} _urlTemp - Temporary variable to hold a resolved url.
    * @private
    */
    this._urlTemp = null;

    this.addDefaultImage();
    this.addMissingImage();

    /**
    * @property {Phaser.Signal} onSoundUnlock - This event is dispatched when the sound system is unlocked via a touch event on cellular devices.
    */
    this.onSoundUnlock = new Phaser.Signal();

    /**
    * @property {array} _cacheMap - Const to cache object look-up array.
    * @private
    */
    this._cacheMap = [];

    this._cacheMap[Phaser.Cache.CANVAS] = this._cache.canvas;
    this._cacheMap[Phaser.Cache.IMAGE] = this._cache.image;
    this._cacheMap[Phaser.Cache.TEXTURE] = this._cache.texture;
    this._cacheMap[Phaser.Cache.SOUND] = this._cache.sound;
    this._cacheMap[Phaser.Cache.TEXT] = this._cache.text;
    this._cacheMap[Phaser.Cache.PHYSICS] = this._cache.physics;
    this._cacheMap[Phaser.Cache.TILEMAP] = this._cache.tilemap;
    this._cacheMap[Phaser.Cache.BINARY] = this._cache.binary;
    this._cacheMap[Phaser.Cache.BITMAPDATA] = this._cache.bitmapData;
    this._cacheMap[Phaser.Cache.BITMAPFONT] = this._cache.bitmapFont;
    this._cacheMap[Phaser.Cache.JSON] = this._cache.json;
    this._cacheMap[Phaser.Cache.XML] = this._cache.xml;
    this._cacheMap[Phaser.Cache.VIDEO] = this._cache.video;
    this._cacheMap[Phaser.Cache.SHADER] = this._cache.shader;
    this._cacheMap[Phaser.Cache.RENDER_TEXTURE] = this._cache.renderTexture;
    this._cacheMap[Phaser.Cache.SPRITE_SHEET] = this._cache.spriteSheet;
    this._cacheMap[Phaser.Cache.TEXTURE_ATLAS] = this._cache.atlas;

};

/**
* @constant
* @type {number}
*/
Phaser.Cache.CANVAS = 1;

/**
* @constant
* @type {number}
*/
Phaser.Cache.IMAGE = 2;

/**
* @constant
* @type {number}
*/
Phaser.Cache.TEXTURE = 3;

/**
* @constant
* @type {number}
*/
Phaser.Cache.SOUND = 4;

/**
* @constant
* @type {number}
*/
Phaser.Cache.TEXT = 5;

/**
* @constant
* @type {number}
*/
Phaser.Cache.PHYSICS = 6;

/**
* @constant
* @type {number}
*/
Phaser.Cache.TILEMAP = 7;

/**
* @constant
* @type {number}
*/
Phaser.Cache.BINARY = 8;

/**
* @constant
* @type {number}
*/
Phaser.Cache.BITMAPDATA = 9;

/**
* @constant
* @type {number}
*/
Phaser.Cache.BITMAPFONT = 10;

/**
* @constant
* @type {number}
*/
Phaser.Cache.JSON = 11;

/**
* @constant
* @type {number}
*/
Phaser.Cache.XML = 12;

/**
* @constant
* @type {number}
*/
Phaser.Cache.VIDEO = 13;

/**
* @constant
* @type {number}
*/
Phaser.Cache.SHADER = 14;

/**
* @constant
* @type {number}
*/
Phaser.Cache.RENDER_TEXTURE = 15;

/**
* @constant
* @type {number}
*/
Phaser.Cache.SPRITE_SHEET = 16;

/**
* @constant
* @type {number}
*/
Phaser.Cache.TEXTURE_ATLAS = 17;

Phaser.Cache.prototype = {

    /**
    * Add a new canvas object in to the cache.
    *
    * @method Phaser.Cache#addCanvas
    * @param {string} key - Asset key for this canvas.
    * @param {HTMLCanvasElement} canvas - Canvas DOM element.
    * @param {CanvasRenderingContext2D} context - Render context of this canvas.
    */
    addCanvas: function (key, canvas, context) {

        this._cache.canvas[key] = { canvas: canvas, context: context };

    },

    /**
    * Add a binary object in to the cache.
    *
    * @method Phaser.Cache#addBinary
    * @param {string} key - Asset key for this binary data.
    * @param {object} binaryData - The binary object to be addded to the cache.
    */
    addBinary: function (key, binaryData) {

        this._cache.binary[key] = binaryData;

    },

    /**
    * Add a BitmapData object to the cache.
    *
    * @method Phaser.Cache#addBitmapData
    * @param {string} key - Asset key for this BitmapData.
    * @param {Phaser.BitmapData} bitmapData - The BitmapData object to be addded to the cache.
    * @param {Phaser.FrameData|null} [frameData=(auto create)] - Optional FrameData set associated with the given BitmapData. If not specified (or `undefined`) a new FrameData object is created containing the Bitmap's Frame. If `null` is supplied then no FrameData will be created.
    * @return {Phaser.BitmapData} The BitmapData object to be addded to the cache.
    */
    addBitmapData: function (key, bitmapData, frameData) {

        bitmapData.key = key;

        if (typeof frameData === 'undefined')
        {
            frameData = new Phaser.FrameData();
            frameData.addFrame(bitmapData.textureFrame);
        }

        this._cache.bitmapData[key] = { data: bitmapData, frameData: frameData };

        return bitmapData;

    },

    /**
    * Add a new Phaser.RenderTexture in to the cache.
    *
    * @method Phaser.Cache#addRenderTexture
    * @param {string} key - The unique key by which you will reference this object.
    * @param {Phaser.RenderTexture} texture - The texture to use as the base of the RenderTexture.
    */
    addRenderTexture: function (key, texture) {

        var frame = new Phaser.Frame(0, 0, 0, texture.width, texture.height, '', '');

        this._cache.renderTexture[key] = { texture: texture, frame: frame };

    },

    /**
    * Add a new sprite sheet in to the cache.
    *
    * @method Phaser.Cache#addSpriteSheet
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this sprite sheet file.
    * @param {object} data - Extra sprite sheet data.
    * @param {number} frameWidth - Width of the sprite sheet.
    * @param {number} frameHeight - Height of the sprite sheet.
    * @param {number} [frameMax=-1] - How many frames stored in the sprite sheet. If -1 then it divides the whole sheet evenly.
    * @param {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
    * @param {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
    */
    addSpriteSheet: function (key, url, data, frameWidth, frameHeight, frameMax, margin, spacing) {

        this._cache.spriteSheet[key] = { url: url, data: data, frameWidth: frameWidth, frameHeight: frameHeight, margin: margin, spacing: spacing };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);

        this._cache.spriteSheet[key].frameData = Phaser.AnimationParser.spriteSheet(this.game, key, frameWidth, frameHeight, frameMax, margin, spacing);

        this._resolveURL(url, this._cache.spriteSheet[key]);

    },

    /**
    * Add a new tilemap to the Cache.
    *
    * @method Phaser.Cache#addTilemap
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of the tilemap image or key reference.
    * @param {object} mapData - The tilemap data object (either a CSV or JSON file).
    * @param {number} format - The format of the tilemap data.
    */
    addTilemap: function (key, url, mapData, format) {

        this._cache.tilemap[key] = { url: url, data: mapData, format: format };

        this._resolveURL(url, this._cache.tilemap[key]);

    },

    /**
    * Add a new texture atlas to the Cache.
    *
    * @method Phaser.Cache#addTextureAtlas
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this texture atlas file.
    * @param {object} data - Extra texture atlas data.
    * @param {object} atlasData  - Texture atlas frames data.
    * @param {number} format - The format of the texture atlas.
    */
    addTextureAtlas: function (key, url, data, atlasData, format) {

        this._cache.atlas[key] = { url: url, data: data };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);

        if (format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
        {
            this._cache.atlas[key].frameData = Phaser.AnimationParser.XMLData(this.game, atlasData, key);
        }
        else
        {
            //  Let's just work it out from the frames array
            if (Array.isArray(atlasData.frames))
            {
                this._cache.atlas[key].frameData = Phaser.AnimationParser.JSONData(this.game, atlasData, key);
            }
            else
            {
                this._cache.atlas[key].frameData = Phaser.AnimationParser.JSONDataHash(this.game, atlasData, key);
            }
        }

        this._resolveURL(url, this._cache.atlas[key]);

    },

    /**
    * Add a new Bitmap Font to the Cache.
    *
    * @method Phaser.Cache#addBitmapFont
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this font xml file.
    * @param {object} data - Extra font data.
    * @param {object} atlasData - Texture atlas frames data.
    * @param {number} [xSpacing=0] - If you'd like to add additional horizontal spacing between the characters then set the pixel value here.
    * @param {number} [ySpacing=0] - If you'd like to add additional vertical spacing between the lines then set the pixel value here.
    */
    addBitmapFont: function (key, url, data, atlasData, atlasType, xSpacing, ySpacing) {

        var entry = { url: url, data: data, font: null };

        // this._cache.bitmapFont[key] = { url: url, data: data };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);

        if (atlasType === 'json')
        {
            Phaser.LoaderParser.jsonBitmapFont(this.game, atlasData, key, xSpacing, ySpacing);
        }
        else
        {
            Phaser.LoaderParser.xmlBitmapFont(this.game, atlasData, key, xSpacing, ySpacing);
        }

        entry.font = PIXI.BitmapText.fonts[key];;

        // this._cache.bitmapFont[key] = PIXI.BitmapText.fonts[key];

        this._cache.bitmapFont[key] = entry;

        this._resolveURL(url, this._cache.bitmapFont[key]);

    },

    /**
    * Add a new physics data object to the Cache.
    *
    * @method Phaser.Cache#addPhysicsData
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of the physics json data.
    * @param {object} JSONData - The physics data object (a JSON file).
    * @param {number} format - The format of the physics data.
    */
    addPhysicsData: function (key, url, JSONData, format) {

        this._cache.physics[key] = { url: url, data: JSONData, format: format };

        this._resolveURL(url, this._cache.physics[key]);

    },

    /**
    * Adds a default image to be used in special cases such as WebGL Filters. Is mapped to the key __default.
    *
    * @method Phaser.Cache#addDefaultImage
    * @protected
    */
    addDefaultImage: function () {

        var img = new Image();
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==";

        this._cache.image['__default'] = { url: null, data: img };
        this._cache.image['__default'].frame = new Phaser.Frame(0, 0, 0, 32, 32, '', '');
        this._cache.image['__default'].frameData = new Phaser.FrameData();
        this._cache.image['__default'].frameData.addFrame(new Phaser.Frame(0, 0, 0, 32, 32, null));

        PIXI.BaseTextureCache['__default'] = new PIXI.BaseTexture(img);
        PIXI.TextureCache['__default'] = new PIXI.Texture(PIXI.BaseTextureCache['__default']);

    },

    /**
    * Adds an image to be used when a key is wrong / missing. Is mapped to the key __missing.
    *
    * @method Phaser.Cache#addMissingImage
    * @protected
    */
    addMissingImage: function () {

        var img = new Image();
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==";

        this._cache.image['__missing'] = { url: null, data: img };
        this._cache.image['__missing'].frame = new Phaser.Frame(0, 0, 0, 32, 32, '', '');
        this._cache.image['__missing'].frameData = new Phaser.FrameData();
        this._cache.image['__missing'].frameData.addFrame(new Phaser.Frame(0, 0, 0, 32, 32, null));

        PIXI.BaseTextureCache['__missing'] = new PIXI.BaseTexture(img);
        PIXI.TextureCache['__missing'] = new PIXI.Texture(PIXI.BaseTextureCache['__missing']);

    },

    /**
    * Add a new text data.
    *
    * @method Phaser.Cache#addText
    * @param {string} key - Asset key for the text data.
    * @param {string} url - URL of this text data file.
    * @param {object} data - Extra text data.
    */
    addText: function (key, url, data) {

        this._cache.text[key] = { url: url, data: data };

        this._resolveURL(url, this._cache.text[key]);

    },

    /**
    * Add a new json object into the cache.
    *
    * @method Phaser.Cache#addJSON
    * @param {string} key - Asset key for the json data.
    * @param {string} url - URL of this json data file.
    * @param {object} data - Extra json data.
    */
    addJSON: function (key, url, data) {

        this._cache.json[key] = { url: url, data: data };

        this._resolveURL(url, this._cache.json[key]);

    },

    /**
    * Add a new xml object into the cache.
    *
    * @method Phaser.Cache#addXML
    * @param {string} key - Asset key for the xml file.
    * @param {string} url - URL of this xml file.
    * @param {object} data - Extra text data.
    */
    addXML: function (key, url, data) {

        this._cache.xml[key] = { url: url, data: data };

        this._resolveURL(url, this._cache.xml[key]);

    },

    /**
    * Adds an Image file into the Cache. The file must have already been loaded, typically via Phaser.Loader, but can also have been loaded into the DOM.
    * If an image already exists in the cache with the same key then it is removed and destroyed, and the new image inserted in its place.
    *
    * @method Phaser.Cache#addImage
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this image file.
    * @param {object} data - Extra image data.
    */
    addImage: function (key, url, data) {

        if (this.checkImageKey(key))
        {
            this.removeImage(key);
        }

        this._cache.image[key] = { url: url, data: data };

        this._cache.image[key].frame = new Phaser.Frame(0, 0, 0, data.width, data.height, key);
        this._cache.image[key].frameData = new Phaser.FrameData();
        this._cache.image[key].frameData.addFrame(new Phaser.Frame(0, 0, 0, data.width, data.height, url));

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);

        this._resolveURL(url, this._cache.image[key]);

    },

    /**
    * Adds a Sound file into the Cache. The file must have already been loaded, typically via Phaser.Loader.
    *
    * @method Phaser.Cache#addSound
    * @param {string} key - Asset key for the sound.
    * @param {string} url - URL of this sound file.
    * @param {object} data - Extra sound data.
    * @param {boolean} webAudio - True if the file is using web audio.
    * @param {boolean} audioTag - True if the file is using legacy HTML audio.
    */
    addSound: function (key, url, data, webAudio, audioTag) {

        webAudio = webAudio || true;
        audioTag = audioTag || false;

        var decoded = false;

        if (audioTag)
        {
            decoded = true;
        }

        this._cache.sounds[key] = { url: url, data: data, isDecoding: false, decoded: decoded, webAudio: webAudio, audioTag: audioTag, locked: this.game.sound.touchLocked };

        this._resolveURL(url, this._cache.sounds[key]);

    },

    /**
    * Reload a Sound file from the server.
    *
    * @method Phaser.Cache#reloadSound
    * @param {string} key - Asset key for the sound.
    */
    reloadSound: function (key) {

        var _this = this;

        if (this._cache.sound[key])
        {
            this._cache.sound[key].data.src = this._cache.sound[key].url;

            this._cache.sound[key].data.addEventListener('canplaythrough', function () {
                return _this.reloadSoundComplete(key);
            }, false);

            this._cache.sound[key].data.load();
        }
    },

    /**
    * Fires the onSoundUnlock event when the sound has completed reloading.
    *
    * @method Phaser.Cache#reloadSoundComplete
    * @param {string} key - Asset key for the sound.
    */
    reloadSoundComplete: function (key) {

        if (this._cache.sound[key])
        {
            this._cache.sound[key].locked = false;
            this.onSoundUnlock.dispatch(key);
        }

    },

    /**
    * Updates the sound object in the cache.
    *
    * @method Phaser.Cache#updateSound
    * @param {string} key - Asset key for the sound.
    */
    updateSound: function (key, property, value) {

        if (this._cache.sound[key])
        {
            this._cache.sound[key][property] = value;
        }

    },

    /**
    * Add a new decoded sound.
    *
    * @method Phaser.Cache#decodedSound
    * @param {string} key - Asset key for the sound.
    * @param {object} data - Extra sound data.
    */
    decodedSound: function (key, data) {

        this._cache.sound[key].data = data;
        this._cache.sound[key].decoded = true;
        this._cache.sound[key].isDecoding = false;

    },

    /**
    * Adds a Video file into the Cache. The file must have already been loaded, typically via Phaser.Loader.
    *
    * @method Phaser.Cache#addVideo
    * @param {string} key - Asset key for the video.
    * @param {string} url - URL of this video file.
    * @param {object} data - Extra video data.
    * @param {boolean} isBlob - True if the file was preloaded via xhr and the data parameter is a Blob. false if a Video tag was created instead.
    */
    addVideo: function (key, url, data, isBlob) {

        this._cache.video[key] = { url: url, data: data, isBlob: isBlob, locked: true };

        this._resolveURL(url, this._cache.video[key]);

    },

    /**
    * Checks if a key for the given cache object type exists.
    *
    * @method Phaser.Cache#checkKey
    * @param {number} type - The Cache type to check against. I.e. Phaser.Cache.CANVAS, Phaser.Cache.IMAGE, Phaser.Cache.JSON, etc.
    * @param {string} key - Asset key of the image to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkKey: function (type, key) {

        if (this._cacheMap[type][key])
        {
            return true;
        }

        return false;

    },

    /**
    * Checks if the given key exists in the Canvas Cache.
    *
    * @method Phaser.Cache#checkCanvasKey
    * @param {string} key - Asset key of the canvas to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkCanvasKey: function (key) {

        return this.checkKey(Phaser.Cache.CANVAS, key);

    },

    /**
    * Checks if the given key exists in the Image Cache. Note that this also includes Texture Atlases, Sprite Sheets and Retro Fonts.
    *
    * @method Phaser.Cache#checkImageKey
    * @param {string} key - Asset key of the image to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkImageKey: function (key) {

        return this.checkKey(Phaser.Cache.IMAGE, key);

    },

    /**
    * Checks if the given key exists in the Texture Cache.
    *
    * @method Phaser.Cache#checkTextureKey
    * @param {string} key - Asset key of the image to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkTextureKey: function (key) {

        return this.checkKey(Phaser.Cache.TEXTURE, key);

    },

    /**
    * Checks if the given key exists in the Sound Cache.
    *
    * @method Phaser.Cache#checkSoundKey
    * @param {string} key - Asset key of the sound file to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkSoundKey: function (key) {

        return this.checkKey(Phaser.Cache.SOUND, key);

    },

    /**
    * Checks if the given key exists in the Text Cache.
    *
    * @method Phaser.Cache#checkTextKey
    * @param {string} key - Asset key of the text file to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkTextKey: function (key) {

        return this.checkKey(Phaser.Cache.TEXT, key);

    },

    /**
    * Checks if the given key exists in the Physics Cache.
    *
    * @method Phaser.Cache#checkPhysicsKey
    * @param {string} key - Asset key of the physics data file to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkPhysicsKey: function (key) {

        return this.checkKey(Phaser.Cache.PHYSICS, key);

    },

    /**
    * Checks if the given key exists in the Tilemap Cache.
    *
    * @method Phaser.Cache#checkTilemapKey
    * @param {string} key - Asset key of the Tilemap to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkTilemapKey: function (key) {

        return this.checkKey(Phaser.Cache.TILEMAP, key);

    },

    /**
    * Checks if the given key exists in the Binary Cache.
    *
    * @method Phaser.Cache#checkBinaryKey
    * @param {string} key - Asset key of the binary file to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkBinaryKey: function (key) {

        return this.checkKey(Phaser.Cache.BINARY, key);

    },

    /**
    * Checks if the given key exists in the BitmapData Cache.
    *
    * @method Phaser.Cache#checkBitmapDataKey
    * @param {string} key - Asset key of the BitmapData to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkBitmapDataKey: function (key) {

        return this.checkKey(Phaser.Cache.BITMAPDATA, key);

    },

    /**
    * Checks if the given key exists in the BitmapFont Cache.
    *
    * @method Phaser.Cache#checkBitmapFontKey
    * @param {string} key - Asset key of the BitmapFont to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkBitmapFontKey: function (key) {

        return this.checkKey(Phaser.Cache.BITMAPFONT, key);

    },

    /**
    * Checks if the given key exists in the JSON Cache.
    *
    * @method Phaser.Cache#checkJSONKey
    * @param {string} key - Asset key of the JSON file to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkJSONKey: function (key) {

        return this.checkKey(Phaser.Cache.JSON, key);

    },

    /**
    * Checks if the given key exists in the XML Cache.
    *
    * @method Phaser.Cache#checkXMLKey
    * @param {string} key - Asset key of the XML file to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkXMLKey: function (key) {

        return this.checkKey(Phaser.Cache.XML, key);

    },

    /**
    * Checks if the given key exists in the Video Cache.
    *
    * @method Phaser.Cache#checkVideoKey
    * @param {string} key - Asset key of the video file to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkVideoKey: function (key) {

        return this.checkKey(Phaser.Cache.VIDEO, key);

    },

    /**
    * Checks if the given key exists in the Fragment Shader Cache.
    *
    * @method Phaser.Cache#checkShaderKey
    * @param {string} key - Asset key of the shader file to check is in the Cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkShaderKey: function (key) {

        return this.checkKey(Phaser.Cache.SHADER, key);

    },

    /**
    * Checks if the given key exists in the Render Texture Cache.
    *
    * @method Phaser.Cache#checkRenderTextureKey
    * @param {string} key - Asset key of the render texture to check the cache for.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkRenderTextureKey: function (key) {

        return this.checkKey(Phaser.Cache.RENDER_TEXTURE, key);

    },

    /**
    * Checks if the given key exists in the Sprite Sheet Cache.
    * Note that this is a different cache to the Images and Texture Atlas caches.
    *
    * @method Phaser.Cache#checkSpriteSheetKey
    * @param {string} key - Asset key of the sprite sheet to check the cache for.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkSpriteSheetKey: function (key) {

        return this.checkKey(Phaser.Cache.SPRITE_SHEET, key);

    },

    /**
    * Checks if the given key exists in the Texture Atlas Cache.
    * Note that this is a different cache to the Images and Sprite Sheet caches.
    *
    * @method Phaser.Cache#checkTextureAtlasKey
    * @param {string} key - Asset key of the texture atlas to check the cache for.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkTextureAtlasKey: function (key) {

        return this.checkKey(Phaser.Cache.TEXTURE_ATLAS, key);

    },

    /**
    * Checks if the given URL has been loaded into the Cache.
    * This method will only work if Cache.autoResolveURL was set to `true` before any preloading took place.
    * The method will make a DOM src call to the URL given, so please be aware of this for certain file types, such as Sound files on Firefox
    * which may cause double-load instances.
    *
    * @method Phaser.Cache#checkURL
    * @param {string} url - The url to check for in the cache.
    * @return {boolean} True if the url exists, otherwise false.
    */
    checkURL: function (url) {

        if (this._urlMap[this._resolveURL(url)])
        {
            return true;
        }

        return false;

    },

    /**
    * Get an item from a cache based on the given key and property.
    * 
    * This method is mostly used internally by other Cache methods such as `getImage` but is exposed
    * publicly for your own use as well.
    *
    * @method Phaser.Cache#getItem
    * @param {string} key - Asset key of the item in the Cache.
    * @param {integer} cache - The cache to search. One of the Cache consts such as `Phaser.Cache.IMAGE` or `Phaser.Cache.SOUND`.
    * @param {string} [method] - The string name of the method calling getItem. Can be empty, in which case no console warning is output.
    * @param {string} [property] - If you require a specific property from the cache item, specify it here.
    * @return {object} The cached item if found, otherwise `null`. If the key is invalid and `method` is set then a console.warn is output.
    */
    getItem: function (key, cache, method, property) {

        if (!this.checkKey(cache, key)
        {
            if (method)
            {
                console.warn('Phaser.Cache.' + method + ' Error: Given key: "' + key + '" not found in cache.');
            }
        }
        else
        {
            if (property === undefined)
            {
                return this._cacheMap[cache][key];
            }
            else
            {
                return this._cacheMap[cache][key][property];
            }
        }
        
        return null;

    },

    /**
    * Get a canvas object from the cache by its key.
    *
    * @method Phaser.Cache#getCanvas
    * @param {string} key - Asset key of the canvas to retrieve from the Cache.
    * @return {object} The canvas object or `null` if no item could be found matching the given key.
    */
    getCanvas: function (key) {

        return this.getItem(key, Phaser.Cache.CANVAS, 'getCanvas', 'canvas');

    },

    /**
    * Get a BitmapData object from the cache by its key.
    *
    * @method Phaser.Cache#getBitmapData
    * @param {string} key - Asset key of the BitmapData object to retrieve from the Cache.
    * @return {Phaser.BitmapData} The requested BitmapData object if found, or null if not.
    */
    getBitmapData: function (key) {

        return this.getItem(key, Phaser.Cache.BITMAPDATA, 'getBitmapData', 'data');

    },

    /**
    * Get a BitmapFont object from the cache by its key.
    *
    * @method Phaser.Cache#getBitmapFont
    * @param {string} key - Asset key of the BitmapFont object to retrieve from the Cache.
    * @return {Phaser.BitmapFont} The requested BitmapFont object if found, or null if not.
    */
    getBitmapFont: function (key) {

        return this.getItem(key, Phaser.Cache.BITMAPFONT, 'getBitmapFont');

    },

    /**
    * Get a physics data object from the cache by its key.
    * You can get either the entire data set, a single object or a single fixture of an object from it.
    *
    * @method Phaser.Cache#getPhysicsData
    * @param {string} key - Asset key of the physics data object to retrieve from the Cache.
    * @param {string} [object=null] - If specified it will return just the physics object that is part of the given key, if null it will return them all.
    * @param {string} fixtureKey - Fixture key of fixture inside an object. This key can be set per fixture with the Phaser Exporter.
    * @return {object} The requested physics object data if found.
    */
    getPhysicsData: function (key, object, fixtureKey) {

        var data = this.getItem(key, Phaser.Cache.PHYSICS, 'getPhysicsData', 'data');

        if (data === null || object === undefined || object === null)
        {
            return data;
        }
        else
        {
            if (data[object])
            {
                var fixtures = data[object];

                //  Try to find a fixture by its fixture key if given
                if (fixtures && fixtureKey)
                {
                    for (var fixture in fixtures)
                    {
                        //  This contains the fixture data of a polygon or a circle
                        fixture = fixtures[fixture];

                        //  Test the key
                        if (fixture.fixtureKey === fixtureKey)
                        {
                            return fixture;
                        }
                    }

                    //  We did not find the requested fixture
                    console.warn('Phaser.Cache.getPhysicsData: Could not find given fixtureKey: "' + fixtureKey + ' in ' + key + '"');
                }
                else
                {
                    return fixtures;
                }
            }
            else
            {
                console.warn('Phaser.Cache.getPhysicsData: Invalid key/object: "' + key + ' / ' + object + '"');
            }
        }

        return null;

    },

    /**
    * Gets an image by its key. Note that this returns a DOM Image object, not a Phaser object.
    * Only the Image cache is searched, which covers images loaded via Loader.image.
    * If you need the image for a texture atlas, bitmap font or similar then please see those respective 'get' methods.
    *
    * @method Phaser.Cache#getImage
    * @param {string} key - Asset key of the image to retrieve from the Cache.
    * @return {Image} The Image object if found in the Cache, otherwise `null`.
    */
    getImage: function (key) {

        return this.getItem(key, Phaser.Cache.IMAGE, 'getImage', 'data');

    },

    /**
    * Get tilemap data by key.
    *
    * @method Phaser.Cache#getTilemapData
    * @param {string} key - Asset key of the tilemap data to retrieve from the Cache.
    * @return {object} The raw tilemap data in CSV or JSON format.
    */
    getTilemapData: function (key) {

        return this.getItem(key, Phaser.Cache.TILEMAP, 'getTilemapData');

    },

    /**
    * Get frame data by key.
    *
    * @method Phaser.Cache#getFrameData
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @param {number} [map=Phaser.Cache.IMAGE] - The asset map to get the frameData from, for example `Phaser.Cache.IMAGE`.
    * @return {Phaser.FrameData} The frame data.
    */
    getFrameData: function (key, map) {

        if (map === undefined) { map = Phaser.Cache.IMAGE; }

        return this.getItem(key, map, 'getFrameData', 'frameData');

    },

    /**
    * Replaces a set of frameData with a new Phaser.FrameData object.
    *
    * @method Phaser.Cache#updateFrameData
    * @param {string} key - The unique key by which you will reference this object.
    * @param {number} frameData - The new FrameData.
    * @param {integer} [map=Phaser.Cache.IMAGE] - The asset map to get the frameData from, for example `Phaser.Cache.IMAGE`.
    */
    updateFrameData: function (key, frameData, map) {

        if (map === undefined) { map = Phaser.Cache.IMAGE; }

        if (this._cacheMap[map][key])
        {
            this._cacheMap[map][key].frameData = frameData;
        }

    },

    /**
    * Get a single frame out of a frameData set by key.
    *
    * @method Phaser.Cache#getFrameByIndex
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @param {integer} [map=Phaser.Cache.IMAGE] - The asset map to get the frameData from, for example `Phaser.Cache.IMAGE`.
    * @return {Phaser.Frame} The frame object.
    */
    getFrameByIndex: function (key, frame, map) {

        var data = this.getFrameData(key, map);

        if (data)
        {
            return data.getFrame(frame);
        }
        else
        {
            return null;
        }

    },

    /**
    * Get a single frame out of a frameData set by key.
    *
    * @method Phaser.Cache#getFrameByName
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @return {Phaser.Frame} The frame object.
    */
    getFrameByName: function (key, frame, map) {

        var data = this.getFrameData(key, map);

        if (data)
        {
            return data.getFrameByName(frame);
        }
        else
        {
            return null;
        }

    },

    /**
    * Get a single frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
    *
    * @method Phaser.Cache#getFrame
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @return {Phaser.Frame} The frame data.
    */
    getFrame: function (key) {

        return this.getItem(key, Phaser.Cache.IMAGE, 'getFrame', 'frame');

    },

    /**
    * Get the number of frames in this image.
    *
    * @method Phaser.Cache#getFrameCount
    * @param {string} key - Asset key of the image you want.
    * @return {number} Then number of frames. 0 if the image is not found.
    */
    getFrameCount: function (key) {

        var data = this.getFrameData(key, map);

        if (data)
        {
            return data.total;
        }
        else
        {
            return 0;
        }

    },

    /**
    * Get a single texture frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
    *
    * @method Phaser.Cache#getTextureFrame
    * @param {string} key - Asset key of the frame to retrieve from the Cache.
    * @return {Phaser.Frame} The frame data.
    */
    getTextureFrame: function (key) {

        return this.getItem(key, Phaser.Cache.TEXTURE, 'getTextureFrame', 'frame');

    },

    /**
    * Get a RenderTexture by key.
    *
    * @method Phaser.Cache#getRenderTexture
    * @param {string} key - Asset key of the RenderTexture to retrieve from the Cache.
    * @return {Phaser.RenderTexture} The RenderTexture object.
    */
    getRenderTexture: function (key) {

        return this.getItem(key, Phaser.Cache.RENDER_TEXTURE, 'getRenderTexture');

    },

    /**
    * Gets a PIXI.Texture by key from the Cache.
    *
    * @method Phaser.Cache#getPixiTexture
    * @deprecated
    * @param {string} key - Asset key of the Texture to retrieve from the Cache.
    * @return {PIXI.Texture} The Texture object.
    */
    getPixiTexture: function (key) {

        if (PIXI.TextureCache[key])
        {
            return PIXI.TextureCache[key];
        }
        else
        {
            console.warn('Phaser.Cache.getPixiTexture: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Gets a PIXI.BaseTexture by key from the Cache.
    *
    * @method Phaser.Cache#getPixiBaseTexture
    * @deprecated
    * @param {string} key - Asset key of the BaseTexture to retrieve from the Cache.
    * @return {PIXI.BaseTexture} The BaseTexture object.
    */
    getPixiBaseTexture: function (key) {

        if (PIXI.BaseTextureCache[key])
        {
            return PIXI.BaseTextureCache[key];
        }
        else
        {
            console.warn('Phaser.Cache.getPixiBaseTexture: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Get sound by key.
    *
    * @method Phaser.Cache#getSound
    * @param {string} key - Asset key of the sound to retrieve from the Cache.
    * @return {Phaser.Sound} The sound object.
    */
    getSound: function (key) {

        return this.getItem(key, Phaser.Cache.SOUND, 'getSound');

    },

    /**
    * Get sound data by key.
    *
    * @method Phaser.Cache#getSoundData
    * @param {string} key - Asset key of the sound to retrieve from the Cache.
    * @return {object} The sound data.
    */
    getSoundData: function (key) {

        return this.getItem(key, Phaser.Cache.SOUND, 'getSoundData', 'data');

    },

    /**
    * Check if the given sound has finished decoding.
    *
    * @method Phaser.Cache#isSoundDecoded
    * @param {string} key - Asset key of the sound in the Cache.
    * @return {boolean} The decoded state of the Sound object.
    */
    isSoundDecoded: function (key) {

        var sound = this.getItem(key, Phaser.Cache.SOUND, 'isSoundDecoded');

        if (sound)
        {
            return sound.decoded;
        }

    },

    /**
    * Check if the given sound is ready for playback. A sound is considered ready when it has finished decoding and the device is no longer touch locked.
    *
    * @method Phaser.Cache#isSoundReady
    * @param {string} key - Asset key of the sound in the Cache.
    * @return {boolean} True if the sound is decoded and the device is not touch locked.
    */
    isSoundReady: function (key) {

        var sound = this.getItem(key, Phaser.Cache.SOUND, 'isSoundDecoded');

        if (sound)
        {
            return (sound.decoded && !this.game.sound.touchLocked);
        }

    },

    /**
    * Get video by key.
    *
    * @method Phaser.Cache#getVideo
    * @param {string} key - Asset key of the video to retrieve from the Cache.
    * @return {Phaser.Sound} The video object.
    */
    getVideo: function (key) {

        return this.getItem(key, Phaser.Cache.VIDEO, 'getVideo');

    },

    /**
    * Get text data by key.
    *
    * @method Phaser.Cache#getText
    * @param {string} key - Asset key of the text data to retrieve from the Cache.
    * @return {object} The text data.
    */
    getText: function (key) {

        return this.getItem(key, Phaser.Cache.TEXT, 'getText', 'data');

    },

    /**
    * Get a JSON object by key from the cache.
    * 
    * You can either return the object by reference (the default), or return a clone
    * of it using the `clone` parameter.
    *
    * @method Phaser.Cache#getJSON
    * @param {string} key - Asset key of the json object to retrieve from the Cache.
    * @param {boolean} [clone=false] - Return a clone of the original object (true) or a reference to it? (false)
    * @return {object} The JSON object.
    */
    getJSON: function (key, clone) {

        var data = this.getItem(key, Phaser.Cache.JSON, 'getJSON', 'data');

        if (data)
        {
            if (clone)
            {
                return Phaser.Utils.extend(true, data);
            }
            else
            {
                return data;
            }
        }
        else
        {
            return null;
        }

    },

    /**
    * Get a XML object by key from the cache.
    *
    * @method Phaser.Cache#getXML
    * @param {string} key - Asset key of the XML object to retrieve from the Cache.
    * @return {object} The XML object.
    */
    getXML: function (key) {

        return this.getItem(key, Phaser.Cache.XML, 'getXML', 'data');

    },

    /**
    * Get binary data by key.
    *
    * @method Phaser.Cache#getBinary
    * @param {string} key - Asset key of the binary data object to retrieve from the Cache.
    * @return {object} The binary data object.
    */
    getBinary: function (key) {

        return this.getItem(key, Phaser.Cache.BINARY, 'getBinary');

    },

    /**
    * Get a cached object by the URL.
    * This only returns a value if you set Cache.autoResolveURL to `true` *before* starting the preload of any assets.
    * Be aware that every call to this function makes a DOM src query, so use carefully and double-check for implications in your target browsers/devices.
    *
    * @method Phaser.Cache#getURL
    * @param {string} url - The url for the object loaded to get from the cache.
    * @return {object} The cached object.
    */
    getURL: function (url) {

        var url = this._resolveURL(url);

        if (url)
        {
            return this._urlMap[url];
        }
        else
        {
            console.warn('Phaser.Cache.getUrl: Invalid url: "' + url  + '" or Cache.autoResolveURL was false');
            return null;
        }

    },

    /**
    * Gets all keys used in the requested Cache.
    *
    * @method Phaser.Cache#getKeys
    * @param {integer} [type=Phaser.Cache.IMAGE] - The Cache you wish to get the keys from. Can be any of the Cache consts such as `Phaser.Cache.IMAGE`, `Phaser.Cache.SOUND` etc.
    * @return {Array} The array of keys in the requested cache.
    */
    getKeys: function (type) {

        var out = [];

        if (this._cache[type])
        {
            for (var key in this._cache[type])
            {
                if (key !== '__default' && key !== '__missing')
                {
                    out.push(key);
                }
            }
        }

        return out;

        /*
        switch (type)
        {
            case Phaser.Cache.CANVAS:
                array = this._canvases;
                break;

            case Phaser.Cache.IMAGE:
                array = this._images;
                break;

            case Phaser.Cache.TEXTURE:
                array = this._textures;
                break;

            case Phaser.Cache.SOUND:
                array = this._sounds;
                break;

            case Phaser.Cache.VIDEO:
                array = this._videos;
                break;

            case Phaser.Cache.TEXT:
                array = this._text;
                break;

            case Phaser.Cache.PHYSICS:
                array = this._physics;
                break;

            case Phaser.Cache.TILEMAP:
                array = this._tilemaps;
                break;

            case Phaser.Cache.BINARY:
                array = this._binary;
                break;

            case Phaser.Cache.BITMAPDATA:
                array = this._bitmapDatas;
                break;

            case Phaser.Cache.BITMAPFONT:
                array = this._bitmapFont;
                break;

            case Phaser.Cache.JSON:
                array = this._json;
                break;

            case Phaser.Cache.XML:
                array = this._xml;
                break;
        }

        if (!array)
        {
            return;
        }

        var output = [];

        for (var item in array)
        {
            if (item !== '__default' && item !== '__missing')
            {
                output.push(item);
            }
        }

        return output;
        */

    },

    /**
    * Removes a canvas from the cache.
    *
    * @method Phaser.Cache#removeCanvas
    * @param {string} key - Key of the asset you want to remove.
    */
    removeCanvas: function (key) {

        delete this._cache.canvas[key];

    },

    /**
    * Removes an image from the cache and optionally from the Pixi.BaseTextureCache as well.
    *
    * @method Phaser.Cache#removeImage
    * @param {string} key - Key of the asset you want to remove.
    * @param {boolean} [removeFromPixi=true] - Should this image also be removed from the Pixi BaseTextureCache?
    */
    removeImage: function (key, removeFromPixi) {

        if (removeFromPixi === undefined) { removeFromPixi = true; }

        delete this._cache.image[key];

        if (removeFromPixi)
        {
            PIXI.BaseTextureCache[key].destroy();
        }

    },

    /**
    * Removes a sound from the cache.
    *
    * @method Phaser.Cache#removeSound
    * @param {string} key - Key of the asset you want to remove.
    */
    removeSound: function (key) {

        delete this._cache.sound[key];

    },

    /**
    * Removes a text from the cache.
    *
    * @method Phaser.Cache#removeText
    * @param {string} key - Key of the asset you want to remove.
    */
    removeText: function (key) {
        delete this._text[key];
    },

    /**
    * Removes a json object from the cache.
    *
    * @method Phaser.Cache#removeJSON
    * @param {string} key - Key of the asset you want to remove.
    */
    removeJSON: function (key) {
        delete this._json[key];
    },

    /**
    * Removes a xml object from the cache.
    *
    * @method Phaser.Cache#removeXML
    * @param {string} key - Key of the asset you want to remove.
    */
    removeXML: function (key) {
        delete this._xml[key];
    },

    /**
    * Removes a physics data file from the cache.
    *
    * @method Phaser.Cache#removePhysics
    * @param {string} key - Key of the asset you want to remove.
    */
    removePhysics: function (key) {
        delete this._physics[key];
    },

    /**
    * Removes a tilemap from the cache.
    *
    * @method Phaser.Cache#removeTilemap
    * @param {string} key - Key of the asset you want to remove.
    */
    removeTilemap: function (key) {
        delete this._tilemaps[key];
    },

    /**
    * Removes a binary file from the cache.
    *
    * @method Phaser.Cache#removeBinary
    * @param {string} key - Key of the asset you want to remove.
    */
    removeBinary: function (key) {
        delete this._binary[key];
    },

    /**
    * Removes a bitmap data from the cache.
    *
    * @method Phaser.Cache#removeBitmapData
    * @param {string} key - Key of the asset you want to remove.
    */
    removeBitmapData: function (key) {
        delete this._bitmapDatas[key];
    },

    /**
    * Removes a bitmap font from the cache.
    *
    * @method Phaser.Cache#removeBitmapFont
    * @param {string} key - Key of the asset you want to remove.
    */
    removeBitmapFont: function (key) {
        delete this._bitmapFont[key];
    },

    /**
    * Removes a video from the cache.
    *
    * @method Phaser.Cache#removeVideo
    * @param {string} key - Key of the asset you want to remove.
    */
    removeVideo: function (key) {

        delete this._cache.video[key];

    },

    /**
    * Resolves a URL to its absolute form and stores it in Cache._urlMap as long as Cache.autoResolveURL is set to `true`.
    * This is then looked-up by the Cache.getURL and Cache.checkURL calls.
    *
    * @method Phaser.Cache#_resolveURL
    * @private
    * @param {string} url - The URL to resolve. This is appended to Loader.baseURL.
    * @param {object} [data] - The data associated with the URL to be stored to the URL Map.
    * @return {string} The resolved URL.
    */
    _resolveURL: function (url, data) {

        if (!this.autoResolveURL)
        {
            return null;
        }

        this._urlResolver.src = this.game.load.baseURL + url;

        this._urlTemp = this._urlResolver.src;

        //  Ensure no request is actually made
        this._urlResolver.src = '';

        //  Record the URL to the map
        if (data)
        {
            this._urlMap[this._urlTemp] = data;
        }

        return this._urlTemp;

    },

    /**
    * Clears the cache. Removes every local cache object reference.
    *
    * @method Phaser.Cache#destroy
    */
    destroy: function () {

        for (var item in this._images)
        {
            if (item !== '__default' && item !== '__missing')
            {
                delete this._images[item];
            }
        }

        var containers = [
            this._canvases,
            this._sounds,
            this._videos,
            this._text,
            this._json,
            this._xml,
            this._textures,
            this._physics,
            this._tilemaps,
            this._binary,
            this._bitmapDatas,
            this._bitmapFont
        ];

        for (var i = 0; i < containers.length; i++)
        {
            for (var item in containers[i])
            {
                delete containers[i][item];
            }
        }

        this._urlMap = null;
        this._urlResolver = null;
        this._urlTemp = null;

    }

};

Phaser.Cache.prototype.constructor = Phaser.Cache;
