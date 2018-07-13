/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Bodies: any;
declare var Body: any;
declare var GetFastValue: any;
declare var PhysicsEditorParser: {
    parseBody: (x: any, y: any, w: any, h: any, config: any) => any;
    parseFixture: (fixtureConfig: any) => any;
    parseVertices: (vertexSets: any, options: any) => any[];
};
/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.SetBody
 * @since 3.0.0
 */
declare var SetBody: {
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setRectangle
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {object} options - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setRectangle: (width: any, height: any, options: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setCircle
     * @since 3.0.0
     *
     * @param {number} radius - [description]
     * @param {object} options - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCircle: (radius: any, options: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setPolygon
     * @since 3.0.0
     *
     * @param {number} radius - [description]
     * @param {number} sides - [description]
     * @param {object} options - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setPolygon: (radius: any, sides: any, options: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setTrapezoid
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} slope - [description]
     * @param {object} options - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setTrapezoid: (width: any, height: any, slope: any, options: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setExistingBody
     * @since 3.0.0
     *
     * @param {MatterJS.Body} body - [description]
     * @param {boolean} [addToWorld=true] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setExistingBody: (body: any, addToWorld: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setBody
     * @since 3.0.0
     *
     * @param {object} config - [description]
     * @param {object} options - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setBody: (config: any, options: any) => any;
};
