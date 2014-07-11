/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Loader.Image
* @classdesc
* 
* @constructor
* @param {Phaser.Loader} loader - Reference to the Loader that owns this file.
* @param {string} baseURL - The base URL to load the asset from.
* @param {string} key - Unique asset key of this image file.
* @param {string} url - URL of image file.
*/
Phaser.Loader.Image = function (loader, baseURL, key, url, properties) {

    /**
    * @property {Phaser.Game} game - Reference to the main Game object.
    */
    this.game = loader.game;

    /**
    * @property {Phaser.Loader} loader - Reference to the Loader that owns this file.
    */
    this.loader = loader;

    /**
    * @property {number} type - The type of file.
    * @protected
    */
    this.type = Phaser.Loader.IMAGE;

    /**
    * @property {string} key - Unique asset key of this image file.
    */
    this.key = key;

    /**
    * @property {boolean} error - True if there was an error loading this file.
    * @default
    */
    this.error = false;

    /**
    * @property {boolean} loaded - True if this file has finished loading.
    * @default
    */
    this.loaded = false;

    /**
    * @property {boolean} isLoading - True if the Loader is in the process of loading this file.
    * @default
    */
    this.isLoading = false;

    /**
    * If you want to append a URL before the path of any asset you can set this here.
    * Useful if you need to allow an asset url to be configured outside of the game code.
    * MUST have / on the end of it!
    * @property {string} baseURL
    * @default
    */
    this.baseURL = baseURL;

    /**
    * @property {boolean|string} crossOrigin - The crossOrigin value applied to loaded images. Very often this needs to be set to 'anonymous'.
    * @default
    */
    this.crossOrigin = false;

    /**
    * @property {object} data - File data.
    * @default
    */
    this.data = null;

    /**
    * @property {string} url - URL of the image file.
    */
    this.url = url;

    /**
    * @property {object} properties - Additional file properties.
    */
    this.properties = {};

    if (typeof properties !== "undefined")
    {
        for (var prop in properties)
        {
            this.properties[prop] = properties[prop];
        }
    }

};

Phaser.Loader.Image.prototype = {

    /**
    * Starts the loading process for this file.
    *
    * @method Phaser.Loader.Image#start
    */
    start: function () {

        this.data = new Image();
        this.data.name = this.key;

        this.data.onload = function () {
            return _this.fileComplete(_this._fileIndex);
        };

        file.data.onerror = function () {
            return _this.fileError(_this._fileIndex);
        };

        if (this.crossOrigin)
        {
            this.data.crossOrigin = this.crossOrigin;
        }

        this.data.src = this.baseURL + this.url;

        this.isLoading = true;

    },

    /**
    * What to do when the file completes loading.
    *
    * @method Phaser.Loader.Image#complete
    */
    complete: function () {

        this.isLoading = false;
        this.loaded = true;

        this.game.cache.addImage(this.key, this.url, this.data);

        this.loader.onFileComplete.dispatch(this);

    },

    /**
    * Error occured when loading a file.
    *
    * @method Phaser.Loader.Image#error
    */
    error: function () {

        this.isLoading = false;
        this.loaded = true;
        this.error = true;

        this.loader.onFileError.dispatch(this);

        console.warn("Phaser.Loader.Image Error Loading: " + this.key + ' from URL ' + this.url);

    },

    /**
    * Destroy this file object.
    *
    * @method Phaser.Loader.Image#destroy
    */
    destroy: function () {

        this.loader = null;
        this.game = null;
        this.data = null;
        this.properties = {};

    }

};
