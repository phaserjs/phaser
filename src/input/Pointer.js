/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Pointer
*/

/**
* Phaser - Pointer constructor.
*
* @class Phaser.Pointer
* @classdesc A Pointer object is used by the Mouse, Touch and MSPoint managers and represents a single finger on the touch screen.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Description} id - Description.
*/
Phaser.Pointer = function (game, id) {

    /**
    * Local private variable to store the status of dispatching a hold event.
    * @property {boolean} _holdSent
    * @private
    * @default
    */
    this._holdSent = false;

    /**
    * Local private variable storing the short-term history of pointer movements.
    * @property {array} _history
    * @private
    */
    this._history = [];

    /**
    * Local private variable storing the time at which the next history drop should occur
    * @property {number} _lastDrop
    * @private
    * @default
    */
    this._nextDrop = 0;

    /**
     * Monitor events outside of a state reset loop.
     * @property {boolean} _stateReset
     * @private
     * @default
     */
    this._stateReset = false;

    /**
    * A Vector object containing the initial position when the Pointer was engaged with the screen.
    * @property {Vec2} positionDown
    * @default 
    **/
    this.positionDown = null;

    /**
    * A Vector object containing the current position of the Pointer on the screen.
    * @property {Vec2} position
    * @default
    **/
    this.position = null;

    /**
    * A Circle object centered on the x/y screen coordinates of the Pointer.
    * Default size of 44px (Apple's recommended "finger tip" size).
    * @property {Circle} circle
    * @default
    **/
    this.circle = null;

    /**
    * Description.
    * @property {boolean} withinGame
    */
    this.withinGame = false;

    /**
    * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset.
    * @property {number} clientX
    * @default
    */
    this.clientX = -1;

    /**
    * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset.
    * @property {number} clientY
    * @default
    */
    this.clientY = -1;

    /**
    * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset.
    * @property {number} pageX
    * @default
    */
    this.pageX = -1;

    /**
    * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset.
    * @property {number} pageY
    * @default
    */
    this.pageY = -1;

    /**
    * The horizontal coordinate of point relative to the screen in pixels.
    * @property {number} screenX
    * @default
    */
    this.screenX = -1;

    /**
    * The vertical coordinate of point relative to the screen in pixels.
    * @property {number} screenY
    * @default
    */
    this.screenY = -1;

    /**
    * The horizontal coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @property {number} x
    * @default
    */
    this.x = -1;

    /**
    * The vertical coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @property {number} y
    * @default
    */
    this.y = -1;

    /**
    * If the Pointer is a mouse this is true, otherwise false.
    * @property {boolean} isMouse
    * @type {boolean}
    */
    this.isMouse = false;

    /**
    * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true.
    * @property {boolean} isDown
    * @default
    */
    this.isDown = false;

    /**
    * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true.
    * @property {boolean} isUp
    * @default
    */
    this.isUp = true;

    /**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @property {number} timeDown
    * @default
    */
    this.timeDown = 0;

    /**
    * A timestamp representing when the Pointer left the touchscreen.
    * @property {number} timeUp
    * @default
    */
    this.timeUp = 0;

    /**
    * A timestamp representing when the Pointer was last tapped or clicked.
    * @property {number} previousTapTime
    * @default
    */
    this.previousTapTime = 0;

    /**
    * The total number of times this Pointer has been touched to the touchscreen.
    * @property {number} totalTouches
    * @default
    */
    this.totalTouches = 0;

    /**
    * The number of miliseconds since the last click.
    * @property {number} msSinceLastClick
    * @default
    */
    this.msSinceLastClick = Number.MAX_VALUE;

    /**
    * The Game Object this Pointer is currently over / touching / dragging.
    * @property {Any} targetObject
    * @default
    */
    this.targetObject = null;

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
	this.game = game;
	
	/**
	* @property {Description} id - Description.
	*/
    this.id = id;

    /**
    * Description.
    * @property {boolean} isDown - Description.
    * @default
    */
    this.active = false;

    /**
    * Description
    * @property {Phaser.Point} position
    */
    this.position = new Phaser.Point();
    
    /**
    * Description
    * @property {Phaser.Point} positionDown
    */
    this.positionDown = new Phaser.Point();

    /**
    * Description
    * @property {Phaser.Circle} circle
    */
    this.circle = new Phaser.Circle(0, 0, 44);

    if (id == 0)
    {
        this.isMouse = true;
    }

};

