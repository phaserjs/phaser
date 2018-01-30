//  These plugins are created in Scene.Systems by default, in addition to the CoreScenePlugins.
//  You can elect not to have these plugins by either creating a DefaultPlugins object as part
//  of the Game Config, or by creating a Plugins object as part of a Scene Config.
//  They are optionally exposed in the Scene as well (see the InjectionMap for details)

//  They are always created in the order in which they appear in the array.

var DefaultScenePlugins = [

    'CameraManager3D',
    'Clock',
    'DataManagerPlugin',
    'InputPlugin',
    'Loader',
    'TweenManager'

];

module.exports = DefaultScenePlugins;
