(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("SpinePlugin", [], factory);
	else if(typeof exports === 'object')
		exports["SpinePlugin"] = factory();
	else
		root["SpinePlugin"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./SpinePlugin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../src/loader/File.js":
/*!*********************************************!*\
  !*** D:/wamp/www/phaser/src/loader/File.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(/*! ../utils/Class */ "../../../src/utils/Class.js");
var CONST = __webpack_require__(/*! ./const */ "../../../src/loader/const.js");
var GetFastValue = __webpack_require__(/*! ../utils/object/GetFastValue */ "../../../src/utils/object/GetFastValue.js");
var GetURL = __webpack_require__(/*! ./GetURL */ "../../../src/loader/GetURL.js");
var MergeXHRSettings = __webpack_require__(/*! ./MergeXHRSettings */ "../../../src/loader/MergeXHRSettings.js");
var XHRLoader = __webpack_require__(/*! ./XHRLoader */ "../../../src/loader/XHRLoader.js");
var XHRSettings = __webpack_require__(/*! ./XHRSettings */ "../../../src/loader/XHRSettings.js");

/**
 * @typedef {object} FileConfig
 *
 * @property {string} type - The file type string (image, json, etc) for sorting within the Loader.
 * @property {string} key - Unique cache key (unique within its file type)
 * @property {string} [url] - The URL of the file, not including baseURL.
 * @property {string} [path] - The path of the file, not including the baseURL.
 * @property {string} [extension] - The default extension this file uses.
 * @property {XMLHttpRequestResponseType} [responseType] - The responseType to be used by the XHR request.
 * @property {(XHRSettingsObject|false)} [xhrSettings=false] - Custom XHR Settings specific to this file and merged with the Loader defaults.
 * @property {any} [config] - A config object that can be used by file types to store transitional data.
 */

/**
 * @classdesc
 * The base File class used by all File Types that the Loader can support.
 * You shouldn't create an instance of a File directly, but should extend it with your own class, setting a custom type and processing methods.
 *
 * @class File
 * @memberof Phaser.Loader
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - The Loader that is going to load this File.
 * @param {FileConfig} fileConfig - The file configuration object, as created by the file type.
 */
var File = new Class({

    initialize:

    function File (loader, fileConfig)
    {
        /**
         * A reference to the Loader that is going to load this file.
         *
         * @name Phaser.Loader.File#loader
         * @type {Phaser.Loader.LoaderPlugin}
         * @since 3.0.0
         */
        this.loader = loader;

        /**
         * A reference to the Cache, or Texture Manager, that is going to store this file if it loads.
         *
         * @name Phaser.Loader.File#cache
         * @type {(Phaser.Cache.BaseCache|Phaser.Textures.TextureManager)}
         * @since 3.7.0
         */
        this.cache = GetFastValue(fileConfig, 'cache', false);

        /**
         * The file type string (image, json, etc) for sorting within the Loader.
         *
         * @name Phaser.Loader.File#type
         * @type {string}
         * @since 3.0.0
         */
        this.type = GetFastValue(fileConfig, 'type', false);

        /**
         * Unique cache key (unique within its file type)
         *
         * @name Phaser.Loader.File#key
         * @type {string}
         * @since 3.0.0
         */
        this.key = GetFastValue(fileConfig, 'key', false);

        var loadKey = this.key;

        if (loader.prefix && loader.prefix !== '')
        {
            this.key = loader.prefix + loadKey;
        }

        if (!this.type || !this.key)
        {
            throw new Error('Error calling \'Loader.' + this.type + '\' invalid key provided.');
        }

        /**
         * The URL of the file, not including baseURL.
         * Automatically has Loader.path prepended to it.
         *
         * @name Phaser.Loader.File#url
         * @type {string}
         * @since 3.0.0
         */
        this.url = GetFastValue(fileConfig, 'url');

        if (this.url === undefined)
        {
            this.url = loader.path + loadKey + '.' + GetFastValue(fileConfig, 'extension', '');
        }
        else if (typeof(this.url) !== 'function')
        {
            this.url = loader.path + this.url;
        }

        /**
         * The final URL this file will load from, including baseURL and path.
         * Set automatically when the Loader calls 'load' on this file.
         *
         * @name Phaser.Loader.File#src
         * @type {string}
         * @since 3.0.0
         */
        this.src = '';

        /**
         * The merged XHRSettings for this file.
         *
         * @name Phaser.Loader.File#xhrSettings
         * @type {XHRSettingsObject}
         * @since 3.0.0
         */
        this.xhrSettings = XHRSettings(GetFastValue(fileConfig, 'responseType', undefined));

        if (GetFastValue(fileConfig, 'xhrSettings', false))
        {
            this.xhrSettings = MergeXHRSettings(this.xhrSettings, GetFastValue(fileConfig, 'xhrSettings', {}));
        }

        /**
         * The XMLHttpRequest instance (as created by XHR Loader) that is loading this File.
         *
         * @name Phaser.Loader.File#xhrLoader
         * @type {?XMLHttpRequest}
         * @since 3.0.0
         */
        this.xhrLoader = null;

        /**
         * The current state of the file. One of the FILE_CONST values.
         *
         * @name Phaser.Loader.File#state
         * @type {integer}
         * @since 3.0.0
         */
        this.state = (typeof(this.url) === 'function') ? CONST.FILE_POPULATED : CONST.FILE_PENDING;

        /**
         * The total size of this file.
         * Set by onProgress and only if loading via XHR.
         *
         * @name Phaser.Loader.File#bytesTotal
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.bytesTotal = 0;

        /**
         * Updated as the file loads.
         * Only set if loading via XHR.
         *
         * @name Phaser.Loader.File#bytesLoaded
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.bytesLoaded = -1;

        /**
         * A percentage value between 0 and 1 indicating how much of this file has loaded.
         * Only set if loading via XHR.
         *
         * @name Phaser.Loader.File#percentComplete
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.percentComplete = -1;

        /**
         * For CORs based loading.
         * If this is undefined then the File will check BaseLoader.crossOrigin and use that (if set)
         *
         * @name Phaser.Loader.File#crossOrigin
         * @type {(string|undefined)}
         * @since 3.0.0
         */
        this.crossOrigin = undefined;

        /**
         * The processed file data, stored here after the file has loaded.
         *
         * @name Phaser.Loader.File#data
         * @type {*}
         * @since 3.0.0
         */
        this.data = undefined;

        /**
         * A config object that can be used by file types to store transitional data.
         *
         * @name Phaser.Loader.File#config
         * @type {*}
         * @since 3.0.0
         */
        this.config = GetFastValue(fileConfig, 'config', {});

        /**
         * If this is a multipart file, i.e. an atlas and its json together, then this is a reference
         * to the parent MultiFile. Set and used internally by the Loader or specific file types.
         *
         * @name Phaser.Loader.File#multiFile
         * @type {?Phaser.Loader.MultiFile}
         * @since 3.7.0
         */
        this.multiFile;

        /**
         * Does this file have an associated linked file? Such as an image and a normal map.
         * Atlases and Bitmap Fonts use the multiFile, because those files need loading together but aren't
         * actually bound by data, where-as a linkFile is.
         *
         * @name Phaser.Loader.File#linkFile
         * @type {?Phaser.Loader.File}
         * @since 3.7.0
         */
        this.linkFile;
    },

    /**
     * Links this File with another, so they depend upon each other for loading and processing.
     *
     * @method Phaser.Loader.File#setLink
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} fileB - The file to link to this one.
     */
    setLink: function (fileB)
    {
        this.linkFile = fileB;

        fileB.linkFile = this;
    },

    /**
     * Resets the XHRLoader instance this file is using.
     *
     * @method Phaser.Loader.File#resetXHR
     * @since 3.0.0
     */
    resetXHR: function ()
    {
        if (this.xhrLoader)
        {
            this.xhrLoader.onload = undefined;
            this.xhrLoader.onerror = undefined;
            this.xhrLoader.onprogress = undefined;
        }
    },

    /**
     * Called by the Loader, starts the actual file downloading.
     * During the load the methods onLoad, onError and onProgress are called, based on the XHR events.
     * You shouldn't normally call this method directly, it's meant to be invoked by the Loader.
     *
     * @method Phaser.Loader.File#load
     * @since 3.0.0
     */
    load: function ()
    {
        if (this.state === CONST.FILE_POPULATED)
        {
            //  Can happen for example in a JSONFile if they've provided a JSON object instead of a URL
            this.loader.nextFile(this, true);
        }
        else
        {
            this.src = GetURL(this, this.loader.baseURL);

            if (this.src.indexOf('data:') === 0)
            {
                console.warn('Local data URIs are not supported: ' + this.key);
            }
            else
            {
                //  The creation of this XHRLoader starts the load process going.
                //  It will automatically call the following, based on the load outcome:
                //  
                // xhr.onload = this.onLoad
                // xhr.onerror = this.onError
                // xhr.onprogress = this.onProgress

                this.xhrLoader = XHRLoader(this, this.loader.xhr);
            }
        }
    },

    /**
     * Called when the file finishes loading, is sent a DOM ProgressEvent.
     *
     * @method Phaser.Loader.File#onLoad
     * @since 3.0.0
     *
     * @param {XMLHttpRequest} xhr - The XMLHttpRequest that caused this onload event.
     * @param {ProgressEvent} event - The DOM ProgressEvent that resulted from this load.
     */
    onLoad: function (xhr, event)
    {
        var success = !(event.target && event.target.status !== 200);

        //  Handle HTTP status codes of 4xx and 5xx as errors, even if xhr.onerror was not called.
        if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status <= 599)
        {
            success = false;
        }

        this.resetXHR();

        this.loader.nextFile(this, success);
    },

    /**
     * Called if the file errors while loading, is sent a DOM ProgressEvent.
     *
     * @method Phaser.Loader.File#onError
     * @since 3.0.0
     *
     * @param {ProgressEvent} event - The DOM ProgressEvent that resulted from this error.
     */
    onError: function ()
    {
        this.resetXHR();

        this.loader.nextFile(this, false);
    },

    /**
     * Called during the file load progress. Is sent a DOM ProgressEvent.
     *
     * @method Phaser.Loader.File#onProgress
     * @since 3.0.0
     *
     * @param {ProgressEvent} event - The DOM ProgressEvent.
     */
    onProgress: function (event)
    {
        if (event.lengthComputable)
        {
            this.bytesLoaded = event.loaded;
            this.bytesTotal = event.total;

            this.percentComplete = Math.min((this.bytesLoaded / this.bytesTotal), 1);

            this.loader.emit('fileprogress', this, this.percentComplete);
        }
    },

    /**
     * Usually overridden by the FileTypes and is called by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data, for example a JSON file will parse itself during this stage.
     *
     * @method Phaser.Loader.File#onProcess
     * @since 3.0.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.onProcessComplete();
    },

    /**
     * Called when the File has completed processing.
     * Checks on the state of its multifile, if set.
     *
     * @method Phaser.Loader.File#onProcessComplete
     * @since 3.7.0
     */
    onProcessComplete: function ()
    {
        this.state = CONST.FILE_COMPLETE;

        if (this.multiFile)
        {
            this.multiFile.onFileComplete(this);
        }

        this.loader.fileProcessComplete(this);
    },

    /**
     * Called when the File has completed processing but it generated an error.
     * Checks on the state of its multifile, if set.
     *
     * @method Phaser.Loader.File#onProcessError
     * @since 3.7.0
     */
    onProcessError: function ()
    {
        this.state = CONST.FILE_ERRORED;

        if (this.multiFile)
        {
            this.multiFile.onFileFailed(this);
        }

        this.loader.fileProcessComplete(this);
    },

    /**
     * Checks if a key matching the one used by this file exists in the target Cache or not.
     * This is called automatically by the LoaderPlugin to decide if the file can be safely
     * loaded or will conflict.
     *
     * @method Phaser.Loader.File#hasCacheConflict
     * @since 3.7.0
     *
     * @return {boolean} `true` if adding this file will cause a conflict, otherwise `false`.
     */
    hasCacheConflict: function ()
    {
        return (this.cache && this.cache.exists(this.key));
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     * This method is often overridden by specific file types.
     *
     * @method Phaser.Loader.File#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        if (this.cache)
        {
            this.cache.add(this.key, this.data);
        }

        this.pendingDestroy();
    },

    /**
     * You can listen for this event from the LoaderPlugin. It is dispatched _every time_
     * a file loads and is sent 3 arguments, which allow you to identify the file:
     *
     * ```javascript
     * this.load.on('filecomplete', function (key, type, data) {
     *     // Your handler code
     * });
     * ```
     * 
     * @event Phaser.Loader.File#fileCompleteEvent
     * @param {string} key - The key of the file that just loaded and finished processing.
     * @param {string} type - The type of the file that just loaded and finished processing.
     * @param {any} data - The data of the file.
     */

    /**
     * You can listen for this event from the LoaderPlugin. It is dispatched only once per
     * file and you have to use a special listener handle to pick it up.
     * 
     * The string of the event is based on the file type and the key you gave it, split up
     * using hyphens.
     * 
     * For example, if you have loaded an image with a key of `monster`, you can listen for it
     * using the following:
     *
     * ```javascript
     * this.load.on('filecomplete-image-monster', function (key, type, data) {
     *     // Your handler code
     * });
     * ```
     *
     * Or, if you have loaded a texture atlas with a key of `Level1`:
     * 
     * ```javascript
     * this.load.on('filecomplete-atlas-Level1', function (key, type, data) {
     *     // Your handler code
     * });
     * ```
     * 
     * Or, if you have loaded a sprite sheet with a key of `Explosion` and a prefix of `GAMEOVER`:
     * 
     * ```javascript
     * this.load.on('filecomplete-spritesheet-GAMEOVERExplosion', function (key, type, data) {
     *     // Your handler code
     * });
     * ```
     * 
     * @event Phaser.Loader.File#singleFileCompleteEvent
     * @param {any} data - The data of the file.
     */

    /**
     * Called once the file has been added to its cache and is now ready for deletion from the Loader.
     * It will emit a `filecomplete` event from the LoaderPlugin.
     *
     * @method Phaser.Loader.File#pendingDestroy
     * @fires Phaser.Loader.File#fileCompleteEvent
     * @fires Phaser.Loader.File#singleFileCompleteEvent
     * @since 3.7.0
     */
    pendingDestroy: function (data)
    {
        if (data === undefined) { data = this.data; }

        var key = this.key;
        var type = this.type;

        this.loader.emit('filecomplete', key, type, data);
        this.loader.emit('filecomplete-' + type + '-' + key, key, type, data);

        this.loader.flagForRemoval(this);
    },

    /**
     * Destroy this File and any references it holds.
     *
     * @method Phaser.Loader.File#destroy
     * @since 3.7.0
     */
    destroy: function ()
    {
        this.loader = null;
        this.cache = null;
        this.xhrSettings = null;
        this.multiFile = null;
        this.linkFile = null;
        this.data = null;
    }

});

