/// <reference path="../../Game.ts" />
/// <reference path="../../gameobjects/DynamicTexture.ts" />
/// <reference path="../../utils/SpriteUtils.ts" />
/// <reference path="../../utils/RectangleUtils.ts" />

/**
* Phaser - Components - Input
*
* Input detection component
*/

module Phaser.Components {

    export class Input {

        /**
         * Sprite Input component constructor
         * @param parent The Sprite using this Input component
         */
        constructor(parent: Sprite) {

            this.game = parent.game;
            this._sprite = parent;
            this.enabled = false;

        }

        /**
         * Reference to Phaser.Game
         */
        public game: Game;

        /**
         * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
         */
        private _sprite: Sprite;

        private _pointerData;

        /**
         * If enabled the Input component will be updated by the parent Sprite
         * @type {Boolean}
         */
        public enabled: bool;

        /**
         * The PriorityID controls which Sprite receives an Input event first if they should overlap.
         */
		public priorityID:number = 0;

        private _dragPoint: Point;
        private _draggedPointerID: number;
        public dragOffset: Point;
        public isDragged: bool = false;
        public dragFromCenter: bool;
		public dragPixelPerfect:bool = false;
		public dragPixelPerfectAlpha:number;

        public allowHorizontalDrag: bool = true;
        public allowVerticalDrag: bool = true;

        public snapOnDrag: bool = false;
        public snapOnRelease: bool = false;
        public snapOffset: Point;
        public snapX: number = 0;
        public snapY: number = 0;


        /**
		 * Is this sprite allowed to be dragged by the mouse? true = yes, false = no
		 * @default false
		 */
        public draggable: bool = false;

        /**
		 * A region of the game world within which the sprite is restricted during drag
		 * @default null
		 */
        public boundsRect: Rectangle = null;

        /**
		 * An Sprite the bounds of which this sprite is restricted during drag
		 * @default null
		 */
        public boundsSprite: Sprite = null;

        /**
         * The Input component can monitor either the physics body of the Sprite or the frameBounds
         * If checkBody is set to true it will monitor the bounds of the physics body.
         * @type {Boolean}
         */
        public checkBody: bool;

        /**
         * Turn the mouse pointer into a hand image by temporarily setting the CSS style of the Game canvas
         * on Input over. Only works on desktop browsers or browsers with a visible input pointer.
         * @type {Boolean}
         */
        public useHandCursor: bool;

        /**
         * The x coordinate of the Input pointer, relative to the top-left of the parent Sprite.
         * This value is only set when the pointer is over this Sprite.
         * @type {number}
         */
        public pointerX(pointer: number = 0): number {
            return this._pointerData[pointer].x;
        }

        /**
         * The y coordinate of the Input pointer, relative to the top-left of the parent Sprite
         * This value is only set when the pointer is over this Sprite.
         * @type {number}
         */
        public pointerY(pointer: number = 0): number {
            return this._pointerData[pointer].y;
        }

        /**
        * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
        * @property isDown
        * @type {Boolean}
        **/
        public pointerDown(pointer: number = 0): bool {
            return this._pointerData[pointer].isDown;
        }

        /**
        * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
        * @property isUp
        * @type {Boolean}
        **/
        public pointerUp(pointer: number = 0): bool {
            return this._pointerData[pointer].isUp;
        }

        /**
        * A timestamp representing when the Pointer first touched the touchscreen.
        * @property timeDown
        * @type {Number}
        **/
        public pointerTimeDown(pointer: number = 0): bool {
            return this._pointerData[pointer].timeDown;
        }

        /**
        * A timestamp representing when the Pointer left the touchscreen.
        * @property timeUp
        * @type {Number}
        **/
        public pointerTimeUp(pointer: number = 0): bool {
            return this._pointerData[pointer].timeUp;
        }

        /**
        * Is the Pointer over this Sprite
        * @property isOver
        * @type {Boolean}
        **/
        public pointerOver(pointer: number = 0): bool {
            return this._pointerData[pointer].isOver;
        }

        /**
        * Is the Pointer outside of this Sprite
        * @property isOut
        * @type {Boolean}
        **/
        public pointerOut(pointer: number = 0): bool {
            return this._pointerData[pointer].isOut;
        }

        /**
        * A timestamp representing when the Pointer first touched the touchscreen.
        * @property timeDown
        * @type {Number}
        **/
        public pointerTimeOver(pointer: number = 0): bool {
            return this._pointerData[pointer].timeOver;
        }

        /**
        * A timestamp representing when the Pointer left the touchscreen.
        * @property timeUp
        * @type {Number}
        **/
        public pointerTimeOut(pointer: number = 0): bool {
            return this._pointerData[pointer].timeOut;
        }

        /**
		 * Is this sprite being dragged by the mouse or not?
		 * @default false
		 */
        public pointerDragged(pointer: number = 0): bool {
            return this._pointerData[pointer].isDragged;
        }

