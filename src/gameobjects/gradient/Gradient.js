/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var ColorRamp = require('../../display/ColorRamp');
var Vector2 = require('../../math/Vector2');
var GradientFrag = require('../../renderer/webgl/shaders/Gradient-frag');
var RampGlsl = require('../../renderer/webgl/shaders/Ramp-glsl');
var Class = require('../../utils/Class');
var Shader = require('../shader/Shader');

/**
 * @classdesc
 * A Gradient Game Object.
 *
 * This Game Object is a quad which displays a gradient.
 * You can manipulate this object like any other, make it interactive,
 * and use it in filters and masks to create visually stunning effects.
 *
 * Behind the scenes, a Gradient is a {@link Phaser.GameObjects.Shader} using a specific shader program.
 *
 * The gradient color is determined by a {@link Phaser.Display.ColorRamp},
 * containing one or more {@link Phaser.Display.ColorBand} objects.
 * The ramp is laid out along the `shape` of the gradient,
 * originating from the `start` location.
 * The `shapeMode` describes how the gradient fills elsewhere,
 * e.g. a LINEAR gradient creates straight bands
 * while a RADIAL gradient creates circles.
 *
 * Note that the shape of the gradient is fitted to a square.
 * If its width and height are not equal, the shape will be distorted.
 * This may be what you want.
 *
 * A Gradient can be animated by modifying its `offset` property,
 * or by modifying the ramp data. If you modify ramp data,
 * you may have to call `gradient.ramp.encode()` to rebuild it.
 *
 * @example
 * // Create a linear gradient going left to right.
 * scene.add.gradient(undefined, 100, 100, 200, 200);
 *
 * // Create a glowing halo.
 * var halo = scene.add.gradient({
 *     bands: [
 *         {
 *             start: 0.5,
 *             end: 0.6,
 *             colorStart: [ 0.5, 0.5, 1, 0 ],
 *             colorEnd: 0xffffff,
 *             colorSpace: 1,
 *             interpolation: 4,
 *         },
 *         {
 *             start: 0.6,
 *             end: 1,
 *             colorStart: 0xffffff,
 *             colorEnd: [ 1, 0.5, 0.5, 0 ],
 *             colorSpace: 1,
 *             interpolation: 3,
 *         },
 *     ],
 *     dither: true,
 *     repeatMode: 1,
 *     shapeMode: 2,
 *     start: { x: 0.5, y: 0.5 },
 *     shape: { x: 0.5, y: 0.0 },
 * }, 400, 300, 800, 800);
 *
 * // Animate the halo, given a `time` value in seconds:
 * halo.offset = 0.1 * (1 + Math.sin(time/1000));
 *
 * @class Gradient
 * @extends Phaser.GameObjects.Shader
 * @memberof Phaser.GameObjects
 * @since 4.0.0
 * @constructor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.Types.GameObjects.Gradient.GradientQuadConfig} [config] - The configuration for this Game Object.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 */
