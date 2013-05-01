/// <reference path="Game.d.ts" />
/// <reference path="system/Sound.d.ts" />
module Phaser {
    class SoundManager {
        constructor(game: Game);
        private _game;
        private _context;
        private _gainNode;
        private _volume;
        public mute(): void;
        public unmute(): void;
        public volume : number;
        public decode(key: string, callback?, sound?: Sound): void;
        public play(key: string, volume?: number, loop?: bool): Sound;
    }
}
