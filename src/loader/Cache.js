/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser has one single cache in which it stores all assets.
*
* The cache is split up into sections, such as images, sounds, video, json, etc. All assets are stored using
* a unique string-based key as their identifier. Assets stored in different areas of the cache can have the
* same key, for example 'playerWalking' could be used as the key for both a sprite sheet and an audio file,
* because they are unique data types.
*
* The cache is automatically populated by the Phaser.Loader. When you use the loader to pull in external assets
* such as images they are automatically placed into their respective cache. Most common Game Objects, such as
* Sprites and Videos automatically query the cache to extract the assets they need on instantiation.
*
* You can access the cache from within a State via `this.cache`. From here you can call any public method it has,
* including adding new entries to it, deleting them or querying them.
*
* Understand that almost without exception when you get an item from the cache it will return a reference to the
* item stored in the cache, not a copy of it. Therefore if you retrieve an item and then modify it, the original
* object in the cache will also be updated, even if you don't put it back into the cache again.
*
* By default when you change State the cache is _not_ cleared, although there is an option to clear it should
* your game require it. In a typical game set-up the cache is populated once after the main game has loaded and
* then used as an asset store.
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
        bitmapFont: {},
        shader: {},
        renderTexture: {}
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

    this.addDefaultImage();
    this.addMissingImage();

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

