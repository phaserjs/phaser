/**
 * @author       Seth Berrier <berriers@uwstout.edu>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../../../utils/object/GetFastValue');

/**
 * Parse a Tiled group layer and create a state object for inheriting.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.CreateGroupLayer
 * @since 3.21.0
 *
 * @param {object} json - The Tiled JSON object.
 * @param {object} [currentl] - The current group layer from the Tiled JSON file.
 * @param {object} [parentstate] - The state of the parent group (if any).
 *
 * @return {object} A group state object with proper values for updating children layers.
 */
var CreateGroupLayer = function (json, groupl, parentstate)
{
    if (!groupl)
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
    var layerX = groupl.x + GetFastValue(groupl, 'startx', 0) * json.tilewidth + GetFastValue(groupl, 'offsetx', 0);
    var layerY = groupl.y + GetFastValue(groupl, 'starty', 0) * json.tileheight + GetFastValue(groupl, 'offsety', 0);

    // Compute next state inherited from group
    return {
        i: 0,
        layers: groupl.layers,
        name: parentstate.name + groupl.name + '/',
        opacity: parentstate.opacity * groupl.opacity,
        visible: parentstate.visible && groupl.visible,
        x: parentstate.x + layerX,
        y: parentstate.y + layerY
    };
};

module.exports = CreateGroupLayer;
