/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var Matrix4 = require('../math/Matrix4');
var Vector3 = require('../math/Vector3');

/**
 * @classdesc
 * The NormalTools Filter Controller.
 *
 * This filter controller manages the NormalTools effect for a Camera.
 *
 * NormalTools is a filter for manipulating the normals of a normal map.
 * It has several functions:
 *
 * - Rotate or reorient the normal map.
 * - Change how strongly the normals face the camera.
 * - Output a grayscale texture showing how strongly the normals face the camera, or some other vector.
 *
 * The output can be used for various purposes, such as:
 *
 * - Editing a normal map for special applications.
 * - Altering the apparent visual depth of a normal map by manipulating the facing power.
 * - Creating a base for other effects, such as a mask for a gradient or other effect.
 *
 * You can even use the output as a normal map for regular lighting.
 * Ordinarily, normal maps are loaded alongside the main texture,
 * but you can override this.
 *
 * ```js
 * // Given a dynamic texture `dyn` where the filter output is drawn,
 * // and a texture `spiderTex` with lighting enabled,
 * // we can inject the WebGL texture straight into the scene lighting as a normal map.
 * spiderTex.setDataSource(dyn.getWebGLTexture());
 * ```
 *
 * A NormalTools effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 * camera.filters.internal.addNormalTools({
 *     rotation: 0,
 *     facingPower: 1,
 *     outputRatio: false,
 *     ratioVector: [ 0, 0, 1 ],
 *     ratioRadius: 1
 * });
 * camera.filters.external.addNormalTools({});
 * ```
 *
 * @class NormalTools
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {Phaser.Types.Filters.NormalToolsConfig} [config] - The configuration object for the NormalTools effect.
 */
var NormalTools = new Class({
    Extends: Controller,

    initialize: function NormalTools (camera, config)
    {
        config = config || {};

        Controller.call(this, camera, 'FilterNormalTools');

        /**
         * A private record of the last rotation set by `setRotation`
         * or updated by `updateRotation`.
         * This may be different from the `viewMatrix` rotation
         * if the `viewMatrix` is manipulated directly.
         *
         * @name Phaser.Filters.NormalTools#_rotation
         * @type {number}
         * @since 4.0.0
         * @default 0
         * @private
         */
        this._rotation = 0;

        /**
         * The view matrix used for the NormalTools effect.
         * This controls the orientation of the normal map.
         * Use this to control 3D rotation of the normal map.
         * Ordinarily, you would just use `setRotation` for 2D rotation.
         *
         * @name Phaser.Filters.NormalTools#viewMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 4.0.0
         */
        this.viewMatrix = new Matrix4();

        this.setRotation(config.rotation || 0);

        /**
         * The source of the rotation.
         * If a function, it will be called to get the rotation.
         * If a GameObject, it will be used to get the rotation from the GameObject's world transform.
         * If null, the rotation will not be updated by the filter.
         *
         * @name Phaser.Filters.NormalTools#rotationSource
         * @type {Phaser.GameObjects.GameObject | Phaser.Types.Filters.NormalToolsSourceCallback | null}
         * @since 4.0.0
         */
        this.rotationSource = config.rotationSource || null;

        /**
         * The power of the facing effect.
         * Higher values bend normals toward the camera; lower values bend them away.
         * This can be useful for suggesting depth in a 2D scene.
         *
         * @name Phaser.Filters.NormalTools#facingPower
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.facingPower = config.facingPower || 1;

        /**
         * Whether to output the ratio of the normal map.
         * If true, the output will be a grayscale texture, with the white area
         * being the areas where the normals are facing the camera,
         * fading to black when they're orthogonal.
         * You can manipulate this ratio with `ratioVector` and `ratioRadius`.
         * This can be useful as a base for other effects.
         *
         * @name Phaser.Filters.NormalTools#outputRatio
         * @type {boolean}
         * @default false
         * @since 4.0.0
         */
        this.outputRatio = config.outputRatio || false;

        /**
         * The vector to use for the ratio output.
         * This is the direction in which the ratio will be calculated.
         * The default is the camera's forward direction.
         * Manipulate this to highlight parts of the map which are facing in a specific direction.
         *
         * This is only used if outputRatio is true.
         *
         * @name Phaser.Filters.NormalTools#ratioVector
         * @type {Phaser.Math.Vector3}
         * @since 4.0.0
         */
        this.ratioVector = new Vector3(0, 0, 1);
        if (config.ratioVector)
        {
            this.ratioVector.set(config.ratioVector[0], config.ratioVector[1], config.ratioVector[2]);
        }

        /**
         * How much of a hemisphere to consider for the ratio output.
         * At 1, the ratio will be calculated for the entire hemisphere.
         * At 0, the ratio will be calculated for a single point.
         * This uses the same algorithm as `PanoramaBlur.radius`.
         *
         * This is only used if outputRatio is true.
         *
         * @name Phaser.Filters.NormalTools#ratioRadius
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.ratioRadius = config.ratioRadius || 1;
    },

    /**
     * Gets the 2D rotation of the normal map,
     * as set by `setRotation` or the `rotationSource`.
     *
     * This value is not accurate if the `viewMatrix` is manipulated directly,
     * e.g. for 3D rotation. There is no single value which can
     * accurately represent 3D rotation.
     *
     * @method Phaser.Filters.NormalTools#getRotation
     * @since 4.0.0
     * @return {number} The rotation in radians.
     */
    getRotation: function ()
    {
        if (this.rotationSource)
        {
            if (typeof this.rotationSource === 'function')
            {
                return this.rotationSource();
            }

            if (this.rotationSource.hasTransformComponent)
            {
                return this.rotationSource.getWorldTransformMatrix().rotationNormalized;
            }
        }

        return this._rotation;
    },

    /**
     * Sets the rotation of the normal map.
     * This sets the `viewMatrix` to a rotation around the Z axis,
     * suitable for 2D rotation.
     * For more advanced controls, manipulate the filter's `viewMatrix` to control 3D rotation.
     *
     * @method Phaser.Filters.NormalTools#setRotation
     * @since 4.0.0
     * @param {number} rotation - The rotation in radians.
     * @return {this} This NormalTools instance.
     */
    setRotation: function (rotation)
    {
        this.viewMatrix.identity().rotateZ(rotation);
        this._rotation = rotation;

        return this;
    },

    /**
     * Updates the rotation of the normal map from the rotationSource,
     * if it is set. This is called automatically during rendering.
     *
     * @method Phaser.Filters.NormalTools#updateRotation
     * @since 4.0.0
     * @return {this} This NormalTools instance.
     */
    updateRotation: function ()
    {
        if (this.rotationSource)
        {
            var rotation = this.getRotation();
            this.viewMatrix.identity().rotateZ(rotation);
            this._rotation = rotation;
        }

        return this;
    }
});

module.exports = NormalTools;
