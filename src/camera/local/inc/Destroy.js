var Destroy = function ()
{
    this.main = undefined;

    for (var i = 0; i < this.cameras.length; i++)
    {
        this.cameras[i].destroy();
    }

    for (i = 0; i < this.cameraPool.length; i++)
    {
        this.cameraPool[i].destroy();
    }

    this.cameras = [];
    this.cameraPool = [];
    this.scene = undefined;
};

module.exports = Destroy;
