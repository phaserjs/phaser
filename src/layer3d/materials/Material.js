/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');
var Class = require('../../utils/Class');
var RGB = require('../math/RGB');

var materialId = 0;

var Material = new Class({

    initialize:

    function Material ()
    {
        this.id = materialId++;

        this.type = '';

        /**
         * Override the renderer's default precision for this material.
         * Can be "highp", "mediump" or "lowp".
         */
        this.precision = null;

        /**
         * Float in the range of 0.0 - 1.0 indicating how transparent the material is.
         * A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
         */
        this.opacity = 1;

        /**
         * Defines whether this material is transparent.
         * This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects.
         * When set to true, the extent to which the material is transparent is controlled by setting it's blending property.
         */
        this.transparent = false;

        /**
         * Which blending to use when displaying objects with this material.
         * This must be set to BLEND_TYPE.CUSTOM to use custom blendSrc, blendDst or blendEquation.
         */
        this.blending = CONST.BLEND_TYPE.NORMAL;

        /**
         * Blending source.
         * `blending` must be set to BLEND_TYPE.CUSTOM for this to have any effect.
         */
        this.blendSrc = CONST.BLEND_FACTOR.SRC_ALPHA;

        /**
         * Blending destination.
         * `blending` must be set to BLEND_TYPE.CUSTOM for this to have any effect.
         */
        this.blendDst = CONST.BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;

        /**
         * Blending equation to use when applying blending.
         * `blending` must be set to BLEND_TYPE.CUSTOM for this to have any effect.
         */
        this.blendEquation = CONST.BLEND_EQUATION.ADD;

        /**
         * The transparency of the blendSrc.
         * `blending` must be set to BLEND_TYPE.CUSTOM for this to have any effect.
         */
        this.blendSrcAlpha = null;

        /**
         * The transparency of the `blendDst`.
         * `blending` must be set to BLEND_TYPE.CUSTOM for this to have any effect.
         */
        this.blendDstAlpha = null;

        /**
         * The tranparency of the `blendEquation`.
         * `blending` must be set to BLEND_TYPE.CUSTOM for this to have any effect.
         * @type {BLEND_EQUATION}
         */
        this.blendEquationAlpha = null;

        /**
         * Whether to premultiply the alpha (transparency) value.
         */
        this.premultipliedAlpha = false;

        /**
         * Defines whether vertex coloring is used.
         */
        this.vertexColors = CONST.VERTEX_COLOR.NONE;

        /**
         * Defines whether precomputed vertex tangents, which must be provided in a vec4 "tangent" attribute, are used.
         * When disabled, tangents are derived automatically.
         * Using precomputed tangents will give more accurate normal map details in some cases, such as with mirrored UVs.
         */
        this.vertexTangents = false;

        /**
         * The diffuse color.
         */
        this.diffuse = new RGB(0xffffff);

        /**
         * The diffuse map.
         * @type {Texture2D}
         */
        this.diffuseMap = null;

        /**
         * Define the UV chanel for the diffuse map to use starting from 0 and defaulting to 0.
         */
        this.diffuseMapCoord = 0;

        /**
         * The normal map.
         * @type {Texture2D}
         */
        this.normalMap = null;

        /**
         * The alpha map.
         * @type {Texture2D}
         */
        this.alphaMap = null;

        /**
         * Define the UV chanel for the alpha map to use starting from 0 and defaulting to 0.
         */
        this.alphaMapCoord = 0;

        /**
         * The red channel of this texture is used as the ambient occlusion map.
         * @type {Texture2D}
         */
        this.aoMap = null;

        /**
         * Intensity of the ambient occlusion effect.
         */
        this.aoMapIntensity = 1.0;

        /**
         * Define the UV chanel for the ao map to use starting from 0 and defaulting to 0.
         */
        this.aoMapCoord = 0;

        /**
         * The texture to create a bump map.
         * The black and white values map to the perceived depth in relation to the lights. Bump doesn't actually affect the geometry of the object, only the lighting.
         * @type {Texture2D}
         */
        this.bumpMap = null;

        /**
         * How much the bump map affects the material.
         * Typical ranges are 0-1.
         */
        this.bumpScale = 1;

        /**
         * The environment map.
         * @type {TextureCube}
         */
        this.envMap = null;

        /**
         * Scales the effect of the environment map by multiplying its color.
         */
        this.envMapIntensity = 1;

        /**
         * How to combine the result of the surface's color with the environment map, if any.
         * This has no effect in a PBRMaterial.
         * @type {ENVMAP_COMBINE_TYPE}
         */
        this.envMapCombine = CONST.ENVMAP_COMBINE_TYPE.MULTIPLY;

        /**
         * Emissive (light) color of the material, essentially a solid color unaffected by other lighting.
         */
        this.emissive = new RGB(0x000000);

        /**
         * Set emissive (glow) map.
         * The emissive map color is modulated by the emissive color and the emissive intensity.
         * If you have an emissive map, be sure to set the emissive color to something other than black.
         * @type {Texture2D}
         */
        this.emissiveMap = null;

        /**
         * Define the UV chanel for the emissive map to use starting from 0 and defaulting to 0.
         */
        this.emissiveMapCoord = 0;

        /**
         * Intensity of the emissive light.
         * Modulates the emissive color.
         */
        this.emissiveIntensity = 1;

        /**
         * Which depth function to use. See the WEBGL_COMPARE_FUNC constants for all possible values.
         * @type {WEBGL_COMPARE_FUNC}
         */
        this.depthFunc = CONST.WEBGL_COMPARE_FUNC.LEQUAL;

        /**
         * Whether to have depth test enabled when rendering this material.
         */
        this.depthTest = true;

        /**
         * Whether rendering this material has any effect on the depth buffer.
         * When drawing 2D overlays it can be useful to disable the depth writing in order to layer several things together without creating z-index artifacts.
         */
        this.depthWrite = true;

        /**
         * Whether to render the material's color.
         * This can be used in conjunction with a mesh's renderOrder property to create invisible objects that occlude other objects.
         */
        this.colorWrite = true;

        /**
         * Whether stencil operations are performed against the stencil buffer.
         * In order to perform writes or comparisons against the stencil buffer this value must be true.
         */
        this.stencilTest = false;

        /**
         * The bit mask to use when writing to the stencil buffer.
         */
        this.stencilWriteMask = 0xff;

        /**
         * The stencil comparison function to use.
         * @type {WEBGL_COMPARE_FUNC}
         */
        this.stencilFunc = CONST.WEBGL_COMPARE_FUNC.ALWAYS;

        /**
         * The value to use when performing stencil comparisons or stencil operations.
         */
        this.stencilRef = 0;

        /**
         * The bit mask to use when comparing against the stencil buffer.
         */
        this.stencilFuncMask = 0xff;

        /**
         * Which stencil operation to perform when the comparison function returns false.
         * @type {WEBGL_OP}
         */
        this.stencilFail = CONST.WEBGL_OP.KEEP;

        /**
         * Which stencil operation to perform when the comparison function returns true but the depth test fails.
         * @type {WEBGL_OP}
         */
        this.stencilZFail = CONST.WEBGL_OP.KEEP;

        /**
         * Which stencil operation to perform when the comparison function returns true and the depth test passes.
         * @type {WEBGL_OP}
         */
        this.stencilZPass = CONST.WEBGL_OP.KEEP;

        /**
         * The stencil comparison function to use.
         * You can explicitly specify the two-sided stencil function state by defining stencilFuncBack, stencilRefBack and stencilFuncMaskBack.
         * @type {?WEBGL_COMPARE_FUNC}
         */
        this.stencilFuncBack = null;

        /**
         * The value to use when performing stencil comparisons or stencil operations.
         * You can explicitly specify the two-sided stencil function state by defining stencilFuncBack, stencilRefBack and stencilFuncMaskBack.
         * @type {number|null}
         */
        this.stencilRefBack = null;

        /**
         * The bit mask to use when comparing against the stencil buffer.
         * You can explicitly specify the two-sided stencil function state by defining stencilFuncBack, stencilRefBack and stencilFuncMaskBack.
         * @type {number|null}
         */
        this.stencilFuncMaskBack = null;

        /**
         * Which stencil operation to perform when the comparison function returns false.
         * You can explicitly specify the two-sided stencil op state by defining stencilFailBack, stencilZFailBack and stencilZPassBack.
         * @type {WEBGL_OP|null}
         */
        this.stencilFailBack = null;

        /**
         * Which stencil operation to perform when the comparison function returns true but the depth test fails.
         * You can explicitly specify the two-sided stencil op state by defining stencilFailBack, stencilZFailBack and stencilZPassBack.
         * @type {WEBGL_OP|null}
         */
        this.stencilZFailBack = null;

        /**
         * Which stencil operation to perform when the comparison function returns true and the depth test passes.
         * You can explicitly specify the two-sided stencil op state by defining stencilFailBack, stencilZFailBack and stencilZPassBack.
         * @type {WEBGL_OP|null}
         */
        this.stencilZPassBack = null;

        /**
         * Sets the alpha value to be used when running an alpha test.
         * The material will not be renderered if the opacity is lower than this value.
         */
        this.alphaTest = 0;

        /**
         * Defines which side of faces will be rendered - front, back or double.
         * @type {DRAW_SIDE}
         */
        this.side = CONST.DRAW_SIDE.FRONT;

        /**
         * Whether to use polygon offset.
         * This corresponds to the GL_POLYGON_OFFSET_FILL WebGL feature.
         */
        this.polygonOffset = false;

        /**
         * Sets the polygon offset factor.
         */
        this.polygonOffsetFactor = 0;

        /**
         * Sets the polygon offset units.
         */
        this.polygonOffsetUnits = 0;

        /**
         * Define whether the material is rendered with flat shading or smooth shading.
         * @type {SHADING_TYPE}
         */
        this.shading = CONST.SHADING_TYPE.SMOOTH_SHADING;

        /**
         * Whether to apply dithering to the color to remove the appearance of banding.
         */
        this.dithering = false;

        /**
         * Whether the material is affected by lights.
         * If set true, renderer will try to upload light uniforms.
         */
        this.acceptLight = false;

        /**
         * Determines how the mesh triangles are constructed from the vertices.
         * @type {DRAW_MODE}
         */
        this.drawMode = CONST.DRAW_MODE.TRIANGLES;

        /**
         * Specifies that the material needs to be recompiled.
         * This property is automatically set to true when instancing a new material.
         */
        this.needsUpdate = true;

        //  Scene-level Properties that control if the material needs updating, or not

        this.program = null;

        this.sceneProperties = {
            numClippingPlanes: 0,
            fog: null,
            outputEncoding: 'linear',
            gammaFactor: 2,
            lightsHash: null,
            acceptLight: false,
            receiveShadow: false,
            shadowType: null
        };
    },

    isDirty: function (scene, camera, object)
    {
        if (this.needsUpdate)
        {
            //  We know it needs an update already, so skip any further checks
            return true;
        }

        var props = this.sceneProperties;

        if (!this.program || props.fog !== scene.fog || camera.outputEncoding !== props.outputEncoding || camera.gammaFactor !== props.gammaFactor)
        {
            this.needsUpdate = true;

            return true;
        }

        // if (scene.clippingPlanes && scene.clippingPlanes.length !== props.numClippingPlanes)
        // {
        //     this.needsUpdate = true;
        // }

        var acceptLight = this.acceptLight && !!scene.lights && (scene.lights.totalNum > 0);

        if (acceptLight !== props.acceptLight)
        {
            this.needsUpdate = true;

            return true;
        }
        else if (acceptLight)
        {
            if (object.receiveShadow !== props.receiveShadow || object.shadowType !== props.shadowType || !scene.lights.hash.compare(props.lightsHash))
            {
                this.needsUpdate = true;

                return true;
            }
        }

        return false;
    },

    update: function (scene, camera, object)
    {
        if (!this.isDirty(scene, camera, object))
        {
            //  Camera doesn't need updating, so let's bail out
            return;
        }

        var props = this.sceneProperties;

        if (!this.program)
        {
            // this.addEventListener('dispose', this.onMaterialDispose, this);
        }

        var oldProgram = this.program;

        this.program = this.programs.getProgram(camera, this, object, scene);

        if (oldProgram)
        {
            this.programs.releaseProgram(oldProgram);
        }

        props.fog = scene.fog;

        if (scene.lights)
        {
            props.acceptLight = this.acceptLight;
            props.lightsHash = scene.lights.hash.copyTo(props.lightsHash);
            props.receiveShadow = object.receiveShadow;
            props.shadowType = object.shadowType;
        }
        else
        {
            props.acceptLight = false;
        }

        props.numClippingPlanes = scene.clippingPlanes ? scene.clippingPlanes.length : 0;
        props.outputEncoding = camera.outputEncoding;
        props.gammaFactor = camera.gammaFactor;

        this.needsUpdate = false;
    }

});

module.exports = Material;
