/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DeepCopy = require('../../utils/object/DeepCopy');
var GetTilesWithin = require('./GetTilesWithin');
var ReplaceByIndex = require('./ReplaceByIndex');

/**
 * Creates a Sprite for every object matching the given tile indexes in the layer. You can
 * optionally specify if each tile will be replaced with a new tile after the Sprite has been
 * created. This is useful if you want to lay down special tiles in a level that are converted to
 * Sprites, but want to replace the tile itself with a floor tile or similar once converted.
 *
 * @function Phaser.Tilemaps.Components.CreateFromTiles
 * @since 3.0.0
 *
 * @param {(number|number[])} indexes - The tile index, or array of indexes, to create Sprites from.
 * @param {?(number|number[])} replacements - The tile index, or array of indexes, to change a converted tile to. Set to `null` to leave the tiles unchanged. If an array is given, it is assumed to be a one-to-one mapping with the indexes array.
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} spriteConfig - The config object to pass into the Sprite creator (i.e. scene.make.sprite).
 * @param {Phaser.Scene} scene - The Scene to create the Sprites within.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when determining the world XY
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.GameObjects.Sprite[]} An array of the Sprites that were created.
 */
var CreateFromTiles = function (indexes, replacements, spriteConfig, scene, camera, layer)
{
    if (!spriteConfig) { spriteConfig = {}; }

    if (!Array.isArray(indexes))
    {
        indexes = [ indexes ];
    }

    var tilemapLayer = layer.tilemapLayer;

    if (!scene) { scene = tilemapLayer.scene; }
    if (!camera) { camera = scene.cameras.main; }

    var layerWidth = layer.width;
    var layerHeight = layer.height;

    var tiles = GetTilesWithin(0, 0, layerWidth, layerHeight, null, layer);
    var sprites = [];
    var i;

    var mergeExtras = function (config, tile, properties)
    {
        for (var i = 0; i < properties.length; i++)
        {
            var property = properties[i];

            if (!config.hasOwnProperty(property))
            {
                config[property] = tile[property];
            }
        }
    };

    for (i = 0; i < tiles.length; i++)
    {
        var tile = tiles[i];
        var config = DeepCopy(spriteConfig);

        if (indexes.indexOf(tile.index) !== -1)
        {
            var point = tilemapLayer.tileToWorldXY(tile.x, tile.y, undefined, camera,layer);

            config.x = point.x;
            config.y = point.y;

            mergeExtras(config, tile, [ 'rotation', 'flipX', 'flipY', 'alpha', 'visible', 'tint' ]);

            if (!config.hasOwnProperty('origin'))
            {
                config.x += tile.width * 0.5;
                config.y += tile.height * 0.5;
            }

            if (config.hasOwnProperty('useSpriteSheet'))
            {
                config.key = tile.tileset.image;
                config.frame = tile.index - 1;
            }

            sprites.push(scene.make.sprite(config));
        }
    }

    if (Array.isArray(replacements))
    {
        //  Assume 1 to 1 mapping with indexes array
        for (i = 0; i < indexes.length; i++)
        {
            ReplaceByIndex(indexes[i], replacements[i], 0, 0, layerWidth, layerHeight, layer);
        }
    }
    else if (replacements !== null)
    {
        //  Assume 1 replacement for all types of tile given
        for (i = 0; i < indexes.length; i++)
        {
            ReplaceByIndex(indexes[i], replacements, 0, 0, layerWidth, layerHeight, layer);
        }
    }

    return sprites;
};

module.exports = CreateFromTiles;
