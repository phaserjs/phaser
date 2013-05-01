/// <reference path="Phaser.d.ts" />
/// <reference path="Game.d.ts" />
/// <reference path="system/StageScaleMode.d.ts" />
/// <reference path="system/screens/BootScreen.d.ts" />
/// <reference path="system/screens/PauseScreen.d.ts" />
module Phaser {
    class Stage {
        constructor(game: Game, parent: string, width: number, height: number);
        private _game;
        private _bgColor;
        private _bootScreen;
        private _pauseScreen;
        static ORIENTATION_LANDSCAPE: number;
        static ORIENTATION_PORTRAIT: number;
        public bounds: Rectangle;
        public aspectRatio: number;
        public clear: bool;
        public canvas: HTMLCanvasElement;
        public context: CanvasRenderingContext2D;
        public disablePauseScreen: bool;
        public disableBootScreen: bool;
        public offset: Point;
        public scale: StageScaleMode;
        public scaleMode: number;
        public minScaleX: number;
        public maxScaleX: number;
        public minScaleY: number;
        public maxScaleY: number;
        public update(): void;
        private visibilityChange(event);
        private getOffset(element);
        public strokeStyle: string;
        public lineWidth: number;
        public fillStyle: string;
        public saveCanvasValues(): void;
        public restoreCanvasValues(): void;
        public backgroundColor : string;
        public x : number;
        public y : number;
        public width : number;
        public height : number;
        public centerX : number;
        public centerY : number;
        public randomX : number;
        public randomY : number;
    }
}
