/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../../../utils/object/GetFastValue');
var CreateGroupLayer = require('./CreateGroupLayer');

/**
 * Parses a Tiled JSON object into an array of objects with details about the image layers.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseImageLayers
 * @since 3.0.0
 *
 * @param {object} json - The Tiled JSON object.
 *
 * @return {array} Array of objects that include critical info about the map's image layers
 */
var ParseImageLayers = function (json)
{
    var images = [];

    // State inherited from a parent group
    var groupStack = [];
    var curGroupState = CreateGroupLayer(json);

    while (curGroupState.i < curGroupState.layers.length || groupStack.length > 0)
    {
        if (curGroupState.i >= curGroupState.layers.length)
        {
            // Ensure recursion stack is not empty first
            if (groupStack.length < 1)
            {
                console.warn(
                    'TilemapParser.parseTiledJSON - Invalid layer group hierarchy'
                );
                break;
            }

            // Return to previous recursive state
            curGroupState = groupStack.pop();
            continue;
        }

        // Get current layer and advance iterator
        var curi = curGroupState.layers[curGroupState.i];
        curGroupState.i++;

        if (curi.type !== 'imagelayer')
        {
            if (curi.type === 'group')
            {
                // Compute next state inherited from group
                var nextGroupState = CreateGroupLayer(json, curi, curGroupState);

                // Preserve current state before recursing
                groupStack.push(curGroupState);
                curGroupState = nextGroupState;
            }

            // Skip this layer OR 'recurse' (iterative style) into the group
            continue;
        }

        var layerOffsetX = GetFastValue(curi, 'offsetx', 0) + GetFastValue(curi, 'startx', 0);
        var layerOffsetY = GetFastValue(curi, 'offsety', 0) + GetFastValue(curi, 'starty', 0);
        images.push({
            name: (curGroupState.name + curi.name),
            image: curi.image,
            x: (curGroupState.x + layerOffsetX + curi.x),
            y: (curGroupState.y + layerOffsetY + curi.y),
            alpha: (curGroupState.opacity * curi.opacity),
            visible: (curGroupState.visible && curi.visible),
            properties: GetFastValue(curi, 'properties', {})
        });
    }

    return images;
};

module.exports = ParseImageLayers;
