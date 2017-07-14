var Image = require('./Image');

var ImageFactory = function (scene, x, y, key, frame)
{
    return new Image(scene, x, y, key, frame);
};

module.exports = ImageFactory;
