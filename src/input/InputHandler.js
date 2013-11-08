/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Constructor for Phaser InputHandler.
* @class Phaser.InputHandler
* @classdesc Description.
* @constructor
* @param {Phaser.Sprite} game - Description.
*/
Phaser.InputHandler = function (sprite) {

	/**
	* @property {Phaser.Sprite} sprite - Description. 
	*/
	this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = sprite.game;

	/**
	* @property {boolean} enabled - Description. 
	* @default
	*/
    this.enabled = false;

    //	Linked list references
	/**
	* @property {Description} parent - Description. 
	* @default
	*/
    this.parent = null;
    
	/**
	* @property {Description} next - Description. 
	* @default
	*/
    this.next = null;
    
	/**
	* @property {Description} prev - Description. 
	* @default
	*/
    this.prev = null;
    
	/**
	* @property {Description} last - Description. 
	* @default
	*/
	this.last = this;
	
	/**
	* @property {Description} first - Description. 
	* @default
	*/
	this.first = this;

	/**
	* @property {number} priorityID - The PriorityID controls which Sprite receives an Input event first if they should overlap.
	* @default
	*/
    this.priorityID = 0;
    
	/**
	* @property {boolean} useHandCursor - Description. 
	* @default
	*/
    this.useHandCursor = false;
	
	/**
	* @property {boolean} isDragged - Description. 
	* @default
	*/
    this.isDragged = false;
    
	/**
	* @property {boolean} allowHorizontalDrag - Description. 
	* @default
	*/
    this.allowHorizontalDrag = true;
    
	/**
	* @property {boolean} allowVerticalDrag - Description. 
	* @default
	*/
    this.allowVerticalDrag = true;
    
	/**
	* @property {boolean} bringToTop - Description. 
	* @default
	*/
    this.bringToTop = false;

	/**
	* @property {Description} snapOffset - Description. 
	* @default
	*/
    this.snapOffset = null;
    
	/**
	* @property {boolean} snapOnDrag - Description. 
	* @default
	*/
    this.snapOnDrag = false;
    
	/**
	* @property {boolean} snapOnRelease - Description. 
	* @default
	*/
    this.snapOnRelease = false;
    
	/**
	* @property {number} snapX - Description. 
	* @default
	*/
    this.snapX = 0;
    
	/**
	* @property {number} snapY - Description. 
	* @default
	*/
    this.snapY = 0;

	/**
	* @property {number} pixelPerfect - Should we use pixel perfect hit detection? Warning: expensive. Only enable if you really need it!
	* @default
	*/
    this.pixelPerfect = false;

    /**
    * @property {number} pixelPerfectAlpha - The alpha tolerance threshold. If the alpha value of the pixel matches or is above this value, it's considered a hit.
    * @default
    */
    this.pixelPerfectAlpha = 255;

    /**
    * @property {boolean} draggable - Is this sprite allowed to be dragged by the mouse? true = yes, false = no
    * @default 
    */
    this.draggable = false;

    /**
    * @property {Description} boundsRect - A region of the game world within which the sprite is restricted during drag.
    * @default 
    */
    this.boundsRect = null;

    /**
    * @property {Description} boundsSprite - A Sprite the bounds of which this sprite is restricted during drag.
    * @default
    */
    this.boundsSprite = null;

    /**
    * If this object is set to consume the pointer event then it will stop all propogation from this object on.
    * For example if you had a stack of 6 sprites with the same priority IDs and one consumed the event, none of the others would receive it.
    * @property {boolean} consumePointerEvent
    * @default
    */
    this.consumePointerEvent = false;

    /**
    * @property {Phaser.Point} _tempPoint - Description.
    * @private
    */
    this._tempPoint = new Phaser.Point;

    this._pointerData = [];

    this._pointerData.push({
        id: 0,
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

};

Phaser.InputHandler.prototype = {

	/**
	* Description.
	* @method Phaser.InputHandler#start
	* @param {number} priority - Description.
	* @param {boolean} useHandCursor - Description.
	* @return {Phaser.Sprite} Description.
	*/
	start: function (priority, useHandCursor) {

		priority = priority || 0;
		if (typeof useHandCursor == 'undefined') { useHandCursor = false; }

        //  Turning on
        if (this.enabled == false)
        {
            //  Register, etc
			this.game.input.interactiveItems.add(this);
            this.useHandCursor = useHandCursor;
            this.priorityID = priority;

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

	/**
	* Description.
	* @method Phaser.InputHandler#reset
	*/
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

	/**
	* Description.
	* @method Phaser.InputHandler#stop
	*/
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
	* @method Phaser.InputHandler#destroy
	*/
    destroy: function () {

        if (this.enabled)
        {
            this.enabled = false;

            this.game.input.interactiveItems.remove(this);

        	this.stop();

        	this.sprite = null;
        }
    },

	/**
    * The x coordinate of the Input pointer, relative to the top-left of the parent Sprite.
    * This value is only set when the pointer is over this Sprite.
    * @method Phaser.InputHandler#pointerX
    * @param {Pointer} pointer
    * @return {number} The x coordinate of the Input pointer.
    */    
    pointerX: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].x;

    },

	/**
    * The y coordinate of the Input pointer, relative to the top-left of the parent Sprite
    * This value is only set when the pointer is over this Sprite.
    * @method Phaser.InputHandler#pointerY
    * @param {Pointer} pointer
    * @return {number} The y coordinate of the Input pointer.
    */
    pointerY: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].y;

    },

	/**
    * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true.
    * @method Phaser.InputHandler#pointerDown
    * @param {Pointer} pointer
    * @return {boolean}
    */
    pointerDown: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isDown;

    },

	/**
    * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
    * @method Phaser.InputHandler#pointerUp
    * @param {Pointer} pointer
    * @return {boolean}
    */
    pointerUp: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isUp;

    },

	/**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @method Phaser.InputHandler#pointerTimeDown
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerTimeDown: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeDown;

    },

	/**
    * A timestamp representing when the Pointer left the touchscreen.
    * @method Phaser.InputHandler#pointerTimeUp
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerTimeUp: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeUp;

    },

	/**
    * Is the Pointer over this Sprite?
    * @method Phaser.InputHandler#pointerOver
    * @param {number} [index] - The ID number of a Pointer to check. If you don't provide a number it will check all Pointers.
    * @return {boolean} True if the given pointer (if a index was given, or any pointer if not) is over this object.
    */
    pointerOver: function (index) {

        if (this.enabled)
        {
            if (typeof index === 'undefined')
            {
                for (var i = 0; i < 10; i++)
                {
                    if (this._pointerData[i].isOver)
                    {
                        return true;
                    }
                }
            }
            else
            {
                return this._pointerData[index].isOver;
            }
        }

        return false;

    },

	/**
    * Is the Pointer outside of this Sprite?
    * @method Phaser.InputHandler#pointerOut
    * @param {number} [index] - The ID number of a Pointer to check. If you don't provide a number it will check all Pointers.
    * @return {boolean} True if the given pointer (if a index was given, or any pointer if not) is out of this object.
    */
    pointerOut: function (pointer) {

        if (this.enabled)
        {
            if (typeof index === 'undefined')
            {
                for (var i = 0; i < 10; i++)
                {
                    if (this._pointerData[i].isOut)
                    {
                        return true;
                    }
                }
            }
            else
            {
                return this._pointerData[index].isOut;
            }
        }

        return false;

    },

	/**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @method Phaser.InputHandler#pointerTimeOver
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerTimeOver: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeOver;

    },

	/**
    * A timestamp representing when the Pointer left the touchscreen.
    * @method Phaser.InputHandler#pointerTimeOut
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerTimeOut: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeOut;

    },

	/**
    * Is this sprite being dragged by the mouse or not?
    * @method Phaser.InputHandler#pointerTimeOut
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerDragged: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isDragged;

    },

	/**
    * Checks if the given pointer is over this Sprite.
    * @method Phaser.InputHandler#checkPointerOver
    * @param {Pointer} pointer
    * @return {boolean}
    */
    checkPointerOver: function (pointer) {

        if (this.enabled && this.sprite.visible)
        {
            this.sprite.getLocalUnmodifiedPosition(this._tempPoint, pointer.x, pointer.y);

            if (this._tempPoint.x >= 0 && this._tempPoint.x <= this.sprite.currentFrame.width && this._tempPoint.y >= 0 && this._tempPoint.y <= this.sprite.currentFrame.height)
            {
                if (this.pixelPerfect)
                {
                    return this.checkPixel(this._tempPoint.x, this._tempPoint.y);
                }
                else
                {
                    return true;
                }
            }
        }

        return false;

    },

	/**
    * Runs a pixel perfect check against the given x/y coordinates of the Sprite this InputHandler is bound to.
    * It compares the alpha value of the pixel and if >= InputHandler.pixelPerfectAlpha it returns true.
    * @method Phaser.InputHandler#checkPixel
    * @param {number} x - The x coordinate to check.
    * @param {number} y - The y coordinate to check.
    * @return {boolean} true if there is the alpha of the pixel is >= InputHandler.pixelPerfectAlpha
    */
    checkPixel: function (x, y) {

        //  Grab a pixel from our image into the hitCanvas and then test it
        if (this.sprite.texture.baseTexture.source)
        {
            this.game.input.hitContext.clearRect(0, 0, 1, 1);

            x += this.sprite.texture.frame.x;
            y += this.sprite.texture.frame.y;

            this.game.input.hitContext.drawImage(this.sprite.texture.baseTexture.source, x, y, 1, 1, 0, 0, 1, 1);
            
            var rgb = this.game.input.hitContext.getImageData(0, 0, 1, 1);

            if (rgb.data[3] >= this.pixelPerfectAlpha)
            {
                return true;
            }
        }

        return false;

    },

	/**
    * Update.
    * @method Phaser.InputHandler#update
    * @param {Pointer} pointer
    */
    update: function (pointer) {

        if (this.enabled == false || this.sprite.visible == false || (this.sprite.group && this.sprite.group.visible == false))
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

	/**
     * Description.
     * @method Phaser.InputHandler#_pointerOverHandler
     * @private
     * @param {Pointer} pointer
     */
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

	/**
     * Description.
     * @method Phaser.InputHandler#_pointerOutHandler
     * @private
     * @param {Pointer} pointer
     */
    _pointerOutHandler: function (pointer) {

        this._pointerData[pointer.id].isOver = false;
        this._pointerData[pointer.id].isOut = true;
        this._pointerData[pointer.id].timeOut = this.game.time.now;

        if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false)
        {
            this.game.stage.canvas.style.cursor = "default";
        }

        if (this.sprite && this.sprite.events)
        {
            this.sprite.events.onInputOut.dispatch(this.sprite, pointer);
        }

    },

	/**
     * Description.
     * @method Phaser.InputHandler#_touchedHandler
     * @private
     * @param {Pointer} pointer
     */
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

	/**
     * Description.
     * @method Phaser.InputHandler#_releasedHandler
     * @private
     * @param {Pointer} pointer
     */
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
    * @method Phaser.InputHandler#updateDrag
    * @param {Pointer} pointer
    * @return {boolean}
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
            this.sprite.x = Math.round(this.sprite.x / this.snapX) * this.snapX;
            this.sprite.y = Math.round(this.sprite.y / this.snapY) * this.snapY;
        }

        return true;

    },

	/**
    * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justOver
    * @param {Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just over.
    * @return {boolean}
    */
    justOver: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isOver && this.overDuration(pointer) < delay);

    },

	/**
    * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justOut
    * @param {Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just out.
    * @return {boolean}
    */
    justOut: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isOut && (this.game.time.now - this._pointerData[pointer].timeOut < delay));

    },

	/**
    * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justPressed
    * @param {Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just over.
    * @return {boolean}
    */
    justPressed: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isDown && this.downDuration(pointer) < delay);

    },

	/**
    * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justReleased
    * @param {Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just out.
    * @return {boolean}
    */
    justReleased: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isUp && (this.game.time.now - this._pointerData[pointer].timeUp < delay));

    },

	/**
    * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
    * @method Phaser.InputHandler#overDuration
    * @param {Pointer} pointer
    * @return {number} The number of milliseconds the pointer has been over the Sprite, or -1 if not over.
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
    * @method Phaser.InputHandler#downDuration
    * @param {Pointer} pointer
    * @return {number} The number of milliseconds the pointer has been pressed down on the Sprite, or -1 if not over.
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
    * @method Phaser.InputHandler#enableDrag
    * @param	lockCenter			If false the Sprite will drag from where you click it minus the dragOffset. If true it will center itself to the tip of the mouse pointer.
    * @param	bringToTop			If true the Sprite will be bought to the top of the rendering list in its current Group.
    * @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
    * @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
    * @param	boundsRect			If you want to restrict the drag of this sprite to a specific FlxRect, pass the FlxRect here, otherwise it's free to drag anywhere
    * @param	boundsSprite		If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here
    */
    enableDrag: function (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite) {

        if (typeof lockCenter == 'undefined') { lockCenter = false; }
        if (typeof bringToTop == 'undefined') { bringToTop = false; }
        if (typeof pixelPerfect == 'undefined') { pixelPerfect = false; }

        alphaThreshold = alphaThreshold || 255;
        boundsRect = boundsRect || null;
        boundsSprite = boundsSprite || null;

        this._dragPoint = new Phaser.Point();
        this.draggable = true;
        this.bringToTop = bringToTop;
        this.dragOffset = new Phaser.Point();
        this.dragFromCenter = lockCenter;

        this.pixelPerfect = pixelPerfect;
        this.pixelPerfectAlpha = alphaThreshold;

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
    * @method Phaser.InputHandler#disableDrag
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
    * @method Phaser.InputHandler#startDrag
    */
    startDrag: function (pointer) {

        this.isDragged = true;
        this._draggedPointerID = pointer.id;
        this._pointerData[pointer.id].isDragged = true;

        if (this.dragFromCenter)
        {
            this.sprite.centerOn(pointer.x, pointer.y);
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
    * @method Phaser.InputHandler#stopDrag
    */
    stopDrag: function (pointer) {

        this.isDragged = false;
        this._draggedPointerID = -1;
        this._pointerData[pointer.id].isDragged = false;
        
        if (this.snapOnRelease)
        {
            this.sprite.x = Math.round(this.sprite.x / this.snapX) * this.snapX;
            this.sprite.y = Math.round(this.sprite.y / this.snapY) * this.snapY;
        }

        this.sprite.events.onDragStop.dispatch(this.sprite, pointer);
        this.sprite.events.onInputUp.dispatch(this.sprite, pointer);

        if (this.checkPointerOver(pointer) == false)
        {
            this._pointerOutHandler(pointer);
        }

    },

	/**
    * Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
    * @method Phaser.InputHandler#setDragLock
    * @param	allowHorizontal		To enable the sprite to be dragged horizontally set to true, otherwise false
    * @param	allowVertical		To enable the sprite to be dragged vertically set to true, otherwise false
    */
    setDragLock: function (allowHorizontal, allowVertical) {

        if (typeof allowHorizontal == 'undefined') { allowHorizontal = true; }
    	if (typeof allowVertical == 'undefined') { allowVertical = true; }

        this.allowHorizontalDrag = allowHorizontal;
        this.allowVerticalDrag = allowVertical;

    },

	/**
    * Make this Sprite snap to the given grid either during drag or when it's released.
    * For example 16x16 as the snapX and snapY would make the sprite snap to every 16 pixels.
    * @method Phaser.InputHandler#enableSnap
    * @param	snapX		The width of the grid cell in pixels
    * @param	snapY		The height of the grid cell in pixels
    * @param	onDrag		If true the sprite will snap to the grid while being dragged
    * @param	onRelease	If true the sprite will snap to the grid when released
    */
    enableSnap: function (snapX, snapY, onDrag, onRelease) {

        if (typeof onDrag == 'undefined') { onDrag = true; }
        if (typeof onRelease == 'undefined') { onRelease = false; }

        this.snapX = snapX;
        this.snapY = snapY;
        this.snapOnDrag = onDrag;
        this.snapOnRelease = onRelease;

    },

	/**
    * Stops the sprite from snapping to a grid during drag or release.
    * @method Phaser.InputHandler#disableSnap
    */
    disableSnap: function () {

        this.snapOnDrag = false;
        this.snapOnRelease = false;

    },

	/**
    * Bounds Rect check for the sprite drag
    * @method Phaser.InputHandler#checkBoundsRect
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
    * Parent Sprite Bounds check for the sprite drag.
    * @method Phaser.InputHandler#checkBoundsSprite
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