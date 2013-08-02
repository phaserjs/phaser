/// <reference path="../Game.ts" />

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
         * Loading progress (from 0 to 100)
         * @type {number}
         */
        public progress: number;

        /**
         * The crossOrigin value applied to loaded images
         * @type {string}
         */
        public crossOrigin: string = '';

        /**
         * TextureAtlas data format constants
         */
        public static TEXTURE_ATLAS_JSON_ARRAY: number = 0;
        public static TEXTURE_ATLAS_JSON_HASH: number = 1;
        public static TEXTURE_ATLAS_XML_STARLING: number = 2;

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
        public image(key: string, url: string, overwrite: bool = false) {

            if (overwrite == true || this.checkKeyExists(key) == false)
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
        public spritesheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax?: number = -1) {

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
         * @param textureURL {string} The url of the texture atlas image file.
         * @param [atlasURL] {string} The url of the texture atlas data file (json/xml)
         * @param [atlasData] {object} A JSON or XML data object.
         * @param [format] {number} A value describing the format of the data.
         */
        public atlas(key: string, textureURL: string, atlasURL?: string = null, atlasData? = null, format?:number = Loader.TEXTURE_ATLAS_JSON_ARRAY) {

            if (this.checkKeyExists(key) === false)
            {
                if (atlasURL !== null)
                {
                    //  A URL to a json/xml file has been given
                    this._queueSize++;
                    this._fileList[key] = { type: 'textureatlas', key: key, url: textureURL, atlasURL: atlasURL, data: null, format: format, error: false, loaded: false };
                    this._keys.push(key);
                }
                else
                {
                    if (format == Loader.TEXTURE_ATLAS_JSON_ARRAY)
                    {
                        //  A json string or object has been given
                        if (typeof atlasData === 'string')
                        {
                            atlasData = JSON.parse(atlasData);
                        }

                        this._queueSize++;
                        this._fileList[key] = { type: 'textureatlas', key: key, url: textureURL, data: null, atlasURL: null, atlasData: atlasData, format: format, error: false, loaded: false };
                        this._keys.push(key);
                    }
                    else if (format == Loader.TEXTURE_ATLAS_XML_STARLING)
                    {
                        //  An xml string or object has been given
                        if (typeof atlasData === 'string')
                        {
                            var xml;

                            try
                            {
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

                        this._queueSize++;
                        this._fileList[key] = { type: 'textureatlas', key: key, url: textureURL, data: null, atlasURL: null, atlasData: atlasData, format: format, error: false, loaded: false };
                        this._keys.push(key);
                    }

                }

            }

        }

        /**
         * Add a new audio file loading request.
         * @param key {string} Unique asset key of the audio file.
         * @param urls {Array} An array containing the URLs of the audio files, i.e.: [ 'jump.mp3', 'jump.ogg', 'jump.m4a' ]
         * @param autoDecode {boolean} When using Web Audio the audio files can either be decoded at load time or run-time. They can't be played until they are decoded, but this let's you control when that happens. Decoding is a non-blocking async process.
         */
        public audio(key: string, urls: string[], autoDecode: bool = true) {

            if (this.checkKeyExists(key) === false)
            {
                this._queueSize++;
                this._fileList[key] = { type: 'audio', key: key, url: urls, data: null, buffer: null, error: false, loaded: false, autoDecode: autoDecode };
                this._keys.push(key);
            }

        }

        /**
         * Add a new text file loading request.
         * @param key {string} Unique asset key of the text file.
         * @param url {string} URL of text file.
         */
        public text(key: string, url: string) {

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
        public start(onFileLoadCallback = null, onCompleteCallback = null) {

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
                this.progress = 100;
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
                    file.data.crossOrigin = this.crossOrigin;
                    file.data.src = file.url;
                    break;

                case 'audio':

                    file.url = this.getAudioURL(file.url);
                    //console.log('Loader audio');
                    //console.log(file.url);

                    if (file.url !== null)
                    {
                        //  WebAudio or Audio Tag?
                        if (this._game.sound.usingWebAudio)
                        {
                            this._xhr.open("GET", file.url, true);
                            this._xhr.responseType = "arraybuffer";
                            this._xhr.onload = () => this.fileComplete(file.key);
                            this._xhr.onerror = () => this.fileError(file.key);
                            this._xhr.send();
                        }
                        else if (this._game.sound.usingAudioTag)
                        {
                            if (this._game.sound.touchLocked)
                            {
                                //  If audio is locked we can't do this yet, so need to queue this load request somehow. Bum.
                                //console.log('Audio is touch locked');
                                file.data = new Audio();
                                file.data.name = file.key;
                                file.data.preload = 'auto';
                                file.data.src = file.url;
                                this.fileComplete(file.key);
                            }
                            else
                            {
                                file.data = new Audio();
                                file.data.name = file.key;
                                file.data.onerror = () => this.fileError(file.key);
                                file.data.preload = 'auto';
                                file.data.src = file.url;
                                file.data.addEventListener('canplaythrough', () => this.fileComplete(file.key), false);
                                file.data.load();
                            }
                        }
                    }

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

        private getAudioURL(urls): string {

            var extension: string;

            for (var i = 0; i < urls.length; i++)
            {
                extension = urls[i].toLowerCase();
                extension = extension.substr((Math.max(0, extension.lastIndexOf(".")) || Infinity) + 1);

                if (this._game.device.canPlayAudio(extension))
                {
                    //console.log('getAudioURL', urls[i]);
                    //console.log(urls[i]);
                    return urls[i];
                }

            }

            return null;

        }

        /**
         * Error occured when load a file.
         * @param key {string} Key of the error loading file.
         */
        private fileError(key: string) {

            this._fileList[key].loaded = true;
            this._fileList[key].error = true;

            throw new Error("Phaser.Loader error loading file: " + key);

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
                    if (file.atlasURL == null)
                    {
                        this._game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
                    }
                    else
                    {
                        //  Load the JSON or XML before carrying on with the next file
                        loadNext = false;
                        this._xhr.open("GET", file.atlasURL, true);
                        this._xhr.responseType = "text";

                        if (file.format == Loader.TEXTURE_ATLAS_JSON_ARRAY)
                        {
                            this._xhr.onload = () => this.jsonLoadComplete(file.key);
                        }
                        else if (file.format == Loader.TEXTURE_ATLAS_XML_STARLING)
                        {
                            this._xhr.onload = () => this.xmlLoadComplete(file.key);
                        }

                        this._xhr.onerror = () => this.dataLoadError(file.key);
                        this._xhr.send();
                    }
                    break;

                case 'audio':

                    if (this._game.sound.usingWebAudio)
                    {
                        file.data = this._xhr.response;

                        this._game.cache.addSound(file.key, file.url, file.data, true, false);

                        if (file.autoDecode)
                        {
                            this._game.cache.updateSound(key, 'isDecoding', true);

                            var that = this;
                            var key = file.key;

                            this._game.sound.context.decodeAudioData(file.data, function (buffer) {
                                if (buffer)
                                {
                                    that._game.cache.decodedSound(key, buffer);
                                }
                            });
                        }
                    }
                    else
                    {
                        this._game.cache.addSound(file.key, file.url, file.data, false, true);
                    }
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
            var file = this._fileList[key];

            this._game.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);

            this.nextFile(key, true);

        }

        /**
         * Error occured when load a JSON.
         * @param key {string} Key of the error loading JSON file.
         */
        private dataLoadError(key: string) {

            var file = this._fileList[key];

            file.error = true;

            throw new Error("Phaser.Loader dataLoadError: " + key);

            this.nextFile(key, true);

        }

        private xmlLoadComplete(key: string) {

            var atlasData = this._xhr.response;
            var xml;

            try
            {
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
                throw new Error("Phaser.Loader. Invalid XML given");
            }

            var file = this._fileList[key];
            this._game.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);

            this.nextFile(key, true);

        }

        /**
         * Handle loading next file.
         * @param previousKey {string} Key of previous loaded asset.
         * @param success {boolean} Whether the previous asset loaded successfully or not.
         */
        private nextFile(previousKey: string, success: bool) {

            this.progress = Math.round(this.progress + this._progressChunk);

            if (this.progress > 100)
            {
                this.progress = 100;
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