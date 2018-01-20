var Clone = require('../../utils/object/Clone');

var JSONArray = function (texture, sourceIndex, json)
{
    //  Malformed?
    if (!json['frames'])
    {
        console.warn('Invalid Texture Atlas JSON Array given, missing \'frames\' array');
        return;
    }

    //  Add in a __BASE entry (for the entire atlas)
    var source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    //  By this stage frames is a fully parsed array
    var frames = json['frames'];
    var newFrame;

    for (var i = 0; i < frames.length; i++)
    {
        var src = frames[i];

        //  The frame values are the exact coordinates to cut the frame out of the atlas from
        newFrame = texture.add(src.filename, sourceIndex, src.frame.x, src.frame.y, src.frame.w, src.frame.h);

        //  These are the original (non-trimmed) sprite values
        if (src.trimmed)
        {
            newFrame.setTrim(
                src.sourceSize.w,
                src.sourceSize.h,
                src.spriteSourceSize.x,
                src.spriteSourceSize.y,
                src.spriteSourceSize.w,
                src.spriteSourceSize.h
            );
        }

        if (src.rotated)
        {
            newFrame.rotated = true;
            newFrame.updateUVsInverted();
        }

        //  Copy over any extra data
        newFrame.customData = Clone(src);
    }

    //  Copy over any additional data that was in the JSON to Texture.customData
    for (var dataKey in json)
    {
        if (dataKey === 'frames')
        {
            continue;
        }

        if (Array.isArray(json[dataKey]))
        {
            texture.customData[dataKey] = json[dataKey].slice(0);
        }
        else
        {
            texture.customData[dataKey] = json[dataKey];
        }
    }

    return texture;
};

module.exports = JSONArray;
