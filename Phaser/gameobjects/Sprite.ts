/// <reference path="../Game.ts" />
/// <reference path="../core/Vec2.ts" />
/// <reference path="../core/Rectangle.ts" />
/// <reference path="../components/animation/AnimationManager.ts" />
/// <reference path="../components/sprite/Texture.ts" />

/**
* Phaser - Sprite
*
*/

module Phaser {

    export class Sprite implements IGameObject {

        /**
         * Create a new <code>Sprite</code>.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param [x] {number} the initial x position of the sprite.
         * @param [y] {number} the initial y position of the sprite.
         * @param [key] {string} Key of the graphic you want to load for this sprite.
         * @param [width] {number} The width of the object.
         * @param [height] {number} The height of the object.
         */
        constructor(game: Game, x?: number = 0, y?: number = 0, key?: string = null, width?: number = 16, height?: number = 16) {

            this.game = game;
            this.type = Phaser.Types.SPRITE;
            this.render = game.renderer.renderSprite;

            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;

            this.frameBounds = new Rectangle(x, y, width, height);
            this.scrollFactor = new Phaser.Vec2(1, 1);

            this.x = x;
            this.y = y;
            this.z = 0; // not used yet

            this.animations = new Phaser.Components.AnimationManager(this);
            this.texture = new Phaser.Components.Texture(this, key);

            this.width = this.frameBounds.width;
            this.height = this.frameBounds.height;

            //  Transform related (if we add any more then move to a component)
            this.origin = new Phaser.Vec2(this.width / 2, this.height / 2);
            this.scale = new Phaser.Vec2(1, 1);
            this.skew = new Phaser.Vec2(0, 0);

        }

        /**
          * Rotation angle of this object.
          * @type {number}
          */
        private _rotation: number = 0;

        /**
         * Reference to the main game object
         */
        public game: Game;

        /**
         * The type of game object.
         */
        public type: number;

        /**
         * Reference to the Renderer.renderSprite method. Can be overriden by custom classes.
         */
        public render;

        /**
         * Controls if both <code>update</code> and render are called by the core game loop.
         */
        public exists: bool;

        /**
         * Controls if <code>update()</code> is automatically called by the core game loop.
         */
        public active: bool;

        /**
         * Controls if this Sprite is rendered or skipped during the core game loop.
         */
        public visible: bool;

        /**
         * 
         */
        public alive: bool;

        //  Getters only, don't over-write these values
        public width: number;
        public height: number;

        /**
         * The texture used to render the Sprite.
         */
        public texture: Phaser.Components.Texture;

        /**
         * This manages animations of the sprite. You can modify animations though it. (see AnimationManager)
         * @type AnimationManager
         */
        public animations: Phaser.Components.AnimationManager;

        /**
         * The frame boundary around this Sprite.
         * For non-animated sprites this matches the loaded texture dimensions.
         * For animated sprites it will be updated as part of the animation loop, changing to the dimensions of the current animation frame.
         */
        public frameBounds: Phaser.Rectangle;

        /**
         * Scale of the Sprite. A scale of 1.0 is the original size. 0.5 half size. 2.0 double sized.
         */
        public scale: Phaser.Vec2;

        /**
         * Skew the Sprite along the x and y axis. A skew value of 0 is no skew.
         */
        public skew: Phaser.Vec2;

        /**
         * A boolean representing if the Sprite has been modified in any way via a scale, rotate, flip or skew.
         */
        public modified: bool = false;

        /**
         * The influence of camera movement upon the Sprite.
         */
        public scrollFactor: Phaser.Vec2;

        /**
         * The Sprite origin is the point around which scale and rotation takes place.
         */
        public origin: Phaser.Vec2;

        /**
         * x value of the object.
         */
        public x: number = 0;

        /**
         * y value of the object.
         */
        public y: number = 0;

        /**
         * z order value of the object.
         */
        public z: number = 0;

        /**
         * This value is added to the rotation of the Sprite.
         * For example if you had a sprite graphic drawn facing straight up then you could set
         * rotationOffset to 90 and it would correspond correctly with Phasers right-handed coordinate system.
         * @type {number}
         */
        public rotationOffset: number = 0;

        /**
        * The rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        */
        public get rotation(): number {
            return this._rotation;
        }

        /**
        * Set the rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        * The value is automatically wrapped to be between 0 and 360.
        */
        public set rotation(value: number) {
            this._rotation = this.game.math.wrap(value, 360, 0);
        }

        /**
        * Set the animation frame by frame number.
        */
        public set frame(value: number) {
            this.animations.frame = value;
        }

        /**
        * Get the animation frame number.
        */
        public get frame(): number {
            return this.animations.frame;
        }

        /**
        * Set the animation frame by frame name.
        */
        public set frameName(value: string) {
            this.animations.frameName = value;
        }

        /**
        * Get the animation frame name.
        */
        public get frameName(): string {
            return this.animations.frameName;
        }

        /**
         * Pre-update is called right before update() on each object in the game loop.
         */
        public preUpdate() {

            //this.last.x = this.frameBounds.x;
            //this.last.y = this.frameBounds.y;

            //this.collisionMask.preUpdate();

            if (this.modified == false && (!this.scale.equals(1) || !this.skew.equals(0) || this.rotation != 0 || this.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY))
            {
                this.modified = true;
            }

        }

        /**
         * Override this function to update your class's position and appearance.
         */
        public update() {
        }

        /**
         * Automatically called after update() by the game loop.
         */
        public postUpdate() {

            this.animations.update();

            /*
            if (this.moves)
            {
                this.updateMotion();
            }

            if (this.worldBounds != null)
            {
                if (this.outOfBoundsAction == GameObject.OUT_OF_BOUNDS_KILL)
                {
                    if (this.x < this.worldBounds.x || this.x > this.worldBounds.right || this.y < this.worldBounds.y || this.y > this.worldBounds.bottom)
                    {
                        this.kill();
                    }
                }
                else
                {
                    if (this.x < this.worldBounds.x)
                    {
                        this.x = this.worldBounds.x;
                    }
                    else if (this.x > this.worldBounds.right)
                    {
                        this.x = this.worldBounds.right;
                    }

                    if (this.y < this.worldBounds.y)
                    {
                        this.y = this.worldBounds.y;
                    }
                    else if (this.y > this.worldBounds.bottom)
                    {
                        this.y = this.worldBounds.bottom;
                    }
                }
            }
                
            this.collisionMask.update();

            if (this.inputEnabled)
            {
                this.updateInput();
            }

            this.wasTouching = this.touching;
            this.touching = Collision.NONE;
            */

            if (this.modified == true && this.scale.equals(1) && this.skew.equals(0) && this.rotation == 0 && this.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false)
            {
                this.modified = false;
            }

        }

        /**
         * Clean up memory.
         */
        public destroy() {
        }

    }

}