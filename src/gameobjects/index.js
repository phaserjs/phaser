/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
    DOMElement: require('./domelement/DOMElement'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Extern: require('./extern/Extern.js'),
    Graphics: require('./graphics/Graphics.js'),
    Group: require('./group/Group'),
    Image: require('./image/Image'),
    Particles: require('./particles'),
    PathFollower: require('./pathfollower/PathFollower'),
    RenderTexture: require('./rendertexture/RenderTexture'),
    RetroFont: require('./bitmaptext/RetroFont'),
    Rope: require('./rope/Rope'),
    Sprite: require('./sprite/Sprite'),
    Text: require('./text/static/Text'),
    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone'),
    Video: require('./video/Video'),

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
        DOMElement: require('./domelement/DOMElementFactory'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextFactory'),
        Extern: require('./extern/ExternFactory'),
        Graphics: require('./graphics/GraphicsFactory'),
        Group: require('./group/GroupFactory'),
        Image: require('./image/ImageFactory'),
        Particles: require('./particles/ParticleManagerFactory'),
        PathFollower: require('./pathfollower/PathFollowerFactory'),
        RenderTexture: require('./rendertexture/RenderTextureFactory'),
        Rope: require('./rope/RopeFactory'),
        Sprite: require('./sprite/SpriteFactory'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextFactory'),
        Text: require('./text/static/TextFactory'),
        TileSprite: require('./tilesprite/TileSpriteFactory'),
        Zone: require('./zone/ZoneFactory'),
        Video: require('./video/VideoFactory'),

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
        Rope: require('./rope/RopeCreator'),
        Sprite: require('./sprite/SpriteCreator'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextCreator'),
        Text: require('./text/static/TextCreator'),
        TileSprite: require('./tilesprite/TileSpriteCreator'),
        Zone: require('./zone/ZoneCreator'),
        Video: require('./video/VideoCreator')
    }

};

if (typeof WEBGL_RENDERER)
{
    //  WebGL only Game Objects
    GameObjects.Mesh = require('./mesh/Mesh');
    GameObjects.Quad = require('./quad/Quad');
    GameObjects.Shader = require('./shader/Shader');

    GameObjects.Factories.Mesh = require('./mesh/MeshFactory');
    GameObjects.Factories.Quad = require('./quad/QuadFactory');
    GameObjects.Factories.Shader = require('./shader/ShaderFactory');

    GameObjects.Creators.Mesh = require('./mesh/MeshCreator');
    GameObjects.Creators.Quad = require('./quad/QuadCreator');
    GameObjects.Creators.Shader = require('./shader/ShaderCreator');

    GameObjects.Light = require('./lights/Light');

    require('./lights/LightsManager');
    require('./lights/LightsPlugin');
}

module.exports = GameObjects;
