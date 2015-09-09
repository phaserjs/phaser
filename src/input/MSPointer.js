/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The MSPointer class handles Microsoft touch interactions with the game and the resulting Pointer objects.
*
* It will work only in Internet Explorer 10+ and Windows Store or Windows Phone 8 apps using JavaScript.
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
*
* You should not normally access this class directly, but instead use a Phaser.Pointer object which 
* normalises all game input for you including accurate button handling.
*
* Please note that at the current time of writing Phaser does not yet support chorded button interactions:
* http://www.w3.org/TR/pointerevents/#chorded-button-interactions
*
* @class Phaser.MSPointer
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.MSPointer = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {Phaser.Input} input - A reference to the Phaser Input Manager.
    * @protected
    */
    this.input = game.input;

    /**
    * @property {object} callbackContext - The context under which callbacks are called (defaults to game).
    */
    this.callbackContext = this.game;

    /**
    * @property {function} pointerDownCallback - A callback that can be fired on a MSPointerDown event.
    */
    this.pointerDownCallback = null;

    /**
    * @property {function} pointerMoveCallback - A callback that can be fired on a MSPointerMove event.
    */
    this.pointerMoveCallback = null;

    /**
    * @property {function} pointerUpCallback - A callback that can be fired on a MSPointerUp event.
    */
    this.pointerUpCallback = null;

    /**
    * @property {boolean} capture - If true the Pointer events will have event.preventDefault applied to them, if false they will propagate fully.
    */
    this.capture = true;

    /**
    * This property was removed in Phaser 2.4 and should no longer be used.
    * Instead please see the Pointer button properties such as `Pointer.leftButton`, `Pointer.rightButton` and so on.
    * Or Pointer.button holds the DOM event button value if you require that.
    * @property {number} button
    */
    this.button = -1;

    /**
    * The browser MSPointer DOM event. Will be null if no event has ever been received.
    * Access this property only inside a Pointer event handler and do not keep references to it.
    * @property {MSPointerEvent|null} event
    * @default
    */
    this.event = null;

    /**
    * MSPointer input will only be processed if enabled.
    * @property {boolean} enabled
    * @default
    */
    this.enabled = true;

    /**
    * @property {function} _onMSPointerDown - Internal function to handle MSPointer events.
    * @private
    */
    this._onMSPointerDown = null;

    /**
    * @property {function} _onMSPointerMove - Internal function to handle MSPointer events.
    * @private
    */
    this._onMSPointerMove = null;

    /**
    * @property {function} _onMSPointerUp - Internal function to handle MSPointer events.
    * @private
    */
    this._onMSPointerUp = null;

    /**
    * @property {function} _onMSPointerUpGlobal - Internal function to handle MSPointer events.
    * @private
    */
    this._onMSPointerUpGlobal = null;

    /**
    * @property {function} _onMSPointerOut - Internal function to handle MSPointer events.
    * @private
    */
    this._onMSPointerOut = null;

    /**
    * @property {function} _onMSPointerOver - Internal function to handle MSPointer events.
    * @private
    */
    this._onMSPointerOver = null;

};

