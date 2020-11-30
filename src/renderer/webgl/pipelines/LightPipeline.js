/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var PointLightShaderSourceFS = require('../shaders/PointLight-frag.js');
var PointLightShaderSourceVS = require('../shaders/PointLight-vert.js');
var PostFXPipeline = require('./PostFXPipeline');
var WEBGL_CONST = require('../const');

var LightPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function LightPipeline (config)
    {
        config.shaders = GetFastValue(config, 'shaders', [
            {
                name: 'PointLight',
                fragShader: PointLightShaderSourceFS,
                vertShader: PointLightShaderSourceVS,
                attributes: [
                    {
                        name: 'inPosition',
                        size: 2,
                        type: WEBGL_CONST.FLOAT
                    },
                    {
                        name: 'inLightPosition',
                        size: 2,
                        type: WEBGL_CONST.FLOAT
                    },
                    {
                        name: 'inLightRadius',
                        size: 1,
                        type: WEBGL_CONST.FLOAT
                    },
                    {
                        name: 'inLightColor',
                        size: 4,
                        type: WEBGL_CONST.FLOAT
                    }
                ],
                uniforms: [
                    'uProjectionMatrix',
                    'uResolution'
                ]
            }
        ]);

        PostFXPipeline.call(this, config);
    }

});

module.exports = LightPipeline;
