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
    * @property {function} moveCallback - An optional callback that will be fired every time the activePointer receives a move event from the DOM. Set to null to disable.
    */
    this.moveCallback = null;

    /**
    * @property {object} moveCallbackContext - The context in which the moveCallback will be sent. Defaults to Phaser.Input but can be set to any valid JS object.
    */
    this.moveCallbackContext = this;
    
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
    * How often should the input pointers be checked for updates?
    * A value of 0 means every single frame (60fps), a value of 1 means every other frame (30fps) and so on.
    * @property {number} pollRate 
    * @default
    */
    pollRate: 0,
    
    /**
    * @property {number} _pollCounter - Internal var holding the current poll counter.
    * @private
    * @default
    */
    _pollCounter: 0,

    /**
    * @property {Phaser.Point} _oldPosition - A point object representing the previous position of the Pointer.
    * @private
    * @default 
    */
    _oldPosition: null,

    /**
    * @property {number} _x - x coordinate of the most recent Pointer event
    * @private
    * @default
    */
    _x: 0,

    /**
    * @property {number} _y - Y coordinate of the most recent Pointer event
    * @private
    * @default
    */
    _y: 0,

    /**
    * You can disable all Input by setting Input.disabled: true. While set all new input related events will be ignored.
    * If you need to disable just one type of input, for example mouse, use Input.mouse.disabled: true instead
    * @property {boolean} disabled
    * @default
    */
    disabled: false,

    /**
    * Controls the expected behaviour when using a mouse and touch together on a multi-input device.
    * @property {Description} multiInputOverride
    */
    multiInputOverride: Phaser.Input.MOUSE_TOUCH_COMBINE,

    /**
    * @property {Phaser.Point} position - A point object representing the current position of the Pointer.
    * @default 
    */
    position: null,

    /**
    * A point object representing the speed of the Pointer. Only really useful in single Pointer games, otherwise see the Pointer objects directly.
    * @property {Phaser.Point} speed
    */
    speed: null,

    /**
    * A Circle object centered on the x/y screen coordinates of the Input.
    * Default size of 44px (Apples recommended "finger tip" size) but can be changed to anything.
    * @property {Phaser.Circle} circle
    */
    circle: null,

    /**
    * The scale by which all input coordinates are multiplied, calculated by the StageScaleMode.
    * In an un-scaled game the values will be x: 1 and y: 1.
    * @property {Phaser.Point} scale
    */
    scale: null,

    /**
    * The maximum number of Pointers allowed to be active at any one time.
    * For lots of games it's useful to set this to 1.
    * @property {number} maxPointers
    * @default
    */
    maxPointers: 10,

    /**
    * The current number of active Pointers.
    * @property {number} currentPointers
    * @default
    */
    currentPointers: 0,

    /**
    * The number of milliseconds that the Pointer has to be pressed down and then released to be considered a tap or clicke
    * @property {number} tapRate
    * @default
    */
    tapRate: 200,

    /**
    * The number of milliseconds between taps of the same Pointer for it to be considered a double tap / click
    * @property {number} doubleTapRate
    * @default
    */
    doubleTapRate: 300,

    /**
    * The number of milliseconds that the Pointer has to be pressed down for it to fire a onHold event
    * @property {number} holdRate
    * @default
    */
    holdRate: 2000,

    /**
    * The number of milliseconds below which the Pointer is considered justPressed
    * @property {number} justPressedRate
    * @default
    */
    justPressedRate: 200,

    /**
    * The number of milliseconds below which the Pointer is considered justReleased 
    * @property {number} justReleasedRate
    * @default
    */
    justReleasedRate: 200,

    /**
    * Sets if the Pointer objects should record a history of x/y coordinates they have passed through.
    * The history is cleared each time the Pointer is pressed down.
    * The history is updated at the rate specified in Input.pollRate
    * @property {boolean} recordPointerHistory
    * @default
    */
    recordPointerHistory: false,

    /**
    * The rate in milliseconds at which the Pointer objects should update their tracking history
    * @property {number} recordRate
    * @default
    */
    recordRate: 100,

    /**
    * The total number of entries that can be recorded into the Pointer objects tracking history.
    * If the Pointer is tracking one event every 100ms, then a trackLimit of 100 would store the last 10 seconds worth of history.
    * @property {number} recordLimit
    * @default
    */
    recordLimit: 100,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer1
    */
    pointer1: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer2
    */
    pointer2: null,

    /**
    * A Pointer object  
    * @property {Phaser.Pointer} pointer3
    */
    pointer3: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer4
    */
    pointer4: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer5
    */
    pointer5: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer6
    */
    pointer6: null,

    /**
    * A Pointer object  
    * @property {Phaser.Pointer} pointer7
    */
    pointer7: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer8
    */
    pointer8: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer9
    */
    pointer9: null,

    /**
    * A Pointer object.
    * @property {Phaser.Pointer} pointer10
    */
    pointer10: null,

    /**
    * The most recently active Pointer object.
    * When you've limited max pointers to 1 this will accurately be either the first finger touched or mouse.
    * @property {Phaser.Pointer} activePointer
    * @default
    */
    activePointer: null,

    /**
    * The mouse has its own unique Phaser.Pointer object which you can use if making a desktop specific game.
    * @property {Pointer} mousePointer
    * @default
    */
    mousePointer: null,
    
    /**
    * The Mouse Input manager.
    * @property {Phaser.Mouse} mouse - The Mouse Input manager.
    * @default
    */
    mouse: null,
    
    /**
    * The Keyboard Input manager.
    * @property {Phaser.Keyboard} keyboard - The Keyboard Input manager.
    * @default
    */
    keyboard: null,
    
    /**
    * The Touch Input manager.
    * @property {Phaser.Touch} touch - the Touch Input manager.
    * @default
    */
    touch: null,
    
    /**
    * The MSPointer Input manager.
    * @property {Phaser.MSPointer} mspointer - The MSPointer Input manager.
    * @default
    */
    mspointer: null,

    /**
     * The Gamepad Input manager.
     * @property {Phaser.Gamepad} gamepad - The Gamepad Input manager.
     * @default
     */
    gamepad: null,

    /**
    * A Signal that is dispatched each time a pointer is pressed down.
    * @property {Phaser.Signal} onDown
    * @default
    */
    onDown: null,
    
    /**
    * A Signal that is dispatched each time a pointer is released.
    * @property {Phaser.Signal} onUp
    * @default
    */
    onUp: null,
    
    /**
    * A Signal that is dispatched each time a pointer is tapped.
    * @property {Phaser.Signal} onTap
    * @default
    */
    onTap: null,
    
    /**
    * A Signal that is dispatched each time a pointer is held down.
    * @property {Phaser.Signal} onHold
    * @default
    */
    onHold: null,

    /**
    * A linked list of interactive objects, the InputHandler components (belonging to Sprites) register themselves with this.
    * @property {Phaser.LinkedList} interactiveItems
    */
    interactiveItems: new Phaser.LinkedList(),

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

        this.moveCallback = null;

    },

    /**
    * Sets a callback that is fired every time the activePointer receives a DOM move event such as a mousemove or touchmove.
    * It will be called every time the activePointer moves, which in a multi-touch game can be a lot of times, so this is best
    * to only use if you've limited input to a single pointer (i.e. mouse or touch)
    * @method Phaser.Input#setMoveCallback
    * @param {function} callback - The callback that will be called each time the activePointer receives a DOM move event.
    * @param {object} callbackContext - The context in which the callback will be called.
    */
    setMoveCallback: function (callback, callbackContext) {

        this.moveCallback = callback;
        this.moveCallbackContext = callbackContext;

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
    },

    /**
    * Reset all of the Pointers and Input states
    * @method Phaser.Input#reset
    * @param {boolean} hard - A soft reset (hard = false) won't reset any Signals that might be bound. A hard reset will.
    */
    reset: function (hard) {

        if (this.game.isBooted === false)
        {
            return;
        }

        if (typeof hard == 'undefined') { hard = false; }

        this.keyboard.reset();
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
            this.game.canvas.style.cursor = 'default';
        }

        if (hard === true)
        {
            this.onDown.dispose();
            this.onUp.dispose();
            this.onTap.dispose();
            this.onHold.dispose();
            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();
            this.onTap = new Phaser.Signal();
            this.onHold = new Phaser.Signal();

            this.interactiveItems.callAll('reset');
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
    * Get the Pointer object whos identified property matches the given identifier value.
    * @method Phaser.Input#getPointerFromIdentifier
    * @param {number} identifier - The Pointer.identifier value to search for.
    * @return {Phaser.Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
    */
    getPointerFromIdentifier: function (identifier) {

        if (this.pointer1.identifier == identifier)
        {
            return this.pointer1;
        }
        else if (this.pointer2.identifier == identifier)
        {
            return this.pointer2;
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].identifier == identifier)
                {
                    return this['pointer' + i];
                }
            }
        }

        return null;

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
