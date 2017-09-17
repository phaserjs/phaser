var AddExisting = function (camera)
{
    var index = this.cameras.indexOf(camera);
    var poolIndex = this.cameraPool.indexOf(camera);

    if (index < 0 && poolIndex >= 0)
    {
        this.cameras.push(camera);
        this.cameraPool.slice(poolIndex, 1);
        return camera;
    }
    
    return null;
};

module.exports = AddExisting;
