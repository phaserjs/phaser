/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BindBuffer = require('./BindBuffer');
var BindTexture = require('./BindTexture');
var Class = require('../../utils/Class');
var ColorBuffer = require('./ColorBuffer');
var CONST = require('../const');
var CreateTexture = require('./CreateTexture');
var DepthBuffer = require('./DepthBuffer');
var SetActiveTexture = require('./SetActiveTexture');
var SetBlendMode = require('./SetBlendMode');
var SetCullFace = require('./SetCullFace');
var SetFlipSided = require('./SetFlipSided');
var SetLineWidth = require('./SetLineWidth');
var SetPolygonOffset = require('./SetPolygonOffset');
var SetProgram = require('./SetProgram');
var SetViewport = require('./SetViewport');
var StencilBuffer = require('./StencilBuffer');

var RenderState = new Class({

    initialize:

    function RenderState (renderer)
    {
        var gl = renderer.gl;

        this.gl = gl;
        this.renderer = renderer;

        this.maxTextures = renderer.coreRenderer.maxTextures;
        this.lineWidthRange = gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE);

        this.colorBuffer = new ColorBuffer(this);
        this.depthBuffer = new DepthBuffer(this);
        this.stencilBuffer = new StencilBuffer(this);

        this.emptyTextures = {};
        this.emptyTextures[gl.TEXTURE_2D] = CreateTexture(gl, gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
        this.emptyTextures[gl.TEXTURE_CUBE_MAP] = CreateTexture(gl, gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);

        this.currentRenderTarget = null;

        this.colorBuffer.setClear(0, 0, 0, 1);
        this.depthBuffer.setClear(1);
        this.stencilBuffer.setClear(0);

        this.depthBuffer.setTest(true);
        this.depthBuffer.setFunc(CONST.WEBGL_COMPARE_FUNC.LEQUAL);

        SetCullFace(this, CONST.CULL_FACE_TYPE.BACK);
        SetFlipSided(this, false);
    },

    setBlend: function (blend, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha)
    {
        SetBlendMode(this, blend, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha);
    },

    setFlipSided: function (flipSided)
    {
        SetFlipSided(this, flipSided);
    },

    setCullFace: function (cullFace)
    {
        SetCullFace(this, cullFace);
    },

    viewport: function (x, y, width, height)
    {
        SetViewport(this, x, y, width, height);
    },

    activeTexture: function (textureUnit)
    {
        SetActiveTexture(this, textureUnit);
    },

    bindTexture: function (type, texture)
    {
        BindTexture(this, type, texture);
    },

    bindBuffer: function (type, buffer)
    {
        BindBuffer(this, type, buffer);
    },

    setLineWidth: function (width)
    {
        SetLineWidth(this, width);
    },

    setPolygonOffset: function (polygonOffset, factor, units)
    {
        SetPolygonOffset(this, polygonOffset, factor, units);
    },

    setProgram: function (program)
    {
        SetProgram(this, program);
    }

});

module.exports = RenderState;
