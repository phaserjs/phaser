/// <reference path="../Game.ts" />

/**
* Phaser - Mouse
*
* The Mouse class handles mouse interactions with the game and the resulting events.
*/

module Phaser {

    export class Mouse {

        constructor(game: Game) {

            this._game = game;
            this.callbackContext = this._game;

        }

        /**
        * Local private reference to game.
        * @property _game
        * @type {Phaser.Game}
        * @private
        **/
        private _game: Game;

        public static LEFT_BUTTON: number = 0;
        public static MIDDLE_BUTTON: number = 1;
        public static RIGHT_BUTTON: number = 2;

        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: bool = false;

        /**
        * Custom callback useful for hooking into a 3rd party library. Will be passed the mouse event as the only parameter.
        * Callbacks are fired even if this component is disabled and before the event propagation is disabled.
        */
        public callbackContext;
        public mouseDownCallback = null;
        public mouseMoveCallback = null;
        public mouseUpCallback = null;

        /**
        * Starts the event listeners running
        * @method start
        */
        public start() {

            if (this._game.device.android && this._game.device.chrome == false)
            {
                //  Android stock browser fires mouse events even if you preventDefault on the touchStart, so ...
                return;
            }

            this._game.stage.canvas.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event), true);
            this._game.stage.canvas.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event), true);
            this._game.stage.canvas.addEventListener('mouseup', (event: MouseEvent) => this.onMouseUp(event), true);

        }

        /**
         * @param {MouseEvent} event
         */
        public onMouseDown(event: MouseEvent) {

            if (this.mouseDownCallback)
            {
                this.mouseDownCallback.call(this.callbackContext, event);
            }

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            event['identifier'] = 0;

            this._game.input.mousePointer.start(event);

        }

        /**
         * @param {MouseEvent} event
         */
        public onMouseMove(event: MouseEvent) {

            if (this.mouseMoveCallback)
            {
                this.mouseMoveCallback.call(this.callbackContext, event);
            }

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            event['identifier'] = 0;

            this._game.input.mousePointer.move(event);

        }

        /**
         * @param {MouseEvent} event
         */
        public onMouseUp(event: MouseEvent) {

            if (this.mouseUpCallback)
            {
                this.mouseUpCallback.call(this.callbackContext, event);
            }

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            event['identifier'] = 0;

            this._game.input.mousePointer.stop(event);

        }

        /**
        * Stop the event listeners
        * @method stop
        */
        public stop() {

            //this._game.stage.canvas.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event), true);
            //this._game.stage.canvas.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event), true);
            //this._game.stage.canvas.addEventListener('mouseup', (event: MouseEvent) => this.onMouseUp(event), true);

        }

    }

}