		public start(priority:number = 0, checkBody?:bool = false, useHandCursor?:bool = false): Sprite {

		    //  Turning on
		    if (this.enabled == false)
		    {
                //  Register, etc
                this.checkBody = checkBody;
                this.useHandCursor = useHandCursor;
                this.priorityID = priority;

                this._pointerData = [];

                for (var i = 0; i < 10; i++)
                {
                    this._pointerData.push({ id: i, x: 0, y: 0, isDown: false, isUp: false, isOver: false, isOut: false, timeOver: 0, timeOut: 0, timeDown: 0, timeUp: 0, downDuration: 0, isDragged: false });
                }

                this.snapOffset = new Point;
		        this.enabled = true;

		        this.game.input.addGameObject(this._sprite);
		    }

            return this._sprite;

		}

		public reset() {

		    this.enabled = false;

            for (var i = 0; i < 10; i++)
            {
                this._pointerData[i] = { id: i, x: 0, y: 0, isDown: false, isUp: false, isOver: false, isOut: false, timeOver: 0, timeOut: 0, timeDown: 0, timeUp: 0, downDuration: 0, isDragged: false };
            }

		}

		public stop() {

		    //  Turning off
		    if (this.enabled == false)
		    {
		        return;
		    }
		    else
		    {
                //  De-register, etc
		        this.enabled = false;
		        this.game.input.removeGameObject(this._sprite);
		    }

		}

		public checkPointerOver(pointer: Phaser.Pointer): bool {

		    if (this.enabled == false || this._sprite.visible == false)
		    {
		        return false;
		    }
		    else
		    {
		        return RectangleUtils.contains(this._sprite.frameBounds, pointer.scaledX, pointer.scaledY);
		    }

		}

        /**
         * Update
         */
        public update(pointer: Phaser.Pointer): bool {

            if (this.enabled == false || this._sprite.visible == false)
            {
                return false;
            }

            if (this.draggable && this._draggedPointerID == pointer.id)
            {
                return this.updateDrag(pointer);
            }
            else if (this._pointerData[pointer.id].isOver == true)
            {
                if (RectangleUtils.contains(this._sprite.frameBounds, pointer.scaledX, pointer.scaledY))
                {
                    this._pointerData[pointer.id].x = pointer.scaledX - this._sprite.x;
                    this._pointerData[pointer.id].y = pointer.scaledY - this._sprite.y;
                    return true;
                }
                else
                {
                    this._pointOutHandler(pointer);
                    return false;
                }
            }

        }

        public _pointerOverHandler(pointer: Pointer) {

            //  { id: i, x: 0, y: 0, isDown: false, isUp: false, isOver: false, isOut: false, timeOver: 0, timeOut: 0, isDragged: false }

            if (this._pointerData[pointer.id].isOver == false)
            {
                this._pointerData[pointer.id].isOver = true;
                this._pointerData[pointer.id].isOut = false;
                this._pointerData[pointer.id].timeOver = this.game.time.now;
                this._pointerData[pointer.id].x = pointer.x - this._sprite.x;
                this._pointerData[pointer.id].y = pointer.y - this._sprite.y;

                if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false)
                {
                    this.game.stage.canvas.style.cursor = "pointer";
                }

                this._sprite.events.onInputOver.dispatch(this._sprite, pointer);
            }

        }

        public _pointOutHandler(pointer: Pointer) {

            this._pointerData[pointer.id].isOver = false;
            this._pointerData[pointer.id].isOut = true;
            this._pointerData[pointer.id].timeOut = this.game.time.now;

            if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false)
            {
                this.game.stage.canvas.style.cursor = "default";
            }

