/**
* Phaser - Touch
*
* The Touch class handles touch interactions with the game and the resulting Pointer objects.
* http://www.w3.org/TR/touch-events/
* https://developer.mozilla.org/en-US/docs/DOM/TouchList
* http://www.html5rocks.com/en/mobile/touchandmouse/
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*/
Phaser.Touch = function (game) {

	this.game = game;
    this.callbackContext = this.game;

    this.touchStartCallback = null;
    this.touchMoveCallback = null;
    this.touchEndCallback = null;
    this.touchEnterCallback = null;
    this.touchLeaveCallback = null;
    this.touchCancelCallback = null;

};

Phaser.Touch.prototype = {

	game: null,

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @type {bool}
    */
	disabled: false,

	_onTouchStart: null,
	_onTouchMove: null,
	_onTouchEnd: null,
	_onTouchEnter: null,
	_onTouchLeave: null,
	_onTouchCancel: null,
	_onTouchMove: null,

	/**
    * Starts the event listeners running
    * @method start
    */
    start: function () {

        var _this = this;

        if (this.game.device.touch)
        {
            this._onTouchStart = function (event) {
                return _this.onTouchStart(event);
            };

            this._onTouchMove = function (event) {
                return _this.onTouchMove(event);
            };

            this._onTouchEnd = function (event) {
                return _this.onTouchEnd(event);
            };

            this._onTouchEnter = function (event) {
                return _this.onTouchEnter(event);
            };

            this._onTouchLeave = function (event) {
                return _this.onTouchLeave(event);
            };

            this._onTouchCancel = function (event) {
                return _this.onTouchCancel(event);
            };

            this._documentTouchMove = function (event) {
                return _this.consumeTouchMove(event);
            };

            this.game.renderer.view.addEventListener('touchstart', this._onTouchStart, false);
            this.game.renderer.view.addEventListener('touchmove', this._onTouchMove, false);
            this.game.renderer.view.addEventListener('touchend', this._onTouchEnd, false);
            this.game.renderer.view.addEventListener('touchenter', this._onTouchEnter, false);
            this.game.renderer.view.addEventListener('touchleave', this._onTouchLeave, false);
            this.game.renderer.view.addEventListener('touchcancel', this._onTouchCancel, false);

            document.addEventListener('touchmove', this._documentTouchMove, false);
        }

    },

	/**
    * Prevent iOS bounce-back (doesn't work?)
    * @method consumeTouchMove
    * @param {Any} event
    **/
    consumeTouchMove: function (event) {

        event.preventDefault();

    },

	/**
    *
    * @method onTouchStart
    * @param {Any} event
    **/
    onTouchStart: function (event) {

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

    },

	/**
    * Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
    * Occurs for example on iOS when you put down 4 fingers and the app selector UI appears
    * @method onTouchCancel
    * @param {Any} event
    **/
    onTouchCancel: function (event) {

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

    },

	/**
    * For touch enter and leave its a list of the touch points that have entered or left the target
    * Doesn't appear to be supported by most browsers on a canvas element yet
    * @method onTouchEnter
    * @param {Any} event
    **/
    onTouchEnter: function (event) {

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

    },

	/**
    * For touch enter and leave its a list of the touch points that have entered or left the target
    * Doesn't appear to be supported by most browsers on a canvas element yet
    * @method onTouchLeave
    * @param {Any} event
    **/    
    onTouchLeave: function (event) {

        if (this.touchLeaveCallback)
        {
            this.touchLeaveCallback.call(this.callbackContext, event);
        }

        event.preventDefault();

        for (var i = 0; i < event.changedTouches.length; i++)
        {
            //console.log('touch leave');
        }

    },

	/**
    *
    * @method onTouchMove
    * @param {Any} event
    **/
    onTouchMove: function (event) {

        if (this.touchMoveCallback)
        {
            this.touchMoveCallback.call(this.callbackContext, event);
        }

        event.preventDefault();

        for (var i = 0; i < event.changedTouches.length; i++)
        {
            this.game.input.updatePointer(event.changedTouches[i]);
        }

    },

	/**
    *
    * @method onTouchEnd
    * @param {Any} event
    **/
    onTouchEnd: function (event) {

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

    },

	/**
    * Stop the event listeners
    * @method stop
    */
    stop: function () {

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

};