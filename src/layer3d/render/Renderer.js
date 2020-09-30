/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var RenderTargetBack = require('./RenderTargetBack');

var Renderer = new Class({

    initialize:

    function Renderer (scene)
    {
        this.scene = scene;

        this.gl = scene.sys.renderer.gl;

        this.backRenderTarget = new RenderTargetBack(scene.sys.renderer.canvas);

        this.shadowMapPass;

        this.shadowAutoUpdate = false;
        this.shadowNeedsUpdate = false;

        this.matrixAutoUpdate = true;
        this.lightsAutoUpdate = true;
        this.autoClear = true;

        /*
        var properties = new WebGLProperties();

        this.properties = properties;

        var capabilities = new WebGLCapabilities(gl);

        this.capabilities = capabilities;

        var state = new WebGLState(gl, capabilities);

        this.state = state;

        var vertexArrayBindings = new WebGLVertexArrayBindings(gl, properties, capabilities);

        this.vertexArrayBindings = vertexArrayBindings;

        var texture = new WebGLTexture(gl, state, properties, capabilities);

        this.texture = texture;

        var renderBuffer = new WebGLRenderBuffer(gl, properties, capabilities);

        this.renderTarget = new WebGLRenderTarget(gl, state, texture, renderBuffer, properties, capabilities);

        this.geometry = new WebGLGeometry(gl, state, vertexArrayBindings, properties, capabilities);

        this.programs = new WebGLPrograms(gl, state, capabilities);

        this._usedTextureUnits = 0;
        */
    },

    render: function (scene, camera, renderTarget, forceClear)
    {
        if (renderTarget === undefined) { renderTarget = this.backRenderTarget; }

        if (this.matrixAutoUpdate)
        {
            scene.updateMatrix();
        }

        if (this.lightsAutoUpdate)
        {
            scene.updateLights();
        }

        /*
        if (this.shadowAutoUpdate || this.shadowNeedsUpdate)
        {
            this.shadowMapPass.render(this.glCore, scene);

            this.shadowNeedsUpdate = false;
        }
        */

        // this.renderTarget.setRenderTarget(renderTarget);

        if (this.autoClear || forceClear)
        {
            this.clear(true, true, true);
        }

        var renderList = scene.updateRenderList(camera);

        //  TODO - Avoid object creation each frame:
        this.renderPass(renderList.opaque, camera, {
            scene: scene,
            getMaterial: function (renderable)
            {
                return scene.overrideMaterial || renderable.material;
            }
        });

        //  TODO - Avoid object creation each frame:
        this.renderPass(renderList.transparent, camera, {
            scene: scene,
            getMaterial: function (renderable)
            {
                return scene.overrideMaterial || renderable.material;
            }
        });

        if (renderTarget.texture)
        {
            renderTarget.updateRenderTargetMipmap(renderTarget);
        }
    }

});

module.exports = Renderer;
