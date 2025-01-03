/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require('./polyfills/requestVideoFrame');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');

/**
 * @namespace Phaser
 */

var Phaser = {

    Animations: require('./animations'),
    BlendModes: require('./renderer/BlendModes'),
    Cache: require('./cache'),
    Cameras: { Scene2D: require('./cameras/2d') },
    Core: require('./core'),
    Class: require('./utils/Class'),
    Data: require('./data'),
    Display: { Masks: require('./display/mask') },
    DOM: require('./dom'),
    Events: require('./events'),
    FX: require('./fx'),
    Game: require('./core/Game'),
    GameObjects: {
        DisplayList: require('./gameobjects/DisplayList'),
        GameObjectCreator: require('./gameobjects/GameObjectCreator'),
        GameObjectFactory: require('./gameobjects/GameObjectFactory'),
        UpdateList: require('./gameobjects/UpdateList'),
        Components: require('./gameobjects/components'),
        BuildGameObject: require('./gameobjects/BuildGameObject'),
        BuildGameObjectAnimation: require('./gameobjects/BuildGameObjectAnimation'),
        GameObject: require('./gameobjects/GameObject'),
        Graphics: require('./gameobjects/graphics/Graphics'),
        Image: require('./gameobjects/image/Image'),
        Layer: require('./gameobjects/layer/Layer'),
        Sprite: require('./gameobjects/sprite/Sprite'),
        Text: require('./gameobjects/text/Text'),
        Factories: {
            Graphics: require('./gameobjects/graphics/GraphicsFactory'),
            Image: require('./gameobjects/image/ImageFactory'),
            Layer: require('./gameobjects/layer/LayerFactory'),
            Sprite: require('./gameobjects/sprite/SpriteFactory'),
            Text: require('./gameobjects/text/TextFactory')
        },
        Creators: {
            Graphics: require('./gameobjects/graphics/GraphicsCreator'),
            Image: require('./gameobjects/image/ImageCreator'),
            Layer: require('./gameobjects/layer/LayerCreator'),
            Sprite: require('./gameobjects/sprite/SpriteCreator'),
            Text: require('./gameobjects/text/TextCreator')
        }
    },
    Input: require('./input'),
    Loader: {
        FileTypes: {
            AnimationJSONFile: require('./loader/filetypes/AnimationJSONFile'),
            AtlasJSONFile: require('./loader/filetypes/AtlasJSONFile'),
            AudioFile: require('./loader/filetypes/AudioFile'),
            AudioSpriteFile: require('./loader/filetypes/AudioSpriteFile'),
            HTML5AudioFile: require('./loader/filetypes/HTML5AudioFile'),
            ImageFile: require('./loader/filetypes/ImageFile'),
            JSONFile: require('./loader/filetypes/JSONFile'),
            MultiAtlasFile: require('./loader/filetypes/MultiAtlasFile'),
            PluginFile: require('./loader/filetypes/PluginFile'),
            ScriptFile: require('./loader/filetypes/ScriptFile'),
            SpriteSheetFile: require('./loader/filetypes/SpriteSheetFile'),
            TextFile: require('./loader/filetypes/TextFile'),
            XMLFile: require('./loader/filetypes/XMLFile')
        },
        File: require('./loader/File'),
        FileTypesManager: require('./loader/FileTypesManager'),
        GetURL: require('./loader/GetURL'),
        LoaderPlugin: require('./loader/LoaderPlugin'),
        MergeXHRSettings: require('./loader/MergeXHRSettings'),
        MultiFile: require('./loader/MultiFile'),
        XHRLoader: require('./loader/XHRLoader'),
        XHRSettings: require('./loader/XHRSettings')
    },
    Math: {
        Between: require('./math/Between'),
        DegToRad: require('./math/DegToRad'),
        FloatBetween: require('./math/FloatBetween'),
        RadToDeg: require('./math/RadToDeg'),
        Vector2: require('./math/Vector2')
    },
    Plugins: require('./plugins'),
    Renderer: require('./renderer'),
    Scale: require('./scale'),
    ScaleModes: require('./renderer/ScaleModes'),
    Scene: require('./scene/Scene'),
    Scenes: require('./scene'),
    Structs: require('./structs'),
    Textures: require('./textures'),
    Time: require('./time'),
    Tweens: require('./tweens')
};

//  Merge in the optional plugins and WebGL only features

if (typeof FEATURE_SOUND)
{
    Phaser.Sound = require('./sound');
}

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

/**
 * The root types namespace.
 *
 * @namespace Phaser.Types
 * @since 3.17.0
 */

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
