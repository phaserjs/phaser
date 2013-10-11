/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.Cache constructor.
*
* @class    Phaser.Cache
* @classdesc A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Cache = function (game) {

    /**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;

	/**
	* @property {object} game - Canvas key-value container.
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
	* @property {object} _tilemaps - Tilemap key-value container.
	* @private
	*/
    this._tilemaps = {};

    /**
    * @property {object} _tilesets - Tileset key-value container.
    * @private
    */
    this._tilesets = {};

    this.addDefaultImage();

    /**
	* @property {Phaser.Signal} onSoundUnlock - Description.
	*/
    this.onSoundUnlock = new Phaser.Signal;

};

Phaser.Cache.prototype = {

    /**
    * Add a new canvas object in to the cache.
    * @method Phaser.Cache#addCanvas
    * @param {string} key - Asset key for this canvas.
    * @param {HTMLCanvasElement} canvas - Canvas DOM element.
    * @param {CanvasRenderingContext2D} context - Render context of this canvas.
    */
    addCanvas: function (key, canvas, context) {

        this._canvases[key] = { canvas: canvas, context: context };

    },

    /**
    * Add a new Phaser.RenderTexture in to the cache.
    *
    * @method Phaser.Cache#addRenderTexture
    * @param {string} key - The unique key by which you will reference this object.
    * @param {Phaser.Texture} textue - The texture to use as the base of the RenderTexture.
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
    * @param {number} frameMax - How many frames stored in the sprite sheet.
    */
    addSpriteSheet: function (key, url, data, frameWidth, frameHeight, frameMax) {

        this._images[key] = { url: url, data: data, spriteSheet: true, frameWidth: frameWidth, frameHeight: frameHeight };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        this._images[key].frameData = Phaser.AnimationParser.spriteSheet(this.game, key, frameWidth, frameHeight, frameMax);

    },

    /**
    * Add a new tile set in to the cache.
    *
    * @method Phaser.Cache#addTileset
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this tile set file.
    * @param {object} data - Extra tile set data.
    * @param {number} tileWidth - Width of the sprite sheet.
    * @param {number} tileHeight - Height of the sprite sheet.
    * @param {number} tileMax - How many tiles stored in the sprite sheet.
    */
    addTileset: function (key, url, data, tileWidth, tileHeight, tileMax) {

        this._tilesets[key] = { url: url, data: data, tileWidth: tileWidth, tileHeight: tileHeight };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        this._tilesets[key].tileData = Phaser.TilemapParser.tileset(this.game, key, tileWidth, tileHeight, tileMax);

    },

    /**
    * Add a new tilemap.
    *
    * @method Phaser.Cache#addTilemap
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of the tilemap image.
    * @param {object} data - Tilemap data.
    * @param {object} mapData - The tilemap data object.
    * @param {number} format - The format of the tilemap data.
    */
    addTilemap: function (key, url, data, mapData, format) {

        this._tilemaps[key] = { url: url, data: data, spriteSheet: true, mapData: mapData, format: format };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

    },

    /**
    * Add a new texture atlas.
    *
    * @method Phaser.Cache#addTextureAtlas
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this texture atlas file.
    * @param {object} data - Extra texture atlas data.
    * @param {object} atlasData  - Texture atlas frames data.
    * @param {number} format - The format of the texture atlas.
    */
    addTextureAtlas: function (key, url, data, atlasData, format) {

        this._images[key] = { url: url, data: data, spriteSheet: true };

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

    },

    /**
    * Add a new Bitmap Font.
    *
    * @method Phaser.Cache#addBitmapFont
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this font xml file.
    * @param {object} data - Extra font data.
    * @param xmlData {object} Texture atlas frames data.
    */
    addBitmapFont: function (key, url, data, xmlData) {

        this._images[key] = { url: url, data: data, spriteSheet: true };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        Phaser.LoaderParser.bitmapFont(this.game, xmlData, key);
        // this._images[key].frameData = Phaser.AnimationParser.XMLData(this.game, xmlData, key);

    },

    /**
    * Adds a default image to be used when a key is wrong / missing. Is mapped to the key __default.
    *
    * @method Phaser.Cache#addDefaultImage
    */
    addDefaultImage: function () {

        var img = new Image();
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==";

        this._images['__default'] = { url: null, data: img, spriteSheet: false };
        this._images['__default'].frame = new Phaser.Frame(0, 0, 0, 32, 32, '', '');

        PIXI.BaseTextureCache['__default'] = new PIXI.BaseTexture(img);
        PIXI.TextureCache['__default'] = new PIXI.Texture(PIXI.BaseTextureCache['__default']);

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

        this._text[key] = {
            url: url,
            data: data
        };

    },

    /**
    * Add a new image.
    *
    * @method Phaser.Cache#addImage
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this image file.
    * @param {object} data - Extra image data.
    */
    addImage: function (key, url, data) {

        this._images[key] = { url: url, data: data, spriteSheet: false };
        this._images[key].frame = new Phaser.Frame(0, 0, 0, data.width, data.height, '', '');

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

    },

    /**
    * Add a new sound.
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

        var locked = this.game.sound.touchLocked;
        var decoded = false;

        if (audioTag)
        {
            decoded = true;
        }

        this._sounds[key] = { url: url, data: data, isDecoding: false, decoded: decoded, webAudio: webAudio, audioTag: audioTag };

    },

    /**
    * Reload a sound.
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
    * Description.
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
    * Description.
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
	* Get acanvas object from the cache by its key.
    *
    * @method Phaser.Cache#getCanvas
	* @param {string} key - Asset key of the canvas you want.
	* @return {object} The canvas you want.
	*/
    getCanvas: function (key) {

        if (this._canvases[key])
        {
            return this._canvases[key].canvas;
        }

        return null;
    },

    /**
    * Checks if an image key exists.
    *
    * @method Phaser.Cache#checkImageKey
    * @param {string} key - Asset key of the image you want.
    * @return {boolean} True if the key exists, otherwise false.
    */    
    checkImageKey: function (key) {

        if (this._images[key])
        {
            return true;
        }

        return false;

    },

	/**
	* Get image data by key.
    *
    * @method Phaser.Cache#getImage
	* @param {string} key - Asset key of the image you want.
	* @return {object} The image data you want.
	*/    
    getImage: function (key) {

        if (this._images[key])
        {
            return this._images[key].data;
        }

        return null;
    },

    /**
    * Get tile set image data by key.
    *
    * @method Phaser.Cache#getTileSetImage
    * @param {string} key - Asset key of the image you want.
    * @return {object} The image data you want.
    */    
    getTilesetImage: function (key) {

        if (this._tilesets[key])
        {
            return this._tilesets[key].data;
        }

        return null;

    },

    /**
    * Get tile set image data by key.
    *
    * @method Phaser.Cache#getTileset
    * @param {string} key - Asset key of the image you want.
    * @return {Phaser.Tileset} The tileset data. The tileset image is in the data property, the tile data in tileData.
    */    
    getTileset: function (key) {

        if (this._tilesets[key])
        {
            return this._tilesets[key];
        }

        return null;

    },

    /**
    * Get tilemap data by key.
    *
    * @method Phaser.Cache#getTilemap
    * @param {string} key - Asset key of the tilemap you want.
    * @return {Phaser.Tilemap} The tilemap data. The tileset image is in the data property, the map data in mapData.
    */
    getTilemap: function (key) {

        if (this._tilemaps[key])
        {
            return this._tilemaps[key];
        }

        return null;
    },

	/**
	* Get frame data by key.
    *
    * @method Phaser.Cache#getFrameData
	* @param {string} key - Asset key of the frame data you want.
	* @return {Phaser.FrameData} The frame data you want.
	*/
    getFrameData: function (key) {

        if (this._images[key] && this._images[key].frameData)
        {
            return this._images[key].frameData;
        }

        return null;
    },

    /**
    * Get a single frame out of a frameData set by key.
    *
    * @method Phaser.Cache#getFrameByIndex
    * @param {string} key - Asset key of the frame data you want.
    * @return {Phaser.Frame} The frame data you want.
    */
    getFrameByIndex: function (key, frame) {

        if (this._images[key] && this._images[key].frameData)
        {
            return this._images[key].frameData.getFrame(frame);
        }

        return null;
    },

    /**
    * Get a single frame out of a frameData set by key.
    *
    * @method Phaser.Cache#getFrameByName
    * @param {string} key - Asset key of the frame data you want.
    * @return {Phaser.Frame} The frame data you want.
    */
    getFrameByName: function (key, frame) {

        if (this._images[key] && this._images[key].frameData)
        {
            return this._images[key].frameData.getFrameByName(frame);
        }

        return null;
    },

    /**
    * Get a single frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
    *
    * @method Phaser.Cache#getFrame
    * @param {string} key - Asset key of the frame data you want.
    * @return {Phaser.Frame} The frame data you want.
    */
    getFrame: function (key) {

        if (this._images[key] && this._images[key].spriteSheet == false)
        {
            return this._images[key].frame;
        }

        return null;
    },

    /**
    * Get a single frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
    *
    * @method Phaser.Cache#getTextureFrame
    * @param {string} key - Asset key of the frame data you want.
    * @return {Phaser.Frame} The frame data you want.
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
    * @method Phaser.Cache#getTexture
    * @param {string} key - Asset key of the RenderTexture you want.
    * @return {Phaser.RenderTexture} The RenderTexture you want.
    */
    getTexture: function (key) {

        if (this._textures[key])
        {
            return this._textures[key];
        }

        return null;

    },

	/**
	* Get sound by key.
    *
    * @method Phaser.Cache#getSound
	* @param {string} key - Asset key of the sound you want.
	* @return {Phaser.Sound} The sound you want.
	*/
    getSound: function (key) {

        if (this._sounds[key])
        {
            return this._sounds[key];
        }

        return null;

    },

	/**
	* Get sound data by key.
    *
    * @method Phaser.Cache#getSoundData
	* @param {string} key - Asset key of the sound you want.
	* @return {object} The sound data you want.
	*/
    getSoundData: function (key) {

        if (this._sounds[key])
        {
            return this._sounds[key].data;
        }

        return null;

    },

	/**
	* Check if the given sound has finished decoding.
    *
    * @method Phaser.Cache#isSoundDecoded
	* @param {string} key - Asset key of the sound you want.
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
	* @param {string} key - Asset key of the sound you want.
	* @return {boolean} True if the sound is decoded and the device is not touch locked.
	*/
    isSoundReady: function (key) {

        return (this._sounds[key] && this._sounds[key].decoded && this.game.sound.touchLocked == false);

    },

	/**
	* Check whether an image asset is sprite sheet or not.
    *
    * @method Phaser.Cache#isSpriteSheet
	* @param {string} key - Asset key of the sprite sheet you want.
	* @return {boolean} True if the image is a sprite sheet.
	*/
    isSpriteSheet: function (key) {

        if (this._images[key])
        {
            return this._images[key].spriteSheet;
        }

        return false;

    },

	/**
	* Get text data by key.
    *
    * @method Phaser.Cache#getText
	* @param {string} key - Asset key of the text data you want.
	* @return {object} The text data you want.
	*/
    getText: function (key) {

        if (this._text[key])
        {
            return this._text[key].data;
        }

        return null;
        
    },

    /**
    * Get the cache keys from a given array of objects.
    * Normally you don't call this directly but instead use getImageKeys, getSoundKeys, etc.
    *
    * @method Phaser.Cache#getKeys
    * @param {Array} array - An array of items to return the keys for.
    * @return {Array} The array of item keys.
    */
    getKeys: function (array) {

        var output = [];

        for (var item in array)
        {
            if (item !== '__default')
            {
                output.push(item);
            }
        }

        return output;

    },

	/**
	* Returns an array containing all of the keys of Images in the Cache.
    *
    * @method Phaser.Cache#getImageKeys
	* @return {Array} The string based keys in the Cache.
	*/
    getImageKeys: function () {
    	return this.getKeys(this._images);
    },

	/**
	* Returns an array containing all of the keys of Sounds in the Cache.
    *
    * @method Phaser.Cache#getSoundKeys
	* @return {Array} The string based keys in the Cache.
	*/
    getSoundKeys: function () {
    	return this.getKeys(this._sounds);
    },

	/**
	* Returns an array containing all of the keys of Text Files in the Cache.
    *
    * @method Phaser.Cache#getTextKeys
	* @return {Array} The string based keys in the Cache.
	*/
    getTextKeys: function () {
    	return this.getKeys(this._text);
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
    * Removes an image from the cache.
    *
    * @method Phaser.Cache#removeImage
    * @param {string} key - Key of the asset you want to remove.
    */
    removeImage: function (key) {
        delete this._images[key];
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
	* Clears the cache. Removes every local cache object reference.
    *
	* @method Phaser.Cache#destroy
	*/
    destroy: function () {

        for (var item in this._canvases)
        {
            delete this._canvases[item['key']];
        }

        for (var item in this._images)
        {
            delete this._images[item['key']];
        }

        for (var item in this._sounds)
        {
            delete this._sounds[item['key']];
        }

        for (var item in this._text)
        {
            delete this._text[item['key']];
        }
    }

};
