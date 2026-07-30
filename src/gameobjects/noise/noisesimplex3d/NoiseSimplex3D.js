/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var Class = require('../../../utils/Class');
var Shader = require('../../shader/Shader');
var Color = require('../../../display/color/Color');
var NoiseSimplex3DFrag = require('../../../renderer/webgl/shaders/NoiseSimplex3D-frag');

/**
 * @classdesc
 * A NoiseSimplex3D object.
 *
 * This game object is a quad which displays simplex noise.
 * You can manipulate this object like any other, make it interactive,
 * and use it in filters and masks to create visually stunning effects.
 *
 * Behind the scenes, a NoiseSimplex3D is a {@see Phaser.GameObjects.Shader}
 * using a specific shader program.
 *
 * Simplex noise is a smooth pattern ideal for soft, natural phenomena.
 * It is useful for clouds, flame, water, and many other effects.
 * Ken Perlin, the creator of Perlin Noise, created Simplex Noise
 * to improve performance and quality over the original.
 *
 * By default, the noise pattern is periodic: it repeats.
 * You can scroll in X, Y, and Z.
 * You can also change the `noiseFlow` value to evolve the pattern
 * along a periodic course. This is useful to avoid scrolling into
 * regions of reduced floating-point precision with very large numbers.
 *
 * You can set the cell count, color and transparency of the pattern.
 * You can add fine detail with `noiseIterations`.
 * You can add turbulence with `noiseWarpAmount`.
 *
 * You can change the basic pattern with `noiseSeed`.
 * Different seeds create completely different patterns.
 * You must use integers for the seed, or bad things will happen.
 *
 * You can set `noiseNormalMap` to output a normal map.
 * This is a quick way to add texture for lighting.
 *
 * For advanced users, you can configure the characteristics of octave iteration.
 * Use `noiseDetailPower`, `noiseFlowPower`, and `noiseContributionPower`
 * to adjust the exponential scaling rate of these values.
 * Use `noiseWarpDetailPower`, `noiseWarpFlowPower`, and
 * `noiseWarpContributionPower` to do the same for the warp effect.
 *
 * @class NoiseSimplex3D
 * @extends Phaser.GameObjects.Shader
 * @memberof Phaser.GameObjects
 * @since 4.0.0
 * @constructor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.Types.GameObjects.NoiseSimplex3D.NoiseSimplex3DQuadConfig} [config] - The configuration for this Game Object.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 */
