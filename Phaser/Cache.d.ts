/// <reference path="Game.d.ts" />
module Phaser {
    class Cache {
        constructor(game: Game);
        private _game;
        private _canvases;
        private _images;
        private _sounds;
        private _text;
        public addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
        public addSpriteSheet(key: string, url: string, data, frameWidth: number, frameHeight: number, frameMax: number): void;
        public addTextureAtlas(key: string, url: string, data, jsonData): void;
        public addImage(key: string, url: string, data): void;
        public addSound(key: string, url: string, data): void;
        public decodedSound(key: string, data): void;
        public addText(key: string, url: string, data): void;
        public getCanvas(key: string);
        public getImage(key: string);
        public getFrameData(key: string): FrameData;
        public getSound(key: string);
        public isSoundDecoded(key: string): bool;
        public isSpriteSheet(key: string): bool;
        public getText(key: string);
        public destroy(): void;
    }
}
