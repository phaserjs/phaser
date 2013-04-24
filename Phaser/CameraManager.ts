/// <reference path="Game.ts" />
/// <reference path="system/Camera.ts" />

/**
* Phaser - CameraManager
*
* Your game only has one CameraManager instance and it's responsible for looking after, creating and destroying
* all of the cameras in the world.
*
* TODO: If the Camera is larger than the Stage size then the rotation offset isn't correct
* TODO: Texture Repeat doesn't scroll, because it's part of the camera not the world, need to think about this more
*/

module Phaser {

    export class CameraManager {

        constructor(game: Game, x: number, y: number, width: number, height: number) {

            this._game = game;

            this._cameras = [];

            this.current = this.addCamera(x, y, width, height);

        }

        private _game: Game;
        private _cameras: Camera[];
        private _cameraInstance: number = 0;

        public current: Camera;

        public getAll(): Camera[] {
            return this._cameras;
        }

        public update() {
            this._cameras.forEach((camera) => camera.update());
        }

        public render() {
            this._cameras.forEach((camera) => camera.render());
        }

        public addCamera(x: number, y: number, width: number, height: number): Camera {

            var newCam: Camera = new Camera(this._game, this._cameraInstance, x, y, width, height);

            this._cameras.push(newCam);

            this._cameraInstance++;

            return newCam;

        }

        public removeCamera(id: number): bool {

            for (var c = 0; c < this._cameras.length; c++)
            {
                if (this._cameras[c].ID == id)
                {
                    if (this.current.ID === this._cameras[c].ID)
                    {
                        this.current = null;
                    }

                    this._cameras.splice(c, 1);

                    return true;
                }
            }

            return false;

        }

        public destroy() {

            this._cameras.length = 0;

            this.current = this.addCamera(0, 0, this._game.stage.width, this._game.stage.height);

        }

    }

}