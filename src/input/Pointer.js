/**
* Phaser - Pointer
*
* A Pointer object is used by the Mouse, Touch and MSPoint managers and represents a single finger on the touch screen.
*/
Phaser.Pointer = function (game, id) {

	this.game = game;
    this.id = id;

    this.active = false;

    this.position = new Phaser.Point();
    this.positionDown = new Phaser.Point();

    this.circle = new Phaser.Circle(0, 0, 44);

    if (id == 0)
    {
        this.isMouse = true;
    }

};

Phaser.Pointer.prototype = {

	/**
	* Local private variable to store the status of dispatching a hold event
	* @property _holdSent
	* @type {bool}
	* @private
	*/
	_holdSent: false,

	/**
	* Local private variable storing the short-term history of pointer movements
	* @property _history
	* @type {Array}
	* @private
	*/
	_history: [],

	/**
	* Local private variable storing the time at which the next history drop should occur
	* @property _lastDrop
	* @type {Number}
	* @private
	*/
	_nextDrop: 0,

	//  Monitor events outside of a state reset loop
	_stateReset: false,

	/**
	* A Vector object containing the initial position when the Pointer was engaged with the screen.
	* @property positionDown
	* @type {Vec2}
	**/
	positionDown: null,

	/**
	* A Vector object containing the current position of the Pointer on the screen.
	* @property position
	* @type {Vec2}
	**/
	position: null,

	/**
	* A Circle object centered on the x/y screen coordinates of the Pointer.
	* Default size of 44px (Apple's recommended "finger tip" size)
	* @property circle
	* @type {Circle}
	**/
	circle: null,

	/**
	*
	* @property withinGame
	* @type {bool}
	*/
	withinGame: false,

	/**
	* The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
	* @property clientX
	* @type {Number}
	*/
	clientX: -1,

	/**
	* The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
	* @property clientY
	* @type {Number}
	*/
	clientY: -1,

	/**
	* The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
	* @property pageX
	* @type {Number}
	*/
	pageX: -1,

	/**
	* The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
	* @property pageY
	* @type {Number}
	*/
	pageY: -1,

	/**
	* The horizontal coordinate of point relative to the screen in pixels
	* @property screenX
	* @type {Number}
	*/
	screenX: -1,

	/**
	* The vertical coordinate of point relative to the screen in pixels
	* @property screenY
	* @type {Number}
	*/
	screenY: -1,

	/**
	* The horizontal coordinate of point relative to the game element. This value is automatically scaled based on game size.
	* @property x
	* @type {Number}
	*/
	x: -1,

	/**
	* The vertical coordinate of point relative to the game element. This value is automatically scaled based on game size.
	* @property y
	* @type {Number}
	*/
	y: -1,

	/**
	* If the Pointer is a mouse this is true, otherwise false
	* @property isMouse
	* @type {bool}
	**/
	isMouse: false,

	/**
	* If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
	* @property isDown
	* @type {bool}
	**/
	isDown: false,

	/**
	* If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
	* @property isUp
	* @type {bool}
	**/
	isUp: true,

	/**
	* A timestamp representing when the Pointer first touched the touchscreen.
	* @property timeDown
	* @type {Number}
	**/
	timeDown: 0,

	/**
	* A timestamp representing when the Pointer left the touchscreen.
	* @property timeUp
	* @type {Number}
	**/
	timeUp: 0,

	/**
	* A timestamp representing when the Pointer was last tapped or clicked
	* @property previousTapTime
	* @type {Number}
	**/
	previousTapTime: 0,

	/**
	* The total number of times this Pointer has been touched to the touchscreen
	* @property totalTouches
	* @type {Number}
	**/
	totalTouches: 0,

	/**
	* The number of miliseconds since the last click
	* @property msSinceLastClick
	* @type {Number}
	**/
	msSinceLastClick: Number.MAX_VALUE,

	/**
	* The Game Object this Pointer is currently over / touching / dragging.
	* @property targetObject
	* @type {Any}
	**/
	targetObject: null,

	/**
    * Called when the Pointer is pressed onto the touchscreen
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
        // if (this.game.paused == true && this.game.stage.scale.incorrectOrientation == false)
        // {
        //     this.game.stage.resumeGame();
        //     return this;
        // }

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
            //this.game.input.x = this.x * this.game.input.scale.x;
            //this.game.input.y = this.y * this.game.input.scale.y;
            this.game.input.x = this.x;
            this.game.input.y = this.y;
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
            this.targetObject.input._touchedHandler(this);
        }

        return this;

    },

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
        if (this.targetObject !== null && this.targetObject.input && this.targetObject.input.isDragged == true)
        {
            if (this.targetObject.input.update(this) == false)
            {
                this.targetObject = null;
            }

            return this;

        }

        //  Work out which object is on the top
        this._highestRenderOrderID = -1;
        this._highestRenderObject = -1;
        this._highestInputPriorityID = -1;

        //  Just run through the linked list
        if (this.game.input.interactiveItems.next)
        {
            var currentNode = this.game.input.interactiveItems.next;
            
            do  
            {
                if (currentNode['update'])
                {
                    currentNode.update();
                }
                
                currentNode = currentNode.next;
            }
            while (currentNode != this.game.input.interactiveItems.next)
        }


        for (var i = 0; i < this.game.input.totalTrackedObjects; i++)
        {
            if (this.game.input.inputObjects[i] && this.game.input.inputObjects[i].input && this.game.input.inputObjects[i].input.checkPointerOver(this))
            {
                //  If the object has a higher InputManager.PriorityID OR if the priority ID is the same as the current highest AND it has a higher renderOrderID, then set it to the top
                if (this.game.input.inputObjects[i].input.priorityID > this._highestInputPriorityID || (this.game.input.inputObjects[i].input.priorityID == this._highestInputPriorityID && this.game.input.inputObjects[i].renderOrderID > this._highestRenderOrderID))
                {
                    this._highestRenderOrderID = this.game.input.inputObjects[i].renderOrderID;
                    this._highestRenderObject = i;
                    this._highestInputPriorityID = this.game.input.inputObjects[i].input.priorityID;
                }
            }
        }

        if (this._highestRenderObject == -1)
        {
            //  The pointer isn't over anything, check if we've got a lingering previous target
            if (this.targetObject !== null)
            {
                this.targetObject.input._pointerOutHandler(this);
                this.targetObject = null;
            }
        }
        else
        {
            if (this.targetObject == null)
            {
                //  And now set the new one
                this.targetObject = this.game.input.inputObjects[this._highestRenderObject];
                this.targetObject.input._pointerOverHandler(this);
            }
            else
            {
                //  We've got a target from the last update
                if (this.targetObject == this.game.input.inputObjects[this._highestRenderObject])
                {
                    //  Same target as before, so update it
                    if (this.targetObject.input.update(this) == false)
                    {
                        this.targetObject = null;
                    }
                }
                else
                {
                    //  The target has changed, so tell the old one we've left it
                    this.targetObject.input._pointerOutHandler(this);

                    //  And now set the new one
                    this.targetObject = this.game.input.inputObjects[this._highestRenderObject];
                    this.targetObject.input._pointerOverHandler(this);
                }
            }
        }

        return this;

    },

	/**
    * Called when the Pointer leaves the target area
    * @method leave
    * @param {Any} event
    */
    leave: function (event) {

        this.withinGame = false;
        this.move(event);

    },

	/**
    * Called when the Pointer leaves the touchscreen
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

        for (var i = 0; i < this.game.input.totalTrackedObjects; i++)
        {
            if (this.game.input.inputObjects[i] && this.game.input.inputObjects[i].input && this.game.input.inputObjects[i].input.enabled)
            {
                this.game.input.inputObjects[i].input._releasedHandler(this);
            }
        }

        if (this.targetObject)
        {
            this.targetObject.input._releasedHandler(this);
        }

        this.targetObject = null;
        return this;

    },

	/**
    * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate
    * @method justPressed
    * @param {Number} [duration].
    * @return {bool}
    */
    justPressed: function (duration) {

        if (typeof duration === "undefined") { duration = this.game.input.justPressedRate; }

        return (this.isDown === true && (this.timeDown + duration) > this.game.time.now);

    },

	/**
    * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate
    * @method justReleased
    * @param {Number} [duration].
    * @return {bool}
    */
    justReleased: function (duration) {

        if (typeof duration === "undefined") { duration = this.game.input.justReleasedRate; }

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

        if (this.targetObject && this.targetObject.input)
        {
            this.targetObject.input._releasedHandler(this);
        }

        this.targetObject = null;

    },

	/**
    * Returns a string representation of this object.
    * @method toString
    * @return {String} a string representation of the instance.
    **/
    toString: function () {
        return "[{Pointer (id=" + this.id + " identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
    }

};

Object.defineProperty(Phaser.Pointer.prototype, "duration", {

	/**
    * How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
    * @property duration
    * @type {Number}
    **/
    get: function () {

        if (this.isUp)
        {
            return -1;
        }

        return this.game.time.now - this.timeDown;

    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Pointer.prototype, "worldX", {

	/**
    * Gets the X value of this Pointer in world coordinates based on the given camera.
    * @param {Camera} [camera]
    */
    get: function () {

		return this.game.world.camera.worldView.x + this.x;

    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Pointer.prototype, "worldY", {

	/**
    * Gets the Y value of this Pointer in world coordinates based on the given camera.
    * @param {Camera} [camera]
    */
    get: function () {

		return this.game.world.camera.worldView.y + this.y;

    },

    enumerable: true,
    configurable: true
});
