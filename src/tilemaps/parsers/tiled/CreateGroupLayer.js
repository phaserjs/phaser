/**
 * @author       Seth Berrier <berriers@uwstout.edu>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../../../utils/object/GetFastValue');

/**
 * Parses a Tiled group layer and builds an inherited state object for use when processing
 * its child layers. Group layers in Tiled can nest other layers and accumulate properties
 * such as name prefix, opacity, visibility, and positional offset. This function combines
 * the given group's own properties with those of its parent state to produce a new state
 * that child layers will inherit.
 *
 * If no group is provided, a default root state is returned with neutral values (full opacity,
 * visible, zero offset), suitable for use at the top level of the layer hierarchy.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.CreateGroupLayer
 * @since 3.21.0
 *
 * @param {object} json - The Tiled JSON object.
 * @param {object} [group] - The current group layer from the Tiled JSON file.
 * @param {object} [parentState] - The inherited state of the parent group, as returned by a previous call to this function. Required when `group` is provided.
 *
 * @return {object} A group state object containing the accumulated name prefix, opacity, visibility, and x/y position offsets for use when parsing child layers.
 */
var CreateGroupLayer = function (json, group, parentState)
{
    if (!group)
    {
        // Return a default group state object
        return {
            i: 0, // Current layer array iterator
            layers: json.layers, // Current array of layers
            // Values inherited from parent group
            name: '',
            opacity: 1,
            visible: true,
            x: 0,
            y: 0
        };
    }

    // Compute group layer x, y
    var layerX = group.x + GetFastValue(group, 'startx', 0) * json.tilewidth + GetFastValue(group, 'offsetx', 0);
    var layerY = group.y + GetFastValue(group, 'starty', 0) * json.tileheight + GetFastValue(group, 'offsety', 0);

    // Compute next state inherited from group
    return {
        i: 0,
        layers: group.layers,
        name: parentState.name + group.name + '/',
        opacity: parentState.opacity * group.opacity,
        visible: parentState.visible && group.visible,
        x: parentState.x + layerX,
        y: parentState.y + layerY
    };
};

module.exports = CreateGroupLayer;
