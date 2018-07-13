/**
 * @author       Joachim Grill <joachim@codeandweb.com>
 * @copyright    2018 CodeAndWeb GmbH
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Bodies: any;
declare var Body: any;
declare var Bounds: any;
declare var Common: any;
declare var GetFastValue: any;
declare var Vector: any;
declare var Vertices: any;
/**
 * Use PhysicsEditorParser.parseBody() to build a Matter body object, based on a physics data file
 * created and exported with PhysicsEditor (https://www.codeandweb.com/physicseditor).
 *
 * @namespace Phaser.Physics.Matter.PhysicsEditorParser
 * @since 3.10.0
 */
declare var PhysicsEditorParser: {
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
    parseBody: (x: any, y: any, w: any, h: any, config: any) => any;
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
    parseFixture: (fixtureConfig: any) => any;
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
    parseVertices: (vertexSets: any, options: any) => any[];
};
