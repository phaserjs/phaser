/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
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
    GetCalcMatrix: require('./GetCalcMatrix'),

    BuildGameObject: require('./BuildGameObject'),
    BuildGameObjectAnimation: require('./BuildGameObjectAnimation'),
    GameObject: require('./GameObject'),
    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    Bob: require('./blitter/Bob'),
    Container: require('./container/Container'),
    DOMElement: require('./domelement/DOMElement'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Extern: require('./extern/Extern.js'),
    Graphics: require('./graphics/Graphics.js'),
    Group: require('./group/Group'),
    Image: require('./image/Image'),
    Layer: require('./layer/Layer'),
    Particles: require('./particles'),
    PathFollower: require('./pathfollower/PathFollower'),
    RenderTexture: require('./rendertexture/RenderTexture'),
    RetroFont: require('./bitmaptext/RetroFont'),
    Rope: require('./rope/Rope'),
    Sprite: require('./sprite/Sprite'),

    Text: require('./text/Text'),
    GetTextSize: require('./text/GetTextSize'),
    MeasureText: require('./text/MeasureText'),
    TextStyle: require('./text/TextStyle'),

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
        Layer: require('./layer/LayerFactory'),
        Particles: require('./particles/ParticleManagerFactory'),
        PathFollower: require('./pathfollower/PathFollowerFactory'),
        RenderTexture: require('./rendertexture/RenderTextureFactory'),
        Rope: require('./rope/RopeFactory'),
        Sprite: require('./sprite/SpriteFactory'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextFactory'),
        Text: require('./text/TextFactory'),
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
        Layer: require('./layer/LayerCreator'),
        Particles: require('./particles/ParticleManagerCreator'),
        RenderTexture: require('./rendertexture/RenderTextureCreator'),
        Rope: require('./rope/RopeCreator'),
        Sprite: require('./sprite/SpriteCreator'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextCreator'),
        Text: require('./text/TextCreator'),
        TileSprite: require('./tilesprite/TileSpriteCreator'),
        Zone: require('./zone/ZoneCreator'),
        Video: require('./video/VideoCreator')
    }

};

//  WebGL only Game Objects
if (typeof WEBGL_RENDERER)
{
    GameObjects.Shader = require('./shader/Shader');
    GameObjects.Mesh = require('./mesh/Mesh');
    GameObjects.NineSlice = require('./nineslice/NineSlice');
    GameObjects.PointLight = require('./pointlight/PointLight');

    GameObjects.Factories.Shader = require('./shader/ShaderFactory');
    GameObjects.Factories.Mesh = require('./mesh/MeshFactory');
    GameObjects.Factories.NineSlice = require('./nineslice/NineSliceFactory');
    GameObjects.Factories.PointLight = require('./pointlight/PointLightFactory');

    GameObjects.Creators.Shader = require('./shader/ShaderCreator');
    GameObjects.Creators.Mesh = require('./mesh/MeshCreator');
    GameObjects.Creators.NineSlice = require('./nineslice/NineSliceCreator');
    GameObjects.Creators.PointLight = require('./pointlight/PointLightCreator');

    GameObjects.Light = require('./lights/Light');
    GameObjects.LightsManager = require('./lights/LightsManager');
    GameObjects.LightsPlugin = require('./lights/LightsPlugin');
}

module.exports = GameObjects;
