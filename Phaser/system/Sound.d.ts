/// <reference path="../Game.d.ts" />
/// <reference path="../SoundManager.d.ts" />
module Phaser {
    class Sound {
        constructor(context, gainNode, data, volume?: number, loop?: bool);
        private _context;
        private _gainNode;
        private _localGainNode;
        private _buffer;
        private _volume;
        private _sound;
        public loop: bool;
        public duration: number;
        public isPlaying: bool;
        public isDecoding: bool;
        public setDecodedBuffer(data): void;
        public play(): void;
        public stop(): void;
        public mute(): void;
        public unmute(): void;
        public volume : number;
    }
}
