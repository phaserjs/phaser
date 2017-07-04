var Image = require('./Image');

var ImageFactory = function (state, x, y, key, frame)
{
    return new Image(state, x, y, key, frame);
};

module.exports = ImageFactory;
