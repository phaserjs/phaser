/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Parses a Pyxel JSON object and adds the Frames to a Texture.
 *
 * @function Phaser.Textures.Parsers.Pyxel
 * @memberOf Phaser.Textures.Parsers
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {object} json - The JSON data.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
var Pyxel = function (texture, json)
{
    //  Malformed? There are a few keys to check here.
    var signature = [ 'layers', 'tilewidth', 'tileheight', 'tileswide', 'tileshigh' ];

    signature.forEach(function (key)
    {
        if (!json[key])
        {
            // console.warn('Phaser.AnimationParser.JSONDataPyxel: Invalid Pyxel Tilemap JSON given, missing "' + key + '" key.');
            // console.log(json);
            return;
        }
    });

    // For this purpose, I only care about parsing tilemaps with a single layer.
    if (json['layers'].length !== 1)
    {
        // console.warn('Phaser.AnimationParser.JSONDataPyxel: Too many layers, this parser only supports flat Tilemaps.');
        // console.log(json);
        return;
    }

    var data = new Phaser.FrameData();

    var tileheight = json['tileheight'];
    var tilewidth = json['tilewidth'];

    var frames = json['layers'][0]['tiles'];
    var newFrame;

    for (var i = 0; i < frames.length; i++)
    {
        newFrame = data.addFrame(new Phaser.Frame(
            i,
            frames[i].x,
            frames[i].y,
            tilewidth,
            tileheight,
            'frame_' + i // No names are included in pyxel tilemap data.
        ));

        // No trim data is included.
        newFrame.setTrim(false);
    }

    return data;
};

module.exports = Pyxel;
