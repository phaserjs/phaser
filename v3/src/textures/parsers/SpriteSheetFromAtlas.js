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

/*
{
    "filename": "boomtest-notrim",
    "frame": {"x":4,"y":4,"w":320,"h":320},
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {"x":0,"y":0,"w":320,"h":320},
    "sourceSize": {"w":320,"h":320},
    "pivot": {"x":0.5,"y":0.5}
},
{
    "filename": "boomtest",
    "frame": {"x":976,"y":4,"w":306,"h":305},
    "rotated": false,
    "trimmed": true,
    "spriteSourceSize": {"x":6,"y":5,"w":306,"h":305},
    "sourceSize": {"w":320,"h":320},
    "pivot": {"x":0.5,"y":0.5}
},
*/

    //  The notrim version is smaller than sourceSize

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

    console.log('x / y', x, y);
    console.log('cutW / H', cutWidth, cutHeight);
    console.log('sheetW / H', sheetWidth, sheetHeight);

    var row = Math.floor((sheetWidth - margin) / (frameWidth + spacing));
    var column = Math.floor((sheetHeight - margin) / (frameHeight + spacing));
    var total = row * column;

    console.log('row', row, 'column', column, 'total', total);

    //  trim offset

    var leftPad = frame.x;
    var leftWidth = frameWidth - leftPad;

    var rightWidth = frameWidth - ((sheetWidth - cutWidth) - leftPad);

    var topPad = frame.y;
    var topHeight = frameHeight - topPad;

    var bottomHeight = frameHeight - ((sheetHeight - cutHeight) - topPad);

    // console.log('padding x', leftPad, 'y', topPad, 'right', rightPad, 'bottom', bottomPad);
    console.log('LW', leftWidth, 'RW', rightWidth, 'TH', topHeight, 'BH', bottomHeight);

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

    var width = frame.cutWidth;
    var height = frame.cutHeight;
    var sourceIndex = frame.sourceIndex;

    var frameX = margin;
    var frameY = margin;
    var frameIndex = 0;

    for (var sheetY = 0; sheetY < column; sheetY++)
    {
        var topRow = (sheetY === 0);
        var bottomRow = (sheetY === column - 1);

        // var fy = margin + ((frameHeight + spacing) * sheetY);

        for (var sheetX = 0; sheetX < row; sheetX++)
        {
            // var fx = margin + ((frameWidth + spacing) * sheetX);
            var leftRow = (sheetX === 0);
            var rightRow = (sheetX === row - 1);

            //  fx / fy is wrong

            // var frame = new Frame(this, name, sourceIndex, x, y, width, height);
            // x/y/w/h = set to the CUT values AND normal values
            // we need to override the cut values and setTime does NOT do that

            sheetFrame = texture.add(frameIndex, sourceIndex, x + frameX, y + frameY, frameWidth, frameHeight);

            if (leftRow || topRow || rightRow || bottomRow)
            {
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

            /*
            if (leftRow || topRow || rightRow || bottomRow)
            {
                var actualWidth = frameWidth;
                var actualHeight = frameHeight;
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

                // sheetFrame.cutWidth = destWidth;
                // sheetFrame.cutHeight = destHeight;
                // sheetFrame.updateUVs();

                // sheetFrame.setTrim(actualWidth, actualHeight, destX, destY, destWidth, destHeight);
            }
            */

            // console.log(sheetFrame);

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

    /*
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

        // console.log('Add frame', i);
        // console.log('x', (x + fx), 'y', (y + fy), 'w', (frameWidth - ax), 'h', (frameHeight - ay));

        sheetFrame = texture.add(i, sourceIndex, x + fx, y + fy, frameWidth - ax, frameHeight - ay);

        // setTrim: function (actualWidth, actualHeight, destX, destY, destWidth, destHeight)

        // sheetFrame.setTrim(sheetWidth, sheetHeight, )

        fx += frameWidth + spacing;

        if (fx + frameWidth > width)
        {
            fx = margin;
            fy += frameHeight + spacing;
        }
    }
    */

    return texture;
};

module.exports = SpriteSheetFromAtlas;
