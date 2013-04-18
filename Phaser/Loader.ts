/// <reference path="Game.ts" />

/**
*   Phaser
*/

module Phaser {

    export class Loader {

        constructor(game: Game, callback) {

            this._game = game;
            this._gameCreateComplete = callback;
            this._keys = [];
            this._fileList = {};
            this._xhr = new XMLHttpRequest();

        }

        private _game: Game;
        private _keys: string[];
        private _fileList;
        private _gameCreateComplete;
        private _onComplete;
        private _onFileLoad;
        private _progressChunk: number;
        private _xhr: XMLHttpRequest;

        public hasLoaded: bool;
        public progress: number;

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

        public addImageFile(key: string, url: string) {

            if (this.checkKeyExists(key) === false)
            {
                this._fileList[key] = { type: 'image', key: key, url: url, data: null, error: false, loaded: false };
                this._keys.push(key);
            }

        }

        public addSpriteSheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax?: number = -1) {

            if (this.checkKeyExists(key) === false)
            {
                this._fileList[key] = { type: 'spritesheet', key: key, url: url, data: null, frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax, error: false, loaded: false };
                this._keys.push(key);
            }

        }

        public addTextureAtlas(key: string, url: string, jsonURL?: string = null, jsonData? = null) {

            //console.log('addTextureAtlas');
            //console.log(typeof jsonData);

            if (this.checkKeyExists(key) === false)
            {
                if (jsonURL !== null)
                {
                    //console.log('A URL to a json file has been given');
                    //  A URL to a json file has been given
                    this._fileList[key] = { type: 'textureatlas', key: key, url: url, data: null, jsonURL: jsonURL, jsonData: null, error: false, loaded: false };
                    this._keys.push(key);
                }
                else
                {
                    //  A json string or object has been given
                    if (typeof jsonData === 'string')
                    {
                        //console.log('A json string has been given');
                        var data = JSON.parse(jsonData);
                        //console.log(data);
                        //  Malformed?
                        if (data['frames'])
                        {
                            //console.log('frames array found');
                            this._fileList[key] = { type: 'textureatlas', key: key, url: url, data: null, jsonURL: null, jsonData: data['frames'], error: false, loaded: false };
                            this._keys.push(key);
                        }
                    }
                    else
                    {
                        //console.log('A json object has been given', jsonData);
                        //  Malformed?
                        if (jsonData['frames'])
                        {
                            //console.log('frames array found');
                            this._fileList[key] = { type: 'textureatlas', key: key, url: url, data: null, jsonURL: null, jsonData: jsonData['frames'], error: false, loaded: false };
                            this._keys.push(key);
                        }
                    }

                }

            }

        }

        public addAudioFile(key: string, url: string) {

            if (this.checkKeyExists(key) === false)
            {
                this._fileList[key] = { type: 'audio', key: key, url: url, data: null, buffer: null, error: false, loaded: false };
                this._keys.push(key);
            }

        }

        public addTextFile(key: string, url: string) {

            if (this.checkKeyExists(key) === false)
            {
                this._fileList[key] = { type: 'text', key: key, url: url, data: null, error: false, loaded: false };
                this._keys.push(key);
            }

        }

        public removeFile(key: string) {

            delete this._fileList[key];

        }

        public removeAll() {

            this._fileList = {};

        }

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

        private fileError(key: string) {

            this._fileList[key].loaded = true;
            this._fileList[key].error = true;

            this.nextFile(key, false);

        }

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
                    //console.log('texture atlas loaded');
                    if (file.jsonURL == null)
                    {
                        this._game.cache.addTextureAtlas(file.key, file.url, file.data, file.jsonData);
                    }
                    else
                    {
                        //  Load the JSON before carrying on with the next file
                        //console.log('Loading the JSON before carrying on with the next file');
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

        private jsonLoadComplete(key: string) {

            //console.log('json load complete');

            var data = JSON.parse(this._xhr.response);

            //console.log(data);

            //  Malformed?
            if (data['frames'])
            {
                var file = this._fileList[key];
                this._game.cache.addTextureAtlas(file.key, file.url, file.data, data['frames']);
            }

            this.nextFile(key, true);

        }

        private jsonLoadError(key: string) {

            //console.log('json load error');

            var file = this._fileList[key];
            file.error = true;
            this.nextFile(key, true);

        }

        private nextFile(previousKey: string, success: bool) {

            this.progress = Math.round(this.progress + this._progressChunk);

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

    }

}