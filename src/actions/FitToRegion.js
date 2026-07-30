/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('../geom/rectangle/Rectangle');
var GetFastValue = require('../utils/object/GetFastValue');

/**
 * Fit GameObjects to a region.
 *
 * This is a quick way to fit a background to a scene,
 * move an object without worrying about origins,
 * or cover a hole of known size.
 *
 * This will transform each object to fit into a rectangular region.
 * Rotation is ignored, but translation and scale are changed.
 * Note that negative scale will become positive; use flip to resolve this.
 * The object must support transformation.
 *
 * The fit can scale proportionally, to touch the inside or outside of the region;
 * but by default it scales both axes independently to touch all sides.
 *
 * The region is an axis-aligned bounding box (AABB).
 * By default, it is derived from the object, via the scene scale properties,
 * i.e. `{ x: 0, y: 0, width: scene.scale.width, height: scene.scale.height }`.
 *
 * If the game object has no size or origin, e.g. a Container,
 * then it is tricky to figure out how to resize it to fit.
 * The `itemCoverage` parameter allows you to set `width`, `height`, `originX`
 * and/or `originY` properties to supplement available data.
 * These settings take precedence over original item properties, even if they exist.
 *
 * @function Phaser.Actions.FitToRegion
 * @since 4.0.0
 *
 * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} items - The GameObject or GameObjects to fit to the region. Each must have the Phaser.GameObjects.Components.Transform component.
 * @param {number} [scaleMode=0] - The scale mode. 0 sets each axis to fill the region independently. -1 scales both axes uniformly so the item touches the _inside_ of the region. 1 scales both axes uniformly so the item touches the _outside_ of the region.
 * @param {Phaser.Types.Math.RectangleLike} [region] - The region to fit. If not defined, it will be inferred from the first item's scene scale.
 * @param {Phaser.Types.Actions.FitToRegionItemCoverage} [itemCoverage] - Override or define the region covered by the item. This is intended to provide dimensions for objects which don't have them, such as Containers, allowing them to resize.
 *
 * @return {Phaser.GameObjects.GameObject[]} - The items that were fitted.
 */
var FitToRegion = function (items, scaleMode, region, itemCoverage)
{
    if (!Array.isArray(items)) { items = [ items ]; }
    if (scaleMode === undefined) { scaleMode = 0; }
    if (!region)
    {
        var scene = items[0].scene;
        region = new Rectangle(0, 0, scene.scale.width, scene.scale.height);
    }
    if (!itemCoverage) { itemCoverage = {}; }

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        var itemWidth = GetFastValue(itemCoverage, 'width', GetFastValue(item, 'width', 1));
        var itemHeight = GetFastValue(itemCoverage, 'height', GetFastValue(item, 'height', 1));
        var itemOriginX = GetFastValue(itemCoverage, 'originX', GetFastValue(item, 'originX', 0.5));
        var itemOriginY = GetFastValue(itemCoverage, 'originY', GetFastValue(item, 'originY', 0.5));

        // Reposition item.
        item.x = region.x + region.width * itemOriginX;
        item.y = region.y + region.height * itemOriginY;

        // Compute relative scales.
        var itemScaleXToRegion = region.width / itemWidth;
        var itemScaleYToRegion = region.height / itemHeight;
        switch (scaleMode)
        {
            case -1:
            {
                // Scale to fit the inside of the region.
                item.setScale(Math.min(itemScaleXToRegion, itemScaleYToRegion));
                break;
            }
            case 0:
            {
                // Scale both axes independently to match the region.
                item.setScale(itemScaleXToRegion, itemScaleYToRegion);
                break;
            }
            case 1:
            {
                // Scale to envelop the outside of the region.
                item.setScale(Math.max(itemScaleXToRegion, itemScaleYToRegion));
                break;
            }
        }
    }

    return item;
};

module.exports = FitToRegion;
