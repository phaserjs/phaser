var GetFastValue = require('../../utils/object/GetFastValue');

var SpriteSheetFromAtlas = function (texture, frame, config)
{
    var frameWidth = GetFastValue(config, 'frameWidth', null);
    var frameHeight = GetFastValue(config, 'frameHeight', frameWidth);

    //  If missing we can't proceed
    if (!frameWidth)
    {
        throw new Error('TextureManager.SpriteSheetFromAtlas: Invalid frameWidth given.');
    }

    //  Add in a __BASE entry (for the entire atlas)
    // var source = texture.source[sourceIndex];
    // texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    var startFrame = GetFastValue(config, 'startFrame', 0);
    var endFrame = GetFastValue(config, 'endFrame', -1);
    var margin = GetFastValue(config, 'margin', 0);
    var spacing = GetFastValue(config, 'spacing', 0);

    var x = frame.cutX;
    var y = frame.cutY;

    var cutWidth = frame.cutWidth;
    var cutHeight = frame.cutHeight;
    var sheetWidth = frame.realWidth;
    var sheetHeight = frame.realHeight;

    var row = Math.floor((sheetWidth - margin + spacing) / (frameWidth + spacing));
    var column = Math.floor((sheetHeight - margin + spacing) / (frameHeight + spacing));
    var total = row * column;

    //  trim offsets

    var leftPad = frame.x;
    var leftWidth = frameWidth - leftPad;

    var rightWidth = frameWidth - ((sheetWidth - cutWidth) - leftPad);

    var topPad = frame.y;
    var topHeight = frameHeight - topPad;

    var bottomHeight = frameHeight - ((sheetHeight - cutHeight) - topPad);

    // console.log('x / y', x, y);
    // console.log('cutW / H', cutWidth, cutHeight);
    // console.log('sheetW / H', sheetWidth, sheetHeight);
    // console.log('row', row, 'column', column, 'total', total);
    // console.log('LW', leftWidth, 'RW', rightWidth, 'TH', topHeight, 'BH', bottomHeight);

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

    var sheetFrame;
    var frameX = margin;
    var frameY = margin;
    var frameIndex = 0;
    var sourceIndex = frame.sourceIndex;

    for (var sheetY = 0; sheetY < column; sheetY++)
    {
        var topRow = (sheetY === 0);
        var bottomRow = (sheetY === column - 1);

        for (var sheetX = 0; sheetX < row; sheetX++)
        {
            var leftRow = (sheetX === 0);
            var rightRow = (sheetX === row - 1);

            sheetFrame = texture.add(frameIndex, sourceIndex, x + frameX, y + frameY, frameWidth, frameHeight);

            if (leftRow || topRow || rightRow || bottomRow)
            {
                var destX = (leftRow) ? leftPad : 0;
                var destY = (topRow) ? topPad : 0;
                var destWidth = frameWidth;
                var destHeight = frameHeight;

                if (leftRow)
                {
                    destWidth = leftWidth;
                }
                else if (rightRow)
                {
                    destWidth = rightWidth;
                }

                if (topRow)
                {
                    destHeight = topHeight;
                }
                else if (bottomRow)
                {
                    destHeight = bottomHeight;
                }

                sheetFrame.cutWidth = destWidth;
                sheetFrame.cutHeight = destHeight;

                sheetFrame.setTrim(frameWidth, frameHeight, destX, destY, destWidth, destHeight);
            }

            frameX += spacing;

            if (leftRow)
            {
                frameX += leftWidth;
            }
            else if (rightRow)
            {
                frameX += rightRow;
            }
            else
            {
                frameX += frameWidth;
            }

            frameIndex++;
        }

        frameX = margin;
        frameY += spacing;

        if (topRow)
        {
            frameY += topHeight;
        }
        else if (bottomRow)
        {
            frameY += bottomHeight;
        }
        else
        {
            frameY += frameHeight;
        }
    }

    return texture;
};

module.exports = SpriteSheetFromAtlas;
