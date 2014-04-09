/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - Pointer constructor.
*
* @class Phaser.Pointer
* @classdesc A Pointer object is used by the Mouse, Touch and MSPoint managers and represents a single finger on the touch screen.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} id - The ID of the Pointer object within the game. Each game can have up to 10 active pointers.
*/
Phaser.Pointer = function (game, id) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {number} id - The ID of the Pointer object within the game. Each game can have up to 10 active pointers.
    */
    this.id = id;

    /**
    * @property {boolean} _holdSent - Local private variable to store the status of dispatching a hold event.
    * @private
    * @default
    */
    this._holdSent = false;

    /**
    * @property {array} _history - Local private variable storing the short-term history of pointer movements.
    * @private
    */
    this._history = [];

    /**
    * @property {number} _lastDrop - Local private variable storing the time at which the next history drop should occur.
    * @private
    * @default
    */
    this._nextDrop = 0;

    /**
    * @property {boolean} _stateReset - Monitor events outside of a state reset loop.
    * @private
    * @default
    */
    this._stateReset = false;

    /**
    * @property {boolean} withinGame - true if the Pointer is within the game area, otherwise false.
    */
    this.withinGame = false;

    /**
    * @property {number} clientX - The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset.
    * @default
    */
    this.clientX = -1;

    /**
    * @property {number} clientY - The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset.
    * @default
    */
    this.clientY = -1;

    /**
    * @property {number} pageX - The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset.
    * @default
    */
    this.pageX = -1;

    /**
    * @property {number} pageY - The vertical coordinate of point relative to the viewport in pixels, including any scroll offset.
    * @default
    */
    this.pageY = -1;

    /**
    * @property {number} screenX - The horizontal coordinate of point relative to the screen in pixels.
    * @default
    */
    this.screenX = -1;

    /**
    * @property {number} screenY - The vertical coordinate of point relative to the screen in pixels.
    * @default
    */
    this.screenY = -1;

    /**
    * @property {number} x - The horizontal coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @default
    */
    this.x = -1;

    /**
    * @property {number} y - The vertical coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @default
    */
    this.y = -1;

    /**
    * @property {boolean} isMouse - If the Pointer is a mouse this is true, otherwise false.
    * @default
    */
    this.isMouse = false;

    /**
    * @property {boolean} isDown - If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true.
    * @default
    */
    this.isDown = false;

    /**
    * @property {boolean} isUp - If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true.
    * @default
    */
    this.isUp = true;

    /**
    * @property {number} timeDown - A timestamp representing when the Pointer first touched the touchscreen.
    * @default
    */
    this.timeDown = 0;

    /**
    * @property {number} timeUp - A timestamp representing when the Pointer left the touchscreen.
    * @default
    */
    this.timeUp = 0;

    /**
    * @property {number} previousTapTime - A timestamp representing when the Pointer was last tapped or clicked.
    * @default
    */
    this.previousTapTime = 0;

    /**
    * @property {number} totalTouches - The total number of times this Pointer has been touched to the touchscreen.
    * @default
    */
    this.totalTouches = 0;

    /**
    * @property {number} msSinceLastClick - The number of miliseconds since the last click.
    * @default
    */
    this.msSinceLastClick = Number.MAX_VALUE;

    /**
    * @property {any} targetObject - The Game Object this Pointer is currently over / touching / dragging.
    * @default
    */
    this.targetObject = null;

    /**
    * @property {boolean} active - An active pointer is one that is currently pressed down on the display. A Mouse is always active.
    * @default
    */
    this.active = false;

    /**
    * @property {Phaser.Point} position - A Phaser.Point object containing the current x/y values of the pointer on the display.
    */
    this.position = new Phaser.Point();

    /**
    * @property {Phaser.Point} positionDown - A Phaser.Point object containing the x/y values of the pointer when it was last in a down state on the display.
    */
    this.positionDown = new Phaser.Point();
    
    /**
    * @property {Phaser.Point} positionUp - A Phaser.Point object containing the x/y values of the pointer when it was last released.
    */
    this.positionUp = new Phaser.Point();

    /**
    * A Phaser.Circle that is centered on the x/y coordinates of this pointer, useful for hit detection.
    * The Circle size is 44px (Apples recommended "finger tip" size).
    * @property {Phaser.Circle} circle
    */
    this.circle = new Phaser.Circle(0, 0, 44);

    if (id === 0)
    {
        this.isMouse = true;
    }

};

