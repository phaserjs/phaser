/// <reference path="../../Game.ts" />

/**
* Phaser - Mouse
*
* The Mouse class handles mouse interactions with the game and the resulting events.
*/

module Phaser {

    export class Mouse {

        constructor(game: Game) {

            this._game = game;

        }

        private _game: Game;

        private _x: number = 0;
        private _y: number = 0;

        public button: number;

        public static LEFT_BUTTON: number = 0;
        public static MIDDLE_BUTTON: number = 1;
        public static RIGHT_BUTTON: number = 2;

        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: bool = false;

        /**
         * @type {Boolean}
         */
        public isDown: bool = false;

        /**
         * @type {Boolean}
         */
        public isUp: bool = true;

        /**
         * @type {Number}
         */
        public timeDown: number = 0;

        /**
         * @type {Number}
         */
        public duration: number = 0;

        /**
         * @type {Number}
         */
        public timeUp: number = 0;

        public start() {

            this._game.stage.canvas.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event), true);
            this._game.stage.canvas.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event), true);
            this._game.stage.canvas.addEventListener('mouseup', (event: MouseEvent) => this.onMouseUp(event), true);

        }

        public reset() {

            this.isDown = false;
            this.isUp = true;

        }

        /**
         * @param {MouseEvent} event
         */
        public onMouseDown(event: MouseEvent) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            this.button = event.button;

            this._x = event.clientX - this._game.stage.x;
            this._y = event.clientY - this._game.stage.y;

            this._game.input.x = this._x * this._game.input.scaleX;
            this._game.input.y = this._y * this._game.input.scaleY;

            this.isDown = true;
            this.isUp = false;
            this.timeDown = this._game.time.now;

            this._game.input.onDown.dispatch(this._game.input.x, this._game.input.y, this.timeDown);

        }

        public update() {

            //this._game.input.x = this._x * this._game.input.scaleX;
            //this._game.input.y = this._y * this._game.input.scaleY;

            if (this.isDown)
            {
                this.duration = this._game.time.now - this.timeDown;
            }

        }

        /**
         * @param {MouseEvent} event
         */
        public onMouseMove(event: MouseEvent) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            this.button = event.button;

            this._x = event.clientX - this._game.stage.x;
            this._y = event.clientY - this._game.stage.y;

            this._game.input.x = this._x * this._game.input.scaleX;
            this._game.input.y = this._y * this._game.input.scaleY;

        }

        /**
         * @param {MouseEvent} event
         */
        public onMouseUp(event: MouseEvent) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            this.button = event.button;
            this.isDown = false;
            this.isUp = true;
            this.timeUp = this._game.time.now;
            this.duration = this.timeUp - this.timeDown;

            this._x = event.clientX - this._game.stage.x;
            this._y = event.clientY - this._game.stage.y;

            this._game.input.x = this._x * this._game.input.scaleX;
            this._game.input.y = this._y * this._game.input.scaleY;

            this._game.input.onUp.dispatch(this._game.input.x, this._game.input.y, this.timeDown);

        }

    }

}