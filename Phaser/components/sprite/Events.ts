/// <reference path="../../Game.ts" />

/**
* Phaser - Components - Events
*
* Signals that are dispatched by the Sprite and its various components
*/

module Phaser.Components.Sprite {

    export class Events {

        /**
         * The Events component is a collection of events fired by the parent Sprite and its other components.
         * @param parent The Sprite using this Input component
         */
        constructor(parent: Phaser.Sprite) {

            this.game = parent.game;
            this.sprite = parent;

            this.onAddedToGroup = new Phaser.Signal;
            this.onRemovedFromGroup = new Phaser.Signal;
            this.onKilled = new Phaser.Signal;
            this.onRevived = new Phaser.Signal;

            //  Only create these if Sprite input is enabled?
            this.onInputOver = new Phaser.Signal;
            this.onInputOut = new Phaser.Signal;
            this.onInputDown = new Phaser.Signal;
            this.onInputUp = new Phaser.Signal;
            this.onDragStart = new Phaser.Signal;
            this.onDragStop = new Phaser.Signal;

        }

        /**
         * Reference to Phaser.Game
         */
        public game: Game;

        /**
         * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
         */
        private sprite: Phaser.Sprite;

        /**
         * Dispatched by the Group this Sprite is added to.
         */
        public onAddedToGroup: Phaser.Signal;

        /**
         * Dispatched by the Group this Sprite is removed from.
         */
        public onRemovedFromGroup: Phaser.Signal;

        /**
         * Dispatched when this Sprite is killed.
         */
        public onKilled: Phaser.Signal;

        /**
         * Dispatched when this Sprite is revived.
         */
        public onRevived: Phaser.Signal;

        /**
         * Dispatched by the Input component when a pointer moves over an Input enabled sprite.
         */
        public onInputOver: Phaser.Signal;

        /**
         * Dispatched by the Input component when a pointer moves out of an Input enabled sprite.
         */
        public onInputOut: Phaser.Signal;

        /**
         * Dispatched by the Input component when a pointer is pressed down on an Input enabled sprite.
         */
        public onInputDown: Phaser.Signal;

        /**
         * Dispatched by the Input component when a pointer is released over an Input enabled sprite
         */
        public onInputUp: Phaser.Signal;

        /**
         * Dispatched by the Input component when the Sprite starts being dragged
         */
        public onDragStart: Phaser.Signal;

        /**
         * Dispatched by the Input component when the Sprite stops being dragged
         */
        public onDragStop: Phaser.Signal;



        public onOutOfBounds: Phaser.Signal;

    }

}