/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
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
    * @property {boolean} autoResolveURL - Automatically resolve resource URLs to absolute paths for use with the Cache.getURL method.
    */
    this.autoResolveURL = false;

    /**
    * @property {object} _canvases - Canvas key-value container.
    * @private
    */
    this._canvases = {};

    /**
    * @property {object} _images - Image key-value container.
    * @private
    */
    this._images = {};

    /**
    * @property {object} _textures - RenderTexture key-value container.
    * @private
    */
    this._textures = {};

    /**
    * @property {object} _sounds - Sound key-value container.
    * @private
    */
    this._sounds = {};

    /**
    * @property {object} _text - Text key-value container.
    * @private
    */
    this._text = {};

    /**
    * @property {object} _json - JSOIN key-value container.
    * @private
    */
    this._json = {};

    /**
    * @property {object} _xml - XML key-value container.
    * @private
    */
    this._xml = {};

    /**
    * @property {object} _physics - Physics data key-value container.
    * @private
    */
    this._physics = {};

    /**
    * @property {object} _tilemaps - Tilemap key-value container.
    * @private
    */
    this._tilemaps = {};

    /**
    * @property {object} _binary - Binary file key-value container.
    * @private
    */
    this._binary = {};

    /**
    * @property {object} _bitmapDatas - BitmapData key-value container.
    * @private
    */
    this._bitmapDatas = {};

    /**
    * @property {object} _bitmapFont - BitmapFont key-value container.
    * @private
    */
    this._bitmapFont = {};

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
    */
    this._cacheMap = [];

    this._cacheMap[Phaser.Cache.CANVAS] = this._canvases;
    this._cacheMap[Phaser.Cache.IMAGE] = this._images;
    this._cacheMap[Phaser.Cache.TEXTURE] = this._textures;
    this._cacheMap[Phaser.Cache.SOUND] = this._sounds;
    this._cacheMap[Phaser.Cache.TEXT] = this._text;
    this._cacheMap[Phaser.Cache.PHYSICS] = this._physics;
    this._cacheMap[Phaser.Cache.TILEMAP] = this._tilemaps;
    this._cacheMap[Phaser.Cache.BINARY] = this._binary;
    this._cacheMap[Phaser.Cache.BITMAPDATA] = this._bitmapDatas;
    this._cacheMap[Phaser.Cache.BITMAPFONT] = this._bitmapFont;
    this._cacheMap[Phaser.Cache.JSON] = this._json;
    this._cacheMap[Phaser.Cache.XML] = this._xml;

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

        this._canvases[key] = { canvas: canvas, context: context };

    },

    /**
    * Add a binary object in to the cache.
    *
    * @method Phaser.Cache#addBinary
    * @param {string} key - Asset key for this binary data.
    * @param {object} binaryData - The binary object to be addded to the cache.
    */
    addBinary: function (key, binaryData) {

        this._binary[key] = binaryData;

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

        this._bitmapDatas[key] = { data: bitmapData, frameData: frameData };

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

        this._textures[key] = { texture: texture, frame: frame };

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

        this._images[key] = { url: url, data: data, frameWidth: frameWidth, frameHeight: frameHeight, margin: margin, spacing: spacing };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        this._images[key].frameData = Phaser.AnimationParser.spriteSheet(this.game, key, frameWidth, frameHeight, frameMax, margin, spacing);

        this._resolveURL(url, this._images[key]);

    },

    /**
    * Add a new tilemap to the Cache.
    *
    * @method Phaser.Cache#addTilemap
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of the tilemap image.
    * @param {object} mapData - The tilemap data object (either a CSV or JSON file).
    * @param {number} format - The format of the tilemap data.
    */
    addTilemap: function (key, url, mapData, format) {

        this._tilemaps[key] = { url: url, data: mapData, format: format };

        this._resolveURL(url, this._tilemaps[key]);

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

        this._images[key] = { url: url, data: data };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY)
        {
            this._images[key].frameData = Phaser.AnimationParser.JSONData(this.game, atlasData, key);
        }
        else if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
        {
            this._images[key].frameData = Phaser.AnimationParser.JSONDataHash(this.game, atlasData, key);
        }
        else if (format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
        {
            this._images[key].frameData = Phaser.AnimationParser.XMLData(this.game, atlasData, key);
        }

        this._resolveURL(url, this._images[key]);

    },

    /**
    * Add a new Bitmap Font to the Cache.
    *
    * @method Phaser.Cache#addBitmapFont
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this font xml file.
    * @param {object} data - Extra font data.
    * @param {object} xmlData - Texture atlas frames data.
    * @param {number} [xSpacing=0] - If you'd like to add additional horizontal spacing between the characters then set the pixel value here.
    * @param {number} [ySpacing=0] - If you'd like to add additional vertical spacing between the lines then set the pixel value here.
    */
    addBitmapFont: function (key, url, data, xmlData, xSpacing, ySpacing) {

        this._images[key] = { url: url, data: data };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        Phaser.LoaderParser.bitmapFont(this.game, xmlData, key, xSpacing, ySpacing);

        this._bitmapFont[key] = PIXI.BitmapText.fonts[key];

        this._resolveURL(url, this._bitmapFont[key]);

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

        this._physics[key] = { url: url, data: JSONData, format: format };

        this._resolveURL(url, this._physics[key]);

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

        this._images['__default'] = { url: null, data: img };
        this._images['__default'].frame = new Phaser.Frame(0, 0, 0, 32, 32, '', '');
        this._images['__default'].frameData = new Phaser.FrameData();
        this._images['__default'].frameData.addFrame(new Phaser.Frame(0, 0, 0, 32, 32, null, this.game.rnd.uuid()));

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

        this._images['__missing'] = { url: null, data: img };
        this._images['__missing'].frame = new Phaser.Frame(0, 0, 0, 32, 32, '', '');
        this._images['__missing'].frameData = new Phaser.FrameData();
        this._images['__missing'].frameData.addFrame(new Phaser.Frame(0, 0, 0, 32, 32, null, this.game.rnd.uuid()));

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

        this._text[key] = { url: url, data: data };

        this._resolveURL(url, this._text[key]);

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

        this._json[key] = { url: url, data: data };

        this._resolveURL(url, this._json[key]);

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

        this._xml[key] = { url: url, data: data };

        this._resolveURL(url, this._xml[key]);

    },

    /**
    * Adds an Image file into the Cache. The file must have already been loaded, typically via Phaser.Loader, but can also have been loaded into the DOM.
    *
    * @method Phaser.Cache#addImage
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this image file.
    * @param {object} data - Extra image data.
    */
    addImage: function (key, url, data) {

        this._images[key] = { url: url, data: data };

        this._images[key].frame = new Phaser.Frame(0, 0, 0, data.width, data.height, key, this.game.rnd.uuid());
        this._images[key].frameData = new Phaser.FrameData();
        this._images[key].frameData.addFrame(new Phaser.Frame(0, 0, 0, data.width, data.height, url, this.game.rnd.uuid()));

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        this._resolveURL(url, this._images[key]);

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

        this._sounds[key] = { url: url, data: data, isDecoding: false, decoded: decoded, webAudio: webAudio, audioTag: audioTag, locked: this.game.sound.touchLocked };

        this._resolveURL(url, this._sounds[key]);

    },

    /**
    * Reload a Sound file from the server.
    *
    * @method Phaser.Cache#reloadSound
    * @param {string} key - Asset key for the sound.
    */
    reloadSound: function (key) {

        var _this = this;

        if (this._sounds[key])
        {
            this._sounds[key].data.src = this._sounds[key].url;

            this._sounds[key].data.addEventListener('canplaythrough', function () {
                return _this.reloadSoundComplete(key);
            }, false);

            this._sounds[key].data.load();
        }
    },

    /**
    * Fires the onSoundUnlock event when the sound has completed reloading.
    *
    * @method Phaser.Cache#reloadSoundComplete
    * @param {string} key - Asset key for the sound.
    */
    reloadSoundComplete: function (key) {

        if (this._sounds[key])
        {
            this._sounds[key].locked = false;
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

        if (this._sounds[key])
        {
            this._sounds[key][property] = value;
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

        this._sounds[key].data = data;
        this._sounds[key].decoded = true;
        this._sounds[key].isDecoding = false;

    },

    /**
    * Get a canvas object from the cache by its key.
    *
    * @method Phaser.Cache#getCanvas
    * @param {string} key - Asset key of the canvas to retrieve from the Cache.
    * @return {object} The canvas object.
    */
    getCanvas: function (key) {

        if (this._canvases[key])
        {
            return this._canvases[key].canvas;
        }
        else
        {
            console.warn('Phaser.Cache.getCanvas: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Get a BitmapData object from the cache by its key.
    *
    * @method Phaser.Cache#getBitmapData
    * @param {string} key - Asset key of the BitmapData object to retrieve from the Cache.
    * @return {Phaser.BitmapData} The requested BitmapData object if found, or null if not.
    */
    getBitmapData: function (key) {

        if (this._bitmapDatas[key])
        {
            return this._bitmapDatas[key].data;
        }
        else
        {
            console.warn('Phaser.Cache.getBitmapData: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Get a BitmapFont object from the cache by its key.
    *
    * @method Phaser.Cache#getBitmapFont
    * @param {string} key - Asset key of the BitmapFont object to retrieve from the Cache.
    * @return {Phaser.BitmapFont} The requested BitmapFont object if found, or null if not.
    */
    getBitmapFont: function (key) {

        if (this._bitmapFont[key])
        {
            return this._bitmapFont[key];
        }
        else
        {
            console.warn('Phaser.Cache.getBitmapFont: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Get a physics data object from the cache by its key. You can get either the entire data set, a single object or a single fixture of an object from it.
    *
    * @method Phaser.Cache#getPhysicsData
    * @param {string} key - Asset key of the physics data object to retrieve from the Cache.
    * @param {string} [object=null] - If specified it will return just the physics object that is part of the given key, if null it will return them all.
    * @param {string} fixtureKey - Fixture key of fixture inside an object. This key can be set per fixture with the Phaser Exporter.
    * @return {object} The requested physics object data if found.
    */
    getPhysicsData: function (key, object, fixtureKey) {

        if (typeof object === 'undefined' || object === null)
        {
            //  Get 'em all
            if (this._physics[key])
            {
                return this._physics[key].data;
            }
            else
            {
                console.warn('Phaser.Cache.getPhysicsData: Invalid key: "' + key + '"');
            }
        }
        else
        {
            if (this._physics[key] && this._physics[key].data[object])
            {
                var fixtures = this._physics[key].data[object];

                //try to find a fixture by it's fixture key if given
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
    * Gets an image by its key. Note that this returns a DOM Image object, not a Phaser object.
    *
    * @method Phaser.Cache#getImage
    * @param {string} key - Asset key of the image to retrieve from the Cache.
    * @return {Image} The Image object if found in the Cache, otherwise `null`.
    */
    getImage: function (key) {

        if (this._images[key])
        {
            return this._images[key].data;
        }
        else
        {
            console.warn('Phaser.Cache.getImage: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Get tilemap data by key.
    *
    * @method Phaser.Cache#getTilemapData
    * @param {string} key - Asset key of the tilemap data to retrieve from the Cache.
    * @return {object} The raw tilemap data in CSV or JSON format.
    */
    getTilemapData: function (key) {

        if (this._tilemaps[key])
        {
            return this._tilemaps[key];
        }
        else
        {
            console.warn('Phaser.Cache.getTilemapData: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Get frame data by key.
    *
    * @method Phaser.Cache#getFrameData
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @param {string} [map=Phaser.Cache.IMAGE] - The asset map to get the frameData from, for example `Phaser.Cache.IMAGE`.
    * @return {Phaser.FrameData} The frame data.
    */
    getFrameData: function (key, map) {

        if (typeof map === 'undefined') { map = Phaser.Cache.IMAGE; }

        if (this._cacheMap[map][key])
        {
            return this._cacheMap[map][key].frameData;
        }

        return null;
    },

    /**
    * Replaces a set of frameData with a new Phaser.FrameData object.
    *
    * @method Phaser.Cache#updateFrameData
    * @param {string} key - The unique key by which you will reference this object.
    * @param {number} frameData - The new FrameData.
    */
    updateFrameData: function (key, frameData) {

        if (this._images[key])
        {
            this._images[key].frameData = frameData;
        }

    },

    /**
    * Get a single frame out of a frameData set by key.
    *
    * @method Phaser.Cache#getFrameByIndex
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @return {Phaser.Frame} The frame object.
    */
    getFrameByIndex: function (key, frame) {

        if (this._images[key])
        {
            return this._images[key].frameData.getFrame(frame);
        }

        return null;
    },

    /**
    * Get a single frame out of a frameData set by key.
    *
    * @method Phaser.Cache#getFrameByName
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @return {Phaser.Frame} The frame object.
    */
    getFrameByName: function (key, frame) {

        if (this._images[key])
        {
            return this._images[key].frameData.getFrameByName(frame);
        }

        return null;
    },

    /**
    * Get a single frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
    *
    * @method Phaser.Cache#getFrame
    * @param {string} key - Asset key of the frame data to retrieve from the Cache.
    * @return {Phaser.Frame} The frame data.
    */
    getFrame: function (key) {

        if (this._images[key])
        {
            return this._images[key].frame;
        }

        return null;
    },

    /**
    * Get a single texture frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
    *
    * @method Phaser.Cache#getTextureFrame
    * @param {string} key - Asset key of the frame to retrieve from the Cache.
    * @return {Phaser.Frame} The frame data.
    */
    getTextureFrame: function (key) {

        if (this._textures[key])
        {
            return this._textures[key].frame;
        }

        return null;
    },

    /**
    * Get a RenderTexture by key.
    *
    * @method Phaser.Cache#getRenderTexture
    * @param {string} key - Asset key of the RenderTexture to retrieve from the Cache.
    * @return {Phaser.RenderTexture} The RenderTexture object.
    */
    getRenderTexture: function (key) {

        if (this._textures[key])
        {
            return this._textures[key];
        }
        else
        {
            console.warn('Phaser.Cache.getTexture: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * DEPRECATED: Please use Cache.getRenderTexture instead. This method will be removed in Phaser 2.2.0.
    * 
    * Get a RenderTexture by key.
    *
    * @method Phaser.Cache#getTexture
    * @deprecated Please use Cache.getRenderTexture instead. This method will be removed in Phaser 2.2.0.
    * @param {string} key - Asset key of the RenderTexture to retrieve from the Cache.
    * @return {Phaser.RenderTexture} The RenderTexture object.
    */
    getTexture: function (key) {

        if (this._textures[key])
        {
            return this._textures[key];
        }
        else
        {
            console.warn('Phaser.Cache.getTexture: Invalid key: "' + key + '"');
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

        if (this._sounds[key])
        {
            return this._sounds[key];
        }
        else
        {
            console.warn('Phaser.Cache.getSound: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Get sound data by key.
    *
    * @method Phaser.Cache#getSoundData
    * @param {string} key - Asset key of the sound to retrieve from the Cache.
    * @return {object} The sound data.
    */
    getSoundData: function (key) {

        if (this._sounds[key])
        {
            return this._sounds[key].data;
        }
        else
        {
            console.warn('Phaser.Cache.getSoundData: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Check if the given sound has finished decoding.
    *
    * @method Phaser.Cache#isSoundDecoded
    * @param {string} key - Asset key of the sound in the Cache.
    * @return {boolean} The decoded state of the Sound object.
    */
    isSoundDecoded: function (key) {

        if (this._sounds[key])
        {
            return this._sounds[key].decoded;
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

        return (this._sounds[key] && this._sounds[key].decoded && this.game.sound.touchLocked === false);

    },

    /**
    * Get the number of frames in this image.
    *
    * @method Phaser.Cache#getFrameCount
    * @param {string} key - Asset key of the image you want.
    * @return {number} Then number of frames. 0 if the image is not found.
    */
    getFrameCount: function (key) {

        if (this._images[key])
        {
            return this._images[key].frameData.total;
        }

        return 0;

    },

    /**
    * Get text data by key.
    *
    * @method Phaser.Cache#getText
    * @param {string} key - Asset key of the text data to retrieve from the Cache.
    * @return {object} The text data.
    */
    getText: function (key) {

        if (this._text[key])
        {
            return this._text[key].data;
        }
        else
        {
            console.warn('Phaser.Cache.getText: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Get a JSON object by key from the cache.
    *
    * @method Phaser.Cache#getJSON
    * @param {string} key - Asset key of the json object to retrieve from the Cache.
    * @return {object} The JSON object.
    */
    getJSON: function (key) {

        if (this._json[key])
        {
            return this._json[key].data;
        }
        else
        {
            console.warn('Phaser.Cache.getJSON: Invalid key: "' + key + '"');
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

        if (this._xml[key])
        {
            return this._xml[key].data;
        }
        else
        {
            console.warn('Phaser.Cache.getXML: Invalid key: "' + key + '"');
            return null;
        }

    },

    /**
    * Get binary data by key.
    *
    * @method Phaser.Cache#getBinary
    * @param {string} key - Asset key of the binary data object to retrieve from the Cache.
    * @return {object} The binary data object.
    */
    getBinary: function (key) {

        if (this._binary[key])
        {
            return this._binary[key];
        }
        else
        {
            console.warn('Phaser.Cache.getBinary: Invalid key: "' + key + '"');
            return null;
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
    * DEPRECATED: Please use Cache.getURL instead.
    * Get a cached object by the URL.
    * This only returns a value if you set Cache.autoResolveURL to `true` *before* starting the preload of any assets.
    * Be aware that every call to this function makes a DOM src query, so use carefully and double-check for implications in your target browsers/devices.
    *
    * @method Phaser.Cache#getUrl
    * @deprecated Please use Cache.getURL instead.
    * @param {string} url - The url for the object loaded to get from the cache.
    * @return {object} The cached object.
    */
    getUrl: function (url) {

        return this.getURL(url);

    },

    /**
    * Gets all keys used by the Cache for the given data type.
    *
    * @method Phaser.Cache#getKeys
    * @param {number} [type=Phaser.Cache.IMAGE] - The type of Cache keys you wish to get. Can be Cache.CANVAS, Cache.IMAGE, Cache.SOUND, etc.
    * @return {Array} The array of item keys.
    */
    getKeys: function (type) {

        var array = null;

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

    },

    /**
    * Removes a canvas from the cache.
    *
    * @method Phaser.Cache#removeCanvas
    * @param {string} key - Key of the asset you want to remove.
    */
    removeCanvas: function (key) {
        delete this._canvases[key];
    },

    /**
    * Removes an image from the cache and optionally from the Pixi.BaseTextureCache as well.
    *
    * @method Phaser.Cache#removeImage
    * @param {string} key - Key of the asset you want to remove.
    * @param {boolean} [removeFromPixi=true] - Should this image also be removed from the Pixi BaseTextureCache?
    */
    removeImage: function (key, removeFromPixi) {

        if (typeof removeFromPixi === 'undefined') { removeFromPixi = true; }

        delete this._images[key];

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
        delete this._sounds[key];
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

        for (var item in this._canvases)
        {
            delete this._canvases[item];
        }

        for (var item in this._images)
        {
            if (item !== '__default' && item !== '__missing')
            {
                delete this._images[item];
            }
        }

        for (var item in this._sounds)
        {
            delete this._sounds[item];
        }

        for (var item in this._text)
        {
            delete this._text[item];
        }

        for (var item in this._json)
        {
            delete this._json[item];
        }

        for (var item in this._xml)
        {
            delete this._xml[item];
        }

        for (var item in this._textures)
        {
            delete this._textures[item];
        }

        for (var item in this._physics)
        {
            delete this._physics[item];
        }

        for (var item in this._tilemaps)
        {
            delete this._tilemaps[item];
        }

        for (var item in this._binary)
        {
            delete this._binary[item];
        }

        for (var item in this._bitmapDatas)
        {
            delete this._bitmapDatas[item];
        }

        for (var item in this._bitmapFont)
        {
            delete this._bitmapFont[item];
        }

        this._urlMap = null;
        this._urlResolver = null;
        this._urlTemp = null;

    }

};

Phaser.Cache.prototype.constructor = Phaser.Cache;
