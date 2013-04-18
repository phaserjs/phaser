/// <reference path="Phaser.ts" />
/// <reference path="Game.ts" />
/// <reference path="system/StageScaleMode.ts" />

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

            this.context = this.canvas.getContext('2d');

            this.offset = this.getOffset(this.canvas);
            this.bounds = new Rectangle(this.offset.x, this.offset.y, width, height);
            this.aspectRatio = width / height;
            this.scaleMode = StageScaleMode.NO_SCALE;
            this.scale = new StageScaleMode(this._game);

            //document.addEventListener('visibilitychange', (event) => this.visibilityChange(event), false);
            //document.addEventListener('webkitvisibilitychange', (event) => this.visibilityChange(event), false);
            window.onblur = (event) => this.visibilityChange(event);
            window.onfocus = (event) => this.visibilityChange(event);

        }

        private _game: Game;
        private _bgColor: string;


        public static ORIENTATION_LANDSCAPE: number = 0;
        public static ORIENTATION_PORTRAIT: number = 1;

        public bounds: Rectangle;
        public aspectRatio: number;
        public clear: bool = true;
        public canvas: HTMLCanvasElement;
        public context: CanvasRenderingContext2D;
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

        }

        public renderDebugInfo() {

            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.fillText(Phaser.VERSION, 10, 20);
            this.context.fillText('Game Size: ' + this.width + ' x ' + this.height, 10, 40);
            this.context.fillText('x: ' + this.x + ' y: ' + this.y, 10, 60);

        }

        private visibilityChange(event) {

            if (event.type == 'blur' && this._game.paused == false && this._game.isBooted == true)
            {
                this._game.paused = true;
                this.drawPauseScreen();
            }
            else if (event.type == 'focus')
            {
                this._game.paused = false;
            }

            //if (document['hidden'] === true || document['webkitHidden'] === true)

        }

        public drawInitScreen() {

            this.context.fillStyle = 'rgb(40, 40, 40)';
            this.context.fillRect(0, 0, this.width, this.height);

            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.font = 'bold 18px Arial';
            this.context.textBaseline = 'top';
            this.context.fillText(Phaser.VERSION, 54, 32);
            this.context.fillText('Game Size: ' + this.width + ' x ' + this.height, 32, 64);
            this.context.fillText('www.photonstorm.com', 32, 96);
            this.context.font = '16px Arial';
            this.context.fillText('You are seeing this screen because you didn\'t specify any default', 32, 160);
            this.context.fillText('functions in the Game constructor, or use Game.loadState()', 32, 184);

            var image = new Image();
            var that = this;

            image.onload = function () {
                that.context.drawImage(image, 32, 32);
            };

            image.src = this._logo;

        }

        private drawPauseScreen() {

            this.saveCanvasValues();

            this.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.context.fillRect(0, 0, this.width, this.height);

            //  Draw a 'play' arrow
            var arrowWidth = Math.round(this.width / 2);
            var arrowHeight = Math.round(this.height / 2);

            var sx = this.centerX - arrowWidth / 2;
            var sy = this.centerY - arrowHeight / 2;

            this.context.beginPath();
            this.context.moveTo(sx, sy);
            this.context.lineTo(sx, sy + arrowHeight);
            this.context.lineTo(sx + arrowWidth, this.centerY);
            this.context.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.context.fill();
            this.context.closePath();

            this.restoreCanvasValues();

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

        private _logo: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAO1JREFUeNpi/P//PwM6YGRkxBQEAqBaRnQxFmwa10d6MAjrMqMofHv5L1we2SBGmAtAktg0ogOQQYHLd8ANYYFpPtTmzUAMAFmwnsEDrAdkCAvMZlIAsiFMMAEYsKvaSrQhIMCELkGsV2AAbIC8gCQYgwKIUABiNYBf9yoYH7n7n6CzN274g2IYEyFbsNmKLIaSkHpP7WSwUfbA0ASzFQRslBlxp0RcAF0TRhggA3zhAJIDpUKU5A9KyshpHDkjFZu5g2nJMFcwXVJSgqIGnBKx5bKenh4w/XzVbgbPtlIUcVgSxuoCUgHIIIAAAwArtXwJBABO6QAAAABJRU5ErkJggg==";

    }

}