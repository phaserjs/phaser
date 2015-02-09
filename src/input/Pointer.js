/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Pointer object is used by the Mouse, Touch and MSPoint managers and represents a single finger on the touch screen.
*
* @class Phaser.Pointer
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
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.POINTER;

    /**
    * @property {boolean} exists - A Pointer object that exists is allowed to be checked for physics collisions and overlaps.
    * @default
    */
    this.exists = true;

    /**
    * @property {number} identifier - The identifier property of the Pointer as set by the DOM event when this Pointer is started.
    * @default
    */
    this.identifier = 0;

    /**
    * @property {number} pointerId - The pointerId property of the Pointer as set by the DOM event when this Pointer is started. The browser can and will recycle this value.
    * @default
    */
    this.pointerId = null;

    /**
    * @property {any} target - The target property of the Pointer as set by the DOM event when this Pointer is started.
    * @default
    */
    this.target = null;

    /**
    * @property {any} button - The button property of the Pointer as set by the DOM event when this Pointer is started.
    * @default
    */
    this.button = null;

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
    * @property {number} _nextDrop - Local private variable storing the time at which the next history drop should occur.
    * @private
    */
    this._nextDrop = 0;

    /**
    * @property {boolean} _stateReset - Monitor events outside of a state reset loop.
    * @private
    */
    this._stateReset = false;

    /**
    * @property {boolean} withinGame - true if the Pointer is over the game canvas, otherwise false.
    */
    this.withinGame = false;

    /**
    * @property {number} clientX - The horizontal coordinate of the Pointer within the application's client area at which the event occurred (as opposed to the coordinates within the page).
    */
    this.clientX = -1;

    /**
    * @property {number} clientY - The vertical coordinate of the Pointer within the application's client area at which the event occurred (as opposed to the coordinates within the page).
    */
    this.clientY = -1;

    /**
    * @property {number} pageX - The horizontal coordinate of the Pointer relative to whole document.
    */
    this.pageX = -1;

    /**
    * @property {number} pageY - The vertical coordinate of the Pointer relative to whole document.
    */
    this.pageY = -1;

    /**
    * @property {number} screenX - The horizontal coordinate of the Pointer relative to the screen.
    */
    this.screenX = -1;

    /**
    * @property {number} screenY - The vertical coordinate of the Pointer relative to the screen.
    */
    this.screenY = -1;

    /**
    * @property {number} rawMovementX - The horizontal raw relative movement of the Pointer in pixels since last event.
    * @default
    */
    this.rawMovementX = 0;

    /**
    * @property {number} rawMovementY - The vertical raw relative movement of the Pointer in pixels since last event.
    * @default
    */
    this.rawMovementY = 0;

    /**
    * @property {number} movementX - The horizontal processed relative movement of the Pointer in pixels since last event.
    * @default
    */
    this.movementX = 0;

    /**
    * @property {number} movementY - The vertical processed relative movement of the Pointer in pixels since last event.
    * @default
    */
    this.movementY = 0;

    /**
    * @property {number} x - The horizontal coordinate of the Pointer. This value is automatically scaled based on the game scale.
    * @default
    */
    this.x = -1;

    /**
    * @property {number} y - The vertical coordinate of the Pointer. This value is automatically scaled based on the game scale.
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
    * @property {number} msSinceLastClick - The number of milliseconds since the last click or touch event.
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
    * @property {boolean} dirty - A dirty pointer needs to re-poll any interactive objects it may have been over, regardless if it has moved or not.
    * @default
    */
    this.dirty = false;

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

    /**
    * Click trampolines associated with this pointer. See `addClickTrampoline`.
    * @property {object[]|null} _clickTrampolines
    * @private
    */
    this._clickTrampolines = null;

    /**
    * When the Pointer has click trampolines the last target object is stored here
    * so it can be used to check for validity of the trampoline in a post-Up/'stop'.
    * @property {object} _trampolineTargetObject
    * @private
    */
    this._trampolineTargetObject = null;

};