/**
 * Static method for creating object URL using URL API and setting it as image 'src' attribute.
 * If URL API is not supported (usually on old browsers) it falls back to creating Base64 encoded url using FileReader.
 *
 * @method Phaser.Loader.File.createObjectURL
 * @static
 * @param {HTMLImageElement} image - Image object which 'src' attribute should be set to object URL.
 * @param {Blob} blob - A Blob object to create an object URL for.
 * @param {string} defaultType - Default mime type used if blob type is not available.
 */
File.createObjectURL = function (image, blob, defaultType)
{
    if (typeof URL === 'function')
    {
        image.src = URL.createObjectURL(blob);
    }
    else
    {
        var reader = new FileReader();

        reader.onload = function ()
        {
            image.removeAttribute('crossOrigin');
            image.src = 'data:' + (blob.type || defaultType) + ';base64,' + reader.result.split(',')[1];
        };

        reader.onerror = image.onerror;

        reader.readAsDataURL(blob);
    }
};

/**
 * Static method for releasing an existing object URL which was previously created
 * by calling {@link File#createObjectURL} method.
 *
 * @method Phaser.Loader.File.revokeObjectURL
 * @static
 * @param {HTMLImageElement} image - Image object which 'src' attribute should be revoked.
 */
File.revokeObjectURL = function (image)
{
    if (typeof URL === 'function')
    {
        URL.revokeObjectURL(image.src);
    }
};

module.exports = File;


/***/ }),

/***/ "../../../src/loader/FileTypesManager.js":
/*!*********************************************************!*\
  !*** D:/wamp/www/phaser/src/loader/FileTypesManager.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var types = {};

var FileTypesManager = {

    /**
     * Static method called when a LoaderPlugin is created.
     * 
     * Loops through the local types object and injects all of them as
     * properties into the LoaderPlugin instance.
     *
     * @method Phaser.Loader.FileTypesManager.register
     * @since 3.0.0
     * 
     * @param {Phaser.Loader.LoaderPlugin} loader - The LoaderPlugin to install the types into.
     */
    install: function (loader)
    {
        for (var key in types)
        {
            loader[key] = types[key];
        }
    },

    /**
     * Static method called directly by the File Types.
     * 
     * The key is a reference to the function used to load the files via the Loader, i.e. `image`.
     *
     * @method Phaser.Loader.FileTypesManager.register
     * @since 3.0.0
     * 
     * @param {string} key - The key that will be used as the method name in the LoaderPlugin.
     * @param {function} factoryFunction - The function that will be called when LoaderPlugin.key is invoked.
     */
    register: function (key, factoryFunction)
    {
        types[key] = factoryFunction;
    },

    /**
     * Removed all associated file types.
     *
     * @method Phaser.Loader.FileTypesManager.destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        types = {};
    }

};

module.exports = FileTypesManager;


/***/ }),

/***/ "../../../src/loader/GetURL.js":
/*!***********************************************!*\
  !*** D:/wamp/www/phaser/src/loader/GetURL.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Given a File and a baseURL value this returns the URL the File will use to download from.
 *
 * @function Phaser.Loader.GetURL
 * @since 3.0.0
 *
 * @param {Phaser.Loader.File} file - The File object.
 * @param {string} baseURL - A default base URL.
 *
 * @return {string} The URL the File will use.
 */
var GetURL = function (file, baseURL)
{
    if (!file.url)
    {
        return false;
    }

    if (file.url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/))
    {
        return file.url;
    }
    else
    {
        return baseURL + file.url;
    }
};

module.exports = GetURL;


/***/ }),

/***/ "../../../src/loader/MergeXHRSettings.js":
/*!*********************************************************!*\
  !*** D:/wamp/www/phaser/src/loader/MergeXHRSettings.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Extend = __webpack_require__(/*! ../utils/object/Extend */ "../../../src/utils/object/Extend.js");
var XHRSettings = __webpack_require__(/*! ./XHRSettings */ "../../../src/loader/XHRSettings.js");

