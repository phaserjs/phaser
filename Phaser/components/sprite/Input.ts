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

            this.checkBody = false;
            this.useHandCursor = false;

        }

        /**
         * Reference to Phaser.Game
         */
        public game: Game;

        /**
         * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
         */
        private _sprite: Sprite;

        private dragOffsetX: number;
        private dragOffsetY: number;
        private dragFromPoint: bool;
		private dragPixelPerfect:bool = false;
		private dragPixelPerfectAlpha:number;
        private allowHorizontalDrag: bool = true;
        private allowVerticalDrag: bool = true;
        private snapOnDrag: bool = false;
        private snapOnRelease: bool = false;
        private snapX: number;
        private snapY: number;

        /**
         * If enabled the Input component will be updated by the parent Sprite
         * @type {Boolean}
         */
        public enabled: bool;

        /**
		 * Is this sprite being dragged by the mouse or not?
		 * @default false
		 */
        public isDragged: bool = false;

        /**
		 * Is this sprite allowed to be dragged by the mouse? true = yes, false = no
		 * @default false
		 */
        public draggable: bool = false;

        /**
		 * An FlxRect region of the game world within which the sprite is restricted during mouse drag
		 * @default null
		 */
        public boundsRect: Rectangle = null;

        /**
		 * An FlxSprite the bounds of which this sprite is restricted during mouse drag
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
         * This value is only set with the pointer is over this Sprite.
         * @type {number}
         */
        public x: number = 0;

        /**
         * The y coordinate of the Input pointer, relative to the top-left of the parent Sprite
         * This value is only set with the pointer is over this Sprite.
         * @type {number}
         */
        public y: number = 0;

        /**
        * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
        * @property isDown
        * @type {Boolean}
        **/
        public isDown: bool = false;

        /**
        * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
        * @property isUp
        * @type {Boolean}
        **/
        public isUp: bool = true;

        /**
        * A timestamp representing when the Pointer first touched the touchscreen.
        * @property timeDown
        * @type {Number}
        **/
        public timeOver: number = 0;

        /**
        * A timestamp representing when the Pointer left the touchscreen.
        * @property timeUp
        * @type {Number}
        **/
        public timeOut: number = 0;

        /**
        * Is the Pointer over this Sprite
        * @property isOver
        * @type {Boolean}
        **/
        public isOver: bool = false;

        /**
        * Is the Pointer outside of this Sprite
        * @property isOut
        * @type {Boolean}
        **/
        public isOut: bool = true;

        public oldX: number;
        public oldY: number;


        /**
         * Update
         */
        public update() {

            if (this.enabled == false)
            {
                return;
            }

			if (this.draggable && this.isDragged)
			{
				this.updateDrag();
			}

            if (this.game.input.x != this.oldX || this.game.input.y != this.oldY)
            {
                this.oldX = this.game.input.x;
                this.oldY = this.game.input.y;

                if (RectangleUtils.contains(this._sprite.frameBounds, this.game.input.x, this.game.input.y))
                {
                    this.x = this.game.input.x - this._sprite.x;
                    this.y = this.game.input.y - this._sprite.y;

                    if (this.isOver == false)
                    {
                        this.isOver = true;
                        this.isOut = false;
                        this.timeOver = this.game.time.now;

                        if (this.useHandCursor)
                        {
                            this._sprite.game.stage.canvas.style.cursor = "pointer";
                        }

                        this._sprite.events.onInputOver.dispatch(this._sprite, this.x, this.y, this.timeOver);
                    }
                }
                else
                {
                    if (this.isOver)
                    {
                        this.isOver = false;
                        this.isOut = true;
                        this.timeOut = this.game.time.now;

                        if (this.useHandCursor)
                        {
                            this._sprite.game.stage.canvas.style.cursor = "default";
                        }

                        this._sprite.events.onInputOut.dispatch(this._sprite, this.timeOut);
                    }
                }

            }

            //  click handler to add to stack for sorting

        }

		/**
		 * Updates the Mouse Drag on this Sprite.
		 */
		private updateDrag():void
		{
		    if (this.isUp)
		    {
		        this.stopDrag();
		        return;
		    }

			if (this.allowHorizontalDrag)
			{
			    this._sprite.x = this.game.input.x - this.dragOffsetX;
			}
			
			if (this.allowVerticalDrag)
			{
			    this._sprite.y = this.game.input.y - this.dragOffsetY;
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
		}

        /**
         * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
         * @param delay The time below which the pointer is considered as just over.
         * @returns {boolean}
         */
        public justOver(delay?: number = 500): bool {
            return (this.isOver && this.duration < delay);
        }

        /**
         * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
         * @param delay The time below which the pointer is considered as just out.
         * @returns {boolean}
         */
        public justOut(delay?: number = 500): bool {
            return (this.isOut && (this.game.time.now - this.timeOut < delay));
        }

        /**
         * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
         * @returns {number} The number of milliseconds the pointer has been over the Sprite, or -1 if not over.
         */
        public get duration(): number {

            if (this.isOver)
            {
                return this.game.time.now - this.timeOver;
            }

            return -1;

        }

		/**
		 * Make this Sprite draggable by the mouse. You can also optionally set mouseStartDragCallback and mouseStopDragCallback
		 * 
		 * @param	lockCenter			If false the Sprite will drag from where you click it. If true it will center itself to the tip of the mouse pointer.
		 * @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
		 * @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
		 * @param	boundsRect			If you want to restrict the drag of this sprite to a specific FlxRect, pass the FlxRect here, otherwise it's free to drag anywhere
		 * @param	boundsSprite		If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here
		 */
		public enableDrag(lockCenter:bool = false, pixelPerfect:bool = false, alphaThreshold:number = 255, boundsRect:Rectangle = null, boundsSprite:Sprite = null):void
		{
			this.draggable = true;
			
			this.dragFromPoint = lockCenter;
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
			if (this.isDragged)
			{
				//FlxMouseControl.dragTarget = null;
				//FlxMouseControl.isDragging = false;
			}
			
			this.isDragged = false;
			this.draggable = false;
			
			//mouseStartDragCallback = null;
			//mouseStopDragCallback = null;
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
		 * Called by FlxMouseControl when Mouse Drag starts on this Sprite. Should not usually be called directly.
		 */
		public startDrag():void
		{
			this.isDragged = true;
			
			if (this.dragFromPoint == false)
			{
				this.dragOffsetX = this.game.input.x - this._sprite.x;
				this.dragOffsetY = this.game.input.y - this._sprite.y;
			}
			else
			{
				//	Move the sprite to the middle of the mouse
				this.dragOffsetX = this._sprite.frameBounds.halfWidth;
				this.dragOffsetY = this._sprite.frameBounds.halfHeight;
			}
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
		 * Called by FlxMouseControl when Mouse Drag is stopped on this Sprite. Should not usually be called directly.
		 */
		public stopDrag():void
		{
			this.isDragged = false;
			
			if (this.snapOnRelease)
			{
				this._sprite.x = Math.floor(this._sprite.x / this.snapX) * this.snapX;
				this._sprite.y = Math.floor(this._sprite.y / this.snapY) * this.snapY;
			}
		}

        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this._sprite.texture.context.font = '14px Courier';
            this._sprite.texture.context.fillStyle = color;
            this._sprite.texture.context.fillText('Sprite Input: (' + this._sprite.frameBounds.width + ' x ' + this._sprite.frameBounds.height + ')', x, y);
            this._sprite.texture.context.fillText('x: ' + this.x.toFixed(1) + ' y: ' + this.y.toFixed(1), x, y + 14);
            this._sprite.texture.context.fillText('over: ' + this.isOver + ' duration: ' + this.duration.toFixed(0), x, y + 28);
            this._sprite.texture.context.fillText('just over: ' + this.justOver() + ' just out: ' + this.justOut(), x, y + 42);

        }

    }

}