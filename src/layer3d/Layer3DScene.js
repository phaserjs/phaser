/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Components = require('../gameobjects/components');
var CONST = require('../renderer/webgl/pipelines/const');
var GameObject = require('../gameobjects/GameObject');
var GameObject3D = require('./GameObject3D');
var GameObjectEvents = require('../gameobjects/events');
var Layer3DRender = require('./Layer3DSceneRender');
var RenderList = require('./render/RenderList');

//  Namespace: Phaser.Layer3D
//  Class: Layer3DScene

var Layer3DScene = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        Components.Size,
        Layer3DRender
    ],

    initialize:

    function Layer3DScene (scene, x, y)
    {
        GameObject.call(this, scene, 'Layer3DScene');

        var renderer = scene.sys.renderer;

        this.world = new GameObject3D();

        this.overrideMaterial = null;

        this.fog = null;

        this.clippingPlanes = [];

        // this.lights = new LightCache();

        this.renderListMap = new WeakMap();

        //  This will be an fbo:
        this.setPosition(x, y);
        this.setSize(renderer.width, renderer.height);
        this.initPipeline(CONST.MULTI_PIPELINE);

        this.on(GameObjectEvents.ADDED_TO_SCENE, this.addedToScene, this);
        this.on(GameObjectEvents.REMOVED_FROM_SCENE, this.removedFromScene, this);
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    updateRenderList: function (camera)
    {
        if (!this.renderListMap.has(camera))
        {
            this.renderListMap.set(camera, new RenderList());
        }

        var renderList = this.renderListMap.get(camera);

        renderList.startCount();

        this.doUpdateRenderList(this, camera, renderList);

        renderList.endCount();

        renderList.sort();

        return renderList;
    },

    getRenderList: function (camera)
    {
        return this.renderListMap.get(camera);
    },

    updateLights: function ()
    {
        var lights = this.lights;

        lights.startCount();

        this.doUpdateLights(this);

        lights.endCount();

        return lights;
    },

    doUpdateRenderList: function (object, camera, renderList)
    {
        if (!object.visible)
        {
            return;
        }

        if (!!object.geometry && !!object.material)
        {
            renderList.add(object, camera);
        }

        var children = object.children;

        for (var i = 0; i < children.length; i++)
        {
            this.doUpdateRenderList(children[i], camera, renderList);
        }
    },

    doUpdateLights: function (object)
    {
        if (!object.visible)
        {
            return;
        }

        if (object.type === 'light')
        {
            this.lights.add(object);
        }

        var children = object.children;

        for (var i = 0; i < children.length; i++)
        {
            this.doUpdateLights(children[i]);
        }
    },

    /**
     * The destroy step for this Layer3D, which removes all models, destroys the camera and
     * nulls external references.
     *
     * @method Phaser.GameObjects.Layer3D#preDestroy
     * @private
     * @since 3.50.0
     */
    preDestroy: function ()
    {
        // this.clearModels();

        // this.camera.destroy();
        // this.light.destroy();

        // this.camera = null;
        // this.light = null;
    }

});

module.exports = Layer3DScene;