/**
 * Takes two XHRSettings Objects and creates a new XHRSettings object from them.
 *
 * The new object is seeded by the values given in the global settings, but any setting in
 * the local object overrides the global ones.
 *
 * @function Phaser.Loader.MergeXHRSettings
 * @since 3.0.0
 *
 * @param {XHRSettingsObject} global - The global XHRSettings object.
 * @param {XHRSettingsObject} local - The local XHRSettings object.
 *
 * @return {XHRSettingsObject} A newly formed XHRSettings object.
 */
var MergeXHRSettings = function (global, local)
{
    var output = (global === undefined) ? XHRSettings() : Extend({}, global);

    if (local)
    {
        for (var setting in local)
        {
            if (local[setting] !== undefined)
            {
                output[setting] = local[setting];
            }
        }
    }

    return output;
};

module.exports = MergeXHRSettings;


/***/ }),

/***/ "../../../src/loader/MultiFile.js":
/*!**************************************************!*\
  !*** D:/wamp/www/phaser/src/loader/MultiFile.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(/*! ../utils/Class */ "../../../src/utils/Class.js");

/**
 * @classdesc
 * A MultiFile is a special kind of parent that contains two, or more, Files as children and looks after
 * the loading and processing of them all. It is commonly extended and used as a base class for file types such as AtlasJSON or BitmapFont.
 * 
 * You shouldn't create an instance of a MultiFile directly, but should extend it with your own class, setting a custom type and processing methods.
 *
 * @class MultiFile
 * @memberof Phaser.Loader
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - The Loader that is going to load this File.
 * @param {string} type - The file type string for sorting within the Loader.
 * @param {string} key - The key of the file within the loader.
 * @param {Phaser.Loader.File[]} files - An array of Files that make-up this MultiFile.
 */
var MultiFile = new Class({

    initialize:

    function MultiFile (loader, type, key, files)
    {
        /**
         * A reference to the Loader that is going to load this file.
         *
         * @name Phaser.Loader.MultiFile#loader
         * @type {Phaser.Loader.LoaderPlugin}
         * @since 3.7.0
         */
        this.loader = loader;

        /**
         * The file type string for sorting within the Loader.
         *
         * @name Phaser.Loader.MultiFile#type
         * @type {string}
         * @since 3.7.0
         */
        this.type = type;

        /**
         * Unique cache key (unique within its file type)
         *
         * @name Phaser.Loader.MultiFile#key
         * @type {string}
         * @since 3.7.0
         */
        this.key = key;

        /**
         * Array of files that make up this MultiFile.
         *
         * @name Phaser.Loader.MultiFile#files
         * @type {Phaser.Loader.File[]}
         * @since 3.7.0
         */
        this.files = files;

        /**
         * The completion status of this MultiFile.
         *
         * @name Phaser.Loader.MultiFile#complete
         * @type {boolean}
         * @default false
         * @since 3.7.0
         */
        this.complete = false;

        /**
         * The number of files to load.
         *
         * @name Phaser.Loader.MultiFile#pending
         * @type {integer}
         * @since 3.7.0
         */

        this.pending = files.length;

        /**
         * The number of files that failed to load.
         *
         * @name Phaser.Loader.MultiFile#failed
         * @type {integer}
         * @default 0
         * @since 3.7.0
         */
        this.failed = 0;

        /**
         * A storage container for transient data that the loading files need.
         *
         * @name Phaser.Loader.MultiFile#config
         * @type {any}
         * @since 3.7.0
         */
        this.config = {};

        //  Link the files
        for (var i = 0; i < files.length; i++)
        {
            files[i].multiFile = this;
        }
    },

    /**
     * Checks if this MultiFile is ready to process its children or not.
     *
     * @method Phaser.Loader.MultiFile#isReadyToProcess
     * @since 3.7.0
     *
     * @return {boolean} `true` if all children of this MultiFile have loaded, otherwise `false`.
     */
    isReadyToProcess: function ()
    {
        return (this.pending === 0 && this.failed === 0 && !this.complete);
    },

    /**
     * Adds another child to this MultiFile, increases the pending count and resets the completion status.
     *
     * @method Phaser.Loader.MultiFile#addToMultiFile
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} files - The File to add to this MultiFile.
     *
     * @return {Phaser.Loader.MultiFile} This MultiFile instance.
     */
    addToMultiFile: function (file)
    {
        this.files.push(file);

        file.multiFile = this;

        this.pending++;

        this.complete = false;

        return this;
    },

    /**
     * Called by each File when it finishes loading.
     *
     * @method Phaser.Loader.MultiFile#onFileComplete
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} file - The File that has completed processing.
     */
    onFileComplete: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.pending--;
        }
    },

    /**
     * Called by each File that fails to load.
     *
     * @method Phaser.Loader.MultiFile#onFileFailed
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} file - The File that has failed to load.
     */
    onFileFailed: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.failed++;
        }
    }

});

module.exports = MultiFile;


/***/ }),

/***/ "../../../src/loader/XHRLoader.js":
/*!**************************************************!*\
  !*** D:/wamp/www/phaser/src/loader/XHRLoader.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var MergeXHRSettings = __webpack_require__(/*! ./MergeXHRSettings */ "../../../src/loader/MergeXHRSettings.js");

/**
 * Creates a new XMLHttpRequest (xhr) object based on the given File and XHRSettings
 * and starts the download of it. It uses the Files own XHRSettings and merges them
 * with the global XHRSettings object to set the xhr values before download.
 *
 * @function Phaser.Loader.XHRLoader
 * @since 3.0.0
 *
 * @param {Phaser.Loader.File} file - The File to download.
 * @param {XHRSettingsObject} globalXHRSettings - The global XHRSettings object.
 *
 * @return {XMLHttpRequest} The XHR object.
 */
var XHRLoader = function (file, globalXHRSettings)
{
    var config = MergeXHRSettings(globalXHRSettings, file.xhrSettings);

    var xhr = new XMLHttpRequest();

    xhr.open('GET', file.src, config.async, config.user, config.password);

    xhr.responseType = file.xhrSettings.responseType;
    xhr.timeout = config.timeout;

    if (config.header && config.headerValue)
    {
        xhr.setRequestHeader(config.header, config.headerValue);
    }

    if (config.requestedWith)
    {
        xhr.setRequestHeader('X-Requested-With', config.requestedWith);
    }

    if (config.overrideMimeType)
    {
        xhr.overrideMimeType(config.overrideMimeType);
    }

    // After a successful request, the xhr.response property will contain the requested data as a DOMString, ArrayBuffer, Blob, or Document (depending on what was set for responseType.)

    xhr.onload = file.onLoad.bind(file, xhr);
    xhr.onerror = file.onError.bind(file);
    xhr.onprogress = file.onProgress.bind(file);

    //  This is the only standard method, the ones above are browser additions (maybe not universal?)
    // xhr.onreadystatechange

    xhr.send();

    return xhr;
};

module.exports = XHRLoader;


/***/ }),

/***/ "../../../src/loader/XHRSettings.js":
/*!****************************************************!*\
  !*** D:/wamp/www/phaser/src/loader/XHRSettings.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} XHRSettingsObject
 *
 * @property {XMLHttpRequestResponseType} responseType - The response type of the XHR request, i.e. `blob`, `text`, etc.
 * @property {boolean} [async=true] - Should the XHR request use async or not?
 * @property {string} [user=''] - Optional username for the XHR request.
 * @property {string} [password=''] - Optional password for the XHR request.
 * @property {integer} [timeout=0] - Optional XHR timeout value.
 * @property {(string|undefined)} [header] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [headerValue] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [requestedWith] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [overrideMimeType] - Provide a custom mime-type to use instead of the default.
 */

/**
 * Creates an XHRSettings Object with default values.
 *
 * @function Phaser.Loader.XHRSettings
 * @since 3.0.0
 *
 * @param {XMLHttpRequestResponseType} [responseType=''] - The responseType, such as 'text'.
 * @param {boolean} [async=true] - Should the XHR request use async or not?
 * @param {string} [user=''] - Optional username for the XHR request.
 * @param {string} [password=''] - Optional password for the XHR request.
 * @param {integer} [timeout=0] - Optional XHR timeout value.
 *
 * @return {XHRSettingsObject} The XHRSettings object as used by the Loader.
 */
var XHRSettings = function (responseType, async, user, password, timeout)
{
    if (responseType === undefined) { responseType = ''; }
    if (async === undefined) { async = true; }
    if (user === undefined) { user = ''; }
    if (password === undefined) { password = ''; }
    if (timeout === undefined) { timeout = 0; }

    // Before sending a request, set the xhr.responseType to "text",
    // "arraybuffer", "blob", or "document", depending on your data needs.
    // Note, setting xhr.responseType = '' (or omitting) will default the response to "text".

    return {

        //  Ignored by the Loader, only used by File.
        responseType: responseType,

        async: async,

        //  credentials
        user: user,
        password: password,

        //  timeout in ms (0 = no timeout)
        timeout: timeout,

        //  setRequestHeader
        header: undefined,
        headerValue: undefined,
        requestedWith: false,

        //  overrideMimeType
        overrideMimeType: undefined

    };
};

module.exports = XHRSettings;


/***/ }),

