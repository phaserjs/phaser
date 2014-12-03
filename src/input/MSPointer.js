/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The MSPointer class handles Microsoft touch interactions with the game and the resulting Pointer objects.
*
* It will work only in Internet Explorer 10 and Windows Store or Windows Phone 8 apps using JavaScript.
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
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
    * @property {object} callbackContext - The context under which callbacks are called (defaults to game).
    */
    this.callbackContext = this.game;

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

            this.game.canvas.addEventListener('MSPointerDown', this._onMSPointerDown, false);
            this.game.canvas.addEventListener('MSPointerMove', this._onMSPointerMove, false);
            this.game.canvas.addEventListener('MSPointerUp', this._onMSPointerUp, false);

            //  IE11+ uses non-prefix events
            this.game.canvas.addEventListener('pointerDown', this._onMSPointerDown, false);
            this.game.canvas.addEventListener('pointerMove', this._onMSPointerMove, false);
            this.game.canvas.addEventListener('pointerUp', this._onMSPointerUp, false);

            this.game.canvas.style['-ms-content-zooming'] = 'none';
            this.game.canvas.style['-ms-touch-action'] = 'none';
        }

    },

    /**
    * The function that handles the PointerDown event.
    * 
    * @method Phaser.MSPointer#onPointerDown
    * @param {PointerEvent} event - The native DOM event.
    */
    onPointerDown: function (event) {

        if (!this.game.input.enabled || !this.enabled)
        {
            return;
        }

        event.preventDefault();
        event.identifier = event.pointerId;

        this.game.input.startPointer(event);

    },

    /**
    * The function that handles the PointerMove event.
    * @method Phaser.MSPointer#onPointerMove
    * @param {PointerEvent} event - The native DOM event.
    */
    onPointerMove: function (event) {

        if (!this.game.input.enabled || !this.enabled)
        {
            return;
        }

        event.preventDefault();
        event.identifier = event.pointerId;

        this.game.input.updatePointer(event);

    },

    /**
    * The function that handles the PointerUp event.
    * @method Phaser.MSPointer#onPointerUp
    * @param {PointerEvent} event - The native DOM event.
    */
    onPointerUp: function (event) {

        if (!this.game.input.enabled || !this.enabled)
        {
            return;
        }

        event.preventDefault();
        event.identifier = event.pointerId;

        this.game.input.stopPointer(event);

    },

    /**
    * Stop the event listeners.
    * @method Phaser.MSPointer#stop
    */
    stop: function () {

        this.game.canvas.removeEventListener('MSPointerDown', this._onMSPointerDown);
        this.game.canvas.removeEventListener('MSPointerMove', this._onMSPointerMove);
        this.game.canvas.removeEventListener('MSPointerUp', this._onMSPointerUp);

        this.game.canvas.removeEventListener('pointerDown', this._onMSPointerDown);
        this.game.canvas.removeEventListener('pointerMove', this._onMSPointerMove);
        this.game.canvas.removeEventListener('pointerUp', this._onMSPointerUp);

    }

};

Phaser.MSPointer.prototype.constructor = Phaser.MSPointer;

/**
* If disabled all MSPointer input will be ignored.
* @property {boolean} disabled
* @memberof Phaser.MSPointer
* @default false
* @deprecated Use {@link Phaser.MSPointer#enabled} instead
*/
Object.defineProperty(Phaser.MSPointer.prototype, "disabled", {

    get: function () {
        return !this.enabled;
    },
    set: function (value) {
        this.enabled = !value;
    }

});
