var BitmapTextWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var blitterBatch = renderer.blitterBatch;
    var cameraMatrix = camera.matrix.matrix;
    var a = cameraMatrix[0];
    var b = cameraMatrix[1];
    var c = cameraMatrix[2];
    var d = cameraMatrix[3];
    var e = cameraMatrix[4];
    var f = cameraMatrix[5];
    var cameraScrollX = camera.scrollX;
    var cameraScrollY = camera.scrollY;
};

module.exports = BitmapTextWebGLRenderer;
