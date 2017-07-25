var HitTestPointer = function (pointer)
{
    var output = [];

    //  Get a list of all objects that can be seen by all the cameras in the scene and store in 'output' array.
    //  All objects in this array are input enabled, as checked by the hitTest function, so we don't need to check later on as well.
    for (var i = 0; i < this.cameras.length; i++)
    {
        var camera = this.cameras[i];

        if (camera.inputEnabled)
        {
            output = output.concat(this.manager.hitTest(this._list, pointer.x, pointer.y, camera));
        }
    }

    return output;
};

module.exports = HitTestPointer;
