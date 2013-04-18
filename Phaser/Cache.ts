/// <reference path="Game.ts" />

/**
* Phaser - Cache
*
* A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
*/

module Phaser {

    export class Cache {

        constructor(game: Game) {

            this._game = game;

            this._canvases = {};
            this._images = {};
            this._sounds = {};
            this._text = {};

        }

        private _game: Game;

        private _canvases;
        private _images;
        private _sounds;
        private _text;

        public addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {

            this._canvases[key] = { canvas: canvas, context: context };

        }

        public addSpriteSheet(key: string, url: string, data, frameWidth: number, frameHeight: number, frameMax: number) {

            this._images[key] = { url: url, data: data, spriteSheet: true, frameWidth: frameWidth, frameHeight: frameHeight };
            this._images[key].frameData = AnimationLoader.parseSpriteSheet(this._game, key, frameWidth, frameHeight, frameMax);

        }

        public addTextureAtlas(key: string, url: string, data, jsonData) {

            this._images[key] = { url: url, data: data, spriteSheet: true };
            this._images[key].frameData = AnimationLoader.parseJSONData(this._game, jsonData);

        }

        public addImage(key: string, url: string, data) {

            this._images[key] = { url: url, data: data, spriteSheet: false };

        }

        public addSound(key: string, url: string, data) {

            this._sounds[key] = { url: url, data: data, decoded: false };

        }

        public decodedSound(key: string, data) {

            this._sounds[key].data = data;
            this._sounds[key].decoded = true;

        }

        public addText(key: string, url: string, data) {

            this._text[key] = { url: url, data: data };

        }

        public getCanvas(key: string) {

            if (this._canvases[key])
            {
                return this._canvases[key].canvas;
            }

            return null;

        }

        public getImage(key: string) {

            if (this._images[key])
            {
                return this._images[key].data;
            }

            return null;

        }

        public getFrameData(key: string): FrameData {

            if (this._images[key] && this._images[key].spriteSheet == true)
            {
                return this._images[key].frameData;
            }

            return null;

        }

        public getSound(key: string) {

            if (this._sounds[key])
            {
                return this._sounds[key].data;
            }

            return null;

        }

        public isSoundDecoded(key: string): bool {

            if (this._sounds[key])
            {
                return this._sounds[key].decoded;
            }

        }

        public isSpriteSheet(key: string): bool {

            if (this._images[key])
            {
                return this._images[key].spriteSheet;
            }

        }

        public getText(key: string) {

            if (this._text[key])
            {
                return this._text[key].data;
            }

            return null;

        }

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