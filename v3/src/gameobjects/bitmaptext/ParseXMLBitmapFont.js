function getValue (node, attribute)
{
    return parseInt(node.getAttribute(attribute), 10);
}

// "azo-fire":
// {
//     "frame": {"x":2,"y":2,"w":1020,"h":376},
//     "rotated": false,
//     "trimmed": true,
//     "spriteSourceSize": {"x":1,"y":1,"w":1020,"h":376},
//     "sourceSize": {"w":1024,"h":512},
//     "pivot": {"x":0.5,"y":0.5}
// },

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

    var x = 0;
    var y = 0;

    if (frame && frame.trim)
    {

    }

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
            data: {},
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
