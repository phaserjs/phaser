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
    * You can optionally link a sprite to the preloader.
    *
    * The Sprites width or height will be cropped based on the percentage loaded.
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
    */
    this.baseURL = '';

    /**
    * This event is dispatched when the loading process starts, before the first file has been requested
    * but after all the initial packs have been loaded.
    *
    * @property {Phaser.Signal} onLoadStart
    */
    this.onLoadStart = new Phaser.Signal();

    /**
    * This event is dispatched when the final file in the load queue has either loaded or failed.
    *
    * @property {Phaser.Signal} onLoadComplete
    */
    this.onLoadComplete = new Phaser.Signal();

    /**
    * This event is dispatched when an asset pack has either loaded or failed to load.
    *
    * Params: `(pack key, success?, total packs loaded, total packs)`
    *
    * @property {Phaser.Signal} onPackComplete
    */
    this.onPackComplete = new Phaser.Signal();

    /**
    * This event is dispatched immediately before a file starts loading. It's possible the file may still error (404, etc) after this event is sent.
    *
    * Params: `(progress, file key, file url)`
    *
    * @property {Phaser.Signal} onFileStart
    */
    this.onFileStart = new Phaser.Signal();

    /**
    * This event is dispatched when a file has either loaded or failed to load.
    *
    * Params: `(progress, file key, success?, total loaded files, total files)`
    * 
    * @property {Phaser.Signal} onFileComplete
    */
    this.onFileComplete = new Phaser.Signal();
   
    /**
    * This event is dispatched when a file (or pack) errors as a result of the load request.
    *
    * For files it will be triggered before `onFileComplete`. For packs it will be triggered before `onPackComplete`.
    *
    * Params: `(file key, file)`
    *
    * @property {Phaser.Signal} onFileError
    */
    this.onFileError = new Phaser.Signal();

    /**
    * @property {boolean} useXDomainRequest - If true and if the browser supports XDomainRequest, it will be used in preference for XHR when loading JSON files (it does not affect other file types). This is only relevant for IE9 and should only be enabled when you know your server/CDN requires it.
    */
    this.useXDomainRequest = false;

    /**
    * The number of concurrent assets to try and fetch at once - must be at least 1.
    * Most browsers limit 6 requests per host.
    *
    * @property {integer} concurrentRequestCount
    * @protected
    */
    this.concurrentRequestCount = 6;

    /**
    * Contains all the information for asset files (including packs) to load.
    * 
    * @property {array} _fileList
    * @private
    */
    this._fileList = [];

    /**
    * Inflight files (or packs) that are being fetched/processed.
    *
    * This means that if there are any files in the flight queue there should still be processing
    * going on; it should only be empty before or after loading.
    *
    * The files in the queue may have additional properties added to them,
    * including `requestObject` which is normally the associated XHR.
    *
    * @private
    */
    this._flightQueue = [];

    /**
    * The offset into the fileList past all the complete (loaded or error) entries.
    *
    * @property {integer} _processingHead
    * @private
    */
    this._processingHead = 0;

    /**
    * True when the first file (not pack) has loading started.
    * This used to to control disoatching `onLoadStart` which happens after any initial
    * packs are loaded.
    *
    * @property {boolean} _initialPacksLoaded
    * @private
    */
    this._fileLoadStarted = false;

    /**
    * Total packs seen - adjusted when a pack is added.
    * @property {integer} _totalPackCount
    * @private
    */
    this._totalPackCount = 0;

    /**
    * Total files seen - adjusted when a file is added.
    * @property {integer} _totalFileCount
    * @private
    */
    this._totalFileCount = 0;
    
    /**
    * Total packs loaded - adjusted just prior to `onPackComplete`.
    * @property {integer} _loadedPackCount
    * @private
    */
    this._loadedPackCount = 0;

    /**
    * Total files loaded - adjusted just prior to `onFileComplete`.
    * @property {integer} _loadedFileCount
    * @private
    */
    this._loadedFileCount = 0;

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

        return this.getAssetIndex(type, key) > -1;

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

        for (var i = 0; i < this._fileList.length; i++)
        {
            if (this._fileList[i].type === type && this._fileList[i].key === key)
            {
                return i;
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
    * @return {any} Returns an object if found that has 2 properties: index and asset entry. Otherwise false.
    *     The index may change and should only be used immediately following this call.
    */
    getAsset: function (type, key) {

        var fileIndex = this.getAssetIndex(type, key);

        if (fileIndex > -1)
        {
            return { index: fileIndex, file: this._fileList[fileIndex] };
        }

        return false;

    },

    /**
    * Reset the loader and clear any queued assets.
    *
    * This will abort any loading and clear any queued assets.
    *
    * @method Phaser.Loader#reset
    * @protected
    * @param {boolean} [hard=false] - If true then the preload sprite and other artifacts may also be cleared.
    */
    reset: function (hard) {

        if (hard)
        {
            this.preloadSprite = null;
        }

        this.isLoading = false;

        this._processingHead = 0;
        this._fileList.length = 0;
        this._flightQueue.length = 0;

        this._fileLoadStarted = false;
        this._totalFileCount = 0;
        this._totalPackCount = 0;
        this._loadedPackCount = 0;
        this._loadedFileCount = 0;

    },

    /**
    * Internal function that adds a new entry to the file list. Do not call directly.
    *
    * @method Phaser.Loader#addToFileList
    * @protected
    * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
    * @param {string} key - The unique Cache ID key of this resource.
    * @param {string} url - The URL the asset will be loaded from.
    * @param {object} [properties=(none)] - Any additional properties needed to load the file. These are added directly to the added file object and overwrite any defaults.
    * @param {boolean} [overwrite=false] - If true then this will overwrite a file asset of the same type/key. Otherwise it will will only add a new asset. If overwrite is true, and the asset is already being loaded (or has been loaded), then it is appended instead.
    */
    addToFileList: function (type, key, url, properties, overwrite) {

        var file = {
            type: type,
            key: key,
            url: url,
            data: null,
            loading: false,
            loaded: false,
            error: false
        };

        if (properties)
        {
            for (var prop in properties)
            {
                file[prop] = properties[prop];
            }
        }

        var fileIndex = this.getAssetIndex(type, key);
        
        if (overwrite && fileIndex > -1)
        {
            var currentFile = this._fileList[fileIndex];
            if (!currentFile.loading && !currentFile.loaded)
            {
                this._fileList[fileIndex] = file;
            }
            else
            {
                this._fileList.push(file);
                this._totalFileCount++;
            }
        }
        else if (fileIndex === -1)
        {
            this._fileList.push(file);
            this._totalFileCount++;
        }

    },

    /**
    * Internal function that replaces an existing entry in the file list with a new one. Do not call directly.
    *
    * @method Phaser.Loader#replaceInFileList
    * @protected
    * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
    * @param {string} key - The unique Cache ID key of this resource.
    * @param {string} url - The URL the asset will be loaded from.
    * @param {object} properties - Any additional properties needed to load the file.
    */
    replaceInFileList: function (type, key, url, properties) {

        return this.addToFileList(type, key, url, properties, true);

    },

    /**
    * Add a JSON resource pack ('packfile') to the Loader.
    *
    * Packs are always put before the first non-pack file that is not loaded/loading.
    * This means that all packs added before any loading has started are added to the front
    * of the file/asset list, in order added.
    *
    * @method Phaser.Loader#pack
    * @param {string} key - Unique asset key of this resource pack.
    * @param {string} [url] - URL of the Asset Pack JSON file. If you wish to pass a json object instead set this to null and pass the object as the data parameter.
    * @param {object} [data] - The Asset Pack JSON data. Use this to pass in a json data object rather than loading it from a URL. TODO
    * @param {object} [callbackContext] - Some Loader operations, like Binary and Script require a context for their callbacks. Pass the context here.
    * @return {Phaser.Loader} This Loader instance.
    */
    pack: function (key, url, data, callbackContext) {

        if (typeof url === 'undefined') { url = null; }
        if (typeof data === 'undefined') { data = null; }
        if (typeof callbackContext === 'undefined') { callbackContext = this; }

        if (!url && !data)
        {
            console.warn('Phaser.Loader.pack - Both url and data are null. One must be set.');

            return this;
        }

        var pack = {
            type: 'packfile',
            sync: true,
            key: key,
            url: url,
            data: null,
            loading: false,
            loaded: false,
            error: false,
            callbackContext: callbackContext
        };

        //  A data object has been given
        if (data)
        {
            if (typeof data === 'string')
            {
                data = JSON.parse(data);
            }
            
            pack.data = data;
        }
        
        // Add before first non-pack/no-loaded ~ last pack from start prior to loading
        // (Read one past for splice-to-end)
        for (var i = 0; i < this._fileList.length + 1; i++)
        {
            var file = this._fileList[i];
            if (!file || (!file.loaded && !file.loading && file.type !== 'packfile'))
            {
                this._fileList.splice(i, 1, pack);
                break;
            }
        }

        this._totalPackCount++;

        return this;

    },

    /**
    * Add an 'image' to the Loader.
    *
    * @method Phaser.Loader#image
    * @param {string} key - Unique asset key of this image file.
    * @param {string} url - URL of image file.
    * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
    * @return {Phaser.Loader} This Loader instance.
    */
    image: function (key, url, overwrite) {

        if (typeof overwrite === 'undefined') { overwrite = false; }

        this.addToFileList('image', key, url, undefined, overwrite);

        return this;

    },

    /**
    * Add a 'text' file to the Loader.
    *
    * @method Phaser.Loader#text
    * @param {string} key - Unique asset key of the text file.
    * @param {string} url - URL of the text file.
    * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
    * @return {Phaser.Loader} This Loader instance.
    */
    text: function (key, url, overwrite) {

        if (typeof overwrite === 'undefined') { overwrite = false; }

        this.addToFileList('text', key, url, undefined, overwrite);

        return this;

    },

    /**
    * Add a 'json' file to the Loader.
    *
    * @method Phaser.Loader#json
    * @param {string} key - Unique asset key of the json file.
    * @param {string} url - URL of the json file.
    * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
    * @return {Phaser.Loader} This Loader instance.
    */
    json: function (key, url, overwrite) {

        if (typeof overwrite === 'undefined') { overwrite = false; }

        this.addToFileList('json', key, url, undefined, overwrite);

        return this;

    },

    /**
    * Add an XML ('xml') file to the Loader.
    *
    * @method Phaser.Loader#xml
    * @param {string} key - Unique asset key of the xml file.
    * @param {string} url - URL of the xml file.
    * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
    * @return {Phaser.Loader} This Loader instance.
    */
    xml: function (key, url, overwrite) {

        if (typeof overwrite === 'undefined') { overwrite = false; }

        this.addToFileList('xml', key, url, undefined, overwrite);

        return this;

    },

    /**
    * Add a JavaScript ('script') file to the Loader.
    *
    * The loaded JavaScript is automatically turned into a script tag and executed, so be careful what you load!
    *
    * A callback, which will be invoked as the script tag has been created, can also be specified.
    * The callback must return relevant `data`.
    *
    * @method Phaser.Loader#script
    * @param {string} key - Unique asset key of the script file.
    * @param {string} url - URL of the JavaScript file.
    * @param {function} [callback=(none)] - Optional callback that will be called after the script tag has loaded, so you can perform additional processing.
    * @param {object} [callbackContext=(Loader)] - The context under which the callback will be applied. If not specified it will use the callback itself as the context.
    * @return {Phaser.Loader} This Loader instance.
    */
    script: function (key, url, callback, callbackContext) {

        if (typeof callback === 'undefined') { callback = false; }
        // Why is the default callback context the ..callback?
        if (callback !== false && typeof callbackContext === 'undefined') { callbackContext = callback; }

        this.addToFileList('script', key, url, { sync: true, callback: callback, callbackContext: callbackContext });

        return this;

    },

    /**
    * Add a 'binary' file to the Loader.
    *
    * It will be loaded via xhr with a responseType of "arraybuffer". You can specify an optional callback to process the file after load.
    * When the callback is called it will be passed 2 parameters: the key of the file and the file data.
    *
    * WARNING: If a callback is specified the data will be set to whatever it returns. Always return the data object, even if you didn't modify it.
    *
    * @method Phaser.Loader#binary
    * @param {string} key - Unique asset key of the binary file.
    * @param {string} url - URL of the binary file.
    * @param {function} [callback=(none)] - Optional callback that will be passed the file after loading, so you can perform additional processing on it.
    * @param {object} [callbackContext] - The context under which the callback will be applied. If not specified it will use the callback itself as the context.
    * @return {Phaser.Loader} This Loader instance.
    */
    binary: function (key, url, callback, callbackContext) {

        if (typeof callback === 'undefined') { callback = false; }
        // Why is the default callback context the ..callback?
        if (callback !== false && typeof callbackContext === 'undefined') { callbackContext = callback; }

        this.addToFileList('binary', key, url, { callback: callback, callbackContext: callbackContext });

        return this;

    },

    /**
    * Add a new sprite sheet ('spritesheet') to the loader.
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

        if (typeof frameMax === 'undefined') { frameMax = -1; }
        if (typeof margin === 'undefined') { margin = 0; }
        if (typeof spacing === 'undefined') { spacing = 0; }

        this.addToFileList('spritesheet', key, url, { frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax, margin: margin, spacing: spacing });

        return this;

    },

    /**
    * Add a new 'audio' file to the loader.
    *
    * @method Phaser.Loader#audio
    * @param {string} key - Unique asset key of the audio file.
    * @param {string[]|string} urls - An array containing the URLs of the audio files, i.e.: [ 'jump.mp3', 'jump.ogg', 'jump.m4a' ] or a single string containing just one URL.
    * @param {boolean} [autoDecode=true] - When using Web Audio the audio files can either be decoded at load time or run-time.
    *     They can't be played until they are decoded, but this let's you control when that happens. Decoding is a non-blocking async process.
    * @return {Phaser.Loader} This Loader instance.
    */
    audio: function (key, urls, autoDecode) {

        if (typeof autoDecode === 'undefined') { autoDecode = true; }

        this.addToFileList('audio', key, urls, { buffer: null, autoDecode: autoDecode });

        return this;

    },

    /**
     * Add a new audiosprite file to the loader.
     *
     * Audio Sprites are a combination of audio files and a JSON configuration.
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
    * Add a new 'tilemap' loading request. If data is supplied the object is loaded immediately.
    *
    * @method Phaser.Loader#tilemap
    * @param {string} key - Unique asset key of the tilemap data.
    * @param {string} [url] - The url of the map data file (csv/json)
    * @param {object} [data] - An optional JSON data object. If given then the url is ignored and this JSON object is used for map data instead.
    * @param {number} [format=Phaser.Tilemap.CSV] - The format of the map data. Either Phaser.Tilemap.CSV or Phaser.Tilemap.TILED_JSON.
    * @return {Phaser.Loader} This Loader instance.
    */
    tilemap: function (key, url, data, format) {

        if (typeof url === 'undefined') { url = null; }
        if (typeof data === 'undefined') { data = null; }
        if (typeof format === 'undefined') { format = Phaser.Tilemap.CSV; }

        if (!url && !data)
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
    * Add a new 'physics' data object loading request. If data is supplied the object is loaded immediately.
    *
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

        if (typeof url === 'undefined') { url = null; }
        if (typeof data === 'undefined') { data = null; }
        if (typeof format === 'undefined') { format = Phaser.Physics.LIME_CORONA_JSON; }

        if (!url && !data)
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
    * Add a new bitmap font ('bitmapfont') loading request.
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

        if (typeof xmlURL === 'undefined') { xmlURL = null; }
        if (typeof xmlData === 'undefined') { xmlData = null; }
        if (typeof xSpacing === 'undefined') { xSpacing = 0; }
        if (typeof ySpacing === 'undefined') { ySpacing = 0; }

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
                var xml = this.parseXml(xmlData);

                if (!xml)
                {
                    throw new Error("Phaser.Loader. Invalid Bitmap Font XML given");
                }

                this.addToFileList('bitmapfont', key, textureURL, { xmlURL: null, xmlData: xml, xSpacing: xSpacing, ySpacing: ySpacing });
            }
        }

        return this;

    },

    /**
    * Add a new texture atlas ('textureatlas') to the loader. This atlas uses the JSON Array data format.
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
    * Add a new texture atlas ('textureatlas') to the loader. This atlas uses the JSON Hash data format.
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
    * Add a new texture atlas ('textureatlas') to the loader. This atlas uses the Starling XML data format.
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
    * Add a new texture atlas ('textureatlas') to the loader.
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

        if (typeof atlasURL === 'undefined') { atlasURL = null; }
        if (typeof atlasData === 'undefined') { atlasData = null; }
        if (typeof format === 'undefined') { format = Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY; }

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
                        var xml = this.parseXml(atlasData);

                        if (!xml)
                        {
                            throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
                        }

                        atlasData = xml;
                    }
                    break;
            }

            this.addToFileList('textureatlas', key, textureURL, { atlasURL: null, atlasData: atlasData, format: format });

        }

        return this;

    },

    /**
    * Remove loading request of a file; does nothing if the file is already processed.
    *
    * @method Phaser.Loader#removeFile
    * @protected
    * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
    * @param {string} key - Key of the file you want to remove.
    */
    removeFile: function (type, key) {

        var asset = this.getAsset(type, key);

        if (asset)
        {
            if (!asset.loaded && !asset.loading) {
                this._fileList.splice(asset.index, 1);
            }
        }

    },

    /**
    * Remove all file loading requests - this is _insufficient_ to clear loading. Use `reset` instead.
    *
    * @method Phaser.Loader#removeAll
    * @protected
    */
    removeAll: function () {

        this._fileList.length = 0;
        this._flightQueue.length = 0;

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

        this.hasLoaded = false;
        this.isLoading = true;

        this.updateProgress();

        this.processLoadQueue();

    },

    /**
    * Process the next item(s) in the file/asset queue.
    *
    * Process the queue and start loading enough items to fill up the inflight queue.
    *
    * If a sync-file is encountered then subsequent asset processing is delayed until it completes.
    * The exception to this rule is that packfiles can be downloaded (but not processed) even if
    * there appear other sync files (ie. packs) - this enables multiple packfiles to be fetched asynchronously,
    * such as during the start phaser.
    *
    * @method Phaser.Loader#processLoadQueue
    * @private
    */
    processLoadQueue: function () {

        if (!this.isLoading)
        {
            console.warn('Phaser.Loader - active loading cancelled/reset');
            this.reset();
            return;
        }

        // Empty the flight queue as applicable
        for (var i = 0; i < this._flightQueue.length; i++)
        {
            var file = this._flightQueue[i];
            
            if (file.loaded || file.error)
            {
                this._flightQueue.splice(i, 1);
                i--;

                file.loading = false;
                file.requestObject = null; // clear XHR or other

                if (file.error)
                {
                    this.onFileError.dispatch(file.key, file);
                }

                if (file.type !== 'packfile')
                {
                    this._loadedFileCount++;
                    this.onFileComplete.dispatch(this.progress, file.key, !file.error, this._loadedFileCount, this._totalFileCount);
                }
                else if (file.type === 'packfile' && file.error)
                {
                    // Non-error pack files are handled when processing the file queue
                    this._loadedPackCount++;
                    this.onPackComplete.dispatch(file.key, !file.error, this._loadedPackCount, this._totalPackCount);
                }

            }
        }

        // When true further non-pack file downloads are suppressed
        var syncblock = false;
        var inflightLimit = Phaser.Math.clamp(this.concurrentRequestCount, 1, 10);

        for (var i = this._processingHead; i < this._fileList.length; i++)
        {
            var file = this._fileList[i];

            // Pack is fetched (ie. has data) and is currently at the start of the process queue.
            if (file.type === 'packfile' && !file.error && file.data && i === this._processingHead)
            {
                // Pack may have been supplied with initial data
                this.loaded = true;

                // Processing the pack / adds more files
                this.processPack(file);

                this._loadedPackCount++;
                this.onPackComplete.dispatch(file.key, !file.error, this._loadedPackCount, this._totalPackCount);
            }

            if (file.loaded || file.error)
            {
                // Item at the start - no longer a concern
                if (i === this._processingHead)
                {
                    this._processingHead = i + 1;
                }
            }
            else if (!file.loading && this._flightQueue.length < inflightLimit)
            {
                // -> !file.loaded
                if (file.type === 'packfile' && !file.data)
                {
                    // Fetches the pack data: the pack is processed above as it reaches queue-start.
                    // (Packs do not trigger onLoadStart or onFileStart.)
                    this._flightQueue.push(file);
                    file.loading = true;

                    this.loadFile(file);
                }
                else if (!syncblock)
                {
                    if (!this._fileLoadStarted)
                    {
                        this._fileLoadStarted = true;
                        this.onLoadStart.dispatch();
                    }

                    this._flightQueue.push(file);
                    file.loading = true;
                    this.onFileStart.dispatch(this.progress, file.key, file.url);
                    
                    this.loadFile(file);
                }
            }

            if (!file.loaded && file.sync)
            {
                syncblock = true;
            }

            // Stop looking if queue full - or if syncblocked and there are no more packs.
            // (As only packs can be loaded around a syncblock)
            if (this._flightQueue.length === inflightLimit ||
                (syncblock && this._loadedPackCount === this._totalPackCount))
            {
                break;
            }
        }

        this.updateProgress();

        // True when all items in the queue have been advanced over
        // (There should be no inflight items as they are complete - loaded/error.)
        if (this._processingHead >= this._fileList.length)
        {
            // If there were no files make sure to trigger the event anyway, for consistency
            if (!this._fileLoadStarted)
            {
                this._fileLoadStarted = true;
                this.onLoadStart.dispatch();
            }

            this.finishedProcessingQueue();
        }
        else if (!this._flightQueue.length)
        {
            // Flight queue is empty but file list is not done being processed
            // (There is no known case for this being reached.)
            console.warn("Phaser.Loader - processing queue empty, loading may have stalled");
            var _this = this;
            setTimeout(function () {
                _this.processLoadQueue();
            }, 1000);
        }

    },

    /**
    * The loading is all finished.
    *
    * @method Phaser.Loader#finishedProcessingQueue
    * @private
    */
    finishedProcessingQueue: function () {

        this.hasLoaded = true;
        this.isLoading = false;

        this.onLoadComplete.dispatch();

        this.reset();

    },

    /**
    * Informs the loader that the given file resource has been fetched and processed;
    * or such a request has failed.
    *
    * @method Phaser.Loader#asyncComplete
    * @private
    * @param {object} file
    * @param {string} [error=''] - The error message, if any. No message implies no error.
    */
    asyncComplete: function (file, errorMessage) {

        if (typeof errorMessage === 'undefined') { errorMessage = ''; }

        file.loaded = true;
        file.error = !!errorMessage;
        if (errorMessage)
        {
            file.errorMessage = errorMessage;

            console.warn('Phaser.Loader - ' + file.type + '[' + file.key + ']' + ': ' + errorMessage);
        }

        this.processLoadQueue();

    },

    /**
    * Process pack data. This will usually modify the file list.
    *
    * @method Phaser.Loader#processPack
    * @private
    * @param {object} pack
    */
    processPack: function (pack) {

        var packData = pack.data[pack.key];

        if (!packData)
        {
            console.warn('Phaser.Loader - ' + pack.key + ': pack has data, but not for pack key');
            return;
        }

        for (var i = 0; i < packData.length; i++)
        {
            var file = packData[i];

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

    },

    /**
    * Start fetching a resource.
    *
    * All code paths, async or otherwise, from this function must return to `asyncComplete`.
    *
    * @method Phaser.Loader#loadFile
    * @private
    * @param {object} file
    */
    loadFile: function (file) {

        var _this = this;

        //  Image or Data?
        switch (file.type)
        {
            case 'packfile':
                this.xhrLoad(file, this.baseURL + file.url, 'text', this.fileComplete);
                break;

            case 'image':
            case 'spritesheet':
            case 'textureatlas':
            case 'bitmapfont':
                this.loadImageTag(file);
                break;

            case 'audio':
                file.url = this.getAudioURL(file.url);

                if (file.url)
                {
                    //  WebAudio or Audio Tag?
                    if (this.game.sound.usingWebAudio)
                    {
                        this.xhrLoad(file, this.baseURL + file.url, 'arraybuffer', this.fileComplete);
                    }
                    else if (this.game.sound.usingAudioTag)
                    {
                        this.loadAudioTag(file);
                    }
                }
                else
                {
                    this.fileError(file, null, 'no supported audio URL specified');
                }

                break;

            case 'json':

                if (this.useXDomainRequest && window.XDomainRequest)
                {
                    this.xhrLoadWithXDR(file, this.baseURL + file.url, 'text', this.jsonLoadComplete);
                }
                else
                {
                    this.xhrLoad(file, this.baseURL + file.url, 'text', this.jsonLoadComplete);
                }

                break;

            case 'xml':

                this.xhrLoad(file, this.baseURL + file.url, 'text', this.xmlLoadComplete);
                break;

            case 'tilemap':

                if (file.format === Phaser.Tilemap.TILED_JSON)
                {
                    this.xhrLoad(file, this.baseURL + file.url, 'text', this.jsonLoadComplete);
                }
                else if (file.format === Phaser.Tilemap.CSV)
                {
                    this.xhrLoad(file, this.baseURL + file.url, 'text', this.csvLoadComplete);
                }
                else
                {
                    this.asyncComplete(file, "invalid Tilemap format: " + file.format);
                }
                break;

            case 'text':
            case 'script':
            case 'physics':
                this.xhrLoad(file, this.baseURL + file.url, 'text', this.fileComplete);
                break;

            case 'binary':
                this.xhrLoad(file, this.baseURL + file.url, 'arraybuffer', this.fileComplete);
                break;
        }

    },

    /**
    * Continue async loading through an Image tag.
    * @private
    */
    loadImageTag: function (file) {

        file.data = new Image();
        file.data.name = file.key;

        if (this.crossOrigin)
        {
            file.data.crossOrigin = this.crossOrigin;
        }
        
        file.data.onload = function () {
            if (file.data.onload)
            {
                file.data.onload = null;
                file.data.onerror = null;
                _this.fileComplete(file);
            }
        };
        file.data.onerror = function (message) {
            if (file.data.onload)
            {
                file.data.onload = null;
                file.data.onerror = null;
                _this.fileError(file, null, message);
            }
        };

        file.data.src = this.baseURL + file.url;
        
        // Image is immediately-available/cached
        if (file.data.complete && file.data.width && file.data.height)
        {
            file.data.onload = null;
            file.data.onerror = null;
            this.fileComplete(file);
        }

    },

    /**
    * Continue async loading through an Audio tag.
    * @private
    */
    loadAudioTag: function (file) {

        if (this.game.sound.touchLocked)
        {
            //  If audio is locked we can't do this yet, so need to queue this load request. Bum.
            file.data = new Audio();
            file.data.name = file.key;
            file.data.preload = 'auto';
            file.data.src = this.baseURL + file.url;

            this.fileComplete(file);
        }
        else
        {
            file.data = new Audio();
            file.data.name = file.key;
            
            var playThroughEvent = function () {
                file.data.removeEventListener('canplaythrough', playThroughEvent, false);
                file.data.onerror = null;
                // Why does this cycle through games?
                Phaser.GAMES[_this.game.id].load.fileComplete(file);
            };
            file.data.onerror = function (message) {
                file.data.removeEventListener('canplaythrough', playThroughEvent, false);
                file.data.onerror = null;
                _this.fileError(file, null, message);
            };

            file.data.preload = 'auto';
            file.data.src = this.baseURL + file.url;
            file.data.addEventListener('canplaythrough', playThroughEvent, false);
            file.data.load();
        }

    },

    /**
    * Starts the xhr loader.
    * This is designed specifically to use with asset files.
    *
    * @method Phaser.Loader#xhrLoad
    * @private
    * @param {object} file - The file/pack to load.
    * @param {string} url - The URL of the file.
    * @param {string} type - The xhr responseType.
    * @param {function} onload - The function to call on success. Invoked in `this` context and supplied with `(file, xhr)` arguments.
    * @param {function} [onerror=fileError]  The function to call on error. Invoked in `this` context and supplied with `(file, xhr)` arguments.
    */
    xhrLoad: function (file, url, type, onload, onerror) {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = type;

        onerror = onerror || this.fileError;

        var _this = this;

        xhr.onload = function () {
            try {
                return onload.call(_this, file, xhr);
            } catch (e) {
                _this.asyncComplete(file, e.message || 'Exception');
            }
        };

        xhr.onerror = function () {
            try {
                return onerror.call(_this, file, xhr);
            } catch (e) {
                _this.asyncComplete(file, e.message || 'Exception');
            }
        };

        file.requestObject = xhr;
        file.requestUrl = url;

        xhr.send();

    },

    /**
    * Starts the xhr loader - using XDomainRequest.
    * This is designed specifically to use with asset files.
    *
    * @method Phaser.Loader#xhrLoad
    * @private
    * @param {object} file - The file/pack to load.
    * @param {string} url - The URL of the file.
    * @param {string} type - The xhr responseType.
    * @param {function} onload - The function to call on success. Invoked in `this` context and supplied with `(file, xhr)` arguments.
    * @param {function} [onerror=fileError]  The function to call on error. Invoked in `this` context and supplied with `(file, xhr)` arguments.
    */
    xhrLoadWithXDR: function (file, url, type, onload, onerror) {

        var xhr = new window.XDomainRequest();
        xhr.open('GET', url, true);
        xhr.responseType = type;

        // XDomainRequest has a few quirks. Occasionally it will abort requests
        // A way to avoid this is to make sure ALL callbacks are set even if not used
        // More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
        xhr.timeout = 3000;

        onerror = onerror || this.fileError;

        var _this = this;

        xhr.onerror = function () {
            try {
                return onerror.call(_this, file, xhr);
            } catch (e) {
                _this.asyncComplete(file, e.message || 'Exception');
            }
        };

        xhr.ontimeout = function () {
            try {
                return onerror.call(_this, file, xhr);
            } catch (e) {
                _this.asyncComplete(file, e.message || 'Exception');
            }
        };

        xhr.onprogress = function() {};

        xhr.onload = function () {
            try {
                return onload.call(_this, file, xhr);
            } catch (e) {
                _this.asyncComplete(file, e.message || 'Exception');
            }
        };

        //  Note: The xdr.send() call is wrapped in a timeout to prevent an issue with the interface where some requests are lost
        //  if multiple XDomainRequests are being sent at the same time.
        setTimeout(function () {
            xhr.send();
        }, 0);

    },

    /**
    * Give a bunch of URLs, return the first URL that has an extension this device thinks it can play.
    *
    * @method Phaser.Loader#getAudioURL
    * @private
    * @param {string[]|string} urls - Either an array of audio file URLs or a string containing a single URL path.
    * @return {string} The URL to try and fetch; or null.
    */
    getAudioURL: function (urls) {

        if (typeof urls === 'string') { urls = [urls]; }

        for (var i = 0; i < urls.length; i++)
        {
            var extension = urls[i].toLowerCase();
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
    * @private
    * @param {object} file
    * @param {?XMLHttpRequest} xhr - XHR request, unspecified if loaded via other means (eg. tags)
    * @param {string} reason
    */
    fileError: function (file, xhr, reason) {

        var message = 'error loading asset from URL ' + (file.requestUrl || (file.baseURL + file.url));

        if (!reason && xhr)
        {
            reason = xhr.status;
        }

        if (reason)
        {
            message = message + ' (' + reason + ')';
        }

        this.asyncComplete(file, message);

    },

    /**
    * Called when a file/resources had been downloaded and needs to be processed further.
    *
    * @method Phaser.Loader#fileComplete
    * @private
    * @param {object} file - File loaded
    * @param {?XMLHttpRequest} xhr - XHR request, unspecified if loaded via other means (eg. tags)
    */
    fileComplete: function (file, xhr) {

        var loadNext = true;

        switch (file.type)
        {
            case 'packfile':
                
                // Pack data must never be false-ish after it is fetched without error
                var data = JSON.parse(xhr.responseText);
                file.data = data || {};
                break;

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
                        this.xhrLoad(file, this.baseURL + file.atlasURL, 'text', this.jsonLoadComplete);
                    }
                    else if (file.format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
                    {
                        this.xhrLoad(file, this.baseURL + file.atlasURL, 'text', this.xmlLoadComplete);
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
                    this.xhrLoad(file, this.baseURL + file.xmlURL, 'text', this.xmlLoadComplete);
                }
                break;

            case 'audio':

                if (this.game.sound.usingWebAudio)
                {
                    file.data = xhr.response;

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
                    this.game.cache.addSound(file.key, file.url, file.data, false, true);
                }
                break;

            case 'text':
                file.data = xhr.responseText;
                this.game.cache.addText(file.key, file.url, file.data);
                break;

            case 'physics':
                var data = JSON.parse(this.responseText);
                this.game.cache.addPhysicsData(file.key, file.url, data, file.format);
                break;

            case 'script':
                file.data = document.createElement('script');
                file.data.language = 'javascript';
                file.data.type = 'text/javascript';
                file.data.defer = false;
                file.data.text = xhr.responseText;
                document.head.appendChild(file.data);
                if (file.callback)
                {
                    file.data = file.callback.call(file.callbackContext, file.key, xhr.responseText);
                }
                break;

            case 'binary':
                if (file.callback)
                {
                    file.data = file.callback.call(file.callbackContext, file.key, this.response);
                }
                else
                {
                    file.data = xhr.response;
                }

                this.game.cache.addBinary(file.key, file.data);

                break;
        }

        if (loadNext)
        {
            this.asyncComplete(file);
        }

    },

    /**
    * Successfully loaded a JSON file - only used for certain types.
    *
    * @method Phaser.Loader#jsonLoadComplete
    * @private
    * @param {object} file - File associated with this request
    * @param {XMLHttpRequest} xhr
    */
    jsonLoadComplete: function (file, xhr) {

        var data = JSON.parse(xhr.responseText);

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

        this.asyncComplete(file);

    },

    /**
    * Successfully loaded a CSV file - only used for certain types.
    *
    * @method Phaser.Loader#csvLoadComplete
    * @private
    * @param {object} file - File associated with this request
    * @param {XMLHttpRequest} xhr
    */
    csvLoadComplete: function (file, xhr) {

        var data = xhr.responseText;

        this.game.cache.addTilemap(file.key, file.url, data, file.format);

        this.asyncComplete(file);

    },

    /**
    * Successfully loaded an XML file - only used for certain types.
    *
    * @method Phaser.Loader#xmlLoadComplete
    * @private
    * @param {object} file - File associated with this request
    * @param {XMLHttpRequest} xhr
    */
    xmlLoadComplete: function (file, xhr) {

        if (xhr.responseType !== '' && xhr.responseType !== 'text')
        {
            console.warn('Phaser.Loader - ' + file.key + ': invalid XML Response Type');
        }

        var data = xhr.responseText;
        var xml = this.parseXml(data);

        if (!xml)
        {
            this.asyncComplete(file, "invalid XML");
            return;
        }

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

        this.asyncComplete(file);

    },

    /**
    * Error failed during fetch of secondary data.
    *
    * @method Phaser.Loader#dataLoadError
    * @private
    * @param {object} file - File associated with this request
    * @param {XMLHttpRequest} xhr
    */
    dataLoadError: function (file, xhr) {

        var message = 'error loading file data (' + xhr.status + ')';

        this.asyncComplete(file, message);

    },

    /**
    * Parses string data as XML.
    *
    * @method parseXml
    * @private
    * @param {string} data - The XML text to parse
    * @return {?XMLDocument} Returns the xml document, or null if such could not parsed to a valid document.
    */
    parseXml: function (data) {

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
                // Why is this 'false'?
                xml.async = 'false';
                xml.loadXML(data);
            }
        }
        catch (e)
        {
            xml = null;
        }

        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
        {
            return null;
        }
        else
        {
            return xml;
        }

    },

    /**
    * Update the loading sprite progress.
    *
    * @method Phaser.Loader#nextFile
    * @private
    * @param {object} previousFile
    * @param {boolean} success - Whether the previous asset loaded successfully or not.
    */
    updateProgress: function () {

        if (this.preloadSprite)
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

    },

    /**
    * Returns the number of files that have already been loaded, even if they errored.
    *
    * @method Phaser.Loader#totalLoadedFiles
    * @return {number} The number of files that have already been loaded (even if they errored)
    */
    totalLoadedFiles: function () {

        return this._loadedFileCount;

    },

    /**
    * Returns the number of files still waiting to be processed in the load queue. This value decreases as each file in the queue is loaded.
    *
    * @method Phaser.Loader#totalQueuedFiles
    * @return {number} The number of files that still remain in the load queue.
    */
    totalQueuedFiles: function () {

        return this._totalFileCount - this._loadedFileCount;

    },

    /**
    * Returns the number of asset packs that have already been loaded, even if they errored.
    *
    * @method Phaser.Loader#totalLoadedPacks
    * @return {number} The number of asset packs that have already been loaded (even if they errored)
    */
    totalLoadedPacks: function () {

        return this._totalPackCount;

    },

    /**
    * Returns the number of asset packs still waiting to be processed in the load queue. This value decreases as each pack in the queue is loaded.
    *
    * @method Phaser.Loader#totalQueuedPacks
    * @return {number} The number of asset packs that still remain in the load queue.
    */
    totalQueuedPacks: function () {

        return this._totalPackCount - this._loadedPackCount;

    }

};

/**
* The non-rounded load progress value (from 0.0 to 100.0).
*
* A general indicator of the progress.
* It is possible for the progress to decrease, after `onLoadStart`, if more files are dynamically added.
*
* @memberof Phaser.Loader#progressFloat
* @property {number}
*/
Object.defineProperty(Phaser.Loader.prototype, "progressFloat", {

    get: function () {
        var progress = (this._loadedFileCount / this._totalFileCount) * 100;
        return Phaser.Math.clamp(progress || 0, 0, 100);
    }

});

/**
* The rounded load progress percentage value (from 0 to 100). See {@link Phaser.Loader#progressFloat}.
*
* @name Phaser.Loader#progress
* @property {integer}
*/
Object.defineProperty(Phaser.Loader.prototype, "progress", {

    get: function () {
        return Math.round(this.progressFloat);
    }

});

Phaser.Loader.prototype.constructor = Phaser.Loader;
