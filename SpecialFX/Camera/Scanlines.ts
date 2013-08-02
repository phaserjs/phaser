/// <reference path="../../build/phaser.d.ts" />

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

        public postRender(camera: Phaser.Camera) {

            this._game.stage.context.fillStyle = this.color;

            for (var y = camera.screenView.y; y < camera.screenView.height; y += this.spacing)
            {
                this._game.stage.context.fillRect(camera.screenView.x, y, camera.screenView.width, 1);
            }

        }

    }

}
