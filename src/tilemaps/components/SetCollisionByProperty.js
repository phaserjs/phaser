/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SetTileCollision = require('./SetTileCollision');
var CalculateFacesWithin = require('./CalculateFacesWithin');
var HasValue = require('../../utils/object/HasValue');

/**
 * Sets collision on the tiles within a layer by checking tile properties. If a tile has a property
 * that matches the given properties object, its collision flag will be set. The `collides`
 * parameter controls if collision will be enabled (true) or disabled (false). Passing in
 * `{ collides: true }` would update the collision flag on any tiles with a "collides" property that
 * has a value of true. Any tile that doesn't have "collides" set to true will be ignored. You can
 * also use an array of values, e.g. `{ types: ["stone", "lava", "sand" ] }`. If a tile has a
 * "types" property that matches any of those values, its collision flag will be updated.
 *
 * @function Phaser.Tilemaps.Components.SetCollisionByProperty
 * @since 3.0.0
 *
 * @param {object} properties - An object with tile properties and corresponding values that should be checked.
 * @param {boolean} collides - If true it will enable collision. If false it will clear collision.
 * @param {boolean} recalculateFaces - Whether or not to recalculate the tile faces after the update.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var SetCollisionByProperty = function (properties, collides, recalculateFaces, layer)
{
    if (collides === undefined) { collides = true; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    for (var ty = 0; ty < layer.height; ty++)
    {
        for (var tx = 0; tx < layer.width; tx++)
        {
            var tile = layer.data[ty][tx];

            if (!tile) { continue; }

            for (var property in properties)
            {
                if (!HasValue(tile.properties, property)) { continue; }

                var values = properties[property];

                if (!Array.isArray(values))
                {
                    values = [ values ];
                }

                for (var i = 0; i < values.length; i++)
                {
                    if (tile.properties[property] === values[i])
                    {
                        SetTileCollision(tile, collides);
                    }
                }
            }
        }
    }

    if (recalculateFaces)
    {
        CalculateFacesWithin(0, 0, layer.width, layer.height, layer);
    }
};

module.exports = SetCollisionByProperty;