Phaser.Pointer.prototype = {

	/**
    * Called when the Pointer is pressed onto the touchscreen.
    * @method start
    * @param {Any} event
    */
    start: function (event) {

        this.identifier = event.identifier;
        this.target = event.target;

        if (event.button)
        {
            this.button = event.button;
        }

        //  Fix to stop rogue browser plugins from blocking the visibility state event
        if (this.game.paused == true && this.game.stage.scale.incorrectOrientation == false)
        {
            this.game.paused = false;
            return this;
        }

        this._history.length = 0;
        this.active = true;
        this.withinGame = true;
        this.isDown = true;
        this.isUp = false;

        //  Work out how long it has been since the last click
        this.msSinceLastClick = this.game.time.now - this.timeDown;
        this.timeDown = this.game.time.now;
        this._holdSent = false;

        //  This sets the x/y and other local values
        this.move(event);

        // x and y are the old values here?
        this.positionDown.setTo(this.x, this.y);

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
        {
            this.game.input.x = this.x * this.game.input.scale.x;
            this.game.input.y = this.y * this.game.input.scale.y;
            this.game.input.position.setTo(this.x, this.y);
            this.game.input.onDown.dispatch(this);
            this.game.input.resetSpeed(this.x, this.y);
        }

        this._stateReset = false;
        this.totalTouches++;

        if (this.isMouse == false)
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
    * Description.
    * @method update
    */
    update: function () {

        if (this.active)
        {
            if (this._holdSent == false && this.duration >= this.game.input.holdRate)
            {
                if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
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
    * Called when the Pointer is moved
    * @method move
    * @param {Any} event
    */
    move: function (event) {

        if (this.game.input.pollLocked)
        {
            return;
        }

        if (event.button)
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

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
        {
            this.game.input.activePointer = this;
            this.game.input.x = this.x;
            this.game.input.y = this.y;
            this.game.input.position.setTo(this.game.input.x, this.game.input.y);
            this.game.input.circle.x = this.game.input.x;
            this.game.input.circle.y = this.game.input.y;
        }

        //  If the game is paused we don't process any target objects
        if (this.game.paused)
        {
            return this;
        }

        //  Easy out if we're dragging something and it still exists
        if (this.targetObject !== null && this.targetObject.isDragged == true)
        {
            if (this.targetObject.update(this) == false)
            {
                this.targetObject = null;
            }

            return this;

        }

        //  Work out which object is on the top
        this._highestRenderOrderID = -1;
        this._highestRenderObject = null;
        this._highestInputPriorityID = -1;

        //  Just run through the linked list
        if (this.game.input.interactiveItems.total > 0)
        {
            var currentNode = this.game.input.interactiveItems.next;

            do  
            {
                //  If the object is using pixelPerfect checks, or has a higher InputManager.PriorityID OR if the priority ID is the same as the current highest AND it has a higher renderOrderID, then set it to the top
                if (currentNode.pixelPerfect || currentNode.priorityID > this._highestInputPriorityID || (currentNode.priorityID == this._highestInputPriorityID && currentNode.sprite.renderOrderID > this._highestRenderOrderID))
                {
                    if (currentNode.checkPointerOver(this))
                    {
                        // console.log('HRO set', currentNode.sprite.name);
                        this._highestRenderOrderID = currentNode.sprite.renderOrderID;
                        this._highestInputPriorityID = currentNode.priorityID;
                        this._highestRenderObject = currentNode;
                    }
                }
                currentNode = currentNode.next;
            }
            while (currentNode != null)
        }

        if (this._highestRenderObject == null)
        {
            // console.log("HRO null");

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
            if (this.targetObject == null)
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
                if (this.targetObject == this._highestRenderObject)
                {
                    //  Same target as before, so update it
                    // console.log("Same target as before, so update it");
                    if (this._highestRenderObject.update(this) == false)
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
    * @method leave
    * @param {Any} event
    */
    leave: function (event) {

        this.withinGame = false;
        this.move(event);

    },

	/**
    * Called when the Pointer leaves the touchscreen.
    * @method stop
    * @param {Any} event
    */
    stop: function (event) {

        if (this._stateReset)
        {
            event.preventDefault();
            return;
        }

        this.timeUp = this.game.time.now;

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
        {
            this.game.input.onUp.dispatch(this);

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

        if (this.isMouse == false)
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
            while (currentNode != null)
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
    * @method justPressed
    * @param {number} [duration]
    * @return {boolean}
    */
    justPressed: function (duration) {

        duration = duration || this.game.input.justPressedRate;

        return (this.isDown === true && (this.timeDown + duration) > this.game.time.now);

    },

	/**
    * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate.
    * @method justReleased
    * @param {number} [duration]
    * @return {boolean}
    */
    justReleased: function (duration) {

        duration = duration || this.game.input.justReleasedRate;

        return (this.isUp === true && (this.timeUp + duration) > this.game.time.now);

    },

	/**
    * Resets the Pointer properties. Called by InputManager.reset when you perform a State change.
    * @method reset
    */
    reset: function () {

        if (this.isMouse == false)
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

    },

	/**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} A string representation of the instance.
    **/
    toString: function () {
        return "[{Pointer (id=" + this.id + " identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
    }

};

/**
* How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
* @return {number}
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
 * Gets the X value of this Pointer in world coordinates based on the given camera.
 * @return {Description}
 */
Object.defineProperty(Phaser.Pointer.prototype, "worldX", {

    get: function () {

		return this.game.world.camera.x + this.x;

    }

});

/**
 * Gets the Y value of this Pointer in world coordinates based on the given camera.
 * @return {Description}
 */
Object.defineProperty(Phaser.Pointer.prototype, "worldY", {

    get: function () {

		return this.game.world.camera.y + this.y;

    }

});
