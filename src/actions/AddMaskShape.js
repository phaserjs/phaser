/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObject = require('../gameobjects/GameObject');
var Rectangle = require('../geom/rectangle');
var FitToRegion = require('./FitToRegion');

/**
 * Apply a Mask to a GameObject or Camera or list thereof using a Shape.
 *
 * This is a quick way to add a mask to an object/camera.
 * It creates a Shape and uses FitToRegion to size it correctly.
 *
 * By default, the Mask is a circle, scaled to fit both X and Y axes
 * of the game canvas (so it's not really a circle any more).
 *
 * You can change the shape to 'square', 'rectangle', or 'ellipse'.
 * Control the shape of rectangles or ellipses via `config.aspectRatio`.
 *
 * You can change the coverage much like FitToRegion.
 * You can scale to fit inside, outside, or both axes.
 * You can set the target region; if you do not, the action will choose
 * an appropriate region for you.
 *
 * The action supports an optional Blur effect, applied to the shape.
 * This is good for soft edges on masks.
 * You can use `config.padding` to shrink the shape region inward, leaving room for the blur to spread outward to the intended boundary.
 *
 * The Shape is removed from the scene upon creation.
 * You don't need to manage its life cycle; it should be garbage collected
 * once the Mask filter is destroyed, usually when the scene or target
 * is shut down.
 * If you want to access the Shape, it is available on the mask filter.
 *
 * If you apply this to multiple objects at once,
 * they all have their own shape and mask filter.
 * Note that, if you use external filters, the masks will seem to line up.
 * In this case, it might be more efficient to put all the targets into
 * a Layer or Container and mask that instead.
 *
 * @example
 * const mask = Phaser.Actions.AddMaskShape(target, {
 *     blurRadius: 2,
 *     padding: 2
 * })[0]; // The return is an array.
 * const shape = mask.maskGameObject; // This reference prevents garbage collection until `shape` is dropped.
 * const blur = shape.filters.external.list[0]; // Nothing else should be in this list.
 *
 * @function Phaser.Actions.AddMaskShape
 * @since 4.0.0
 *
 * @param {Phaser.GameObjects.GameObject | Phaser.Cameras.Scene2D.Camera | Array.<(Phaser.GameObjects.GameObject | Phaser.Cameras.Scene2D.Camera)>} items - The GameObject or Camera or list thereof to which to apply a mask.
 * @param {Phaser.Types.Actions.AddMaskShapeConfig} config - The configuration of the mask shape.
 *
 * @return {Phaser.Filters.Mask[]} The new Mask filters, in order of target.
 */
var AddMaskShape = function (items, config)
{
    if (!Array.isArray(items)) { items = [ items ]; }
    if (!config) { config = {}; }
    var aspectRatio = (config.aspectRatio === undefined) ? 1 : config.aspectRatio;
    var padding = config.padding || 0;

    var scene = items[0].scene;
    var output = [];

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        var region = config.region;
        if (!region)
        {
            if (config.useInternal && item._sizeComponent)
            {
                region = new Rectangle(0, 0, item.width, item.height);
            }
            else
            {
                region = new Rectangle(0, 0, scene.scale.width, scene.scale.height);
            }
        }

        // Create a shape to use as a mask.
        var shape;
        switch (config.shape)
        {
            case 'ellipse':
            {
                shape = scene.add.ellipse(0, 0, aspectRatio, 1, 0xffffff);
                break;
            }
            case 'square':
            {
                shape = scene.add.rectangle(0, 0, 1, 1, 0xffffff);
                break;
            }
            case 'rectangle':
            {
                shape = scene.add.rectangle(0, 0, aspectRatio, 1, 0xffffff);
                break;
            }
            case 'circle':
            default:
            {
                shape = scene.add.circle(0, 0, 1, 0xffffff);
                break;
            }
        }

        // Remove shape from scene, as we don't need to display it,
        // and it will be garbage collected once the Mask is destroyed.
        scene.children.remove(shape);

        // Apply padding.
        if (padding)
        {
            region = new Rectangle(
                region.x + padding,
                region.y + padding,
                region.width - padding * 2,
                region.height - padding * 2
            );
        }

        // Transform shape to fit to target.
        FitToRegion(shape, config.scaleMode, region);

        // Optionally, blur shape.
        if (config.blurRadius > 0)
        {
            shape.enableFilters().filters.external.addBlur(
                config.blurQuality,
                config.blurRadius,
                config.blurRadius,
                1,
                undefined,
                config.blurSteps
            );
        }

        // Apply mask.
        if (item instanceof GameObject)
        {
            item.enableFilters();
        }
        var filterList = config.useInternal ? item.filters.internal : item.filters.external;
        var mask = filterList.addMask(shape, config.invert);

        output.push(mask);
    }

    return output;
};

module.exports = AddMaskShape;
