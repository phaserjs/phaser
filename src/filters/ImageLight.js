/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var Matrix4 = require('../math/Matrix4');
var TransformMatrix = require('../gameobjects/components/TransformMatrix');
var Texture = require('../textures/Texture');

/**
 * @classdesc
 * The ImageLight Filter Controller.
 *
 * This filter controller manages the ImageLight effect for a Camera.
 *
 * ImageLight is a filter for image based lighting (IBL).
 * It is used to simulate the lighting of an image
 * using an environment map and a normal map.
 *
 * The environment map is an image that describes the lighting of the scene.
 * This filter uses a single panorama image as the environment map.
 * The top of the image is the sky, the bottom is the ground,
 * and the X axis covers a full rotation.
 * This kind of image is distorted towards the top and bottom,
 * as the X axis is stretched wider and wider,
 * so be careful if you're creating your own environment maps.
 *
 * Cube maps are not supported by Phaser at the time of writing.
 *
 * The effect is basically a reflection of the environment at infinite range.
 * A sharp environment map will produce a sharp reflection,
 * while a blurry environment map will produce a diffuse reflection.
 * Use the PanoramaBlur filter to create correctly blurred environment maps.
 * Use the NormalTools filter to manipulate the normal map if necessary,
 * using a DynamicTexture to capture the output.
 *
 * An ImageLight effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addImageLight({ texture: 'lightmap' });
 * camera.filters.external.addImageLight({ texture: 'lightmap' });
 * ```
 *
 * @class ImageLight
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {Phaser.Types.Filters.ImageLightConfig} [config] - The configuration object for the ImageLight effect.
 */
var ImageLight = new Class({
    Extends: Controller,

    initialize: function ImageLight (camera, config)
    {
        Controller.call(this, camera, 'FilterImageLight');

        /**
         * The underlying texture used for the ImageLight effect normal map.
         *
         * @name Phaser.Filters.ImageLight#normalGlTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 4.0.0
         */
        this.normalGlTexture;

        /**
         * The underlying texture used for the ImageLight effect environment map.
         *
         * @name Phaser.Filters.ImageLight#environmentGlTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 4.0.0
         */
        this.environmentGlTexture;

        /**
         * The view matrix used for the ImageLight effect.
         * This controls the orientation of the environment map.
         * You should set this to reflect the perspective of the camera.
         *
         * @name Phaser.Filters.ImageLight#viewMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 4.0.0
         */
        this.viewMatrix = new Matrix4();

        /**
         * The initial rotation of the model in radians.
         * This will be overridden by the modelRotationSource if it is set.
         *
         * @name Phaser.Filters.ImageLight#modelRotation
         * @type {number}
         * @since 4.0.0
         */
        this.modelRotation = config.modelRotation || 0;

        /**
         * The source of the model rotation, used when the filter renders.
         * If a function, it will be called to get the rotation.
         * If a GameObject, it will be used to get the rotation from the GameObject's world transform.
         * If null, the model rotation will be taken from the modelRotation property.
         *
         * @name Phaser.Filters.ImageLight#modelRotationSource
         * @type {Phaser.GameObjects.GameObject | Phaser.Types.Filters.ImageLightSourceCallback | null}
         * @since 4.0.0
         */
        this.modelRotationSource = config.modelRotationSource || null;

        /**
         * The amount of bulge to apply to the ImageLight effect.
         * This distorts the surface slightly, preventing flat areas in the normal map from reflecting a single flat color.
         * A value of 0.1 is often plenty.
         *
         * @name Phaser.Filters.ImageLight#bulge
         * @type {number}
         * @since 4.0.0
         */
        this.bulge = config.bulge || 0;

        /**
         * The color factor to apply to the ImageLight effect. This multiplies the intensity of the light in each color channel. Use values above 1 to substitute for high dynamic range lighting.
         *
         * @name Phaser.Filters.ImageLight#colorFactor
         * @type {number[]}
         * @since 4.0.0
         */
        this.colorFactor = config.colorFactor || [ 1, 1, 1 ];

        /**
         * A temporary matrix used for the ImageLight effect.
         *
         * @name Phaser.Filters.ImageLight#_tempMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._tempMatrix = new TransformMatrix();

        /**
         * A temporary parent matrix used for the ImageLight effect.
         *
         * @name Phaser.Filters.ImageLight#_tempParentMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._tempParentMatrix = new TransformMatrix();

        this.setEnvironmentMap(config.environmentMap || '__WHITE');
        this.setNormalMap(config.normalMap || '__NORMAL');
        if (config.viewMatrix)
        {
            this.viewMatrix.set(config.viewMatrix);
        }
    },

    /**
     * Sets the texture to use for the ImageLight effect environment map.
     *
     * @method Phaser.Filters.ImageLight#setEnvironmentMap
     * @since 4.0.0
     * @param {string|Phaser.Textures.Texture} texture - The texture to use for the ImageLight effect environment map.
     * @return {this} This ImageLight instance.
     */
    setEnvironmentMap: function (texture)
    {
        var phaserTexture = texture instanceof Texture ? texture : this.camera.scene.sys.textures.getFrame(texture);

        if (phaserTexture)
        {
            this.environmentGlTexture = phaserTexture.glTexture;
        }

        return this;
    },

    /**
     * Sets the texture to use for the ImageLight effect normal map.
     * This should match the object being filtered.
     *
     * @method Phaser.Filters.ImageLight#setNormalMap
     * @since 4.0.0
     * @param {string|Phaser.Textures.Texture} texture - The texture to use for the ImageLight effect normal map.
     * @return {this} This ImageLight instance.
     */
    setNormalMap: function (texture)
    {
        var phaserTexture = texture instanceof Texture ? texture : this.camera.scene.sys.textures.getFrame(texture);

        if (phaserTexture)
        {
            this.normalGlTexture = phaserTexture.glTexture;
        }

        return this;
    },

    /**
     * Sets the normal texture to use for the ImageLight effect from a GameObject.
     * This will use the first data source image in the object's texture.
     * Use this to extract a normal map which was loaded as a data source.
     *
     * @method Phaser.Filters.ImageLight#setNormalMapFromGameObject
     * @since 4.0.0
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject to use for the ImageLight effect normal map.
     * @return {this} This ImageLight instance.
     */
    setNormalMapFromGameObject: function (gameObject)
    {
        var texture = gameObject.texture;
        var normalDataSource = texture.dataSource[0];
        if (normalDataSource)
        {
            this.normalGlTexture = normalDataSource.glTexture;
        }

        return this;
    },

    /**
     * Gets the rotation to use for the ImageLight effect.
     * This will use the modelRotationSource if it is set.
     *
     * @method Phaser.Filters.ImageLight#getModelRotation
     * @since 4.0.0
     * @return {number} The rotation to use for the ImageLight effect in radians.
     */
    getModelRotation: function ()
    {
        if (!this.modelRotationSource)
        {
            return this.modelRotation;
        }

        if (typeof this.modelRotationSource === 'function')
        {
            return this.modelRotationSource();
        }

        if (this.modelRotationSource.hasTransformComponent)
        {
            return this.modelRotationSource.getWorldTransformMatrix(this._tempMatrix, this._tempParentMatrix).rotationNormalized;
        }

        // This should never happen.
        return this.modelRotation;
    }
});

module.exports = ImageLight;
