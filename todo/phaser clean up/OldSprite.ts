/// <reference path="../Game.ts" />
/// <reference path="../AnimationManager.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="../system/Camera.ts" />

/**
* Phaser - Sprite
*
* The Sprite GameObject is an extension of the core GameObject that includes support for animation and dynamic textures.
* It's probably the most used GameObject of all.
*/

module Phaser {

    export class OldSprite {

        /**
         * Sprite constructor
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

            this.canvas = game.stage.canvas;
            this.context = game.stage.context;

            this.frameBounds = new Rectangle(x, y, width, height);
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.isGroup = false;
            this.alpha = 1;
            this.scale = new MicroPoint(1, 1);

            this.last = new MicroPoint(x, y);
            this.align = GameObject.ALIGN_TOP_LEFT;
            this.mass = 1;
            this.elasticity = 0;
            this.health = 1;
            this.immovable = false;
            this.moves = true;
            this.worldBounds = null;

            this.touching = Collision.NONE;
            this.wasTouching = Collision.NONE;
            this.allowCollisions = Collision.ANY;

            this.velocity = new MicroPoint();
            this.acceleration = new MicroPoint();
            this.drag = new MicroPoint();
            this.maxVelocity = new MicroPoint(10000, 10000);

            this.angle = 0;
            this.angularVelocity = 0;
            this.angularAcceleration = 0;
            this.angularDrag = 0;
            this.maxAngular = 10000;

            this.cameraBlacklist = [];
            this.scrollFactor = new MicroPoint(1, 1);
            this.collisionMask = new CollisionMask(game, this, x, y, width, height);


            this._texture = null;

            this.animations = new AnimationManager(this._game, this);

            if (key !== null)
            {
                this.cacheKey = key;
                this.loadGraphic(key);
            }
            else
            {
                this.frameBounds.width = 16;
                this.frameBounds.height = 16;
            }

        }

        /**
         * The essential reference to the main game object
         */
        public _game: Game;

        /**
         * Controls whether <code>update()</code> is automatically called by State/Group.
         */
        public active: bool;

        /**
         * Controls whether <code>draw()</code> is automatically called by State/Group.
         */
        public visible: bool;

        /**
         * Setting this to true will prevent the object from being updated during the main game loop (you will have to call update on it yourself)
         */
        public ignoreGlobalUpdate: bool;

        /**
         * Setting this to true will prevent the object from being rendered during the main game loop (you will have to call render on it yourself)
         */
        public ignoreGlobalRender: bool;

        /**
         * An Array of Cameras to which this GameObject won't render
         * @type {Array}
         */
        public cameraBlacklist: number[];

        /**
         * Orientation of the object.
         * @type {number}
         */
        public facing: number;

        /**
         * Set alpha to a number between 0 and 1 to change the opacity.
         * @type {number}
         */
        public alpha: number;

        /**
         * Scale factor of the object.
         * @type {MicroPoint}
         */
        public scale: MicroPoint;

        /**
         * Controls if the GameObject is rendered rotated or not.
        * If renderRotation is false then the object can still rotate but it will never be rendered rotated.
         * @type {boolean}
         */
        public renderRotation: bool = true;

        /**
         * A point that can store numbers from 0 to 1 (for X and Y independently)
         * which governs how much this object is affected by the camera .
         * @type {MicroPoint}
         */
        public scrollFactor: MicroPoint;

        /**
         * Rectangle container of this object.
         * @type {Rectangle}
         */
        public frameBounds: Rectangle;

        /**
         * This objects CollisionMask
         * @type {CollisionMask}
         */
        public collisionMask: CollisionMask;

        /**
         * A rectangular area which is object is allowed to exist within. If it travels outside of this area it will perform the outOfBoundsAction.
         * @type {Quad}
         */
        public worldBounds: Quad;

        /**
        * A reference to the Canvas this GameObject will render to
        * @type {HTMLCanvasElement}
        */
        public canvas: HTMLCanvasElement;

        /**
        * A reference to the Canvas Context2D this GameObject will render to
        * @type {CanvasRenderingContext2D}
        */
        public context: CanvasRenderingContext2D;

        /**
         * Texture of this sprite to be rendered.
         */
        private _texture;

        /**
         * Texture of this sprite is DynamicTexture? (default to false)
         * @type {boolean}
         */
        private _dynamicTexture: bool = false;


        /**
         * This manages animations of the sprite. You can modify animations though it. (see AnimationManager)
         * @type AnimationManager
         */
        public animations: AnimationManager;

        /**
         * The cache key that was used for this texture (if any)
         */
        public cacheKey: string;


        /**
         * Flip the graphic horizontally? (defaults to false)
         * @type {boolean}
         */
        public flipped: bool = false;



        /**
         * Pre-update is called right before update() on each object in the game loop.
         */
        public preUpdate() {

            this.last.x = this.frameBounds.x;
            this.last.y = this.frameBounds.y;

            this.collisionMask.preUpdate();

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

        }

        /**
         * Clean up memory.
         */
        public destroy() {
        }

        public set width(value:number) {
            this.frameBounds.width = value;
        }

        public set height(value:number) {
            this.frameBounds.height = value;
        }

        public get width(): number {
            return this.frameBounds.width;
        }

        public get height(): number {
            return this.frameBounds.height;
        }

        public set frame(value: number) {
            this.animations.frame = value;
        }

        public get frame(): number {
            return this.animations.frame;
        }

        public set frameName(value: string) {
            this.animations.frameName = value;
        }

        public get frameName(): string {
            return this.animations.frameName;
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

        /**
         * Convert object to readable string name.  Useful for debugging, save games, etc.
         */
        public toString(): string {
            return "";
        }


    }

}