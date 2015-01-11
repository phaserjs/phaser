/* jshint wsh:true */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides progress and completion callbacks.
*
* @class Phaser.Loader
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Loader = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {boolean} isLoading - True if the Loader is in the process of loading the queue.
    * @default
    */
    this.isLoading = false;

    /**
    * @property {boolean} hasLoaded - True if all assets in the queue have finished loading.
    * @default
    */
    this.hasLoaded = false;

    /**
    * @property {number} progress - The rounded load progress percentage value (from 0 to 100)
    * @default
    */
    this.progress = 0;

    /**
    * @property {number} progressFloat - The non-rounded load progress value (from 0.0 to 100.0)
    * @default
    */
    this.progressFloat = 0;

    /**
    * You can optionally link a sprite to the preloader.
    * If you do so the Sprites width or height will be cropped based on the percentage loaded.
    * This property is an object containing: sprite, rect, direction, width and height
    *
    * @property {object} preloadSprite
    */
    this.preloadSprite = null;

    /**
    * @property {boolean|string} crossOrigin - The crossOrigin value applied to loaded images. Very often this needs to be set to 'anonymous'.
    * @default
    */
    this.crossOrigin = false;

    /**
    * If you want to append a URL before the path of any asset you can set this here.
    * Useful if you need to allow an asset url to be configured outside of the game code.
    * MUST have / on the end of it!
    * @property {string} baseURL
    * @default
    */
    this.baseURL = '';

    /**
    * @property {Phaser.Signal} onLoadStart - This event is dispatched when the loading process starts, before the first file has been requested.
    */
    this.onLoadStart = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onFileStart - This event is dispatched immediately before a file starts loading. It's possible the file may still error (404, etc) after this event is sent.
    */
    this.onFileStart = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onFileComplete - This event is dispatched when a file completes loading successfully.
    */
    this.onFileComplete = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onFileError - This event is dispatched when a file errors as a result of the load request.
    */
    this.onFileError = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onLoadComplete - This event is dispatched when the final file in the load queue has either loaded or failed.
    */
    this.onLoadComplete = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onPackComplete - This event is dispatched when an asset pack has either loaded or failed.
    */
    this.onPackComplete = new Phaser.Signal();

    /**
    * @property {boolean} useXDomainRequest - If true and if the browser supports XDomainRequest, it will be used in preference for xhr when loading json files. This is only relevant for IE9 when you know your server/CDN requires it.
    */
    this.useXDomainRequest = false;

    /**
    * @property {array} _packList - Contains all the assets packs.
    * @private
    */
    this._packList = [];

    /**
    * @property {number} _packIndex - The index of the current asset pack.
    * @private
    */
    this._packIndex = 0;

    /**
    * @property {array} _fileList - Contains all the assets file infos.
    * @private
    */
    this._fileList = [];

    /**
    * @property {number} _fileIndex - The index of the current file being loaded.
    * @private
    */
    this._fileIndex = 0;

    /**
    * @property {number} _progressChunk - Indicates the size of 1 file in terms of a percentage out of 100.
    * @private
    * @default
    */
    this._progressChunk = 0;

    /**
    * @property {XMLHttpRequest} - An XMLHttpRequest object used for loading text and audio data.
    * @private
    */
    this._xhr = new XMLHttpRequest();

    /**
    * @property {XDomainRequest} - An ajax request used specifically by IE9 for CORs loading issues.
    * @private
    */
    this._ajax = null;

};

/**
* @constant
* @type {number}
*/
Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY = 0;

/**
* @constant
* @type {number}
*/
Phaser.Loader.TEXTURE_ATLAS_JSON_HASH = 1;

/**
* @constant
* @type {number}
*/
Phaser.Loader.TEXTURE_ATLAS_XML_STARLING = 2;

/**
* @constant
* @type {number}
*/
Phaser.Loader.PHYSICS_LIME_CORONA_JSON = 3;

/**
* @constant
* @type {number}
*/
Phaser.Loader.PHYSICS_PHASER_JSON = 4;

