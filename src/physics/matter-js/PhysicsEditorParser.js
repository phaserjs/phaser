/**
 * @author       Joachim Grill <joachim@codeandweb.com>
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2018 CodeAndWeb GmbH
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Body = require('./lib/body/Body');
var Common = require('./lib/core/Common');
var GetFastValue = require('../../utils/object/GetFastValue');
var Vertices = require('./lib/geometry/Vertices');

/**
 * A namespace containing methods for parsing body and fixture data exported from PhysicsEditor
 * (https://www.codeandweb.com/physicseditor), a visual collision shape editor for game sprites.
 *
 * Use `PhysicsEditorParser.parseBody()` to build a compound Matter.js body from a physics data file
 * created and exported by PhysicsEditor. The exported JSON describes the body's fixtures (child
 * bodies), each of which can be a circle or a set of convex polygon vertices. The parser assembles
 * all fixtures into a single compound Matter.js body positioned at the given world coordinates.
 *
 * @namespace Phaser.Physics.Matter.PhysicsEditorParser
 * @since 3.10.0
 */
var PhysicsEditorParser = {

    /**
     * Parses a body configuration exported by PhysicsEditor and creates a compound Matter.js body
     * from it. Each fixture definition in the configuration is parsed and converted into a child
     * body (either a circle or a convex polygon), and all child bodies are combined into a single
     * compound body positioned at the given world coordinates. Additional Matter.js body properties
     * can be supplied via the `options` argument and will be merged into the body configuration.
     *
     * @function Phaser.Physics.Matter.PhysicsEditorParser.parseBody
     * @since 3.10.0
     *
     * @param {number} x - The horizontal world location of the body.
     * @param {number} y - The vertical world location of the body.
     * @param {object} config - The body configuration and fixture (child body) definitions, as exported by PhysicsEditor.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {MatterJS.BodyType} A compound Matter JS Body.
     */
    parseBody: function (x, y, config, options)
    {
        if (options === undefined) { options = {}; }

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

        var matterConfig = Common.clone(config, true);

        Common.extend(matterConfig, options, true);

        delete matterConfig.fixtures;
        delete matterConfig.type;

        var body = Body.create(matterConfig);

        Body.setParts(body, fixtures);

        Body.setPosition(body, { x: x, y: y });

        return body;
    },

    /**
     * Parses a single fixture entry from the "fixtures" list exported by PhysicsEditor. A fixture
     * can describe either a circle (defined by a centre position and radius) or a set of convex
     * polygon vertex lists. The appropriate Matter.js body or bodies are created and returned as
     * an array so they can be combined into a compound body by the caller.
     *
     * @function Phaser.Physics.Matter.PhysicsEditorParser.parseFixture
     * @since 3.10.0
     *
     * @param {object} fixtureConfig - The fixture object to parse.
     *
     * @return {MatterJS.BodyType[]} - An array of Matter JS Bodies.
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
     * Parses one or more vertex sets exported by PhysicsEditor and creates a Matter.js body for
     * each set. Before creating each body, the vertices are sorted into clockwise winding order
     * and the body is positioned at the centroid of the vertex set. After all bodies are created,
     * coincident edges between adjacent parts are flagged so that Matter.js can handle them
     * correctly during collision detection.
     *
     * @function Phaser.Physics.Matter.PhysicsEditorParser.parseVertices
     * @since 3.10.0
     *
     * @param {array} vertexSets - The vertex lists to parse.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {MatterJS.BodyType[]} - An array of Matter JS Bodies.
     */
    parseVertices: function (vertexSets, options)
    {
        if (options === undefined) { options = {}; }

        var parts = [];

        for (var v = 0; v < vertexSets.length; v++)
        {
            Vertices.clockwiseSort(vertexSets[v]);

            parts.push(Body.create(Common.extend({
                position: Vertices.centre(vertexSets[v]),
                vertices: vertexSets[v]
            }, options)));
        }

        // flag coincident part edges
        return Bodies.flagCoincidentParts(parts);
    }
};

module.exports = PhysicsEditorParser;
