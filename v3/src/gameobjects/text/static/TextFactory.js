var Text = require('./Text');

var TextFactory = function (scene, x, y, text, style)
{
    return new Text(scene, x, y, text, style);
};

module.exports = TextFactory;