Phaser.Cache.prototype = {

    //////////////////
    //  Add Methods //
    //////////////////

    /**
    * Add a new canvas object in to the cache.
    *
    * @method Phaser.Cache#addCanvas
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {HTMLCanvasElement} canvas - The Canvas DOM element.
    * @param {CanvasRenderingContext2D} [context] - The context of the canvas element. If not specified it will default go `getContext('2d')`.
    */
    addCanvas: function (key, canvas, context) {

        if (context === undefined) { context = canvas.getContext('2d'); }

        this._cache.canvas[key] = { canvas: canvas, context: context };

    },

    /**
    * Adds an Image file into the Cache. The file must have already been loaded, typically via Phaser.Loader, but can also have been loaded into the DOM.
    * If an image already exists in the cache with the same key then it is removed and destroyed, and the new image inserted in its place.
    *
    * @method Phaser.Cache#addImage
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} data - Extra image data.
    * @return {object} The full image object that was added to the cache.
    */
    addImage: function (key, url, data) {

        if (this.checkImageKey(key))
        {
            this.removeImage(key);
        }

        var img = {
            key: key,
            url: url,
            data: data,
            base: new PIXI.BaseTexture(data),
            frame: new Phaser.Frame(0, 0, 0, data.width, data.height, key),
            frameData: new Phaser.FrameData()
        };

        img.frameData.addFrame(new Phaser.Frame(0, 0, 0, data.width, data.height, url));

        this._cache.image[key] = img;

        this._resolveURL(url, img);

        return img;

    },

    /**
    * Adds a default image to be used in special cases such as WebGL Filters.
    * It uses the special reserved key of `__default`.
    * This method is called automatically when the Cache is created.
    * This image is skipped when `Cache.destroy` is called due to its internal requirements.
    *
    * @method Phaser.Cache#addDefaultImage
    * @protected
    */
    addDefaultImage: function () {

        var img = new Image();

        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==";

        var obj = this.addImage('__default', null, img);

        //  Because we don't want to invalidate the sprite batch for an invisible texture
        obj.base.skipRender = true;

        PIXI.TextureCache['__default'] = new PIXI.Texture(obj.base);

    },

    /**
    * Adds an image to be used when a key is wrong / missing.
    * It uses the special reserved key of `__missing`.
    * This method is called automatically when the Cache is created.
    * This image is skipped when `Cache.destroy` is called due to its internal requirements.
    *
    * @method Phaser.Cache#addMissingImage
    * @protected
    */
    addMissingImage: function () {

        var img = new Image();

        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==";

        var obj = this.addImage('__missing', null, img);

        PIXI.TextureCache['__missing'] = new PIXI.Texture(obj.base);

    },

    /**
    * Adds a Sound file into the Cache. The file must have already been loaded, typically via Phaser.Loader.
    *
    * @method Phaser.Cache#addSound
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} data - Extra sound data.
    * @param {boolean} webAudio - True if the file is using web audio.
    * @param {boolean} audioTag - True if the file is using legacy HTML audio.
    */
    addSound: function (key, url, data, webAudio, audioTag) {

        if (webAudio === undefined) { webAudio = true; audioTag = false; }
        if (audioTag === undefined) { webAudio = false; audioTag = true; }

        var decoded = false;

        if (audioTag)
        {
            decoded = true;
        }

        this._cache.sound[key] = {
            url: url,
            data: data,
            isDecoding: false,
            decoded: decoded,
            webAudio: webAudio,
            audioTag: audioTag,
            locked: this.game.sound.touchLocked
        };

        this._resolveURL(url, this._cache.sound[key]);

    },

    /**
    * Add a new text data.
    *
    * @method Phaser.Cache#addText
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} data - Extra text data.
    */
    addText: function (key, url, data) {

        this._cache.text[key] = { url: url, data: data };

        this._resolveURL(url, this._cache.text[key]);

    },

    /**
    * Add a new physics data object to the Cache.
    *
    * @method Phaser.Cache#addPhysicsData
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} JSONData - The physics data object (a JSON file).
    * @param {number} format - The format of the physics data.
    */
    addPhysicsData: function (key, url, JSONData, format) {

        this._cache.physics[key] = { url: url, data: JSONData, format: format };

        this._resolveURL(url, this._cache.physics[key]);

    },

    /**
    * Add a new tilemap to the Cache.
    *
    * @method Phaser.Cache#addTilemap
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} mapData - The tilemap data object (either a CSV or JSON file).
    * @param {number} format - The format of the tilemap data.
    */
    addTilemap: function (key, url, mapData, format) {

        this._cache.tilemap[key] = { url: url, data: mapData, format: format };

        this._resolveURL(url, this._cache.tilemap[key]);

    },

    /**
    * Add a binary object in to the cache.
    *
    * @method Phaser.Cache#addBinary
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {object} binaryData - The binary object to be added to the cache.
    */
    addBinary: function (key, binaryData) {

        this._cache.binary[key] = binaryData;

    },

    /**
    * Add a BitmapData object to the cache.
    *
    * @method Phaser.Cache#addBitmapData
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {Phaser.BitmapData} bitmapData - The BitmapData object to be addded to the cache.
    * @param {Phaser.FrameData|null} [frameData=(auto create)] - Optional FrameData set associated with the given BitmapData. If not specified (or `undefined`) a new FrameData object is created containing the Bitmap's Frame. If `null` is supplied then no FrameData will be created.
    * @return {Phaser.BitmapData} The BitmapData object to be addded to the cache.
    */
    addBitmapData: function (key, bitmapData, frameData) {

        bitmapData.key = key;

        if (frameData === undefined)
        {
            frameData = new Phaser.FrameData();
            frameData.addFrame(bitmapData.textureFrame);
        }

        this._cache.bitmapData[key] = { data: bitmapData, frameData: frameData };

        return bitmapData;

    },

    /**
    * Add a new Bitmap Font to the Cache.
    *
    * @method Phaser.Cache#addBitmapFont
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} data - Extra font data.
    * @param {object} atlasData - Texture atlas frames data.
    * @param {string} [atlasType='xml'] - The format of the texture atlas ( 'json' or 'xml' ).
    * @param {number} [xSpacing=0] - If you'd like to add additional horizontal spacing between the characters then set the pixel value here.
    * @param {number} [ySpacing=0] - If you'd like to add additional vertical spacing between the lines then set the pixel value here.
    */
    addBitmapFont: function (key, url, data, atlasData, atlasType, xSpacing, ySpacing) {

        var obj = {
            url: url,
            data: data,
            font: null,
            base: new PIXI.BaseTexture(data)
        };

        if (xSpacing === undefined) { xSpacing = 0; }
        if (ySpacing === undefined) { ySpacing = 0; }

        if (atlasType === 'json')
        {
            obj.font = Phaser.LoaderParser.jsonBitmapFont(atlasData, obj.base, xSpacing, ySpacing);
        }
        else
        {
            obj.font = Phaser.LoaderParser.xmlBitmapFont(atlasData, obj.base, xSpacing, ySpacing);
        }

        this._cache.bitmapFont[key] = obj;

        this._resolveURL(url, obj);

    },

    /**
    * Add a new json object into the cache.
    *
    * @method Phaser.Cache#addJSON
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
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
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} data - Extra text data.
    */
    addXML: function (key, url, data) {

        this._cache.xml[key] = { url: url, data: data };

        this._resolveURL(url, this._cache.xml[key]);

    },

    /**
    * Adds a Video file into the Cache. The file must have already been loaded, typically via Phaser.Loader.
    *
    * @method Phaser.Cache#addVideo
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} data - Extra video data.
    * @param {boolean} isBlob - True if the file was preloaded via xhr and the data parameter is a Blob. false if a Video tag was created instead.
    */
    addVideo: function (key, url, data, isBlob) {

        this._cache.video[key] = { url: url, data: data, isBlob: isBlob, locked: true };

        this._resolveURL(url, this._cache.video[key]);

    },

    /**
    * Adds a Fragment Shader in to the Cache. The file must have already been loaded, typically via Phaser.Loader.
    *
    * @method Phaser.Cache#addShader
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} data - Extra shader data.
    */
    addShader: function (key, url, data) {

        this._cache.shader[key] = { url: url, data: data };

        this._resolveURL(url, this._cache.shader[key]);

    },

    /**
    * Add a new Phaser.RenderTexture in to the cache.
    *
    * @method Phaser.Cache#addRenderTexture
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {Phaser.RenderTexture} texture - The texture to use as the base of the RenderTexture.
    */
    addRenderTexture: function (key, texture) {

        this._cache.renderTexture[key] = { texture: texture, frame: new Phaser.Frame(0, 0, 0, texture.width, texture.height, '', '') };

    },

    /**
    * Add a new sprite sheet in to the cache.
    *
    * @method Phaser.Cache#addSpriteSheet
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} data - Extra sprite sheet data.
    * @param {number} frameWidth - Width of the sprite sheet.
    * @param {number} frameHeight - Height of the sprite sheet.
    * @param {number} [frameMax=-1] - How many frames stored in the sprite sheet. If -1 then it divides the whole sheet evenly.
    * @param {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
    * @param {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
    */
    addSpriteSheet: function (key, url, data, frameWidth, frameHeight, frameMax, margin, spacing) {

        if (frameMax === undefined) { frameMax = -1; }
        if (margin === undefined) { margin = 0; }
        if (spacing === undefined) { spacing = 0; }

        var obj = {
            key: key,
            url: url,
            data: data,
            frameWidth: frameWidth,
            frameHeight: frameHeight,
            margin: margin,
            spacing: spacing,
            base: new PIXI.BaseTexture(data),
            frameData: Phaser.AnimationParser.spriteSheet(this.game, data, frameWidth, frameHeight, frameMax, margin, spacing)
        };

        this._cache.image[key] = obj;

        this._resolveURL(url, obj);

    },

    /**
    * Add a new texture atlas to the Cache.
    *
    * @method Phaser.Cache#addTextureAtlas
    * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
    * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
    * @param {object} data - Extra texture atlas data.
    * @param {object} atlasData  - Texture atlas frames data.
    * @param {number} format - The format of the texture atlas.
    */
    addTextureAtlas: function (key, url, data, atlasData, format) {

        var obj = {
            key: key,
            url: url,
            data: data,
            base: new PIXI.BaseTexture(data)
        };

        if (format === Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
        {
            obj.frameData = Phaser.AnimationParser.XMLData(this.game, atlasData, key);
        }
        else if (format === Phaser.Loader.TEXTURE_ATLAS_JSON_PYXEL)
        {
            obj.frameData = Phaser.AnimationParser.JSONDataPyxel(this.game, atlasData, key);
        }
        else
        {
            //  Let's just work it out from the frames array
            if (Array.isArray(atlasData.frames))
            {
                obj.frameData = Phaser.AnimationParser.JSONData(this.game, atlasData, key);
            }
            else
            {
                obj.frameData = Phaser.AnimationParser.JSONDataHash(this.game, atlasData, key);
            }
        }

        this._cache.image[key] = obj;

        this._resolveURL(url, obj);

    },

    ////////////////////////////
    //  Sound Related Methods //
    ////////////////////////////

    /**
    * Reload a Sound file from the server.
    *
    * @method Phaser.Cache#reloadSound
    * @param {string} key - The key of the asset within the cache.
    */
    reloadSound: function (key) {

        var _this = this;

        var sound = this.getSound(key);

        if (sound)
        {
            sound.data.src = sound.url;

            sound.data.addEventListener('canplaythrough', function () {
                return _this.reloadSoundComplete(key);
            }, false);

            sound.data.load();
        }

    },

    /**
    * Fires the onSoundUnlock event when the sound has completed reloading.
    *
    * @method Phaser.Cache#reloadSoundComplete
    * @param {string} key - The key of the asset within the cache.
    */
    reloadSoundComplete: function (key) {

        var sound = this.getSound(key);

        if (sound)
        {
            sound.locked = false;
            this.onSoundUnlock.dispatch(key);
        }

    },

    /**
    * Updates the sound object in the cache.
    *
    * @method Phaser.Cache#updateSound
    * @param {string} key - The key of the asset within the cache.
    */
    updateSound: function (key, property, value) {

        var sound = this.getSound(key);

        if (sound)
        {
            sound[property] = value;
        }

    },

    /**
    * Add a new decoded sound.
    *
    * @method Phaser.Cache#decodedSound
    * @param {string} key - The key of the asset within the cache.
    * @param {object} data - Extra sound data.
    */
    decodedSound: function (key, data) {

        var sound = this.getSound(key);

        sound.data = data;
        sound.decoded = true;
        sound.isDecoding = false;

    },

    /**
    * Check if the given sound has finished decoding.
    *
    * @method Phaser.Cache#isSoundDecoded
    * @param {string} key - The key of the asset within the cache.
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
    * Check if the given sound is ready for playback.
    * A sound is considered ready when it has finished decoding and the device is no longer touch locked.
    *
    * @method Phaser.Cache#isSoundReady
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the sound is decoded and the device is not touch locked.
    */
    isSoundReady: function (key) {

        var sound = this.getItem(key, Phaser.Cache.SOUND, 'isSoundDecoded');

        if (sound)
        {
            return (sound.decoded && !this.game.sound.touchLocked);
        }

    },

    ////////////////////////
    //  Check Key Methods //
    ////////////////////////

    /**
    * Checks if a key for the given cache object type exists.
    *
    * @method Phaser.Cache#checkKey
    * @param {integer} cache - The cache to search. One of the Cache consts such as `Phaser.Cache.IMAGE` or `Phaser.Cache.SOUND`.
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists, otherwise false.
    */
    checkKey: function (cache, key) {

        if (this._cacheMap[cache][key])
        {
            return true;
        }

        return false;

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
    * Checks if the given key exists in the Canvas Cache.
    *
    * @method Phaser.Cache#checkCanvasKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkCanvasKey: function (key) {

        return this.checkKey(Phaser.Cache.CANVAS, key);

    },

    /**
    * Checks if the given key exists in the Image Cache. Note that this also includes Texture Atlases, Sprite Sheets and Retro Fonts.
    *
    * @method Phaser.Cache#checkImageKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkImageKey: function (key) {

        return this.checkKey(Phaser.Cache.IMAGE, key);

    },

    /**
    * Checks if the given key exists in the Texture Cache.
    *
    * @method Phaser.Cache#checkTextureKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkTextureKey: function (key) {

        return this.checkKey(Phaser.Cache.TEXTURE, key);

    },

    /**
    * Checks if the given key exists in the Sound Cache.
    *
    * @method Phaser.Cache#checkSoundKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkSoundKey: function (key) {

        return this.checkKey(Phaser.Cache.SOUND, key);

    },

    /**
    * Checks if the given key exists in the Text Cache.
    *
    * @method Phaser.Cache#checkTextKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkTextKey: function (key) {

        return this.checkKey(Phaser.Cache.TEXT, key);

    },

    /**
    * Checks if the given key exists in the Physics Cache.
    *
    * @method Phaser.Cache#checkPhysicsKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkPhysicsKey: function (key) {

        return this.checkKey(Phaser.Cache.PHYSICS, key);

    },

    /**
    * Checks if the given key exists in the Tilemap Cache.
    *
    * @method Phaser.Cache#checkTilemapKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkTilemapKey: function (key) {

        return this.checkKey(Phaser.Cache.TILEMAP, key);

    },

    /**
    * Checks if the given key exists in the Binary Cache.
    *
    * @method Phaser.Cache#checkBinaryKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkBinaryKey: function (key) {

        return this.checkKey(Phaser.Cache.BINARY, key);

    },

    /**
    * Checks if the given key exists in the BitmapData Cache.
    *
    * @method Phaser.Cache#checkBitmapDataKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkBitmapDataKey: function (key) {

        return this.checkKey(Phaser.Cache.BITMAPDATA, key);

    },

    /**
    * Checks if the given key exists in the BitmapFont Cache.
    *
    * @method Phaser.Cache#checkBitmapFontKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkBitmapFontKey: function (key) {

        return this.checkKey(Phaser.Cache.BITMAPFONT, key);

    },

    /**
    * Checks if the given key exists in the JSON Cache.
    *
    * @method Phaser.Cache#checkJSONKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkJSONKey: function (key) {

        return this.checkKey(Phaser.Cache.JSON, key);

    },

    /**
    * Checks if the given key exists in the XML Cache.
    *
    * @method Phaser.Cache#checkXMLKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkXMLKey: function (key) {

        return this.checkKey(Phaser.Cache.XML, key);

    },

    /**
    * Checks if the given key exists in the Video Cache.
    *
    * @method Phaser.Cache#checkVideoKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkVideoKey: function (key) {

        return this.checkKey(Phaser.Cache.VIDEO, key);

    },

    /**
    * Checks if the given key exists in the Fragment Shader Cache.
    *
    * @method Phaser.Cache#checkShaderKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkShaderKey: function (key) {

        return this.checkKey(Phaser.Cache.SHADER, key);

    },

    /**
    * Checks if the given key exists in the Render Texture Cache.
    *
    * @method Phaser.Cache#checkRenderTextureKey
    * @param {string} key - The key of the asset within the cache.
    * @return {boolean} True if the key exists in the cache, otherwise false.
    */
    checkRenderTextureKey: function (key) {

        return this.checkKey(Phaser.Cache.RENDER_TEXTURE, key);

    },

    ////////////////
    //  Get Items //
    ////////////////

    /**
    * Get an item from a cache based on the given key and property.
    *
    * This method is mostly used internally by other Cache methods such as `getImage` but is exposed
    * publicly for your own use as well.
    *
    * @method Phaser.Cache#getItem
    * @param {string} key - The key of the asset within the cache.
    * @param {integer} cache - The cache to search. One of the Cache consts such as `Phaser.Cache.IMAGE` or `Phaser.Cache.SOUND`.
    * @param {string} [method] - The string name of the method calling getItem. Can be empty, in which case no console warning is output.
    * @param {string} [property] - If you require a specific property from the cache item, specify it here.
    * @return {object} The cached item if found, otherwise `null`. If the key is invalid and `method` is set then a console.warn is output.
    */
    getItem: function (key, cache, method, property) {

        if (!this.checkKey(cache, key))
        {
            if (method)
            {
                console.warn('Phaser.Cache.' + method + ': Key "' + key + '" not found in Cache.');
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
    * Gets a Canvas object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getCanvas
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {object} The canvas object or `null` if no item could be found matching the given key.
    */
    getCanvas: function (key) {

        return this.getItem(key, Phaser.Cache.CANVAS, 'getCanvas', 'canvas');

    },

    /**
    * Gets a Image object from the cache. This returns a DOM Image object, not a Phaser.Image object.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * Only the Image cache is searched, which covers images loaded via Loader.image, Sprite Sheets and Texture Atlases.
    *
    * If you need the image used by a bitmap font or similar then please use those respective 'get' methods.
    *
    * @method Phaser.Cache#getImage
    * @param {string} [key] - The key of the asset to retrieve from the cache. If not given or null it will return a default image. If given but not found in the cache it will throw a warning and return the missing image.
    * @param {boolean} [full=false] - If true the full image object will be returned, if false just the HTML Image object is returned.
    * @return {Image} The Image object if found in the Cache, otherwise `null`. If `full` was true then a JavaScript object is returned.
    */
    getImage: function (key, full) {

        if (key === undefined || key === null)
        {
            key = '__default';
        }

        if (full === undefined) { full = false; }

        var img = this.getItem(key, Phaser.Cache.IMAGE, 'getImage');

        if (img === null)
        {
            img = this.getItem('__missing', Phaser.Cache.IMAGE, 'getImage');
        }

        if (full)
        {
            return img;
        }
        else
        {
            return img.data;
        }

    },

    /**
    * Get a single texture frame by key.
    *
    * You'd only do this to get the default Frame created for a non-atlas / spritesheet image.
    *
    * @method Phaser.Cache#getTextureFrame
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {Phaser.Frame} The frame data.
    */
    getTextureFrame: function (key) {

        return this.getItem(key, Phaser.Cache.TEXTURE, 'getTextureFrame', 'frame');

    },

    /**
    * Gets a Phaser.Sound object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getSound
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {Phaser.Sound} The sound object.
    */
    getSound: function (key) {

        return this.getItem(key, Phaser.Cache.SOUND, 'getSound');

    },

    /**
    * Gets a raw Sound data object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getSoundData
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {object} The sound data.
    */
    getSoundData: function (key) {

        return this.getItem(key, Phaser.Cache.SOUND, 'getSoundData', 'data');

    },

    /**
    * Gets a Text object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getText
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {object} The text data.
    */
    getText: function (key) {

        return this.getItem(key, Phaser.Cache.TEXT, 'getText', 'data');

    },

    /**
    * Gets a Physics Data object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * You can get either the entire data set, a single object or a single fixture of an object from it.
    *
    * @method Phaser.Cache#getPhysicsData
    * @param {string} key - The key of the asset to retrieve from the cache.
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
    * Gets a raw Tilemap data object from the cache. This will be in either CSV or JSON format.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getTilemapData
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {object} The raw tilemap data in CSV or JSON format.
    */
    getTilemapData: function (key) {

        return this.getItem(key, Phaser.Cache.TILEMAP, 'getTilemapData');

    },

    /**
    * Gets a binary object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getBinary
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {object} The binary data object.
    */
    getBinary: function (key) {

        return this.getItem(key, Phaser.Cache.BINARY, 'getBinary');

    },

    /**
    * Gets a BitmapData object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getBitmapData
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {Phaser.BitmapData} The requested BitmapData object if found, or null if not.
    */
    getBitmapData: function (key) {

        return this.getItem(key, Phaser.Cache.BITMAPDATA, 'getBitmapData', 'data');

    },

    /**
    * Gets a Bitmap Font object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getBitmapFont
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {Phaser.BitmapFont} The requested BitmapFont object if found, or null if not.
    */
    getBitmapFont: function (key) {

        return this.getItem(key, Phaser.Cache.BITMAPFONT, 'getBitmapFont');

    },

    /**
    * Gets a JSON object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * You can either return the object by reference (the default), or return a clone
    * of it by setting the `clone` argument to `true`.
    *
    * @method Phaser.Cache#getJSON
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @param {boolean} [clone=false] - Return a clone of the original object (true) or a reference to it? (false)
    * @return {object} The JSON object.
    */
    getJSON: function (key, clone) {

        var data = this.getItem(key, Phaser.Cache.JSON, 'getJSON', 'data');

        if (data)
        {
            if (clone)
            {
                return Phaser.Utils.extend(true, {}, data);
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
    * Gets an XML object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getXML
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {object} The XML object.
    */
    getXML: function (key) {

        return this.getItem(key, Phaser.Cache.XML, 'getXML', 'data');

    },

    /**
    * Gets a Phaser.Video object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getVideo
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {Phaser.Video} The video object.
    */
    getVideo: function (key) {

        return this.getItem(key, Phaser.Cache.VIDEO, 'getVideo');

    },

    /**
    * Gets a fragment shader object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getShader
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {string} The shader object.
    */
    getShader: function (key) {

        return this.getItem(key, Phaser.Cache.SHADER, 'getShader', 'data');

    },

    /**
    * Gets a RenderTexture object from the cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getRenderTexture
    * @param {string} key - The key of the asset to retrieve from the cache.
    * @return {Object} The object with Phaser.RenderTexture and Phaser.Frame.
    */
    getRenderTexture: function (key) {

        return this.getItem(key, Phaser.Cache.RENDER_TEXTURE, 'getRenderTexture');

    },

    ////////////////////////////
    //  Frame Related Methods //
    ////////////////////////////

    /**
    * Gets a PIXI.BaseTexture by key from the given Cache.
    *
    * @method Phaser.Cache#getBaseTexture
    * @param {string} key - Asset key of the image for which you want the BaseTexture for.
    * @param {integer} [cache=Phaser.Cache.IMAGE] - The cache to search for the item in.
    * @return {PIXI.BaseTexture} The BaseTexture object.
    */
    getBaseTexture: function (key, cache) {

        if (cache === undefined) { cache = Phaser.Cache.IMAGE; }

        return this.getItem(key, cache, 'getBaseTexture', 'base');

    },

    /**
    * Get a single frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
    *
    * @method Phaser.Cache#getFrame
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @param {integer} [cache=Phaser.Cache.IMAGE] - The cache to search for the item in.
    * @return {Phaser.Frame} The frame data.
    */
    getFrame: function (key, cache) {

        if (cache === undefined) { cache = Phaser.Cache.IMAGE; }

        return this.getItem(key, cache, 'getFrame', 'frame');

    },

    /**
    * Get the total number of frames contained in the FrameData object specified by the given key.
    *
    * @method Phaser.Cache#getFrameCount
    * @param {string} key - Asset key of the FrameData you want.
    * @param {integer} [cache=Phaser.Cache.IMAGE] - The cache to search for the item in.
    * @return {number} Then number of frames. 0 if the image is not found.
    */
    getFrameCount: function (key, cache) {

        var data = this.getFrameData(key, cache);

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
    * Gets a Phaser.FrameData object from the Image Cache.
    *
    * The object is looked-up based on the key given.
    *
    * Note: If the object cannot be found a `console.warn` message is displayed.
    *
    * @method Phaser.Cache#getFrameData
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @param {integer} [cache=Phaser.Cache.IMAGE] - The cache to search for the item in.
    * @return {Phaser.FrameData} The frame data.
    */
    getFrameData: function (key, cache) {

        if (cache === undefined) { cache = Phaser.Cache.IMAGE; }

        return this.getItem(key, cache, 'getFrameData', 'frameData');

    },

    /**
    * Check if the FrameData for the given key exists in the Image Cache.
    *
    * @method Phaser.Cache#hasFrameData
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @param {integer} [cache=Phaser.Cache.IMAGE] - The cache to search for the item in.
    * @return {boolean} True if the given key has frameData in the cache, otherwise false.
    */
    hasFrameData: function (key, cache) {

        if (cache === undefined) { cache = Phaser.Cache.IMAGE; }

        return (this.getItem(key, cache, '', 'frameData') !== null);

    },

    /**
    * Replaces a set of frameData with a new Phaser.FrameData object.
    *
    * @method Phaser.Cache#updateFrameData
    * @param {string} key - The unique key by which you will reference this object.
    * @param {number} frameData - The new FrameData.
    * @param {integer} [cache=Phaser.Cache.IMAGE] - The cache to search. One of the Cache consts such as `Phaser.Cache.IMAGE` or `Phaser.Cache.SOUND`.
    */
    updateFrameData: function (key, frameData, cache) {

        if (cache === undefined) { cache = Phaser.Cache.IMAGE; }

        if (this._cacheMap[cache][key])
        {
            this._cacheMap[cache][key].frameData = frameData;
        }

    },

    /**
    * Get a single frame out of a frameData set by key.
    *
    * @method Phaser.Cache#getFrameByIndex
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @param {number} index - The index of the frame you want to get.
    * @param {integer} [cache=Phaser.Cache.IMAGE] - The cache to search. One of the Cache consts such as `Phaser.Cache.IMAGE` or `Phaser.Cache.SOUND`.
    * @return {Phaser.Frame} The frame object.
    */
    getFrameByIndex: function (key, index, cache) {

        var data = this.getFrameData(key, cache);

        if (data)
        {
            return data.getFrame(index);
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
    * @param {string} name - The name of the frame you want to get.
    * @param {integer} [cache=Phaser.Cache.IMAGE] - The cache to search. One of the Cache consts such as `Phaser.Cache.IMAGE` or `Phaser.Cache.SOUND`.
    * @return {Phaser.Frame} The frame object.
    */
    getFrameByName: function (key, name, cache) {

        var data = this.getFrameData(key, cache);

        if (data)
        {
            return data.getFrameByName(name);
        }
        else
        {
            return null;
        }

    },

    /**
    * Gets a PIXI.Texture by key from the PIXI.TextureCache.
    *
    * If the texture isn't found in the cache, then it searches the Phaser Image Cache and
    * creates a new PIXI.Texture object which is then returned.
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
            var base = this.getPixiBaseTexture(key);

            if (base)
            {
                return new PIXI.Texture(base);
            }
            else
            {
                return null;
            }
        }

    },

    /**
    * Gets a PIXI.BaseTexture by key from the PIXI.BaseTextureCache.
    *
    * If the texture isn't found in the cache, then it searches the Phaser Image Cache.
    *
    * @method Phaser.Cache#getPixiBaseTexture
    * @deprecated
    * @param {string} key - Asset key of the BaseTexture to retrieve from the Cache.
    * @return {PIXI.BaseTexture} The BaseTexture object or null if not found.
    */
    getPixiBaseTexture: function (key) {

        if (PIXI.BaseTextureCache[key])
        {
            return PIXI.BaseTextureCache[key];
        }
        else
        {
            var img = this.getItem(key, Phaser.Cache.IMAGE, 'getPixiBaseTexture');

            if (img !== null)
            {
                return img.base;
            }
            else
            {
                return null;
            }
        }

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
    * @param {integer} [cache=Phaser.Cache.IMAGE] - The Cache you wish to get the keys from. Can be any of the Cache consts such as `Phaser.Cache.IMAGE`, `Phaser.Cache.SOUND` etc.
    * @return {Array} The array of keys in the requested cache.
    */
    getKeys: function (cache) {

        if (cache === undefined) { cache = Phaser.Cache.IMAGE; }

        var out = [];

        if (this._cacheMap[cache])
        {
            for (var key in this._cacheMap[cache])
            {
                if (key !== '__default' && key !== '__missing')
                {
                    out.push(key);
                }
            }
        }

        return out;

    },

    /////////////////////
    //  Remove Methods //
    /////////////////////

    /**
    * Removes a canvas from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeCanvas
    * @param {string} key - Key of the asset you want to remove.
    */
    removeCanvas: function (key) {

        delete this._cache.canvas[key];

    },

    /**
    * Removes an image from the cache.
    *
    * You can optionally elect to destroy it as well. This calls BaseTexture.destroy on it.
    *
    * Note that this only removes it from the Phaser and PIXI Caches. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeImage
    * @param {string} key - Key of the asset you want to remove.
    * @param {boolean} [removeFromPixi=true] - Should this image also be destroyed? Removing it from the PIXI.BaseTextureCache?
    */
    removeImage: function (key, removeFromPixi) {

        if (removeFromPixi === undefined) { removeFromPixi = true; }

        var img = this.getImage(key, true);

        if (removeFromPixi && img.base)
        {
            img.base.destroy();
        }

        delete this._cache.image[key];

    },

    /**
    * Removes a sound from the cache.
    *
    * If any `Phaser.Sound` objects use the audio file in the cache that you remove with this method, they will
    * _automatically_ destroy themselves. If you wish to have full control over when Sounds are destroyed then
    * you must finish your house-keeping and destroy them all yourself first, before calling this method.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeSound
    * @param {string} key - Key of the asset you want to remove.
    */
    removeSound: function (key) {

        delete this._cache.sound[key];

    },

    /**
    * Removes a text file from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeText
    * @param {string} key - Key of the asset you want to remove.
    */
    removeText: function (key) {

        delete this._cache.text[key];

    },

    /**
    * Removes a physics data file from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removePhysics
    * @param {string} key - Key of the asset you want to remove.
    */
    removePhysics: function (key) {

        delete this._cache.physics[key];

    },

    /**
    * Removes a tilemap from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeTilemap
    * @param {string} key - Key of the asset you want to remove.
    */
    removeTilemap: function (key) {

        delete this._cache.tilemap[key];

    },

    /**
    * Removes a binary file from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeBinary
    * @param {string} key - Key of the asset you want to remove.
    */
    removeBinary: function (key) {

        delete this._cache.binary[key];

    },

    /**
    * Removes a bitmap data from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeBitmapData
    * @param {string} key - Key of the asset you want to remove.
    */
    removeBitmapData: function (key) {

        delete this._cache.bitmapData[key];

    },

    /**
    * Removes a bitmap font from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeBitmapFont
    * @param {string} key - Key of the asset you want to remove.
    */
    removeBitmapFont: function (key) {

        delete this._cache.bitmapFont[key];

    },

    /**
    * Removes a json object from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeJSON
    * @param {string} key - Key of the asset you want to remove.
    */
    removeJSON: function (key) {

        delete this._cache.json[key];

    },

    /**
    * Removes a xml object from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeXML
    * @param {string} key - Key of the asset you want to remove.
    */
    removeXML: function (key) {

        delete this._cache.xml[key];

    },

    /**
    * Removes a video from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeVideo
    * @param {string} key - Key of the asset you want to remove.
    */
    removeVideo: function (key) {

        delete this._cache.video[key];

    },

    /**
    * Removes a shader from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeShader
    * @param {string} key - Key of the asset you want to remove.
    */
    removeShader: function (key) {

        delete this._cache.shader[key];

    },

    /**
    * Removes a Render Texture from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeRenderTexture
    * @param {string} key - Key of the asset you want to remove.
    */
    removeRenderTexture: function (key) {

        delete this._cache.renderTexture[key];

    },

    /**
    * Removes a Sprite Sheet from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeSpriteSheet
    * @param {string} key - Key of the asset you want to remove.
    */
    removeSpriteSheet: function (key) {

        delete this._cache.spriteSheet[key];

    },

    /**
    * Removes a Texture Atlas from the cache.
    *
    * Note that this only removes it from the Phaser.Cache. If you still have references to the data elsewhere
    * then it will persist in memory.
    *
    * @method Phaser.Cache#removeTextureAtlas
    * @param {string} key - Key of the asset you want to remove.
    */
    removeTextureAtlas: function (key) {

        delete this._cache.atlas[key];

    },

    /**
    * Empties out all of the GL Textures from Images stored in the cache.
    * This is called automatically when the WebGL context is lost and then restored.
    *
    * @method Phaser.Cache#clearGLTextures
    * @protected
    */
    clearGLTextures: function () {

        for (var key in this._cache.image)
        {
            this._cache.image[key].base._glTextures = [];
        }

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
    * If an object in the cache has a `destroy` method it will also be called.
    *
    * @method Phaser.Cache#destroy
    */
    destroy: function () {

        for (var i = 0; i < this._cacheMap.length; i++)
        {
            var cache = this._cacheMap[i];

            for (var key in cache)
            {
                if (key !== '__default' && key !== '__missing')
                {
                    if (cache[key]['destroy'])
                    {
                        cache[key].destroy();
                    }

                    delete cache[key];
                }
            }
        }

        this._urlMap = null;
        this._urlResolver = null;
        this._urlTemp = null;

    }

};

Phaser.Cache.prototype.constructor = Phaser.Cache;
