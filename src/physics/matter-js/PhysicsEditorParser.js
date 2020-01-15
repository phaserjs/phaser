/**
 * @author       Joachim Grill <joachim@codeandweb.com>
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 CodeAndWeb GmbH
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Body = require('./lib/body/Body');
var Common = require('./lib/core/Common');
var GetFastValue = require('../../utils/object/GetFastValue');
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
     * Parses an element of the "fixtures" list exported by PhysicsEditor
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
     * Parses the "vertices" lists exported by PhysicsEditor.
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
