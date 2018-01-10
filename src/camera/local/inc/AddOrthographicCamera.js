var OrthographicCamera = require('../../3d/OrthographicCamera');

var AddOrthographicCamera = function (width, height)
{
    var config = this.scene.sys.game.config;

    if (width === undefined) { width = config.width; }
    if (height === undefined) { height = config.height; }

    var camera = new OrthographicCamera(this.scene, width, height);

    return camera;
};

module.exports = AddOrthographicCamera;
