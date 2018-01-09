var Camera = require('../../2d/Camera');

var Add2DCamera = function (x, y, width, height, makeMain, name)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (width === undefined) { width = this.scene.sys.game.config.width; }
    if (height === undefined) { height = this.scene.sys.game.config.height; }
    if (makeMain === undefined) { makeMain = false; }
    if (name === undefined) { name = ''; }

    var camera = null;

    if (this.cameraPool.length > 0)
    {
        camera = this.cameraPool.pop();

        camera.setViewport(x, y, width, height);
    }
    else
    {
        camera = new Camera(x, y, width, height);
    }

    camera.setName(name);
    camera.setScene(this.scene);

    this.cameras.push(camera);

    if (makeMain)
    {
        this.main = camera;
    }

    camera._id = this.currentCameraId;

    this.currentCameraId = this.currentCameraId << 1;

    return camera;
};

module.exports = Add2DCamera;
