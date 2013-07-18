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
         * The ID of the Group this Sprite belongs to.
         */
        group: Group;

        /**
         * The name of the Game Object. Typically not set by Phaser, but extremely useful for debugging / logic.
         */
        name: string;

        /**
         * x value of the object.
         */
        x: number;

        /**
         * y value of the object.
         */
        y: number;

        /**
         * z-index value of the object.
         */
        z: number;

        /**
         * Controls if both <code>update</code> and render are called by the core game loop.
         */
        exists: bool;

        /**
         * Controls if <code>update()</code> is automatically called by the core game loop.
         */
        active: bool;

        /**
         * Controls if this is rendered or skipped during the core game loop.
         */
        visible: bool;

        /**
         * The animation manager component
         */
        animations: Phaser.Components.AnimationManager;

        /**
         * Associated events
         */
        events;

        /**
         * The input component
         */
        input;

        /**
         * The texture used to render.
         */
        texture: Phaser.Components.Texture;

        /**
         * The transform component.
         */
        transform: Phaser.Components.Transform;

    }

}