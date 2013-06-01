/// <reference path="../../Game.ts" />

/**
* Phaser - Components - Events
*
* Signals that are dispatched by the Sprite and its various components
*/

module Phaser.Components {

    export class Events {

        constructor(parent: Sprite) {

            this.game = parent.game;
            this._sprite = parent;

            this.onInputOver = new Phaser.Signal;
            this.onInputOut = new Phaser.Signal;
            this.onInputDown = new Phaser.Signal;
            this.onInputUp = new Phaser.Signal;

        }

        public game: Game;
        private _sprite: Sprite;

        //  Creation and destruction
        public onAdded: Phaser.Signal;
        public onKilled: Phaser.Signal;
        public onRevived: Phaser.Signal;

        public onOutOfBounds: Phaser.Signal;

        //  Input related events
        public onInputOver: Phaser.Signal;
        public onInputOut: Phaser.Signal;
        public onInputDown: Phaser.Signal;
        public onInputUp: Phaser.Signal;

    }

}