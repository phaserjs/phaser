/**
 * @typedef {object} Phaser.Types.Filters.ImageLightConfig
 * @since 4.0.0
 *
 * @property {string|Phaser.Textures.Texture} [normalMap='__NORMAL'] - The texture to use for the ImageLight effect normal map. This should match the object being filtered. The default is flat lighting.
 * @property {string|Phaser.Textures.Texture} [environmentMap='__WHITE'] - The texture to use for the ImageLight effect environment map.
 * @property {Phaser.Math.Matrix4} [modelMatrix] - The initial model matrix. If not provided, a default matrix will be created.
 * @property {number} [modelRotation=0] - The initial rotation of the model in radians.
 * @property {Phaser.GameObjects.GameObject | Phaser.Types.Filters.ImageLightSourceCallback | null} [modelRotationSource=null] - The source of the model rotation. If a function, it will be called to get the rotation. If a GameObject, it will be used to get the rotation from the GameObject's world transform. If null, the model rotation will be taken from the modelRotation property.
 * @property {number} [bulge=0] - The amount of bulge to apply to the ImageLight effect. This distorts the surface slightly, preventing flat areas in the normal map from reflecting a single flat color. A value of 0.1 is often plenty.
 * @property {number[]} [colorFactor=[1, 1, 1]] - The color factor to apply to the ImageLight effect. This multiplies the intensity of the light in each color channel. Use values above 1 to substitute for high dynamic range lighting.
 */
