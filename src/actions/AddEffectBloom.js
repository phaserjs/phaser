/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = require('../renderer/BlendModes');

/**
 * Adds a Bloom effect to a Camera or GameObject or list thereof.
 *
 * Bloom is a phenomenon where bright light spreads across an image.
 * It can be used to add to the realism of a scene,
 * although too much is obvious and a subtle effect is best.
 *
 * This Action creates a Bloom effect by applying several Filters to the target.
 *
 * - `ParallelFilters` splits the filter stream, allowing us to combine
 *   the results of other filters with the original image.
 *   The other filters are added to the `top` stream.
 * - `Threshold` removes darker colors.
 * - `Blur` spreads the remaining bright colors out.
 *
 * This Action returns an object containing references to these filters.
 * You can control their properties directly,
 * e.g. if you want to animate the Bloom,
 * or if you want to set properties this Action doesn't surface.
 *
 * The Bloom effect will be destroyed like any other filter on target shutdown.
 * To disable or remove the Bloom effect manually, access the `parallelFilters`
 * controller in the return object. It holds the other filters.
 *
 * - `parallelFilters.active = false`: deactivate Bloom
 * - `parallelFilters.destroy()`: destroy Bloom
 *
 * Bloom is best as a full-screen effect. If you apply it to a GameObject with
 * alpha regions, it cannot blend the light glow properly with the background.
 * This is because the glow should use ADD blend, but the object itself should
 * use NORMAL blend, and it can't do both.
 * You can still apply bloom to a GameObject,
 * but it works best on a solid texture.
 *
 * @example
 * // Apply bloom to the scene camera.
 * Phaser.Actions.AddEffectBloom(this.cameras.main);
 *
 * @example
 * // Access the filters that make up a Bloom effect.
 * const { parallelFilters, threshold, blur } = Phaser.Actions.AddEffectBloom(this.cameras.main)[0]; // The return is an array.
 *
 * // Destroy the bloom effect.
 * parallelFilters.destroy();
 *
 * @example
 * // Emulate the Phaser 3 Bloom effect,
 * // including the way bloom strength darkens instead of mixes.
 * const { parallelFilters, threshold, blur } = Phaser.Actions.AddEffectBloom(
 *     image,
 *     {
 *         blendAmount: 0.5,
 *         blurQuality: 1,
 *     }
 * );
 *
 * threshold.active = false;
 * parallelFilters.bottom.addBlend(undefined, Phaser.BlendModes.MULTIPLY, 1, [ 0. * 5, 0.5, 0.5, 0.5 ]);
 *
 * @function Phaser.Actions.AddEffectBloom
 * @since 4.0.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera|Phaser.GameObjects.GameObject|Array.<(Phaser.Cameras.Scene2D.Camera|Phaser.GameObjects.GameObject)>} items - Recipients of the Bloom effect
 * @param {Phaser.Types.Actions.AddEffectBloomConfig} [config] - Initial configuration of the Bloom effect.
 *
 * @return {Phaser.Types.Actions.AddEffectBloomReturn[]} A list of objects containing the filters which were created.
 */
var AddEffectBloom = function (items, config)
{
    if (!Array.isArray(items)) { items = [ items ]; }
    if (!config) { config = {}; }
    var threshold = config.threshold === undefined ? 0.5 : config.threshold;
    var blurRadius = config.blurRadius === undefined ? 2 : config.blurRadius;
    var blurSteps = config.blurSteps === undefined ? 4 : config.blurSteps;
    var blurQuality = config.blurQuality === undefined ? 0 : config.blurQuality;
    var blendAmount = config.blendAmount === undefined ? 1 : config.blendAmount;
    var blendMode = config.blendMode === undefined ? BlendModes.ADD : config.blendMode;

    var output = [];

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        if (item.enableFilters) { item.enableFilters(); }
        var filterList = config.useInternal ? item.filters.internal : item.filters.external;
        var parallelFilters = filterList.addParallelFilters();
        var thresholdFilter = parallelFilters.top.addThreshold(threshold, 1);
        var blurFilter = parallelFilters.top.addBlur(blurQuality, blurRadius, blurRadius, 1, 0xffffff, blurSteps);
        parallelFilters.blend.blendMode = blendMode;
        parallelFilters.blend.amount = blendAmount;

        output.push({
            item: item,
            parallelFilters: parallelFilters,
            threshold: thresholdFilter,
            blur: blurFilter
        });
    }

    return output;
};

module.exports = AddEffectBloom;
