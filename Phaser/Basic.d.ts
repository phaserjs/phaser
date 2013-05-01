/// <reference path="Game.d.ts" />
module Phaser {
    class Basic {
        constructor(game: Game);
        public _game: Game;
        public name: string;
        public ID: number;
        public isGroup: bool;
        public exists: bool;
        public active: bool;
        public visible: bool;
        public alive: bool;
        public ignoreDrawDebug: bool;
        public destroy(): void;
        public preUpdate(): void;
        public update(): void;
        public postUpdate(): void;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): void;
        public kill(): void;
        public revive(): void;
        public toString(): string;
    }
}
