/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var imageHeight = 0;

/**
 * @function addFrame
 * @private
 * @since 3.0.0
 */
var addFrame = function (texture, sourceIndex, name, frame)
{
    //  The frame values are the exact coordinates to cut the frame out of the atlas from

    var y = imageHeight - frame.y - frame.height;

    texture.add(name, sourceIndex, frame.x, y, frame.width, frame.height);

    //  These are the original (non-trimmed) sprite values
    /*
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
    */
};

/**
 * Parses a Unity YAML File and creates Frames in the Texture.
 * For more details about Sprite Meta Data see https://docs.unity3d.com/ScriptReference/SpriteMetaData.html
 *
 * @function Phaser.Textures.Parsers.UnityYAML
 * @memberOf Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {integer} sourceIndex - The index of the TextureSource.
 * @param {object} yaml - The YAML data.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
var UnityYAML = function (texture, sourceIndex, yaml)
{
    //  Add in a __BASE entry (for the entire atlas)
    var source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    imageHeight = source.height;

    var data = yaml.split('\n');

    var lineRegExp = /^[ ]*(- )*(\w+)+[: ]+(.*)/;

    var prevSprite = '';
    var currentSprite = '';
    var rect = { x: 0, y: 0, width: 0, height: 0 };

    // var pivot = { x: 0, y: 0 };
    // var border = { x: 0, y: 0, z: 0, w: 0 };

    for (var i = 0; i < data.length; i++)
    {
        var results = data[i].match(lineRegExp);

        if (!results)
        {
            continue;
        }

        var isList = (results[1] === '- ');
        var key = results[2];
        var value = results[3];

        if (isList)
        {
            if (currentSprite !== prevSprite)
            {
                addFrame(texture, sourceIndex, currentSprite, rect);

                prevSprite = currentSprite;
            }

            rect = { x: 0, y: 0, width: 0, height: 0 };
        }

        if (key === 'name')
        {
            //  Start new list
            currentSprite = value;
            continue;
        }

        switch (key)
        {
            case 'x':
            case 'y':
            case 'width':
            case 'height':
                rect[key] = parseInt(value, 10);
                break;

            // case 'pivot':
            //     pivot = eval('var obj = ' + value);
            //     break;

            // case 'border':
            //     border = eval('var obj = ' + value);
            //     break;
        }
    }

    if (currentSprite !== prevSprite)
    {
        addFrame(texture, sourceIndex, currentSprite, rect);
    }

    return texture;
};

module.exports = UnityYAML;

/*
Example data:

TextureImporter:
  spritePivot: {x: .5, y: .5}
  spriteBorder: {x: 0, y: 0, z: 0, w: 0}
  spritePixelsToUnits: 100
  spriteSheet:
    sprites:
    - name: asteroids_0
      rect:
        serializedVersion: 2
        x: 5
        y: 328
        width: 65
        height: 82
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
    - name: asteroids_1
      rect:
        serializedVersion: 2
        x: 80
        y: 322
        width: 53
        height: 88
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
  spritePackingTag: Asteroids
*/
