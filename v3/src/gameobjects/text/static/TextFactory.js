var Text = require('./Text');

var TextFactory = function (state, x, y, text, style)
{
    return new Text(state, x, y, text, style);
};

module.exports = TextFactory;
