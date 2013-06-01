/// <reference path="../Game.ts" />
/// <reference path="../core/Vec2.ts" />
/// <reference path="../core/Rectangle.ts" />
/// <reference path="../components/animation/AnimationManager.ts" />
/// <reference path="../components/sprite/Texture.ts" />
/// <reference path="../components/sprite/Input.ts" />
/// <reference path="../components/sprite/Events.ts" />
/// <reference path="../physics/Body.ts" />

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
         * @param [bodyType] {number} The physics body type of the object (defaults to BODY_DISABLED)
         */
        constructor(game: Game, x?: number = 0, y?: number = 0, key?: string = null, bodyType?: number = Phaser.Types.BODY_DISABLED) {

            this.game = game;
            this.type = Phaser.Types.SPRITE;

            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;

            //  We give it a default size of 16x16 but when the texture loads (if given) it will reset this
            this.frameBounds = new Rectangle(x, y, 16, 16);
            this.scrollFactor = new Phaser.Vec2(1, 1);

            this.x = x;
            this.y = y;
            this.z = 0; // not used yet

            //  If a texture has been given the body will be set to that size, otherwise 16x16
            this.body = new Phaser.Physics.Body(this, bodyType);

            this.animations = new Phaser.Components.AnimationManager(this);
            this.texture = new Phaser.Components.Texture(this, key);
            this.input = new Phaser.Components.Input(this);
            this.events = new Phaser.Components.Events(this);

            this.cameraBlacklist = [];

            //  Transform related (if we add any more then move to a component)
            this.origin = new Phaser.Vec2(0, 0);
            this.scale = new Phaser.Vec2(1, 1);
            this.skew = new Phaser.Vec2(0, 0);
        }

        /**
         * Reference to the main game object
         */
        public game: Game;

        /**
         * The type of game object.
         */
        public type: number;

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

        /**
         * Sprite physics body.
         */
        public body: Phaser.Physics.Body;

        /**
         * The texture used to render the Sprite.
         */
        public texture: Phaser.Components.Texture;

        /**
         * The Input component
         */
        public input: Phaser.Components.Input;

        /**
         * The Events component
         */
        public events: Phaser.Components.Events;

        /**
         * This manages animations of the sprite. You can modify animations though it. (see AnimationManager)
         * @type AnimationManager
         */
        public animations: Phaser.Components.AnimationManager;

        /**
         * An Array of Cameras to which this GameObject won't render
         * @type {Array}
         */
        public cameraBlacklist: number[];

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
         * This value is added to the angle of the Sprite.
         * For example if you had a sprite graphic drawn facing straight up then you could set
         * angleOffset to 90 and it would correspond correctly with Phasers right-handed coordinate system.
         * @type {number}
         */
        public angleOffset: number = 0;

        /**
        * The angle of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        */
        public get angle(): number {
            return this.body.angle;
        }

        /**
        * Set the angle of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        * The value is automatically wrapped to be between 0 and 360.
        */
        public set angle(value: number) {
            this.body.angle = this.game.math.wrap(value, 360, 0);
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

        public set width(value: number) {
            this.frameBounds.width = value;
        }

        public get width(): number {
            return this.frameBounds.width;
        }

        public set height(value: number) {
            this.frameBounds.height = value;
        }

        public get height(): number {
            return this.frameBounds.height;
        }

        /**
         * Pre-update is called right before update() on each object in the game loop.
         */
        public preUpdate() {

            this.frameBounds.x = this.x;
            this.frameBounds.y = this.y;

            if (this.modified == false && (!this.scale.equals(1) || !this.skew.equals(0) || this.angle != 0 || this.angleOffset != 0 || this.texture.flippedX || this.texture.flippedY))
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
            this.body.postUpdate();

            /*
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
            */

            this.input.update();

            if (this.modified == true && this.scale.equals(1) && this.skew.equals(0) && this.angle == 0 && this.angleOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false)
            {
                this.modified = false;
            }

        }

        /**
         * Clean up memory.
         */
        public destroy() {
        }

        /**
         * Handy for "killing" game objects.
         * Default behavior is to flag them as nonexistent AND dead.
         * However, if you want the "corpse" to remain in the game,
         * like to animate an effect or whatever, you should override this,
         * setting only alive to false, and leaving exists true.
         */
        public kill() {
            this.alive = false;
            this.exists = false;
        }

        /**
         * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
         * In practice, this is most often called by <code>Object.reset()</code>.
         */
        public revive() {
            this.alive = true;
            this.exists = true;
        }

    }

}