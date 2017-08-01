var GetValue = require('../../utils/object/GetValue');

var SpriteSheet = function (texture, sourceIndex, x, y, width, height, config)
{
    var frameWidth = GetValue(config, 'frameWidth', null);
    var frameHeight = GetValue(config, 'frameHeight', frameWidth);

    //  If missing we can't proceed
    if (frameWidth === null)
    {
        throw new Error('TextureManager.SpriteSheet: Invalid frameWidth given.');
    }

    //  Add in a __BASE entry (for the entire atlas)
    var source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    var startFrame = GetValue(config, 'startFrame', 0);
    var endFrame = GetValue(config, 'endFrame', -1);
    var margin = GetValue(config, 'margin', 0);
    var spacing = GetValue(config, 'spacing', 0);

    var row = Math.floor((width - margin) / (frameWidth + spacing));
    var column = Math.floor((height - margin) / (frameHeight + spacing));
    var total = row * column;

    if (startFrame > total || startFrame < -total)
    {
        startFrame = 0;
    }

    if (startFrame < 0)
    {
        //  Allow negative skipframes.
        startFrame = total + startFrame;
    }

    if (endFrame !== -1)
    {
        total = startFrame + (endFrame + 1);
    }

    var fx = margin;
    var fy = margin;
    var ax = 0;
    var ay = 0;

    for (var i = 0; i < total; i++)
    {
        ax = 0;
        ay = 0;

        var w = fx + frameWidth;
        var h = fy + frameHeight;

        if (w > width)
        {
            ax = w - width;
        }

        if (h > height)
        {
            ay = h - height;
        }

        texture.add(i, sourceIndex, x + fx, y + fy, frameWidth - ax, frameHeight - ay);

        fx += frameWidth + spacing;

        if (fx + frameWidth > width)
        {
            fx = margin;
            fy += frameHeight + spacing;
        }
    }

    return texture;
};

module.exports = SpriteSheet;
