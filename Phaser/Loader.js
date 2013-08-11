/// <reference path="Game.ts" />
/**
* Phaser - Loader
*
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides for progress and completion callbacks.
*/
var Phaser;
(function (Phaser) {
    var Loader = (function () {
        function Loader(game, callback) {
            this._game = game;
            this._gameCreateComplete = callback;
            this._keys = [];
            this._fileList = {
            };
            this._xhr = new XMLHttpRequest();
            this._queueSize = 0;
        }
        Loader.prototype.reset = function () {
            this._queueSize = 0;
        };
        Object.defineProperty(Loader.prototype, "queueSize", {
            get: function () {
                return this._queueSize;
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype.addImageFile = function (key, url) {
            if(this.checkKeyExists(key) === false) {
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
        Loader.prototype.addSpriteSheet = function (key, url, frameWidth, frameHeight, frameMax) {
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
        Loader.prototype.addTextureAtlas = function (key, url, jsonURL, jsonData) {
            if (typeof jsonURL === "undefined") { jsonURL = null; }
            if (typeof jsonData === "undefined") { jsonData = null; }
            if(this.checkKeyExists(key) === false) {
                if(jsonURL !== null) {
                    //  A URL to a json file has been given
                    this._queueSize++;
                    this._fileList[key] = {
                        type: 'textureatlas',
                        key: key,
                        url: url,
                        data: null,
                        jsonURL: jsonURL,
                        jsonData: null,
                        error: false,
                        loaded: false
                    };
                    this._keys.push(key);
                } else {
                    //  A json string or object has been given
                    if(typeof jsonData === 'string') {
                        var data = JSON.parse(jsonData);
                        //  Malformed?
                        if(data['frames']) {
                            this._queueSize++;
                            this._fileList[key] = {
                                type: 'textureatlas',
                                key: key,
                                url: url,
                                data: null,
                                jsonURL: null,
                                jsonData: data['frames'],
                                error: false,
                                loaded: false
                            };
                            this._keys.push(key);
                        }
                    } else {
                        //  Malformed?
                        if(jsonData['frames']) {
                            this._queueSize++;
                            this._fileList[key] = {
                                type: 'textureatlas',
                                key: key,
                                url: url,
                                data: null,
                                jsonURL: null,
                                jsonData: jsonData['frames'],
                                error: false,
                                loaded: false
                            };
                            this._keys.push(key);
                        }
                    }
                }
            }
        };
        Loader.prototype.addAudioFile = function (key, url) {
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = {
                    type: 'audio',
                    key: key,
                    url: url,
                    data: null,
                    buffer: null,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.addTextFile = function (key, url) {
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
        Loader.prototype.removeFile = function (key) {
            delete this._fileList[key];
        };
        Loader.prototype.removeAll = function () {
            this._fileList = {
            };
        };
        Loader.prototype.load = function (onFileLoadCallback, onCompleteCallback) {
            if (typeof onFileLoadCallback === "undefined") { onFileLoadCallback = null; }
            if (typeof onCompleteCallback === "undefined") { onCompleteCallback = null; }
            this.progress = 0;
            this.hasLoaded = false;
            this._onComplete = onCompleteCallback;
            if(onCompleteCallback == null) {
                this._onComplete = this._game.onCreateCallback;
            }
            this._onFileLoad = onFileLoadCallback;
            if(this._keys.length > 0) {
                this._progressChunk = 100 / this._keys.length;
                this.loadFile();
            } else {
                this.progress = 1;
                this.hasLoaded = true;
                this._gameCreateComplete.call(this._game);
                if(this._onComplete !== null) {
                    this._onComplete.call(this._game.callbackContext);
                }
            }
        };
        Loader.prototype.loadFile = function () {
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
                    file.data.src = file.url;
                    break;
                case 'audio':
                    this._xhr.open("GET", file.url, true);
                    this._xhr.responseType = "arraybuffer";
                    this._xhr.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    this._xhr.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    this._xhr.send();
                    break;
                case 'text':
                    this._xhr.open("GET", file.url, true);
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
        Loader.prototype.fileError = function (key) {
            this._fileList[key].loaded = true;
            this._fileList[key].error = true;
            this.nextFile(key, false);
        };
        Loader.prototype.fileComplete = function (key) {
            var _this = this;
            this._fileList[key].loaded = true;
            var file = this._fileList[key];
            var loadNext = true;
            switch(file.type) {
                case 'image':
                    this._game.cache.addImage(file.key, file.url, file.data);
                    break;
                case 'spritesheet':
                    this._game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
                    break;
                case 'textureatlas':
                    if(file.jsonURL == null) {
                        this._game.cache.addTextureAtlas(file.key, file.url, file.data, file.jsonData);
                    } else {
                        //  Load the JSON before carrying on with the next file
                        loadNext = false;
                        this._xhr.open("GET", file.jsonURL, true);
                        this._xhr.responseType = "text";
                        this._xhr.onload = function () {
                            return _this.jsonLoadComplete(file.key);
                        };
                        this._xhr.onerror = function () {
                            return _this.jsonLoadError(file.key);
                        };
                        this._xhr.send();
                    }
                    break;
                case 'audio':
                    file.data = this._xhr.response;
                    this._game.cache.addSound(file.key, file.url, file.data);
                    break;
                case 'text':
                    file.data = this._xhr.response;
                    this._game.cache.addText(file.key, file.url, file.data);
                    break;
            }
            if(loadNext) {
                this.nextFile(key, true);
            }
        };
        Loader.prototype.jsonLoadComplete = function (key) {
            var data = JSON.parse(this._xhr.response);
            //  Malformed?
            if(data['frames']) {
                var file = this._fileList[key];
                this._game.cache.addTextureAtlas(file.key, file.url, file.data, data['frames']);
            }
            this.nextFile(key, true);
        };
        Loader.prototype.jsonLoadError = function (key) {
            var file = this._fileList[key];
            file.error = true;
            this.nextFile(key, true);
        };
        Loader.prototype.nextFile = function (previousKey, success) {
            this.progress = Math.round(this.progress + this._progressChunk);
            if(this.progress > 1) {
                this.progress = 1;
            }
            if(this._onFileLoad) {
                this._onFileLoad.call(this._game.callbackContext, this.progress, previousKey, success);
            }
            if(this._keys.length > 0) {
                this.loadFile();
            } else {
                this.hasLoaded = true;
                this.removeAll();
                this._gameCreateComplete.call(this._game);
                if(this._onComplete !== null) {
                    this._onComplete.call(this._game.callbackContext);
                }
            }
        };
        Loader.prototype.checkKeyExists = function (key) {
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
