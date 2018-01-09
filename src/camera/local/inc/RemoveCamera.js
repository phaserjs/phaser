var RemoveCamera = function (camera)
{
    var cameraIndex = this.cameras.indexOf(camera);

    if (cameraIndex >= 0 && this.cameras.length > 1)
    {
        this.cameraPool.push(this.cameras[cameraIndex]);
        this.cameras.splice(cameraIndex, 1);

        if (this.main === camera)
        {
            this.main = this.cameras[0];
        }
    }
};

module.exports = RemoveCamera;