Phaser.MSPointer.prototype = {

    /**
    * Starts the event listeners running.
    * @method Phaser.MSPointer#start
    */
    start: function () {

        if (this._onMSPointerDown !== null)
        {
            //  Avoid setting multiple listeners
            return;
        }

        var _this = this;

        if (this.game.device.mspointer)
        {
            this._onMSPointerDown = function (event) {
                return _this.onPointerDown(event);
            };

            this._onMSPointerMove = function (event) {
                return _this.onPointerMove(event);
            };

            this._onMSPointerUp = function (event) {
                return _this.onPointerUp(event);
            };

            this._onMSPointerUpGlobal = function (event) {
                return _this.onPointerUpGlobal(event);
            };

            this._onMSPointerOut = function (event) {
                return _this.onPointerOut(event);
            };

            this._onMSPointerOver = function (event) {
                return _this.onPointerOver(event);
            };

            var canvas = this.game.canvas;

            canvas.addEventListener('MSPointerDown', this._onMSPointerDown, false);
            canvas.addEventListener('MSPointerMove', this._onMSPointerMove, false);
            canvas.addEventListener('MSPointerUp', this._onMSPointerUp, false);

            //  IE11+ uses non-prefix events
            canvas.addEventListener('pointerdown', this._onMSPointerDown, false);
            canvas.addEventListener('pointermove', this._onMSPointerMove, false);
            canvas.addEventListener('pointerup', this._onMSPointerUp, false);

            canvas.style['-ms-content-zooming'] = 'none';
            canvas.style['-ms-touch-action'] = 'none';

            if (!this.game.device.cocoonJS)
            {
                window.addEventListener('MSPointerUp', this._onMSPointerUpGlobal, true);
                canvas.addEventListener('MSPointerOver', this._onMSPointerOver, true);
                canvas.addEventListener('MSPointerOut', this._onMSPointerOut, true);

                //  IE11+ uses non-prefix events
                window.addEventListener('pointerup', this._onMSPointerUpGlobal, true);
                canvas.addEventListener('pointerover', this._onMSPointerOver, true);
                canvas.addEventListener('pointerout', this._onMSPointerOut, true);
            }
        }

    },

    /**
    * The function that handles the PointerDown event.
    * 
    * @method Phaser.MSPointer#onPointerDown
    * @param {PointerEvent} event - The native DOM event.
    */
    onPointerDown: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.pointerDownCallback)
        {
            this.pointerDownCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = event.pointerId;

        if (event.pointerType === 'mouse' || event.pointerType === 0x00000004)
        {
            this.input.mousePointer.start(event);
        }
        else
        {
            this.input.startPointer(event);
        }

    },

    /**
    * The function that handles the PointerMove event.
    * @method Phaser.MSPointer#onPointerMove
    * @param {PointerEvent} event - The native DOM event.
    */
    onPointerMove: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.pointerMoveCallback)
        {
            this.pointerMoveCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = event.pointerId;

        if (event.pointerType === 'mouse' || event.pointerType === 0x00000004)
        {
            this.input.mousePointer.move(event);
        }
        else
        {
            this.input.updatePointer(event);
        }

    },

    /**
    * The function that handles the PointerUp event.
    * @method Phaser.MSPointer#onPointerUp
    * @param {PointerEvent} event - The native DOM event.
    */
    onPointerUp: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.pointerUpCallback)
        {
            this.pointerUpCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = event.pointerId;

        if (event.pointerType === 'mouse' || event.pointerType === 0x00000004)
        {
            this.input.mousePointer.stop(event);
        }
        else
        {
            this.input.stopPointer(event);
        }

    },

    /**
    * The internal method that handles the mouse up event from the window.
    * 
    * @method Phaser.MSPointer#onPointerUpGlobal
    * @param {PointerEvent} event - The native event from the browser. This gets stored in MSPointer.event.
    */
    onPointerUpGlobal: function (event) {

        if ((event.pointerType === 'mouse' || event.pointerType === 0x00000004) && !this.input.mousePointer.withinGame)
        {
            this.onPointerUp(event);
        }
        else
        {
            var pointer = this.input.getPointerFromIdentifier(event.identifier);

            if (pointer && pointer.withinGame)
            {
                this.onPointerUp(event);
            }
        }

    },

    /**
    * The internal method that handles the pointer out event from the browser.
    *
    * @method Phaser.MSPointer#onPointerOut
    * @param {PointerEvent} event - The native event from the browser. This gets stored in MSPointer.event.
    */
    onPointerOut: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (event.pointerType === 'mouse' || event.pointerType === 0x00000004)
        {
            this.input.mousePointer.withinGame = false;
        }
        else
        {
            var pointer = this.input.getPointerFromIdentifier(event.identifier);

            if (pointer)
            {
                pointer.withinGame = false;
            }
        }

        if (this.input.mouse.mouseOutCallback)
        {
            this.input.mouse.mouseOutCallback.call(this.input.mouse.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        if (this.input.mouse.stopOnGameOut)
        {
            event['identifier'] = 0;

            if (pointer)
            {
                pointer.stop(event);
            }
            else
            {
                this.input.mousePointer.stop(event);
            }
        }

    },

    /**
    * The internal method that handles the pointer out event from the browser.
    *
    * @method Phaser.MSPointer#onPointerOut
    * @param {PointerEvent} event - The native event from the browser. This gets stored in MSPointer.event.
    */
    onPointerOver: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (event.pointerType === 'mouse' || event.pointerType === 0x00000004)
        {
            this.input.mousePointer.withinGame = true;
        }
        else
        {
            var pointer = this.input.getPointerFromIdentifier(event.identifier);

            if (pointer)
            {
                pointer.withinGame = true;
            }
        }

        if (this.input.mouse.mouseOverCallback)
        {
            this.input.mouse.mouseOverCallback.call(this.input.mouse.callbackContext, event);
        }

    },

    /**
    * Stop the event listeners.
    * @method Phaser.MSPointer#stop
    */
    stop: function () {

        var canvas = this.game.canvas;

        canvas.removeEventListener('MSPointerDown', this._onMSPointerDown, false);
        canvas.removeEventListener('MSPointerMove', this._onMSPointerMove, false);
        canvas.removeEventListener('MSPointerUp', this._onMSPointerUp, false);

        //  IE11+ uses non-prefix events
        canvas.removeEventListener('pointerdown', this._onMSPointerDown, false);
        canvas.removeEventListener('pointermove', this._onMSPointerMove, false);
        canvas.removeEventListener('pointerup', this._onMSPointerUp, false);

        window.removeEventListener('MSPointerUp', this._onMSPointerUpGlobal, true);
        canvas.removeEventListener('MSPointerOver', this._onMSPointerOver, true);
        canvas.removeEventListener('MSPointerOut', this._onMSPointerOut, true);

        //  IE11+ uses non-prefix events
        window.removeEventListener('pointerup', this._onMSPointerUpGlobal, true);
        canvas.removeEventListener('pointerover', this._onMSPointerOver, true);
        canvas.removeEventListener('pointerout', this._onMSPointerOut, true);

    }

};

Phaser.MSPointer.prototype.constructor = Phaser.MSPointer;
