/// <reference path="Phaser.ts" />
/// <reference path="Game.ts" />
/// <reference path="system/StageScaleMode.ts" />
/// <reference path="system/screens/BootScreen.ts" />
/// <reference path="system/screens/PauseScreen.ts" />

/**
* Phaser - Stage
*
* The Stage is the canvas on which everything is displayed. This class handles display within the web browser, focus handling,
* resizing, scaling and pause/boot screens.
*/

module Phaser {

    export class Stage {

        constructor(game: Game, parent: string, width: number, height: number) {

            this._game = game;

            this.canvas = <HTMLCanvasElement> document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;

            if (document.getElementById(parent))
            {
                document.getElementById(parent).appendChild(this.canvas);
                document.getElementById(parent).style.overflow = 'hidden';
            }
            else
            {
                document.body.appendChild(this.canvas);
            }

            //  Consume default actions on the canvas
            this.canvas.style.msTouchAction = 'none';
            this.canvas.style['touch-action'] = 'none';

            this.context = this.canvas.getContext('2d');

            this.offset = this.getOffset(this.canvas);
            this.bounds = new Rectangle(this.offset.x, this.offset.y, width, height);
            this.aspectRatio = width / height;
            this.scaleMode = StageScaleMode.NO_SCALE;
            this.scale = new StageScaleMode(this._game);

            this._bootScreen = new BootScreen(this._game);
            this._pauseScreen = new PauseScreen(this._game, width, height);

            document.addEventListener('visibilitychange', (event) => this.visibilityChange(event), false);
            document.addEventListener('webkitvisibilitychange', (event) => this.visibilityChange(event), false);
            window.onblur = (event) => this.visibilityChange(event);
            window.onfocus = (event) => this.visibilityChange(event);

        }

        private _game: Game;
        private _bgColor: string;
        private _bootScreen;
        private _pauseScreen;

        public static ORIENTATION_LANDSCAPE: number = 0;
        public static ORIENTATION_PORTRAIT: number = 1;

        public bounds: Rectangle;
        public aspectRatio: number;
        public clear: bool = true;
        public canvas: HTMLCanvasElement;
        public context: CanvasRenderingContext2D;
        public disablePauseScreen: bool = false;
        public disableBootScreen: bool = false;
        public offset: Point;
        public scale: StageScaleMode;
        public scaleMode: number;

        public minScaleX: number = null;
        public maxScaleX: number = null;
        public minScaleY: number = null;
        public maxScaleY: number = null;

        public update() {

            this.scale.update();

            if (this.clear)
            {
                //  implement dirty rect? could take up more cpu time than it saves. needs benching.
                this.context.clearRect(0, 0, this.width, this.height);
            }

            if (this._game.isRunning == false && this.disableBootScreen == false)
            {
                this._bootScreen.update();
                this._bootScreen.render();
            }

            if (this._game.paused == true && this.disablePauseScreen == false)
            {
                this._pauseScreen.update();
                this._pauseScreen.render();
            }

        }

        private visibilityChange(event) {

            if (this.disablePauseScreen)
            {
                return;
            }

            if (event.type === 'blur' || document['hidden'] === true || document['webkitHidden'] === true)
            {
                if (this._game.paused == false)
                {
                    this._pauseScreen.onPaused();
                    this.saveCanvasValues();
                    this._game.paused = true;
                }
            }
            else if (event.type == 'focus')
            {
                if (this._game.paused == true)
                {
                    this._pauseScreen.onResume();
                    this._game.paused = false;
                    this.restoreCanvasValues();
                }
            }

        }

        private getOffset(element): Point {

            var box = element.getBoundingClientRect();

            var clientTop = element.clientTop || document.body.clientTop || 0;
            var clientLeft = element.clientLeft || document.body.clientLeft || 0;
            var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
            var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;

            return new Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);

        }

        public strokeStyle: string;
        public lineWidth: number;
        public fillStyle: string;

        public saveCanvasValues() {

            this.strokeStyle = this.context.strokeStyle;
            this.lineWidth = this.context.lineWidth;
            this.fillStyle = this.context.fillStyle;

        }

        public restoreCanvasValues() {

            this.context.strokeStyle = this.strokeStyle;
            this.context.lineWidth = this.lineWidth;
            this.context.fillStyle = this.fillStyle;

        }

        public set backgroundColor(color: string) {
            this.canvas.style.backgroundColor = color;
        }

        public get backgroundColor(): string {
            return this._bgColor;
        }

        public get x(): number {
            return this.bounds.x;
        }

        public get y(): number {
            return this.bounds.y;
        }

        public get width(): number {
            return this.bounds.width;
        }

        public get height(): number {
            return this.bounds.height;
        }

        public get centerX(): number {
            return this.bounds.halfWidth;
        }

        public get centerY(): number {
            return this.bounds.halfHeight;
        }

        public get randomX(): number {
            return Math.round(Math.random() * this.bounds.width);
        }

        public get randomY(): number {
            return Math.round(Math.random() * this.bounds.height);
        }

    }

}