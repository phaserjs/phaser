/**
* Checks if the given dimensions make a power of two texture.
* 
* @method Phaser.Math#isPowerOfTwo
* @param {number} width - The width to check.
* @param {number} height - The height to check.
* @return {boolean} True if the width and height are a power of two.
*/
var IsSizePowerOfTwo = function (width, height)
{
    return (width > 0 && (width & (width - 1)) === 0 && height > 0 && (height & (height - 1)) === 0);
};

module.exports = IsSizePowerOfTwo;
