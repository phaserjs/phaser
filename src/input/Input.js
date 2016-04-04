/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
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
    * An array of callbacks that will be fired every time the activePointer receives a move event from the DOM.
    * To add a callback to this array please use `Input.addMoveCallback`.
    * @property {array} moveCallbacks
    * @protected
    */
    this.moveCallbacks = [];

    /**
    * @property {number} pollRate - How often should the input pointers be checked for updates? A value of 0 means every single frame (60fps); a value of 1 means every other frame (30fps) and so on.
    * @default
    */
    this.pollRate = 0;

    /**
    * When enabled, input (eg. Keyboard, Mouse, Touch) will be processed - as long as the individual sources are enabled themselves.
    *
    * When not enabled, _all_ input sources are ignored. To disable just one type of input; for example, the Mouse, use `input.mouse.enabled = false`.
    * @property {boolean} enabled
    * @default
    */
    this.enabled = true;

    /**
    * @property {number} multiInputOverride - Controls the expected behavior when using a mouse and touch together on a multi-input device.
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
    * @property {integer} maxPointers - The maximum number of Pointers allowed to be active at any one time. A value of -1 is only limited by the total number of pointers. For lots of games it's useful to set this to 1.
    * @default -1 (Limited by total pointers.)
    */
    this.maxPointers = -1;

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
    * An array of non-mouse pointers that have been added to the game.
    * The properties `pointer1..N` are aliases for `pointers[0..N-1]`.
    * @property {Phaser.Pointer[]} pointers
    * @public
    * @readonly
    */
    this.pointers = [];

    /**
    * The most recently active Pointer object.
    * 
    * When you've limited max pointers to 1 this will accurately be either the first finger touched or mouse.
    * 
    * @property {Phaser.Pointer} activePointer
    */
    this.activePointer = null;

    /**
    * The mouse has its own unique Phaser.Pointer object which you can use if making a desktop specific game.
    * 
    * @property {Pointer} mousePointer
    */
    this.mousePointer = null;

    /**
    * The Mouse Input manager.
    * 
    * You should not usually access this manager directly, but instead use Input.mousePointer or Input.activePointer 
    * which normalizes all the input values for you, regardless of browser.
    * 
    * @property {Phaser.Mouse} mouse
    */
    this.mouse = null;

    /**
    * The Keyboard Input manager.
    * 
    * @property {Phaser.Keyboard} keyboard
    */
    this.keyboard = null;

    /**
    * The Touch Input manager.
    * 
    * You should not usually access this manager directly, but instead use Input.activePointer 
    * which normalizes all the input values for you, regardless of browser.
    * 
    * @property {Phaser.Touch} touch
    */
    this.touch = null;

    /**
    * The MSPointer Input manager.
    * 
    * You should not usually access this manager directly, but instead use Input.activePointer 
    * which normalizes all the input values for you, regardless of browser.
    * 
    * @property {Phaser.MSPointer} mspointer
    */
    this.mspointer = null;

    /**
    * The Gamepad Input manager.
    * 
    * @property {Phaser.Gamepad} gamepad
    */
    this.gamepad = null;

    /**
    * If the Input Manager has been reset locked then all calls made to InputManager.reset, 
    * such as from a State change, are ignored.
    * @property {boolean} resetLocked
    * @default
    */
    this.resetLocked = false;

    /**
    * A Signal that is dispatched each time a pointer is pressed down.
    * @property {Phaser.Signal} onDown
    */
    this.onDown = null;

    /**
    * A Signal that is dispatched each time a pointer is released.
    * @property {Phaser.Signal} onUp
    */
    this.onUp = null;

    /**
    * A Signal that is dispatched each time a pointer is tapped.
    * @property {Phaser.Signal} onTap
    */
    this.onTap = null;

    /**
    * A Signal that is dispatched each time a pointer is held down.
    * @property {Phaser.Signal} onHold
    */
    this.onHold = null;

    /**
    * You can tell all Pointers to ignore any Game Object with a `priorityID` lower than this value.
    * This is useful when stacking UI layers. Set to zero to disable.
    * @property {number} minPriorityID
    * @default
    */
    this.minPriorityID = 0;

    /**
    * A list of interactive objects. The InputHandler components add and remove themselves from this list.
    * @property {Phaser.ArraySet} interactiveItems
    */
    this.interactiveItems = new Phaser.ArraySet();

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

