/// <reference path="Phaser.ts" />
/// <reference path="Game.ts" />
/// <reference path="display/CSS3Filters.ts" />
/// <reference path="system/StageScaleMode.ts" />
/// <reference path="system/screens/BootScreen.ts" />
/// <reference path="system/screens/PauseScreen.ts" />
/// <reference path="system/screens/OrientationScreen.ts" />

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

            this.game = game;

            this.canvas = <HTMLCanvasElement> document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;

            if ((parent !== '' || parent !== null) && document.getElementById(parent))
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
            this.canvas.oncontextmenu = function(event) { event.preventDefault(); };

            this.context = this.canvas.getContext('2d');

            this.css3 = new Phaser.Display.CSS3Filters(this.canvas);

            this.scaleMode = StageScaleMode.NO_SCALE;
            this.scale = new StageScaleMode(this.game, width, height);

            this.getOffset(this.canvas);
            this.bounds = new Rectangle(this.offset.x, this.offset.y, width, height);
            this.aspectRatio = width / height;

            document.addEventListener('visibilitychange', (event) => this.visibilityChange(event), false);
            document.addEventListener('webkitvisibilitychange', (event) => this.visibilityChange(event), false);
            document.addEventListener('pagehide', (event) => this.visibilityChange(event), false);
            document.addEventListener('pageshow', (event) => this.visibilityChange(event), false);
            window.onblur = (event) => this.visibilityChange(event);
            window.onfocus = (event) => this.visibilityChange(event);

        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        /**
         * Background color of the stage (defaults to black). Set via the public backgroundColor property.
         * @type {string}
         */
        private _backgroundColor: string = 'rgb(0,0,0)';

        /**
         * This will be displayed when Phaser is started without any default functions or State
         * @type {BootScreen}
         */
        public bootScreen;

        /**
         * This will be displayed whenever the game loses focus or the player switches to another browser tab.
         * @type {PauseScreen}
         */
        public pauseScreen;

        /**
         * This will be displayed whenever the device is turned to an unsupported orientation.
         * @type {OrientationScreen}
         */
        public orientationScreen;

        /**
         * Controls the CSS3 Filters applied to the Stages canvas object.
         * @type {Phaser.Display.CSS3Filters}
         */
        public css3: Phaser.Display.CSS3Filters;

        /**
         * Bound of this stage.
         * @type {Rectangle}
         */
        public bounds: Rectangle;

        /**
         * Asperct ratio, thus: width / height.
         * @type {number}
         */
        public aspectRatio: number;

        /**
         * Clear the whole stage every frame? (Default to true)
         * @type {boolean}
         */
        public clear: boolean = true;

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
        public disablePauseScreen: boolean = false;

        /**
         * Do not use boot screen when engine starts?
         * (Default to false, aka always use BootScreen)
         * @type {boolean}
         */
        public disableBootScreen: boolean = false;

        /**
         * Offset from this stage to the canvas element.
         * @type {MicroPoint}
         */
        public offset: Point;

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
         * If set to true the game will never pause when the browser or browser tab loses focuses
         * @type {boolean}
         */
        public disableVisibilityChange: boolean = false;

        /**
         * Stage boot
         */
        public boot() {

            this.bootScreen = new BootScreen(this.game);
            this.pauseScreen = new PauseScreen(this.game, this.width, this.height);
            this.orientationScreen = new OrientationScreen(this.game);

            this.scale.setScreenSize(true);

        }

        /**
         * Update stage for rendering. This will handle scaling, clearing
         * and PauseScreen/BootScreen updating and rendering.
         */
        public update() {

            this.scale.update();

            this.context.setTransform(1, 0, 0, 1, 0, 0);

            if (this.clear || (this.game.paused && this.disablePauseScreen == false))
            {
                if (this.game.device.patchAndroidClearRectBug)
                {
                    this.context.fillStyle = 'rgb(0,0,0)';
                    this.context.fillRect(0, 0, this.width, this.height);
                }
                else
                {
                    this.context.clearRect(0, 0, this.width, this.height);
                }
            }

            if (this.game.paused && this.scale.incorrectOrientation)
            {
                this.orientationScreen.update();
                this.orientationScreen.render();
                return;
            }

            if (this.game.isRunning == false && this.disableBootScreen == false)
            {
                this.bootScreen.update();
                this.bootScreen.render();
            }

            if (this.game.paused && this.disablePauseScreen == false)
            {
                this.pauseScreen.update();
                this.pauseScreen.render();
            }

        }

        /**
         * This method is called when the canvas elements visibility is changed.
         */
        private visibilityChange(event) {

            if (this.disableVisibilityChange)
            {
                return;
            }

            if (event.type == 'pagehide' || event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true)
            {
                if (this.game.paused == false)
                {
                    this.pauseGame();
                }
            }
            else
            {
                if (this.game.paused == true)
                {
                    this.resumeGame();
                }
            }

        }

        public enableOrientationCheck(forceLandscape: boolean, forcePortrait: boolean, imageKey: string = '') {

            this.scale.forceLandscape = forceLandscape;
            this.scale.forcePortrait = forcePortrait;
            this.orientationScreen.enable(forceLandscape, forcePortrait, imageKey);

            if (forceLandscape || forcePortrait)
            {
                if ((this.scale.isLandscape && forcePortrait) || (this.scale.isPortrait && forceLandscape))
                {
                    //  They are in the wrong orientation right now
                    this.game.paused = true;
                    this.scale.incorrectOrientation = true;
                }
                else
                {
                    this.scale.incorrectOrientation = false;
                }
            }

        }

        public setImageRenderingCrisp() {
            this.canvas.style['image-rendering'] = 'crisp-edges';
            this.canvas.style['image-rendering'] = '-moz-crisp-edges';
            this.canvas.style['image-rendering'] = '-webkit-optimize-contrast';
            this.canvas.style['-ms-interpolation-mode'] = 'nearest-neighbor';
        }

        public pauseGame() {

            this.game.paused = true;

            if (this.disablePauseScreen == false && this.pauseScreen)
            {
                this.pauseScreen.onPaused();
            }

            this.saveCanvasValues();

        }

        public resumeGame() {

            if (this.disablePauseScreen == false && this.pauseScreen)
            {
                this.pauseScreen.onResume();
            }

            this.restoreCanvasValues();

            this.game.paused = false;

        }

        /**
         * Get the DOM offset values of the given element
         */
        public getOffset(element, populateOffset: boolean = true): Point {

            var box = element.getBoundingClientRect();

            var clientTop = element.clientTop || document.body.clientTop || 0;
            var clientLeft = element.clientLeft || document.body.clientLeft || 0;
            var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
            var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;

            if (populateOffset)
            {
                this.offset = new Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
                return this.offset;
            }
            else
            {
                return new Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
            }

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

            if (this.game.device.patchAndroidClearRectBug)
            {
                this.context.fillStyle = 'rgb(0,0,0)';
                this.context.fillRect(0, 0, this.width, this.height);
            }
            else
            {
                this.context.clearRect(0, 0, this.width, this.height);
            }

        }

        public set backgroundColor(color: string) {

            this.canvas.style.backgroundColor = color;
            this._backgroundColor = color;

        }

        public get backgroundColor(): string {
            return this._backgroundColor;
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