/***/ "../../../src/loader/const.js":
/*!**********************************************!*\
  !*** D:/wamp/www/phaser/src/loader/const.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FILE_CONST = {

    /**
     * The Loader is idle.
     * 
     * @name Phaser.Loader.LOADER_IDLE
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_IDLE: 0,

    /**
     * The Loader is actively loading.
     * 
     * @name Phaser.Loader.LOADER_LOADING
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_LOADING: 1,

    /**
     * The Loader is processing files is has loaded.
     * 
     * @name Phaser.Loader.LOADER_PROCESSING
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_PROCESSING: 2,

    /**
     * The Loader has completed loading and processing.
     * 
     * @name Phaser.Loader.LOADER_COMPLETE
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_COMPLETE: 3,

    /**
     * The Loader is shutting down.
     * 
     * @name Phaser.Loader.LOADER_SHUTDOWN
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_SHUTDOWN: 4,

    /**
     * The Loader has been destroyed.
     * 
     * @name Phaser.Loader.LOADER_DESTROYED
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_DESTROYED: 5,

    /**
     * File is in the load queue but not yet started
     * 
     * @name Phaser.Loader.FILE_PENDING
     * @type {integer}
     * @since 3.0.0
     */
    FILE_PENDING: 10,

    /**
     * File has been started to load by the loader (onLoad called)
     * 
     * @name Phaser.Loader.FILE_LOADING
     * @type {integer}
     * @since 3.0.0
     */
    FILE_LOADING: 11,

    /**
     * File has loaded successfully, awaiting processing    
     * 
     * @name Phaser.Loader.FILE_LOADED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_LOADED: 12,

    /**
     * File failed to load
     * 
     * @name Phaser.Loader.FILE_FAILED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_FAILED: 13,

    /**
     * File is being processed (onProcess callback)
     * 
     * @name Phaser.Loader.FILE_PROCESSING
     * @type {integer}
     * @since 3.0.0
     */
    FILE_PROCESSING: 14,

    /**
     * The File has errored somehow during processing.
     * 
     * @name Phaser.Loader.FILE_ERRORED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_ERRORED: 16,

    /**
     * File has finished processing.
     * 
     * @name Phaser.Loader.FILE_COMPLETE
     * @type {integer}
     * @since 3.0.0
     */
    FILE_COMPLETE: 17,

    /**
     * File has been destroyed
     * 
     * @name Phaser.Loader.FILE_DESTROYED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_DESTROYED: 18,

    /**
     * File was populated from local data and doesn't need an HTTP request
     * 
     * @name Phaser.Loader.FILE_POPULATED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_POPULATED: 19

};

module.exports = FILE_CONST;


/***/ }),

/***/ "../../../src/loader/filetypes/ImageFile.js":
/*!************************************************************!*\
  !*** D:/wamp/www/phaser/src/loader/filetypes/ImageFile.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(/*! ../../utils/Class */ "../../../src/utils/Class.js");
var CONST = __webpack_require__(/*! ../const */ "../../../src/loader/const.js");
var File = __webpack_require__(/*! ../File */ "../../../src/loader/File.js");
var FileTypesManager = __webpack_require__(/*! ../FileTypesManager */ "../../../src/loader/FileTypesManager.js");
var GetFastValue = __webpack_require__(/*! ../../utils/object/GetFastValue */ "../../../src/utils/object/GetFastValue.js");
var IsPlainObject = __webpack_require__(/*! ../../utils/object/IsPlainObject */ "../../../src/utils/object/IsPlainObject.js");

/**
 * @typedef {object} Phaser.Loader.FileTypes.ImageFrameConfig
 *
 * @property {integer} frameWidth - The width of the frame in pixels.
 * @property {integer} [frameHeight] - The height of the frame in pixels. Uses the `frameWidth` value if not provided.
 * @property {integer} [startFrame=0] - The first frame to start parsing from.
 * @property {integer} [endFrame] - The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
 * @property {integer} [margin=0] - The margin in the image. This is the space around the edge of the frames.
 * @property {integer} [spacing=0] - The spacing between each frame in the image.
 */

/**
 * @typedef {object} Phaser.Loader.FileTypes.ImageFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='png'] - The default file extension to use if no url is provided.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the image.
 * @property {Phaser.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */

/**
 * @classdesc
 * A single Image File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#image method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#image.
 *
 * @class ImageFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.ImageFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {Phaser.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
 */
var ImageFile = new Class({

    Extends: File,

    initialize:

    function ImageFile (loader, key, url, xhrSettings, frameConfig)
    {
        var extension = 'png';
        var normalMapURL;

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            normalMapURL = GetFastValue(config, 'normalMap');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
            frameConfig = GetFastValue(config, 'frameConfig');
        }

        if (Array.isArray(url))
        {
            normalMapURL = url[1];
            url = url[0];
        }

        var fileConfig = {
            type: 'image',
            cache: loader.textureManager,
            extension: extension,
            responseType: 'blob',
            key: key,
            url: url,
            xhrSettings: xhrSettings,
            config: frameConfig
        };

        File.call(this, loader, fileConfig);

        //  Do we have a normal map to load as well?
        if (normalMapURL)
        {
            var normalMap = new ImageFile(loader, this.key, normalMapURL, xhrSettings, frameConfig);

            normalMap.type = 'normalMap';

            this.setLink(normalMap);

            loader.addFile(normalMap);
        }
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.ImageFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = new Image();

        this.data.crossOrigin = this.crossOrigin;

        var _this = this;

        this.data.onload = function ()
        {
            File.revokeObjectURL(_this.data);

            _this.onProcessComplete();
        };

        this.data.onerror = function ()
        {
            File.revokeObjectURL(_this.data);

            _this.onProcessError();
        };

        File.createObjectURL(this.data, this.xhrLoader.response, 'image/png');
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.ImageFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        var texture;
        var linkFile = this.linkFile;

        if (linkFile && linkFile.state === CONST.FILE_COMPLETE)
        {
            if (this.type === 'image')
            {
                texture = this.cache.addImage(this.key, this.data, linkFile.data);
            }
            else
            {
                texture = this.cache.addImage(linkFile.key, linkFile.data, this.data);
            }

            this.pendingDestroy(texture);

            linkFile.pendingDestroy(texture);
        }
        else if (!linkFile)
        {
            texture = this.cache.addImage(this.key, this.data);

            this.pendingDestroy(texture);
        }
    }

});

/**
 * Adds an Image, or array of Images, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.image('logo', 'images/phaserLogo.png');
 * }
 * ```
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 * 
 * Phaser can load all common image types: png, jpg, gif and any other format the browser can natively handle.
 * If you try to load an animated gif only the first frame will be rendered. Browsers do not natively support playback
 * of animated gifs to Canvas elements.
 *
 * The key must be a unique String. It is used to add the file to the global Texture Manager upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Texture Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Texture Manager first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 * 
 * ```javascript
 * this.load.image({
 *     key: 'logo',
 *     url: 'images/AtariLogo.png'
 * });
 * ```
 *
 * See the documentation for `Phaser.Loader.FileTypes.ImageFileConfig` for more details.
 *
 * Once the file has finished loading you can use it as a texture for a Game Object by referencing its key:
 * 
 * ```javascript
 * this.load.image('logo', 'images/AtariLogo.png');
 * // and later in your game ...
 * this.add.image(x, y, 'logo');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `MENU.` and the key was `Background` the final key will be `MENU.Background` and
 * this is what you would use to retrieve the image from the Texture Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
 * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Phaser also supports the automatic loading of associated normal maps. If you have a normal map to go with this image,
 * then you can specify it by providing an array as the `url` where the second element is the normal map:
 * 
 * ```javascript
 * this.load.image('logo', [ 'images/AtariLogo.png', 'images/AtariLogo-n.png' ]);
 * ```
 *
 * Or, if you are using a config object use the `normalMap` property:
 * 
 * ```javascript
 * this.load.image({
 *     key: 'logo',
 *     url: 'images/AtariLogo.png',
 *     normalMap: 'images/AtariLogo-n.png'
 * });
 * ```
 *
 * The normal map file is subject to the same conditions as the image file with regard to the path, baseURL, CORs and XHR Settings.
 * Normal maps are a WebGL only feature.
 *
 * Note: The ability to load this type of file will only be available if the Image File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#image
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.0.0
 *
 * @param {(string|Phaser.Loader.FileTypes.ImageFileConfig|Phaser.Loader.FileTypes.ImageFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string|string[]} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('image', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new ImageFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new ImageFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = ImageFile;


/***/ }),

/***/ "../../../src/loader/filetypes/JSONFile.js":
/*!***********************************************************!*\
  !*** D:/wamp/www/phaser/src/loader/filetypes/JSONFile.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(/*! ../../utils/Class */ "../../../src/utils/Class.js");
var CONST = __webpack_require__(/*! ../const */ "../../../src/loader/const.js");
var File = __webpack_require__(/*! ../File */ "../../../src/loader/File.js");
var FileTypesManager = __webpack_require__(/*! ../FileTypesManager */ "../../../src/loader/FileTypesManager.js");
var GetFastValue = __webpack_require__(/*! ../../utils/object/GetFastValue */ "../../../src/utils/object/GetFastValue.js");
var GetValue = __webpack_require__(/*! ../../utils/object/GetValue */ "../../../src/utils/object/GetValue.js");
var IsPlainObject = __webpack_require__(/*! ../../utils/object/IsPlainObject */ "../../../src/utils/object/IsPlainObject.js");

/**
 * @typedef {object} Phaser.Loader.FileTypes.JSONFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the JSON Cache.
 * @property {string|any} [url] - The absolute or relative URL to load the file from. Or can be a ready formed JSON object, in which case it will be directly added to the Cache.
 * @property {string} [extension='json'] - The default file extension to use if no url is provided.
 * @property {string} [dataKey] - If specified instead of the whole JSON file being parsed and added to the Cache, only the section corresponding to this property key will be added. If the property you want to extract is nested, use periods to divide it.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */

