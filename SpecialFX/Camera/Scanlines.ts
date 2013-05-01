/// <reference path="../../Phaser/Game.d.ts" />
/// <reference path="../../Phaser/system/Camera.d.ts" />
/// <reference path="../../Phaser/FXManager.d.ts" />

/**
* Phaser - FX - Camera - Scanlines
*
* Give your game that classic retro feel!
*/

module Phaser.FX.Camera {

    export class Scanlines {

        constructor(game: Game, parent: Camera) {

            this._game = game;
            this._parent = parent;

        }

        private _game: Game;
        private _parent: Camera;

        public spacing: number = 4;
        public color: string = 'rgba(0, 0, 0, 0.3)';

        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {

            this._game.stage.context.fillStyle = this.color;

            for (var y = cameraY; y < cameraHeight; y += this.spacing)
            {
                this._game.stage.context.fillRect(cameraX, y, cameraWidth, 1);
            }

        }

    }

}