var Gradient = new Class({
    Extends: Shader,

    initialize: function Gradient (scene, config, x, y, width, height)
    {
        if (!config) { config = {}; }

        var shaderConfig = {
            name: 'gradient',
            fragmentSource: GradientFrag,
            shaderAdditions: [
                {
                    name: 'RAMP_0',
                    tags: 'RAMP',
                    additions: {
                        fragmentHeader: RampGlsl
                    }
                }
            ],
            initialUniforms: {
                uRampTexture: 0
            },
            setupUniforms: this._setupUniforms,
            updateShaderConfig: this._updateShaderConfig
        };

        Shader.call(this, scene, shaderConfig, x, y, width, height);

        this.type = 'Gradient';

        /**
         * The ramp which contains the color data for the gradient.
         *
         * By default, this is a linear progression from black to white.
         * You can encode much more complex gradients with the ColorRamp.
         *
         * @name Phaser.GameObjects.Gradient#ramp
         * @type {Phaser.Display.ColorRamp}
         * @since 4.0.0
         */
        this.ramp = new ColorRamp(this.scene, config.bands || {
            colorStart: 0x000000,
            colorEnd: 0xffffff
        });

        /**
         * Move the start of the gradient.
         * You can animate gradients in this way.
         *
         * Note that the offset effect changes based on shape and repeat mode.
         * Conic gradients may appear weird!
         *
         * Animate the offset from -1 to 1 using mode 1 (TRUNCATE)
         * to create a one-time shockwave.
         *
         * Use mode 2 (SAWTOOTH) or 3 (TRIANGULAR) to create a moving pattern.
         *
         * @name Phaser.GameObjects.Gradient#offset
         * @type {number}
         * @default 0
         * @since 4.0.0
         */
        this.offset = config.offset || 0;

        /**
         * The repeat mode of the gradient.
         * Gradient progress is evaluated as a number,
         * where 0 is the start of the `shape` vector and 1 is the end.
         * Repeat mode tells us how to handle that number below 0/above 1.
         *
         * This can be one of the following:
         *
         * - 0 (EXTEND): values are clamped between 0 and 1,
         *   so the ends of the gradient become flat color.
         * - 1 (TRUNCATE): values are discarded outside 0-1,
         *   so the ends of the gradient become transparent.
         * - 2 (SAWTOOTH): values are modulo 1,
         *   so the gradient repeats.
         * - 3 (TRIANGULAR): values rise to 1 then fall to 0,
         *   so the gradient goes smoothly back and forth.
         *
         * Note that conic gradients never leave the range 0-1
         * unless offset is applied. They may look weird if you do.
         *
         * @name Phaser.GameObjects.Gradient#repeatMode
         * @type {number}
         * @default 0
         * @since 4.0.0
         */
        this.repeatMode = config.repeatMode || 0;

        /**
         * The shape mode of the gradient.
         * Shapes are based on the `shape` vector.
         *
         * This can be one of the following:
         *
         * - 0 (LINEAR): a ribbon where the shape points from one side to the other.
         *   Commonly used for skies etc.
         * - 1 (BILINEAR): like LINEAR, but reflected in both directions.
         *   Useful for gentle waves, reflections etc.
         * - 2 (RADIAL): gradient spreads out from the `start`,
         *   to the radius described by `shape`.
         *   Useful for glows, ripples etc.
         * - 3 (CONIC_SYMMETRIC): gradient is determined by angle to `shape`,
         *   going from 0 along the shape vector to 1 opposite it.
         *   Useful for sharp-looking features or light effects.
         * - 4 (CONIC_ASYMMETRIC): gradient is determined by angle to `shape`,
         *   going from 0 to 1 with a full rotation. This creates a seam.
         *   Good for creating colors that change with angle,
         *   like speed meters.
         *
         * @name Phaser.GameObjects.Gradient#shapeMode
         * @type {number}
         * @default 0
         * @since 4.0.0
         */
        this.shapeMode = config.shapeMode || 0;

        /**
         * The start location of the gradient within its quad.
         * The gradient emanates from this point.
         * Gradient color starts here and ends at the tip of the `shape` vector.
         *
         * @name Phaser.GameObjects.Gradient#start
         * @type {Phaser.Types.Math.Vector2Like}
         * @since 4.0.0
         */
        this.start = new Vector2(0, 0);
        if (config.start)
        {
            this.start.copy(config.start);
        }

        /**
         * The shape vector of the gradient within its quad.
         * This points from the start in the direction that the gradient flows.
         * Gradient color starts from the `start` vector and ends at the tip of this.
         *
         * @name Phaser.GameObjects.Gradient#shape
         * @type {Phaser.Types.Math.Vector2Like}
         * @since 4.0.0
         */
        this.shape = new Vector2(1, 0);
        if (config.shape)
        {
            this.shape.copy(config.shape);
        }
        else
        {
            var length = config.length === undefined ? 1 : config.length;
            var direction = config.direction || 0;
            this.shape.setTo(length * Math.cos(direction), length * Math.sin(direction));
        }

        /**
         * Whether to dither the gradient.
         * This helps to eliminate banding by adding a tiny amount of noise
         * to the gradient.
         * Dither may lose effectiveness if resized, so you should only enable
         * it when it will make a difference.
         *
         * @name Phaser.GameObjects.Gradient#dither
         * @type {boolean}
         * @since 4.0.0
         * @default false
         */
        this.dither = !!config.dither;

        this.setTextures([ this.ramp.dataTexture ]);
    },

    /**
     * The function which sets uniforms for the shader.
     * This is provided to the Shader base class as `setupUniforms`.
     * You should not override `setupUniforms` on a Gradient.
     *
     * @method Phaser.GameObjects.Gradient#_setupUniforms
     * @private
     * @since 4.0.0
     * @param {function} setUniform - The function which sets uniforms. `(name: string, value: any) => void`.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - A reference to the current drawing context.
     */
    _setupUniforms: function (setUniform, drawingContext)
    {
        setUniform('uRampResolution', this.ramp.dataTextureResolution);
        setUniform('uRampBandStart', this.ramp.dataTextureFirstBand);
        setUniform('uOffset', this.offset);
        setUniform('uRepeatMode', this.repeatMode);
        setUniform('uShapeMode', this.shapeMode);
        setUniform('uStart', [ this.start.x, 1 - this.start.y ]);
        setUniform('uShape', [ this.shape.x, -this.shape.y ]);
        setUniform('uDither', this.dither);
    },

    /**
     * The function which updates shader configuration.
     * This is provided to the Shader base class as `updateShaderConfig`.
     * You should not override `updateShaderConfig` on a Gradient.
     *
     * @method Phaser.GameObjects.Gradient#_updateShaderConfig
     * @private
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - A reference to the current drawing context.
     * @param {Phaser.GameObjects.Gradient} gameObject - The game object which is rendering.
     * @param {Phaser.Renderer.WebGL.RenderNodes.ShaderQuad} renderNode - The render node currently rendering.
     */
    _updateShaderConfig: function (drawingContext, gameObject, renderNode)
    {
        var depth = gameObject.ramp.bandTreeDepth;

        var bandTreeDepth = renderNode.programManager.getAdditionsByTag('RAMP')[0];
        bandTreeDepth.name = 'RAMP_' + depth;
        bandTreeDepth.additions.fragmentHeader = RampGlsl.replace(
            '#define BAND_TREE_DEPTH 0.0',
            '#define BAND_TREE_DEPTH ' + depth + '.0'
        );
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.Gradient#preDestroy
     * @protected
     * @since 4.0.0
     */
    preDestroy: function ()
    {
        this.ramp.destroy();

        Shader.prototype.preDestroy.call(this);
    }
});

module.exports = Gradient;