/**
 * @classdesc
 * A single JSON File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#json method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#json.
 *
 * @class JSONFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.JSONFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {string} [dataKey] - When the JSON file loads only this property will be stored in the Cache.
 */
var JSONFile = new Class({

    Extends: File,

    initialize:

    //  url can either be a string, in which case it is treated like a proper url, or an object, in which case it is treated as a ready-made JS Object
    //  dataKey allows you to pluck a specific object out of the JSON and put just that into the cache, rather than the whole thing

    function JSONFile (loader, key, url, xhrSettings, dataKey)
    {
        var extension = 'json';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
            dataKey = GetFastValue(config, 'dataKey', dataKey);
        }

        var fileConfig = {
            type: 'json',
            cache: loader.cacheManager.json,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            xhrSettings: xhrSettings,
            config: dataKey
        };

        File.call(this, loader, fileConfig);

        if (IsPlainObject(url))
        {
            //  Object provided instead of a URL, so no need to actually load it (populate data with value)
            if (dataKey)
            {
                this.data = GetValue(url, dataKey);
            }
            else
            {
                this.data = url;
            }

            this.state = CONST.FILE_POPULATED;
        }
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.JSONFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        if (this.state !== CONST.FILE_POPULATED)
        {
            this.state = CONST.FILE_PROCESSING;

            var json = JSON.parse(this.xhrLoader.responseText);

            var key = this.config;

            if (typeof key === 'string')
            {
                this.data = GetValue(json, key, json);
            }
            else
            {
                this.data = json;
            }
        }

        this.onProcessComplete();
    }

});

/**
 * Adds a JSON file, or array of JSON files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.json('wavedata', 'files/AlienWaveData.json');
 * }
 * ```
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 * 
 * The key must be a unique String. It is used to add the file to the global JSON Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the JSON Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the JSON Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 * 
 * ```javascript
 * this.load.json({
 *     key: 'wavedata',
 *     url: 'files/AlienWaveData.json'
 * });
 * ```
 *
 * See the documentation for `Phaser.Loader.FileTypes.JSONFileConfig` for more details.
 *
 * Once the file has finished loading you can access it from its Cache using its key:
 * 
 * ```javascript
 * this.load.json('wavedata', 'files/AlienWaveData.json');
 * // and later in your game ...
 * var data = this.cache.json.get('wavedata');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Waves` the final key will be `LEVEL1.Waves` and
 * this is what you would use to retrieve the text from the JSON Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "data"
 * and no URL is given then the Loader will set the URL to be "data.json". It will always add `.json` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * You can also optionally provide a `dataKey` to use. This allows you to extract only a part of the JSON and store it in the Cache,
 * rather than the whole file. For example, if your JSON data had a structure like this:
 * 
 * ```json
 * {
 *     "level1": {
 *         "baddies": {
 *             "aliens": {},
 *             "boss": {}
 *         }
 *     },
 *     "level2": {},
 *     "level3": {}
 * }
 * ```
 *
 * And you only wanted to store the `boss` data in the Cache, then you could pass `level1.baddies.boss`as the `dataKey`.
 *
 * Note: The ability to load this type of file will only be available if the JSON File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#json
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.0.0
 *
 * @param {(string|Phaser.Loader.FileTypes.JSONFileConfig|Phaser.Loader.FileTypes.JSONFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {string} [dataKey] - When the JSON file loads only this property will be stored in the Cache.
 * @param {XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('json', function (key, url, dataKey, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new JSONFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new JSONFile(this, key, url, xhrSettings, dataKey));
    }

    return this;
});

module.exports = JSONFile;


/***/ }),

/***/ "../../../src/loader/filetypes/TextFile.js":
/*!***********************************************************!*\
  !*** D:/wamp/www/phaser/src/loader/filetypes/TextFile.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(/*! ../../utils/Class */ "../../../src/utils/Class.js");
var CONST = __webpack_require__(/*! ../const */ "../../../src/loader/const.js");
var File = __webpack_require__(/*! ../File */ "../../../src/loader/File.js");
var FileTypesManager = __webpack_require__(/*! ../FileTypesManager */ "../../../src/loader/FileTypesManager.js");
var GetFastValue = __webpack_require__(/*! ../../utils/object/GetFastValue */ "../../../src/utils/object/GetFastValue.js");
var IsPlainObject = __webpack_require__(/*! ../../utils/object/IsPlainObject */ "../../../src/utils/object/IsPlainObject.js");

/**
 * @typedef {object} Phaser.Loader.FileTypes.TextFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Text Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='txt'] - The default file extension to use if no url is provided.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */

/**
 * @classdesc
 * A single Text File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#text method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#text.
 *
 * @class TextFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.TextFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var TextFile = new Class({

    Extends: File,

    initialize:

    function TextFile (loader, key, url, xhrSettings)
    {
        var extension = 'txt';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }

        var fileConfig = {
            type: 'text',
            cache: loader.cacheManager.text,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            xhrSettings: xhrSettings
        };

        File.call(this, loader, fileConfig);
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.TextFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = this.xhrLoader.responseText;

        this.onProcessComplete();
    }

});

/**
 * Adds a Text file, or array of Text files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.text('story', 'files/IntroStory.txt');
 * }
 * ```
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 *
 * The key must be a unique String. It is used to add the file to the global Text Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Text Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Text Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.text({
 *     key: 'story',
 *     url: 'files/IntroStory.txt'
 * });
 * ```
 *
 * See the documentation for `Phaser.Loader.FileTypes.TextFileConfig` for more details.
 *
 * Once the file has finished loading you can access it from its Cache using its key:
 *
 * ```javascript
 * this.load.text('story', 'files/IntroStory.txt');
 * // and later in your game ...
 * var data = this.cache.text.get('story');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Story` the final key will be `LEVEL1.Story` and
 * this is what you would use to retrieve the text from the Text Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "story"
 * and no URL is given then the Loader will set the URL to be "story.txt". It will always add `.txt` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the Text File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#text
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.0.0
 *
 * @param {(string|Phaser.Loader.FileTypes.TextFileConfig|Phaser.Loader.FileTypes.TextFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
 * @param {XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('text', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new TextFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new TextFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = TextFile;


/***/ }),

/***/ "../../../src/plugins/BasePlugin.js":
/*!****************************************************!*\
  !*** D:/wamp/www/phaser/src/plugins/BasePlugin.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2018 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var Class = __webpack_require__(/*! ../utils/Class */ "../../../src/utils/Class.js");

/**
 * @classdesc
 * A Global Plugin is installed just once into the Game owned Plugin Manager.
 * It can listen for Game events and respond to them.
 *
 * @class BasePlugin
 * @memberof Phaser.Plugins
 * @constructor
 * @since 3.8.0
 *
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Plugin Manager.
 */
var BasePlugin = new Class({

    initialize:

    function BasePlugin (pluginManager)
    {
        /**
         * A handy reference to the Plugin Manager that is responsible for this plugin.
         * Can be used as a route to gain access to game systems and  events.
         *
         * @name Phaser.Plugins.BasePlugin#pluginManager
         * @type {Phaser.Plugins.PluginManager}
         * @protected
         * @since 3.8.0
         */
        this.pluginManager = pluginManager;

        /**
         * A reference to the Game instance this plugin is running under.
         *
         * @name Phaser.Plugins.BasePlugin#game
         * @type {Phaser.Game}
         * @protected
         * @since 3.8.0
         */
        this.game = pluginManager.game;

        /**
         * A reference to the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You cannot use it during the `init` method, but you can during the `boot` method.
         *
         * @name Phaser.Plugins.BasePlugin#scene
         * @type {?Phaser.Scene}
         * @protected
         * @since 3.8.0
         */
        this.scene;

        /**
         * A reference to the Scene Systems of the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You cannot use it during the `init` method, but you can during the `boot` method.
         *
         * @name Phaser.Plugins.BasePlugin#systems
         * @type {?Phaser.Scenes.Systems}
         * @protected
         * @since 3.8.0
         */
        this.systems;
    },

    /**
     * Called by the PluginManager when this plugin is first instantiated.
     * It will never be called again on this instance.
     * In here you can set-up whatever you need for this plugin to run.
     * If a plugin is set to automatically start then `BasePlugin.start` will be called immediately after this.
     *
     * @method Phaser.Plugins.BasePlugin#init
     * @since 3.8.0
     *
     * @param {?any} [data] - A value specified by the user, if any, from the `data` property of the plugin's configuration object (if started at game boot) or passed in the PluginManager's `install` method (if started manually).
     */
    init: function ()
    {
    },

    /**
     * Called by the PluginManager when this plugin is started.
     * If a plugin is stopped, and then started again, this will get called again.
     * Typically called immediately after `BasePlugin.init`.
     *
     * @method Phaser.Plugins.BasePlugin#start
     * @since 3.8.0
     */
    start: function ()
    {
        //  Here are the game-level events you can listen to.
        //  At the very least you should offer a destroy handler for when the game closes down.

        // var eventEmitter = this.game.events;

        // eventEmitter.once('destroy', this.gameDestroy, this);
        // eventEmitter.on('pause', this.gamePause, this);
        // eventEmitter.on('resume', this.gameResume, this);
        // eventEmitter.on('resize', this.gameResize, this);
        // eventEmitter.on('prestep', this.gamePreStep, this);
        // eventEmitter.on('step', this.gameStep, this);
        // eventEmitter.on('poststep', this.gamePostStep, this);
        // eventEmitter.on('prerender', this.gamePreRender, this);
        // eventEmitter.on('postrender', this.gamePostRender, this);
    },

    /**
     * Called by the PluginManager when this plugin is stopped.
     * The game code has requested that your plugin stop doing whatever it does.
     * It is now considered as 'inactive' by the PluginManager.
     * Handle that process here (i.e. stop listening for events, etc)
     * If the plugin is started again then `BasePlugin.start` will be called again.
     *
     * @method Phaser.Plugins.BasePlugin#stop
     * @since 3.8.0
     */
    stop: function ()
    {
    },

    /**
     * If this is a Scene Plugin (i.e. installed into a Scene) then this method is called when the Scene boots.
     * By this point the plugin properties `scene` and `systems` will have already been set.
     * In here you can listen for Scene events and set-up whatever you need for this plugin to run.
     *
     * @method Phaser.Plugins.BasePlugin#boot
     * @since 3.8.0
     */
    boot: function ()
    {
        //  Here are the Scene events you can listen to.
        //  At the very least you should offer a destroy handler for when the Scene closes down.

        // var eventEmitter = this.systems.events;

        // eventEmitter.once('destroy', this.sceneDestroy, this);
        // eventEmitter.on('start', this.sceneStart, this);
        // eventEmitter.on('preupdate', this.scenePreUpdate, this);
        // eventEmitter.on('update', this.sceneUpdate, this);
        // eventEmitter.on('postupdate', this.scenePostUpdate, this);
        // eventEmitter.on('pause', this.scenePause, this);
        // eventEmitter.on('resume', this.sceneResume, this);
        // eventEmitter.on('sleep', this.sceneSleep, this);
        // eventEmitter.on('wake', this.sceneWake, this);
        // eventEmitter.on('shutdown', this.sceneShutdown, this);
        // eventEmitter.on('destroy', this.sceneDestroy, this);
    },

    /**
     * Game instance has been destroyed.
     * You must release everything in here, all references, all objects, free it all up.
     *
     * @method Phaser.Plugins.BasePlugin#destroy
     * @since 3.8.0
     */
    destroy: function ()
    {
        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;
    }

});

