/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.GameObjects
 */

var GameObjects = {

    DisplayList: require('./DisplayList'),
    GameObjectCreator: require('./GameObjectCreator'),
    GameObjectFactory: require('./GameObjectFactory'),
    LightsManager: require('./LightsManager'),
    LightsPlugin: require('./LightsPlugin'),
    UpdateList: require('./UpdateList'),

    Components: require('./components'),

    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Graphics: require('./graphics/Graphics.js'),
    Group: require('./group/Group'),
    Image: require('./image/Image'),
    Particles: require('./particles/ParticleEmitterManager'),
    PathFollower: require('./pathfollower/PathFollower'),
    Sprite3D: require('./sprite3d/Sprite3D'),
    Sprite: require('./sprite/Sprite'),
    Text: require('./text/static/Text'),
    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone'),

    //  Game Object Factories

    Factories: {
        Blitter: require('./blitter/BlitterFactory'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextFactory'),
        Graphics: require('./graphics/GraphicsFactory'),
        Group: require('./group/GroupFactory'),
        Image: require('./image/ImageFactory'),
        Particles: require('./particles/ParticleManagerFactory'),
        PathFollower: require('./pathfollower/PathFollowerFactory'),
        Sprite3D: require('./sprite3d/Sprite3DFactory'),
        Sprite: require('./sprite/SpriteFactory'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextFactory'),
        Text: require('./text/static/TextFactory'),
        TileSprite: require('./tilesprite/TileSpriteFactory'),
        Zone: require('./zone/ZoneFactory')
    },

    Creators: {
        Blitter: require('./blitter/BlitterCreator'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextCreator'),
        Graphics: require('./graphics/GraphicsCreator'),
        Group: require('./group/GroupCreator'),
        Image: require('./image/ImageCreator'),
        Particles: require('./particles/ParticleManagerCreator'),
        Sprite3D: require('./sprite3d/Sprite3DCreator'),
        Sprite: require('./sprite/SpriteCreator'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextCreator'),
        Text: require('./text/static/TextCreator'),
        TileSprite: require('./tilesprite/TileSpriteCreator'),
        Zone: require('./zone/ZoneCreator')
    }

};

if (WEBGL_RENDERER)
{
    //  WebGL only Game Objects
    GameObjects.Mesh = require('./mesh/Mesh');
    GameObjects.Quad = require('./quad/Quad');

    GameObjects.Factories.Mesh = require('./mesh/MeshFactory');
    GameObjects.Factories.Quad = require('./quad/QuadFactory');

    GameObjects.Creators.Mesh = require('./mesh/MeshCreator');
    GameObjects.Creators.Quad = require('./quad/QuadCreator');
}

module.exports = GameObjects;
