/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.Input is the Input Manager for all types of Input across Phaser, including mouse, keyboard, touch and MSPointer.
* The Input manager is updated automatically by the core game loop.
*
* @class Phaser.Input
* @constructor
* @param {Phaser.Game} game - Current game instance.
*/
Phaser.Input = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {HTMLCanvasElement} hitCanvas - The canvas to which single pixels are drawn in order to perform pixel-perfect hit detection.
    * @default
    */
    this.hitCanvas = null;

    /**
    * @property {CanvasRenderingContext2D} hitContext - The context of the pixel perfect hit canvas.
    * @default
    */
    this.hitContext = null;

    /**
    * @property {array} moveCallbacks - An array of callbacks that will be fired every time the activePointer receives a move event from the DOM.
    */
    this.moveCallbacks = [];

    /**
    * @property {function} moveCallback - An optional callback that will be fired every time the activePointer receives a move event from the DOM. Set to null to disable.
    */
    this.moveCallback = null;

    /**
    * @property {object} moveCallbackContext - The context in which the moveCallback will be sent. Defaults to Phaser.Input but can be set to any valid JS object.
    */
    this.moveCallbackContext = this;

    /**
    * @property {number} pollRate - How often should the input pointers be checked for updates? A value of 0 means every single frame (60fps); a value of 1 means every other frame (30fps) and so on.
    * @default
    */
    this.pollRate = 0;

    /**
    * You can disable all Input by setting Input.disabled = true. While set all new input related events will be ignored.
    * If you need to disable just one type of input; for example mouse; use Input.mouse.disabled = true instead
    * @property {boolean} disabled
    * @default
    */
    this.disabled = false;

    /**
    * @property {number} multiInputOverride - Controls the expected behaviour when using a mouse and touch together on a multi-input device.
    * @default
    */
    this.multiInputOverride = Phaser.Input.MOUSE_TOUCH_COMBINE;

    /**
    * @property {Phaser.Point} position - A point object representing the current position of the Pointer.
    * @default
    */
    this.position = null;

    /**
    * @property {Phaser.Point} speed - A point object representing the speed of the Pointer. Only really useful in single Pointer games; otherwise see the Pointer objects directly.
    */
    this.speed = null;

    /**
    * A Circle object centered on the x/y screen coordinates of the Input.
    * Default size of 44px (Apples recommended "finger tip" size) but can be changed to anything.
    * @property {Phaser.Circle} circle
    */
    this.circle = null;

    /**
    * @property {Phaser.Point} scale - The scale by which all input coordinates are multiplied; calculated by the ScaleManager. In an un-scaled game the values will be x = 1 and y = 1.
    */
    this.scale = null;

    /**
    * @property {number} maxPointers - The maximum number of Pointers allowed to be active at any one time. For lots of games it's useful to set this to 1.
    * @default
    */
    this.maxPointers = 10;

    /**
    * @property {number} currentPointers - The current number of active Pointers.
    * @default
    */
    this.currentPointers = 0;

    /**
    * @property {number} tapRate - The number of milliseconds that the Pointer has to be pressed down and then released to be considered a tap or click.
    * @default
    */
    this.tapRate = 200;

    /**
    * @property {number} doubleTapRate - The number of milliseconds between taps of the same Pointer for it to be considered a double tap / click.
    * @default
    */
    this.doubleTapRate = 300;

    /**
    * @property {number} holdRate - The number of milliseconds that the Pointer has to be pressed down for it to fire a onHold event.
    * @default
    */
    this.holdRate = 2000;

    /**
    * @property {number} justPressedRate - The number of milliseconds below which the Pointer is considered justPressed.
    * @default
    */
    this.justPressedRate = 200;

    /**
    * @property {number} justReleasedRate - The number of milliseconds below which the Pointer is considered justReleased .
    * @default
    */
    this.justReleasedRate = 200;

    /**
    * Sets if the Pointer objects should record a history of x/y coordinates they have passed through.
    * The history is cleared each time the Pointer is pressed down.
    * The history is updated at the rate specified in Input.pollRate
    * @property {boolean} recordPointerHistory
    * @default
    */
    this.recordPointerHistory = false;

    /**
    * @property {number} recordRate - The rate in milliseconds at which the Pointer objects should update their tracking history.
    * @default
    */
    this.recordRate = 100;

    /**
    * The total number of entries that can be recorded into the Pointer objects tracking history.
    * If the Pointer is tracking one event every 100ms; then a trackLimit of 100 would store the last 10 seconds worth of history.
    * @property {number} recordLimit
    * @default
    */
    this.recordLimit = 100;

    /**
    * @property {Phaser.Pointer} pointer1 - A Pointer object.
    */
    this.pointer1 = null;

    /**
    * @property {Phaser.Pointer} pointer2 - A Pointer object.
    */
    this.pointer2 = null;

    /**
    * @property {Phaser.Pointer} pointer3 - A Pointer object.
    */
    this.pointer3 = null;

    /**
    * @property {Phaser.Pointer} pointer4 - A Pointer object.
    */
    this.pointer4 = null;

    /**
    * @property {Phaser.Pointer} pointer5 - A Pointer object.
    */
    this.pointer5 = null;

    /**
    * @property {Phaser.Pointer} pointer6 - A Pointer object.
    */
    this.pointer6 = null;

    /**
    * @property {Phaser.Pointer} pointer7 - A Pointer object.
    */
    this.pointer7 = null;

    /**
    * @property {Phaser.Pointer} pointer8 - A Pointer object.
    */
    this.pointer8 = null;

    /**
    * @property {Phaser.Pointer} pointer9 - A Pointer object.
    */
    this.pointer9 = null;

    /**
    * @property {Phaser.Pointer} pointer10 - A Pointer object.
    */
    this.pointer10 = null;

    /**
    * The most recently active Pointer object.
    * When you've limited max pointers to 1 this will accurately be either the first finger touched or mouse.
    * @property {Phaser.Pointer} activePointer
    */
    this.activePointer = null;

    /**
    * @property {Pointer} mousePointer - The mouse has its own unique Phaser.Pointer object which you can use if making a desktop specific game.
    */
    this.mousePointer = null;

    /**
    * @property {Phaser.Mouse} mouse - The Mouse Input manager.
    */
    this.mouse = null;

    /**
    * @property {Phaser.Keyboard} keyboard - The Keyboard Input manager.
    */
    this.keyboard = null;

    /**
    * @property {Phaser.Touch} touch - the Touch Input manager.
    */
    this.touch = null;

    /**
    * @property {Phaser.MSPointer} mspointer - The MSPointer Input manager.
    */
    this.mspointer = null;

    /**
    * @property {Phaser.Gamepad} gamepad - The Gamepad Input manager.
    */
    this.gamepad = null;

    /**
    * @property {Phaser.Gestures} gestures - The Gestures manager.
    */
    // this.gestures = null;

    /**
    * @property {boolean} resetLocked - If the Input Manager has been reset locked then all calls made to InputManager.reset, such as from a State change, are ignored.
    * @default
    */
    this.resetLocked = false;

    /**
    * @property {Phaser.Signal} onDown - A Signal that is dispatched each time a pointer is pressed down.
    */
    this.onDown = null;

    /**
    * @property {Phaser.Signal} onUp - A Signal that is dispatched each time a pointer is released.
    */
    this.onUp = null;

    /**
    * @property {Phaser.Signal} onTap - A Signal that is dispatched each time a pointer is tapped.
    */
    this.onTap = null;

    /**
    * @property {Phaser.Signal} onHold - A Signal that is dispatched each time a pointer is held down.
    */
    this.onHold = null;

    /**
    * @property {number} minPriorityID - You can tell all Pointers to ignore any object with a priorityID lower than the minPriorityID. Useful when stacking UI layers. Set to zero to disable.
    * @default
    */
    this.minPriorityID = 0;

    /**
    * A list of interactive objects. Te InputHandler components add and remove themselves from this.
    * @property {Phaser.ArrayList} interactiveItems
    */
    this.interactiveItems = new Phaser.ArrayList();

    /**
    * @property {Phaser.Point} _localPoint - Internal cache var.
    * @private
    */
    this._localPoint = new Phaser.Point();

    /**
    * @property {number} _pollCounter - Internal var holding the current poll counter.
    * @private
    */
    this._pollCounter = 0;

    /**
    * @property {Phaser.Point} _oldPosition - A point object representing the previous position of the Pointer.
    * @private
    */
    this._oldPosition = null;

    /**
    * @property {number} _x - x coordinate of the most recent Pointer event
    * @private
    */
    this._x = 0;

    /**
    * @property {number} _y - Y coordinate of the most recent Pointer event
    * @private
    */
    this._y = 0;

};

