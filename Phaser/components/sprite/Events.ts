/// <reference path="../../Game.ts" />
/// <reference path="../../gameobjects/DynamicTexture.ts" />
/// <reference path="../../utils/SpriteUtils.ts" />

/**
* Phaser - Components - Events
*
* 
*/

module Phaser.Components {

    export class Events {

        constructor(parent: Sprite, key?: string = '') {

            this._game = parent.game;
            this._sprite = parent;

        }

        /**
         * 
         */
        private _game: Game;

        /**
         * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
         */
        private _sprite: Sprite;

        public onInputOver: Phaser.Signal;
        public onInputOut: Phaser.Signal;
        public onInputDown: Phaser.Signal;
        public onInputUp: Phaser.Signal;

    }

}