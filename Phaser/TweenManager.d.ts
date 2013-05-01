/// <reference path="Game.d.ts" />
/// <reference path="system/Tween.d.ts" />
module Phaser {
    class TweenManager {
        constructor(game: Game);
        private _game;
        private _tweens;
        public getAll(): Tween[];
        public removeAll(): void;
        public create(object): Tween;
        public add(tween: Tween): Tween;
        public remove(tween: Tween): void;
        public update(): bool;
    }
}
