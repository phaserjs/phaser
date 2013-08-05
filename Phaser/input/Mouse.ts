/// <reference path="../Game.ts" />

/**
* Phaser - Mouse
*
* The Mouse class handles mouse interactions with the game and the resulting events.
*/

module Phaser {

    export class Mouse {

        constructor(game: Game) {

            this.game = game;
            this.callbackContext = this.game;

        }

        /**
        * Local reference to game.
        * @property game
        * @type {Phaser.Game}
        **/
        public game: Game;

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
        * A reference to the event handlers to allow removeEventListener support
        */
        public _onMouseDown;
        public _onMouseMove;
        public _onMouseUp;

        /**
        * Starts the event listeners running
        * @method start
        */
        public start() {

            if (this.game.device.android && this.game.device.chrome == false)
            {
                //  Android stock browser fires mouse events even if you preventDefault on the touchStart, so ...
                return;
            }

            this._onMouseDown = (event: MouseEvent) => this.onMouseDown(event);
            this._onMouseMove = (event: MouseEvent) => this.onMouseMove(event);
            this._onMouseUp = (event: MouseEvent) => this.onMouseUp(event);

            this.game.stage.canvas.addEventListener('mousedown', this._onMouseDown, true);
            this.game.stage.canvas.addEventListener('mousemove', this._onMouseMove, true);
            this.game.stage.canvas.addEventListener('mouseup', this._onMouseUp, true);

        }

        /**
         * @param {MouseEvent} event
         */
        public onMouseDown(event: MouseEvent) {

            if (this.mouseDownCallback)
            {
                this.mouseDownCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled)
            {
                return;
            }

            event['identifier'] = 0;

            this.game.input.mousePointer.start(event);

        }

        /**
         * @param {MouseEvent} event
         */
        public onMouseMove(event: MouseEvent) {

            if (this.mouseMoveCallback)
            {
                this.mouseMoveCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled)
            {
                return;
            }

            event['identifier'] = 0;

            this.game.input.mousePointer.move(event);

        }

        /**
         * @param {MouseEvent} event
         */
        public onMouseUp(event: MouseEvent) {

            if (this.mouseUpCallback)
            {
                this.mouseUpCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled)
            {
                return;
            }

            event['identifier'] = 0;

            this.game.input.mousePointer.stop(event);

        }

        /**
        * Stop the event listeners
        * @method stop
        */
        public stop() {

            this.game.stage.canvas.removeEventListener('mousedown', this._onMouseDown);
            this.game.stage.canvas.removeEventListener('mousemove', this._onMouseMove);
            this.game.stage.canvas.removeEventListener('mouseup', this._onMouseUp);

        }

    }

}