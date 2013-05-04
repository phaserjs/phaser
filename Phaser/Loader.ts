/// <reference path="Game.ts" />

/**
* Phaser - Loader
*
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides for progress and completion callbacks.
*/

module Phaser {

    export class Loader {

        /**
         * Loader constructor
         *
         * @param game {Phaser.Game} Current game instance.
         * @param callback {function} This will be called when assets completely loaded.
         */
        constructor(game: Game, callback) {

            this._game = game;
            this._gameCreateComplete = callback;
            this._keys = [];
            this._fileList = {};
            this._xhr = new XMLHttpRequest();
            this._queueSize = 0;

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;
        /**
         * Array stors assets keys. So you can get that asset by its unique key.
         */
        private _keys: string[];
        /**
         * Contains all the assets file infos.
         */
        private _fileList;
        /**
         * Game initialial assets loading callback.
         */
        private _gameCreateComplete;
        private _onComplete;
        private _onFileLoad;
        /**
         * Indicates assets loading progress. (from 0 to 100)
         * @type {number}
         */
        private _progressChunk: number;
        private _xhr: XMLHttpRequest;
        /**
         * Length of assets queue.
         * @type {number}
         */
        private _queueSize: number;

        /**
         * True if game is completely loaded.
         * @type {boolean}
         */
        public hasLoaded: bool;
        /**
         * Loading progress (from 0 to 1)
         * @type {number}
         */
        public progress: number;

        /**
         * Reset loader, this will remove all loaded assets.
         */
        public reset() {
            this._queueSize = 0;
        }

        public get queueSize(): number {

            return this._queueSize;

        }

        /**
         * Add a new image asset loading request with key and url.
         * @param key {string} Unique asset key of this image file.
         * @param url {string} URL of image file.
         */
        public addImageFile(key: string, url: string) {

            if (this.checkKeyExists(key) === false)
            {
                this._queueSize++;
                this._fileList[key] = { type: 'image', key: key, url: url, data: null, error: false, loaded: false };
                this._keys.push(key);
            }

        }

        /**
         * Add a new sprite sheet loading request.
         * @param key {string} Unique asset key of the sheet file.
         * @param url {string} URL of sheet file.
         * @param frameWidth {number} Width of each single frame.
         * @param frameHeight {number} Height of each single frame.
         * @param frameMax {number} How many frames in this sprite sheet.
         */
        public addSpriteSheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax?: number = -1) {

            if (this.checkKeyExists(key) === false)
            {
                this._queueSize++;
                this._fileList[key] = { type: 'spritesheet', key: key, url: url, data: null, frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax, error: false, loaded: false };
                this._keys.push(key);
            }

        }

        /**
         * Add a new texture atlas loading request.
         * @param key {string} Unique asset key of the texture atlas file.
         * @param url {string} URL of texture atlas file.
         * @param jsonURL {string} Optional, url of JSON data file.
         * @param jsonData {object} Optional, JSON data object.
         */
        public addTextureAtlas(key: string, url: string, jsonURL?: string = null, jsonData? = null) {

            if (this.checkKeyExists(key) === false)
            {
                if (jsonURL !== null)
                {
                    //  A URL to a json file has been given
                    this._queueSize++;
                    this._fileList[key] = { type: 'textureatlas', key: key, url: url, data: null, jsonURL: jsonURL, jsonData: null, error: false, loaded: false };
                    this._keys.push(key);
                }
                else
                {
                    //  A json string or object has been given
                    if (typeof jsonData === 'string')
                    {
                        var data = JSON.parse(jsonData);
                        //  Malformed?
                        if (data['frames'])
                        {
                            this._queueSize++;
                            this._fileList[key] = { type: 'textureatlas', key: key, url: url, data: null, jsonURL: null, jsonData: data['frames'], error: false, loaded: false };
                            this._keys.push(key);
                        }
                    }
                    else
                    {
                        //  Malformed?
                        if (jsonData['frames'])
                        {
                            this._queueSize++;
                            this._fileList[key] = { type: 'textureatlas', key: key, url: url, data: null, jsonURL: null, jsonData: jsonData['frames'], error: false, loaded: false };
                            this._keys.push(key);
                        }
                    }

                }

            }

        }

        /**
         * Add a new audio file loading request.
         * @param key {string} Unique asset key of the audio file.
         * @param url {string} URL of audio file.
         */
        public addAudioFile(key: string, url: string) {

            if (this.checkKeyExists(key) === false)
            {
                this._queueSize++;
                this._fileList[key] = { type: 'audio', key: key, url: url, data: null, buffer: null, error: false, loaded: false };
                this._keys.push(key);
            }

        }

        /**
         * Add a new text file loading request.
         * @param key {string} Unique asset key of the text file.
         * @param url {string} URL of text file.
         */
        public addTextFile(key: string, url: string) {

            if (this.checkKeyExists(key) === false)
            {
                this._queueSize++;
                this._fileList[key] = { type: 'text', key: key, url: url, data: null, error: false, loaded: false };
                this._keys.push(key);
            }

        }

        /**
         * Remove loading request of a file.
         * @param key {string} Key of the file you want to remove.
         */
        public removeFile(key: string) {

            delete this._fileList[key];

        }

