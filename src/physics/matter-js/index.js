/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Physics.Matter
 */

module.exports = {

    BodyBounds: require('./BodyBounds'),
    Factory: require('./Factory'),
    Image: require('./MatterImage'),
    Matter: require('./CustomMain'),
    MatterPhysics: require('./MatterPhysics'),
    PolyDecomp: require('./poly-decomp'),
    Sprite: require('./MatterSprite'),
    TileBody: require('./MatterTileBody'),
    PhysicsEditorParser: require('./PhysicsEditorParser'),
    PhysicsJSONParser: require('./PhysicsJSONParser'),
    World: require('./World')

};
