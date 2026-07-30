/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var Class = require('../../../utils/Class');
var Shader = require('../../shader/Shader');
var Color = require('../../../display/color/Color');
var NoiseWorley3DFrag = require('../../../renderer/webgl/shaders/NoiseWorley3D-frag');

/**
 * @classdesc
 * A NoiseCell3D Game Object.
 *
 * This game object is a quad which displays cellular noise.
 * You can manipulate this object like any other, make it interactive,
 * and use it in filters and masks to create visually stunning effects.
 *
 * Behind the scenes, a NoiseCell3D is a {@link Phaser.GameObjects.Shader}
 * using a specific shader program.
 *
 * Cellular noise, also called Worley Noise or Voronoi Noise,
 * consists of a pattern of cells. This is good for modeling natural phenomena
 * like waves, clouds, or scales.
 *
 * You can set the color and transparency, cell count, variation,
 * and seed value of the noise.
 * You can change the detail level by increasing `noiseIterations`.
 * You can change the noise mode to output sharp edges, soft edges,
 * or flat colors for the cells.
 *
 * You can scroll the noise by animating the `noiseOffset` property.
 *
 * You can set `noiseNormalMap` to output a normal map.
 * This is a quick way to add texture for lighting.
 *
 * The 3D version of NoiseCell has one extra dimension: Z.
 * The shader only renders the XY slice through the noise field.
 * Because the centers of cells typically lie elsewhere in the hypervolume,
 * cells appear with variation in brightness.
 * You can scroll on the Z axis to shift the slice, smoothly changing the cell pattern.
 *
 * @class NoiseCell3D
 * @extends Phaser.GameObjects.Shader
 * @memberof Phaser.GameObjects
 * @since 4.0.0
 * @constructor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.Types.GameObjects.NoiseCell3D.NoiseCell3DQuadConfig} [config] - The configuration for this Game Object.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 */
