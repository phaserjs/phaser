var CameraToWorld = function (pointIn, pointOut)
{
    var cameraMatrix = this.matrix.matrix;
    var mva = cameraMatrix[0];
    var mvb = cameraMatrix[1];
    var mvc = cameraMatrix[2];
    var mvd = cameraMatrix[3];
    var mve = cameraMatrix[4];
    var mvf = cameraMatrix[5];
    
    /* First Invert Matrix */
    var determinant = (mva * mvd) - (mvb * mvc);

    if (!determinant)
    {
        return pointIn;
    }

    determinant = 1 / determinant;

    var ima = mvd * determinant;
    var imb = -mvb * determinant;
    var imc = -mvc * determinant;
    var imd = mva * determinant;
    var ime = (mvc * mvf - mvd * mve) * determinant;
    var imf = (mvb * mve - mva * mvf) * determinant;
    var c = Math.cos(this.rotation);
    var s = Math.sin(this.rotation);
    var zoom = this.zoom;
    var scrollX = this.scrollX;
    var scrollY = this.scrollY;
    var x = pointIn.x + ((scrollX * c - scrollY * s) * zoom);
    var y = pointIn.y + ((scrollX * s + scrollY * c) * zoom);

    if (!pointOut)
    {
        pointOut = { x: 0, y: 0 };
    }

    /* Apply transform to point */
    pointOut.x = (x * ima + y * imc + ime);
    pointOut.y = (x * imb + y * imd + imf);
    
    return pointOut;
};

module.exports = CameraToWorld;
