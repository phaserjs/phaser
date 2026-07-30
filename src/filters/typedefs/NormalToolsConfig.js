/**
 * @typedef {object} Phaser.Types.Filters.NormalToolsConfig
 * @since 4.0.0
 *
 * @property {number} [rotation=0] - 2D rotation of the normal map in radians. For more advanced controls, manipulate the filter's `viewMatrix` to control 3D rotation.
 * @property {Phaser.GameObjects.GameObject | Phaser.Types.Filters.NormalToolsSourceCallback | null} [rotationSource=null] - The source of the rotation. If a function, it will be called to get the rotation. If a GameObject, it will be used to get the rotation from the GameObject's world transform. If null, the rotation will not be updated by the filter.]
 * @property {number} [facingPower=1] - Manipulate the tendency for normals to face the camera. Higher values bend normals toward the camera; lower values bend them away. This can be useful for suggesting depth in a 2D scene.
 * @property {boolean} [outputRatio=false] - If true, the output will be a grayscale texture, with the white area being the areas where the normals are facing the camera, fading to black when they're orthogonal. This can be useful as a base for other effects.
 * @property {Phaser.Math.Vector3} [ratioVector=[0, 0, 1]] - The vector to use for the ratio output. This is the direction in which the ratio will be calculated. The default is the camera's forward direction. Manipulate this to highlight parts of the map which are facing in a specific direction. This is only used if outputRatio is true.
 * @property {number} [ratioRadius=1] - How much of a hemisphere to consider for the ratio output. At 1, the ratio will be calculated for the entire hemisphere. At 0, the ratio will be calculated for a single point. This uses the same algorithm as `PanoramaBlur.radius`. This is only used if outputRatio is true.
 */