            this._sprite.events.onInputOut.dispatch(this._sprite, pointer);

        }

        public consumePointerEvent: bool = false;

        public _touchedHandler(pointer: Pointer): bool {

            console.log('touched handler', this._pointerData[pointer.id]);

            if (this._pointerData[pointer.id].isDown == false && this._pointerData[pointer.id].isOver == true)
            {
                //console.log('touchDown on', this._sprite.texture.cacheKey,this._sprite.frameName, this._sprite.frameBounds.width,this._sprite.frameBounds.height);
                this._pointerData[pointer.id].isDown = true;
                this._pointerData[pointer.id].isUp = false;
                this._pointerData[pointer.id].timeDown = this.game.time.now;

                this._sprite.events.onInputDown.dispatch(this._sprite, pointer);

                //  Start drag
                //if (this.draggable && this.isDragged == false && pointer.targetObject == null)
                if (this.draggable && this.isDragged == false)
                {
                    this.startDrag(pointer);
                }

            }

            //  Consume the event?
            return this.consumePointerEvent;

        }

        public _releasedHandler(pointer: Pointer) {

            console.log('release handler');

            //  If was previously touched by this Pointer, check if still is
            if (this._pointerData[pointer.id].isDown && pointer.isUp)
            {
                this._pointerData[pointer.id].isDown = false;
                this._pointerData[pointer.id].isUp = true;
                this._pointerData[pointer.id].timeUp = this.game.time.now;
                this._pointerData[pointer.id].downDuration = this._pointerData[pointer.id].timeUp - this._pointerData[pointer.id].timeDown;

                this._sprite.events.onInputUp.dispatch(this._sprite, pointer);

                //  Stop drag
                if (this.draggable && this.isDragged && this._draggedPointerID == pointer.id)
                {
                    this.stopDrag(pointer);
                }

                if (this.useHandCursor)
                {
                    this.game.stage.canvas.style.cursor = "default";
                }
            }

        }

		/**
		 * Updates the Pointer drag on this Sprite.
		 */
		private updateDrag(pointer: Pointer):bool
		{
		    if (pointer.isUp)
		    {
		        this.stopDrag(pointer);
		        return false;
		    }

			if (this.allowHorizontalDrag)
			{
			    this._sprite.x = pointer.x + this._dragPoint.x + this.dragOffset.x;
			}
			
			if (this.allowVerticalDrag)
			{
			    this._sprite.y = pointer.y + this._dragPoint.y + this.dragOffset.y;
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
				this._sprite.x = Math.floor(this._sprite.x / this.snapX) * this.snapX;
				this._sprite.y = Math.floor(this._sprite.y / this.snapY) * this.snapY;
			}

			return true;
		}

        /**
         * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
         * @param delay The time below which the pointer is considered as just over.
         * @returns {boolean}
         */
        public justOver(pointer: number = 0, delay?: number = 500): bool {
            return (this._pointerData[pointer].isOver && this.overDuration(pointer) < delay);
        }

        /**
         * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
         * @param delay The time below which the pointer is considered as just out.
         * @returns {boolean}
         */
        public justOut(pointer: number = 0, delay?: number = 500): bool {
            return (this._pointerData[pointer].isOut && (this.game.time.now - this._pointerData[pointer].timeOut < delay));
        }

        /**
         * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
         * @param delay The time below which the pointer is considered as just over.
         * @returns {boolean}
         */
        public justPressed(pointer: number = 0, delay?: number = 500): bool {
            return (this._pointerData[pointer].isDown && this.downDuration(pointer) < delay);
        }

        /**
         * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
         * @param delay The time below which the pointer is considered as just out.
         * @returns {boolean}
         */
        public justReleased(pointer: number = 0, delay?: number = 500): bool {
            return (this._pointerData[pointer].isUp && (this.game.time.now - this._pointerData[pointer].timeUp < delay));
        }

        /**
         * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
         * @returns {number} The number of milliseconds the pointer has been over the Sprite, or -1 if not over.
         */
        public overDuration(pointer: number = 0): number {

            if (this._pointerData[pointer].isOver)
            {
                return this.game.time.now - this._pointerData[pointer].timeOver;
            }

            return -1;

        }

        /**
         * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
         * @returns {number} The number of milliseconds the pointer has been pressed down on the Sprite, or -1 if not over.
         */
        public downDuration(pointer: number = 0): number {

            if (this._pointerData[pointer].isDown)
            {
                return this.game.time.now - this._pointerData[pointer].timeDown;
            }

            return -1;

        }

		/**
		 * Make this Sprite draggable by the mouse. You can also optionally set mouseStartDragCallback and mouseStopDragCallback
		 * 
		 * @param	lockCenter			If false the Sprite will drag from where you click it minus the dragOffset. If true it will center itself to the tip of the mouse pointer.
		 * @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
		 * @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
		 * @param	boundsRect			If you want to restrict the drag of this sprite to a specific FlxRect, pass the FlxRect here, otherwise it's free to drag anywhere
		 * @param	boundsSprite		If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here
		 */
		public enableDrag(lockCenter:bool = false, pixelPerfect:bool = false, alphaThreshold:number = 255, boundsRect:Rectangle = null, boundsSprite:Sprite = null):void
		{
            this._dragPoint = new Point;

			this.draggable = true;
			
            this.dragOffset = new Point;
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
		}
		
		/**
		 * Stops this sprite from being able to be dragged. If it is currently the target of an active drag it will be stopped immediately. Also disables any set callbacks.
		 */
		public disableDrag():void
		{
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
		}

		/**
		 * Called by Pointer when drag starts on this Sprite. Should not usually be called directly.
		 */
		public startDrag(pointer: Pointer):void
		{
		    this.isDragged = true;
		    this._draggedPointerID = pointer.id;
            this._pointerData[pointer.id].isDragged = true;
			
            if (this.dragFromCenter)
            {
                //	Move the sprite to the middle of the pointer
                this._dragPoint.setTo(-this._sprite.frameBounds.halfWidth, -this._sprite.frameBounds.halfHeight);
            }
            else
            {
                this._dragPoint.setTo(this._sprite.x - pointer.x, this._sprite.y - pointer.y);
            }

		    //pointer.draggedObject = this._sprite;

		}

		/**
		 * Called by Pointer when drag is stopped on this Sprite. Should not usually be called directly.
		 */
		public stopDrag(pointer: Pointer):void
		{
		    this.isDragged = false;
		    this._draggedPointerID = -1;
            this._pointerData[pointer.id].isDragged = false;
			
			if (this.snapOnRelease)
			{
				this._sprite.x = Math.floor(this._sprite.x / this.snapX) * this.snapX;
				this._sprite.y = Math.floor(this._sprite.y / this.snapY) * this.snapY;
			}

		    //pointer.draggedObject = null;
		}

		/**
		* Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
		 * 
		 * @param	allowHorizontal		To enable the sprite to be dragged horizontally set to true, otherwise false
		 * @param	allowVertical		To enable the sprite to be dragged vertically set to true, otherwise false
		 */
		public setDragLock(allowHorizontal:bool = true, allowVertical:bool = true):void
		{
			this.allowHorizontalDrag = allowHorizontal;
			this.allowVerticalDrag = allowVertical;
		}

		/**
		 * Make this Sprite snap to the given grid either during drag or when it's released.
		 * For example 16x16 as the snapX and snapY would make the sprite snap to every 16 pixels.
		 * 
		 * @param	snapX		The width of the grid cell in pixels
		 * @param	snapY		The height of the grid cell in pixels
		 * @param	onDrag		If true the sprite will snap to the grid while being dragged
		 * @param	onRelease	If true the sprite will snap to the grid when released
		 */
		public enableSnap(snapX:number , snapY:number, onDrag:bool = true, onRelease:bool = false):void
		{
			this.snapOnDrag = onDrag;
			this.snapOnRelease = onRelease;
			this.snapX = snapX;
			this.snapY = snapY;
		}
		
		/**
		 * Stops the sprite from snapping to a grid during drag or release.
		 */
		public disableSnap():void
		{
			this.snapOnDrag = false;
			this.snapOnRelease = false;
		}
		
		/**
		 * Bounds Rect check for the sprite drag
		 */
		private checkBoundsRect():void
		{
			if (this._sprite.x < this.boundsRect.left)
			{
				this._sprite.x = this.boundsRect.x;
			}
			else if ((this._sprite.x + this._sprite.width) > this.boundsRect.right)
			{
				this._sprite.x = this.boundsRect.right - this._sprite.width;
			}
			
			if (this._sprite.y < this.boundsRect.top)
			{
				this._sprite.y = this.boundsRect.top;
			}
			else if ((this._sprite.y + this._sprite.height) > this.boundsRect.bottom)
			{
				this._sprite.y = this.boundsRect.bottom - this._sprite.height;
			}
		}
		
		/**
		 * Parent Sprite Bounds check for the sprite drag
		 */
		private checkBoundsSprite():void
		{
			if (this._sprite.x < this.boundsSprite.x)
			{
				this._sprite.x = this.boundsSprite.x;
			}
			else if ((this._sprite.x + this._sprite.width) > (this.boundsSprite.x + this.boundsSprite.width))
			{
				this._sprite.x = (this.boundsSprite.x + this.boundsSprite.width) - this._sprite.width;
			}
			
			if (this._sprite.y < this.boundsSprite.y)
			{
				this._sprite.y = this.boundsSprite.y;
			}
			else if ((this._sprite.y + this._sprite.height) > (this.boundsSprite.y + this.boundsSprite.height))
			{
				this._sprite.y = (this.boundsSprite.y + this.boundsSprite.height) - this._sprite.height;
			}
		}

        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this._sprite.texture.context.font = '16px Courier';
            this._sprite.texture.context.fillStyle = color;
            this._sprite.texture.context.fillText('Sprite Input: (' + this._sprite.frameBounds.width + ' x ' + this._sprite.frameBounds.height + ')', x, y);
            this._sprite.texture.context.fillText('x: ' + this.pointerX(1).toFixed(1) + ' y: ' + this.pointerY(1).toFixed(1), x, y + 14);
            this._sprite.texture.context.fillText('over: ' + this.pointerOver(1) + ' duration: ' + this.overDuration(1).toFixed(0), x, y + 28);
            this._sprite.texture.context.fillText('down: ' + this.pointerDown(1) + ' duration: ' + this.downDuration(1).toFixed(0), x, y + 42);
            this._sprite.texture.context.fillText('just over: ' + this.justOver(1) + ' just out: ' + this.justOut(1), x, y + 56);

        }

    }

}