var mathCos = Math.cos;
var mathSin = Math.sin;
var mathSqrt = Math.sqrt;
var mathAcos = Math.acos;
var mathAtan = Math.atan;

var Transform2DMatrix = function (a, b, c, d, tx, ty) 
{
    a = typeof a === 'number' ? a : 1;
    b = typeof b === 'number' ? b : 0;
    c = typeof c === 'number' ? c : 0;
    d = typeof d === 'number' ? d : 1;
    tx = typeof tx === 'number' ? tx : 0;
    ty = typeof ty === 'number' ? ty : 0;

    this.matrix = new Float32Array([a, b, c, d, tx, ty]);
    this.decomposedMatrix = {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0
    };
};

Transform2DMatrix.prototype.loadIdentity = function ()
{
    var matrix = this.matrix;
    
    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 1;
    matrix[4] = 0;
    matrix[5] = 0;

    return this;
};

Transform2DMatrix.prototype.translate = function (x, y)
{
    var matrix = this.matrix;

    matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
    matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];

    return this;
};

Transform2DMatrix.prototype.scale = function (x, y)
{
    var matrix = this.matrix;

    matrix[0] = matrix[0] * x;
    matrix[1] = matrix[1] * x;
    matrix[2] = matrix[2] * y;
    matrix[3] = matrix[3] * y;

    return this;
};

Transform2DMatrix.prototype.rotate = function (radian)
{
    var matrix = this.matrix;
    var a = matrix[0];
    var b = matrix[1];
    var c = matrix[2];
    var d = matrix[3];
    var sr = mathSin(radian);
    var cr = mathCos(radian);

    matrix[0] = a * cr + c * sr;
    matrix[1] = b * cr + d * sr;
    matrix[2] = a * -sr + c * cr;
    matrix[3] = b * -sr + d * cr;

    return this;
};

Transform2DMatrix.prototype.multiply = function (otherMatrix)
{
    var matrix = this.matrix;
    var a0 = matrix[0];
    var b0 = matrix[1];
    var c0 = matrix[2];
    var d0 = matrix[3];
    var tx0 = matrix[4];
    var ty0 = matrix[5];
    var a1 = otherMatrix[0];
    var b1 = otherMatrix[1];
    var c1 = otherMatrix[2];
    var d1 = otherMatrix[3];
    var tx1 = otherMatrix[4];
    var ty1 = otherMatrix[5];

    matrix[0] = a1 * a0 + b1 * c0;
    matrix[1] = a1 * b0 + b1 * d0;
    matrix[2] = c1 * a0 + d1 * c0;
    matrix[3] = c1 * b0 + d1 * d0;
    matrix[4] = tx1 * a0 + ty1 * c0 + tx0;
    matrix[5] = tx1 * b0 + ty1 * d0 + ty0;

    return this;
};

Transform2DMatrix.prototype.transform = function (a, b, c, d, tx, ty)
{
    var matrix = this.matrix;
    var a0 = matrix[0];
    var b0 = matrix[1];
    var c0 = matrix[2];
    var d0 = matrix[3];
    var tx0 = matrix[4];
    var ty0 = matrix[5];

    matrix[0] = a * a0 + b * c0;
    matrix[1] = a * b0 + b * d0;
    matrix[2] = c * a0 + d * c0;
    matrix[3] = c * b0 + d * d0;
    matrix[4] = tx * a0 + ty * c0 + tx0;
    matrix[5] = tx * b0 + ty * d0 + ty0;

    return this;
};

Transform2DMatrix.prototype.setTransform = function (a, b, c, d, tx, ty)
{
    var matrix = this.matrix;

    matrix[0] = a;
    matrix[1] = b;
    matrix[2] = c;
    matrix[3] = d;
    matrix[4] = tx;
    matrix[5] = ty;

    return this;
};

Transform2DMatrix.prototype.decomposeMatrix = function ()
{
    var decomposedMatrix = this.decomposedMatrix;
    var matrix = this.matrix;
    var a = matrix[0];
    var b = matrix[1];
    var c = matrix[2];
    var d = matrix[3];
    var a2 = a * a;
    var b2 = b * b;
    var c2 = c * c;
    var d2 = d * d;
    var sx = mathSqrt(a2 + c2);
    var sy = mathSqrt(b2 + d2);

    decomposedMatrix.translateX = matrix[4];
    decomposedMatrix.translateY = matrix[5];
    decomposedMatrix.scaleX = sx;
    decomposedMatrix.scaleY = sy;
    decomposedMatrix.rotation = mathAcos(a / sx) * (mathAtan(-c / a) < 0 ? -1 : 1);

    return decomposedMatrix;
};

Transform2DMatrix.prototype.fromTransform2D = function (transform2D)
{
    this.loadIdentity().
        translate(transform2D.x, transform2D.y).
        rotate(transform2D.angle).
        scale(transform2D.scaleX, transform2D.scaleY);

    return this;
};

var Transform2D = function (x, y)
{
    this.x = x;
    this.y = y;
    this.scaleX = 1;
    this.scaleY = 1;
    this.angle = 0;
};

module.exports = {
    Transform2DMatrix: Transform2DMatrix,
    Transform2D: Transform2D
};
