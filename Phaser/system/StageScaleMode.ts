/// <reference path="../Game.ts" />

/**
* Phaser - StageScaleMode
*
* This class controls the scaling of your game. On mobile devices it will also remove the URL bar and allow
* you to maintain proportion and aspect ratio.
* The resizing method is based on a technique taken from Viewporter v2.0 by Zynga Inc. http://github.com/zynga/viewporter
*/

module Phaser {

    export class StageScaleMode {

        /**
         * StageScaleMode constructor
         */
        constructor(game: Game, width: number, height: number) {

            this._game = game;

            this.enterLandscape = new Phaser.Signal();
            this.enterPortrait = new Phaser.Signal();

            if (window['orientation'])
            {
                this.orientation = window['orientation'];
            }
            else
            {
                if (window.outerWidth > window.outerHeight)
                {
                    this.orientation = 90;
                }
                else
                {
                    this.orientation = 0;
                }
            }

            this.scaleFactor = new Vec2(1, 1);
            this.aspectRatio = 0;
            this.minWidth = width;
            this.minHeight = height;
            this.maxWidth = width;
            this.maxHeight = height;

            window.addEventListener('orientationchange', (event) => this.checkOrientation(event), false);
            window.addEventListener('resize', (event) => this.checkResize(event), false);

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;

        /**
         * Stage height when start the game.
         * @type {number}
         */
        private _startHeight: number = 0;
        private _iterations: number;
        private _check;

        /**
         * Specifies that the game be visible in the specified area without trying to preserve the original aspect ratio.
         * @type {number}
         */
        public static EXACT_FIT: number = 0;

        /**
         * Specifies that the size of the game be fixed, so that it remains unchanged even if the size of the window changes.
         * @type {number}
         */
        public static NO_SCALE: number = 1;

        /**
         * Specifies that the entire game be visible in the specified area without distortion while maintaining the original aspect ratio.
         * @type {number}
         */
        public static SHOW_ALL: number = 2;

        /**
         * If the game should be forced to use Landscape mode, this is set to true by Game.Stage
         * @type {Boolean}
         */
        public forceLandscape: bool = false;

        /**
         * If the game should be forced to use Portrait mode, this is set to true by Game.Stage
         * @type {Boolean}
         */
        public forcePortrait: bool = false;

        /**
         * If the game should be forced to use a specific orientation and the device currently isn't in that orientation this is set to true.
         * @type {Boolean}
         */
        public incorrectOrientation: bool = false;

        /**
         * If you wish to align your game in the middle of the page then you can set this value to true.
         * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
         * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
         * @type {Boolean}
         */
        public pageAlignHorizontally: bool = false;

        /**
         * If you wish to align your game in the middle of the page then you can set this value to true.
         * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
         * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
         * @type {Boolean}
         */
        public pageAlignVeritcally: bool = false;

        /**
         * Minimum width the canvas should be scaled to (in pixels)
         * @type {number}
         */
        public minWidth: number = null;

        /**
         * Maximum width the canvas should be scaled to (in pixels).
         * If null it will scale to whatever width the browser can handle.
         * @type {number}
         */
        public maxWidth: number = null;

        /**
         * Minimum height the canvas should be scaled to (in pixels)
         * @type {number}
         */
        public minHeight: number = null;

        /**
         * Maximum height the canvas should be scaled to (in pixels).
         * If null it will scale to whatever height the browser can handle.
         * @type {number}
         */
        public maxHeight: number = null;

        /**
         * Width of the stage after calculation.
         * @type {number}
         */
        public width: number = 0;

        /**
         * Height of the stage after calculation.
         * @type {number}
         */
        public height: number = 0;

        /**
         * Asperct ratio of the scaled game size (width / height)
         * @type {number}
         */
        public aspectRatio: number;

        /**
         * The scale factor of the scaled game width
         * @type {Vec2}
         */
        public scaleFactor: Vec2;

        /**
         * Window orientation angle (90 and -90 are landscape, 0 and 80 are portrait)
         * @type {number}
         */
        public orientation: number;

        /**
         * A Signal that is dispatched when the device enters landscape orientation from portrait
         * @type {Signal}
         */
        public enterLandscape: Phaser.Signal;

        /**
         * A Signal that is dispatched when the device enters portrait orientation from landscape
         * @type {Signal}
         */
        public enterPortrait: Phaser.Signal;

        //  Full Screen API calls
        public get isFullScreen(): bool {

            if (document['fullscreenElement'] === null|| document['mozFullScreenElement'] === null|| document['webkitFullscreenElement'] === null)
            {
                return false;
            }

            return true;

        }

        public startFullScreen() {

            if (this.isFullScreen)
            {
                return;
            }

            var element = this._game.stage.canvas;

            if (element['requestFullScreen'])
            {
                element['requestFullScreen']();
            }
            else if(element['mozRequestFullScreen'])
            {
                element['mozRequestFullScreen']();
            }
            else if (element['webkitRequestFullScreen'])
            {
                element['webkitRequestFullScreen']();
            }

        }

        public stopFullScreen() {

            if (document['cancelFullScreen'])
            {
                document['cancelFullScreen']();
            }
            else if (document['mozCancelFullScreen'])
            {
                document['mozCancelFullScreen']();
            }
            else if (document['webkitCancelFullScreen'])
            {
                document['webkitCancelFullScreen']();
            }

        }

        /**
         * The core update loop, called by Phaser.Stage
         */
        public update() {

            if (this._game.stage.scaleMode !== StageScaleMode.NO_SCALE && (window.innerWidth !== this.width || window.innerHeight !== this.height))
            {
                this.refresh();
            }

            if (this.forceLandscape || this.forcePortrait)
            {
                this.checkOrientationState();
            }

        }

        private checkOrientationState() {

            //  They are in the wrong orientation
            if (this.incorrectOrientation)
            {
                if ((this.forceLandscape && window.innerWidth > window.innerHeight) || (this.forcePortrait && window.innerHeight > window.innerWidth))
                {
                    //  Back to normal
                    this._game.paused = false;
                    this.incorrectOrientation = false;
                    this.refresh();
                }
            }
            else
            {
                if ((this.forceLandscape && window.innerWidth < window.innerHeight) || (this.forcePortrait && window.innerHeight < window.innerWidth))
                {
                    //  Show orientation screen
                    this._game.paused = true;
                    this.incorrectOrientation = true;
                    this.refresh();
                }
            }

        }

        public get isPortrait(): bool {
            return this.orientation == 0 || this.orientation == 180;
        }

        public get isLandscape(): bool {
            return this.orientation === 90 || this.orientation === -90;
        }

        /**
         * Handle window.orientationchange events
         */
        private checkOrientation(event) {

            this.orientation = window['orientation'];

            if (this.isLandscape)
            {
                this.enterLandscape.dispatch(this.orientation, true, false);
            }
            else
            {
                this.enterPortrait.dispatch(this.orientation, false, true);
            }

            if (this._game.stage.scaleMode !== StageScaleMode.NO_SCALE)
            {
                this.refresh();
            }

        }

        /**
         * Handle window.resize events
         */
        private checkResize(event) {

            if (window.outerWidth > window.outerHeight)
            {
                this.orientation = 90;
            }
            else
            {
                this.orientation = 0;
            }

            if (this.isLandscape)
            {
                this.enterLandscape.dispatch(this.orientation, true, false);
            }
            else
            {
                this.enterPortrait.dispatch(this.orientation, false, true);
            }

            if (this._game.stage.scaleMode !== StageScaleMode.NO_SCALE)
            {
                this.refresh();
            }

        }

        /**
         * Re-calculate scale mode and update screen size.
         */
        private refresh() {

            //  We can't do anything about the status bars in iPads, web apps or desktops
            if (this._game.device.iPad == false && this._game.device.webApp == false && this._game.device.desktop == false)
            {
                document.documentElement.style.minHeight = '5000px';

                this._startHeight = window.innerHeight;

                if (this._game.device.android && this._game.device.chrome == false)
                {
                    window.scrollTo(0, 1);
                }
                else
                {
                    window.scrollTo(0, 0);
                }
            }

            if (this._check == null)
            {
                this._iterations = 40;
                this._check = window.setInterval(() => this.setScreenSize(), 10);
                this.setScreenSize();
            }

        }

        /**
         * Set screen size automatically based on the scaleMode.
         */
        public setScreenSize(force: bool = false) {

            if (this._game.device.iPad == false && this._game.device.webApp == false && this._game.device.desktop == false)
            {
                if (this._game.device.android && this._game.device.chrome == false)
                {
                    window.scrollTo(0, 1);
                }
                else
                {
                    window.scrollTo(0, 0);
                }
            }

            this._iterations--;

            if (force || window.innerHeight > this._startHeight || this._iterations < 0)
            {
                // Set minimum height of content to new window height
                document.documentElement.style.minHeight = window.innerHeight + 'px';

                if (this.incorrectOrientation == true)
                {
                    this.setMaximum();
                }
                else if (this._game.stage.scaleMode == StageScaleMode.EXACT_FIT)
                {
                    this.setExactFit();
                }
                else if (this._game.stage.scaleMode == StageScaleMode.SHOW_ALL)
                {
                    this.setShowAll();
                }

                this.setSize();

                clearInterval(this._check);

                this._check = null;

            }

        }

        private setSize() {

            if (this.incorrectOrientation == false)
            {
                if (this.maxWidth && this.width > this.maxWidth)
                {
                    this.width = this.maxWidth;
                }

                if (this.maxHeight && this.height > this.maxHeight)
                {
                    this.height = this.maxHeight;
                }

                if (this.minWidth && this.width < this.minWidth)
                {
                    this.width = this.minWidth;
                }

                if (this.minHeight && this.height < this.minHeight)
                {
                    this.height = this.minHeight;
                }
            }

            this._game.stage.canvas.style.width = this.width + 'px';
            this._game.stage.canvas.style.height = this.height + 'px';

            this._game.input.scale.setTo(this._game.stage.width / this.width, this._game.stage.height / this.height);

            if (this.pageAlignHorizontally)
            {
                if (this.width < window.innerWidth && this.incorrectOrientation == false)
                {
                    this._game.stage.canvas.style.marginLeft = Math.round((window.innerWidth - this.width) / 2) + 'px';
                }
                else
                {
                    this._game.stage.canvas.style.marginLeft = '0px';
                }
            }

            if (this.pageAlignVeritcally)
            {
                if (this.height < window.innerHeight && this.incorrectOrientation == false)
                {
                    this._game.stage.canvas.style.marginTop = Math.round((window.innerHeight - this.height) / 2) + 'px';
                }
                else
                {
                    this._game.stage.canvas.style.marginTop = '0px';
                }
            }

            this._game.stage.getOffset(this._game.stage.canvas);

            this.aspectRatio = this.width / this.height;
            this.scaleFactor.x = this._game.stage.width / this.width;
            this.scaleFactor.y = this._game.stage.height / this.height;

        }

        private setMaximum() {

            this.width = window.innerWidth;
            this.height = window.innerHeight;

        }

        private setShowAll() {

            var multiplier = Math.min((window.innerHeight / this._game.stage.height), (window.innerWidth / this._game.stage.width));

            this.width = Math.round(this._game.stage.width * multiplier);
            this.height = Math.round(this._game.stage.height * multiplier);

        }

        private setExactFit() {

            if (this.maxWidth && window.innerWidth > this.maxWidth)
            {
                this.width = this.maxWidth;
            }
            else
            {
                this.width = window.innerWidth;
            }

            if (this.maxHeight && window.innerHeight > this.maxHeight)
            {
                this.height = this.maxHeight;
            }
            else
            {
                this.height = window.innerHeight;
            }

        }

    }

}