module.exports = BasePlugin;


/***/ }),

/***/ "../../../src/plugins/ScenePlugin.js":
/*!*****************************************************!*\
  !*** D:/wamp/www/phaser/src/plugins/ScenePlugin.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2018 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var BasePlugin = __webpack_require__(/*! ./BasePlugin */ "../../../src/plugins/BasePlugin.js");
var Class = __webpack_require__(/*! ../utils/Class */ "../../../src/utils/Class.js");

/**
 * @classdesc
 * A Scene Level Plugin is installed into every Scene and belongs to that Scene.
 * It can listen for Scene events and respond to them.
 * It can map itself to a Scene property, or into the Scene Systems, or both.
 *
 * @class ScenePlugin
 * @memberof Phaser.Plugins
 * @extends Phaser.Plugins.BasePlugin
 * @constructor
 * @since 3.8.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Plugin Manager.
 */
var ScenePlugin = new Class({

    Extends: BasePlugin,

    initialize:

    function ScenePlugin (scene, pluginManager)
    {
        BasePlugin.call(this, pluginManager);

        this.scene = scene;
        this.systems = scene.sys;

        scene.sys.events.once('boot', this.boot, this);
    },

    /**
     * This method is called when the Scene boots. It is only ever called once.
     * 
     * By this point the plugin properties `scene` and `systems` will have already been set.
     * 
     * In here you can listen for Scene events and set-up whatever you need for this plugin to run.
     * Here are the Scene events you can listen to:
     * 
     * start
     * ready
     * preupdate
     * update
     * postupdate
     * resize
     * pause
     * resume
     * sleep
     * wake
     * transitioninit
     * transitionstart
     * transitioncomplete
     * transitionout
     * shutdown
     * destroy
     * 
     * At the very least you should offer a destroy handler for when the Scene closes down, i.e:
     *
     * ```javascript
     * var eventEmitter = this.systems.events;
     * eventEmitter.once('destroy', this.sceneDestroy, this);
     * ```
     *
     * @method Phaser.Plugins.ScenePlugin#boot
     * @since 3.8.0
     */
    boot: function ()
    {
    }

});

module.exports = ScenePlugin;


/***/ }),

/***/ "../../../src/utils/Class.js":
/*!*********************************************!*\
  !*** D:/wamp/www/phaser/src/utils/Class.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Taken from klasse by mattdesl https://github.com/mattdesl/klasse

function hasGetterOrSetter (def)
{
    return (!!def.get && typeof def.get === 'function') || (!!def.set && typeof def.set === 'function');
}

function getProperty (definition, k, isClassDescriptor)
{
    //  This may be a lightweight object, OR it might be a property that was defined previously.

    //  For simple class descriptors we can just assume its NOT previously defined.
    var def = (isClassDescriptor) ? definition[k] : Object.getOwnPropertyDescriptor(definition, k);

    if (!isClassDescriptor && def.value && typeof def.value === 'object')
    {
        def = def.value;
    }

    //  This might be a regular property, or it may be a getter/setter the user defined in a class.
    if (def && hasGetterOrSetter(def))
    {
        if (typeof def.enumerable === 'undefined')
        {
            def.enumerable = true;
        }

        if (typeof def.configurable === 'undefined')
        {
            def.configurable = true;
        }

        return def;
    }
    else
    {
        return false;
    }
}

function hasNonConfigurable (obj, k)
{
    var prop = Object.getOwnPropertyDescriptor(obj, k);

    if (!prop)
    {
        return false;
    }

    if (prop.value && typeof prop.value === 'object')
    {
        prop = prop.value;
    }

    if (prop.configurable === false)
    {
        return true;
    }

    return false;
}

function extend (ctor, definition, isClassDescriptor, extend)
{
    for (var k in definition)
    {
        if (!definition.hasOwnProperty(k))
        {
            continue;
        }

        var def = getProperty(definition, k, isClassDescriptor);

        if (def !== false)
        {
            //  If Extends is used, we will check its prototype to see if the final variable exists.

            var parent = extend || ctor;

            if (hasNonConfigurable(parent.prototype, k))
            {
                //  Just skip the final property
                if (Class.ignoreFinals)
                {
                    continue;
                }

                //  We cannot re-define a property that is configurable=false.
                //  So we will consider them final and throw an error. This is by
                //  default so it is clear to the developer what is happening.
                //  You can set ignoreFinals to true if you need to extend a class
                //  which has configurable=false; it will simply not re-define final properties.
                throw new Error('cannot override final property \'' + k + '\', set Class.ignoreFinals = true to skip');
            }

            Object.defineProperty(ctor.prototype, k, def);
        }
        else
        {
            ctor.prototype[k] = definition[k];
        }
    }
}

function mixin (myClass, mixins)
{
    if (!mixins)
    {
        return;
    }

    if (!Array.isArray(mixins))
    {
        mixins = [ mixins ];
    }

    for (var i = 0; i < mixins.length; i++)
    {
        extend(myClass, mixins[i].prototype || mixins[i]);
    }
}

/**
 * Creates a new class with the given descriptor.
 * The constructor, defined by the name `initialize`,
 * is an optional function. If unspecified, an anonymous
 * function will be used which calls the parent class (if
 * one exists).
 *
 * You can also use `Extends` and `Mixins` to provide subclassing
 * and inheritance.
 *
 * @class  Class
 * @constructor
 * @param {Object} definition a dictionary of functions for the class
 * @example
 *
 *      var MyClass = new Phaser.Class({
 *
 *          initialize: function() {
 *              this.foo = 2.0;
 *          },
 *
 *          bar: function() {
 *              return this.foo + 5;
 *          }
 *      });
 */
function Class (definition)
{
    if (!definition)
    {
        definition = {};
    }

    //  The variable name here dictates what we see in Chrome debugger
    var initialize;
    var Extends;

    if (definition.initialize)
    {
        if (typeof definition.initialize !== 'function')
        {
            throw new Error('initialize must be a function');
        }

        initialize = definition.initialize;

        //  Usually we should avoid 'delete' in V8 at all costs.
        //  However, its unlikely to make any performance difference
        //  here since we only call this on class creation (i.e. not object creation).
        delete definition.initialize;
    }
    else if (definition.Extends)
    {
        var base = definition.Extends;

        initialize = function ()
        {
            base.apply(this, arguments);
        };
    }
    else
    {
        initialize = function () {};
    }

    if (definition.Extends)
    {
        initialize.prototype = Object.create(definition.Extends.prototype);
        initialize.prototype.constructor = initialize;

        //  For getOwnPropertyDescriptor to work, we need to act directly on the Extends (or Mixin)

        Extends = definition.Extends;

        delete definition.Extends;
    }
    else
    {
        initialize.prototype.constructor = initialize;
    }

    //  Grab the mixins, if they are specified...
    var mixins = null;

    if (definition.Mixins)
    {
        mixins = definition.Mixins;
        delete definition.Mixins;
    }

    //  First, mixin if we can.
    mixin(initialize, mixins);

    //  Now we grab the actual definition which defines the overrides.
    extend(initialize, definition, true, Extends);

    return initialize;
}

Class.extend = extend;
Class.mixin = mixin;
Class.ignoreFinals = false;

module.exports = Class;


/***/ }),

