/// <reference path="../Game.ts" />
/// <reference path="../core/Rectangle.ts" />
/// <reference path="../components/animation/AnimationManager.ts" />
/// <reference path="../components/sprite/Position.ts" />
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
            this.origin = new Phaser.Vec2(0, 0);
            this.scrollFactor = new Phaser.Vec2(1, 1);
            this.scale = new Phaser.Vec2(1, 1);

            this.position = new Phaser.Components.Position(this, x, y);
            this.texture = new Phaser.Components.Texture(this, key, game.stage.canvas, game.stage.context);

            this.width = this.frameBounds.width;
            this.height = this.frameBounds.height;
            this.rotation = this.position.rotation;

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
         * The position of the Sprite in world and screen coordinates.
         */
        public position: Phaser.Components.Position;

        /**
         * The texture used to render the Sprite.
         */
        public texture: Phaser.Components.Texture;

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
         * The influence of camera movement upon the Sprite.
         */
        public scrollFactor: Phaser.Vec2;

        /**
         * The Sprite origin is the point around which scale and rotation transforms take place.
         */
        public origin: Phaser.Vec2;

        /**
         * Pre-update is called right before update() on each object in the game loop.
         */
        public preUpdate() {

            //this.last.x = this.frameBounds.x;
            //this.last.y = this.frameBounds.y;

            //this.collisionMask.preUpdate();

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

            /*
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
            */

        }

        /**
         * Clean up memory.
         */
        public destroy() {
        }

        /**
         * x value of the object.
         */
        public get x(): number {
            return this.position.world.x;
        }

        public set x(value: number) {
            this.position.world.x = value;
        }

        /**
         * y value of the object.
         */
        public get y(): number {
            return this.position.world.y;
        }

        public set y(value: number) {
            this.position.world.y = value;
        }

        /**
         * z value of the object.
         */
        public get z(): number {
            return this.position.z;
        }

        public set z(value: number) {
            this.position.z = value;
        }

        /**
         * rotation value of the object.
         */
        public get rotation(): number {
            return this.position.rotation;
        }

        public set rotation(value: number) {
            this.position.rotation = value;
        }

    }

}