/**
* @constant
* @type {number}
*/
Phaser.Input.MOUSE_OVERRIDES_TOUCH = 0;

/**
* @constant
* @type {number}
*/
Phaser.Input.TOUCH_OVERRIDES_MOUSE = 1;

/**
* @constant
* @type {number}
*/
Phaser.Input.MOUSE_TOUCH_COMBINE = 2;

Phaser.Input.prototype = {

    /**
    * Starts the Input Manager running.
    * @method Phaser.Input#boot
    * @protected
    */
    boot: function () {

        this.mousePointer = new Phaser.Pointer(this.game, 0);
        this.pointer1 = new Phaser.Pointer(this.game, 1);
        this.pointer2 = new Phaser.Pointer(this.game, 2);

        this.mouse = new Phaser.Mouse(this.game);
        this.keyboard = new Phaser.Keyboard(this.game);
        this.touch = new Phaser.Touch(this.game);
        this.mspointer = new Phaser.MSPointer(this.game);
        this.gamepad = new Phaser.Gamepad(this.game);
        // this.gestures = new Phaser.Gestures(this.game);

        this.onDown = new Phaser.Signal();
        this.onUp = new Phaser.Signal();
        this.onTap = new Phaser.Signal();
        this.onHold = new Phaser.Signal();

        this.scale = new Phaser.Point(1, 1);
        this.speed = new Phaser.Point();
        this.position = new Phaser.Point();
        this._oldPosition = new Phaser.Point();

        this.circle = new Phaser.Circle(0, 0, 44);

        this.activePointer = this.mousePointer;
        this.currentPointers = 0;

        this.hitCanvas = document.createElement('canvas');
        this.hitCanvas.width = 1;
        this.hitCanvas.height = 1;
        this.hitContext = this.hitCanvas.getContext('2d');

        this.mouse.start();
        this.keyboard.start();
        this.touch.start();
        this.mspointer.start();
        this.mousePointer.active = true;

    },

    /**
    * Stops all of the Input Managers from running.
    * @method Phaser.Input#destroy
    */
    destroy: function () {

        this.mouse.stop();
        this.keyboard.stop();
        this.touch.stop();
        this.mspointer.stop();
        this.gamepad.stop();
        // this.gestures.stop();

        this.moveCallbacks = [];
        //  DEPRECATED
        this.moveCallback = null;

    },

    /**
    * DEPRECATED: This method will be removed in a future major point release. Please use Input.addMoveCallback instead.
    * 
    * Sets a callback that is fired every time the activePointer receives a DOM move event such as a mousemove or touchmove.
    * It will be called every time the activePointer moves, which in a multi-touch game can be a lot of times, so this is best
    * to only use if you've limited input to a single pointer (i.e. mouse or touch)
    * 
    * @method Phaser.Input#setMoveCallback
    * @param {function} callback - The callback that will be called each time the activePointer receives a DOM move event.
    * @param {object} callbackContext - The context in which the callback will be called.
    */
    setMoveCallback: function (callback, callbackContext) {

        this.moveCallback = callback;
        this.moveCallbackContext = callbackContext;

    },

    /**
    * Adds a callback that is fired every time the activePointer receives a DOM move event such as a mousemove or touchmove.
    * It will be called every time the activePointer moves, which in a multi-touch game can be a lot of times, so this is best
    * to only use if you've limited input to a single pointer (i.e. mouse or touch).
    * The callback is added to the Phaser.Input.moveCallbacks array and should be removed with Phaser.Input.deleteMoveCallback.
    * 
    * @method Phaser.Input#addMoveCallback
    * @param {function} callback - The callback that will be called each time the activePointer receives a DOM move event.
    * @param {object} callbackContext - The context in which the callback will be called.
    * @return {number} The index of the callback entry. Use this index when calling Input.deleteMoveCallback.
    */
    addMoveCallback: function (callback, callbackContext) {

        return this.moveCallbacks.push( { callback: callback, context: callbackContext }) - 1;

    },

    /**
    * Adds a callback that is fired every time the activePointer receives a DOM move event such as a mousemove or touchmove.
    * It will be called every time the activePointer moves, which in a multi-touch game can be a lot of times, so this is best
    * to only use if you've limited input to a single pointer (i.e. mouse or touch).
    * The callback is added to the Phaser.Input.moveCallbacks array and should be removed with Phaser.Input.deleteMoveCallback.
    * 
    * @method Phaser.Input#deleteMoveCallback
    * @param {number} index - The index of the callback to remove.
    */
    deleteMoveCallback: function (index) {

        if (this.moveCallbacks[index])
        {
            this.moveCallbacks.splice(index, 1);
        }

    },

    /**
    * Add a new Pointer object to the Input Manager. By default Input creates 3 pointer objects: mousePointer, pointer1 and pointer2.
    * If you need more then use this to create a new one, up to a maximum of 10.
    * @method Phaser.Input#addPointer
    * @return {Phaser.Pointer} A reference to the new Pointer object that was created.
    */
    addPointer: function () {

        var next = 0;

        for (var i = 10; i > 0; i--)
        {
            if (this['pointer' + i] === null)
            {
                next = i;
            }
        }

        if (next === 0)
        {
            console.warn("You can only have 10 Pointer objects");
            return null;
        }
        else
        {
            this['pointer' + next] = new Phaser.Pointer(this.game, next);
            return this['pointer' + next];
        }

    },

    /**
    * Updates the Input Manager. Called by the core Game loop.
    * @method Phaser.Input#update
    * @protected
    */
    update: function () {

        this.keyboard.update();

        if (this.pollRate > 0 && this._pollCounter < this.pollRate)
        {
            this._pollCounter++;
            return;
        }

        this.speed.x = this.position.x - this._oldPosition.x;
        this.speed.y = this.position.y - this._oldPosition.y;

        this._oldPosition.copyFrom(this.position);
        this.mousePointer.update();

        if (this.gamepad.active) { this.gamepad.update(); }

        this.pointer1.update();
        this.pointer2.update();

        if (this.pointer3) { this.pointer3.update(); }
        if (this.pointer4) { this.pointer4.update(); }
        if (this.pointer5) { this.pointer5.update(); }
        if (this.pointer6) { this.pointer6.update(); }
        if (this.pointer7) { this.pointer7.update(); }
        if (this.pointer8) { this.pointer8.update(); }
        if (this.pointer9) { this.pointer9.update(); }
        if (this.pointer10) { this.pointer10.update(); }

        this._pollCounter = 0;

        // if (this.gestures.active) { this.gestures.update(); }

    },

    /**
    * Reset all of the Pointers and Input states. The optional `hard` parameter will reset any events or callbacks that may be bound.
    * Input.reset is called automatically during a State change or if a game loses focus / visibility. If you wish to control the reset
    * directly yourself then set InputManager.resetLocked to `true`.
    *
    * @method Phaser.Input#reset
    * @param {boolean} [hard=false] - A soft reset won't reset any events or callbacks that are bound. A hard reset will.
    */
    reset: function (hard) {

        if (!this.game.isBooted || this.resetLocked)
        {
            return;
        }

        if (typeof hard === 'undefined') { hard = false; }

        this.keyboard.reset(hard);
        this.mousePointer.reset();
        this.gamepad.reset();

        for (var i = 1; i <= 10; i++)
        {
            if (this['pointer' + i])
            {
                this['pointer' + i].reset();
            }
        }

        this.currentPointers = 0;

        if (this.game.canvas.style.cursor !== 'none')
        {
            this.game.canvas.style.cursor = 'inherit';
        }

        if (hard)
        {
            this.onDown.dispose();
            this.onUp.dispose();
            this.onTap.dispose();
            this.onHold.dispose();
            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();
            this.onTap = new Phaser.Signal();
            this.onHold = new Phaser.Signal();
            this.moveCallbacks = [];
        }

        this._pollCounter = 0;

    },

    /**
    * Resets the speed and old position properties.
    * @method Phaser.Input#resetSpeed
    * @param {number} x - Sets the oldPosition.x value.
    * @param {number} y - Sets the oldPosition.y value.
    */
    resetSpeed: function (x, y) {

        this._oldPosition.setTo(x, y);
        this.speed.setTo(0, 0);

    },

    /**
    * Find the first free Pointer object and start it, passing in the event data. This is called automatically by Phaser.Touch and Phaser.MSPointer.
    * @method Phaser.Input#startPointer
    * @param {Any} event - The event data from the Touch event.
    * @return {Phaser.Pointer} The Pointer object that was started or null if no Pointer object is available.
    */
    startPointer: function (event) {

        if (this.maxPointers < 10 && this.totalActivePointers == this.maxPointers)
        {
            return null;
        }

        if (this.pointer1.active === false)
        {
            return this.pointer1.start(event);
        }
        else if (this.pointer2.active === false)
        {
            return this.pointer2.start(event);
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].active === false)
                {
                    return this['pointer' + i].start(event);
                }
            }
        }

        return null;

    },

    /**
    * Updates the matching Pointer object, passing in the event data. This is called automatically and should not normally need to be invoked.
    * @method Phaser.Input#updatePointer
    * @param {Any} event - The event data from the Touch event.
    * @return {Phaser.Pointer} The Pointer object that was updated or null if no Pointer object is available.
    */
    updatePointer: function (event) {

        if (this.pointer1.active && this.pointer1.identifier == event.identifier)
        {
            return this.pointer1.move(event);
        }
        else if (this.pointer2.active && this.pointer2.identifier == event.identifier)
        {
            return this.pointer2.move(event);
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier)
                {
                    return this['pointer' + i].move(event);
                }
            }
        }

        return null;

    },

    /**
    * Stops the matching Pointer object, passing in the event data.
    * @method Phaser.Input#stopPointer
    * @param {Any} event - The event data from the Touch event.
    * @return {Phaser.Pointer} The Pointer object that was stopped or null if no Pointer object is available.
    */
    stopPointer: function (event) {

        if (this.pointer1.active && this.pointer1.identifier == event.identifier)
        {
            return this.pointer1.stop(event);
        }
        else if (this.pointer2.active && this.pointer2.identifier == event.identifier)
        {
            return this.pointer2.stop(event);
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier)
                {
                    return this['pointer' + i].stop(event);
                }
            }
        }

        return null;

    },

    /**
    * Get the next Pointer object whos active property matches the given state
    * @method Phaser.Input#getPointer
    * @param {boolean} state - The state the Pointer should be in (false for inactive, true for active).
    * @return {Phaser.Pointer} A Pointer object or null if no Pointer object matches the requested state.
    */
    getPointer: function (state) {

        state = state || false;

        if (this.pointer1.active == state)
        {
            return this.pointer1;
        }
        else if (this.pointer2.active == state)
        {
            return this.pointer2;
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].active == state)
                {
                    return this['pointer' + i];
                }
            }
        }

        return null;

    },

    /**
    * Get the Pointer object whos `identifier` property matches the given identifier value.
    * The identifier property is not set until the Pointer has been used at least once, as its populated by the DOM event.
    * Also it can change every time you press the pointer down, and is not fixed once set.
    * Note: Not all browsers set the identifier property and it's not part of the W3C spec, so you may need getPointerFromId instead.
    *
    * @method Phaser.Input#getPointerFromIdentifier
    * @param {number} identifier - The Pointer.identifier value to search for.
    * @return {Phaser.Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
    */
    getPointerFromIdentifier: function (identifier) {

        if (this.pointer1.identifier === identifier)
        {
            return this.pointer1;
        }
        else if (this.pointer2.identifier === identifier)
        {
            return this.pointer2;
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].identifier === identifier)
                {
                    return this['pointer' + i];
                }
            }
        }

        return null;

    },

    /**
    * Get the Pointer object whos `pointerId` property matches the given value.
    * The pointerId property is not set until the Pointer has been used at least once, as its populated by the DOM event.
    * Also it can change every time you press the pointer down if the browser recycles it.
    *
    * @method Phaser.Input#getPointerFromId
    * @param {number} pointerId - The Pointer.pointerId value to search for.
    * @return {Phaser.Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
    */
    getPointerFromId: function (pointerId) {

        if (this.pointer1.pointerId === pointerId)
        {
            return this.pointer1;
        }
        else if (this.pointer2.pointerId === pointerId)
        {
            return this.pointer2;
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].pointerId === pointerId)
                {
                    return this['pointer' + i];
                }
            }
        }

        return null;

    },

    /**
    * This will return the local coordinates of the specified displayObject based on the given Pointer.
    * @method Phaser.Input#getLocalPosition
    * @param {Phaser.Sprite|Phaser.Image} displayObject - The DisplayObject to get the local coordinates for.
    * @param {Phaser.Pointer} pointer - The Pointer to use in the check against the displayObject.
    * @return {Phaser.Point} A point containing the coordinates of the Pointer position relative to the DisplayObject.
    */
    getLocalPosition: function (displayObject, pointer, output) {

        if (typeof output === 'undefined') { output = new Phaser.Point(); }

        var wt = displayObject.worldTransform;
        var id = 1 / (wt.a * wt.d + wt.b * -wt.c);

        return output.setTo(
            wt.d * id * pointer.x + -wt.b * id * pointer.y + (wt.ty * wt.b - wt.tx * wt.d) * id,
            wt.a * id * pointer.y + -wt.c * id * pointer.x + (-wt.ty * wt.a + wt.tx * wt.c) * id
        );

    },

    /**
    * Tests if the pointer hits the given object.
    *
    * @method Phaser.Input#hitTest
    * @param {DisplayObject} displayObject - The displayObject to test for a hit.
    * @param {Phaser.Pointer} pointer - The pointer to use for the test.
    * @param {Phaser.Point} localPoint - The local translated point.
    */
    hitTest: function (displayObject, pointer, localPoint) {

        if (!displayObject.worldVisible)
        {
            return false;
        }

        this.getLocalPosition(displayObject, pointer, this._localPoint);

        localPoint.copyFrom(this._localPoint);

        if (displayObject.hitArea && displayObject.hitArea.contains)
        {
            if (displayObject.hitArea.contains(this._localPoint.x, this._localPoint.y))
            {
                return true;
            }

            return false;
        }
        else if (displayObject instanceof Phaser.TileSprite)
        {
            var width = displayObject.width;
            var height = displayObject.height;
            var x1 = -width * displayObject.anchor.x;

            if (this._localPoint.x > x1 && this._localPoint.x < x1 + width)
            {
                var y1 = -height * displayObject.anchor.y;

                if (this._localPoint.y > y1 && this._localPoint.y < y1 + height)
                {
                    return true;
                }
            }
        }
        else if (displayObject instanceof PIXI.Sprite)
        {
            var width = displayObject.texture.frame.width;
            var height = displayObject.texture.frame.height;
            var x1 = -width * displayObject.anchor.x;

            if (this._localPoint.x > x1 && this._localPoint.x < x1 + width)
            {
                var y1 = -height * displayObject.anchor.y;

                if (this._localPoint.y > y1 && this._localPoint.y < y1 + height)
                {
                    return true;
                }
            }
        }

        for (var i = 0, len = displayObject.children.length; i < len; i++)
        {
            if (this.hitTest(displayObject.children[i], pointer, localPoint))
            {
                return true;
            }
        }

        return false;
    }

};

