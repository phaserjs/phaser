/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Parses a Phaser Compact Texture Atlas (PCT) data object and adds the Frames to the Texture.
 *
 * The `decoded` argument is the object produced by `Phaser.Textures.Parsers.PCTDecode` (or an
 * equivalent, pre-decoded structure). It must contain `pages`, `folders`, and `frames` fields.
 * Frames are mapped to the Texture's source images using the `page` index on each frame, which
 * corresponds to the index of the matching `TextureSource` on the Texture.
 *
 * The page and folder metadata from the decoded data is also copied onto the Texture's
 * `customData` under the `pct` key, so it can be inspected at runtime.
 *
 * This parser is called by `Phaser.Textures.TextureManager#addAtlasPCT` and is not typically
 * invoked directly.
 *
 * @function Phaser.Textures.Parsers.PCT
 * @memberof Phaser.Textures.Parsers
 * @private
 * @since 4.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {object} decoded - The decoded PCT data, as produced by `Phaser.Textures.Parsers.PCTDecode`.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
var PCT = function (texture, decoded)
{
    if (!decoded || !decoded.frames || !decoded.pages)
    {
        console.warn('Invalid PCT atlas data given');
        return;
    }

    //  Add a __BASE entry for source 0 (matches the behavior of JSONArray / JSONHash)
    var source0 = texture.source[0];

    texture.add('__BASE', 0, 0, 0, source0.width, source0.height);

    var frames = decoded.frames;

    for (var key in frames)
    {
        if (!frames.hasOwnProperty(key))
        {
            continue;
        }

        var src = frames[key];
        var sourceIndex = src.page | 0;

        if (sourceIndex >= texture.source.length)
        {
            console.warn('PCT atlas frame "' + key + '" references missing page ' + sourceIndex);
            continue;
        }

        var newFrame = texture.add(src.key || key, sourceIndex, src.x, src.y, src.w, src.h);

        if (!newFrame)
        {
            console.warn('Invalid PCT atlas, frame already exists: ' + key);
            continue;
        }

        if (src.trimmed)
        {
            newFrame.setTrim(
                src.sourceW,
                src.sourceH,
                src.trimX,
                src.trimY,
                src.w,
                src.h
            );
        }

        if (src.rotated)
        {
            newFrame.rotated = true;
            newFrame.updateUVsInverted();
        }
    }

    //  Copy the page and folder metadata onto the Texture's customData so it is accessible later
    texture.customData['pct'] = {
        pages: decoded.pages,
        folders: decoded.folders
    };

    return texture;
};

module.exports = PCT;
