/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Input Handler is bound to a specific Sprite and is responsible for managing all Input events on that Sprite.
* @class Phaser.InputHandler
* @constructor
* @param {Phaser.Sprite} sprite - The Sprite object to which this Input Handler belongs.
*/
Phaser.InputHandler = function (sprite) {

    /**
    * @property {Phaser.Sprite} sprite - The Sprite object to which this Input Handler belongs.
    */
    this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = sprite.game;

    /**
    * @property {boolean} enabled - If enabled the Input Handler will process input requests and monitor pointer activity.
    * @default
    */
    this.enabled = false;

    /**
    * The priorityID is used to determine which game objects should get priority when input events occur. For example if you have
    * several Sprites that overlap, by default the one at the top of the display list is given priority for input events. You can
    * stop this from happening by controlling the priorityID value. The higher the value, the more important they are considered to the Input events.
    * @property {number} priorityID
    * @default
    */
    this.priorityID = 0;

    /**
    * @property {boolean} useHandCursor - On a desktop browser you can set the 'hand' cursor to appear when moving over the Sprite.
    * @default
    */
    this.useHandCursor = false;

    /**
    * @property {boolean} _setHandCursor - Did this Sprite trigger the hand cursor?
    * @private
    */
    this._setHandCursor = false;

    /**
    * @property {boolean} isDragged - true if the Sprite is being currently dragged.
    * @default
    */
    this.isDragged = false;

    /**
    * @property {boolean} allowHorizontalDrag - Controls if the Sprite is allowed to be dragged horizontally.
    * @default
    */
    this.allowHorizontalDrag = true;

    /**
    * @property {boolean} allowVerticalDrag - Controls if the Sprite is allowed to be dragged vertically.
    * @default
    */
    this.allowVerticalDrag = true;

    /**
    * @property {boolean} bringToTop - If true when this Sprite is clicked or dragged it will automatically be bought to the top of the Group it is within.
    * @default
    */
    this.bringToTop = false;

    /**
    * @property {Phaser.Point} snapOffset - A Point object that contains by how far the Sprite snap is offset.
    * @default
    */
    this.snapOffset = null;

    /**
    * @property {boolean} snapOnDrag - When the Sprite is dragged this controls if the center of the Sprite will snap to the pointer on drag or not.
    * @default
    */
    this.snapOnDrag = false;

    /**
    * @property {boolean} snapOnRelease - When the Sprite is dragged this controls if the Sprite will be snapped on release.
    * @default
    */
    this.snapOnRelease = false;

    /**
    * @property {number} snapX - When a Sprite has snapping enabled this holds the width of the snap grid.
    * @default
    */
    this.snapX = 0;

    /**
    * @property {number} snapY - When a Sprite has snapping enabled this holds the height of the snap grid.
    * @default
    */
    this.snapY = 0;

    /**
    * @property {number} snapOffsetX - This defines the top-left X coordinate of the snap grid.
    * @default
    */
    this.snapOffsetX = 0;

    /**
    * @property {number} snapOffsetY - This defines the top-left Y coordinate of the snap grid..
    * @default
    */
    this.snapOffsetY = 0;

    /**
    * Set to true to use pixel perfect hit detection when checking if the pointer is over this Sprite.
    * The x/y coordinates of the pointer are tested against the image in combination with the InputHandler.pixelPerfectAlpha value.
    * Warning: This is expensive, especially on mobile (where it's not even needed!) so only enable if required. Also see the less-expensive InputHandler.pixelPerfectClick.
    * @property {number} pixelPerfectOver - Use a pixel perfect check when testing for pointer over.
    * @default
    */
    this.pixelPerfectOver = false;

    /**
    * Set to true to use pixel perfect hit detection when checking if the pointer is over this Sprite when it's clicked or touched.
    * The x/y coordinates of the pointer are tested against the image in combination with the InputHandler.pixelPerfectAlpha value.
    * Warning: This is expensive so only enable if you really need it.
    * @property {number} pixelPerfectClick - Use a pixel perfect check when testing for clicks or touches on the Sprite.
    * @default
    */
    this.pixelPerfectClick = false;

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
    * @property {Phaser.Rectangle} boundsRect - A region of the game world within which the sprite is restricted during drag.
    * @default
    */
    this.boundsRect = null;

    /**
    * @property {Phaser.Sprite} boundsSprite - A Sprite the bounds of which this sprite is restricted during drag.
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
    * @property {boolean} _dragPhase - Internal cache var.
    * @private
    */
    this._dragPhase = false;

    /**
    * @property {boolean} _wasEnabled - Internal cache var.
    * @private
    */
    this._wasEnabled = false;

    /**
    * @property {Phaser.Point} _tempPoint - Internal cache var.
    * @private
    */
    this._tempPoint = new Phaser.Point();

    /**
    * @property {array} _pointerData - Internal cache var.
    * @private
    */
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
    * Starts the Input Handler running. This is called automatically when you enable input on a Sprite, or can be called directly if you need to set a specific priority.
    * @method Phaser.InputHandler#start
    * @param {number} priority - Higher priority sprites take click priority over low-priority sprites when they are stacked on-top of each other.
    * @param {boolean} useHandCursor - If true the Sprite will show the hand cursor on mouse-over (doesn't apply to mobile browsers)
    * @return {Phaser.Sprite} The Sprite object to which the Input Handler is bound.
    */
    start: function (priority, useHandCursor) {

        priority = priority || 0;
        if (typeof useHandCursor === 'undefined') { useHandCursor = false; }

        //  Turning on
        if (this.enabled === false)
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

            this.snapOffset = new Phaser.Point();
            this.enabled = true;
            this._wasEnabled = true;

            //  Create the signals the Input component will emit
            if (this.sprite.events && this.sprite.events.onInputOver === null)
            {
                this.sprite.events.onInputOver = new Phaser.Signal();
                this.sprite.events.onInputOut = new Phaser.Signal();
                this.sprite.events.onInputDown = new Phaser.Signal();
                this.sprite.events.onInputUp = new Phaser.Signal();
                this.sprite.events.onDragStart = new Phaser.Signal();
                this.sprite.events.onDragStop = new Phaser.Signal();
            }
        }

        this.sprite.events.onAddedToGroup.add(this.addedToGroup, this);
        this.sprite.events.onRemovedFromGroup.add(this.removedFromGroup, this);

        return this.sprite;

    },

    /**
    * Handles when the parent Sprite is added to a new Group.
    *
    * @method Phaser.InputHandler#addedToGroup
    * @private
    */
    addedToGroup: function () {

        if (this._dragPhase)
        {
            return;
        }

        if (this._wasEnabled && !this.enabled)
        {
            this.start();
        }

    },

    /**
    * Handles when the parent Sprite is removed from a Group.
    *
    * @method Phaser.InputHandler#removedFromGroup
    * @private
    */
    removedFromGroup: function () {

        if (this._dragPhase)
        {
            return;
        }

        if (this.enabled)
        {
            this._wasEnabled = true;
            this.stop();
        }
        else
        {
            this._wasEnabled = false;
        }

    },

    /**
    * Resets the Input Handler and disables it.
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
    * Stops the Input Handler from running.
    * @method Phaser.InputHandler#stop
    */
    stop: function () {

        //  Turning off
        if (this.enabled === false)
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

        if (this.sprite)
        {
            if (this._setHandCursor)
            {
                this.game.canvas.style.cursor = "default";
                this._setHandCursor = false;
            }

            this.enabled = false;

            this.game.input.interactiveItems.remove(this);

            this._pointerData.length = 0;
            this.boundsRect = null;
            this.boundsSprite = null;
            this.sprite = null;
        }

    },

    /**
    * Checks if the object this InputHandler is bound to is valid for consideration in the Pointer move event.
    * This is called by Phaser.Pointer and shouldn't typically be called directly.
    *
    * @method Phaser.InputHandler#validForInput
    * @protected
    * @param {number} highestID - The highest ID currently processed by the Pointer.
    * @param {number} highestRenderID - The highest Render Order ID currently processed by the Pointer.
    * @return {boolean} True if the object this InputHandler is bound to should be considered as valid for input detection.
    */
    validForInput: function (highestID, highestRenderID) {

        if (this.sprite.scale.x === 0 || this.sprite.scale.y === 0 || this.priorityID < this.game.input.minPriorityID)
        {
            return false;
        }

        if (this.pixelPerfectClick || this.pixelPerfectOver)
        {
            return true;
        }

        if (this.priorityID > highestID || (this.priorityID === highestID && this.sprite._cache[3] < highestRenderID))
        {
            return true;
        }

        return false;

    },

    /**
    * The x coordinate of the Input pointer, relative to the top-left of the parent Sprite.
    * This value is only set when the pointer is over this Sprite.
    * @method Phaser.InputHandler#pointerX
    * @param {Phaser.Pointer} pointer
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
    * @param {Phaser.Pointer} pointer
    * @return {number} The y coordinate of the Input pointer.
    */
    pointerY: function (pointer) {

        pointer = pointer || 0;

        return this._pointerData[pointer].y;

    },

    /**
    * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true.
    * @method Phaser.InputHandler#pointerDown
    * @param {Phaser.Pointer} pointer
    * @return {boolean}
    */
    pointerDown: function (pointer) {

        pointer = pointer || 0;

        return this._pointerData[pointer].isDown;

    },

    /**
    * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
    * @method Phaser.InputHandler#pointerUp
    * @param {Phaser.Pointer} pointer
    * @return {boolean}
    */
    pointerUp: function (pointer) {

        pointer = pointer || 0;

        return this._pointerData[pointer].isUp;

    },

    /**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @method Phaser.InputHandler#pointerTimeDown
    * @param {Phaser.Pointer} pointer
    * @return {number}
    */
    pointerTimeDown: function (pointer) {

        pointer = pointer || 0;

        return this._pointerData[pointer].timeDown;

    },

    /**
    * A timestamp representing when the Pointer left the touchscreen.
    * @method Phaser.InputHandler#pointerTimeUp
    * @param {Phaser.Pointer} pointer
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
    pointerOut: function (index) {

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
    * @param {Phaser.Pointer} pointer
    * @return {number}
    */
    pointerTimeOver: function (pointer) {

        pointer = pointer || 0;

        return this._pointerData[pointer].timeOver;

    },

    /**
    * A timestamp representing when the Pointer left the touchscreen.
    * @method Phaser.InputHandler#pointerTimeOut
    * @param {Phaser.Pointer} pointer
    * @return {number}
    */
    pointerTimeOut: function (pointer) {

        pointer = pointer || 0;

        return this._pointerData[pointer].timeOut;

    },

    /**
    * Is this sprite being dragged by the mouse or not?
    * @method Phaser.InputHandler#pointerDragged
    * @param {Phaser.Pointer} pointer
    * @return {boolean} True if the pointer is dragging an object, otherwise false.
    */
    pointerDragged: function (pointer) {

        pointer = pointer || 0;

        return this._pointerData[pointer].isDragged;

    },

    /**
    * Checks if the given pointer is over this Sprite and can click it.
    * @method Phaser.InputHandler#checkPointerDown
    * @param {Phaser.Pointer} pointer
    * @return {boolean} True if the pointer is down, otherwise false.
    */
    checkPointerDown: function (pointer) {

        if (!this.enabled || !this.sprite || !this.sprite.parent || !this.sprite.visible || !this.sprite.parent.visible)
        {
            return false;
        }

        //  Need to pass it a temp point, in case we need it again for the pixel check
        if (this.game.input.hitTest(this.sprite, pointer, this._tempPoint))
        {
            if (this.pixelPerfectClick)
            {
                return this.checkPixel(this._tempPoint.x, this._tempPoint.y);
            }
            else
            {
                return true;
            }
        }

        return false;

    },

    /**
    * Checks if the given pointer is over this Sprite.
    * @method Phaser.InputHandler#checkPointerOver
    * @param {Phaser.Pointer} pointer
    * @return {boolean}
    */
    checkPointerOver: function (pointer) {

        if (!this.enabled || !this.sprite || !this.sprite.parent || !this.sprite.visible || !this.sprite.parent.visible)
        {
            return false;
        }

        //  Need to pass it a temp point, in case we need it again for the pixel check
        if (this.game.input.hitTest(this.sprite, pointer, this._tempPoint))
        {
            if (this.pixelPerfectOver)
            {
                return this.checkPixel(this._tempPoint.x, this._tempPoint.y);
            }
            else
            {
                return true;
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
    * @param {Phaser.Pointer} [pointer] - The pointer to get the x/y coordinate from if not passed as the first two parameters.
    * @return {boolean} true if there is the alpha of the pixel is >= InputHandler.pixelPerfectAlpha
    */
    checkPixel: function (x, y, pointer) {

        //  Grab a pixel from our image into the hitCanvas and then test it
        if (this.sprite.texture.baseTexture.source)
        {
            this.game.input.hitContext.clearRect(0, 0, 1, 1);

            if (x === null && y === null)
            {
                //  Use the pointer parameter
                this.game.input.getLocalPosition(this.sprite, pointer, this._tempPoint);

                var x = this._tempPoint.x;
                var y = this._tempPoint.y;
            }

            if (this.sprite.anchor.x !== 0)
            {
                x -= -this.sprite.texture.frame.width * this.sprite.anchor.x;
            }

            if (this.sprite.anchor.y !== 0)
            {
                y -= -this.sprite.texture.frame.height * this.sprite.anchor.y;
            }

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
    * @protected
    * @param {Phaser.Pointer} pointer
    */
    update: function (pointer) {

        if (this.sprite === null || this.sprite.parent === undefined)
        {
            //  Abort. We've been destroyed.
            return;
        }

        if (!this.enabled || !this.sprite.visible || !this.sprite.parent.visible)
        {
            this._pointerOutHandler(pointer);
            return false;
        }

        if (this.draggable && this._draggedPointerID == pointer.id)
        {
            return this.updateDrag(pointer);
        }
        else if (this._pointerData[pointer.id].isOver === true)
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
    * Internal method handling the pointer over event.
    * @method Phaser.InputHandler#_pointerOverHandler
    * @private
    * @param {Phaser.Pointer} pointer
    */
    _pointerOverHandler: function (pointer) {

        if (this.sprite === null)
        {
            //  Abort. We've been destroyed.
            return;
        }

        if (this._pointerData[pointer.id].isOver === false)
        {
            this._pointerData[pointer.id].isOver = true;
            this._pointerData[pointer.id].isOut = false;
            this._pointerData[pointer.id].timeOver = this.game.time.now;
            this._pointerData[pointer.id].x = pointer.x - this.sprite.x;
            this._pointerData[pointer.id].y = pointer.y - this.sprite.y;

            if (this.useHandCursor && this._pointerData[pointer.id].isDragged === false)
            {
                this.game.canvas.style.cursor = "pointer";
                this._setHandCursor = true;
            }

            if (this.sprite && this.sprite.events)
            {
                this.sprite.events.onInputOver.dispatch(this.sprite, pointer);
            }
        }

    },

    /**
    * Internal method handling the pointer out event.
    * @method Phaser.InputHandler#_pointerOutHandler
    * @private
    * @param {Phaser.Pointer} pointer
    */
    _pointerOutHandler: function (pointer) {

        if (this.sprite === null)
        {
            //  Abort. We've been destroyed.
            return;
        }

        this._pointerData[pointer.id].isOver = false;
        this._pointerData[pointer.id].isOut = true;
        this._pointerData[pointer.id].timeOut = this.game.time.now;

        if (this.useHandCursor && this._pointerData[pointer.id].isDragged === false)
        {
            this.game.canvas.style.cursor = "default";
            this._setHandCursor = false;
        }

        if (this.sprite && this.sprite.events)
        {
            this.sprite.events.onInputOut.dispatch(this.sprite, pointer);
        }

    },

    /**
    * Internal method handling the touched event.
    * @method Phaser.InputHandler#_touchedHandler
    * @private
    * @param {Phaser.Pointer} pointer
    */
    _touchedHandler: function (pointer) {

        if (this.sprite === null)
        {
            //  Abort. We've been destroyed.
            return;
        }

        if (this._pointerData[pointer.id].isDown === false && this._pointerData[pointer.id].isOver === true)
        {
            if (this.pixelPerfectClick && !this.checkPixel(null, null, pointer))
            {
                return;
            }

            this._pointerData[pointer.id].isDown = true;
            this._pointerData[pointer.id].isUp = false;
            this._pointerData[pointer.id].timeDown = this.game.time.now;
    
            if (this.sprite && this.sprite.events)
            {
                this.sprite.events.onInputDown.dispatch(this.sprite, pointer);
            }

            //  Start drag
            if (this.draggable && this.isDragged === false)
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
    * Internal method handling the pointer released event.
    * @method Phaser.InputHandler#_releasedHandler
    * @private
    * @param {Phaser.Pointer} pointer
    */
    _releasedHandler: function (pointer) {

        if (this.sprite === null)
        {
            //  Abort. We've been destroyed.
            return;
        }

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
                //  Release the inputUp signal and provide optional parameter if pointer is still over the sprite or not
                if (this.sprite && this.sprite.events)
                {
                    this.sprite.events.onInputUp.dispatch(this.sprite, pointer, true);
                }
            }
            else
            {
                //  Release the inputUp signal and provide optional parameter if pointer is still over the sprite or not
                if (this.sprite && this.sprite.events)
                {
                    this.sprite.events.onInputUp.dispatch(this.sprite, pointer, false);
                }

                //  Pointer outside the sprite? Reset the cursor
                if (this.useHandCursor)
                {
                    this.game.canvas.style.cursor = "default";
                    this._setHandCursor = false;
                }
            }

            //  Stop drag
            if (this.draggable && this.isDragged && this._draggedPointerID === pointer.id)
            {
                this.stopDrag(pointer);
            }
        }

    },

    /**
    * Updates the Pointer drag on this Sprite.
    * @method Phaser.InputHandler#updateDrag
    * @param {Phaser.Pointer} pointer
    * @return {boolean}
    */
    updateDrag: function (pointer) {

        if (pointer.isUp)
        {
            this.stopDrag(pointer);
            return false;
        }

        if (this.sprite.fixedToCamera)
        {
            if (this.allowHorizontalDrag)
            {
                this.sprite.cameraOffset.x = pointer.x + this._dragPoint.x + this.dragOffset.x;
            }

            if (this.allowVerticalDrag)
            {
                this.sprite.cameraOffset.y = pointer.y + this._dragPoint.y + this.dragOffset.y;
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
                this.sprite.cameraOffset.x = Math.round((this.sprite.cameraOffset.x - (this.snapOffsetX % this.snapX)) / this.snapX) * this.snapX + (this.snapOffsetX % this.snapX);
                this.sprite.cameraOffset.y = Math.round((this.sprite.cameraOffset.y - (this.snapOffsetY % this.snapY)) / this.snapY) * this.snapY + (this.snapOffsetY % this.snapY);
            }
        }
        else
        {
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
                this.sprite.x = Math.round((this.sprite.x - (this.snapOffsetX % this.snapX)) / this.snapX) * this.snapX + (this.snapOffsetX % this.snapX);
                this.sprite.y = Math.round((this.sprite.y - (this.snapOffsetY % this.snapY)) / this.snapY) * this.snapY + (this.snapOffsetY % this.snapY);
            }
        }

        return true;

    },

    /**
    * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justOver
    * @param {Phaser.Pointer} pointer
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
    * @param {Phaser.Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just out.
    * @return {boolean}
    */
    justOut: function (pointer, delay) {

        pointer = pointer || 0;
        delay = delay || 500;

        return (this._pointerData[pointer].isOut && (this.game.time.now - this._pointerData[pointer].timeOut < delay));

    },

    /**
    * Returns true if the pointer has touched or clicked on the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justPressed
    * @param {Phaser.Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just over.
    * @return {boolean}
    */
    justPressed: function (pointer, delay) {

        pointer = pointer || 0;
        delay = delay || 500;

        return (this._pointerData[pointer].isDown && this.downDuration(pointer) < delay);

    },

    /**
    * Returns true if the pointer was touching this Sprite, but has been released within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justReleased
    * @param {Phaser.Pointer} pointer
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
    * @param {Phaser.Pointer} pointer
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
    * @param {Phaser.Pointer} pointer
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
    * @param {boolean} [lockCenter=false] - If false the Sprite will drag from where you click it minus the dragOffset. If true it will center itself to the tip of the mouse pointer.
    * @param {boolean} [bringToTop=false] - If true the Sprite will be bought to the top of the rendering list in its current Group.
    * @param {boolean} [pixelPerfect=false] - If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
    * @param {boolean} [alphaThreshold=255] - If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed.
    * @param {Phaser.Rectangle} [boundsRect=null] - If you want to restrict the drag of this sprite to a specific Rectangle, pass the Phaser.Rectangle here, otherwise it's free to drag anywhere.
    * @param {Phaser.Sprite} [boundsSprite=null] - If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here.
    */
    enableDrag: function (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite) {

        if (typeof lockCenter == 'undefined') { lockCenter = false; }
        if (typeof bringToTop == 'undefined') { bringToTop = false; }
        if (typeof pixelPerfect == 'undefined') { pixelPerfect = false; }
        if (typeof alphaThreshold == 'undefined') { alphaThreshold = 255; }
        if (typeof boundsRect == 'undefined') { boundsRect = null; }
        if (typeof boundsSprite == 'undefined') { boundsSprite = null; }

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
    * @param {Phaser.Pointer} pointer
    */
    startDrag: function (pointer) {

        this.isDragged = true;
        this._draggedPointerID = pointer.id;
        this._pointerData[pointer.id].isDragged = true;

        if (this.sprite.fixedToCamera)
        {
            if (this.dragFromCenter)
            {
                this.sprite.centerOn(pointer.x, pointer.y);
                this._dragPoint.setTo(this.sprite.cameraOffset.x - pointer.x, this.sprite.cameraOffset.y - pointer.y);
            }
            else
            {
                this._dragPoint.setTo(this.sprite.cameraOffset.x - pointer.x, this.sprite.cameraOffset.y - pointer.y);
            }
        }
        else
        {
            if (this.dragFromCenter)
            {
                var bounds = this.sprite.getBounds();
                this.sprite.x = pointer.x + (this.sprite.x - bounds.centerX);
                this.sprite.y = pointer.y + (this.sprite.y - bounds.centerY);
                this._dragPoint.setTo(this.sprite.x - pointer.x, this.sprite.y - pointer.y);
            }
            else
            {
                this._dragPoint.setTo(this.sprite.x - pointer.x, this.sprite.y - pointer.y);
            }
        }

        this.updateDrag(pointer);

        if (this.bringToTop)
        {
            this._dragPhase = true;
            this.sprite.bringToTop();
        }

        this.sprite.events.onDragStart.dispatch(this.sprite, pointer);

    },

    /**
    * Called by Pointer when drag is stopped on this Sprite. Should not usually be called directly.
    * @method Phaser.InputHandler#stopDrag
    * @param {Phaser.Pointer} pointer
    */
    stopDrag: function (pointer) {

        this.isDragged = false;
        this._draggedPointerID = -1;
        this._pointerData[pointer.id].isDragged = false;
        this._dragPhase = false;

        if (this.snapOnRelease)
        {
            if (this.sprite.fixedToCamera)
            {
                this.sprite.cameraOffset.x = Math.round((this.sprite.cameraOffset.x - (this.snapOffsetX % this.snapX)) / this.snapX) * this.snapX + (this.snapOffsetX % this.snapX);
                this.sprite.cameraOffset.y = Math.round((this.sprite.cameraOffset.y - (this.snapOffsetY % this.snapY)) / this.snapY) * this.snapY + (this.snapOffsetY % this.snapY);
            }
            else
            {
                this.sprite.x = Math.round((this.sprite.x - (this.snapOffsetX % this.snapX)) / this.snapX) * this.snapX + (this.snapOffsetX % this.snapX);
                this.sprite.y = Math.round((this.sprite.y - (this.snapOffsetY % this.snapY)) / this.snapY) * this.snapY + (this.snapOffsetY % this.snapY);
            }
        }

        this.sprite.events.onDragStop.dispatch(this.sprite, pointer);

        if (this.checkPointerOver(pointer) === false)
        {
            this._pointerOutHandler(pointer);
        }

    },

    /**
    * Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
    * @method Phaser.InputHandler#setDragLock
    * @param {boolean} [allowHorizontal=true] - To enable the sprite to be dragged horizontally set to true, otherwise false.
    * @param {boolean} [allowVertical=true] - To enable the sprite to be dragged vertically set to true, otherwise false.
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
    * @param {number} snapX - The width of the grid cell to snap to.
    * @param {number} snapY - The height of the grid cell to snap to.
    * @param {boolean} [onDrag=true] - If true the sprite will snap to the grid while being dragged.
    * @param {boolean} [onRelease=false] - If true the sprite will snap to the grid when released.
    * @param {number} [snapOffsetX=0] - Used to offset the top-left starting point of the snap grid.
    * @param {number} [snapOffsetX=0] - Used to offset the top-left starting point of the snap grid.
    */
    enableSnap: function (snapX, snapY, onDrag, onRelease, snapOffsetX, snapOffsetY) {

        if (typeof onDrag == 'undefined') { onDrag = true; }
        if (typeof onRelease == 'undefined') { onRelease = false; }
        if (typeof snapOffsetX == 'undefined') { snapOffsetX = 0; }
        if (typeof snapOffsetY == 'undefined') { snapOffsetY = 0; }

        this.snapX = snapX;
        this.snapY = snapY;
        this.snapOffsetX = snapOffsetX;
        this.snapOffsetY = snapOffsetY;
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

        if (this.sprite.fixedToCamera)
        {
            if (this.sprite.cameraOffset.x < this.boundsRect.left)
            {
                this.sprite.cameraOffset.x = this.boundsRect.cameraOffset.x;
            }
            else if ((this.sprite.cameraOffset.x + this.sprite.width) > this.boundsRect.right)
            {
                this.sprite.cameraOffset.x = this.boundsRect.right - this.sprite.width;
            }

            if (this.sprite.cameraOffset.y < this.boundsRect.top)
            {
                this.sprite.cameraOffset.y = this.boundsRect.top;
            }
            else if ((this.sprite.cameraOffset.y + this.sprite.height) > this.boundsRect.bottom)
            {
                this.sprite.cameraOffset.y = this.boundsRect.bottom - this.sprite.height;
            }
        }
        else
        {
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
        }

    },

    /**
    * Parent Sprite Bounds check for the sprite drag.
    * @method Phaser.InputHandler#checkBoundsSprite
    */
    checkBoundsSprite: function () {

        if (this.sprite.fixedToCamera && this.boundsSprite.fixedToCamera)
        {
            if (this.sprite.cameraOffset.x < this.boundsSprite.camerOffset.x)
            {
                this.sprite.cameraOffset.x = this.boundsSprite.camerOffset.x;
            }
            else if ((this.sprite.cameraOffset.x + this.sprite.width) > (this.boundsSprite.camerOffset.x + this.boundsSprite.width))
            {
                this.sprite.cameraOffset.x = (this.boundsSprite.camerOffset.x + this.boundsSprite.width) - this.sprite.width;
            }

            if (this.sprite.cameraOffset.y < this.boundsSprite.camerOffset.y)
            {
                this.sprite.cameraOffset.y = this.boundsSprite.camerOffset.y;
            }
            else if ((this.sprite.cameraOffset.y + this.sprite.height) > (this.boundsSprite.camerOffset.y + this.boundsSprite.height))
            {
                this.sprite.cameraOffset.y = (this.boundsSprite.camerOffset.y + this.boundsSprite.height) - this.sprite.height;
            }
        }
        else
        {
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

    }

};

Phaser.InputHandler.prototype.constructor = Phaser.InputHandler;
