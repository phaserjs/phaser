//  Called from SceneInputManager.update

var HitTestPointer = function (pointer)
{
    var camera = this.cameras.getCameraBelowPointer(pointer);

    if (camera)
    {
        pointer.camera = camera;

        //  Get a list of all objects that can be seen by the camera below the pointer in the scene and store in 'output' array.
        //  All objects in this array are input enabled, as checked by the hitTest function, so we don't need to check later on as well.
        return this.manager.hitTest(this._list, pointer.x, pointer.y, camera);
    }
    else
    {
        return [];
    }
};

module.exports = HitTestPointer;
