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

        public renderSprite(camera: Camera, sprite: Sprite): bool {

            //  Render checks (needs inCamera check added)
            if (sprite.scale.x == 0 || sprite.scale.y == 0 || sprite.texture.alpha < 0.1)
            {
                return false;
            }

            return true;

        }

        //  Add Tilemap, ScrollZone, etc?

    }

}