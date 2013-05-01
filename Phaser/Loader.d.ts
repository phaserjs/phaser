/// <reference path="Game.d.ts" />
module Phaser {
    class Loader {
        constructor(game: Game, callback);
        private _game;
        private _keys;
        private _fileList;
        private _gameCreateComplete;
        private _onComplete;
        private _onFileLoad;
        private _progressChunk;
        private _xhr;
        private _queueSize;
        public hasLoaded: bool;
        public progress: number;
        public reset(): void;
        public queueSize : number;
        public addImageFile(key: string, url: string): void;
        public addSpriteSheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax?: number): void;
        public addTextureAtlas(key: string, url: string, jsonURL?: string, jsonData?): void;
        public addAudioFile(key: string, url: string): void;
        public addTextFile(key: string, url: string): void;
        public removeFile(key: string): void;
        public removeAll(): void;
        public load(onFileLoadCallback?, onCompleteCallback?): void;
        private loadFile();
        private fileError(key);
        private fileComplete(key);
        private jsonLoadComplete(key);
        private jsonLoadError(key);
        private nextFile(previousKey, success);
        private checkKeyExists(key);
    }
}
