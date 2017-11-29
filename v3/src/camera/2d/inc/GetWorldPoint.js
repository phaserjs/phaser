var Vector2 = require('../../../math/Vector2');

var GetWorldPoint = function (screenPoint, output)
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
        return screenPoint;
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
    var x = screenPoint.x + ((scrollX * c - scrollY * s) * zoom);
    var y = screenPoint.y + ((scrollX * s + scrollY * c) * zoom);

    if (!output)
    {
        output = new Vector2();
    }

    /* Apply transform to point */
    output.x = (x * ima + y * imc + ime);
    output.y = (x * imb + y * imd + imf);
    
    return output;
};

module.exports = GetWorldPoint;
