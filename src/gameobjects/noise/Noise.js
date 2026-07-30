/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var Class = require('../../utils/Class');
var Shader = require('../shader/Shader');
var Color = require('../../display/color/Color');
var NoiseFrag = require('../../renderer/webgl/shaders/Noise-frag');

/**
 * @classdesc
 * A Noise Game Object.
 *
 * This game object is a quad which displays random noise.
 * You can manipulate this object like any other, make it interactive,
 * and use it in filters and masks to create visually stunning effects.
 *
 * Behind the scenes, a Noise is a {@link Phaser.GameObjects.Shader}
 * using a specific shader program.
 *
 * Noise or 'white noise' is simply random values.
 * These are created by hashing the offset pixel coordinates,
 * so the same noise is always created at the same position.
 * This creates a reproducible effect.
 *
 * You can set the color and transparency of the noise.
 *
 * You can scroll the noise by animating the `noiseOffset` property.
 * Note that floating-point precision is very important to this effect.
 * Scrolling very large distances may cause blockiness in the output.
 * Scrolling very small distances may cause the output to change completely,
 * as it is not processing the same exact values.
 * If you scroll by an exact fraction of the resolution of the object,
 * the output will remain mostly the same,
 * but it is not guaranteed to be stable.
 * It's more effective to use `setRenderToTexture` and use this as a texture
 * in a TileSprite.
 *
 * You can set `noisePower` to sculpt the output levels.
 * Higher power reduces higher values.
 * Lower power reduces lower values.
 *
 * @class Noise
 * @extends Phaser.GameObjects.Shader
 * @memberof Phaser.GameObjects
 * @since 4.0.0
 * @constructor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.Types.GameObjects.Noise.NoiseQuadConfig} [config] - The configuration for this Game Object.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 */
var Noise = new Class({
    Extends: Shader,

    initialize: function Noise (scene, config, x, y, width, height)
    {
        if (!config) { config = {}; }

        var shaderConfig = {
            name: 'noise',
            fragmentSource: NoiseFrag,
            setupUniforms: this._setupUniforms
        };

        Shader.call(this, scene, shaderConfig, x, y, width, height);

        this.type = 'Noise';

        /**
         * The offset of the noise in each dimension: [ x, y ].
         * Animate x and y to scroll the noise pattern.
         *
         * This must be an array of 2 numbers.
         *
         * @name Phaser.GameObjects.Noise#noiseOffset
         * @type {number[]}
         * @default [ 0, 0 ]
         * @since 4.0.0
         */
        this.noiseOffset = [ 0, 0 ];
        if (config.noiseOffset)
        {
            this.noiseOffset = config.noiseOffset;
        }

        /**
         * The power to apply to the noise value.
         * This can enhance/suppress high/low noise.
         *
         * @name Phaser.GameObjects.Noise#noisePower
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.noisePower = config.noisePower === undefined ? 1 : config.noisePower;

        /**
         * The color mapped to low noise values (approaching 0).
         *
         * The default is black. You can set any color, and change the alpha.
         *
         * @name Phaser.GameObjects.Noise#noiseColorStart
         * @type {Phaser.Display.Color}
         * @since 4.0.0
         */
        this.noiseColorStart = new Color(0, 0, 0);

        /**
         * The color mapped to high noise values (approaching 1).
         *
         * The default is white. You can set any color, and change the alpha.
         *
         * @name Phaser.GameObjects.Noise#noiseColorEnd
         * @type {Phaser.Display.Color}
         * @since 4.0.0
         */
        this.noiseColorEnd = new Color(255, 255, 255);

        if (config.noiseColorStart !== undefined || config.noiseColorEnd !== undefined)
        {
            this.setNoiseColor(config.noiseColorStart, config.noiseColorEnd);
        }

        /**
         * Whether to render channel noise separately,
         * creating many colors of output.
         *
         * @name Phaser.GameObjects.Noise#noiseRandomChannels
         * @type {boolean}
         * @default false
         * @since 4.0.0
         */
        this.noiseRandomChannels = !!config.noiseRandomChannels;

        /**
         * Whether to render a random normal value per pixel.
         * The normal is in the hemisphere facing the camera.
         *
         * This value overrides `noiseRandomChannels`.
         *
         * @name Phaser.GameObjects.Noise#noiseRandomNormal
         * @type {boolean}
         * @default false
         * @since 4.0.0
         */
        this.noiseRandomNormal = !!config.noiseRandomNormal;
    },

    /**
     * Set the colors of the noise, from a variety of color formats.
     *
     * - A number is expected to be a 24 or 32 bit RGB or ARGB value.
     * - A string is expected to be a hex code.
     * - An array of numbers is expected to be RGB or RGBA in the range 0-1.
     * - A Color object can be used.
     *
     * @method Phaser.GameObjects.Noise#setNoiseColor
     * @since 4.0.0
     * @param {number | string | number[] | Phaser.Display.Color} [start=0x000000] - The color mapped to low noise values (approaching 0).
     * @param {number | string | number[] | Phaser.Display.Color} [end=0xffffff] - The color mapped to high noise values (approaching 1).
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
     * The function which sets uniforms for the shader.
     * This is provided to the Shader base class as `setupUniforms`.
     * You should not override `setupUniforms` on this object.
     *
     * @method Phaser.GameObjects.Noise#_setupUniforms
     * @private
     * @since 4.0.0
     * @param {function} setUniform - The function which sets uniforms. `(name: string, value: any) => void`.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - A reference to the current drawing context.
     */
    _setupUniforms: function (setUniform)
    {
        setUniform('uOffset', this.noiseOffset);
        setUniform('uColorStart', this.noiseColorStart.gl);
        setUniform('uColorEnd', this.noiseColorEnd.gl);
        setUniform('uPower', this.noisePower);

        var mode = 0;
        if (this.noiseRandomChannels) { mode = 1; }
        if (this.noiseRandomNormal) { mode = 2; }
        setUniform('uMode', mode);
    }
});

module.exports = Noise;
