/// <reference path="../_definitions.ts" />
/**
* Phaser - Cache
*
* A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
*/
var Phaser;
(function (Phaser) {
    var Cache = (function () {
        /**
        * Cache constructor
        */
        function Cache(game) {
            this.onSoundUnlock = new Phaser.Signal();
            this.game = game;

            this._canvases = {};
            this._images = {};
            this._sounds = {};
            this._text = {};
        }
        /**
        * Add a new canvas.
        * @param key {string} Asset key for this canvas.
        * @param canvas {HTMLCanvasElement} Canvas DOM element.
        * @param context {CanvasRenderingContext2D} Render context of this canvas.
        */
        Cache.prototype.addCanvas = function (key, canvas, context) {
            this._canvases[key] = { canvas: canvas, context: context };
        };

        /**
        * Add a new sprite sheet.
        * @param key {string} Asset key for the sprite sheet.
        * @param url {string} URL of this sprite sheet file.
        * @param data {object} Extra sprite sheet data.
        * @param frameWidth {number} Width of the sprite sheet.
        * @param frameHeight {number} Height of the sprite sheet.
        * @param frameMax {number} How many frames stored in the sprite sheet.
        */
        Cache.prototype.addSpriteSheet = function (key, url, data, frameWidth, frameHeight, frameMax) {
            this._images[key] = { url: url, data: data, spriteSheet: true, frameWidth: frameWidth, frameHeight: frameHeight };
            this._images[key].frameData = Phaser.AnimationLoader.parseSpriteSheet(this.game, key, frameWidth, frameHeight, frameMax);
        };

        /**
        * Add a new texture atlas.
        * @param key  {string} Asset key for the texture atlas.
        * @param url  {string} URL of this texture atlas file.
        * @param data {object} Extra texture atlas data.
        * @param atlasData {object} Texture atlas frames data.
        */
        Cache.prototype.addTextureAtlas = function (key, url, data, atlasData, format) {
            this._images[key] = { url: url, data: data, spriteSheet: true };

            if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                this._images[key].frameData = Phaser.AnimationLoader.parseJSONData(this.game, atlasData);
            } else if (format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING) {
                this._images[key].frameData = Phaser.AnimationLoader.parseXMLData(this.game, atlasData, format);
            }
        };

        /**
        * Add a new image.
        * @param key {string} Asset key for the image.
        * @param url {string} URL of this image file.
        * @param data {object} Extra image data.
        */
        Cache.prototype.addImage = function (key, url, data) {
            this._images[key] = { url: url, data: data, spriteSheet: false };
        };

        /**
        * Add a new sound.
        * @param key {string} Asset key for the sound.
        * @param url {string} URL of this sound file.
        * @param data {object} Extra sound data.
        */
        Cache.prototype.addSound = function (key, url, data, webAudio, audioTag) {
            if (typeof webAudio === "undefined") { webAudio = true; }
            if (typeof audioTag === "undefined") { audioTag = false; }
            var locked = this.game.sound.touchLocked;
            var decoded = false;

            if (audioTag) {
                decoded = true;
            }

            this._sounds[key] = { url: url, data: data, locked: locked, isDecoding: false, decoded: decoded, webAudio: webAudio, audioTag: audioTag };
        };

        Cache.prototype.reloadSound = function (key) {
            var _this = this;
            if (this._sounds[key]) {
                this._sounds[key].data.src = this._sounds[key].url;
                this._sounds[key].data.addEventListener('canplaythrough', function () {
                    return _this.reloadSoundComplete(key);
                }, false);
                this._sounds[key].data.load();
            }
        };

        Cache.prototype.reloadSoundComplete = function (key) {
            if (this._sounds[key]) {
                this._sounds[key].locked = false;
                this.onSoundUnlock.dispatch(key);
            }
        };

        Cache.prototype.updateSound = function (key, property, value) {
            if (this._sounds[key]) {
                this._sounds[key][property] = value;
            }
        };

        /**
        * Add a new decoded sound.
        * @param key {string} Asset key for the sound.
        * @param data {object} Extra sound data.
        */
        Cache.prototype.decodedSound = function (key, data) {
            this._sounds[key].data = data;
            this._sounds[key].decoded = true;
            this._sounds[key].isDecoding = false;
        };

        /**
        * Add a new text data.
        * @param key {string} Asset key for the text data.
        * @param url {string} URL of this text data file.
        * @param data {object} Extra text data.
        */
        Cache.prototype.addText = function (key, url, data) {
            this._text[key] = { url: url, data: data };
        };

        /**
        * Get canvas by key.
        * @param key Asset key of the canvas you want.
        * @return {object} The canvas you want.
        */
        Cache.prototype.getCanvas = function (key) {
            if (this._canvases[key]) {
                return this._canvases[key].canvas;
            }

            return null;
        };

        /**
        * Get image data by key.
        * @param key Asset key of the image you want.
        * @return {object} The image data you want.
        */
        Cache.prototype.getImage = function (key) {
            if (this._images[key]) {
                return this._images[key].data;
            }

            return null;
        };

        /**
        * Get frame data by key.
        * @param key Asset key of the frame data you want.
        * @return {object} The frame data you want.
        */
        Cache.prototype.getFrameData = function (key) {
            if (this._images[key] && this._images[key].spriteSheet == true) {
                return this._images[key].frameData;
            }

            return null;
        };

        /**
        * Get sound by key.
        * @param key Asset key of the sound you want.
        * @return {object} The sound you want.
        */
        Cache.prototype.getSound = function (key) {
            if (this._sounds[key]) {
                return this._sounds[key];
            }

            return null;
        };

        /**
        * Get sound data by key.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        Cache.prototype.getSoundData = function (key) {
            if (this._sounds[key]) {
                return this._sounds[key].data;
            }

            return null;
        };

        /**
        * Check whether an asset is decoded sound.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        Cache.prototype.isSoundDecoded = function (key) {
            if (this._sounds[key]) {
                return this._sounds[key].decoded;
            }
        };

        /**
        * Check whether an asset is decoded sound.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        Cache.prototype.isSoundReady = function (key) {
            if (this._sounds[key] && this._sounds[key].decoded == true && this._sounds[key].locked == false) {
                return true;
            }

            return false;
        };

        /**
        * Check whether an asset is sprite sheet.
        * @param key Asset key of the sprite sheet you want.
        * @return {object} The sprite sheet data you want.
        */
        Cache.prototype.isSpriteSheet = function (key) {
            if (this._images[key]) {
                return this._images[key].spriteSheet;
            }
        };

        /**
        * Get text data by key.
        * @param key Asset key of the text data you want.
        * @return {object} The text data you want.
        */
        Cache.prototype.getText = function (key) {
            if (this._text[key]) {
                return this._text[key].data;
            }

            return null;
        };

        /**
        * Returns an array containing all of the keys of Images in the Cache.
        * @return {Array} The string based keys in the Cache.
        */
        Cache.prototype.getImageKeys = function () {
            var output = [];

            for (var item in this._images) {
                output.push(item);
            }

            return output;
        };

        /**
        * Returns an array containing all of the keys of Sounds in the Cache.
        * @return {Array} The string based keys in the Cache.
        */
        Cache.prototype.getSoundKeys = function () {
            var output = [];

            for (var item in this._sounds) {
                output.push(item);
            }

            return output;
        };

        /**
        * Returns an array containing all of the keys of Text Files in the Cache.
        * @return {Array} The string based keys in the Cache.
        */
        Cache.prototype.getTextKeys = function () {
            var output = [];

            for (var item in this._text) {
                output.push(item);
            }

            return output;
        };

        Cache.prototype.removeCanvas = function (key) {
            delete this._canvases[key];
        };

        Cache.prototype.removeImage = function (key) {
            delete this._images[key];
        };

        Cache.prototype.removeSound = function (key) {
            delete this._sounds[key];
        };

        Cache.prototype.removeText = function (key) {
            delete this._text[key];
        };

        /**
        * Clean up cache memory.
        */
        Cache.prototype.destroy = function () {
            for (var item in this._canvases) {
                delete this._canvases[item['key']];
            }

            for (var item in this._images) {
                delete this._images[item['key']];
            }

            for (var item in this._sounds) {
                delete this._sounds[item['key']];
            }

            for (var item in this._text) {
                delete this._text[item['key']];
            }
        };
        return Cache;
    })();
    Phaser.Cache = Cache;
})(Phaser || (Phaser = {}));
