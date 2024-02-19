/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Body = require('./lib/body/Body');

/**
 * Creates a body using the supplied physics data, as provided by a JSON file.
 *
 * The data file should be loaded as JSON:
 *
 * ```javascript
 * preload ()
 * {
 *   this.load.json('ninjas', 'assets/ninjas.json);
 * }
 *
 * create ()
 * {
 *   const ninjaShapes = this.cache.json.get('ninjas');
 *
 *   this.matter.add.fromJSON(400, 300, ninjaShapes.shinobi);
 * }
 * ```
 *
 * Do not pass the entire JSON file to this method, but instead pass one of the shapes contained within it.
 *
 * If you pas in an `options` object, any settings in there will override those in the config object.
 *
 * The structure of the JSON file is as follows:
 *
 * ```text
 * {
 *   'generator_info': // The name of the application that created the JSON data
 *   'shapeName': {
 *     'type': // The type of body
 *     'label': // Optional body label
 *     'vertices': // An array, or an array of arrays, containing the vertex data in x/y object pairs
 *   }
 * }
 * ```
 *
 * At the time of writing, only the Phaser Physics Tracer App exports in this format.
 *
 * @namespace Phaser.Physics.Matter.PhysicsJSONParser
 * @since 3.22.0
 */
var PhysicsJSONParser = {

    /**
     * Parses a body element from the given JSON data.
     *
     * @function Phaser.Physics.Matter.PhysicsJSONParser.parseBody
     * @since 3.22.0
     *
     * @param {number} x - The horizontal world location of the body.
     * @param {number} y - The vertical world location of the body.
     * @param {object} config - The body configuration data.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {MatterJS.BodyType} A Matter JS Body.
     */
    parseBody: function (x, y, config, options)
    {
        if (options === undefined) { options = {}; }

        var body;
        var vertexSets = config.vertices;

        if (vertexSets.length === 1)
        {
            //  Just a single Body
            options.vertices = vertexSets[0];

            body = Body.create(options);

            Bodies.flagCoincidentParts(body.parts);
        }
        else
        {
            var parts = [];

            for (var i = 0; i < vertexSets.length; i++)
            {
                var part = Body.create({
                    vertices: vertexSets[i]
                });

                parts.push(part);
            }

            Bodies.flagCoincidentParts(parts);

            options.parts = parts;

            body = Body.create(options);
        }

        body.label = config.label;

        Body.setPosition(body, { x: x, y: y });

        return body;
    }

};

module.exports = PhysicsJSONParser;
