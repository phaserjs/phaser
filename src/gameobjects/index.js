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
    UpdateList: require('./UpdateList'),

    Components: require('./components'),

    BuildGameObject: require('./BuildGameObject'),
    BuildGameObjectAnimation: require('./BuildGameObjectAnimation'),
    GameObject: require('./GameObject'),
    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Graphics: require('./graphics/Graphics.js'),
    Group: require('./group/Group'),
    Image: require('./image/Image'),
    Particles: require('./particles/ParticleEmitterManager'),
    PathFollower: require('./pathfollower/PathFollower'),
    RenderTexture: require('./rendertexture/RenderTexture'),
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
        RenderTexture: require('./rendertexture/RenderTextureFactory'),
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
        RenderTexture: require('./rendertexture/RenderTextureCreator'),
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

    GameObjects.Light = require('./lights/Light');

    require('./lights/LightsManager');
    require('./lights/LightsPlugin');
}

module.exports = GameObjects;
