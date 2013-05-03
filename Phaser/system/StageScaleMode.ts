/// <reference path="../Game.ts" />

/**
* Phaser - StageScaleMode
*
* This class controls the scaling of your game. On mobile devices it will also remove the URL bar and allow
* you to maintain proportion and aspect ratio.
* It is based on a technique taken from Viewporter v2.0 by Zynga Inc. http://github.com/zynga/viewporter
*/

module Phaser {

    export class StageScaleMode {

        /**
         * StageScaleMode constructor
         */
        constructor(game: Game) {

            this._game = game;

            this.orientation = window['orientation'];

            window.addEventListener('orientationchange', (event) => this.checkOrientation(event), false);

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
         * Game orientation angel.
         * @type {number}
         */
        public orientation;

        public update() {

            if (this._game.stage.scaleMode !== StageScaleMode.NO_SCALE && (window.innerWidth !== this.width || window.innerHeight !== this.height))
            {
                this.refresh();
            }

        }

        public get isLandscape(): bool {
            return window['orientation'] === 90 || window['orientation'] === -90;
        }

        /**
         * Check whether game orientation the same as window's. Update orientation if not equal.
         */
        private checkOrientation(event) {

            if (window['orientation'] !== this.orientation)
            {
                this.refresh();
                this.orientation = window['orientation'];
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
            }

        }

        /**
         * Set screen size automatically based on stage's scaleMode.
         */
        private setScreenSize() {

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

            if (window.innerHeight > this._startHeight || this._iterations < 0)
            {
                // Set minimum height of content to new window height
                document.documentElement.style.minHeight = window.innerHeight + 'px';

                if (this._game.stage.scaleMode == StageScaleMode.EXACT_FIT)
                {
                    if (this._game.stage.maxScaleX && window.innerWidth > this._game.stage.maxScaleX)
                    {
                        this.width = this._game.stage.maxScaleX;
                    }
                    else
                    {
                        this.width = window.innerWidth;
                    }

                    if (this._game.stage.maxScaleY && window.innerHeight > this._game.stage.maxScaleY)
                    {
                        this.height = this._game.stage.maxScaleY;
                    }
                    else
                    {
                        this.height = window.innerHeight;
                    }
                }
                else if (this._game.stage.scaleMode == StageScaleMode.SHOW_ALL)
                    {
                    var multiplier = Math.min((window.innerHeight / this._game.stage.height), (window.innerWidth / this._game.stage.width));

                    this.width = Math.round(this._game.stage.width * multiplier);
                    this.height = Math.round(this._game.stage.height * multiplier);

                    if (this._game.stage.maxScaleX && this.width > this._game.stage.maxScaleX)
                    {
                        this.width = this._game.stage.maxScaleX;
                    }

                    if (this._game.stage.maxScaleY && this.height > this._game.stage.maxScaleY)
                    {
                        this.height = this._game.stage.maxScaleY;
                    }
                }

                this._game.stage.canvas.style.width = this.width + 'px';
                this._game.stage.canvas.style.height = this.height + 'px';

                this._game.input.scaleX = this._game.stage.width / this.width;
                this._game.input.scaleY = this._game.stage.height / this.height;

                clearInterval(this._check);

                this._check = null;

            }

        }

    }

}