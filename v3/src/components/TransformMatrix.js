var mathCos = Math.cos;
var mathSin = Math.sin;
var mathSqrt = Math.sqrt;
var mathAcos = Math.acos;
var mathAtan = Math.atan;

var TransformMatrix = function (a, b, c, d, tx, ty) 
{
    a = typeof a === 'number' ? a : 1;
    b = typeof b === 'number' ? b : 0;
    c = typeof c === 'number' ? c : 0;
    d = typeof d === 'number' ? d : 1;
    tx = typeof tx === 'number' ? tx : 0;
    ty = typeof ty === 'number' ? ty : 0;

    this.matrix = new Float32Array([a, b, c, d, tx, ty, 0, 0, 1]);
    this.decomposedMatrix = {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0
    };
};

TransformMatrix.prototype.loadIdentity = function ()
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

TransformMatrix.prototype.translate = function (x, y)
{
    var matrix = this.matrix;

    matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
    matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];

    return this;
};

TransformMatrix.prototype.scale = function (x, y)
{
    var matrix = this.matrix;

    matrix[0] = matrix[0] * x;
    matrix[1] = matrix[1] * x;
    matrix[2] = matrix[2] * y;
    matrix[3] = matrix[3] * y;

    return this;
};

TransformMatrix.prototype.rotate = function (radian)
{
    var radianSin = mathSin(radian);
    var radianCos = mathCos(radian);

    return this.transform(radianCos, -radianSin, radianSin, radianCos, 0, 0);
};

TransformMatrix.prototype.multiply = function (otherMatrix)
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

TransformMatrix.prototype.transform = function (a, b, c, d, tx, ty)
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

TransformMatrix.prototype.setTransform = function (a, b, c, d, tx, ty)
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

TransformMatrix.prototype.decomposeMatrix = function ()
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

/* identity + translate + rotate + scale */
TransformMatrix.prototype.applyITRS = function (x, y, rotation, scaleX, scaleY) 
{
    var matrix = this.matrix;
    var a = 1;
    var b = 0;
    var c = 0;
    var d = 1;
    var e = 0;
    var f = 0;
    var sr = mathSin(rotation);
    var cr = mathCos(rotation);

    // Translate
    matrix[4] = a * x + c * y + e;
    matrix[5] = b * x + d * y + f;

    // Rotate
    matrix[0] = cr * a + -sr * c;
    matrix[1] = cr * b + -sr * d;
    matrix[2] = sr * a + cr * c;
    matrix[3] = sr * b + cr * d;

    // Scale
    matrix[0] = matrix[0] * scaleX;
    matrix[1] = matrix[1] * scaleX;
    matrix[2] = matrix[2] * scaleY;
    matrix[3] = matrix[3] * scaleY;

    return this;
};

module.exports = TransformMatrix;
