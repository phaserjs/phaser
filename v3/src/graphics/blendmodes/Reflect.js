/**
* Reflect blend mode. This mode is useful when adding shining objects or light zones to images. 
*/
var Reflect = function (a, b)
{
    return (b === 255) ? b : Math.min(255, (a * a / (255 - b)));
};

module.exports = Reflect;