/**
* The maximum number of pointers that can be added. This excludes the mouse pointer.
* @constant
* @type {integer}
*/
Phaser.Input.MAX_POINTERS = 10;

Phaser.Input.prototype = {

    /**
    * Starts the Input Manager running.
    *
    * @method Phaser.Input#boot
    * @protected
    */
    boot: function () {

        this.mousePointer = new Phaser.Pointer(this.game, 0, Phaser.PointerMode.CURSOR);
        this.addPointer();
        this.addPointer();

        this.mouse = new Phaser.Mouse(this.game);
        this.touch = new Phaser.Touch(this.game);
        this.mspointer = new Phaser.MSPointer(this.game);

        if (Phaser.Keyboard)
        {
            this.keyboard = new Phaser.Keyboard(this.game);
        }

        if (Phaser.Gamepad)
        {
            this.gamepad = new Phaser.Gamepad(this.game);
        }

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

        this.hitCanvas = PIXI.CanvasPool.create(this, 1, 1);
        this.hitContext = this.hitCanvas.getContext('2d');

        this.mouse.start();
        this.touch.start();
        this.mspointer.start();
        this.mousePointer.active = true;

        if (this.keyboard)
        {
            this.keyboard.start();
        }

        var _this = this;

        this._onClickTrampoline = function (event) {
            _this.onClickTrampoline(event);
        };

        this.game.canvas.addEventListener('click', this._onClickTrampoline, false);

    },

    /**
    * Stops all of the Input Managers from running.
    *
    * @method Phaser.Input#destroy
    */
    destroy: function () {

        this.mouse.stop();
        this.touch.stop();
        this.mspointer.stop();

        if (this.keyboard)
        {
            this.keyboard.stop();
        }

        if (this.gamepad)
        {
            this.gamepad.stop();
        }

        this.moveCallbacks = [];

        PIXI.CanvasPool.remove(this);

        this.game.canvas.removeEventListener('click', this._onClickTrampoline);

    },

    /**
    * Adds a callback that is fired every time the activePointer receives a DOM move event such as a mousemove or touchmove.
    *
    * The callback will be sent 4 parameters: The Pointer that moved, the x position of the pointer, the y position and the down state.
    * 
    * It will be called every time the activePointer moves, which in a multi-touch game can be a lot of times, so this is best
    * to only use if you've limited input to a single pointer (i.e. mouse or touch).
    * 
    * The callback is added to the Phaser.Input.moveCallbacks array and should be removed with Phaser.Input.deleteMoveCallback.
    * 
    * @method Phaser.Input#addMoveCallback
    * @param {function} callback - The callback that will be called each time the activePointer receives a DOM move event.
    * @param {object} context - The context in which the callback will be called.
    */
    addMoveCallback: function (callback, context) {

        this.moveCallbacks.push({ callback: callback, context: context });

    },

    /**
    * Removes the callback from the Phaser.Input.moveCallbacks array.
    * 
    * @method Phaser.Input#deleteMoveCallback
    * @param {function} callback - The callback to be removed.
    * @param {object} context - The context in which the callback exists.
    */
    deleteMoveCallback: function (callback, context) {

        var i = this.moveCallbacks.length;

        while (i--)
        {
            if (this.moveCallbacks[i].callback === callback && this.moveCallbacks[i].context === context)
            {
                this.moveCallbacks.splice(i, 1);
                return;
            }
        }

    },

    /**
    * Add a new Pointer object to the Input Manager.
    * By default Input creates 3 pointer objects: `mousePointer` (not include in part of general pointer pool), `pointer1` and `pointer2`.
    * This method adds an additional pointer, up to a maximum of Phaser.Input.MAX_POINTERS (default of 10).
    *
    * @method Phaser.Input#addPointer
    * @return {Phaser.Pointer|null} The new Pointer object that was created; null if a new pointer could not be added.
    */
    addPointer: function () {

        if (this.pointers.length >= Phaser.Input.MAX_POINTERS)
        {
            console.warn("Phaser.Input.addPointer: Maximum limit of " + Phaser.Input.MAX_POINTERS + " pointers reached.");
            return null;
        }

        var id = this.pointers.length + 1;
        var pointer = new Phaser.Pointer(this.game, id, Phaser.PointerMode.TOUCH);

        this.pointers.push(pointer);
        this['pointer' + id] = pointer;

        return pointer;

    },

    /**
    * Updates the Input Manager. Called by the core Game loop.
    * 
    * @method Phaser.Input#update
    * @protected
    */
    update: function () {

        if (this.keyboard)
        {
            this.keyboard.update();
        }

        if (this.pollRate > 0 && this._pollCounter < this.pollRate)
        {
            this._pollCounter++;
            return;
        }

        this.speed.x = this.position.x - this._oldPosition.x;
        this.speed.y = this.position.y - this._oldPosition.y;

        this._oldPosition.copyFrom(this.position);
        this.mousePointer.update();

        if (this.gamepad && this.gamepad.active)
        {
            this.gamepad.update();
        }

        for (var i = 0; i < this.pointers.length; i++)
        {
            this.pointers[i].update();
        }

        this._pollCounter = 0;

    },

    /**
    * Reset all of the Pointers and Input states.
    *
    * The optional `hard` parameter will reset any events or callbacks that may be bound.
    * Input.reset is called automatically during a State change or if a game loses focus / visibility.
    * To control control the reset manually set {@link Phaser.InputManager.resetLocked} to `true`.
    *
    * @method Phaser.Input#reset
    * @public
    * @param {boolean} [hard=false] - A soft reset won't reset any events or callbacks that are bound. A hard reset will.
    */
    reset: function (hard) {

        if (!this.game.isBooted || this.resetLocked)
        {
            return;
        }

        if (hard === undefined) { hard = false; }

        this.mousePointer.reset();

        if (this.keyboard)
        {
            this.keyboard.reset(hard);
        }

        if (this.gamepad)
        {
            this.gamepad.reset();
        }

        for (var i = 0; i < this.pointers.length; i++)
        {
            this.pointers[i].reset();
        }

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
    *
    * @method Phaser.Input#resetSpeed
    * @param {number} x - Sets the oldPosition.x value.
    * @param {number} y - Sets the oldPosition.y value.
    */
    resetSpeed: function (x, y) {

        this._oldPosition.setTo(x, y);
        this.speed.setTo(0, 0);

    },

    /**
    * Find the first free Pointer object and start it, passing in the event data.
    * This is called automatically by Phaser.Touch and Phaser.MSPointer.
    *
    * @method Phaser.Input#startPointer
    * @protected
    * @param {any} event - The event data from the Touch event.
    * @return {Phaser.Pointer} The Pointer object that was started or null if no Pointer object is available.
    */
    startPointer: function (event) {

        if (this.maxPointers >= 0 && this.countActivePointers(this.maxPointers) >= this.maxPointers)
        {
            return null;
        }

        if (!this.pointer1.active)
        {
            return this.pointer1.start(event);
        }

        if (!this.pointer2.active)
        {
            return this.pointer2.start(event);
        }

        for (var i = 2; i < this.pointers.length; i++)
        {
            var pointer = this.pointers[i];

            if (!pointer.active)
            {
                return pointer.start(event);
            }
        }

        return null;

    },

    /**
    * Updates the matching Pointer object, passing in the event data.
    * This is called automatically and should not normally need to be invoked.
    *
    * @method Phaser.Input#updatePointer
    * @protected
    * @param {any} event - The event data from the Touch event.
    * @return {Phaser.Pointer} The Pointer object that was updated; null if no pointer was updated.
    */
    updatePointer: function (event) {

        if (this.pointer1.active && this.pointer1.identifier === event.identifier)
        {
            return this.pointer1.move(event);
        }

        if (this.pointer2.active && this.pointer2.identifier === event.identifier)
        {
            return this.pointer2.move(event);
        }

        for (var i = 2; i < this.pointers.length; i++)
        {
            var pointer = this.pointers[i];

            if (pointer.active && pointer.identifier === event.identifier)
            {
                return pointer.move(event);
            }
        }

        return null;

    },

    /**
    * Stops the matching Pointer object, passing in the event data.
    *
    * @method Phaser.Input#stopPointer
    * @protected
    * @param {any} event - The event data from the Touch event.
    * @return {Phaser.Pointer} The Pointer object that was stopped or null if no Pointer object is available.
    */
    stopPointer: function (event) {

        if (this.pointer1.active && this.pointer1.identifier === event.identifier)
        {
            return this.pointer1.stop(event);
        }

        if (this.pointer2.active && this.pointer2.identifier === event.identifier)
        {
            return this.pointer2.stop(event);
        }

        for (var i = 2; i < this.pointers.length; i++)
        {
            var pointer = this.pointers[i];

            if (pointer.active && pointer.identifier === event.identifier)
            {
                return pointer.stop(event);
            }
        }

        return null;

    },

    /**
    * Returns the total number of active pointers, not exceeding the specified limit
    *
    * @name Phaser.Input#countActivePointers
    * @private
    * @property {integer} [limit=(max pointers)] - Stop counting after this.
    * @return {integer} The number of active pointers, or limit - whichever is less.
    */
    countActivePointers: function (limit) {

        if (limit === undefined) { limit = this.pointers.length; }

        var count = limit;

        for (var i = 0; i < this.pointers.length && count > 0; i++)
        {
            var pointer = this.pointers[i];

            if (pointer.active)
            {
                count--;
            }
        }

        return (limit - count);

    },

    /**
    * Get the first Pointer with the given active state.
    *
    * @method Phaser.Input#getPointer
    * @param {boolean} [isActive=false] - The state the Pointer should be in - active or inactive?
    * @return {Phaser.Pointer} A Pointer object or null if no Pointer object matches the requested state.
    */
    getPointer: function (isActive) {

        if (isActive === undefined) { isActive = false; }

        for (var i = 0; i < this.pointers.length; i++)
        {
            var pointer = this.pointers[i];

            if (pointer.active === isActive)
            {
                return pointer;
            }
        }

        return null;

    },

    /**
    * Get the Pointer object whos `identifier` property matches the given identifier value.
    *
    * The identifier property is not set until the Pointer has been used at least once, as its populated by the DOM event.
    * Also it can change every time you press the pointer down, and is not fixed once set.
    * Note: Not all browsers set the identifier property and it's not part of the W3C spec, so you may need getPointerFromId instead.
    *
    * @method Phaser.Input#getPointerFromIdentifier
    * @param {number} identifier - The Pointer.identifier value to search for.
    * @return {Phaser.Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
    */
    getPointerFromIdentifier: function (identifier) {

        for (var i = 0; i < this.pointers.length; i++)
        {
            var pointer = this.pointers[i];

            if (pointer.identifier === identifier)
            {
                return pointer;
            }
        }

        return null;

    },

    /**
    * Get the Pointer object whos `pointerId` property matches the given value.
    *
    * The pointerId property is not set until the Pointer has been used at least once, as its populated by the DOM event.
    * Also it can change every time you press the pointer down if the browser recycles it.
    *
    * @method Phaser.Input#getPointerFromId
    * @param {number} pointerId - The `pointerId` (not 'id') value to search for.
    * @return {Phaser.Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
    */
    getPointerFromId: function (pointerId) {

        for (var i = 0; i < this.pointers.length; i++)
        {
            var pointer = this.pointers[i];

            if (pointer.pointerId === pointerId)
            {
                return pointer;
            }
        }

        return null;

    },

    /**
    * This will return the local coordinates of the specified displayObject based on the given Pointer.
    *
    * @method Phaser.Input#getLocalPosition
    * @param {Phaser.Sprite|Phaser.Image} displayObject - The DisplayObject to get the local coordinates for.
    * @param {Phaser.Pointer} pointer - The Pointer to use in the check against the displayObject.
    * @return {Phaser.Point} A point containing the coordinates of the Pointer position relative to the DisplayObject.
    */
    getLocalPosition: function (displayObject, pointer, output) {

        if (output === undefined) { output = new Phaser.Point(); }

        var wt = displayObject.worldTransform;
        var id = 1 / (wt.a * wt.d + wt.c * -wt.b);

        return output.setTo(
            wt.d * id * pointer.x + -wt.c * id * pointer.y + (wt.ty * wt.c - wt.tx * wt.d) * id,
            wt.a * id * pointer.y + -wt.b * id * pointer.x + (-wt.ty * wt.a + wt.tx * wt.b) * id
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
            return (displayObject.hitArea.contains(this._localPoint.x, this._localPoint.y));
        }
        else if (displayObject instanceof Phaser.TileSprite)
        {
            var width = displayObject.width;
            var height = displayObject.height;
            var x1 = -width * displayObject.anchor.x;

            if (this._localPoint.x >= x1 && this._localPoint.x < x1 + width)
            {
                var y1 = -height * displayObject.anchor.y;

                if (this._localPoint.y >= y1 && this._localPoint.y < y1 + height)
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

            if (this._localPoint.x >= x1 && this._localPoint.x < x1 + width)
            {
                var y1 = -height * displayObject.anchor.y;

                if (this._localPoint.y >= y1 && this._localPoint.y < y1 + height)
                {
                    return true;
                }
            }
        }
        else if (displayObject instanceof Phaser.Graphics)
        {
            for (var i = 0; i < displayObject.graphicsData.length; i++)
            {
                var data = displayObject.graphicsData[i];

                if (!data.fill)
                {
                    continue;
                }

                //  Only deal with fills..
                if (data.shape && data.shape.contains(this._localPoint.x, this._localPoint.y))
                {
                    return true;
                }
            }
        }

        //  Didn't hit the parent, does it have any children?

        for (var i = 0, len = displayObject.children.length; i < len; i++)
        {
            if (this.hitTest(displayObject.children[i], pointer, localPoint))
            {
                return true;
            }
        }

        return false;
    },

    /**
    * Used for click trampolines. See {@link Phaser.Pointer.addClickTrampoline}.
    *
    * @method Phaser.Input#onClickTrampoline
    * @private
    */
    onClickTrampoline: function () {

        // It might not always be the active pointer, but this does work on
        // Desktop browsers (read: IE) with Mouse or MSPointer input.
        this.activePointer.processClickTrampolines();

    }

};

Phaser.Input.prototype.constructor = Phaser.Input;

/**
* The X coordinate of the most recently active pointer.
* This value takes game scaling into account automatically. See Pointer.screenX/clientX for source values.
* @name Phaser.Input#x
* @property {number} x
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
* The Y coordinate of the most recently active pointer.
* This value takes game scaling into account automatically. See Pointer.screenY/clientY for source values.
* @name Phaser.Input#y
* @property {number} y
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
* True if the Input is currently poll rate locked.
* @name Phaser.Input#pollLocked
* @property {boolean} pollLocked
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "pollLocked", {

    get: function () {
        return (this.pollRate > 0 && this._pollCounter < this.pollRate);
    }

});

/**
* The total number of inactive Pointers.
* @name Phaser.Input#totalInactivePointers
* @property {number} totalInactivePointers
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "totalInactivePointers", {

    get: function () {
        return this.pointers.length - this.countActivePointers();
    }

});

/**
* The total number of active Pointers, not counting the mouse pointer.
* @name Phaser.Input#totalActivePointers
* @property {integers} totalActivePointers
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "totalActivePointers", {

    get: function () {
        return this.countActivePointers();
    }

});

/**
* The world X coordinate of the most recently active pointer.
* @name Phaser.Input#worldX
* @property {number} worldX - The world X coordinate of the most recently active pointer.
* @readonly
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
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "worldY", {

    get: function () {
        return this.game.camera.view.y + this.y;
    }

});