/***/ "../../../src/utils/object/Extend.js":
/*!*****************************************************!*\
  !*** D:/wamp/www/phaser/src/utils/object/Extend.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var IsPlainObject = __webpack_require__(/*! ./IsPlainObject */ "../../../src/utils/object/IsPlainObject.js");

// @param {boolean} deep - Perform a deep copy?
// @param {object} target - The target object to copy to.
// @return {object} The extended object.

/**
 * This is a slightly modified version of http://api.jquery.com/jQuery.extend/
 *
 * @function Phaser.Utils.Objects.Extend
 * @since 3.0.0
 *
 * @return {object} The extended object.
 */
var Extend = function ()
{
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean')
    {
        deep = target;
        target = arguments[1] || {};

        // skip the boolean and the target
        i = 2;
    }

    // extend Phaser if only one argument is passed
    if (length === i)
    {
        target = this;
        --i;
    }

    for (; i < length; i++)
    {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null)
        {
            // Extend the base object
            for (name in options)
            {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy)
                {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (IsPlainObject(copy) || (copyIsArray = Array.isArray(copy))))
                {
                    if (copyIsArray)
                    {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    }
                    else
                    {
                        clone = src && IsPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = Extend(deep, clone, copy);

                // Don't bring in undefined values
                }
                else if (copy !== undefined)
                {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

module.exports = Extend;


/***/ }),

/***/ "../../../src/utils/object/GetFastValue.js":
/*!***********************************************************!*\
  !*** D:/wamp/www/phaser/src/utils/object/GetFastValue.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Finds the key within the top level of the {@link source} object, or returns {@link defaultValue}
 *
 * @function Phaser.Utils.Objects.GetFastValue
 * @since 3.0.0
 *
 * @param {object} source - The object to search
 * @param {string} key - The key for the property on source. Must exist at the top level of the source object (no periods)
 * @param {*} [defaultValue] - The default value to use if the key does not exist.
 *
 * @return {*} The value if found; otherwise, defaultValue (null if none provided)
 */
var GetFastValue = function (source, key, defaultValue)
{
    var t = typeof(source);

    if (!source || t === 'number' || t === 'string')
    {
        return defaultValue;
    }
    else if (source.hasOwnProperty(key) && source[key] !== undefined)
    {
        return source[key];
    }
    else
    {
        return defaultValue;
    }
};

module.exports = GetFastValue;


/***/ }),

/***/ "../../../src/utils/object/GetValue.js":
/*!*******************************************************!*\
  !*** D:/wamp/www/phaser/src/utils/object/GetValue.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Source object
//  The key as a string, or an array of keys, i.e. 'banner', or 'banner.hideBanner'
//  The default value to use if the key doesn't exist

/**
 * Retrieves a value from an object.
 *
 * @function Phaser.Utils.Objects.GetValue
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`) - `banner.hideBanner` would return the value of the `hideBanner` property from the object stored in the `banner` property of the `source` object.
 * @param {*} defaultValue - The value to return if the `key` isn't found in the `source` object.
 *
 * @return {*} The value of the requested key.
 */
var GetValue = function (source, key, defaultValue)
{
    if (!source || typeof source === 'number')
    {
        return defaultValue;
    }
    else if (source.hasOwnProperty(key))
    {
        return source[key];
    }
    else if (key.indexOf('.'))
    {
        var keys = key.split('.');
        var parent = source;
        var value = defaultValue;

        //  Use for loop here so we can break early
        for (var i = 0; i < keys.length; i++)
        {
            if (parent.hasOwnProperty(keys[i]))
            {
                //  Yes it has a key property, let's carry on down
                value = parent[keys[i]];

                parent = parent[keys[i]];
            }
            else
            {
                //  Can't go any further, so reset to default
                value = defaultValue;
                break;
            }
        }

        return value;
    }
    else
    {
        return defaultValue;
    }
};

module.exports = GetValue;


/***/ }),

/***/ "../../../src/utils/object/IsPlainObject.js":
/*!************************************************************!*\
  !*** D:/wamp/www/phaser/src/utils/object/IsPlainObject.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * This is a slightly modified version of jQuery.isPlainObject.
 * A plain object is an object whose internal class property is [object Object].
 *
 * @function Phaser.Utils.Objects.IsPlainObject
 * @since 3.0.0
 *
 * @param {object} obj - The object to inspect.
 *
 * @return {boolean} `true` if the object is plain, otherwise `false`.
 */
var IsPlainObject = function (obj)
{
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if (typeof(obj) !== 'object' || obj.nodeType || obj === obj.window)
    {
        return false;
    }

    // Support: Firefox <20
    // The try/catch suppresses exceptions thrown when attempting to access
    // the "constructor" property of certain host objects, ie. |window.location|
    // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
    try
    {
        if (obj.constructor && !({}).hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf'))
        {
            return false;
        }
    }
    catch (e)
    {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};

module.exports = IsPlainObject;


/***/ }),

/***/ "./Skeleton.js":
/*!*********************!*\
  !*** ./Skeleton.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(/*! ../../../src/utils/Class */ "../../../src/utils/Class.js");

/**
 * @classdesc
 * TODO
 *
 * @class Skeleton
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var Skeleton = new Class({

    initialize:

    function Skeleton ()
    {
    },

});

module.exports = Skeleton;


/***/ }),

/***/ "./SpineFile.js":
/*!**********************!*\
  !*** ./SpineFile.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(/*! ../../../src/utils/Class */ "../../../src/utils/Class.js");
var GetFastValue = __webpack_require__(/*! ../../../src/utils/object/GetFastValue */ "../../../src/utils/object/GetFastValue.js");
var ImageFile = __webpack_require__(/*! ../../../src/loader/filetypes/ImageFile.js */ "../../../src/loader/filetypes/ImageFile.js");
var IsPlainObject = __webpack_require__(/*! ../../../src/utils/object/IsPlainObject */ "../../../src/utils/object/IsPlainObject.js");
var JSONFile = __webpack_require__(/*! ../../../src/loader/filetypes/JSONFile.js */ "../../../src/loader/filetypes/JSONFile.js");
var MultiFile = __webpack_require__(/*! ../../../src/loader/MultiFile.js */ "../../../src/loader/MultiFile.js");
var TextFile = __webpack_require__(/*! ../../../src/loader/filetypes/TextFile.js */ "../../../src/loader/filetypes/TextFile.js");

/**
 * @typedef {object} Phaser.Loader.FileTypes.SpineFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the texture image.
 * @property {string} [atlasURL] - The absolute or relative URL to load the atlas data file from.
 * @property {string} [atlasExtension='txt'] - The default file extension to use for the atlas data if no url is provided.
 * @property {XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas data file.
 */

/**
 * @classdesc
 * A Spine File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#spine method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#spine.
 *
 * @class SpineFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.UnityAtlasFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [textureURL] - The absolute or relative URL to load the texture image file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {string} [atlasURL] - The absolute or relative URL to load the texture atlas data file from. If undefined or `null` it will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
 * @param {XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the atlas image file. Used in replacement of the Loaders default XHR Settings.
 * @param {XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the atlas data file. Used in replacement of the Loaders default XHR Settings.
 */
var SpineFile = new Class({

    Extends: MultiFile,

    initialize:

    function SpineFile (loader, key, jsonURL, atlasURL, jsonXhrSettings, atlasXhrSettings)
    {
        var json;
        var atlas;

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');

            json = new JSONFile(loader, {
                key: key,
                url: GetFastValue(config, 'jsonURL'),
                extension: GetFastValue(config, 'jsonExtension', 'json'),
                xhrSettings: GetFastValue(config, 'jsonXhrSettings')
            });

            atlas = new TextFile(loader, {
                key: key,
                url: GetFastValue(config, 'atlasURL'),
                extension: GetFastValue(config, 'atlasExtension', 'atlas'),
                xhrSettings: GetFastValue(config, 'atlasXhrSettings')
            });
        }
        else
        {
            json = new JSONFile(loader, key, jsonURL, jsonXhrSettings);
            atlas = new TextFile(loader, key, atlasURL, atlasXhrSettings);
        }
        
        atlas.cache = loader.cacheManager.custom.spine;

        MultiFile.call(this, loader, 'spine', key, [ json, atlas ]);
    },

    /**
     * Called by each File when it finishes loading.
     *
     * @method Phaser.Loader.MultiFile#onFileComplete
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} file - The File that has completed processing.
     */
    onFileComplete: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.pending--;

            if (file.type === 'text')
            {
                //  Inspect the data for the files to now load
                var content = file.data.split('\n');

                //  Extract the textures
                var textures = [];

                for (var t = 0; t < content.length; t++)
                {
                    var line = content[t];

                    if (line.trim() === '' && t < content.length - 1)
                    {
                        line = content[t + 1];

                        textures.push(line);
                    }
                }

                var config = this.config;
                var loader = this.loader;

                var currentBaseURL = loader.baseURL;
                var currentPath = loader.path;
                var currentPrefix = loader.prefix;

                var baseURL = GetFastValue(config, 'baseURL', currentBaseURL);
                var path = GetFastValue(config, 'path', currentPath);
                var prefix = GetFastValue(config, 'prefix', currentPrefix);
                var textureXhrSettings = GetFastValue(config, 'textureXhrSettings');

                loader.setBaseURL(baseURL);
                loader.setPath(path);
                loader.setPrefix(prefix);

                for (var i = 0; i < textures.length; i++)
                {
                    var textureURL = textures[i];

                    var key = '_SP_' + textureURL;

                    var image = new ImageFile(loader, key, textureURL, textureXhrSettings);

                    this.addToMultiFile(image);

                    loader.addFile(image);
                }

                //  Reset the loader settings
                loader.setBaseURL(currentBaseURL);
                loader.setPath(currentPath);
                loader.setPrefix(currentPrefix);
            }
        }
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.SpineFile#addToCache
     * @since 3.16.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var fileJSON = this.files[0];

            fileJSON.addToCache();

            var fileText = this.files[1];

            fileText.addToCache();

            for (var i = 2; i < this.files.length; i++)
            {
                var file = this.files[i];

                var key = file.key.substr(4).trim();

                this.loader.textureManager.addImage(key, file.data);

                file.pendingDestroy();
            }

            this.complete = true;
        }
    }

});

