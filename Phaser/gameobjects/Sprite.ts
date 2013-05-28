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

    export class Sprite {

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

            this.scrollFactor = new Phaser.Vec2(1, 1);
            this.scale = new Phaser.Vec2(1, 1);

            this.position = new Phaser.Components.Position(this, x, y);
            this.texture = new Phaser.Components.Texture(this, key, game.stage.canvas, game.stage.context);

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

        public scale: Phaser.Vec2;
        public scrollFactor: Phaser.Vec2;

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

    }

}