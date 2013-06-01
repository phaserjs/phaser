/// <reference path="../../Game.ts" />

/**
* Phaser - Components - Events
*
* Signals that are dispatched by the Sprite and its various components
*/

module Phaser.Components {

    export class Events {

        /**
         * The Events component is a collection of events fired by the parent Sprite and its other components.
         * @param parent The Sprite using this Input component
         */
        constructor(parent: Sprite) {

            this.game = parent.game;
            this._sprite = parent;

            this.onInputOver = new Phaser.Signal;
            this.onInputOut = new Phaser.Signal;
            this.onInputDown = new Phaser.Signal;
            this.onInputUp = new Phaser.Signal;

        }

        /**
         * Reference to Phaser.Game
         */
        public game: Game;

        /**
         * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
         */
        private _sprite: Sprite;

        //  Creation and destruction
        public onAdded: Phaser.Signal;
        public onKilled: Phaser.Signal;
        public onRevived: Phaser.Signal;

        public onOutOfBounds: Phaser.Signal;

        //  Input related events

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

    }

}