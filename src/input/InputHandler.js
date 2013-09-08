Phaser.InputHandler = function (sprite) {

    this.game = sprite.game;
	this.sprite = sprite;

    this.enabled = false;

    //	Linked list references
	this.last = this;
	this.first = this;

    /**
    * The PriorityID controls which Sprite receives an Input event first if they should overlap.
    */
    this.priorityID = 0;
	
    this.isDragged = false;
    this.dragPixelPerfect = false;
    this.allowHorizontalDrag = true;
    this.allowVerticalDrag = true;
    this.bringToTop = false;
    this.snapOnDrag = false;
    this.snapOnRelease = false;
    this.snapX = 0;
    this.snapY = 0;

    /**
    * Is this sprite allowed to be dragged by the mouse? true = yes, false = no
    * @default false
    */
    this.draggable = false;

    /**
    * A region of the game world within which the sprite is restricted during drag
    * @default null
    */
    this.boundsRect = null;

    /**
    * An Sprite the bounds of which this sprite is restricted during drag
    * @default null
    */
    this.boundsSprite = null;

    /**
    * If this object is set to consume the pointer event then it will stop all propogation from this object on.
    * For example if you had a stack of 6 sprites with the same priority IDs and one consumed the event, none of the others would receive it.
    * @type {bool}
    */
    this.consumePointerEvent = false;

    this._tempPoint = new Phaser.Point;

};