Phaser.Input.prototype.constructor = Phaser.Input;

/**
* The X coordinate of the most recently active pointer. This value takes game scaling into account automatically. See Pointer.screenX/clientX for source values.
* @name Phaser.Input#x
* @property {number} x - The X coordinate of the most recently active pointer.
*/
Object.defineProperty(Phaser.Input.prototype, "x", {

    get: function () {
        return this._x;
    },

    set: function (value) {
        this._x = Math.floor(value);
    }

});

/**
* The Y coordinate of the most recently active pointer. This value takes game scaling into account automatically. See Pointer.screenY/clientY for source values.
* @name Phaser.Input#y
* @property {number} y - The Y coordinate of the most recently active pointer.
*/
Object.defineProperty(Phaser.Input.prototype, "y", {

    get: function () {
        return this._y;
    },

    set: function (value) {
        this._y = Math.floor(value);
    }

});

/**
* @name Phaser.Input#pollLocked
* @property {boolean} pollLocked - True if the Input is currently poll rate locked.
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "pollLocked", {

    get: function () {
        return (this.pollRate > 0 && this._pollCounter < this.pollRate);
    }

});

/**
* The total number of inactive Pointers
* @name Phaser.Input#totalInactivePointers
* @property {number} totalInactivePointers - The total number of inactive Pointers.
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "totalInactivePointers", {

    get: function () {
        return 10 - this.currentPointers;
    }

});

/**
* The total number of active Pointers
* @name Phaser.Input#totalActivePointers
* @property {number} totalActivePointers - The total number of active Pointers.
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "totalActivePointers", {

    get: function () {

        this.currentPointers = 0;

        for (var i = 1; i <= 10; i++)
        {
            if (this['pointer' + i] && this['pointer' + i].active)
            {
                this.currentPointers++;
            }
        }

        return this.currentPointers;

    }

});

/**
* The world X coordinate of the most recently active pointer.
* @name Phaser.Input#worldX
* @property {number} worldX - The world X coordinate of the most recently active pointer.
*/
Object.defineProperty(Phaser.Input.prototype, "worldX", {

    get: function () {
        return this.game.camera.view.x + this.x;
    }

});

/**
* The world Y coordinate of the most recently active pointer.
* @name Phaser.Input#worldY
* @property {number} worldY - The world Y coordinate of the most recently active pointer.
*/
Object.defineProperty(Phaser.Input.prototype, "worldY", {

    get: function () {
        return this.game.camera.view.y + this.y;
    }

});
