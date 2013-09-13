var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Components - InputHandler
    *
    * Input detection component
    */
    (function (Components) {
        var InputHandler = (function () {
            /**
            * Sprite Input component constructor
            * @param parent The Sprite using this Input component
            */
            function InputHandler(parent) {
                /**
                * The PriorityID controls which Sprite receives an Input event first if they should overlap.
                */
                this.priorityID = 0;
                /**
                * The index of this Input component entry in the Game.Input manager.
                */
                this.indexID = 0;
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
                this.game = parent.game;
                this._parent = parent;
                this.enabled = false;
            }
            InputHandler.prototype.pointerX = /**
            * The x coordinate of the Input pointer, relative to the top-left of the parent Sprite.
            * This value is only set when the pointer is over this Sprite.
            * @type {number}
            */
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].x;
            };
            InputHandler.prototype.pointerY = /**
            * The y coordinate of the Input pointer, relative to the top-left of the parent Sprite
            * This value is only set when the pointer is over this Sprite.
            * @type {number}
            */
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].y;
            };
            InputHandler.prototype.pointerDown = /**
            * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
            * @property isDown
            * @type {bool}
            **/
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isDown;
            };
            InputHandler.prototype.pointerUp = /**
            * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
            * @property isUp
            * @type {bool}
            **/
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isUp;
            };
            InputHandler.prototype.pointerTimeDown = /**
            * A timestamp representing when the Pointer first touched the touchscreen.
            * @property timeDown
            * @type {Number}
            **/
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeDown;
            };
            InputHandler.prototype.pointerTimeUp = /**
            * A timestamp representing when the Pointer left the touchscreen.
            * @property timeUp
            * @type {Number}
            **/
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeUp;
            };
            InputHandler.prototype.pointerOver = /**
            * Is the Pointer over this Sprite
            * @property isOver
            * @type {bool}
            **/
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isOver;
            };
            InputHandler.prototype.pointerOut = /**
            * Is the Pointer outside of this Sprite
            * @property isOut
            * @type {bool}
            **/
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isOut;
            };
            InputHandler.prototype.pointerTimeOver = /**
            * A timestamp representing when the Pointer first touched the touchscreen.
            * @property timeDown
            * @type {Number}
            **/
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeOver;
            };
            InputHandler.prototype.pointerTimeOut = /**
            * A timestamp representing when the Pointer left the touchscreen.
            * @property timeUp
            * @type {Number}
            **/
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeOut;
            };
            InputHandler.prototype.pointerDragged = /**
            * Is this sprite being dragged by the mouse or not?
            * @default false
            */
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isDragged;
            };
            InputHandler.prototype.start = function (priority, checkBody, useHandCursor) {
                if (typeof priority === "undefined") { priority = 0; }
                if (typeof checkBody === "undefined") { checkBody = false; }
                if (typeof useHandCursor === "undefined") { useHandCursor = false; }
                //  Turning on
                if(this.enabled == false) {
                    //  Register, etc
                    this.checkBody = checkBody;
                    this.useHandCursor = useHandCursor;
                    this.priorityID = priority;
                    this._pointerData = [];
                    for(var i = 0; i < 10; i++) {
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
                    this.snapOffset = new Phaser.Point();
                    this.enabled = true;
                    this.game.input.addGameObject(this._parent);
                    //  Create the signals the Input component will emit
                    if(this._parent.events.onInputOver == null) {
                        this._parent.events.onInputOver = new Phaser.Signal();
                        this._parent.events.onInputOut = new Phaser.Signal();
                        this._parent.events.onInputDown = new Phaser.Signal();
                        this._parent.events.onInputUp = new Phaser.Signal();
                        this._parent.events.onDragStart = new Phaser.Signal();
                        this._parent.events.onDragStop = new Phaser.Signal();
                    }
                }
                return this._parent;
            };
            InputHandler.prototype.reset = function () {
                this.enabled = false;
                for(var i = 0; i < 10; i++) {
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
            };
            InputHandler.prototype.stop = function () {
                //  Turning off
                if(this.enabled == false) {
                    return;
                } else {
                    //  De-register, etc
                    this.enabled = false;
                    this.game.input.removeGameObject(this.indexID);
                }
            };
            InputHandler.prototype.destroy = /**
            * Clean up memory.
            */
            function () {
                if(this.enabled) {
                    this.enabled = false;
                    this.game.input.removeGameObject(this.indexID);
                }
            };
            InputHandler.prototype.checkPointerOver = /**
            * Checks if the given pointer is over this Sprite. All checks are done in world coordinates.
            */
            function (pointer) {
                if(this.enabled == false || this._parent.visible == false) {
                    return false;
                } else {
                    //return SpriteUtils.overlapsXY(this._parent, pointer.worldX, pointer.worldY);
                    //return SpriteUtils.overlapsXY(this._parent, pointer.screenX, pointer.screenY);
                    return Phaser.SpriteUtils.overlapsPointer(this._parent, pointer);
                }
            };
            InputHandler.prototype.update = /**
            * Update
            */
            function (pointer) {
                if(this.enabled == false || this._parent.visible == false) {
                    this._pointerOutHandler(pointer);
                    return false;
                }
                if(this.draggable && this._draggedPointerID == pointer.id) {
                    return this.updateDrag(pointer);
                } else if(this._pointerData[pointer.id].isOver == true) {
                    //if (SpriteUtils.overlapsXY(this._parent, pointer.worldX, pointer.worldY))
                    if(Phaser.SpriteUtils.overlapsPointer(this._parent, pointer)) {
                        this._pointerData[pointer.id].x = pointer.x - this._parent.x;
                        this._pointerData[pointer.id].y = pointer.y - this._parent.y;
                        return true;
                    } else {
                        this._pointerOutHandler(pointer);
                        return false;
                    }
                }
            };
            InputHandler.prototype._pointerOverHandler = function (pointer) {
                if(this._pointerData[pointer.id].isOver == false) {
                    this._pointerData[pointer.id].isOver = true;
                    this._pointerData[pointer.id].isOut = false;
                    this._pointerData[pointer.id].timeOver = this.game.time.now;
                    this._pointerData[pointer.id].x = pointer.x - this._parent.x;
                    this._pointerData[pointer.id].y = pointer.y - this._parent.y;
                    if(this.useHandCursor && this._pointerData[pointer.id].isDragged == false) {
                        this.game.stage.canvas.style.cursor = "pointer";
                    }
                    this._parent.events.onInputOver.dispatch(this._parent, pointer);
                }
            };
            InputHandler.prototype._pointerOutHandler = function (pointer) {
                this._pointerData[pointer.id].isOver = false;
                this._pointerData[pointer.id].isOut = true;
                this._pointerData[pointer.id].timeOut = this.game.time.now;
                if(this.useHandCursor && this._pointerData[pointer.id].isDragged == false) {
                    this.game.stage.canvas.style.cursor = "default";
                }
                this._parent.events.onInputOut.dispatch(this._parent, pointer);
            };
            InputHandler.prototype._touchedHandler = function (pointer) {
                if(this._pointerData[pointer.id].isDown == false && this._pointerData[pointer.id].isOver == true) {
                    this._pointerData[pointer.id].isDown = true;
                    this._pointerData[pointer.id].isUp = false;
                    this._pointerData[pointer.id].timeDown = this.game.time.now;
                    //console.log('touchedHandler: ' + Date.now());
                    this._parent.events.onInputDown.dispatch(this._parent, pointer);
                    //  Start drag
                    //if (this.draggable && this.isDragged == false && pointer.targetObject == null)
                    if(this.draggable && this.isDragged == false) {
                        this.startDrag(pointer);
                    }
                    if(this.bringToTop) {
                        this._parent.bringToTop();
                        //this._parent.game.world.group.bringToTop(this._parent);
                                            }
                }
                //  Consume the event?
                return this.consumePointerEvent;
            };
            InputHandler.prototype._releasedHandler = function (pointer) {
                //  If was previously touched by this Pointer, check if still is AND still over this item
                if(this._pointerData[pointer.id].isDown && pointer.isUp) {
                    this._pointerData[pointer.id].isDown = false;
                    this._pointerData[pointer.id].isUp = true;
                    this._pointerData[pointer.id].timeUp = this.game.time.now;
                    this._pointerData[pointer.id].downDuration = this._pointerData[pointer.id].timeUp - this._pointerData[pointer.id].timeDown;
                    //  Only release the InputUp signal if the pointer is still over this sprite
                    //if (SpriteUtils.overlapsXY(this._parent, pointer.worldX, pointer.worldY))
                    if(Phaser.SpriteUtils.overlapsPointer(this._parent, pointer)) {
                        //console.log('releasedHandler: ' + Date.now());
                        this._parent.events.onInputUp.dispatch(this._parent, pointer);
                    } else {
                        //  Pointer outside the sprite? Reset the cursor
                        if(this.useHandCursor) {
                            this.game.stage.canvas.style.cursor = "default";
                        }
                    }
                    //  Stop drag
                    if(this.draggable && this.isDragged && this._draggedPointerID == pointer.id) {
                        this.stopDrag(pointer);
                    }
                }
            };
            InputHandler.prototype.updateDrag = /**
            * Updates the Pointer drag on this Sprite.
            */
            function (pointer) {
                if(pointer.isUp) {
                    this.stopDrag(pointer);
                    return false;
                }
                if(this.allowHorizontalDrag) {
                    this._parent.x = pointer.x + this._dragPoint.x + this.dragOffset.x;
                }
                if(this.allowVerticalDrag) {
                    this._parent.y = pointer.y + this._dragPoint.y + this.dragOffset.y;
                }
                if(this.boundsRect) {
                    this.checkBoundsRect();
                }
                if(this.boundsSprite) {
                    this.checkBoundsSprite();
                }
                if(this.snapOnDrag) {
                    this._parent.x = Math.floor(this._parent.x / this.snapX) * this.snapX;
                    this._parent.y = Math.floor(this._parent.y / this.snapY) * this.snapY;
                }
                return true;
            };
            InputHandler.prototype.justOver = /**
            * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
            * @param delay The time below which the pointer is considered as just over.
            * @returns {bool}
            */
            function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isOver && this.overDuration(pointer) < delay);
            };
            InputHandler.prototype.justOut = /**
            * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
            * @param delay The time below which the pointer is considered as just out.
            * @returns {bool}
            */
            function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isOut && (this.game.time.now - this._pointerData[pointer].timeOut < delay));
            };
            InputHandler.prototype.justPressed = /**
            * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
            * @param delay The time below which the pointer is considered as just over.
            * @returns {bool}
            */
            function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isDown && this.downDuration(pointer) < delay);
            };
            InputHandler.prototype.justReleased = /**
            * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
            * @param delay The time below which the pointer is considered as just out.
            * @returns {bool}
            */
            function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isUp && (this.game.time.now - this._pointerData[pointer].timeUp < delay));
            };
            InputHandler.prototype.overDuration = /**
            * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
            * @returns {number} The number of milliseconds the pointer has been over the Sprite, or -1 if not over.
            */
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if(this._pointerData[pointer].isOver) {
                    return this.game.time.now - this._pointerData[pointer].timeOver;
                }
                return -1;
            };
            InputHandler.prototype.downDuration = /**
            * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
            * @returns {number} The number of milliseconds the pointer has been pressed down on the Sprite, or -1 if not over.
            */
            function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if(this._pointerData[pointer].isDown) {
                    return this.game.time.now - this._pointerData[pointer].timeDown;
                }
                return -1;
            };
            InputHandler.prototype.enableDrag = /**
            * Make this Sprite draggable by the mouse. You can also optionally set mouseStartDragCallback and mouseStopDragCallback
            *
            * @param	lockCenter			If false the Sprite will drag from where you click it minus the dragOffset. If true it will center itself to the tip of the mouse pointer.
            * @param	bringToTop			If true the Sprite will be bought to the top of the rendering list in its current Group.
            * @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
            * @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
            * @param	boundsRect			If you want to restrict the drag of this sprite to a specific FlxRect, pass the FlxRect here, otherwise it's free to drag anywhere
            * @param	boundsSprite		If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here
            */
            function (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite) {
                if (typeof lockCenter === "undefined") { lockCenter = false; }
                if (typeof bringToTop === "undefined") { bringToTop = false; }
                if (typeof pixelPerfect === "undefined") { pixelPerfect = false; }
                if (typeof alphaThreshold === "undefined") { alphaThreshold = 255; }
                if (typeof boundsRect === "undefined") { boundsRect = null; }
                if (typeof boundsSprite === "undefined") { boundsSprite = null; }
                this._dragPoint = new Phaser.Point();
                this.draggable = true;
                this.bringToTop = bringToTop;
                this.dragOffset = new Phaser.Point();
                this.dragFromCenter = lockCenter;
                this.dragPixelPerfect = pixelPerfect;
                this.dragPixelPerfectAlpha = alphaThreshold;
                if(boundsRect) {
                    this.boundsRect = boundsRect;
                }
                if(boundsSprite) {
                    this.boundsSprite = boundsSprite;
                }
            };
            InputHandler.prototype.disableDrag = /**
            * Stops this sprite from being able to be dragged. If it is currently the target of an active drag it will be stopped immediately. Also disables any set callbacks.
            */
            function () {
                if(this._pointerData) {
                    for(var i = 0; i < 10; i++) {
                        this._pointerData[i].isDragged = false;
                    }
                }
                this.draggable = false;
                this.isDragged = false;
                this._draggedPointerID = -1;
            };
            InputHandler.prototype.startDrag = /**
            * Called by Pointer when drag starts on this Sprite. Should not usually be called directly.
            */
            function (pointer) {
                this.isDragged = true;
                this._draggedPointerID = pointer.id;
                this._pointerData[pointer.id].isDragged = true;
                if(this.dragFromCenter) {
                    this._parent.transform.centerOn(pointer.worldX, pointer.worldY);
                    this._dragPoint.setTo(this._parent.x - pointer.x, this._parent.y - pointer.y);
                } else {
                    this._dragPoint.setTo(this._parent.x - pointer.x, this._parent.y - pointer.y);
                }
                this.updateDrag(pointer);
                if(this.bringToTop) {
                    this._parent.bringToTop();
                }
                this._parent.events.onDragStart.dispatch(this._parent, pointer);
            };
            InputHandler.prototype.stopDrag = /**
            * Called by Pointer when drag is stopped on this Sprite. Should not usually be called directly.
            */
            function (pointer) {
                this.isDragged = false;
                this._draggedPointerID = -1;
                this._pointerData[pointer.id].isDragged = false;
                if(this.snapOnRelease) {
                    this._parent.x = Math.floor(this._parent.x / this.snapX) * this.snapX;
                    this._parent.y = Math.floor(this._parent.y / this.snapY) * this.snapY;
                }
                this._parent.events.onDragStop.dispatch(this._parent, pointer);
                this._parent.events.onInputUp.dispatch(this._parent, pointer);
            };
            InputHandler.prototype.setDragLock = /**
            * Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
            *
            * @param	allowHorizontal		To enable the sprite to be dragged horizontally set to true, otherwise false
            * @param	allowVertical		To enable the sprite to be dragged vertically set to true, otherwise false
            */
            function (allowHorizontal, allowVertical) {
                if (typeof allowHorizontal === "undefined") { allowHorizontal = true; }
                if (typeof allowVertical === "undefined") { allowVertical = true; }
                this.allowHorizontalDrag = allowHorizontal;
                this.allowVerticalDrag = allowVertical;
            };
            InputHandler.prototype.enableSnap = /**
            * Make this Sprite snap to the given grid either during drag or when it's released.
            * For example 16x16 as the snapX and snapY would make the sprite snap to every 16 pixels.
            *
            * @param	snapX		The width of the grid cell in pixels
            * @param	snapY		The height of the grid cell in pixels
            * @param	onDrag		If true the sprite will snap to the grid while being dragged
            * @param	onRelease	If true the sprite will snap to the grid when released
            */
            function (snapX, snapY, onDrag, onRelease) {
                if (typeof onDrag === "undefined") { onDrag = true; }
                if (typeof onRelease === "undefined") { onRelease = false; }
                this.snapOnDrag = onDrag;
                this.snapOnRelease = onRelease;
                this.snapX = snapX;
                this.snapY = snapY;
            };
            InputHandler.prototype.disableSnap = /**
            * Stops the sprite from snapping to a grid during drag or release.
            */
            function () {
                this.snapOnDrag = false;
                this.snapOnRelease = false;
            };
            InputHandler.prototype.checkBoundsRect = /**
            * Bounds Rect check for the sprite drag
            */
            function () {
                if(this._parent.x < this.boundsRect.left) {
                    this._parent.x = this.boundsRect.x;
                } else if((this._parent.x + this._parent.width) > this.boundsRect.right) {
                    this._parent.x = this.boundsRect.right - this._parent.width;
                }
                if(this._parent.y < this.boundsRect.top) {
                    this._parent.y = this.boundsRect.top;
                } else if((this._parent.y + this._parent.height) > this.boundsRect.bottom) {
                    this._parent.y = this.boundsRect.bottom - this._parent.height;
                }
            };
            InputHandler.prototype.checkBoundsSprite = /**
            * Parent Sprite Bounds check for the sprite drag
            */
            function () {
                if(this._parent.x < this.boundsSprite.x) {
                    this._parent.x = this.boundsSprite.x;
                } else if((this._parent.x + this._parent.width) > (this.boundsSprite.x + this.boundsSprite.width)) {
                    this._parent.x = (this.boundsSprite.x + this.boundsSprite.width) - this._parent.width;
                }
                if(this._parent.y < this.boundsSprite.y) {
                    this._parent.y = this.boundsSprite.y;
                } else if((this._parent.y + this._parent.height) > (this.boundsSprite.y + this.boundsSprite.height)) {
                    this._parent.y = (this.boundsSprite.y + this.boundsSprite.height) - this._parent.height;
                }
            };
            return InputHandler;
        })();
        Components.InputHandler = InputHandler;        
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