Phaser.InputHandler.prototype = {

	game: null,
	sprite: null,

	//	Linked list references
	parent: null,
	next: null,
	prev: null,
	first: null,
	last: null,

	start: function (priority, checkBody, useHandCursor) {

		priority = priority || 0;
		checkBody = checkBody || false;
		useHandCursor = useHandCursor || false;

        //  Turning on
        if (this.enabled == false)
        {
            //  Register, etc
			this.game.input.interactiveItems.add(this);
            this.checkBody = checkBody;
            this.useHandCursor = useHandCursor;
            this.priorityID = priority;
            this._pointerData = [];

            for (var i = 0; i < 10; i++)
            {
                this._pointerData.push({
                    id: i,
                    x: 0,
                    y: 0,
                    isDown: false,
                    isUp: false,
                    isOver: false,
                    isOut: false,
                    timeOver: 0,
                    timeOut: 0,
                    timeDown: 0,
                    timeUp: 0,
                    downDuration: 0,
                    isDragged: false
                });
            }

            this.snapOffset = new Phaser.Point;
            this.enabled = true;

            //  Create the signals the Input component will emit
            if (this.sprite.events && this.sprite.events.onInputOver == null)
            {
                this.sprite.events.onInputOver = new Phaser.Signal;
                this.sprite.events.onInputOut = new Phaser.Signal;
                this.sprite.events.onInputDown = new Phaser.Signal;
                this.sprite.events.onInputUp = new Phaser.Signal;
                this.sprite.events.onDragStart = new Phaser.Signal;
                this.sprite.events.onDragStop = new Phaser.Signal;
            }
        }

        return this.sprite;

	},

    reset: function () {

        this.enabled = false;

        for (var i = 0; i < 10; i++)
        {
            this._pointerData[i] = {
                id: i,
                x: 0,
                y: 0,
                isDown: false,
                isUp: false,
                isOver: false,
                isOut: false,
                timeOver: 0,
                timeOut: 0,
                timeDown: 0,
                timeUp: 0,
                downDuration: 0,
                isDragged: false
            };
        }
    },

	stop: function () {

        //  Turning off
        if (this.enabled == false)
        {
            return;
        }
        else
        {
            //  De-register, etc
            this.enabled = false;
			this.game.input.interactiveItems.remove(this);
        }

	},

	/**
    * Clean up memory.
    */
    destroy: function () {

        if (this.enabled)
        {
        	this.stop();
        	//	Null everything
        	this.sprite = null;
        	//	etc
        }
    },

	/**
    * The x coordinate of the Input pointer, relative to the top-left of the parent Sprite.
    * This value is only set when the pointer is over this Sprite.
    * @type {number}
    */    
    pointerX: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].x;

    },

	/**
    * The y coordinate of the Input pointer, relative to the top-left of the parent Sprite
    * This value is only set when the pointer is over this Sprite.
    * @type {number}
    */
    pointerY: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].y;

    },

	/**
    * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
    * @property isDown
    * @type {bool}
    **/
    pointerDown: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isDown;

    },

	/**
    * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
    * @property isUp
    * @type {bool}
    **/
    pointerUp: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isUp;

    },

	/**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @property timeDown
    * @type {Number}
    **/
    pointerTimeDown: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeDown;

    },

	/**
    * A timestamp representing when the Pointer left the touchscreen.
    * @property timeUp
    * @type {Number}
    **/
    pointerTimeUp: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeUp;

    },

	/**
    * Is the Pointer over this Sprite
    * @property isOver
    * @type {bool}
    **/
    pointerOver: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isOver;

    },

	/**
    * Is the Pointer outside of this Sprite
    * @property isOut
    * @type {bool}
    **/
    pointerOut: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isOut;

    },

	/**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @property timeDown
    * @type {Number}
    **/
    pointerTimeOver: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeOver;

    },

	/**
    * A timestamp representing when the Pointer left the touchscreen.
    * @property timeUp
    * @type {Number}
    **/
    pointerTimeOut: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeOut;

    },

	/**
    * Is this sprite being dragged by the mouse or not?
    * @default false
    */
    pointerDragged: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isDragged;

    },

	/**
    * Checks if the given pointer is over this Sprite.
    */
    checkPointerOver: function (pointer) {

        if (this.enabled && this.sprite.visible)
        {
            this.sprite.getLocalUnmodifiedPosition(this._tempPoint, pointer.x, pointer.y);

            //  Check against bounds
            var width = this.sprite.texture.frame.width,
                height = this.sprite.texture.frame.height,
                x1 = -width * this.sprite.anchor.x,
                y1;
            
            if (this._tempPoint.x > x1 && this._tempPoint.x < x1 + width)
            {
                y1 = -height * this.sprite.anchor.y;
            
                if (this._tempPoint.y > y1 && this._tempPoint.y < y1 + height)
                {
                    return true;
                }
            }
        }
        else
        {
            return false;
        }

    },

	/**
    * Update
    */
    update: function (pointer) {

        if (this.enabled == false || this.sprite.visible == false)
        {
            this._pointerOutHandler(pointer);
            return false;
        }

        if (this.draggable && this._draggedPointerID == pointer.id)
        {
            return this.updateDrag(pointer);
        }
        else if (this._pointerData[pointer.id].isOver == true)
        {
            if (this.checkPointerOver(pointer))
            {
                this._pointerData[pointer.id].x = pointer.x - this.sprite.x;
                this._pointerData[pointer.id].y = pointer.y - this.sprite.y;
                return true;
            }
            else
            {
                this._pointerOutHandler(pointer);
                return false;
            }
        }
    },

    _pointerOverHandler: function (pointer) {

        if (this._pointerData[pointer.id].isOver == false)
        {
            this._pointerData[pointer.id].isOver = true;
            this._pointerData[pointer.id].isOut = false;
            this._pointerData[pointer.id].timeOver = this.game.time.now;
            this._pointerData[pointer.id].x = pointer.x - this.sprite.x;
            this._pointerData[pointer.id].y = pointer.y - this.sprite.y;

            if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false)
            {
                this.game.stage.canvas.style.cursor = "pointer";
            }

            this.sprite.events.onInputOver.dispatch(this.sprite, pointer);
        }
    },

    _pointerOutHandler: function (pointer) {

        this._pointerData[pointer.id].isOver = false;
        this._pointerData[pointer.id].isOut = true;
        this._pointerData[pointer.id].timeOut = this.game.time.now;

        if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false)
        {
            this.game.stage.canvas.style.cursor = "default";
        }

        this.sprite.events.onInputOut.dispatch(this.sprite, pointer);

    },

    _touchedHandler: function (pointer) {

        if (this._pointerData[pointer.id].isDown == false && this._pointerData[pointer.id].isOver == true)
        {
            this._pointerData[pointer.id].isDown = true;
            this._pointerData[pointer.id].isUp = false;
            this._pointerData[pointer.id].timeDown = this.game.time.now;
            this.sprite.events.onInputDown.dispatch(this.sprite, pointer);

            //  Start drag
            if (this.draggable && this.isDragged == false)
            {
                this.startDrag(pointer);
            }

            if (this.bringToTop)
            {
                this.sprite.bringToTop();
			}
        }

        //  Consume the event?
        return this.consumePointerEvent;

    },

    _releasedHandler: function (pointer) {

        //  If was previously touched by this Pointer, check if still is AND still over this item
        if (this._pointerData[pointer.id].isDown && pointer.isUp)
        {
            this._pointerData[pointer.id].isDown = false;
            this._pointerData[pointer.id].isUp = true;
            this._pointerData[pointer.id].timeUp = this.game.time.now;
            this._pointerData[pointer.id].downDuration = this._pointerData[pointer.id].timeUp - this._pointerData[pointer.id].timeDown;

            //  Only release the InputUp signal if the pointer is still over this sprite
            if (this.checkPointerOver(pointer))
            {
                //console.log('releasedHandler: ' + Date.now());
                this.sprite.events.onInputUp.dispatch(this.sprite, pointer);
            }
            else
            {
                //  Pointer outside the sprite? Reset the cursor
                if (this.useHandCursor)
                {
                    this.game.stage.canvas.style.cursor = "default";
                }
            }

            //  Stop drag
            if (this.draggable && this.isDragged && this._draggedPointerID == pointer.id)
            {
                this.stopDrag(pointer);
            }
        }

    },

	/**
    * Updates the Pointer drag on this Sprite.
    */
    updateDrag: function (pointer) {

        if (pointer.isUp)
        {
            this.stopDrag(pointer);
            return false;
        }

        if (this.allowHorizontalDrag)
        {
            this.sprite.x = pointer.x + this._dragPoint.x + this.dragOffset.x;
        }

        if (this.allowVerticalDrag)
        {
            this.sprite.y = pointer.y + this._dragPoint.y + this.dragOffset.y;
        }

        if (this.boundsRect)
        {
            this.checkBoundsRect();
        }

        if (this.boundsSprite)
        {
            this.checkBoundsSprite();
        }

        if (this.snapOnDrag)
        {
            this.sprite.x = Math.floor(this.sprite.x / this.snapX) * this.snapX;
            this.sprite.y = Math.floor(this.sprite.y / this.snapY) * this.snapY;
        }

        return true;

    },

	/**
    * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @param delay The time below which the pointer is considered as just over.
    * @returns {bool}
    */
    justOver: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isOver && this.overDuration(pointer) < delay);

    },

	/**
    * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @param delay The time below which the pointer is considered as just out.
    * @returns {bool}
    */
    justOut: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isOut && (this.game.time.now - this._pointerData[pointer].timeOut < delay));

    },

	/**
    * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @param delay The time below which the pointer is considered as just over.
    * @returns {bool}
    */
    justPressed: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isDown && this.downDuration(pointer) < delay);

    },

	/**
    * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @param delay The time below which the pointer is considered as just out.
    * @returns {bool}
    */
    justReleased: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isUp && (this.game.time.now - this._pointerData[pointer].timeUp < delay));

    },

	/**
    * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
    * @returns {number} The number of milliseconds the pointer has been over the Sprite, or -1 if not over.
    */
    overDuration: function (pointer) {

    	pointer = pointer || 0;

        if (this._pointerData[pointer].isOver)
        {
            return this.game.time.now - this._pointerData[pointer].timeOver;
        }

        return -1;

    },

	/**
    * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
    * @returns {number} The number of milliseconds the pointer has been pressed down on the Sprite, or -1 if not over.
    */
    downDuration: function (pointer) {

    	pointer = pointer || 0;

        if (this._pointerData[pointer].isDown)
        {
            return this.game.time.now - this._pointerData[pointer].timeDown;
        }

        return -1;

    },

	/**
    * Make this Sprite draggable by the mouse. You can also optionally set mouseStartDragCallback and mouseStopDragCallback
    *
    * @param	lockCenter			If false the Sprite will drag from where you click it minus the dragOffset. If true it will center itself to the tip of the mouse pointer.
    * @param	bringToTop			If true the Sprite will be bought to the top of the rendering list in its current Group.
    * @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
    * @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
    * @param	boundsRect			If you want to restrict the drag of this sprite to a specific FlxRect, pass the FlxRect here, otherwise it's free to drag anywhere
    * @param	boundsSprite		If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here
    */
    enableDrag: function (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite) {

        lockCenter = lockCenter || false;
        bringToTop = bringToTop || false;
        pixelPerfect = pixelPerfect || false;
        alphaThreshold = alphaThreshold || 255;
        boundsRect = boundsRect || null;
        boundsSprite = boundsSprite || null;

        this._dragPoint = new Phaser.Point();
        this.draggable = true;
        this.bringToTop = bringToTop;
        this.dragOffset = new Phaser.Point();
        this.dragFromCenter = lockCenter;
        this.dragPixelPerfect = pixelPerfect;
        this.dragPixelPerfectAlpha = alphaThreshold;
        
        if (boundsRect)
        {
            this.boundsRect = boundsRect;
        }

        if (boundsSprite)
        {
            this.boundsSprite = boundsSprite;
        }

    },

	/**
    * Stops this sprite from being able to be dragged. If it is currently the target of an active drag it will be stopped immediately. Also disables any set callbacks.
    */
    disableDrag: function () {

        if (this._pointerData)
        {
            for (var i = 0; i < 10; i++)
            {
                this._pointerData[i].isDragged = false;
            }
        }

        this.draggable = false;
        this.isDragged = false;
        this._draggedPointerID = -1;

    },

	/**
    * Called by Pointer when drag starts on this Sprite. Should not usually be called directly.
    */
    startDrag: function (pointer) {

        this.isDragged = true;
        this._draggedPointerID = pointer.id;
        this._pointerData[pointer.id].isDragged = true;

        if (this.dragFromCenter)
        {
            this.sprite.transform.centerOn(pointer.worldX, pointer.worldY);
            this._dragPoint.setTo(this.sprite.x - pointer.x, this.sprite.y - pointer.y);
        }
        else
        {
            this._dragPoint.setTo(this.sprite.x - pointer.x, this.sprite.y - pointer.y);
        }

        this.updateDrag(pointer);
        
        if (this.bringToTop)
        {
            this.sprite.bringToTop();
        }

        this.sprite.events.onDragStart.dispatch(this.sprite, pointer);

    },

	/**
    * Called by Pointer when drag is stopped on this Sprite. Should not usually be called directly.
    */
    stopDrag: function (pointer) {

        this.isDragged = false;
        this._draggedPointerID = -1;
        this._pointerData[pointer.id].isDragged = false;
        
        if (this.snapOnRelease)
        {
            this.sprite.x = Math.floor(this.sprite.x / this.snapX) * this.snapX;
            this.sprite.y = Math.floor(this.sprite.y / this.snapY) * this.snapY;
        }

        this.sprite.events.onDragStop.dispatch(this.sprite, pointer);
        this.sprite.events.onInputUp.dispatch(this.sprite, pointer);

    },

	/**
    * Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
    *
    * @param	allowHorizontal		To enable the sprite to be dragged horizontally set to true, otherwise false
    * @param	allowVertical		To enable the sprite to be dragged vertically set to true, otherwise false
    */
    setDragLock: function (allowHorizontal, allowVertical) {

    	allowHorizontal = allowHorizontal || true;
    	allowVertical = allowVertical || true;

        this.allowHorizontalDrag = allowHorizontal;
        this.allowVerticalDrag = allowVertical;

    },

	/**
    * Make this Sprite snap to the given grid either during drag or when it's released.
    * For example 16x16 as the snapX and snapY would make the sprite snap to every 16 pixels.
    *
    * @param	snapX		The width of the grid cell in pixels
    * @param	snapY		The height of the grid cell in pixels
    * @param	onDrag		If true the sprite will snap to the grid while being dragged
    * @param	onRelease	If true the sprite will snap to the grid when released
    */
    enableSnap: function (snapX, snapY, onDrag, onRelease) {

    	onDrag = onDrag || true;
    	onRelease = onRelease || false;

        this.snapOnDrag = onDrag;
        this.snapOnRelease = onRelease;
        this.snapX = snapX;
        this.snapY = snapY;

    },

	/**
    * Stops the sprite from snapping to a grid during drag or release.
    */
    disableSnap: function () {

        this.snapOnDrag = false;
        this.snapOnRelease = false;

    },

	/**
    * Bounds Rect check for the sprite drag
    */
    checkBoundsRect: function () {

        if (this.sprite.x < this.boundsRect.left)
        {
            this.sprite.x = this.boundsRect.x;
        }
        else if ((this.sprite.x + this.sprite.width) > this.boundsRect.right)
        {
            this.sprite.x = this.boundsRect.right - this.sprite.width;
        }

        if (this.sprite.y < this.boundsRect.top)
        {
            this.sprite.y = this.boundsRect.top;
        }
        else if ((this.sprite.y + this.sprite.height) > this.boundsRect.bottom)
        {
            this.sprite.y = this.boundsRect.bottom - this.sprite.height;
        }

    },

	/**
    * Parent Sprite Bounds check for the sprite drag
    */
    checkBoundsSprite: function () {

        if (this.sprite.x < this.boundsSprite.x)
        {
            this.sprite.x = this.boundsSprite.x;
        }
        else if ((this.sprite.x + this.sprite.width) > (this.boundsSprite.x + this.boundsSprite.width))
        {
            this.sprite.x = (this.boundsSprite.x + this.boundsSprite.width) - this.sprite.width;
        }

        if (this.sprite.y < this.boundsSprite.y)
        {
            this.sprite.y = this.boundsSprite.y;
        }
        else if ((this.sprite.y + this.sprite.height) > (this.boundsSprite.y + this.boundsSprite.height))
        {
            this.sprite.y = (this.boundsSprite.y + this.boundsSprite.height) - this.sprite.height;
        }

    }

};