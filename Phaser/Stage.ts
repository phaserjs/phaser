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

        /**
         * Stage constructor
         *
         * Create a new <code>Stage</code> with specific width and height.
         *
         * @param parent {number} ID of parent DOM element.
         * @param width {number} Width of the stage.
         * @param height {number} Height of the stage.
         */
        constructor(game: Game, parent: string, width: number, height: number) {

            this._game = game;

            this.canvas = <HTMLCanvasElement> document.createElement('canvas');
            this.canvas.id = 'bob';
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
            this.canvas.style['ms-touch-action'] = 'none';
            this.canvas.style['touch-action'] = 'none';
            this.canvas.style.backgroundColor = 'rgb(0,0,0)';

            this.context = this.canvas.getContext('2d');

            this.offset = this.getOffset(this.canvas);
            this.bounds = new Quad(this.offset.x, this.offset.y, width, height);
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

        /**
         * Local private reference to game.
         */
        private _game: Game;

        /**
         * Background color of the stage (defaults to black)
         * @type {string}
         */
        private _bgColor: string = 'rgb(0,0,0)';

        /**
         * This will be displayed when Phaser is started without any default functions or State
         * @type {BootScreen}
         */
        private _bootScreen;

        /**
         * This will be displayed whenever the game loses focus or the player switches to another browser tab.
         * @type {PauseScreen}
         */
        private _pauseScreen;

        /**
         * Bound of this stage.
         * @type {Quad}
         */
        public bounds: Quad;

        /**
         * Asperct ratio, thus: width / height.
         * @type {number}
         */
        public aspectRatio: number;

        /**
         * Clear the whole stage every frame? (Default to true)
         * @type {boolean}
         */
        public clear: bool = true;

        /**
         * Canvas element used by engine.
         * @type {HTMLCanvasElement}
         */
        public canvas: HTMLCanvasElement;

        /**
         * Render context of stage's canvas.
         * @type {CanvasRenderingContext2D}
         */
        public context: CanvasRenderingContext2D;

        /**
         * Do not use pause screen when game is paused?
         * (Default to false, aka always use PauseScreen)
         * @type {boolean}
         */
        public disablePauseScreen: bool = false;

        /**
         * Do not use boot screen when engine starts?
         * (Default to false, aka always use BootScreen)
         * @type {boolean}
         */
        public disableBootScreen: bool = false;

        /**
         * Offset from this stage to the canvas element.
         * @type {MicroPoint}
         */
        public offset: MicroPoint;

        /**
         * This object manages scaling of the game, see(StageScaleMode).
         * @type {StageScaleMode}
         */
        public scale: StageScaleMode;

        /**
         * Which mode will the game be scaled.
         * Available: StageScaleMode.EXACT_FIT, StageScaleMode.NO_SCALE, StageScaleMode.SHOW_ALL.
         * @type {number}
         */
        public scaleMode: number;

        /**
         * Update stage for rendering. This will handle scaling, clearing
         * and PauseScreen/BootScreen updating and rendering.
         */
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

        /**
         * This method is called when the canvas elements visibility is changed.
         */
        private visibilityChange(event) {

            if (this.disablePauseScreen)
            {
                return;
            }

            if (event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true)
            {
                if (this._game.paused == false)
                {
                    this._pauseScreen.onPaused();
                    this.saveCanvasValues();
                    this._game.paused = true;
                }
            }
            else
            {
                if (this._game.paused == true)
                {
                    this._pauseScreen.onResume();
                    this._game.paused = false;
                    this.restoreCanvasValues();
                }
            }

        }

        private getOffset(element): MicroPoint {

            var box = element.getBoundingClientRect();

            var clientTop = element.clientTop || document.body.clientTop || 0;
            var clientLeft = element.clientLeft || document.body.clientLeft || 0;
            var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
            var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;

            return new MicroPoint(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);

        }

        /**
         * Canvas strokeStyle.
         * @type {string}
         */
        public strokeStyle: string;

        /**
         * Canvas lineWidth.
         * @type {number}
         */
        public lineWidth: number;

        /**
         * Canvas fillStyle.
         * @type {string}
         */
        public fillStyle: string;

        /**
         * Save current canvas properties (strokeStyle, lineWidth and fillStyle) for later using.
         */
        public saveCanvasValues() {

            this.strokeStyle = this.context.strokeStyle;
            this.lineWidth = this.context.lineWidth;
            this.fillStyle = this.context.fillStyle;

        }

        /**
         * Restore current canvas values (strokeStyle, lineWidth and fillStyle) with saved values.
         */
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