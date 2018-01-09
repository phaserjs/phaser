var PerspectiveCamera = require('../../3d/PerspectiveCamera');

var AddPerspectiveCamera = function (fieldOfView, width, height)
{
    var config = this.scene.sys.game.config;

    if (fieldOfView === undefined) { fieldOfView = 80; }
    if (width === undefined) { width = config.width; }
    if (height === undefined) { height = config.height; }

    var camera = new PerspectiveCamera(this.scene, fieldOfView, width, height);

    return camera;
};

module.exports = AddPerspectiveCamera;
