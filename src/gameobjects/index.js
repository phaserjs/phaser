/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.GameObjects
 */

var GameObjects = {

    Events: require('./events'),

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
    Container: require('./container/Container'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Extern: require('./extern/Extern.js'),
    Graphics: require('./graphics/Graphics.js'),
    Group: require('./group/Group'),
    Image: require('./image/Image'),
    Particles: require('./particles'),
    PathFollower: require('./pathfollower/PathFollower'),
    RenderTexture: require('./rendertexture/RenderTexture'),
    RetroFont: require('./bitmaptext/RetroFont'),
    Sprite: require('./sprite/Sprite'),
    Text: require('./text/static/Text'),
    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone'),

    //  Shapes

    Shape: require('./shape/Shape'),
    Arc: require('./shape/arc/Arc'),
    Curve: require('./shape/curve/Curve'),
    Ellipse: require('./shape/ellipse/Ellipse'),
    Grid: require('./shape/grid/Grid'),
    IsoBox: require('./shape/isobox/IsoBox'),
    IsoTriangle: require('./shape/isotriangle/IsoTriangle'),
    Line: require('./shape/line/Line'),
    Polygon: require('./shape/polygon/Polygon'),
    Rectangle: require('./shape/rectangle/Rectangle'),
    Star: require('./shape/star/Star'),
    Triangle: require('./shape/triangle/Triangle'),

    //  Game Object Factories

    Factories: {
        Blitter: require('./blitter/BlitterFactory'),
        Container: require('./container/ContainerFactory'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextFactory'),
        Extern: require('./extern/ExternFactory'),
        Graphics: require('./graphics/GraphicsFactory'),
        Group: require('./group/GroupFactory'),
        Image: require('./image/ImageFactory'),
        Particles: require('./particles/ParticleManagerFactory'),
        PathFollower: require('./pathfollower/PathFollowerFactory'),
        RenderTexture: require('./rendertexture/RenderTextureFactory'),
        Sprite: require('./sprite/SpriteFactory'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextFactory'),
        Text: require('./text/static/TextFactory'),
        TileSprite: require('./tilesprite/TileSpriteFactory'),
        Zone: require('./zone/ZoneFactory'),

        //  Shapes
        Arc: require('./shape/arc/ArcFactory'),
        Curve: require('./shape/curve/CurveFactory'),
        Ellipse: require('./shape/ellipse/EllipseFactory'),
        Grid: require('./shape/grid/GridFactory'),
        IsoBox: require('./shape/isobox/IsoBoxFactory'),
        IsoTriangle: require('./shape/isotriangle/IsoTriangleFactory'),
        Line: require('./shape/line/LineFactory'),
        Polygon: require('./shape/polygon/PolygonFactory'),
        Rectangle: require('./shape/rectangle/RectangleFactory'),
        Star: require('./shape/star/StarFactory'),
        Triangle: require('./shape/triangle/TriangleFactory')
    },

    Creators: {
        Blitter: require('./blitter/BlitterCreator'),
        Container: require('./container/ContainerCreator'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextCreator'),
        Graphics: require('./graphics/GraphicsCreator'),
        Group: require('./group/GroupCreator'),
        Image: require('./image/ImageCreator'),
        Particles: require('./particles/ParticleManagerCreator'),
        RenderTexture: require('./rendertexture/RenderTextureCreator'),
        Sprite: require('./sprite/SpriteCreator'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextCreator'),
        Text: require('./text/static/TextCreator'),
        TileSprite: require('./tilesprite/TileSpriteCreator'),
        Zone: require('./zone/ZoneCreator')
    }

};

if (typeof EXPERIMENTAL)
{
    GameObjects.DOMElement = require('./domelement/DOMElement');
    GameObjects.Factories.DOMElement = require('./domelement/DOMElementFactory');
}

if (typeof WEBGL_RENDERER)
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