var NoiseCell3D = new Class({
    Extends: Shader,

    initialize: function NoiseCell3D (scene, config, x, y, width, height)
    {
        if (!config) { config = {}; }

        var shaderConfig = {
            name: 'noiseCell3D',
            fragmentSource: NoiseWorley3DFrag,
            shaderAdditions: [
                {
                    name: 'MODE_DISTANCE',
                    tags: [ 'MODE' ],
                    additions: {
                        fragmentMode: '#define MODE_DISTANCE'
                    }
                },
                {
                    name: 'ITERATION_COUNT_1',
                    tags: [ 'ITERATION_COUNT' ],
                    additions: {
                        fragmentIterations: '#define ITERATION_COUNT 1.0'
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

        this.type = 'NoiseCell3D';

        /**
         * The number of cells in each dimension.
         *
         * This must be an array of 3 numbers.
         *
         * Try to keep the cell count between 2
         * and about an eighth of the resolution of the texture.
         * A cell count of 1 has no room to vary.
         * A cell count greater than the resolution of the texture
         * will essentially be expensive white noise.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseCells
         * @type {number[]}
         * @default [ 32, 32, 32 ]
         * @since 4.0.0
         */
        this.noiseCells = [ 32, 32, 32 ];
        if (config.noiseCells)
        {
            this.noiseCells = config.noiseCells;
        }

        /**
         * How many cells wide the pattern is.
         *
         * By default, this is set to the same dimensions as `noiseCells`.
         * This causes the output to wrap seamlessly at the edges.
         * To restore wrapping if you changed settings, call `this.wrapNoise()`.
         *
         * A lower value causes the output to repeat.
         *
         * A higher value breaks visible wrapping.
         * The cell pattern still repeats off-camera.
         * Try to keep this value as low as possible,
         * as it helps avoid floating-point precision errors.
         *
         * This must be an array of 3 numbers.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseWrap
         * @type {number[]}
         * @default [ 32, 32, 32 ]
         * @since 4.0.0
         */
        this.noiseWrap = [
            this.noiseCells[0],
            this.noiseCells[1],
            this.noiseCells[2]
        ];
        if (config.noiseWrap)
        {
            this.noiseWrap = config.noiseWrap;
        }

        /**
         * The offset of the noise in each dimension: [ x, y, z ].
         * Animate x and y to scroll the noise pattern.
         * Animate z to smoothly change the noise pattern.
         *
         * This must be an array of 3 numbers.
         *
         * Moving too far from 0 will introduce floating-point precision issues.
         * This can cause the noise to appear blocky.
         * We start to see obvious blockiness at offsets of a few thousand,
         * so stay below that.
         *
         * You can evolve the noise pattern by scrolling the Z axis.
         * However, this will eventually meet those floating-point precision issues.
         *
         * @example
         * // Scroll the noise pattern without changing the pattern.
         * noise.noiseOffset[0] = Math.sin(scene.time.now / 10000);
         * noise.noiseOffset[1] = Math.cos(scene.time.now / 10000);
         *
         * // Evolve the noise pattern along the Z axis.
         * noise.noiseOffset[2] = scene.time.now / 1000;
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseOffset
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
         * How much each cell can vary from its grid position.
         * High values break further from the grid.
         *
         * At 0, cells are perfectly square.
         * At 1, cells are fully chaotic.
         * Never go higher than 1, as this can distort the cell matrix so much
         * that the nearest cell is outside the sampling range,
         * causing seams in the noise.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseVariation
         * @type {number[]}
         * @default [ 1, 1, 1 ]
         * @since 4.0.0
         */
        this.noiseVariation = [ 1, 1, 1 ];
        if (config.noiseVariation)
        {
            this.noiseVariation = config.noiseVariation;
        }

        /**
         * How many octaves of noise to apply.
         * This adds fine detail to the noise, at the cost of performance.
         *
         * Each octave of noise has twice the resolution,
         * and contributes half as much to the output.
         *
         * This value should be an integer of 1 or higher.
         * Values above 5 or so have increasingly little effect.
         * Each iteration has a cost, so only use as much as you need!
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseIterations
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.noiseIterations = 1;
        if (config.noiseIterations)
        {
            this.noiseIterations = config.noiseIterations;
        }

        /**
         * What mode to output the noise in.
         *
         * - 0: Sharp boundaries between cells.
         * - 1: Index mode. Cells have a single flat color.
         *   The color assigned to each cell is random and may not be unique across cells.
         * - 2: Smooth boundaries between cells.
         *   Use `noiseSmoothing` to control smoothness.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseMode
         * @type {number}
         * @default 0
         * @since 4.0.0
         */
        this.noiseMode = 0;
        if (config.noiseMode)
        {
            this.noiseMode = config.noiseMode;
        }

        /**
         * How much smoothing to apply in smoothing mode.
         *
         * The default value is 1, which applies moderate smoothing between cells.
         * The value is a factor.
         * Values from 0-1 reduce the smoothing.
         * Values above 1 intensify the smoothing.
         * Intensification slows above 4 or so.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseSmoothing
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.noiseSmoothing = 1;
        if (config.noiseSmoothing)
        {
            this.noiseSmoothing = config.noiseSmoothing;
        }

        /**
         * Whether to convert the noise output to a normal map.
         *
         * This works properly with noise modes 0 and 2, which form curves.
         *
         * Control the curvature strength with `noiseNormalScale`.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseNormalMap
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
         * Noise with more iterations tends to change more rapidly,
         * thus have more pronounced normals.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseNormalScale
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
         * The color of the middle of the cells.
         *
         * The default is black. You can set any color, and change the alpha.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseColorStart
         * @type {Phaser.Display.Color}
         * @since 4.0.0
         */
        this.noiseColorStart = new Color(0, 0, 0);

        /**
         * The color of the edge of the cells.
         *
         * The default is white. You can set any color, and change the alpha.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseColorEnd
         * @type {Phaser.Display.Color}
         * @since 4.0.0
         */
        this.noiseColorEnd = new Color(255, 255, 255);

        if (config.noiseColorStart !== undefined || config.noiseColorEnd !== undefined)
        {
            this.setNoiseColor(config.noiseColorStart, config.noiseColorEnd);
        }

        /**
         * Seed values for the noise.
         * Vary these to change the shape of cells in the pattern.
         * A different seed creates a completely different pattern.
         *
         * This must be an array of 12 numbers.
         *
         * Noise seed values should be fairly small.
         * Numbers between 0 and 1, or 0 and 12, are recommended.
         * Very large seed values may lose floating-point precision
         * and cause the noise to appear blocky.
         *
         * @name Phaser.GameObjects.NoiseCell3D#noiseSeed
         * @type {number[]}
         * @default [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
         * @since 4.0.0
         */
        this.noiseSeed = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
        if (config.noiseSeed) { this.noiseSeed = config.noiseSeed; }
        if (config.randomizeNoiseSeed)
        {
            this.randomizeNoiseSeed();
        }

        /**
         * Whether to jitter shader inputs to force continuous high precision.
         * This is an advanced setting.
         *
         * Chromium browsers seem to switch between WebGL rendering modes,
         * which changes the precision available to the noise shader.
         * This can change the noise calculation, causing parts of the output
         * to flicker unpredictably.
         * The `keepAwake` setting adds an imperceptible amount to the offset
         * during rendering, which seems to force Chromium to be consistent
         * and eliminate the flickering.
         *
         * Don't disable this unless you know what you're doing.
         * It prevents an unpredictable problem that might not appear in your
         * browser or device, but will appear for other users.
         *
         * @name Phaser.GameObjects.NoiseCell3D#keepAwake
         * @type {boolean}
         * @default true
         * @since 4.0.0
         */
        this.keepAwake = true;
    },

    /**
     * Set the colors of the noise, from a variety of color formats.
     *
     * - A number is expected to be a 24 or 32 bit RGB or ARGB value.
     * - A string is expected to be a hex code.
     * - An array of numbers is expected to be RGB or RGBA in the range 0-1.
     * - A Color object can be used.
     *
     * @method Phaser.GameObjects.NoiseCell3D#setNoiseColor
     * @since 4.0.0
     * @param {number | string | number[] | Phaser.Display.Color} [start=0x000000] - The color in the middle of the cells.
     * @param {number | string | number[] | Phaser.Display.Color} [end=0xffffff] - The color at the edge of the cells.
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
     * @method Phaser.GameObjects.NoiseCell3D#randomizeNoiseSeed
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
     * This sets `noiseWrap` to equal `noiseCells` in all dimensions.
     *
     * @method Phaser.GameObjects.NoiseCell3D#wrapNoise
     * @since 4.0.0
     * @return {this} This game object.
     */
    wrapNoise: function ()
    {
        var len = this.noiseWrap.length;
        for (var i = 0; i < len; i++)
        {
            this.noiseWrap[i] = this.noiseCells[i];
        }
        return this;
    },

    /**
     * The function which sets uniforms for the shader.
     * This is provided to the Shader base class as `setupUniforms`.
     * You should not override `setupUniforms` on this object.
     *
     * @method Phaser.GameObjects.NoiseCell3D#_setupUniforms
     * @private
     * @since 4.0.0
     * @param {function} setUniform - The function which sets uniforms. `(name: string, value: any) => void`.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - A reference to the current drawing context.
     */
    _setupUniforms: function (setUniform)
    {
        if (this.keepAwake)
        {
            var wakeValue = Math.sin(this.scene.time.now) / 4096 / 256;
            setUniform('uCellOffset', [
                this.noiseOffset[0] + wakeValue,
                this.noiseOffset[1] + wakeValue,
                this.noiseOffset[2] + wakeValue
            ]);
        }
        else
        {
            setUniform('uCellOffset', this.noiseOffset);
        }

        setUniform('uSeedX', this.noiseSeed.slice(0, 3));
        setUniform('uSeedY', this.noiseSeed.slice(3, 6));
        setUniform('uSeedZ', this.noiseSeed.slice(6, 9));
        setUniform('uCells', this.noiseCells);
        setUniform('uVariation', this.noiseVariation);
        setUniform('uWrap', this.noiseWrap);
        setUniform('uSmoothing', this.noiseSmoothing);
        setUniform('uNormalScale', this.noiseNormalScale);
        setUniform('uColorStart', this.noiseColorStart.gl);
        setUniform('uColorEnd', this.noiseColorEnd.gl);
    },

    /**
     * The function which updates shader configuration.
     * This is provided to the Shader base class as `updateShaderConfig`.
     * You should not override `updateShaderConfig` on this object.
     *
     * @method Phaser.GameObjects.NoiseCell3D#_updateShaderConfig
     * @private
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - A reference to the current drawing context.
     * @param {Phaser.GameObjects.Gradient} gameObject - The game object which is rendering.
     * @param {Phaser.Renderer.WebGL.RenderNodes.ShaderQuad} renderNode - The render node currently rendering.
     */
    _updateShaderConfig: function (drawingContext, gameObject, renderNode)
    {
        var iterations = Math.max(1, Math.floor(gameObject.noiseIterations));
        var iterationAdd = renderNode.programManager.getAdditionsByTag('ITERATION_COUNT')[0];
        iterationAdd.name = 'ITERATION_COUNT_' + iterations;
        iterationAdd.additions.fragmentIterations = '#define ITERATION_COUNT ' + iterations + '.0';

        var mode = 'MODE_DISTANCE';
        switch (gameObject.noiseMode)
        {
            case 1:
            {
                mode = 'MODE_INDEX';
                break;
            }
            case 2:
            {
                mode = 'MODE_DISTANCE_SMOOTH';
                break;
            }
        }
        var modeAdd = renderNode.programManager.getAdditionsByTag('MODE')[0];
        modeAdd.name = mode;
        modeAdd.additions.fragmentMode = '#define ' + mode;

        var normalAdd = renderNode.programManager.getAdditionsByTag('NORMALMAP')[0];
        normalAdd.disable = !gameObject.noiseNormalMap;
    }
});

module.exports = NoiseCell3D;
