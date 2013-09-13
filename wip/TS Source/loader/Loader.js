/// <reference path="../_definitions.ts" />
/**
* Phaser - Loader
*
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides for progress and completion callbacks.
*/
var Phaser;
(function (Phaser) {
    var Loader = (function () {
        /**
        * Loader constructor
        *
        * @param game {Phaser.Game} Current game instance.
        */
        function Loader(game) {
            /**
            * The crossOrigin value applied to loaded images
            * @type {string}
            */
            this.crossOrigin = '';
            //  If you want to append a URL before the path of any asset you can set this here.
            //  Useful if you need to allow an asset url to be configured outside of the game code.
            //  MUST have / on the end of it!
            this.baseURL = '';
            this.game = game;
            this._keys = [];
            this._fileList = {
            };
            this._xhr = new XMLHttpRequest();
            this._queueSize = 0;
            this.isLoading = false;
            this.onFileComplete = new Phaser.Signal();
            this.onFileError = new Phaser.Signal();
            this.onLoadStart = new Phaser.Signal();
            this.onLoadComplete = new Phaser.Signal();
        }
        Loader.TEXTURE_ATLAS_JSON_ARRAY = 0;
        Loader.TEXTURE_ATLAS_JSON_HASH = 1;
        Loader.TEXTURE_ATLAS_XML_STARLING = 2;
        Loader.prototype.reset = /**
        * Reset loader, this will remove all loaded assets.
        */
        function () {
            this._queueSize = 0;
            this.isLoading = false;
        };
        Object.defineProperty(Loader.prototype, "queueSize", {
            get: function () {
                return this._queueSize;
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype.image = /**
        * Add a new image asset loading request with key and url.
        * @param key {string} Unique asset key of this image file.
        * @param url {string} URL of image file.
        */
        function (key, url, overwrite) {
            if (typeof overwrite === "undefined") { overwrite = false; }
            if(overwrite == true || this.checkKeyExists(key) == false) {
                this._queueSize++;
                this._fileList[key] = {
                    type: 'image',
                    key: key,
                    url: url,
                    data: null,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.spritesheet = /**
        * Add a new sprite sheet loading request.
        * @param key {string} Unique asset key of the sheet file.
        * @param url {string} URL of sheet file.
        * @param frameWidth {number} Width of each single frame.
        * @param frameHeight {number} Height of each single frame.
        * @param frameMax {number} How many frames in this sprite sheet.
        */
        function (key, url, frameWidth, frameHeight, frameMax) {
            if (typeof frameMax === "undefined") { frameMax = -1; }
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = {
                    type: 'spritesheet',
                    key: key,
                    url: url,
                    data: null,
                    frameWidth: frameWidth,
                    frameHeight: frameHeight,
                    frameMax: frameMax,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.atlas = /**
        * Add a new texture atlas loading request.
        * @param key {string} Unique asset key of the texture atlas file.
        * @param textureURL {string} The url of the texture atlas image file.
        * @param [atlasURL] {string} The url of the texture atlas data file (json/xml)
        * @param [atlasData] {object} A JSON or XML data object.
        * @param [format] {number} A value describing the format of the data.
        */
        function (key, textureURL, atlasURL, atlasData, format) {
            if (typeof atlasURL === "undefined") { atlasURL = null; }
            if (typeof atlasData === "undefined") { atlasData = null; }
            if (typeof format === "undefined") { format = Loader.TEXTURE_ATLAS_JSON_ARRAY; }
            if(this.checkKeyExists(key) === false) {
                if(atlasURL !== null) {
                    //  A URL to a json/xml file has been given
                    this._queueSize++;
                    this._fileList[key] = {
                        type: 'textureatlas',
                        key: key,
                        url: textureURL,
                        atlasURL: atlasURL,
                        data: null,
                        format: format,
                        error: false,
                        loaded: false
                    };
                    this._keys.push(key);
                } else {
                    if(format == Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                        //  A json string or object has been given
                        if(typeof atlasData === 'string') {
                            atlasData = JSON.parse(atlasData);
                        }
                        this._queueSize++;
                        this._fileList[key] = {
                            type: 'textureatlas',
                            key: key,
                            url: textureURL,
                            data: null,
                            atlasURL: null,
                            atlasData: atlasData,
                            format: format,
                            error: false,
                            loaded: false
                        };
                        this._keys.push(key);
                    } else if(format == Loader.TEXTURE_ATLAS_XML_STARLING) {
                        //  An xml string or object has been given
                        if(typeof atlasData === 'string') {
                            var xml;
                            try  {
                                if(window['DOMParser']) {
                                    var domparser = new DOMParser();
                                    xml = domparser.parseFromString(atlasData, "text/xml");
                                } else {
                                    xml = new ActiveXObject("Microsoft.XMLDOM");
                                    xml.async = 'false';
                                    xml.loadXML(atlasData);
                                }
                            } catch (e) {
                                xml = undefined;
                            }
                            if(!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                                throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
                            } else {
                                atlasData = xml;
                            }
                        }
                        this._queueSize++;
                        this._fileList[key] = {
                            type: 'textureatlas',
                            key: key,
                            url: textureURL,
                            data: null,
                            atlasURL: null,
                            atlasData: atlasData,
                            format: format,
                            error: false,
                            loaded: false
                        };
                        this._keys.push(key);
                    }
                }
            }
        };
        Loader.prototype.audio = /**
        * Add a new audio file loading request.
        * @param key {string} Unique asset key of the audio file.
        * @param urls {Array} An array containing the URLs of the audio files, i.e.: [ 'jump.mp3', 'jump.ogg', 'jump.m4a' ]
        * @param autoDecode {bool} When using Web Audio the audio files can either be decoded at load time or run-time. They can't be played until they are decoded, but this let's you control when that happens. Decoding is a non-blocking async process.
        */
        function (key, urls, autoDecode) {
            if (typeof autoDecode === "undefined") { autoDecode = true; }
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = {
                    type: 'audio',
                    key: key,
                    url: urls,
                    data: null,
                    buffer: null,
                    error: false,
                    loaded: false,
                    autoDecode: autoDecode
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.text = /**
        * Add a new text file loading request.
        * @param key {string} Unique asset key of the text file.
        * @param url {string} URL of text file.
        */
        function (key, url) {
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = {
                    type: 'text',
                    key: key,
                    url: url,
                    data: null,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.removeFile = /**
        * Remove loading request of a file.
        * @param key {string} Key of the file you want to remove.
        */
        function (key) {
            delete this._fileList[key];
        };
        Loader.prototype.removeAll = /**
        * Remove all file loading requests.
        */
        function () {
            this._fileList = {
            };
        };
        Loader.prototype.start = /**
        * Load assets.
        */
        function () {
            if(this.isLoading) {
                return;
            }
            this.progress = 0;
            this.hasLoaded = false;
            this.isLoading = true;
            this.onLoadStart.dispatch(this.queueSize);
            if(this._keys.length > 0) {
                this._progressChunk = 100 / this._keys.length;
                this.loadFile();
            } else {
                this.progress = 100;
                this.hasLoaded = true;
                this.onLoadComplete.dispatch();
            }
        };
        Loader.prototype.loadFile = /**
        * Load files. Private method ONLY used by loader.
        */
        function () {
            var _this = this;
            var file = this._fileList[this._keys.pop()];
            //  Image or Data?
            switch(file.type) {
                case 'image':
                case 'spritesheet':
                case 'textureatlas':
                    file.data = new Image();
                    file.data.name = file.key;
                    file.data.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    file.data.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    file.data.crossOrigin = this.crossOrigin;
                    file.data.src = this.baseURL + file.url;
                    break;
                case 'audio':
                    file.url = this.getAudioURL(file.url);
                    if(file.url !== null) {
                        //  WebAudio or Audio Tag?
                        if(this.game.sound.usingWebAudio) {
                            this._xhr.open("GET", this.baseURL + file.url, true);
                            this._xhr.responseType = "arraybuffer";
                            this._xhr.onload = function () {
                                return _this.fileComplete(file.key);
                            };
                            this._xhr.onerror = function () {
                                return _this.fileError(file.key);
                            };
                            this._xhr.send();
                        } else if(this.game.sound.usingAudioTag) {
                            if(this.game.sound.touchLocked) {
                                //  If audio is locked we can't do this yet, so need to queue this load request somehow. Bum.
                                file.data = new Audio();
                                file.data.name = file.key;
                                file.data.preload = 'auto';
                                file.data.src = this.baseURL + file.url;
                                this.fileComplete(file.key);
                            } else {
                                file.data = new Audio();
                                file.data.name = file.key;
                                file.data.onerror = function () {
                                    return _this.fileError(file.key);
                                };
                                file.data.preload = 'auto';
                                file.data.src = this.baseURL + file.url;
                                file.data.addEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete(file.key), false);
                                file.data.load();
                            }
                        }
                    }
                    break;
                case 'text':
                    this._xhr.open("GET", this.baseURL + file.url, true);
                    this._xhr.responseType = "text";
                    this._xhr.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    this._xhr.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    this._xhr.send();
                    break;
            }
        };
        Loader.prototype.getAudioURL = function (urls) {
            var extension;
            for(var i = 0; i < urls.length; i++) {
                extension = urls[i].toLowerCase();
                extension = extension.substr((Math.max(0, extension.lastIndexOf(".")) || Infinity) + 1);
                if(this.game.device.canPlayAudio(extension)) {
                    return urls[i];
                }
            }
            return null;
        };
        Loader.prototype.fileError = /**
        * Error occured when load a file.
        * @param key {string} Key of the error loading file.
        */
        function (key) {
            this._fileList[key].loaded = true;
            this._fileList[key].error = true;
            this.onFileError.dispatch(key);
            throw new Error("Phaser.Loader error loading file: " + key);
            this.nextFile(key, false);
        };
        Loader.prototype.fileComplete = /**
        * Called when a file is successfully loaded.
        * @param key {string} Key of the successfully loaded file.
        */
        function (key) {
            var _this = this;
            if(!this._fileList[key]) {
                throw new Error('Phaser.Loader fileComplete invalid key ' + key);
                return;
            }
            this._fileList[key].loaded = true;
            var file = this._fileList[key];
            var loadNext = true;
            switch(file.type) {
                case 'image':
                    this.game.cache.addImage(file.key, file.url, file.data);
                    break;
                case 'spritesheet':
                    this.game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
                    break;
                case 'textureatlas':
                    if(file.atlasURL == null) {
                        this.game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
                    } else {
                        //  Load the JSON or XML before carrying on with the next file
                        loadNext = false;
                        this._xhr.open("GET", this.baseURL + file.atlasURL, true);
                        this._xhr.responseType = "text";
                        if(file.format == Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                            this._xhr.onload = function () {
                                return _this.jsonLoadComplete(file.key);
                            };
                        } else if(file.format == Loader.TEXTURE_ATLAS_XML_STARLING) {
                            this._xhr.onload = function () {
                                return _this.xmlLoadComplete(file.key);
                            };
                        }
                        this._xhr.onerror = function () {
                            return _this.dataLoadError(file.key);
                        };
                        this._xhr.send();
                    }
                    break;
                case 'audio':
                    if(this.game.sound.usingWebAudio) {
                        file.data = this._xhr.response;
                        this.game.cache.addSound(file.key, file.url, file.data, true, false);
                        if(file.autoDecode) {
                            this.game.cache.updateSound(key, 'isDecoding', true);
                            var that = this;
                            var key = file.key;
                            this.game.sound.context.decodeAudioData(file.data, function (buffer) {
                                if(buffer) {
                                    that.game.cache.decodedSound(key, buffer);
                                }
                            });
                        }
                    } else {
                        file.data.removeEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete);
                        this.game.cache.addSound(file.key, file.url, file.data, false, true);
                    }
                    break;
                case 'text':
                    file.data = this._xhr.response;
                    this.game.cache.addText(file.key, file.url, file.data);
                    break;
            }
            if(loadNext) {
                this.nextFile(key, true);
            }
        };
        Loader.prototype.jsonLoadComplete = /**
        * Successfully loaded a JSON file.
        * @param key {string} Key of the loaded JSON file.
        */
        function (key) {
            var data = JSON.parse(this._xhr.response);
            var file = this._fileList[key];
            this.game.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
            this.nextFile(key, true);
        };
        Loader.prototype.dataLoadError = /**
        * Error occured when load a JSON.
        * @param key {string} Key of the error loading JSON file.
        */
        function (key) {
            var file = this._fileList[key];
            file.error = true;
            throw new Error("Phaser.Loader dataLoadError: " + key);
            this.nextFile(key, true);
        };
        Loader.prototype.xmlLoadComplete = function (key) {
            var atlasData = this._xhr.response;
            var xml;
            try  {
                if(window['DOMParser']) {
                    var domparser = new DOMParser();
                    xml = domparser.parseFromString(atlasData, "text/xml");
                } else {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = 'false';
                    xml.loadXML(atlasData);
                }
            } catch (e) {
                xml = undefined;
            }
            if(!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                throw new Error("Phaser.Loader. Invalid XML given");
            }
            var file = this._fileList[key];
            this.game.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);
            this.nextFile(key, true);
        };
        Loader.prototype.nextFile = /**
        * Handle loading next file.
        * @param previousKey {string} Key of previous loaded asset.
        * @param success {bool} Whether the previous asset loaded successfully or not.
        */
        function (previousKey, success) {
            this.progress = Math.round(this.progress + this._progressChunk);
            if(this.progress > 100) {
                this.progress = 100;
            }
            this.onFileComplete.dispatch(this.progress, previousKey, success, this._queueSize - this._keys.length, this._queueSize);
            if(this._keys.length > 0) {
                this.loadFile();
            } else {
                this.hasLoaded = true;
                this.isLoading = false;
                this.removeAll();
                this.onLoadComplete.dispatch();
            }
        };
        Loader.prototype.checkKeyExists = /**
        * Check whether asset exists with a specific key.
        * @param key {string} Key of the asset you want to check.
        * @return {bool} Return true if exists, otherwise return false.
        */
        function (key) {
            if(this._fileList[key]) {
                return true;
            } else {
                return false;
            }
        };
        return Loader;
    })();
    Phaser.Loader = Loader;    
})(Phaser || (Phaser = {}));
