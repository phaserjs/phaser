var GetCamera = function (name)
{
    this.cameras.forEach(function (camera)
    {
        if (camera.name === name)
        {
            return camera;
        }
    });

    return null;
};

module.exports = GetCamera;
