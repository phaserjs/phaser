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

        /**
         * If enabled the Input component will be updated by the parent Sprite
         * @type {Boolean}
         */
        public enabled: bool;

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

        }

        /**
         * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
         * @param delay The time below which the pointer is considered as just over.
         * @returns {boolean}
         */
        public justOver(delay?:number = 500): bool {
            return (this.isOver && this.duration < delay);
        }

        /**
         * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
         * @param delay The time below which the pointer is considered as just out.
         * @returns {boolean}
         */
        public justOut(delay?:number = 500): bool {
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