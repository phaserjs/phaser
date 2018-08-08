/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

require('./polyfills');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');

/**
 * @namespace Phaser
 */

var Phaser = {

    Animation: require('./animations'),
    Cache: require('./cache'),
    Cameras: { Scene2D: require('./cameras/2d') },
    Class: require('./utils/Class'),
    Data: require('./data'),
    Display: { Masks: require('./display/mask') },
    Events: require('./events'),
    Game: require('./boot/Game'),
    GameObjects: {
        DisplayList: require('./gameobjects/DisplayList'),
        GameObjectCreator: require('./gameobjects/GameObjectCreator'),
        GameObjectFactory: require('./gameobjects/GameObjectFactory'),
        UpdateList: require('./gameobjects/UpdateList'),
        Components: require('./gameobjects/components'),
        BuildGameObject: require('./gameobjects/BuildGameObject'),
        BuildGameObjectAnimation: require('./gameobjects/BuildGameObjectAnimation'),
        GameObject: require('./gameobjects/GameObject'),
        Graphics: require('./gameobjects/graphics/Graphics.js'),
        Image: require('./gameobjects/image/Image'),
        Sprite: require('./gameobjects/sprite/Sprite'),
        Text: require('./gameobjects/text/static/Text'),
        Factories: {
            Graphics: require('./gameobjects/graphics/GraphicsFactory'),
            Image: require('./gameobjects/image/ImageFactory'),
            Sprite: require('./gameobjects/sprite/SpriteFactory'),
            Text: require('./gameobjects/text/static/TextFactory')
        },
        Creators: {
            Graphics: require('./gameobjects/graphics/GraphicsCreator'),
            Image: require('./gameobjects/image/ImageCreator'),
            Sprite: require('./gameobjects/sprite/SpriteCreator'),
            Text: require('./gameobjects/text/static/TextCreator')
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
    Scene: require('./scene/Scene'),
    Scenes: require('./scene'),
    Sound: require('./sound'),
    Structs: require('./structs'),
    Textures: require('./textures'),
    Time: require('./time'),
    Tweens: require('./tweens')
};

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
