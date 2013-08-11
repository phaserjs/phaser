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
var Phaser;
(function (Phaser) {
    var CameraManager = (function () {
        function CameraManager(game, x, y, width, height) {
            this._cameraInstance = 0;
            this._game = game;
            this._cameras = [];
            this.current = this.addCamera(x, y, width, height);
        }
        CameraManager.prototype.getAll = function () {
            return this._cameras;
        };
        CameraManager.prototype.update = function () {
            this._cameras.forEach(function (camera) {
                return camera.update();
            });
        };
        CameraManager.prototype.render = function () {
            this._cameras.forEach(function (camera) {
                return camera.render();
            });
        };
        CameraManager.prototype.addCamera = function (x, y, width, height) {
            var newCam = new Phaser.Camera(this._game, this._cameraInstance, x, y, width, height);
            this._cameras.push(newCam);
            this._cameraInstance++;
            return newCam;
        };
        CameraManager.prototype.removeCamera = function (id) {
            for(var c = 0; c < this._cameras.length; c++) {
                if(this._cameras[c].ID == id) {
                    if(this.current.ID === this._cameras[c].ID) {
                        this.current = null;
                    }
                    this._cameras.splice(c, 1);
                    return true;
                }
            }
            return false;
        };
        CameraManager.prototype.destroy = function () {
            this._cameras.length = 0;
            this.current = this.addCamera(0, 0, this._game.stage.width, this._game.stage.height);
        };
        return CameraManager;
    })();
    Phaser.CameraManager = CameraManager;    
})(Phaser || (Phaser = {}));
