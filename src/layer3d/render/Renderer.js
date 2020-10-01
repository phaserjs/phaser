/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var RenderState = require('./RenderState');
var RenderTargetBack = require('./RenderTargetBack');
var WebGLGeometry = require('./WebGLGeometry');
var WebGLVertexArray = require('./WebGLVertexArray');
var Vector3 = require('../../math/Vector3');
var Vector4 = require('../../math/Vector4');

var tempVec3 = new Vector3();
var tempVec4 = new Vector4();

var Renderer = new Class({

    initialize:

    function Renderer (scene)
    {
        this.scene = scene;

        this.coreRenderer = scene.sys.renderer;

        this.gl = this.coreRenderer.gl;

        this.backRenderTarget = new RenderTargetBack(scene.sys.renderer.canvas);

        this.shadowMapPass;

        this.shadowAutoUpdate = false;
        this.shadowNeedsUpdate = false;

        this.matrixAutoUpdate = true;
        this.lightsAutoUpdate = true;
        this.autoClear = true;

        this._usedTextureUnits = 0;

        this.state = new RenderState(this);
        this.vertexArrayBindings = new WebGLVertexArray(this);
        this.geometry = new WebGLGeometry(this);

        /*
        this.texture = new WebGLTexture(gl, state, properties, capabilities);
        this.renderBuffer = new WebGLRenderBuffer(gl, properties, capabilities);
        this.renderTarget = new WebGLRenderTarget(gl, state, texture, renderBuffer, properties, capabilities);
        this.programs = new WebGLPrograms(gl, state, capabilities);
        */
    },

    clear: function (color, depth, stencil)
    {
        var gl = this.gl;

        var bits = 0;

        if (color === undefined || color) { bits |= gl.COLOR_BUFFER_BIT; }
        if (depth === undefined || depth) { bits |= gl.DEPTH_BUFFER_BIT; }
        if (stencil === undefined || stencil) { bits |= gl.STENCIL_BUFFER_BIT; }

        gl.clear(bits);
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
    },

    renderPass: function (renderList, camera, config)
    {
        // var gl = this.gl;
        var state = this.state;

        //  Remove all of these:
        // var getMaterial = config.getMaterial || defaultGetMaterial;
        // var beforeRender = config.beforeRender || NOOP;
        // var afterRender = config.afterRender || NOOP;
        // var ifRender = config.ifRender || defaultIfRender;

        //  Pass this into the function, not via a config
        var scene = config.scene || {};

        var currentRenderTarget = state.currentRenderTarget;

        for (var i = 0; i < renderList.length; i++)
        {
            var renderItem = renderList[i];

            //  Skip non-visible item, or item that cannot render (or should we just not put them in the list at all?)

            var object = renderItem.object;
            var material = renderItem.material;
            var geometry = renderItem.geometry;

            // var group = renderItem.group;

            //  pre-render callback for object / material

            material.update(scene, camera, object);

            var program = material.program;

            state.setProgram(program);

            this.geometry.setGeometry(geometry);
            this.vertexArrayBindings.setup(object, geometry, program);

            var uniforms = this.updateUniforms(scene, camera, material, object);

            if (material.acceptLight && scene.lights)
            {
                //  TODO ----------------------------------------------------------------------------------
                this.uploadLights(uniforms, scene.lights, object.receiveShadow, camera);
            }

            //  Set State
            var frontFaceCW = object.worldMatrix.determinant() < 0;

            this.setStates(material, frontFaceCW);

            var w = currentRenderTarget.width;
            var h = currentRenderTarget.height;

            var viewport = tempVec4.set(w, h, w, h).multiply(camera.rect);

            viewport.z -= viewport.x;
            viewport.w -= viewport.y;

            viewport.x = Math.floor(viewport.x);
            viewport.y = Math.floor(viewport.y);
            viewport.z = Math.floor(viewport.z);
            viewport.w = Math.floor(viewport.w);

            //   Draw
            state.viewport(viewport.x, viewport.y, viewport.z, viewport.w);

            // this.draw(geometry, material, group);
            this.draw(geometry, material);

            //  Reset
            this.vertexArrayBindings.resetBinding();

            this._usedTextureUnits = 0;

            // Ensure depth buffer writing is enabled so it can be cleared on next render

            state.depthBuffer.setTest(true);
            state.depthBuffer.setMask(true);
            state.colorBuffer.setMask(true);

            //  post-render callback for object / material
        }
    },

    updateUniforms: function (scene, camera, material, object)
    {
        var program = material.program;
        var uniforms = program.uniforms;

        for (var n = 0; n < uniforms.seq.length; n++)
        {
            var uniform = uniforms.seq[n];
            var key = uniform.id;

            // upload custom uniforms
            if (material.uniforms && material.uniforms[key] !== undefined)
            {
                uniform.set(material.uniforms[key], this);
                continue;
            }

            switch (key)
            {
                case 'u_Projection':
                    uniform.set(camera.projectionMatrix.val);
                    break;

                case 'u_View':
                    uniform.set(camera.viewMatrix.val);
                    break;

                case 'u_Model':
                    uniform.set(object.worldMatrix.val);
                    break;

                case 'u_Color':
                    var diffuse = material.diffuse;
                    uniform.setValue(diffuse.r, diffuse.g, diffuse.b);
                    break;

                case 'u_Opacity':
                    uniform.set(material.opacity);
                    break;

                case 'diffuseMap':
                    uniform.set(material.diffuseMap, this);
                    break;

                case 'alphaMap':
                    uniform.set(material.alphaMap, this);
                    break;

                case 'normalMap':
                    uniform.set(material.normalMap, this);
                    break;

                case 'bumpMap':
                    uniform.set(material.bumpMap, this);
                    break;

                case 'bumpScale':
                    uniform.set(material.bumpScale);
                    break;

                case 'envMap':
                    uniform.set(material.envMap, this);
                    break;

                case 'cubeMap':
                    uniform.set(material.cubeMap, this);
                    break;

                case 'u_EnvMap_Intensity':
                    uniform.set(material.envMapIntensity);
                    break;

                case 'maxMipLevel':
                    uniform.set(this.properties.get(material.envMap).__maxMipLevel || 0);
                    break;

                case 'u_Specular':
                    uniform.set(material.shininess);
                    break;

                case 'u_SpecularColor':
                    var specular = material.specular;
                    uniform.setValue(specular.r, specular.g, specular.b);
                    break;

                case 'specularMap':
                    uniform.set(material.specularMap, this);
                    break;

                case 'aoMap':
                    uniform.set(material.aoMap, this);
                    break;

                case 'aoMapIntensity':
                    uniform.set(material.aoMapIntensity);
                    break;

                case 'u_Roughness':
                    uniform.set(material.roughness);
                    break;

                case 'roughnessMap':
                    uniform.set(material.roughnessMap, this);
                    break;

                case 'u_Metalness':
                    uniform.set(material.metalness);
                    break;

                case 'metalnessMap':
                    uniform.set(material.metalnessMap, this);
                    break;

                case 'glossiness':
                    uniform.set(material.glossiness);
                    break;

                case 'glossinessMap':
                    uniform.set(material.glossinessMap, this);
                    break;

                case 'emissive':
                    var emissive = material.emissive;
                    var intensity = material.emissiveIntensity;
                    uniform.setValue(emissive.r * intensity, emissive.g * intensity, emissive.b * intensity);
                    break;

                case 'emissiveMap':
                    uniform.set(material.emissiveMap, this);
                    break;

                case 'u_CameraPosition':
                    tempVec3.setFromMatrixPosition(camera.worldMatrix);
                    uniform.setValue(tempVec3.x, tempVec3.y, tempVec3.z);
                    break;

                case 'u_FogColor':
                    var fog = scene.fog.color;
                    uniform.setValue(fog.r, fog.g, fog.b);
                    break;

                case 'u_FogDensity':
                    uniform.set(scene.fog.density);
                    break;

                case 'u_FogNear':
                    uniform.set(scene.fog.near);
                    break;

                case 'u_FogFar':
                    uniform.set(scene.fog.far);
                    break;

                case 'u_PointSize':
                    uniform.set(material.size);
                    break;

                    // case 'u_PointScale':
                    //     var scale = currentRenderTarget.height * 0.5;
                    //     uniform.set(scale);
                    //     break;

                case 'dashSize':
                    uniform.set(material.dashSize);
                    break;

                case 'totalSize':
                    uniform.set(material.dashSize + material.gapSize);
                    break;

                case 'scale':
                    uniform.set(material.scale);
                    break;

                case 'matcap':
                    uniform.set(material.matcap, this);
                    break;

                    // case 'clippingPlanes':
                    //     var planesData = getClippingPlanesData(scene.clippingPlanes || [], camera);
                    //     uniform.set(planesData);
                    //     break;

                case 'uvTransform':
                    var uvScaleMap;
                    uvScaleMap = material.diffuseMap ||
                        material.specularMap || material.normalMap || material.bumpMap ||
                        material.roughnessMap || material.metalnessMap || material.emissiveMap;
                    if (uvScaleMap)
                    {
                        if (uvScaleMap.matrixAutoUpdate)
                        {
                            uvScaleMap.updateMatrix();
                        }

                        uniform.set(uvScaleMap.matrix.val);
                    }
                    break;

                case 'alphaMapUVTransform':
                    material.alphaMap.updateMatrix();
                    uniform.set(material.alphaMap.matrix.val);
                    break;
            }
        }

        return uniforms;
    },

    setStates: function (material, frontFaceCW)
    {
        var state = this.state;

        // set draw side
        state.setCullFace(
            (material.side === CONST.DRAW_SIDE.DOUBLE) ? CONST.CULL_FACE_TYPE.NONE : CONST.CULL_FACE_TYPE.BACK
        );

        var flipSided = (material.side === CONST.DRAW_SIDE.BACK);

        if (frontFaceCW)
        {
            flipSided = !flipSided;
        }

        state.setFlipSided(flipSided);

        if (material.transparent)
        {
            state.setBlend(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha);
        }
        else
        {
            state.setBlend(CONST.BLEND_TYPE.NONE);
        }

        state.depthBuffer.setFunc(material.depthFunc);
        state.depthBuffer.setTest(material.depthTest);
        state.depthBuffer.setMask(material.depthWrite);
        state.colorBuffer.setMask(material.colorWrite);

        var stencilTest = material.stencilTest;

        state.stencilBuffer.setTest(stencilTest);

        if (stencilTest)
        {
            state.stencilBuffer.setMask(material.stencilWriteMask);
            state.stencilBuffer.setFunc(material.stencilFunc, material.stencilRef, material.stencilFuncMask, material.stencilFuncBack, material.stencilRefBack, material.stencilFuncMaskBack);
            state.stencilBuffer.setOp(material.stencilFail, material.stencilZFail, material.stencilZPass, material.stencilFailBack, material.stencilZFailBack, material.stencilZPassBack);
        }

        state.setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);

        if (material.lineWidth !== undefined)
        {
            state.setLineWidth(material.lineWidth);
        }
    },

    // draw: function (geometry, material, group)
    draw: function (geometry, material)
    {
        var gl = this.gl;

        // var properties = this.properties;
        // var capabilities = this.capabilities;

        var instancedArraysExtension = this.coreRenderer.instancedArraysExtension;
        var useIndexBuffer = geometry.index !== null;

        var drawStart = 0;
        var drawCount = useIndexBuffer ? geometry.index.count : geometry.getAttribute('a_Position').count;

        // var groupStart = group ? group.start : 0;
        // var groupCount = group ? group.count : Infinity;

        // drawStart = Math.max(drawStart, groupStart);
        // drawCount = Math.min(drawCount, groupCount);

        if (useIndexBuffer)
        {
            var indexProperty = properties.get(geometry.index);
            var bytesPerElement = indexProperty.bytesPerElement;
            var type = indexProperty.type;

            if (geometry.isInstancedGeometry && geometry.maxInstancedCount > 0 && instancedArraysExtension)
            {
                instancedArraysExtension.drawElementsInstancedANGLE(material.drawMode, drawCount, type, drawStart * bytesPerElement, geometry.maxInstancedCount);
            }
            else
            {
                gl.drawElements(material.drawMode, drawCount, type, drawStart * bytesPerElement);
            }
        }
        else if (geometry.isInstancedGeometry)
        {
            if (geometry.maxInstancedCount > 0 && instancedArraysExtension)
            {
                instancedArraysExtension.drawArraysInstancedANGLE(material.drawMode, drawStart, drawCount, geometry.maxInstancedCount);
            }
        }
        else
        {
            gl.drawArrays(material.drawMode, drawStart, drawCount);
        }
    }

});

module.exports = Renderer;
