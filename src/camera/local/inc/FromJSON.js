var GetFastValue = require('../../../utils/object/GetFastValue');

/*
{
    cameras: [
        {
            name: string
            x: int
            y: int
            width: int
            height: int
            zoom: float
            rotation: float
            roundPixels: bool
            scrollX: float
            scrollY: float
            backgroundColor: string
            bounds: {
                x: int
                y: int
                width: int
                height: int
            }
        }
    ]
}
*/

var FromJSON = function (config)
{
    if (!Array.isArray(config))
    {
        config = [ config ];
    }

    var gameWidth = this.scene.sys.game.config.width;
    var gameHeight = this.scene.sys.game.config.height;

    for (var i = 0; i < config.length; i++)
    {
        var cameraConfig = config[i];

        var x = GetFastValue(cameraConfig, 'x', 0);
        var y = GetFastValue(cameraConfig, 'y', 0);
        var width = GetFastValue(cameraConfig, 'width', gameWidth);
        var height = GetFastValue(cameraConfig, 'height', gameHeight);

        var camera = this.add(x, y, width, height);

        //  Direct properties
        camera.name = GetFastValue(cameraConfig, 'name', '');
        camera.zoom = GetFastValue(cameraConfig, 'zoom', 1);
        camera.rotation = GetFastValue(cameraConfig, 'rotation', 0);
        camera.scrollX = GetFastValue(cameraConfig, 'scrollX', 0);
        camera.scrollY = GetFastValue(cameraConfig, 'scrollY', 0);
        camera.roundPixels = GetFastValue(cameraConfig, 'roundPixels', false);

        // Background Color

        var backgroundColor = GetFastValue(cameraConfig, 'backgroundColor', false);

        if (backgroundColor)
        {
            camera.setBackgroundColor(backgroundColor);
        }

        //  Bounds

        var boundsConfig = GetFastValue(cameraConfig, 'bounds', null);

        if (boundsConfig)
        {
            var bx = GetFastValue(boundsConfig, 'x', 0);
            var by = GetFastValue(boundsConfig, 'y', 0);
            var bwidth = GetFastValue(boundsConfig, 'width', gameWidth);
            var bheight = GetFastValue(boundsConfig, 'height', gameHeight);

            camera.setBounds(bx, by, bwidth, bheight);
        }
    }

    return this;
};

module.exports = FromJSON;
