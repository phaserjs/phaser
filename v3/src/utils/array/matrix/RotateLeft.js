var RotateMatrix = require('./RotateMatrix)';

var RotateLeft = function (matrix)
{
    return RotateMatrix(matrix, -90);
};

module.exports = RotateLeft;