Phaser.Pointer.prototype = {

    /**
    * Called when the Pointer is pressed onto the touchscreen.
    * @method Phaser.Pointer#start
    * @param {any} event - The DOM event from the browser.
    */
    start: function (event) {

        if (event['pointerId'])
        {
            this.pointerId = event.pointerId;
        }

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
        this.dirty = false;
        this._clickTrampolines = null;
        this._trampolineTargetObject = null;

        //  Work out how long it has been since the last click
        this.msSinceLastClick = this.game.time.time - this.timeDown;
        this.timeDown = this.game.time.time;
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
            //  Force a check?
            if (this.dirty)
            {
                if (this.game.input.interactiveItems.total > 0)
                {
                    this.processInteractiveObjects(false);
                }

                this.dirty = false;
            }

            if (this._holdSent === false && this.duration >= this.game.input.holdRate)
            {
                if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
                {
                    this.game.input.onHold.dispatch(this);
                }

                this._holdSent = true;
            }

            //  Update the droppings history
            if (this.game.input.recordPointerHistory && this.game.time.time >= this._nextDrop)
            {
                this._nextDrop = this.game.time.time + this.game.input.recordRate;

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
    * 
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

        if (this.isMouse && this.game.input.mouse.locked && !fromClick)
        {
            this.rawMovementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            this.rawMovementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            this.movementX += this.rawMovementX;
            this.movementY += this.rawMovementY;
        }

        this.x = (this.pageX - this.game.scale.offset.x) * this.game.input.scale.x;
        this.y = (this.pageY - this.game.scale.offset.y) * this.game.input.scale.y;

        this.position.setTo(this.x, this.y);
        this.circle.x = this.x;
        this.circle.y = this.y;

        if (this.game.input.multiInputOverride === Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride === Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride === Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
        {
            this.game.input.activePointer = this;
            this.game.input.x = this.x;
            this.game.input.y = this.y;
            this.game.input.position.setTo(this.game.input.x, this.game.input.y);
            this.game.input.circle.x = this.game.input.x;
            this.game.input.circle.y = this.game.input.y;
        }

        this.withinGame = this.game.scale.bounds.contains(this.pageX, this.pageY);

        //  If the game is paused we don't process any target objects or callbacks
        if (this.game.paused)
        {
            return this;
        }

        var i = this.game.input.moveCallbacks.length;

        while (i--)
        {
            this.game.input.moveCallbacks[i].callback.call(this.game.input.moveCallbacks[i].context, this, this.x, this.y, fromClick);
        }

        //  Easy out if we're dragging something and it still exists
        if (this.targetObject !== null && this.targetObject.isDragged === true)
        {
            if (this.targetObject.update(this) === false)
            {
                this.targetObject = null;
            }
        }
        else if (this.game.input.interactiveItems.total > 0)
        {
            this.processInteractiveObjects(fromClick);
        }

        return this;

    },

    /**
    * Process all interactive objects to find out which ones were updated in the recent Pointer move.
    * 
    * @method Phaser.Pointer#processInteractiveObjects
    * @protected
    * @param {boolean} [fromClick=false] - Was this called from the click event?
    * @return {boolean} True if this method processes an object (i.e. a Sprite becomes the Pointers currentTarget), otherwise false.
    */
    processInteractiveObjects: function (fromClick) {

        //  Work out which object is on the top
        var highestRenderOrderID = Number.MAX_VALUE;
        var highestInputPriorityID = -1;
        var candidateTarget = null;

        //  First pass gets all objects that the pointer is over that DON'T use pixelPerfect checks and get the highest ID
        //  We know they'll be valid for input detection but not which is the top just yet

        var currentNode = this.game.input.interactiveItems.first;

        while (currentNode)
        {
            //  Reset checked status
            currentNode.checked = false;

            if (currentNode.validForInput(highestInputPriorityID, highestRenderOrderID, false))
            {
                //  Flag it as checked so we don't re-scan it on the next phase
                currentNode.checked = true;

                if ((fromClick && currentNode.checkPointerDown(this, true)) ||
                    (!fromClick && currentNode.checkPointerOver(this, true)))
                {
                    highestRenderOrderID = currentNode.sprite._cache[3]; // renderOrderID
                    highestInputPriorityID = currentNode.priorityID;
                    candidateTarget = currentNode;
                }
            }

            currentNode = this.game.input.interactiveItems.next;
        }

        //  Then in the second sweep we process ONLY the pixel perfect ones that are checked and who have a higher ID
        //  because if their ID is lower anyway then we can just automatically discount them
        //  (A node that was previously checked did not request a pixel-perfect check.)

        var currentNode = this.game.input.interactiveItems.first;

        while(currentNode)
        {
            if (!currentNode.checked &&
                currentNode.validForInput(highestInputPriorityID, highestRenderOrderID, true))
            {
                if ((fromClick && currentNode.checkPointerDown(this, false)) ||
                    (!fromClick && currentNode.checkPointerOver(this, false)))
                {
                    highestRenderOrderID = currentNode.sprite._cache[3]; // renderOrderID
                    highestInputPriorityID = currentNode.priorityID;
                    candidateTarget = currentNode;
                }
            }

            currentNode = this.game.input.interactiveItems.next;
        }

        //  Now we know the top-most item (if any) we can process it
        if (candidateTarget === null)
        {
            //  The pointer isn't currently over anything, check if we've got a lingering previous target
            if (this.targetObject)
            {
                this.targetObject._pointerOutHandler(this);
                this.targetObject = null;
            }
        }
        else
        {
            if (this.targetObject === null)
            {
                //  And now set the new one
                this.targetObject = candidateTarget;
                candidateTarget._pointerOverHandler(this);
            }
            else
            {
                //  We've got a target from the last update
                if (this.targetObject === candidateTarget)
                {
                    //  Same target as before, so update it
                    if (candidateTarget.update(this) === false)
                    {
                        this.targetObject = null;
                    }
                }
                else
                {
                    //  The target has changed, so tell the old one we've left it
                    this.targetObject._pointerOutHandler(this);

                    //  And now set the new one
                    this.targetObject = candidateTarget;
                    this.targetObject._pointerOverHandler(this);
                }
            }
        }

        return (this.targetObject !== null);

    },

    /**
    * Called when the Pointer leaves the target area.
    *
    * @method Phaser.Pointer#leave
    * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
    */
    leave: function (event) {

        this.withinGame = false;
        this.move(event, false);

    },

    /**
    * Called when the Pointer leaves the touchscreen.
    *
    * @method Phaser.Pointer#stop
    * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
    */
    stop: function (event) {

        if (this._stateReset)
        {
            event.preventDefault();
            return;
        }

        this.timeUp = this.game.time.time;

        if (this.game.input.multiInputOverride === Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride === Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride === Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
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
        this.pointerId = null;
        this.identifier = null;
        
        this.positionUp.setTo(this.x, this.y);
        
        if (this.isMouse === false)
        {
            this.game.input.currentPointers--;
        }

        this.game.input.interactiveItems.callAll('_releasedHandler', this);

        if (this._clickTrampolines)
        {
            this._trampolineTargetObject = this.targetObject;
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

        return (this.isDown === true && (this.timeDown + duration) > this.game.time.time);

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

        return (this.isUp === true && (this.timeUp + duration) > this.game.time.time);

    },

    /**
    * Add a click trampoline to this pointer.
    *
    * A click trampoline is a callback that is run on the DOM 'click' event; this is primarily
    * needed with certain browsers (ie. IE11) which restrict some actions like requestFullscreen
    * to the DOM 'click' event and reject it for 'pointer*' and 'mouse*' events.
    *
    * This is used internally by the ScaleManager; click trampoline usage is uncommon.
    * Click trampolines can only be added to pointers that are currently down.
    *
    * @method Phaser.Pointer#addClickTrampoline
    * @protected
    * @param {string} name - The name of the trampoline; must be unique among active trampolines in this pointer.
    * @param {function} callback - Callback to run/trampoline.
    * @param {object} callbackContext - Context of the callback.
    * @param {object[]|null} callbackArgs - Additional callback args, if any. Supplied as an array.
    */
    addClickTrampoline: function (name, callback, callbackContext, callbackArgs) {

        if (!this.isDown)
        {
            return;
        }

        var trampolines = (this._clickTrampolines = this._clickTrampolines || []);

        for (var i = 0; i < trampolines.length; i++)
        {
            if (trampolines[i].name === name)
            {
                trampolines.splice(i, 1);
                break;
            }
        }

        trampolines.push({
            name: name,
            targetObject: this.targetObject,
            callback: callback,
            callbackContext: callbackContext,
            callbackArgs: callbackArgs
        });

    },

    /**
    * Fire all click trampolines for which the pointers are still refering to the registered object.
    * @method Phaser.Pointer#processClickTrampolines
    * @private
    */
    processClickTrampolines: function () {

        var trampolines = this._clickTrampolines;
        if (!trampolines)
        {
            return;
        }

        for (var i = 0; i < trampolines.length; i++)
        {
            var trampoline = trampolines[i];

            if (trampoline.targetObject === this._trampolineTargetObject)
            {
                trampoline.callback.apply(trampoline.callbackContext, trampoline.callbackArgs);
            }
        }

        this._clickTrampolines = null;
        this._trampolineTargetObject = null;

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

        this.pointerId = null;
        this.identifier = null;
        this.dirty = false;
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

    },

    /**
     * Resets the movementX and movementY properties. Use in your update handler after retrieving the values.
     * @method Phaser.Pointer#resetMovement
     */
    resetMovement: function() {

        this.movementX = 0;
        this.movementY = 0;

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

        return this.game.time.time - this.timeDown;

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
