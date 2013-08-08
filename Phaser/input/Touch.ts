/// <reference path="../Game.ts" />
/// <reference path="Pointer.ts" />

/**
* Phaser - Touch
*
* The Touch class handles touch interactions with the game and the resulting Pointer objects.
* http://www.w3.org/TR/touch-events/
* https://developer.mozilla.org/en-US/docs/DOM/TouchList
* http://www.html5rocks.com/en/mobile/touchandmouse/
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*/

module Phaser {

    export class Touch {

        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
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

        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: boolean = false;

        /**
        * Custom callback useful for hooking into a 3rd party library. Will be passed the touch event as the only parameter.
        * Callbacks are fired even if this component is disabled and before the event propogation is disabled.
        */
        public callbackContext;
        public touchStartCallback = null;
        public touchMoveCallback = null;
        public touchEndCallback = null;
        public touchEnterCallback = null;
        public touchLeaveCallback = null;
        public touchCancelCallback = null;

        /**
        * A reference to the event handlers to allow removeEventListener support
        */
        public _onTouchStart;
        public _onTouchMove;
        public _onTouchEnd;
        public _onTouchEnter;
        public _onTouchLeave;
        public _onTouchCancel;
        public _documentTouchMove;

        /**
        * Starts the event listeners running
        * @method start
        */
        public start() {

            if (this.game.device.touch)
            {
                this._onTouchStart = (event) => this.onTouchStart(event);
                this._onTouchMove = (event) => this.onTouchMove(event);
                this._onTouchEnd = (event) => this.onTouchEnd(event);
                this._onTouchEnter = (event) => this.onTouchEnter(event);
                this._onTouchLeave = (event) => this.onTouchLeave(event);
                this._onTouchCancel = (event) => this.onTouchCancel(event);
                this._documentTouchMove = (event) => this.consumeTouchMove(event);

                this.game.stage.canvas.addEventListener('touchstart', this._onTouchStart, false);
                this.game.stage.canvas.addEventListener('touchmove', this._onTouchMove, false);
                this.game.stage.canvas.addEventListener('touchend', this._onTouchEnd, false);
                this.game.stage.canvas.addEventListener('touchenter', this._onTouchEnter, false);
                this.game.stage.canvas.addEventListener('touchleave', this._onTouchLeave, false);
                this.game.stage.canvas.addEventListener('touchcancel', this._onTouchCancel, false);

                document.addEventListener('touchmove', this._documentTouchMove, false);
            }

        }

        /**
        * Prevent iOS bounce-back (doesn't work?)
        * @method consumeTouchMove
        * @param {Any} event
        **/
        private consumeTouchMove(event) {
            event.preventDefault();
        }

        /**
        *
        * @method onTouchStart
        * @param {Any} event
        **/
        private onTouchStart(event) {

            if (this.touchStartCallback)
            {
                this.touchStartCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();

            //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
            //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for (var i = 0; i < event.changedTouches.length; i++)
            {
                this.game.input.startPointer(event.changedTouches[i]);
            }

        }

        /**
        * Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
        * Occurs for example on iOS when you put down 4 fingers and the app selector UI appears
        * @method onTouchCancel
        * @param {Any} event
        **/
        private onTouchCancel(event) {

            if (this.touchCancelCallback)
            {
                this.touchCancelCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();

            //  Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
            //  http://www.w3.org/TR/touch-events/#dfn-touchcancel
            for (var i = 0; i < event.changedTouches.length; i++)
            {
                this.game.input.stopPointer(event.changedTouches[i]);
            }

        }

        /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchEnter
        * @param {Any} event
        **/
        private onTouchEnter(event) {

            if (this.touchEnterCallback)
            {
                this.touchEnterCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++)
            {
                //console.log('touch enter');
            }

        }

        /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchLeave
        * @param {Any} event
        **/
        private onTouchLeave(event) {

            if (this.touchLeaveCallback)
            {
                this.touchLeaveCallback.call(this.callbackContext, event);
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++)
            {
                //console.log('touch leave');
            }

        }

        /**
        *
        * @method onTouchMove
        * @param {Any} event
        **/
        private onTouchMove(event) {

            if (this.touchMoveCallback)
            {
                this.touchMoveCallback.call(this.callbackContext, event);
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++)
            {
                this.game.input.updatePointer(event.changedTouches[i]);
            }

        }

        /**
        *
        * @method onTouchEnd
        * @param {Any} event
        **/
        private onTouchEnd(event) {

            if (this.touchEndCallback)
            {
                this.touchEndCallback.call(this.callbackContext, event);
            }

            event.preventDefault();

            //  For touch end its a list of the touch points that have been removed from the surface
            //  https://developer.mozilla.org/en-US/docs/DOM/TouchList

            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for (var i = 0; i < event.changedTouches.length; i++)
            {
                this.game.input.stopPointer(event.changedTouches[i]);
            }

        }

        /**
        * Stop the event listeners
        * @method stop
        */
        public stop() {

            if (this.game.device.touch)
            {
                this.game.stage.canvas.removeEventListener('touchstart', this._onTouchStart);
                this.game.stage.canvas.removeEventListener('touchmove', this._onTouchMove);
                this.game.stage.canvas.removeEventListener('touchend', this._onTouchEnd);
                this.game.stage.canvas.removeEventListener('touchenter', this._onTouchEnter);
                this.game.stage.canvas.removeEventListener('touchleave', this._onTouchLeave);
                this.game.stage.canvas.removeEventListener('touchcancel', this._onTouchCancel);

                document.removeEventListener('touchmove', this._documentTouchMove);
            }

        }

    }

}