var NoiseSimplex3D = new Class({
    Extends: Shader,

    initialize: function NoiseSimplex3D (scene, config, x, y, width, height)
    {
        if (!config) { config = {}; }

        var shaderConfig = {
            name: 'noiseSimplex3D',
            fragmentSource: NoiseSimplex3DFrag,
            shaderAdditions: [
                {
                    name: 'ITERATION_COUNT_1_WARP_ITERATION_COUNT_1',
                    tags: [ 'ITERATION_COUNT' ],
                    additions: {
                        fragmentIterations: '#define ITERATION_COUNT 1.0\n#define WARP_ITERATION_COUNT 1.0'
                    }
                },
                {
                    name: 'NORMALMAP',
                    tags: [ 'NORMALMAP' ],
                    additions: {
                        fragmentNormalMap: '#define NORMAL_MAP\n#extension GL_OES_standard_derivatives : enable'
                    },
                    disable: !config.noiseNormalMap
                }
            ],
            setupUniforms: this._setupUniforms,
            updateShaderConfig: this._updateShaderConfig
        };

        Shader.call(this, scene, shaderConfig, x, y, width, height);

        this.type = 'NoiseSimplex3D';

        /**
         * The number of cells in each dimension.
         *
         * This must be an array of 3 numbers.
         *
         * Try to keep the cell count between 2
         * and about an eighth of the resolution of the texture.
         * A cell count greater than the resolution of the texture
         * will essentially be expensive white noise.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseCells
         * @type {number[]}
         * @default [ 32, 32, 32 ]
         * @since 4.0.0
         */
        this.noiseCells = config.noiseCells || [ 32, 32, 32 ];

        /**
         * The number of cells before the pattern wraps.
         *
         * This must be an array of 3 numbers.
         *
         * By default, this is the same as `noiseCells`.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noisePeriod
         * @type {number[]}
         * @default [ 32, 32, 32 ]
         * @since 4.0.0
         */
        this.noisePeriod = [
            this.noiseCells[0],
            this.noiseCells[1],
            this.noiseCells[2]
        ];
        if (config.noisePeriod)
        {
            this.noisePeriod = config.noisePeriod;
        }

        /**
         * The offset of the noise in each dimension: [ x, y, z ].
         * Animate x and y to scroll the noise pattern.
         * Animate z to change the noise pattern by shifting the volume slice.
         *
         * This must be an array of 3 numbers.
         *
         * @example
         * // Scroll the noise pattern without changing the pattern.
         * noise.noiseOffset[0] = Math.sin(scene.time.now / 10000);
         * noise.noiseOffset[1] = Math.cos(scene.time.now / 10000);
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseOffset
         * @type {number[]}
         * @default [ 0, 0, 0 ]
         * @since 4.0.0
         */
        this.noiseOffset = [ 0, 0, 0 ];
        if (config.noiseOffset)
        {
            this.noiseOffset = config.noiseOffset;
        }

        /**
         * The current flow of the noise field.
         * The pattern changes in place with flow.
         * This is a rotation, so the pattern returns to its original state
         * after flow increases by PI * 2.
         *
         * Use flow to evolve the pattern over time with periodic repeats.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseFlow
         * @type {number}
         * @default 0
         * @since 4.0.0
         */
        this.noiseFlow = config.noiseFlow || 0;

        /**
         * How much to warp the noise texture.
         * Warp can add a sense of turbulence to the output.
         *
         * This runs several octaves of noise to generate a random warp offset.
         * It adds to the expense of the shader.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseWarpAmount
         * @type {number}
         * @default 0
         * @since 4.0.0
         */
        this.noiseWarpAmount = config.noiseWarpAmount || 0;

        /**
         * How many octaves of noise to apply.
         * This adds fine detail to the noise, at the cost of performance.
         *
         * This value should be an integer of 1 or higher.
         * Values above 5 or so have increasingly little effect.
         * Each iteration has a cost, so only use as much as you need!
         *
         * Use `noiseDetailPower`, `noiseFlowPower` and `noiseContributionPower`
         * to configure differences between octaves.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseIterations
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.noiseIterations = config.noiseIterations || 1;

        /**
         * How many octaves of noise to apply when warping the noise.
         *
         * This behaves much like `noiseIterations`,
         * but is used in the warp calculations instead.
         * It is only used when `noiseWarpAmount` is not 0.
         * You may need fewer warp iterations than regular iterations.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseWarpIterations
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.noiseWarpIterations = config.noiseWarpIterations || 1;

        /**
         * How much to increase detail frequency between noise octaves.
         *
         * This is used as the base of an exponent.
         * The default 2 doubles the frequency every octave.
         * Lower values scale slower.
         * Higher values scale higher.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseDetailPower
         * @type {number}
         * @default 2
         * @since 4.0.0
         */
        this.noiseDetailPower = config.noiseDetailPower || 2;

        /**
         * How much to increase flow progression between noise octaves.
         *
         * This is used as the base of an exponent.
         * The default 2 doubles the frequency every octave.
         * Lower values scale slower.
         * Higher values scale higher.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseFlowPower
         * @type {number}
         * @default 2
         * @since 4.0.0
         */
        this.noiseFlowPower = config.noiseFlowPower || 2;

        /**
         * How much value to take from subsequent noise octaves.
         *
         * This is used as the base of an exponent.
         * The default 2 halves the contribution every octave.
         * Lower values decay slower, prioritize high frequency detail.
         * Higher values decay faster, prioritize low frequency detail.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseContributionPower
         * @type {number}
         * @default 2
         * @since 4.0.0
         */
        this.noiseContributionPower = config.noiseContributionPower || 2;

        /**
         * How much to increase detail frequency between noise octaves
         * in the warp.
         *
         * This is used as the base of an exponent.
         * The default 2 doubles the frequency every octave.
         * Lower values scale slower.
         * Higher values scale higher.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseWarpDetailPower
         * @type {number}
         * @default 2
         * @since 4.0.0
         */
        this.noiseWarpDetailPower = config.noiseWarpDetailPower || 2;

        /**
         * How much to increase flow progression between noise octaves
         * in the warp.
         *
         * This is used as the base of an exponent.
         * The default 2 doubles the frequency every octave.
         * Lower values scale slower.
         * Higher values scale higher.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseWarpFlowPower
         * @type {number}
         * @default 2
         * @since 4.0.0
         */
        this.noiseWarpFlowPower = config.noiseWarpFlowPower || 2;

        /**
         * How much value to take from subsequent noise octaves
         * in the warp.
         *
         * This is used as the base of an exponent.
         * The default 2 halves the contribution every octave.
         * Lower values decay slower, prioritize high frequency detail.
         * Higher values decay faster, prioritize low frequency detail.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseWarpContributionPower
         * @type {number}
         * @default 2
         * @since 4.0.0
         */
        this.noiseWarpContributionPower = config.noiseWarpContributionPower || 2;

        /**
         * Whether to convert the noise output to a normal map.
         *
         * Control the curvature strength with `noiseNormalScale`.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseNormalMap
         * @type {boolean}
         * @default false
         * @since 4.0.0
         */
        this.noiseNormalMap = !!config.noiseNormalMap;

        /**
         * Curvature strength of normal map output.
         * This is used when `noiseNormalMap` is enabled.
         *
         * The default is 1. Higher values produce more curvature;
         * lower values are flatter.
         *
         * Surface angle is determined by the rate of change of the noise.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseNormalScale
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.noiseNormalScale = 1;
        if (config.noiseNormalScale !== undefined)
        {
            this.noiseNormalScale = config.noiseNormalScale;
        }

        /**
         * Factor applied to the raw noise output.
         *
         * Raw noise is emitted in the range -1 to 1.
         * It is adjusted by (rawNoise * noiseValueFactor + noiseValueAdd) ^ noiseValuePower.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseValueFactor
         * @type {number}
         * @default 0.5
         * @since 4.0.0
         */
        this.noiseValueFactor = config.noiseValueFactor === undefined ? 0.5 : config.noiseValueFactor;

        /**
         * Value added to the raw noise output.
         *
         * Raw noise is emitted in the range -1 to 1.
         * It is adjusted by (rawNoise * noiseValueFactor + noiseValueAdd) ^ noiseValuePower.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseValueAdd
         * @type {number}
         * @default 0.5
         * @since 4.0.0
         */
        this.noiseValueAdd = config.noiseValueAdd === undefined ? 0.5 : config.noiseValueAdd;

        /**
         * Exponent applied to the raw noise output.
         *
         * Raw noise is emitted in the range -1 to 1.
         * It is adjusted by (rawNoise * noiseValueFactor + noiseValueAdd) ^ noiseValuePower.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseValuePower
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.noiseValuePower = config.noiseValuePower === undefined ? 1 : config.noiseValuePower;

        /**
         * The color when the adjusted noise value is 0.
         * This blends with noiseColorEnd.
         *
         * The default is black. You can set any color, and change the alpha.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseColorStart
         * @type {Phaser.Display.Color}
         * @since 4.0.0
         */
        this.noiseColorStart = new Color(0, 0, 0);

        /**
         * The color when the adjusted noise value is 1.
         * This blends with noiseColorStart.
         *
         * The default is white. You can set any color, and change the alpha.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseColorEnd
         * @type {Phaser.Display.Color}
         * @since 4.0.0
         */
        this.noiseColorEnd = new Color(255, 255, 255);

        if (config.noiseColorStart !== undefined || config.noiseColorEnd !== undefined)
        {
            this.setNoiseColor(config.noiseColorStart, config.noiseColorEnd);
        }

        /**
         * The seed for the noise.
         *
         * This offsets the simplex grid, causing its hashes to evaluate
         * differently. Any change to the seed results in a new pattern.
         * It must be an array of 3 integers.
         *
         * Use a custom seed to create different, but reproducible,
         * randomness.
         *
         * @name Phaser.GameObjects.NoiseSimplex3D#noiseSeed
         * @type {number[]}
         * @default [ 1, 2, 3 ]
         * @since 4.0.0
         */
        this.noiseSeed = config.noiseSeed || [ 1, 2, 3 ];
    },

    /**
     * Set the colors of the noise, from a variety of color formats.
     *
     * - A number is expected to be a 24 or 32 bit RGB or ARGB value.
     * - A string is expected to be a hex code.
     * - An array of numbers is expected to be RGB or RGBA in the range 0-1.
     * - A Color object can be used.
     *
     * @method Phaser.GameObjects.NoiseSimplex3D#setNoiseColor
     * @since 4.0.0
     * @param {number | string | number[] | Phaser.Display.Color} [start=0x000000] - The color when the adjusted noise value is 0 (minimum). Defaults to black.
     * @param {number | string | number[] | Phaser.Display.Color} [end=0xffffff] - The color when the adjusted noise value is 1 (maximum). Defaults to white.
     * @return {this} This game object.
     */
    setNoiseColor: function (start, end)
    {
        var alpha;

        if (start === undefined)
        {
            start = 0x000000;
        }
        if (end === undefined)
        {
            end = 0xffffff;
        }

        if (typeof start === 'number')
        {
            Color.IntegerToColor(start, this.noiseColorStart);
        }
        else if (typeof start === 'string')
        {
            Color.HexStringToColor(start, this.noiseColorStart);
        }
        else if (Array.isArray(start))
        {
            alpha = (start[3] === undefined) ? 1 : start[3];
            this.noiseColorStart.setGLTo(start[0], start[1], start[2], alpha);
        }
        else if (start instanceof Color)
        {
            this.noiseColorStart.setTo(start.red, start.green, start.blue, start.alpha);
        }

        if (typeof end === 'number')
        {
            Color.IntegerToColor(end, this.noiseColorEnd);
        }
        else if (typeof end === 'string')
        {
            Color.HexStringToColor(end, this.noiseColorEnd);
        }
        else if (Array.isArray(end))
        {
            alpha = (end[3] === undefined) ? 1 : end[3];
            this.noiseColorEnd.setGLTo(end[0], end[1], end[2], alpha);
        }
        else if (end instanceof Color)
        {
            this.noiseColorEnd.setTo(end.red, end.green, end.blue, end.alpha);
        }

        return this;
    },

    /**
     * Randomize the noise seed, creating a unique pattern.
     *
     * @method Phaser.GameObjects.NoiseSimplex3D#randomizeNoiseSeed
     * @since 4.0.0
     * @return {this} This game object.
     */
    randomizeNoiseSeed: function ()
    {
        var len = this.noiseSeed.length;
        for (var i = 0; i < len; i++)
        {
            this.noiseSeed[i] = Math.random();
        }
        return this;
    },

    /**
     * Set the noise texture to wrap seamlessly.
     *
     * This sets `noisePeriod` to equal `noiseCells` in all dimensions.
     *
     * @method Phaser.GameObjects.NoiseSimplex3D#wrapNoise
     * @since 4.0.0
     * @return {this} This game object.
     */
    wrapNoise: function ()
    {
        var len = this.noisePeriod.length;
        for (var i = 0; i < len; i++)
        {
            this.noisePeriod[i] = this.noiseCells[i];
        }
        return this;
    },

    /**
     * The function which sets uniforms for the shader.
     * This is provided to the Shader base class as `setupUniforms`.
     * You should not override `setupUniforms` on this object.
     *
     * @method Phaser.GameObjects.NoiseSimplex3D#_setupUniforms
     * @private
     * @since 4.0.0
     * @param {function} setUniform - The function which sets uniforms. `(name: string, value: any) => void`.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - A reference to the current drawing context.
     */
    _setupUniforms: function (setUniform)
    {
        setUniform('uCells', this.noiseCells);
        setUniform('uPeriod', this.noisePeriod);
        setUniform('uOffset', this.noiseOffset);
        setUniform('uFlow', this.noiseFlow);
        setUniform('uDetailPower', this.noiseDetailPower);
        setUniform('uFlowPower', this.noiseFlowPower);
        setUniform('uContributionPower', this.noiseContributionPower);
        setUniform('uWarpDetailPower', this.noiseWarpDetailPower);
        setUniform('uWarpFlowPower', this.noiseWarpFlowPower);
        setUniform('uWarpContributionPower', this.noiseWarpContributionPower);
        setUniform('uWarpAmount', this.noiseWarpAmount);
        setUniform('uNormalScale', this.noiseNormalScale);
        setUniform('uValueFactor', this.noiseValueFactor);
        setUniform('uValueAdd', this.noiseValueAdd);
        setUniform('uValuePower', this.noiseValuePower);
        setUniform('uColorStart', this.noiseColorStart.gl);
        setUniform('uColorEnd', this.noiseColorEnd.gl);
        setUniform('uSeed', this.noiseSeed);
    },

    /**
     * The function which updates shader configuration.
     * This is provided to the Shader base class as `updateShaderConfig`.
     * You should not override `updateShaderConfig` on this object.
     *
     * @method Phaser.GameObjects.NoiseSimplex3D#_updateShaderConfig
     * @private
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - A reference to the current drawing context.
     * @param {Phaser.GameObjects.Gradient} gameObject - The game object which is rendering.
     * @param {Phaser.Renderer.WebGL.RenderNodes.ShaderQuad} renderNode - The render node currently rendering.
     */
    _updateShaderConfig: function (drawingContext, gameObject, renderNode)
    {
        var iterations = Math.max(1, Math.floor(gameObject.noiseIterations));
        var warpIterations = Math.max(1, Math.floor(gameObject.noiseWarpIterations));
        var iterationAdd = renderNode.programManager.getAdditionsByTag('ITERATION_COUNT')[0];
        iterationAdd.name = 'ITERATION_COUNT_' + iterations + '_WARP_ITERATION_COUNT_' + warpIterations;
        iterationAdd.additions.fragmentIterations = '#define ITERATION_COUNT ' + iterations + '.0' + '\n' + '#define WARP_ITERATION_COUNT ' + warpIterations + '.0';

        var normalAdd = renderNode.programManager.getAdditionsByTag('NORMALMAP')[0];
        normalAdd.disable = !gameObject.noiseNormalMap;
    }
});

module.exports = NoiseSimplex3D;