/**
 * Adds a Unity YAML based Texture Atlas, or array of atlases, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.unityAtlas('mainmenu', 'images/MainMenu.png', 'images/MainMenu.txt');
 * }
 * ```
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 * 
 * If you call this from outside of `preload` then you are responsible for starting the Loader afterwards and monitoring
 * its events to know when it's safe to use the asset. Please see the Phaser.Loader.LoaderPlugin class for more details.
 *
 * Phaser expects the atlas data to be provided in a YAML formatted text file as exported from Unity.
 * 
 * Phaser can load all common image types: png, jpg, gif and any other format the browser can natively handle.
 *
 * The key must be a unique String. It is used to add the file to the global Texture Manager upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Texture Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Texture Manager first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 * 
 * ```javascript
 * this.load.unityAtlas({
 *     key: 'mainmenu',
 *     textureURL: 'images/MainMenu.png',
 *     atlasURL: 'images/MainMenu.txt'
 * });
 * ```
 *
 * See the documentation for `Phaser.Loader.FileTypes.SpineFileConfig` for more details.
 *
 * Once the atlas has finished loading you can use frames from it as textures for a Game Object by referencing its key:
 * 
 * ```javascript
 * this.load.unityAtlas('mainmenu', 'images/MainMenu.png', 'images/MainMenu.json');
 * // and later in your game ...
 * this.add.image(x, y, 'mainmenu', 'background');
 * ```
 *
 * To get a list of all available frames within an atlas please consult your Texture Atlas software.
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `MENU.` and the key was `Background` the final key will be `MENU.Background` and
 * this is what you would use to retrieve the image from the Texture Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
 * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Phaser also supports the automatic loading of associated normal maps. If you have a normal map to go with this image,
 * then you can specify it by providing an array as the `url` where the second element is the normal map:
 * 
 * ```javascript
 * this.load.unityAtlas('mainmenu', [ 'images/MainMenu.png', 'images/MainMenu-n.png' ], 'images/MainMenu.txt');
 * ```
 *
 * Or, if you are using a config object use the `normalMap` property:
 * 
 * ```javascript
 * this.load.unityAtlas({
 *     key: 'mainmenu',
 *     textureURL: 'images/MainMenu.png',
 *     normalMap: 'images/MainMenu-n.png',
 *     atlasURL: 'images/MainMenu.txt'
 * });
 * ```
 *
 * The normal map file is subject to the same conditions as the image file with regard to the path, baseURL, CORs and XHR Settings.
 * Normal maps are a WebGL only feature.
 *
 * Note: The ability to load this type of file will only be available if the Unity Atlas File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#spine
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.16.0
 *
 * @param {(string|Phaser.Loader.FileTypes.SpineFileConfig|Phaser.Loader.FileTypes.SpineFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string|string[]} [textureURL] - The absolute or relative URL to load the texture image file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {string} [atlasURL] - The absolute or relative URL to load the texture atlas data file from. If undefined or `null` it will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
 * @param {XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the atlas image file. Used in replacement of the Loaders default XHR Settings.
 * @param {XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the atlas data file. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
FileTypesManager.register('spine', function (key, jsonURL, atlasURL, jsonXhrSettings, atlasXhrSettings)
{
    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new SpineFile(this, key[i]);

            this.addFile(multifile.files);
        }
    }
    else
    {
        multifile = new SpineFile(this, key, jsonURL, atlasURL, jsonXhrSettings, atlasXhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});
 */

module.exports = SpineFile;


/***/ }),

/***/ "./SpinePlugin.js":
/*!************************!*\
  !*** ./SpinePlugin.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(/*! ../../../src/utils/Class */ "../../../src/utils/Class.js");
var ScenePlugin = __webpack_require__(/*! ../../../src/plugins/ScenePlugin */ "../../../src/plugins/ScenePlugin.js");
var Skeleton = __webpack_require__(/*! ./Skeleton */ "./Skeleton.js");
var SpineFile = __webpack_require__(/*! ./SpineFile */ "./SpineFile.js");
var SpineCanvas = __webpack_require__(/*! SpineCanvas */ "./spine-canvas.js");
var SpineWebGL = __webpack_require__(/*! SpineGL */ "./spine-webgl.js");

/**
 * @classdesc
 * TODO
 *
 * @class SpinePlugin
 * @extends Phaser.Plugins.ScenePlugin
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var SpinePlugin = new Class({

    Extends: ScenePlugin,

    initialize:

    function SpinePlugin (scene, pluginManager)
    {
        ScenePlugin.call(this, scene, pluginManager);

        var game = pluginManager.game;

        this.canvas = game.canvas;
        this.context = game.context;

        //  Create a custom cache to store the spine data (.atlas files)
        this.cache = game.cache.addCustom('spine');

        this.json = game.cache.json;

        this.textures = game.textures;

        //  Register our file type
        pluginManager.registerFileType('spine', this.spineFileCallback, scene);

        //  Register our game object
        pluginManager.registerGameObject('spine', this.spineFactory);

        // this.runtime = (game.config.renderType) ? SpineCanvas : SpineWebGL;
    },

    spineFileCallback: function (key, jsonURL, atlasURL, jsonXhrSettings, atlasXhrSettings)
    {
        var multifile;
   
        if (Array.isArray(key))
        {
            for (var i = 0; i < key.length; i++)
            {
                multifile = new SpineFile(this, key[i]);
    
                this.addFile(multifile.files);
            }
        }
        else
        {
            multifile = new SpineFile(this, key, jsonURL, atlasURL, jsonXhrSettings, atlasXhrSettings);

            this.addFile(multifile.files);
        }
        
        return this;
    },

    /**
     * Creates a new Spine Game Object and adds it to the Scene.
     *
     * @method Phaser.GameObjects.GameObjectFactory#spineFactory
     * @since 3.16.0
     * 
     * @param {number} x - The horizontal position of this Game Object.
     * @param {number} y - The vertical position of this Game Object.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.GameObjects.Spine} The Game Object that was created.
     */
    spineFactory: function (x, y, key,)
    {
        // var sprite = new Sprite3D(this.scene, x, y, z, key, frame);

        // this.displayList.add(sprite.gameObject);
        // this.updateList.add(sprite.gameObject);

        // return sprite;
    },

    boot: function ()
    {
        this.canvas = this.game.canvas;

        this.context = this.game.context;

        this.skeletonRenderer = new SpineCanvas.canvas.SkeletonRenderer(this.context);
    },

    createSkeleton: function (key)
    {
        var atlasData = this.cache.get(key);

        if (!atlasData)
        {
            console.warn('No skeleton data for: ' + key);
            return;
        }

        var textures = this.textures;

        var atlas = new SpineCanvas.TextureAtlas(atlasData, function (path)
        {
            return new SpineCanvas.canvas.CanvasTexture(textures.get(path).getSourceImage());
        });

        var atlasLoader = new SpineCanvas.AtlasAttachmentLoader(atlas);
        
        var skeletonJson = new SpineCanvas.SkeletonJson(atlasLoader);

        var skeletonData = skeletonJson.readSkeletonData(this.json.get(key));

        var skeleton = new SpineCanvas.Skeleton(skeletonData);

        skeleton.flipY = true;

        skeleton.setToSetupPose();

        skeleton.updateWorldTransform();

        skeleton.setSkinByName('default');
    
        return skeleton;
    },

    getBounds: function (skeleton)
    {
        var offset = new SpineCanvas.Vector2();
        var size = new SpineCanvas.Vector2();

        skeleton.getBounds(offset, size, []);

        return { offset: offset, size: size };
    },

    createAnimationState: function (skeleton, animationName)
    {
        var state = new SpineCanvas.AnimationState(new SpineCanvas.AnimationStateData(skeleton.data));

        state.setAnimation(0, animationName, true);

        return state;
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Camera3DPlugin#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.off('update', this.update, this);
        eventEmitter.off('shutdown', this.shutdown, this);

        this.removeAll();
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Camera3DPlugin#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;
    }

});

module.exports = SpinePlugin;


/***/ }),

/***/ "./spine-canvas.js":
/*!*************************!*\
  !*** ./spine-canvas.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from D:/wamp/www/phaser/node_modules/exports-loader/index.js):\nError: ENOENT: no such file or directory, open 'D:\\wamp\\www\\phaser\\plugins\\spine\\src\\spine-canvas.js'");

/***/ }),

/***/ "./spine-webgl.js":
/*!************************!*\
  !*** ./spine-webgl.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from D:/wamp/www/phaser/node_modules/exports-loader/index.js):\nError: ENOENT: no such file or directory, open 'D:\\wamp\\www\\phaser\\plugins\\spine\\src\\spine-webgl.js'");

/***/ })

/******/ });
});
//# sourceMappingURL=SpinePlugin.js.map