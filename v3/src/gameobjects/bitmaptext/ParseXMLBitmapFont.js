function getValue (node, attribute)
{
    return parseInt(node.getAttribute(attribute), 10);
}

var ParseXMLBitmapFont = function (xml, xSpacing, ySpacing, frame)
{
    if (xSpacing === undefined) { xSpacing = 0; }
    if (ySpacing === undefined) { ySpacing = 0; }

    var data = {};
    var info = xml.getElementsByTagName('info')[0];
    var common = xml.getElementsByTagName('common')[0];

    data.font = info.getAttribute('face');
    data.size = getValue(info, 'size');
    data.lineHeight = getValue(common, 'lineHeight') + ySpacing;
    data.chars = {};

    var letters = xml.getElementsByTagName('char');

    var x = (frame) ? frame.x : 0;
    var y = (frame) ? frame.y : 0;

    for (var i = 0; i < letters.length; i++)
    {
        var node = letters[i];

        var charCode = getValue(node, 'id');
        var gw = getValue(node, 'width');
        var gh = getValue(node, 'height');

        data.chars[charCode] =
        {
            x: x + getValue(node, 'x'),
            y: y + getValue(node, 'y'),
            width: gw,
            height: gh,
            centerX: Math.floor(gw / 2),
            centerY: Math.floor(gh / 2),
            xOffset: getValue(node, 'xoffset'),
            yOffset: getValue(node, 'yoffset'),
            xAdvance: getValue(node, 'xadvance') + xSpacing,
            kerning: {}
        };
    }

    var kernings = xml.getElementsByTagName('kerning');

    for (i = 0; i < kernings.length; i++)
    {
        var kern = kernings[i];

        var first = getValue(kern, 'first');
        var second = getValue(kern, 'second');
        var amount = getValue(kern, 'amount');

        data.chars[second].kerning[first] = amount;
    }

    return data;
};

module.exports = ParseXMLBitmapFont;
