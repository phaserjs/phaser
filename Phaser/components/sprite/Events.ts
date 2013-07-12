/// <reference path="../../Game.ts" />

/**
* Phaser - Components - Events
*
* Signals that are dispatched by the Sprite and its various components
*/

module Phaser.Components.Sprite {

    export class Events {

        /**
         * The Events component is a collection of events fired by the parent game object and its components.
         * @param parent The game object using this Input component
         */
        constructor(parent: Phaser.Sprite) {

            this.game = parent.game;
            this._parent = parent;

            this.onAddedToGroup = new Phaser.Signal;
            this.onRemovedFromGroup = new Phaser.Signal;
            this.onKilled = new Phaser.Signal;
            this.onRevived = new Phaser.Signal;

        }

        /**
         * Reference to Phaser.Game
         */
        public game: Game;

        /**
         * Local private reference to its parent game object.
         */
        private _parent: Phaser.Sprite;

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

        /**
         * Dispatched by the Animation component when the Sprite starts being animated
         */
        public onAnimationStart: Phaser.Signal;

        /**
         * Dispatched by the Animation component when the Sprite animation completes
         */
        public onAnimationComplete: Phaser.Signal;

        /**
         * Dispatched by the Animation component when the Sprite animation loops
         */
        public onAnimationLoop: Phaser.Signal;

        public onOutOfBounds: Phaser.Signal;

    }

}