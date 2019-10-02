/**
 * @author       Joachim Grill <joachim@codeandweb.com>
 * @copyright    2018 CodeAndWeb GmbH
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Body = require('./lib/body/Body');
var Bounds = require('./lib/geometry/Bounds');
var Common = require('./lib/core/Common');
var GetFastValue = require('../../utils/object/GetFastValue');
var Vector = require('./lib/geometry/Vector');
var Vertices = require('./lib/geometry/Vertices');

/**
 * Use PhysicsEditorParser.parseBody() to build a Matter body object, based on a physics data file
 * created and exported with PhysicsEditor (https://www.codeandweb.com/physicseditor).
 *
 * @namespace Phaser.Physics.Matter.PhysicsEditorParser
 * @since 3.10.0
 */
var PhysicsEditorParser = {

    /**
     * Parses a body element exported by PhysicsEditor.
     *
     * @function Phaser.Physics.Matter.PhysicsEditorParser.parseBody
     * @since 3.10.0
     *
     * @param {number} x - x position.
     * @param {number} y - y position.
     * @param {number} w - width.
     * @param {number} h - height.
     * @param {object} config - body configuration and fixture (child body) definitions.
     * 
     * @return {object} A matter body, consisting of several parts (child bodies)
     */
    parseBody: function (x, y, w, h, config)
    {
        var fixtureConfigs = GetFastValue(config, 'fixtures', []);
        var fixtures = [];

        for (var fc = 0; fc < fixtureConfigs.length; fc++)
        {
            var fixtureParts = this.parseFixture(fixtureConfigs[fc]);

            for (var i = 0; i < fixtureParts.length; i++)
            {
                fixtures.push(fixtureParts[i]);
            }
        }

        var matterConfig = Common.extend({}, false, config);

        delete matterConfig.fixtures;
        delete matterConfig.type;

        var body = Body.create(matterConfig);

        Body.setParts(body, fixtures);
        body.render.sprite.xOffset = body.position.x / w;
        body.render.sprite.yOffset = body.position.y / h;
        Body.setPosition(body, { x: x, y: y });

        return body;
    },


    /**
     * Parses an element of the "fixtures" list exported by PhysicsEditor
     *
     * @function Phaser.Physics.Matter.PhysicsEditorParser.parseFixture
     * @since 3.10.0
     *
     * @param {object} fixtureConfig - the fixture object to parse
     * 
     * @return {object[]} - A list of matter bodies
     */
    parseFixture: function (fixtureConfig)
    {
        var matterConfig = Common.extend({}, false, fixtureConfig);

        delete matterConfig.circle;
        delete matterConfig.vertices;

        var fixtures;

        if (fixtureConfig.circle)
        {
            var x = GetFastValue(fixtureConfig.circle, 'x');
            var y = GetFastValue(fixtureConfig.circle, 'y');
            var r = GetFastValue(fixtureConfig.circle, 'radius');
            fixtures = [ Bodies.circle(x, y, r, matterConfig) ];
        }
        else if (fixtureConfig.vertices)
        {
            fixtures = this.parseVertices(fixtureConfig.vertices, matterConfig);
        }

        return fixtures;
    },

    /**
     * Parses the "vertices" lists exported by PhysicsEditor.
     *
     * @function Phaser.Physics.Matter.PhysicsEditorParser.parseVertices
     * @since 3.10.0
     *
     * @param {object} vertexSets - The vertex lists to parse.
     * @param {object} options - Matter body options.
     * 
     * @return {object[]} - A list of matter bodies.
     */
    parseVertices: function (vertexSets, options)
    {
        var i, j, k, v, z;
        var parts = [];

        options = options || {};

        for (v = 0; v < vertexSets.length; v += 1)
        {
            parts.push(Body.create(Common.extend({
                position: Vertices.centre(vertexSets[v]),
                vertices: vertexSets[v]
            }, options)));
        }

        // flag coincident part edges
        var coincidentMaxDist = 5;

        for (i = 0; i < parts.length; i++)
        {
            var partA = parts[i];

            for (j = i + 1; j < parts.length; j++)
            {
                var partB = parts[j];

                if (Bounds.overlaps(partA.bounds, partB.bounds))
                {
                    var pav = partA.vertices,
                        pbv = partB.vertices;

                    // iterate vertices of both parts
                    for (k = 0; k < partA.vertices.length; k++)
                    {
                        for (z = 0; z < partB.vertices.length; z++)
                        {
                            // find distances between the vertices
                            var da = Vector.magnitudeSquared(Vector.sub(pav[(k + 1) % pav.length], pbv[z])),
                                db = Vector.magnitudeSquared(Vector.sub(pav[k], pbv[(z + 1) % pbv.length]));

                            // if both vertices are very close, consider the edge concident (internal)
                            if (da < coincidentMaxDist && db < coincidentMaxDist)
                            {
                                pav[k].isInternal = true;
                                pbv[z].isInternal = true;
                            }
                        }
                    }

                }
            }
        }

        return parts;
    }
};

module.exports = PhysicsEditorParser;
