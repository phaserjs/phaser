/// <reference path="../Game.ts" />

/**
* Phaser - Cache
*
* A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
*/

module Phaser {

    export class Cache {

        /**
         * Cache constructor
         */
        constructor(game: Game) {

            this._game = game;

            this._canvases = {};
            this._images = {};
            this._sounds = {};
            this._text = {};

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;

        /**
         * Canvas key-value container.
         * @type {object}
         */
        private _canvases;

        /**
         * Image key-value container.
         * @type {object}
         */
        private _images;

        /**
         * Sound key-value container.
         * @type {object}
         */
        private _sounds;

        /**
         * Text key-value container.
         * @type {object}
         */
        private _text;

        /**
         * Add a new canvas.
         * @param key {string} Asset key for this canvas.
         * @param canvas {HTMLCanvasElement} Canvas DOM element.
         * @param context {CanvasRenderingContext2D} Render context of this canvas.
         */
        public addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {

            this._canvases[key] = { canvas: canvas, context: context };

        }

        /**
         * Add a new sprite sheet.
         * @param key {string} Asset key for the sprite sheet.
         * @param url {string} URL of this sprite sheet file.
         * @param data {object} Extra sprite sheet data.
         * @param frameWidth {number} Width of the sprite sheet.
         * @param frameHeight {number} Height of the sprite sheet.
         * @param frameMax {number} How many frames stored in the sprite sheet.
         */
        public addSpriteSheet(key: string, url: string, data, frameWidth: number, frameHeight: number, frameMax: number) {

            this._images[key] = { url: url, data: data, spriteSheet: true, frameWidth: frameWidth, frameHeight: frameHeight };
            this._images[key].frameData = AnimationLoader.parseSpriteSheet(this._game, key, frameWidth, frameHeight, frameMax);

        }

        /**
         * Add a new texture atlas.
         * @param key  {string} Asset key for the texture atlas.
         * @param url  {string} URL of this texture atlas file.
         * @param data {object} Extra texture atlas data.
         * @param atlasData {object} Texture atlas frames data.
         */
        public addTextureAtlas(key: string, url: string, data, atlasData, format: number) {

            this._images[key] = { url: url, data: data, spriteSheet: true };

            if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY)
            {
                this._images[key].frameData = AnimationLoader.parseJSONData(this._game, atlasData);
            }
            else if (format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
            {
                this._images[key].frameData = AnimationLoader.parseXMLData(this._game, atlasData, format);
            }

        }

        /**
         * Add a new image.
         * @param key {string} Asset key for the image.
         * @param url {string} URL of this image file.
         * @param data {object} Extra image data.
         */
        public addImage(key: string, url: string, data) {

            this._images[key] = { url: url, data: data, spriteSheet: false };

        }

        /**
         * Add a new sound.
         * @param key {string} Asset key for the sound.
         * @param url {string} URL of this sound file.
         * @param data {object} Extra sound data.
         */
        public addSound(key: string, url: string, data, webAudio: bool = true, audioTag: bool = false) {

            console.log('Cache addSound: ' + key + ' url: ' + url, webAudio, audioTag);

            var locked: bool = this._game.sound.touchLocked;
            var decoded: bool = false;

            if (audioTag) {
                decoded = true;
            }

            this._sounds[key] = { url: url, data: data, locked: locked, isDecoding: false, decoded: decoded, webAudio: webAudio, audioTag: audioTag };

        }

        public reloadSound(key: string) {

            console.log('reloadSound', key);

            if (this._sounds[key])
            {
                this._sounds[key].data.src = this._sounds[key].url;
                this._sounds[key].data.addEventListener('canplaythrough', () => this.reloadSoundComplete(key), false);
                this._sounds[key].data.load();
            }

        }

        public onSoundUnlock: Phaser.Signal = new Phaser.Signal;

        public reloadSoundComplete(key: string) {

            console.log('reloadSoundComplete', key);

            if (this._sounds[key])
            {
                this._sounds[key].locked = false;
                this.onSoundUnlock.dispatch(key);
            }

        }

        public updateSound(key: string, property: string, value) {

            if (this._sounds[key])
            {
                this._sounds[key][property] = value;
            }

        }

        /**
         * Add a new decoded sound.
         * @param key {string} Asset key for the sound.
         * @param data {object} Extra sound data.
         */
        public decodedSound(key: string, data) {

            console.log('decoded sound', key);
            this._sounds[key].data = data;
            this._sounds[key].decoded = true;
            this._sounds[key].isDecoding = false;

        }

        /**
         * Add a new text data.
         * @param key {string} Asset key for the text data.
         * @param url {string} URL of this text data file.
         * @param data {object} Extra text data.
         */
        public addText(key: string, url: string, data) {

            this._text[key] = { url: url, data: data };

        }

        /**
         * Get canvas by key.
         * @param key Asset key of the canvas you want.
         * @return {object} The canvas you want.
         */
        public getCanvas(key: string) {

            if (this._canvases[key])
            {
                return this._canvases[key].canvas;
            }

            return null;

        }

        /**
         * Get image data by key.
         * @param key Asset key of the image you want.
         * @return {object} The image data you want.
         */
        public getImage(key: string) {

            if (this._images[key])
            {
                return this._images[key].data;
            }

            return null;

        }

        /**
         * Get frame data by key.
         * @param key Asset key of the frame data you want.
         * @return {object} The frame data you want.
         */
        public getFrameData(key: string): FrameData {

            if (this._images[key] && this._images[key].spriteSheet == true)
            {
                return this._images[key].frameData;
            }

            return null;

        }

        /**
         * Get sound by key.
         * @param key Asset key of the sound you want.
         * @return {object} The sound you want.
         */
        public getSound(key: string) {

            if (this._sounds[key])
            {
                return this._sounds[key];
            }

            return null;

        }

        /**
         * Get sound data by key.
         * @param key Asset key of the sound you want.
         * @return {object} The sound data you want.
         */
        public getSoundData(key: string) {

            if (this._sounds[key])
            {
                return this._sounds[key].data;
            }

            return null;

        }

        /**
         * Check whether an asset is decoded sound.
         * @param key Asset key of the sound you want.
         * @return {object} The sound data you want.
         */
        public isSoundDecoded(key: string): bool {

            if (this._sounds[key])
            {
                return this._sounds[key].decoded;
            }

        }

        /**
         * Check whether an asset is decoded sound.
         * @param key Asset key of the sound you want.
         * @return {object} The sound data you want.
         */
        public isSoundReady(key: string): bool {

            if (this._sounds[key] && this._sounds[key].decoded == true && this._sounds[key].locked == false)
            {
                return true;
            }

            return false;

        }

        /**
         * Check whether an asset is sprite sheet.
         * @param key Asset key of the sprite sheet you want.
         * @return {object} The sprite sheet data you want.
         */
        public isSpriteSheet(key: string): bool {

            if (this._images[key])
            {
                return this._images[key].spriteSheet;
            }

        }

        /**
         * Get text data by key.
         * @param key Asset key of the text data you want.
         * @return {object} The text data you want.
         */
        public getText(key: string) {

            if (this._text[key])
            {
                return this._text[key].data;
            }

            return null;

        }

        /**
         * Returns an array containing all of the keys of Images in the Cache.
         * @return {Array} The string based keys in the Cache.
         */
        public getImageKeys() {

            var output = [];

            for (var item in this._images)
            {
                output.push(item);
            }

            return output;

        }

        /**
         * Returns an array containing all of the keys of Sounds in the Cache.
         * @return {Array} The string based keys in the Cache.
         */
        public getSoundKeys() {

            var output = [];

            for (var item in this._sounds)
            {
                output.push(item);
            }

            return output;

        }

        /**
         * Returns an array containing all of the keys of Text Files in the Cache.
         * @return {Array} The string based keys in the Cache.
         */
        public getTextKeys() {

            var output = [];

            for (var item in this._text)
            {
                output.push(item);
            }

            return output;

        }

        public removeCanvas(key: string) {
            delete this._canvases[key];
        }

        public removeImage(key: string) {
            delete this._images[key];
        }

        public removeSound(key: string) {
            delete this._sounds[key];
        }

        public removeText(key: string) {
            delete this._text[key];
        }

        /**
         * Clean up cache memory.
         */
        public destroy() {

            for (var item in this._canvases)
            {
                delete this._canvases[item['key']];
            }

            for (var item in this._images)
            {
                delete this._images[item['key']];
            }

            for (var item in this._sounds)
            {
                delete this._sounds[item['key']];
            }

            for (var item in this._text)
            {
                delete this._text[item['key']];
            }

        }

    }

}