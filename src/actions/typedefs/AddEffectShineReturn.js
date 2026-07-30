/**
 * @typedef {object} Phaser.Types.Actions.AddEffectShineReturn
 * @since 4.0.0
 *
 * @property {Phaser.Cameras.Scene2D.Camera|Phaser.GameObjects.GameObject} item - The object or camera to which the shine is applied.
 * @property {Phaser.GameObjects.Gradient} gradient - The gradient which controls the shine area. This is not added to the scene, so it will be garbage collected once all references and the tween are destroyed.
 * @property {Phaser.Textures.DynamicTexture} dynamicTexture - The texture where the gradient is rendered, after any filters are applied. This will be destroyed when the target is destroyed. You can destroy it earlier, but it is accessed by the tween, so ensure the tween has stopped.
 * @property {Phaser.Tweens.Tween} tween - The tween which controls the gradient motion. When this updates, the dynamicTexture is redrawn. This will be destroyed when the target is destroyed. You can destroy it earlier to stop the gradient from updating.
 * @property {?Phaser.Filters.ParallelFilters} parallelFilters - The ParallelFilters filter which adds the shine to the image. This will not be defined if the Shine is in `reveal` mode. This belongs to the target and will be removed when the target is destroyed. You can remove it yourself to remove the shine effect, if not in `reveal` mode.
 * @property {Phaser.Filters.Blend} blendFilter - The Blend filter which makes the image shine by multiplying it by the gradient. This controls the brightness of the shine. In `reveal` mode, this belongs to the target and will be removed when the target is destroyed. You can remove if yourself to remove the shine effect. When not in `reveal` mode, this belongs to `parallelFilters.top`.
 */
