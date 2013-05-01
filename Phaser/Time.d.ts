/// <reference path="Game.d.ts" />
module Phaser {
    class Time {
        constructor(game: Game);
        private _game;
        private _started;
        public timeScale: number;
        public elapsed: number;
        public time: number;
        public now: number;
        public delta: number;
        public totalElapsedSeconds : number;
        public fps: number;
        public fpsMin: number;
        public fpsMax: number;
        public msMin: number;
        public msMax: number;
        public frames: number;
        private _timeLastSecond;
        public update(): void;
        public elapsedSince(since: number): number;
        public elapsedSecondsSince(since: number): number;
        public reset(): void;
    }
}
