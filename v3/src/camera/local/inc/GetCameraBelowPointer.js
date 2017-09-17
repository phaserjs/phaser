var RectangleContains = require('../../../geom/rectangle/Contains');

var GetCameraBelowPointer = function (pointer)
{
    var cameras = this.cameras;

    //  Start from the most recently added camera (the 'top' camera)
    for (var i = cameras.length - 1; i >= 0; i--)
    {
        var camera = cameras[i];

        if (camera.inputEnabled && RectangleContains(camera, pointer.x, pointer.y))
        {
            return camera;
        }
    }
};

module.exports = GetCameraBelowPointer;
