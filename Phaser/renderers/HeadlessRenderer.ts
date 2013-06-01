/// <reference path="../Game.ts" />
/// <reference path="../cameras/Camera.ts" />
/// <reference path="IRenderer.ts" />

module Phaser {

    export class HeadlessRenderer implements Phaser.IRenderer {

        constructor(game: Phaser.Game) {
            this._game = game;
        }

        /**
         * The essential reference to the main game object
         */
        private _game: Phaser.Game;

        public render() {}

        public renderGameObject(object) {
        }

        public renderSprite(camera: Camera, sprite: Sprite): bool {
            return true;
        }

        public renderScrollZone(camera: Camera, scrollZone: ScrollZone): bool {
            return true;
        }

    }

}