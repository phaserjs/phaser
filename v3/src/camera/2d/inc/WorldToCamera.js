var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var matrix0 = new TransformMatrix(1, 0, 0, 1, 0, 0);
var matrix1 = new TransformMatrix(1, 0, 0, 1, 0, 0);
var WorldToCamera = function (pointIn, pointOut)
{
    if (!pointOut)
    {
        pointOut = { x: pointIn.x, y: pointIn.y };
    }

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

    matrix0.matrix[0] = ima;
    matrix0.matrix[1] = imb;
    matrix0.matrix[2] = imc;
    matrix0.matrix[3] = imd;
    matrix0.matrix[4] = ime;
    matrix0.matrix[5] = imf;

    //var c = Math.cos(this.rotation);
    //var s = Math.sin(this.rotation);
    var zoom = this.zoom;
    var scrollX = this.scrollX;
    var scrollY = this.scrollY;
    var x = pointIn.x;// + scrollX * zoom;
    var y = pointIn.y;// + scrollY * zoom;

    //var x = pointIn.x - ((scrollX * c - scrollY * s) * zoom);
    //var y = pointIn.y - ((scrollX * s + scrollY * c) * zoom);

    matrix1.applyITRS(scrollX, scrollY, 0.0, zoom, zoom);
    //matrix1.invert();
    //matrix0.invert();

    matrix0.multiply(matrix1);

    pointOut = matrix0.transformPoint(x, y, pointOut);

    return pointOut;
};

module.exports = WorldToCamera;