Phaser.Loader.prototype = {

    /**
    * You can set a Sprite to be a "preload" sprite by passing it to this method.
    * A "preload" sprite will have its width or height crop adjusted based on the percentage of the loader in real-time.
    * This allows you to easily make loading bars for games. Note that Sprite.visible = true will be set when calling this.
    *
    * @method Phaser.Loader#setPreloadSprite
    * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite or image that will be cropped during the load.
    * @param {number} [direction=0] - A value of zero means the sprite will be cropped horizontally, a value of 1 means its will be cropped vertically.
    */
    setPreloadSprite: function (sprite, direction) {

        direction = direction || 0;

        this.preloadSprite = { sprite: sprite, direction: direction, width: sprite.width, height: sprite.height, rect: null };

        if (direction === 0)
        {
            //  Horizontal rect
            this.preloadSprite.rect = new Phaser.Rectangle(0, 0, 1, sprite.height);
        }
        else
        {
            //  Vertical rect
            this.preloadSprite.rect = new Phaser.Rectangle(0, 0, sprite.width, 1);
        }

        sprite.crop(this.preloadSprite.rect);

        sprite.visible = true;

    },

    /**
    * Called automatically by ScaleManager when the game resizes in RESIZE scalemode.
    * We use this to adjust the height of the preloading sprite, if set.
    *
    * @method Phaser.Loader#resize
    * @param {number} width - The new width of the game in pixels.
    * @param {number} height - The new height of the game in pixels.
    */
    resize: function () {

        if (this.preloadSprite && this.preloadSprite.height !== this.preloadSprite.sprite.height)
        {
            this.preloadSprite.rect.height = this.preloadSprite.sprite.height;
        }

    },

    /**
    * Check whether asset exists with a specific key.
    * Use Phaser.Cache to access loaded assets, e.g. Phaser.Cache#checkImageKey
    *
    * @method Phaser.Loader#checkKeyExists
    * @param {string} type - The type asset you want to check.
    * @param {string} key - Key of the asset you want to check.
    * @return {boolean} Return true if exists, otherwise return false.
    */
    checkKeyExists: function (type, key) {

        if (this._fileList.length > 0)
        {
            for (var i = 0; i < this._fileList.length; i++)
            {
                if (this._fileList[i].type === type && this._fileList[i].key === key)
                {
                    return true;
                }
            }
        }

        return false;

    },

    /**
    * Gets the fileList index for the given key.
    *
    * @method Phaser.Loader#getAssetIndex
    * @param {string} type - The type asset you want to check.
    * @param {string} key - Key of the asset you want to check.
    * @return {number} The index of this key in the filelist, or -1 if not found.
    */
    getAssetIndex: function (type, key) {

        if (this._fileList.length > 0)
        {
            for (var i = 0; i < this._fileList.length; i++)
            {
                if (this._fileList[i].type === type && this._fileList[i].key === key)
                {
                    return i;
                }
            }
        }

        return -1;

    },

    /**
    * Gets the asset that is queued for load.
    *
    * @method Phaser.Loader#getAsset
    * @param {string} type - The type asset you want to check.
    * @param {string} key - Key of the asset you want to check.
    * @return {any} Returns an object if found that has 2 properties: index and file. Otherwise false.
    */
    getAsset: function (type, key) {

        if (this._fileList.length > 0)
        {
            for (var i = 0; i < this._fileList.length; i++)
            {
                if (this._fileList[i].type === type && this._fileList[i].key === key)
                {
                    return { index: i, file: this._fileList[i] };
                }
            }
        }

        return false;

    },

    /**
    * Reset loader, this will remove the load queue.
    *
    * @method Phaser.Loader#reset
    */
    reset: function () {

        this.preloadSprite = null;
        this.isLoading = false;

        this._packList.length = 0;
        this._packIndex = 0;

        this._fileList.length = 0;
        this._fileIndex = 0;

    },

    /**
    * Internal function that adds a new entry to the file list. Do not call directly.
    *
    * @method Phaser.Loader#addToFileList
    * @protected
    * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
    * @param {string} key - The unique Cache ID key of this resource.
    * @param {string} url - The URL the asset will be loaded from.
    * @param {object} properties - Any additional properties needed to load the file.
    */
    addToFileList: function (type, key, url, properties) {

        var entry = {
            type: type,
            key: key,
            url: url,
            data: null,
            error: false,
            loaded: false
        };

        if (typeof properties !== "undefined")
        {
            for (var prop in properties)
            {
                entry[prop] = properties[prop];
            }
        }

        if (this.checkKeyExists(type, key) === false)
        {
            this._fileList.push(entry);
        }

    },

    /**
    * Internal function that replaces an existing entry in the file list with a new one. Do not call directly.
    *
    * @method Phaser.Loader#replaceInFileList
    * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
    * @param {string} key - The unique Cache ID key of this resource.
    * @param {string} url - The URL the asset will be loaded from.
    * @param {object} properties - Any additional properties needed to load the file.
    * @protected
    */
    replaceInFileList: function (type, key, url, properties) {

        var entry = {
            type: type,
            key: key,
            url: url,
            data: null,
            error: false,
            loaded: false
        };

        if (typeof properties !== "undefined")
        {
            for (var prop in properties)
            {
                entry[prop] = properties[prop];
            }
        }

        var index = this.getAssetIndex(type, key);

        if (index === -1)
        {
            this._fileList.push(entry);
        }
        else
        {
            this._fileList[index] = entry;
        }

    },

    /**
    * Add an image to the Loader.
    *
    * @method Phaser.Loader#pack
    * @param {string} key - Unique asset key of this image file.
    * @param {string} [url] - URL of the Asset Pack JSON file. If you wish to pass a json object instead set this to null and pass the object as the data parameter.
    * @param {object} [data] - The Asset Pack JSON data. Use this to pass in a json data object rather than loading it from a URL. TODO
    * @param {object} [callbackContext] - Some Loader operations, like Binary and Script require a context for their callbacks. Pass the context here.
    * @return {Phaser.Loader} This Loader instance.
    */
    pack: function (key, url, data, callbackContext) {

        if (typeof url === "undefined") { url = null; }
        if (typeof data === "undefined") { data = null; }
        if (typeof callbackContext === "undefined") { callbackContext = this; }

        if (url === null && data === null)
        {
            console.warn('Phaser.Loader.pack - Both url and data are null. One must be set.');
            return this;
        }

        //  A data object has been given
        if (data)
        {
            if (typeof data === 'string')
            {
                data = JSON.parse(data);
            }
        }

        this._packList.push( { key: key, url: url, data: data, loaded: false, error: false, callbackContext: callbackContext } );

        return this;

    },

    /**
    * Add an image to the Loader.
    *
    * @method Phaser.Loader#image
    * @param {string} key - Unique asset key of this image file.
    * @param {string} url - URL of image file.
    * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
    * @return {Phaser.Loader} This Loader instance.
    */
    image: function (key, url, overwrite) {

        if (typeof overwrite === "undefined") { overwrite = false; }

        if (overwrite)
        {
            this.replaceInFileList('image', key, url);
        }
        else
        {
            this.addToFileList('image', key, url);
        }

        return this;

    },

    /**
    * Add a text file to the Loader.
    *
    * @method Phaser.Loader#text
    * @param {string} key - Unique asset key of the text file.
    * @param {string} url - URL of the text file.
    * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
    * @return {Phaser.Loader} This Loader instance.
    */
    text: function (key, url, overwrite) {

        if (typeof overwrite === "undefined") { overwrite = false; }

        if (overwrite)
        {
            this.replaceInFileList('text', key, url);
        }
        else
        {
            this.addToFileList('text', key, url);
        }

        return this;

    },

    /**
    * Add a json file to the Loader.
    *
    * @method Phaser.Loader#json
    * @param {string} key - Unique asset key of the json file.
    * @param {string} url - URL of the json file.
    * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
    * @return {Phaser.Loader} This Loader instance.
    */
    json: function (key, url, overwrite) {

        if (typeof overwrite === "undefined") { overwrite = false; }

        if (overwrite)
        {
            this.replaceInFileList('json', key, url);
        }
        else
        {
            this.addToFileList('json', key, url);
        }

        return this;

    },

    /**
    * Add an XML file to the Loader.
    *
    * @method Phaser.Loader#xml
    * @param {string} key - Unique asset key of the xml file.
    * @param {string} url - URL of the xml file.
    * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
    * @return {Phaser.Loader} This Loader instance.
    */
    xml: function (key, url, overwrite) {

        if (typeof overwrite === "undefined") { overwrite = false; }

        if (overwrite)
        {
            this.replaceInFileList('xml', key, url);
        }
        else
        {
            this.addToFileList('xml', key, url);
        }

        return this;

    },

    /**
    * Add a JavaScript file to the Loader. Once loaded the JavaScript file will be automatically turned into a script tag (and executed), so be careful what you load!
    * You can also specify a callback. This will be executed as soon as the script tag has been created.
    *
    * @method Phaser.Loader#script
    * @param {string} key - Unique asset key of the script file.
    * @param {string} url - URL of the JavaScript file.
    * @param {function} [callback] - Optional callback that will be called after the script tag has loaded, so you can perform additional processing.
    * @param {function} [callbackContext] - The context under which the callback will be applied. If not specified it will use the callback itself as the context.
    * @return {Phaser.Loader} This Loader instance.
    */
    script: function (key, url, callback, callbackContext) {

        if (typeof callback === 'undefined') { callback = false; }
        if (callback !== false && typeof callbackContext === 'undefined') { callbackContext = callback; }

        this.addToFileList('script', key, url, { callback: callback, callbackContext: callbackContext });

        return this;

    },

    /**
    * Add a binary file to the Loader. It will be loaded via xhr with a responseType of "arraybuffer". You can specify an optional callback to process the file after load.
    * When the callback is called it will be passed 2 parameters: the key of the file and the file data.
    * WARNING: If you specify a callback, the file data will be set to whatever your callback returns. So always return the data object, even if you didn't modify it.
    *
    * @method Phaser.Loader#binary
    * @param {string} key - Unique asset key of the binary file.
    * @param {string} url - URL of the binary file.
    * @param {function} [callback] - Optional callback that will be passed the file after loading, so you can perform additional processing on it.
    * @param {function} [callbackContext] - The context under which the callback will be applied. If not specified it will use the callback itself as the context.
    * @return {Phaser.Loader} This Loader instance.
    */
    binary: function (key, url, callback, callbackContext) {

        if (typeof callback === 'undefined') { callback = false; }
        if (callback !== false && typeof callbackContext === 'undefined') { callbackContext = callback; }

        this.addToFileList('binary', key, url, { callback: callback, callbackContext: callbackContext });

        return this;

    },

    /**
    * Add a new sprite sheet to the loader.
    *
    * @method Phaser.Loader#spritesheet
    * @param {string} key - Unique asset key of the sheet file.
    * @param {string} url - URL of the sheet file.
    * @param {number} frameWidth - Width of each single frame.
    * @param {number} frameHeight - Height of each single frame.
    * @param {number} [frameMax=-1] - How many frames in this sprite sheet. If not specified it will divide the whole image into frames.
    * @param {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
    * @param {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
    * @return {Phaser.Loader} This Loader instance.
    */
    spritesheet: function (key, url, frameWidth, frameHeight, frameMax, margin, spacing) {

        if (typeof frameMax === "undefined") { frameMax = -1; }
        if (typeof margin === "undefined") { margin = 0; }
        if (typeof spacing === "undefined") { spacing = 0; }

        this.addToFileList('spritesheet', key, url, { frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax, margin: margin, spacing: spacing });

        return this;

    },

    /**
    * Add a new audio file to the loader.
    *
    * @method Phaser.Loader#audio
    * @param {string} key - Unique asset key of the audio file.
    * @param {Array|string} urls - An array containing the URLs of the audio files, i.e.: [ 'jump.mp3', 'jump.ogg', 'jump.m4a' ] or a single string containing just one URL. BLOB urls are supported, but note that Phaser will not validate the audio file's type if a BLOB is provided; the user should ensure that a BLOB url is playable.
    * @param {boolean} autoDecode - When using Web Audio the audio files can either be decoded at load time or run-time. They can't be played until they are decoded, but this let's you control when that happens. Decoding is a non-blocking async process.
    * @return {Phaser.Loader} This Loader instance.
    */
    audio: function (key, urls, autoDecode) {

        if (typeof autoDecode === "undefined") { autoDecode = true; }

        this.addToFileList('audio', key, urls, { buffer: null, autoDecode: autoDecode });

        return this;

    },

    /**
     * Add a new audiosprite file to the loader. Audio Sprites are a combination of audio files and a JSON configuration.
     * The JSON follows the format of that created by https://github.com/tonistiigi/audiosprite
     *
     * @method Phaser.Loader#audiosprite
     * @param {string} key - Unique asset key of the audio file.
     * @param {Array|string} urls - An array containing the URLs of the audio files, i.e.: [ 'audiosprite.mp3', 'audiosprite.ogg', 'audiosprite.m4a' ] or a single string containing just one URL.
     * @param {string} atlasURL - The URL of the audiosprite configuration json.
     * @return {Phaser.Loader} This Loader instance.
     */
    audiosprite: function(key, urls, atlasURL) {

        this.audio(key, urls);

        this.json(key + '-audioatlas', atlasURL);

        return this;

    },

    /**
    * Add a new tilemap loading request.
    *
    * @method Phaser.Loader#tilemap
    * @param {string} key - Unique asset key of the tilemap data.
    * @param {string} [url] - The url of the map data file (csv/json)
    * @param {object} [data] - An optional JSON data object. If given then the url is ignored and this JSON object is used for map data instead.
    * @param {number} [format=Phaser.Tilemap.CSV] - The format of the map data. Either Phaser.Tilemap.CSV or Phaser.Tilemap.TILED_JSON.
    * @return {Phaser.Loader} This Loader instance.
    */
    tilemap: function (key, url, data, format) {

        if (typeof url === "undefined") { url = null; }
        if (typeof data === "undefined") { data = null; }
        if (typeof format === "undefined") { format = Phaser.Tilemap.CSV; }

        if (url == null && data == null)
        {
            console.warn('Phaser.Loader.tilemap - Both url and data are null. One must be set.');

            return this;
        }

        //  A map data object has been given
        if (data)
        {
            switch (format)
            {
                //  A csv string or object has been given
                case Phaser.Tilemap.CSV:
                    break;

                //  An xml string or object has been given
                case Phaser.Tilemap.TILED_JSON:

                    if (typeof data === 'string')
                    {
                        data = JSON.parse(data);
                    }
                    break;
            }

            this.game.cache.addTilemap(key, null, data, format);
        }
        else
        {
            this.addToFileList('tilemap', key, url, { format: format });
        }

        return this;

    },

    /**
    * Add a new physics data object loading request.
    * The data must be in Lime + Corona JSON format. Physics Editor by code'n'web exports in this format natively.
    *
    * @method Phaser.Loader#physics
    * @param {string} key - Unique asset key of the physics json data.
    * @param {string} [url] - The url of the map data file (csv/json)
    * @param {object} [data] - An optional JSON data object. If given then the url is ignored and this JSON object is used for physics data instead.
    * @param {string} [format=Phaser.Physics.LIME_CORONA_JSON] - The format of the physics data.
    * @return {Phaser.Loader} This Loader instance.
    */
    physics: function (key, url, data, format) {

        if (typeof url === "undefined") { url = null; }
        if (typeof data === "undefined") { data = null; }
        if (typeof format === "undefined") { format = Phaser.Physics.LIME_CORONA_JSON; }

        if (url == null && data == null)
        {
            console.warn('Phaser.Loader.physics - Both url and data are null. One must be set.');

            return this;
        }

        //  A map data object has been given
        if (data)
        {
            if (typeof data === 'string')
            {
                data = JSON.parse(data);
            }

            this.game.cache.addPhysicsData(key, null, data, format);
        }
        else
        {
            this.addToFileList('physics', key, url, { format: format });
        }

        return this;

    },

    /**
    * Add a new bitmap font loading request.
    *
    * @method Phaser.Loader#bitmapFont
    * @param {string} key - Unique asset key of the bitmap font.
    * @param {string} textureURL - The url of the font image file.
    * @param {string} [xmlURL] - The url of the font data file (xml/fnt)
    * @param {object} [xmlData] - An optional XML data object.
    * @param {number} [xSpacing=0] - If you'd like to add additional horizontal spacing between the characters then set the pixel value here.
    * @param {number} [ySpacing=0] - If you'd like to add additional vertical spacing between the lines then set the pixel value here.
    * @return {Phaser.Loader} This Loader instance.
    */
    bitmapFont: function (key, textureURL, xmlURL, xmlData, xSpacing, ySpacing) {

        if (typeof xmlURL === "undefined") { xmlURL = null; }
        if (typeof xmlData === "undefined") { xmlData = null; }
        if (typeof xSpacing === "undefined") { xSpacing = 0; }
        if (typeof ySpacing === "undefined") { ySpacing = 0; }

        //  A URL to a json/xml file has been given
        if (xmlURL)
        {
            this.addToFileList('bitmapfont', key, textureURL, { xmlURL: xmlURL, xSpacing: xSpacing, ySpacing: ySpacing });
        }
        else
        {
            //  An xml string or object has been given
            if (typeof xmlData === 'string')
            {
                var xml;

                try  {
                    if (window['DOMParser'])
                    {
                        var domparser = new DOMParser();
                        xml = domparser.parseFromString(xmlData, "text/xml");
                    }
                    else
                    {
                        xml = new ActiveXObject("Microsoft.XMLDOM");
                        xml.async = 'false';
                        xml.loadXML(xmlData);
                    }
                }
                catch (e)
                {
                    xml = undefined;
                }

                if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
                {
                    throw new Error("Phaser.Loader. Invalid Bitmap Font XML given");
                }
                else
                {
                    this.addToFileList('bitmapfont', key, textureURL, { xmlURL: null, xmlData: xml, xSpacing: xSpacing, ySpacing: ySpacing });
                }
            }
        }

        return this;

    },

    /**
    * Add a new texture atlas to the loader. This atlas uses the JSON Array data format.
    *
    * @method Phaser.Loader#atlasJSONArray
    * @param {string} key - Unique asset key of the texture atlas file.
    * @param {string} textureURL - The url of the texture atlas image file.
    * @param {string} [atlasURL] - The url of the texture atlas data file (json/xml). You don't need this if you are passing an atlasData object instead.
    * @param {object} [atlasData] - A JSON or XML data object. You don't need this if the data is being loaded from a URL.
    * @return {Phaser.Loader} This Loader instance.
    */
    atlasJSONArray: function (key, textureURL, atlasURL, atlasData) {

        return this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

    },

    /**
    * Add a new texture atlas to the loader. This atlas uses the JSON Hash data format.
    *
    * @method Phaser.Loader#atlasJSONHash
    * @param {string} key - Unique asset key of the texture atlas file.
    * @param {string} textureURL - The url of the texture atlas image file.
    * @param {string} [atlasURL] - The url of the texture atlas data file (json/xml). You don't need this if you are passing an atlasData object instead.
    * @param {object} [atlasData] - A JSON or XML data object. You don't need this if the data is being loaded from a URL.
    * @return {Phaser.Loader} This Loader instance.
    */
    atlasJSONHash: function (key, textureURL, atlasURL, atlasData) {

        return this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    },

    /**
    * Add a new texture atlas to the loader. This atlas uses the Starling XML data format.
    *
    * @method Phaser.Loader#atlasXML
    * @param {string} key - Unique asset key of the texture atlas file.
    * @param {string} textureURL - The url of the texture atlas image file.
    * @param {string} [atlasURL] - The url of the texture atlas data file (json/xml). You don't need this if you are passing an atlasData object instead.
    * @param {object} [atlasData] - A JSON or XML data object. You don't need this if the data is being loaded from a URL.
    * @return {Phaser.Loader} This Loader instance.
    */
    atlasXML: function (key, textureURL, atlasURL, atlasData) {

        return this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);

    },

    /**
    * Add a new texture atlas to the loader.
    *
    * @method Phaser.Loader#atlas
    * @param {string} key - Unique asset key of the texture atlas file.
    * @param {string} textureURL - The url of the texture atlas image file.
    * @param {string} [atlasURL] - The url of the texture atlas data file (json/xml). You don't need this if you are passing an atlasData object instead.
    * @param {object} [atlasData] - A JSON or XML data object. You don't need this if the data is being loaded from a URL.
    * @param {number} [format] - A value describing the format of the data, the default is Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY.
    * @return {Phaser.Loader} This Loader instance.
    */
    atlas: function (key, textureURL, atlasURL, atlasData, format) {

        if (typeof atlasURL === "undefined") { atlasURL = null; }
        if (typeof atlasData === "undefined") { atlasData = null; }
        if (typeof format === "undefined") { format = Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY; }

        //  A URL to a json/xml file has been given
        if (atlasURL)
        {
            this.addToFileList('textureatlas', key, textureURL, { atlasURL: atlasURL, format: format });
        }
        else
        {
            switch (format)
            {
                //  A json string or object has been given
                case Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY:

                    if (typeof atlasData === 'string')
                    {
                        atlasData = JSON.parse(atlasData);
                    }
                    break;

                //  An xml string or object has been given
                case Phaser.Loader.TEXTURE_ATLAS_XML_STARLING:

                    if (typeof atlasData === 'string')
                    {
                        var xml;

                        try  {
                            if (window['DOMParser'])
                            {
                                var domparser = new DOMParser();
                                xml = domparser.parseFromString(atlasData, "text/xml");
                            }
                            else
                            {
                                xml = new ActiveXObject("Microsoft.XMLDOM");
                                xml.async = 'false';
                                xml.loadXML(atlasData);
                            }
                        }
                        catch (e)
                        {
                            xml = undefined;
                        }

                        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
                        {
                            throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
                        }
                        else
                        {
                            atlasData = xml;
                        }
                    }
                    break;
            }

            this.addToFileList('textureatlas', key, textureURL, { atlasURL: null, atlasData: atlasData, format: format });

        }

        return this;

    },

    /**
    * Remove loading request of a file.
    *
    * @method Phaser.Loader#removeFile
    * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
    * @param {string} key - Key of the file you want to remove.
    */
    removeFile: function (type, key) {

        var file = this.getAsset(type, key);

        if (file !== false)
        {
            this._fileList.splice(file.index, 1);
        }

    },

    /**
    * Remove all file loading requests.
    *
    * @method Phaser.Loader#removeAll
    */
    removeAll: function () {

        this._fileList.length = 0;

    },

    /**
    * Start loading the assets. Normally you don't need to call this yourself as the StateManager will do so.
    *
    * @method Phaser.Loader#start
    */
    start: function () {

        if (this.isLoading)
        {
            return;
        }

        if (this._packList.length > 0)
        {
            this._packIndex = 0;
            this.loadPack();
        }
        else
        {
            this.beginLoad();
        }

    },

    /**
    * Starts off the actual loading process after the asset packs have been sorted out.
    *
    * @method Phaser.Loader#beginLoad
    * @private
    */
    beginLoad: function () {

        this.progress = 0;
        this.progressFloat = 0;
        this.hasLoaded = false;
        this.isLoading = true;

        this.onLoadStart.dispatch(this._fileList.length);

        if (this._fileList.length > 0)
        {
            this._fileIndex = 0;
            this._progressChunk = 100 / this._fileList.length;
            this.loadFile();
        }
        else
        {
            this.progress = 100;
            this.progressFloat = 100;
            this.hasLoaded = true;
            this.isLoading = false;
            this.onLoadComplete.dispatch();
        }

    },

    /**
    * Loads the current asset pack in the queue.
    *
    * @method Phaser.Loader#loadPack
    * @private
    */
    loadPack: function () {

        if (!this._packList[this._packIndex])
        {
            console.warn('Phaser.Loader loadPackList invalid index ' + this._packIndex);
            return;
        }

        var pack = this._packList[this._packIndex];

        if (pack.data !== null)
        {
            this.packLoadComplete(this._packIndex, false);
        }
        else
        {
            //  Load it
            this.xhrLoad(this._packIndex, this.baseURL + pack.url, 'text', 'packLoadComplete', 'packLoadError');
        }

    },

    /**
    * Handle the successful loading of a JSON asset pack.
    *
    * @method Phaser.Loader#packLoadComplete
    * @private
    * @param {number} index - The index of the file in the file queue that loaded.
    * @param {boolean} [parse=true] - Automatically parse the JSON data?
    */
    packLoadComplete: function (index, parse) {

        if (typeof parse === 'undefined') { parse = true; }

        if (!this._packList[index])
        {
            console.warn('Phaser.Loader packLoadComplete invalid index ' + index);
            return;
        }

        var pack = this._packList[index];

        pack.loaded = true;

        if (parse)
        {
            var data = JSON.parse(this._xhr.responseText);
        }
        else
        {
            var data = this._packList[index].data;
        }

        if (data[pack.key])
        {
            var file;

            for (var i = 0; i < data[pack.key].length; i++)
            {
                file = data[pack.key][i];

                switch (file.type)
                {
                    case "image":
                        this.image(file.key, file.url, file.overwrite);
                        break;

                    case "text":
                        this.text(file.key, file.url, file.overwrite);
                        break;

                    case "json":
                        this.json(file.key, file.url, file.overwrite);
                        break;

                    case "xml":
                        this.xml(file.key, file.url, file.overwrite);
                        break;

                    case "script":
                        this.script(file.key, file.url, file.callback, pack.callbackContext);
                        break;

                    case "binary":
                        this.binary(file.key, file.url, file.callback, pack.callbackContext);
                        break;

                    case "spritesheet":
                        this.spritesheet(file.key, file.url, file.frameWidth, file.frameHeight, file.frameMax, file.margin, file.spacing);
                        break;

                    case "audio":
                        this.audio(file.key, file.urls, file.autoDecode);
                        break;

                    case "tilemap":
                        this.tilemap(file.key, file.url, file.data, Phaser.Tilemap[file.format]);
                        break;

                    case "physics":
                        this.physics(file.key, file.url, file.data, Phaser.Loader[file.format]);
                        break;

                    case "bitmapFont":
                        this.bitmapFont(file.key, file.textureURL, file.xmlURL, file.xmlData, file.xSpacing, file.ySpacing);
                        break;

                    case "atlasJSONArray":
                        this.atlasJSONArray(file.key, file.textureURL, file.atlasURL, file.atlasData);
                        break;

                    case "atlasJSONHash":
                        this.atlasJSONHash(file.key, file.textureURL, file.atlasURL, file.atlasData);
                        break;

                    case "atlasXML":
                        this.atlasXML(file.key, file.textureURL, file.atlasURL, file.atlasData);
                        break;

                    case "atlas":
                        this.atlas(file.key, file.textureURL, file.atlasURL, file.atlasData, Phaser.Loader[file.format]);
                        break;
                }
            }
        }

        this.nextPack(index, true);

    },

    /**
    * Error occured when loading an asset pack.
    *
    * @method Phaser.Loader#packError
    * @private
    * @param {number} index - The index of the file in the file queue that errored.
    */
    packError: function (index) {

        this._packList[index].loaded = true;
        this._packList[index].error = true;

        this.onFileError.dispatch(this._packList[index].key, this._packList[index]);

        console.warn("Phaser.Loader error loading pack file: " + this._packList[index].key + ' from URL ' + this._packList[index].url);

        this.nextPack(index, false);

    },

    /**
    * Handle loading the next asset pack.
    *
    * @method Phaser.Loader#nextPack
    * @private
    */
    nextPack: function (index, success) {

        this.onPackComplete.dispatch(this._packList[index].key, success, this.totalLoadedPacks(), this._packList.length);

        this._packIndex++;

        if (this._packIndex < this._packList.length)
        {
            this.loadPack();
        }
        else
        {
            this.beginLoad();
        }

    },

    /**
    * Load files. Private method ONLY used by loader.
    *
    * @method Phaser.Loader#loadFile
    * @private
    */
    loadFile: function () {

        if (!this._fileList[this._fileIndex])
        {
            console.warn('Phaser.Loader loadFile invalid index ' + this._fileIndex);
            return;
        }

        var file = this._fileList[this._fileIndex];
        var _this = this;

        this.onFileStart.dispatch(this.progress, file.key, file.url);

        //  Image or Data?
        switch (file.type)
        {
            case 'image':
            case 'spritesheet':
            case 'textureatlas':
            case 'bitmapfont':
                file.data = new Image();
                file.data.name = file.key;
                file.data.onload = function () {
                    return _this.fileComplete(_this._fileIndex);
                };
                file.data.onerror = function () {
                    return _this.fileError(_this._fileIndex);
                };
                if (this.crossOrigin)
                {
                    file.data.crossOrigin = this.crossOrigin;
                }
                file.data.src = this.baseURL + file.url;
                break;

            case 'audio':
                file.url = this.getAudioURL(file.url);

                if (file.url !== null)
                {
                    //  WebAudio or Audio Tag?
                    if (this.game.sound.usingWebAudio)
                    {
                        this.xhrLoad(this._fileIndex, this.baseURL + file.url, 'arraybuffer', 'fileComplete', 'fileError');
                    }
                    else if (this.game.sound.usingAudioTag)
                    {
                        if (this.game.sound.touchLocked)
                        {
                            //  If audio is locked we can't do this yet, so need to queue this load request. Bum.
                            file.data = new Audio();
                            file.data.name = file.key;
                            file.data.preload = 'auto';
                            file.data.src = this.baseURL + file.url;
                            this.fileComplete(this._fileIndex);
                        }
                        else
                        {
                            file.data = new Audio();
                            file.data.name = file.key;
                            file.data.onerror = function () {
                                return _this.fileError(_this._fileIndex);
                            };
                            file.data.preload = 'auto';
                            file.data.src = this.baseURL + file.url;
                            file.data.addEventListener('canplaythrough', function () { Phaser.GAMES[_this.game.id].load.fileComplete(_this._fileIndex); }, false);
                            file.data.load();
                        }
                    }
                }
                else
                {
                    this.fileError(this._fileIndex);
                }

                break;

            case 'json':

                if (this.useXDomainRequest && window.XDomainRequest)
                {
                    this._ajax = new window.XDomainRequest();

                    // XDomainRequest has a few quirks. Occasionally it will abort requests
                    // A way to avoid this is to make sure ALL callbacks are set even if not used
                    // More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
                    this._ajax.timeout = 3000;

                    this._ajax.onerror = function () {
                        return _this.dataLoadError(_this._fileIndex);
                    };

                    this._ajax.ontimeout = function () {
                        return _this.dataLoadError(_this._fileIndex);
                    };

                    this._ajax.onprogress = function() {};

                    this._ajax.onload = function(){
                        return _this.jsonLoadComplete(_this._fileIndex);
                    };

                    this._ajax.open('GET', this.baseURL + file.url, true);

                    //  Note: The xdr.send() call is wrapped in a timeout to prevent an issue with the interface where some requests are lost
                    //  if multiple XDomainRequests are being sent at the same time.
                    setTimeout(function () {
                        _this._ajax.send();
                    }, 0);
                }
                else
                {
                    this.xhrLoad(this._fileIndex, this.baseURL + file.url, 'text', 'jsonLoadComplete', 'dataLoadError');
                }

                break;

            case 'xml':

                this.xhrLoad(this._fileIndex, this.baseURL + file.url, 'text', 'xmlLoadComplete', 'dataLoadError');
                break;

            case 'tilemap':

                if (file.format === Phaser.Tilemap.TILED_JSON)
                {
                    this.xhrLoad(this._fileIndex, this.baseURL + file.url, 'text', 'jsonLoadComplete', 'dataLoadError');
                }
                else if (file.format === Phaser.Tilemap.CSV)
                {
                    this.xhrLoad(this._fileIndex, this.baseURL + file.url, 'text', 'csvLoadComplete', 'dataLoadError');
                }
                else
                {
                    throw new Error("Phaser.Loader. Invalid Tilemap format: " + file.format);
                }
                break;

            case 'text':
            case 'script':
            case 'physics':
                this.xhrLoad(this._fileIndex, this.baseURL + file.url, 'text', 'fileComplete', 'fileError');
                break;

            case 'binary':
                this.xhrLoad(this._fileIndex, this.baseURL + file.url, 'arraybuffer', 'fileComplete', 'fileError');
                break;
        }

    },

    /**
    * Starts the xhr loader.
    *
    * @method Phaser.Loader#xhrLoad
    * @private
    * @param {number} index - The index of the file to load from the file list.
    * @param {string} url - The URL of the file.
    * @param {string} type - The xhr responseType.
    * @param {string} onload - A String of the name of the local function to be called on a successful file load.
    * @param {string} onerror - A String of the name of the local function to be called on a file load error.
    */
    xhrLoad: function (index, url, type, onload, onerror) {

        this._xhr.open("GET", url, true);
        this._xhr.responseType = type;

        var _this = this;

        this._xhr.onload = function () {
            return _this[onload](index);
        };

        this._xhr.onerror = function () {
            return _this[onerror](index);
        };

        this._xhr.send();

    },

    /**
    * Private method ONLY used by loader.
    *
    * @method Phaser.Loader#getAudioURL
    * @private
    * @param {array|string} urls - Either an array of audio file URLs or a string containing a single URL path.
    */
    getAudioURL: function (urls) {

        var extension;

        if (typeof urls === 'string') { urls = [urls]; }

        for (var i = 0; i < urls.length; i++)
        {
            extension = urls[i].toLowerCase();

            if (extension.substr(0,5) === "blob:")
            {
                return urls[i];
            }

            extension = extension.substr((Math.max(0, extension.lastIndexOf(".")) || Infinity) + 1);

            if (extension.indexOf("?") >= 0)
            {
                extension = extension.substr(0, extension.indexOf("?"));
            }

            if (this.game.device.canPlayAudio(extension))
            {
                return urls[i];
            }
        }

        return null;

    },

    /**
    * Error occured when loading a file.
    *
    * @method Phaser.Loader#fileError
    * @param {number} index - The index of the file in the file queue that errored.
    */
    fileError: function (index) {

        this._fileList[index].loaded = true;
        this._fileList[index].error = true;

        this.onFileError.dispatch(this._fileList[index].key, this._fileList[index]);

        console.warn("Phaser.Loader error loading file: " + this._fileList[index].key + ' from URL ' + this._fileList[index].url);

        this.nextFile(index, false);

    },

    /**
    * Called when a file is successfully loaded.
    *
    * @method Phaser.Loader#fileComplete
    * @param {number} index - The index of the file in the file queue that loaded.
    */
    fileComplete: function (index) {

        if (!this._fileList[index])
        {
            console.warn('Phaser.Loader fileComplete invalid index ' + index);
            return;
        }

        var file = this._fileList[index];
        file.loaded = true;

        var loadNext = true;

        switch (file.type)
        {
            case 'image':

                this.game.cache.addImage(file.key, file.url, file.data);
                break;

            case 'spritesheet':

                this.game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax, file.margin, file.spacing);
                break;

            case 'textureatlas':

                if (file.atlasURL == null)
                {
                    this.game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
                }
                else
                {
                    //  Load the JSON or XML before carrying on with the next file
                    loadNext = false;

                    if (file.format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY || file.format == Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
                    {
                        this.xhrLoad(this._fileIndex, this.baseURL + file.atlasURL, 'text', 'jsonLoadComplete', 'dataLoadError');
                    }
                    else if (file.format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
                    {
                        this.xhrLoad(this._fileIndex, this.baseURL + file.atlasURL, 'text', 'xmlLoadComplete', 'dataLoadError');
                    }
                    else
                    {
                        throw new Error("Phaser.Loader. Invalid Texture Atlas format: " + file.format);
                    }
                }
                break;

            case 'bitmapfont':

                if (file.xmlURL == null)
                {
                    this.game.cache.addBitmapFont(file.key, file.url, file.data, file.xmlData, file.xSpacing, file.ySpacing);
                }
                else
                {
                    //  Load the XML before carrying on with the next file
                    loadNext = false;
                    this.xhrLoad(this._fileIndex, this.baseURL + file.xmlURL, 'text', 'xmlLoadComplete', 'dataLoadError');
                }
                break;

            case 'audio':

                if (this.game.sound.usingWebAudio)
                {
                    file.data = this._xhr.response;

                    this.game.cache.addSound(file.key, file.url, file.data, true, false);

                    if (file.autoDecode)
                    {
                        var that = this;
                        var key = file.key;

                        this.game.cache.updateSound(key, 'isDecoding', true);

                        this.game.sound.context.decodeAudioData(file.data, function (buffer) {
                            if (buffer)
                            {
                                that.game.cache.decodedSound(key, buffer);
                                that.game.sound.onSoundDecode.dispatch(key, that.game.cache.getSound(key));
                            }
                        });
                    }
                }
                else
                {
                    file.data.removeEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete);
                    this.game.cache.addSound(file.key, file.url, file.data, false, true);
                }
                break;

            case 'text':
                file.data = this._xhr.responseText;
                this.game.cache.addText(file.key, file.url, file.data);
                break;

            case 'physics':
                var data = JSON.parse(this._xhr.responseText);
                this.game.cache.addPhysicsData(file.key, file.url, data, file.format);
                break;

            case 'script':
                file.data = document.createElement('script');
                file.data.language = 'javascript';
                file.data.type = 'text/javascript';
                file.data.defer = false;
                file.data.text = this._xhr.responseText;
                document.head.appendChild(file.data);
                if (file.callback)
                {
                    file.data = file.callback.call(file.callbackContext, file.key, this._xhr.responseText);
                }
                break;

            case 'binary':
                if (file.callback)
                {
                    file.data = file.callback.call(file.callbackContext, file.key, this._xhr.response);
                }
                else
                {
                    file.data = this._xhr.response;
                }

                this.game.cache.addBinary(file.key, file.data);

                break;
        }

        if (loadNext)
        {
            this.nextFile(index, true);
        }

    },

    /**
    * Successfully loaded a JSON file.
    *
    * @method Phaser.Loader#jsonLoadComplete
    * @param {number} index - The index of the file in the file queue that loaded.
    */
    jsonLoadComplete: function (index) {

        if (!this._fileList[index])
        {
            console.warn('Phaser.Loader jsonLoadComplete invalid index ' + index);
            return;
        }

        var file = this._fileList[index];

        if (this._ajax && this._ajax.responseText)
        {
            var data = JSON.parse(this._ajax.responseText);
        }
        else
        {
            var data = JSON.parse(this._xhr.responseText);
        }

        file.loaded = true;

        if (file.type === 'tilemap')
        {
            this.game.cache.addTilemap(file.key, file.url, data, file.format);
        }
        else if (file.type === 'json')
        {
            this.game.cache.addJSON(file.key, file.url, data);
        }
        else
        {
            this.game.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
        }

        this.nextFile(index, true);

    },

    /**
    * Successfully loaded a CSV file.
    *
    * @method Phaser.Loader#csvLoadComplete
    * @param {number} index - The index of the file in the file queue that loaded.
    */
    csvLoadComplete: function (index) {

        if (!this._fileList[index])
        {
            console.warn('Phaser.Loader csvLoadComplete invalid index ' + index);
            return;
        }

        var file = this._fileList[index];
        var data = this._xhr.responseText;

        file.loaded = true;

        this.game.cache.addTilemap(file.key, file.url, data, file.format);

        this.nextFile(index, true);

    },

    /**
    * Error occured when load a JSON.
    *
    * @method Phaser.Loader#dataLoadError
    * @param {number} index - The index of the file in the file queue that errored.
    */
    dataLoadError: function (index) {

        var file = this._fileList[index];

        file.loaded = true;
        file.error = true;

        console.warn("Phaser.Loader dataLoadError: " + file.key);

        this.nextFile(index, true);

    },

    /**
    * Successfully loaded an XML file.
    *
    * @method Phaser.Loader#xmlLoadComplete
    * @param {number} index - The index of the file in the file queue that loaded.
    */
    xmlLoadComplete: function (index) {

        if (this._xhr.responseType !== '' && this._xhr.responseType !== 'text')
        {
            console.warn('Invalid XML Response Type', this._fileList[index]);
            console.warn(this._xhr);
        }

        var data = this._xhr.responseText;
        var xml;

        try
        {
            if (window['DOMParser'])
            {
                var domparser = new DOMParser();
                xml = domparser.parseFromString(data, "text/xml");
            }
            else
            {
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = 'false';
                xml.loadXML(data);
            }
        }
        catch (e)
        {
            xml = undefined;
        }

        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
        {
            throw new Error("Phaser.Loader. Invalid XML given");
        }

        var file = this._fileList[index];
        file.loaded = true;

        if (file.type === 'bitmapfont')
        {
            this.game.cache.addBitmapFont(file.key, file.url, file.data, xml, file.xSpacing, file.ySpacing);
        }
        else if (file.type === 'textureatlas')
        {
            this.game.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);
        }
        else if (file.type === 'xml')
        {
            this.game.cache.addXML(file.key, file.url, xml);
        }

        this.nextFile(index, true);

    },

    /**
    * Handle loading next file.
    *
    * @method Phaser.Loader#nextFile
    * @private
    * @param {number} previousIndex - Index of the previously loaded asset.
    * @param {boolean} success - Whether the previous asset loaded successfully or not.
    */
    nextFile: function (previousIndex, success) {

        this.progressFloat += this._progressChunk;
        this.progress = Math.round(this.progressFloat);

        if (this.progress > 100)
        {
            this.progress = 100;
        }

        if (this.preloadSprite !== null)
        {
            if (this.preloadSprite.direction === 0)
            {
                this.preloadSprite.rect.width = Math.floor((this.preloadSprite.width / 100) * this.progress);
            }
            else
            {
                this.preloadSprite.rect.height = Math.floor((this.preloadSprite.height / 100) * this.progress);
            }

            this.preloadSprite.sprite.updateCrop();
        }

        this.onFileComplete.dispatch(this.progress, this._fileList[previousIndex].key, success, this.totalLoadedFiles(), this._fileList.length);

        if (this.totalQueuedFiles() > 0)
        {
            this._fileIndex++;
            this.loadFile();
        }
        else
        {
            this.hasLoaded = true;
            this.isLoading = false;

            this.removeAll();

            this.onLoadComplete.dispatch();
        }

    },

    /**
    * Returns the number of files that have already been loaded, even if they errored.
    *
    * @method Phaser.Loader#totalLoadedFiles
    * @return {number} The number of files that have already been loaded (even if they errored)
    */
    totalLoadedFiles: function () {

        var total = 0;

        for (var i = 0; i < this._fileList.length; i++)
        {
            if (this._fileList[i].loaded)
            {
                total++;
            }
        }

        return total;

    },

    /**
    * Returns the number of files still waiting to be processed in the load queue. This value decreases as each file in the queue is loaded.
    *
    * @method Phaser.Loader#totalQueuedFiles
    * @return {number} The number of files that still remain in the load queue.
    */
    totalQueuedFiles: function () {

        var total = 0;

        for (var i = 0; i < this._fileList.length; i++)
        {
            if (this._fileList[i].loaded === false)
            {
                total++;
            }
        }

        return total;

    },

    /**
    * Returns the number of asset packs that have already been loaded, even if they errored.
    *
    * @method Phaser.Loader#totalLoadedPacks
    * @return {number} The number of asset packs that have already been loaded (even if they errored)
    */
    totalLoadedPacks: function () {

        var total = 0;

        for (var i = 0; i < this._packList.length; i++)
        {
            if (this._packList[i].loaded)
            {
                total++;
            }
        }

        return total;

    },

    /**
    * Returns the number of asset packs still waiting to be processed in the load queue. This value decreases as each pack in the queue is loaded.
    *
    * @method Phaser.Loader#totalQueuedPacks
    * @return {number} The number of asset packs that still remain in the load queue.
    */
    totalQueuedPacks: function () {

        var total = 0;

        for (var i = 0; i < this._packList.length; i++)
        {
            if (this._packList[i].loaded === false)
            {
                total++;
            }
        }

        return total;

    }

};

Phaser.Loader.prototype.constructor = Phaser.Loader;
