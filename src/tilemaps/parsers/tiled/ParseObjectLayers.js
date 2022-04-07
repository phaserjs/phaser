/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../../../utils/object/GetFastValue');
var ParseObject = require('./ParseObject');
var ObjectLayer = require('../../mapdata/ObjectLayer');
var CreateGroupLayer = require('./CreateGroupLayer');

/**
 * Parses a Tiled JSON object into an array of ObjectLayer objects.
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.ParseObjectLayers
 * @since 3.0.0
 *
 * @param {object} json - The Tiled JSON object.
 *
 * @return {array} An array of all object layers in the tilemap as `ObjectLayer`s.
 */
var ParseObjectLayers = function (json)
{
    var objectLayers = [];

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
        var curo = curGroupState.layers[curGroupState.i];
        curGroupState.i++;

        // Modify inherited properties
        curo.opacity *= curGroupState.opacity;
        curo.visible = curGroupState.visible && curo.visible;

        if (curo.type !== 'objectgroup')
        {
            if (curo.type === 'group')
            {
                // Compute next state inherited from group
                var nextGroupState = CreateGroupLayer(json, curo, curGroupState);

                // Preserve current state before recursing
                groupStack.push(curGroupState);
                curGroupState = nextGroupState;
            }

            // Skip this layer OR 'recurse' (iterative style) into the group
            continue;
        }

        curo.name = curGroupState.name + curo.name;
        var offsetX = curGroupState.x + GetFastValue(curo, 'startx', 0) + GetFastValue(curo, 'offsetx', 0);
        var offsetY = curGroupState.y + GetFastValue(curo, 'starty', 0) + GetFastValue(curo, 'offsety', 0);

        var objects = [];
        for (var j = 0; j < curo.objects.length; j++)
        {
            var parsedObject = ParseObject(curo.objects[j], offsetX, offsetY);

            objects.push(parsedObject);
        }

        var objectLayer = new ObjectLayer(curo);
        objectLayer.objects = objects;

        objectLayers.push(objectLayer);
    }

    return objectLayers;
};

module.exports = ParseObjectLayers;
