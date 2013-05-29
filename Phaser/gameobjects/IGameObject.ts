/// <reference path="../Game.ts" />

module Phaser {

    export interface IGameObject {

        /**
         * Reference to the main game object
         */
        game: Game;

        /**
         * The type of game object.
         */
        type: number;

        /**
         * Reference to the Renderer.renderSprite method. Can be overriden by custom classes.
         */
        render;

        /**
         * Controls if both <code>update</code> and render are called by the core game loop.
         */
        exists: bool;

        /**
         * Controls if <code>update()</code> is automatically called by the core game loop.
         */
        active: bool;

        /**
         * Controls if this Sprite is rendered or skipped during the core game loop.
         */
        visible: bool;

        /**
         * The position of the Sprite in world and screen coordinates.
         */
        position: Phaser.Components.Position;

        /**
         * The texture used to render the Sprite.
         */
        texture: Phaser.Components.Texture;

        /**
         * Scale of the Sprite. A scale of 1.0 is the original size. 0.5 half size. 2.0 double sized.
         */
        scale: Phaser.Vec2;

        /**
         * The influence of camera movement upon the Sprite.
         */
        scrollFactor: Phaser.Vec2;

    }

}