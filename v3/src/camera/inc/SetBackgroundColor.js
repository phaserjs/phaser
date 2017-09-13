var ValueToColor = require('../../graphics/color/ValueToColor');

var SetBackgroundColor = function (color)
{
    if (color === undefined) { color = 'rgba(0,0,0,0)'; }

    this.backgroundColor = ValueToColor(color);

    this.transparent = (this.backgroundColor.alpha === 0);

    return this;
};

module.exports = SetBackgroundColor;
