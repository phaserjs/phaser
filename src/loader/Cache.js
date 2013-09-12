/**
* Cache
*
* A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
*
* @package    Phaser.Cache
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
Phaser.Cache = function (game) {

    /**
     * Local reference to Game.
     */
	this.game = game;

    /**
     * Canvas key-value container.
     * @type {object}
     * @private
     */
    this._canvases = {};

    /**
     * Image key-value container.
     * @type {object}
     */
    this._images = {};

    /**
     * RenderTexture key-value container.
     * @type {object}
     */
    this._textures = {};

    /**
     * Sound key-value container.
     * @type {object}
     */
    this._sounds = {};

    /**
     * Text key-value container.
     * @type {object}
     */
    this._text = {};

    /**
     * Tilemap key-value container.
     * @type {object}
     */
    this._tilemaps = {};

    this.addDefaultImage();

    this.onSoundUnlock = new Phaser.Signal;

};

Phaser.Cache.prototype = {

    /**
     * Add a new canvas.
     * @param key {string} Asset key for this canvas.
     * @param canvas {HTMLCanvasElement} Canvas DOM element.
     * @param context {CanvasRenderingContext2D} Render context of this canvas.
     */
    addCanvas: function (key, canvas, context) {

        this._canvases[key] = { canvas: canvas, context: context };

    },

    /**
     * Add a new canvas.
     * @param key {string} Asset key for this canvas.
     * @param canvas {RenderTexture} A RenderTexture.
     */
    addRenderTexture: function (key, texture) {

        var frame = new Phaser.Animation.Frame(0, 0, texture.width, texture.height, '', '');

        this._textures[key] = { texture: texture, frame: frame };

    },

    /**
     * Add a new sprite sheet.
     * @param key {string} Asset key for the sprite sheet.
     * @param url {string} URL of this sprite sheet file.
     * @param data {object} Extra sprite sheet data.
     * @param frameWidth {number} Width of the sprite sheet.
     * @param frameHeight {number} Height of the sprite sheet.
     * @param frameMax {number} How many frames stored in the sprite sheet.
     */
    addSpriteSheet: function (key, url, data, frameWidth, frameHeight, frameMax) {

        this._images[key] = { url: url, data: data, spriteSheet: true, frameWidth: frameWidth, frameHeight: frameHeight };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        this._images[key].frameData = Phaser.Animation.Parser.spriteSheet(this.game, key, frameWidth, frameHeight, frameMax);

    },

    /**
     * Add a new tilemap.
     * @param key  {string} Asset key for the texture atlas.
     * @param url  {string} URL of this texture atlas file.
     * @param data {object} Extra texture atlas data.
     * @param atlasData {object} Texture atlas frames data.
     */
    addTilemap: function (key, url, data, mapData, format) {

        this._tilemaps[key] = { url: url, data: data, spriteSheet: true, mapData: mapData, format: format };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

    },

    /**
     * Add a new texture atlas.
     * @param key  {string} Asset key for the texture atlas.
     * @param url  {string} URL of this texture atlas file.
     * @param data {object} Extra texture atlas data.
     * @param atlasData {object} Texture atlas frames data.
     */
    addTextureAtlas: function (key, url, data, atlasData, format) {

        this._images[key] = { url: url, data: data, spriteSheet: true };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY)
        {
            this._images[key].frameData = Phaser.Animation.Parser.JSONData(this.game, atlasData, key);
        }
        else if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
        {
            this._images[key].frameData = Phaser.Animation.Parser.JSONDataHash(this.game, atlasData, key);
        }
        else if (format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
        {
            this._images[key].frameData = Phaser.Animation.Parser.XMLData(this.game, atlasData, key);
        }

    },

    /**
     * Add a new Bitmap Font.
     * @param key  {string} Asset key for the font texture.
     * @param url  {string} URL of this font xml file.
     * @param data {object} Extra font data.
     * @param xmlData {object} Texture atlas frames data.
     */
    addBitmapFont: function (key, url, data, xmlData) {

        this._images[key] = { url: url, data: data, spriteSheet: true };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        Phaser.Loader.Parser.bitmapFont(this.game, xmlData, key);
        // this._images[key].frameData = Phaser.Animation.Parser.XMLData(this.game, xmlData, key);

    },

    /**
     * Adds a default image to be used when a key is wrong / missing.
     * Is mapped to the key __default
     */
    addDefaultImage: function () {

        this._images['__default'] = { url: null, data: null, spriteSheet: false };
        this._images['__default'].frame = new Phaser.Animation.Frame(0, 0, 32, 32, '', '');

        var base = new PIXI.BaseTexture();
        base.width = 32;
        base.height = 32;
        base.hasLoaded = true; // avoids a hanging event listener

        PIXI.BaseTextureCache['__default'] = base;
        PIXI.TextureCache['__default'] = new PIXI.Texture(base);

    },

    /**
     * Add a new image.
     * @param key {string} Asset key for the image.
     * @param url {string} URL of this image file.
     * @param data {object} Extra image data.
     */
    addImage: function (key, url, data) {

        this._images[key] = { url: url, data: data, spriteSheet: false };
        this._images[key].frame = new Phaser.Animation.Frame(0, 0, data.width, data.height, '', '');

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

    },

    /**
     * Add a new sound.
     * @param key {string} Asset key for the sound.
     * @param url {string} URL of this sound file.
     * @param data {object} Extra sound data.
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

    reloadSoundComplete: function (key) {

        if (this._sounds[key])
        {
            this._sounds[key].locked = false;
            this.onSoundUnlock.dispatch(key);
        }

    },

    updateSound: function (key, property, value) {
        
        if (this._sounds[key])
        {
            this._sounds[key][property] = value;
        }

    },

	/**
	* Add a new decoded sound.
	* @param key {string} Asset key for the sound.
	* @param data {object} Extra sound data.
	*/
    decodedSound: function (key, data) {

        this._sounds[key].data = data;
        this._sounds[key].decoded = true;
        this._sounds[key].isDecoding = false;

    },

	/**
	* Add a new text data.
	* @param key {string} Asset key for the text data.
	* @param url {string} URL of this text data file.
	* @param data {object} Extra text data.
	*/    
    addText: function (key, url, data) {

        this._text[key] = {
            url: url,
            data: data
        };

    },

	/**
	* Get canvas by key.
	* @param key Asset key of the canvas you want.
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
    * @param key Asset key of the image you want.
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
	* @param key Asset key of the image you want.
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
    * Get tilemap data by key.
    * @param key Asset key of the tilemap you want.
    * @return {object} The tilemap data. The tileset image is in the data property, the map data in mapData.
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
	* @param key Asset key of the frame data you want.
	* @return {object} The frame data you want.
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
    * @param key Asset key of the frame data you want.
    * @return {object} The frame data you want.
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
    * @param key Asset key of the frame data you want.
    * @return {object} The frame data you want.
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
    * @param key Asset key of the frame data you want.
    * @return {object} The frame data you want.
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
    * @param key Asset key of the frame data you want.
    * @return {object} The frame data you want.
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
    * @param key Asset key of the RenderTexture you want.
    * @return {object} The RenderTexture you want.
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
	* @param key Asset key of the sound you want.
	* @return {object} The sound you want.
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
	* @param key Asset key of the sound you want.
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
	* Check whether an asset is decoded sound.
	* @param key Asset key of the sound you want.
	* @return {object} The sound data you want.
	*/
    isSoundDecoded: function (key) {

        if (this._sounds[key])
        {
            return this._sounds[key].decoded;
        }

    },

	/**
	* Check whether an asset is decoded sound.
	* @param key Asset key of the sound you want.
	* @return {object} The sound data you want.
	*/
    isSoundReady: function (key) {

        return (this._sounds[key] && this._sounds[key].decoded && this.game.sound.touchLocked == false);

    },

	/**
	* Check whether an asset is sprite sheet.
	* @param key Asset key of the sprite sheet you want.
	* @return {object} The sprite sheet data you want.
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
	* @param key Asset key of the text data you want.
	* @return {object} The text data you want.
	*/
    getText: function (key) {

        if (this._text[key])
        {
            return this._text[key].data;
        }

        return null;
        
    },

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
	* @return {Array} The string based keys in the Cache.
	*/
    getImageKeys: function () {
    	return this.getKeys(this._images);
    },

	/**
	* Returns an array containing all of the keys of Sounds in the Cache.
	* @return {Array} The string based keys in the Cache.
	*/
    getSoundKeys: function () {
    	return this.getKeys(this._sounds);
    },

	/**
	* Returns an array containing all of the keys of Text Files in the Cache.
	* @return {Array} The string based keys in the Cache.
	*/
    getTextKeys: function () {
    	return this.getKeys(this._text);
    },

    removeCanvas: function (key) {
        delete this._canvases[key];
    },

    removeImage: function (key) {
        delete this._images[key];
    },

    removeSound: function (key) {
        delete this._sounds[key];
    },

    removeText: function (key) {
        delete this._text[key];
    },

	/**
	* Clean up cache memory.
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
