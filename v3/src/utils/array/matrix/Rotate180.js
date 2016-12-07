var RotateMatrix = require('./RotateMatrix)';

var Rotate180 = function (matrix)
{
    return RotateMatrix(matrix, 180);
};

module.exports = Rotate180;