        /**
         * Remove all file loading requests.
         */
        public removeAll() {

            this._fileList = {};

        }

        /**
         * Load assets.
         * @param onFileLoadCallback {function} Called when each file loaded successfully.
         * @param onCompleteCallback {function} Called when all assets completely loaded.
         */
        public load(onFileLoadCallback = null, onCompleteCallback = null) {

            this.progress = 0;
            this.hasLoaded = false;

            this._onComplete = onCompleteCallback;

            if (onCompleteCallback == null)
            {
                this._onComplete = this._game.onCreateCallback;
            }

            this._onFileLoad = onFileLoadCallback;

            if (this._keys.length > 0)
            {
                this._progressChunk = 100 / this._keys.length;
                this.loadFile();
            }
            else
            {
                this.progress = 1;
                this.hasLoaded = true;
                this._gameCreateComplete.call(this._game);

                if (this._onComplete !== null)
                {
                    this._onComplete.call(this._game.callbackContext);
                }
            }

        }

        /**
         * Load files. Private method ONLY used by loader.
         */
        private loadFile() {

            var file = this._fileList[this._keys.pop()];

            //  Image or Data?

            switch (file.type)
            {
                case 'image':
                case 'spritesheet':
                case 'textureatlas':
                    file.data = new Image();
                    file.data.name = file.key;
                    file.data.onload = () => this.fileComplete(file.key);
                    file.data.onerror = () => this.fileError(file.key);
                    file.data.src = file.url;
                    break;

                case 'audio':
                    this._xhr.open("GET", file.url, true);
                    this._xhr.responseType = "arraybuffer";
                    this._xhr.onload = () => this.fileComplete(file.key);
                    this._xhr.onerror = () => this.fileError(file.key);
                    this._xhr.send();
                    break;

                case 'text':
                    this._xhr.open("GET", file.url, true);
                    this._xhr.responseType = "text";
                    this._xhr.onload = () => this.fileComplete(file.key);
                    this._xhr.onerror = () => this.fileError(file.key);
                    this._xhr.send();
                    break;
            }

        }

        /**
         * Error occured when load a file.
         * @param key {string} Key of the error loading file.
         */
        private fileError(key: string) {

            this._fileList[key].loaded = true;
            this._fileList[key].error = true;

            this.nextFile(key, false);

        }

        /**
         * Called when a file is successfully loaded.
         * @param key {string} Key of the successfully loaded file.
         */
        private fileComplete(key: string) {

            this._fileList[key].loaded = true;

            var file = this._fileList[key];
            var loadNext: bool = true;

            switch (file.type)
            {
                case 'image':
                    this._game.cache.addImage(file.key, file.url, file.data);
                    break;

                case 'spritesheet':
                    this._game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
                    break;

                case 'textureatlas':
                    if (file.jsonURL == null)
                    {
                        this._game.cache.addTextureAtlas(file.key, file.url, file.data, file.jsonData);
                    }
                    else
                    {
                        //  Load the JSON before carrying on with the next file
                        loadNext = false;
                        this._xhr.open("GET", file.jsonURL, true);
                        this._xhr.responseType = "text";
                        this._xhr.onload = () => this.jsonLoadComplete(file.key);
                        this._xhr.onerror = () => this.jsonLoadError(file.key);
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

            if (loadNext)
            {
                this.nextFile(key, true);
            }

        }

        /**
         * Successfully loaded a JSON file.
         * @param key {string} Key of the loaded JSON file.
         */
        private jsonLoadComplete(key: string) {

            var data = JSON.parse(this._xhr.response);

            //  Malformed?
            if (data['frames'])
            {
                var file = this._fileList[key];
                this._game.cache.addTextureAtlas(file.key, file.url, file.data, data['frames']);
            }

            this.nextFile(key, true);

        }

        /**
         * Error occured when load a JSON.
         * @param key {string} Key of the error loading JSON file.
         */
        private jsonLoadError(key: string) {

            var file = this._fileList[key];
            file.error = true;
            this.nextFile(key, true);

        }

        /**
         * Handle loading next file.
         * @param previousKey {string} Key of previous loaded asset.
         * @param success {boolean} Whether the previous asset loaded successfully or not.
         */
        private nextFile(previousKey: string, success: bool) {

            this.progress = Math.round(this.progress + this._progressChunk);

            if (this.progress > 1)
            {
                this.progress = 1;
            }

            if (this._onFileLoad)
            {
                this._onFileLoad.call(this._game.callbackContext, this.progress, previousKey, success);
            }

            if (this._keys.length > 0)
            {
                this.loadFile();
            }
            else
            {
                this.hasLoaded = true;
                this.removeAll();
                this._gameCreateComplete.call(this._game);

                if (this._onComplete !== null)
                {
                    this._onComplete.call(this._game.callbackContext);
                }
            }

        }

        /**
         * Check whether asset exists with a specific key.
         * @param key {string} Key of the asset you want to check.
         * @return {boolean} Return true if exists, otherwise return false.
         */
        private checkKeyExists(key: string): bool {

            if (this._fileList[key])
            {
                return true;
            }
            else
            {
                return false;
            }

        }

    }

}