Phaser.Pointer.prototype = {

    /**
    * Called when the Pointer is pressed onto the touchscreen.
    * @method Phaser.Pointer#start
    * @param {Any} event
    */
    start: function (event) {

        this.identifier = event.identifier;
        this.target = event.target;

        if (typeof event.button !== 'undefined')
        {
            this.button = event.button;
        }

        this._history = [];
        this.active = true;
        this.withinGame = true;
        this.isDown = true;
        this.isUp = false;

        //  Work out how long it has been since the last click
        this.msSinceLastClick = this.game.time.now - this.timeDown;
        this.timeDown = this.game.time.now;
        this._holdSent = false;

        //  This sets the x/y and other local values
        this.move(event, true);

        // x and y are the old values here?
        this.positionDown.setTo(this.x, this.y);

        if (this.game.input.multiInputOverride === Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride === Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride === Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
        {
            this.game.input.x = this.x;
            this.game.input.y = this.y;
            this.game.input.position.setTo(this.x, this.y);
            this.game.input.onDown.dispatch(this, event);
            this.game.input.resetSpeed(this.x, this.y);
        }

        this._stateReset = false;
        this.totalTouches++;

        if (!this.isMouse)
        {
            this.game.input.currentPointers++;
        }

        if (this.targetObject !== null)
        {
            this.targetObject._touchedHandler(this);
        }

        return this;

    },

    /**
    * Called by the Input Manager.
    * @method Phaser.Pointer#update
    */
    update: function () {

        if (this.active)
        {
            if (this._holdSent === false && this.duration >= this.game.input.holdRate)
            {
                if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
                {
                    this.game.input.onHold.dispatch(this);
                }

                this._holdSent = true;
            }

            //  Update the droppings history
            if (this.game.input.recordPointerHistory && this.game.time.now >= this._nextDrop)
            {
                this._nextDrop = this.game.time.now + this.game.input.recordRate;

                this._history.push({
                    x: this.position.x,
                    y: this.position.y
                });

                if (this._history.length > this.game.input.recordLimit)
                {
                    this._history.shift();
                }
            }
        }

    },

    /**
    * Called when the Pointer is moved.
    * @method Phaser.Pointer#move
    * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
    * @param {boolean} [fromClick=false] - Was this called from the click event?
    */
    move: function (event, fromClick) {

        if (this.game.input.pollLocked)
        {
            return;
        }

        if (typeof fromClick === 'undefined') { fromClick = false; }

        if (typeof event.button !== 'undefined')
        {
            this.button = event.button;
        }

        this.clientX = event.clientX;
        this.clientY = event.clientY;

        this.pageX = event.pageX;
        this.pageY = event.pageY;

        this.screenX = event.screenX;
        this.screenY = event.screenY;

        this.x = (this.pageX - this.game.stage.offset.x) * this.game.input.scale.x;
        this.y = (this.pageY - this.game.stage.offset.y) * this.game.input.scale.y;

        this.position.setTo(this.x, this.y);
        this.circle.x = this.x;
        this.circle.y = this.y;

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
        {
            this.game.input.activePointer = this;
            this.game.input.x = this.x;
            this.game.input.y = this.y;
            this.game.input.position.setTo(this.game.input.x, this.game.input.y);
            this.game.input.circle.x = this.game.input.x;
            this.game.input.circle.y = this.game.input.y;
        }

        //  If the game is paused we don't process any target objects or callbacks
        if (this.game.paused)
        {
            return this;
        }

        if (this.game.input.moveCallback)
        {
            this.game.input.moveCallback.call(this.game.input.moveCallbackContext, this, this.x, this.y);
        }

        //  Easy out if we're dragging something and it still exists
        if (this.targetObject !== null && this.targetObject.isDragged === true)
        {
            if (this.targetObject.update(this) === false)
            {
                this.targetObject = null;
            }

            return this;
        }

        //  Work out which object is on the top
        this._highestRenderOrderID = Number.MAX_SAFE_INTEGER;
        this._highestRenderObject = null;
        this._highestInputPriorityID = -1;

        //  Just run through the linked list
        if (this.game.input.interactiveItems.total > 0)
        {
            var currentNode = this.game.input.interactiveItems.next;

            do
            {
                //  If the object is using pixelPerfect checks, or has a higher InputManager.PriorityID OR if the priority ID is the same as the current highest AND it has a higher renderOrderID, then set it to the top
                if (currentNode.validForInput(this._highestInputPriorityID, this._highestRenderOrderID))
                {
                    if ((!fromClick && currentNode.checkPointerOver(this)) || (fromClick && currentNode.checkPointerDown(this)))
                    {
                        this._highestRenderOrderID = currentNode.sprite._cache[3]; // renderOrderID
                        this._highestInputPriorityID = currentNode.priorityID;
                        this._highestRenderObject = currentNode;
                    }
                }
                currentNode = currentNode.next;
            }
            while (currentNode != null);
        }

        if (this._highestRenderObject === null)
        {
            //  The pointer isn't currently over anything, check if we've got a lingering previous target
            if (this.targetObject)
            {
                // console.log("The pointer isn't currently over anything, check if we've got a lingering previous target");
                this.targetObject._pointerOutHandler(this);
                this.targetObject = null;
            }
        }
        else
        {
            if (this.targetObject === null)
            {
                //  And now set the new one
                // console.log('And now set the new one');
                this.targetObject = this._highestRenderObject;
                this._highestRenderObject._pointerOverHandler(this);
            }
            else
            {
                //  We've got a target from the last update
                // console.log("We've got a target from the last update");
                if (this.targetObject === this._highestRenderObject)
                {
                    //  Same target as before, so update it
                    // console.log("Same target as before, so update it");
                    if (this._highestRenderObject.update(this) === false)
                    {
                        this.targetObject = null;
                    }
                }
                else
                {
                    //  The target has changed, so tell the old one we've left it
                    // console.log("The target has changed, so tell the old one we've left it");
                    this.targetObject._pointerOutHandler(this);

                    //  And now set the new one
                    this.targetObject = this._highestRenderObject;
                    this.targetObject._pointerOverHandler(this);
                }
            }
        }

        return this;

    },

    /**
    * Called when the Pointer leaves the target area.
    * @method Phaser.Pointer#leave
    * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
    */
    leave: function (event) {

        this.withinGame = false;
        this.move(event, false);

    },

    /**
    * Called when the Pointer leaves the touchscreen.
    * @method Phaser.Pointer#stop
    * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
    */
    stop: function (event) {

        if (this._stateReset)
        {
            event.preventDefault();
            return;
        }

        this.timeUp = this.game.time.now;

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
        {
            this.game.input.onUp.dispatch(this, event);

            //  Was it a tap?
            if (this.duration >= 0 && this.duration <= this.game.input.tapRate)
            {
                //  Was it a double-tap?
                if (this.timeUp - this.previousTapTime < this.game.input.doubleTapRate)
                {
                    //  Yes, let's dispatch the signal then with the 2nd parameter set to true
                    this.game.input.onTap.dispatch(this, true);
                }
                else
                {
                    //  Wasn't a double-tap, so dispatch a single tap signal
                    this.game.input.onTap.dispatch(this, false);
                }

                this.previousTapTime = this.timeUp;
            }
        }

        //  Mouse is always active
        if (this.id > 0)
        {
            this.active = false;
        }

        this.withinGame = false;
        this.isDown = false;
        this.isUp = true;
        
        this.positionUp.setTo(this.x, this.y);
        
        if (this.isMouse === false)
        {
            this.game.input.currentPointers--;
        }

        if (this.game.input.interactiveItems.total > 0)
        {
            var currentNode = this.game.input.interactiveItems.next;

            do
            {
                if (currentNode)
                {
                    currentNode._releasedHandler(this);
                }

                currentNode = currentNode.next;
            }
            while (currentNode != null);
        }

        if (this.targetObject)
        {
            this.targetObject._releasedHandler(this);
        }

        this.targetObject = null;
        return this;

    },

    /**
    * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate.
    * Note that calling justPressed doesn't reset the pressed status of the Pointer, it will return `true` for as long as the duration is valid.
    * If you wish to check if the Pointer was pressed down just once then see the Sprite.events.onInputDown event.
    * @method Phaser.Pointer#justPressed
    * @param {number} [duration] - The time to check against. If none given it will use InputManager.justPressedRate.
    * @return {boolean} true if the Pointer was pressed down within the duration given.
    */
    justPressed: function (duration) {

        duration = duration || this.game.input.justPressedRate;

        return (this.isDown === true && (this.timeDown + duration) > this.game.time.now);

    },

    /**
    * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate.
    * Note that calling justReleased doesn't reset the pressed status of the Pointer, it will return `true` for as long as the duration is valid.
    * If you wish to check if the Pointer was released just once then see the Sprite.events.onInputUp event.
    * @method Phaser.Pointer#justReleased
    * @param {number} [duration] - The time to check against. If none given it will use InputManager.justReleasedRate.
    * @return {boolean} true if the Pointer was released within the duration given.
    */
    justReleased: function (duration) {

        duration = duration || this.game.input.justReleasedRate;

        return (this.isUp === true && (this.timeUp + duration) > this.game.time.now);

    },

    /**
    * Resets the Pointer properties. Called by InputManager.reset when you perform a State change.
    * @method Phaser.Pointer#reset
    */
    reset: function () {

        if (this.isMouse === false)
        {
            this.active = false;
        }

        this.identifier = null;
        this.isDown = false;
        this.isUp = true;
        this.totalTouches = 0;
        this._holdSent = false;
        this._history.length = 0;
        this._stateReset = true;

        if (this.targetObject)
        {
            this.targetObject._releasedHandler(this);
        }

        this.targetObject = null;

    }

};

Phaser.Pointer.prototype.constructor = Phaser.Pointer;

/**
* How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
* @name Phaser.Pointer#duration
* @property {number} duration - How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
* @readonly
*/
Object.defineProperty(Phaser.Pointer.prototype, "duration", {

    get: function () {

        if (this.isUp)
        {
            return -1;
        }

        return this.game.time.now - this.timeDown;

    }

});

/**
* Gets the X value of this Pointer in world coordinates based on the world camera.
* @name Phaser.Pointer#worldX
* @property {number} duration - The X value of this Pointer in world coordinates based on the world camera.
* @readonly
*/
Object.defineProperty(Phaser.Pointer.prototype, "worldX", {

    get: function () {

        return this.game.world.camera.x + this.x;

    }

});

/**
* Gets the Y value of this Pointer in world coordinates based on the world camera.
* @name Phaser.Pointer#worldY
* @property {number} duration - The Y value of this Pointer in world coordinates based on the world camera.
* @readonly
*/
Object.defineProperty(Phaser.Pointer.prototype, "worldY", {

    get: function () {

        return this.game.world.camera.y + this.y;

    }

});
