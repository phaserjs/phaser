/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var FilterList = require('../gameobjects/components/FilterList');
var Controller = require('./Controller');
var Blend = require('./Blend');

/**
 * @classdesc
 * The Parallel Filters Controller.
 *
 * This filter controller splits the input into two lists of filters,
 * runs each list separately, and then blends the results together.
 *
 * The Parallel Filters effect is useful for reusing an input.
 * Ordinarily, a filter modifies the input and passes it to the next filter.
 * This effect allows you to split the input and re-use it elsewhere.
 * It does not gain performance benefits from parallel processing;
 * it is a convenience for reusing the input.
 *
 * The Parallel Filters effect is not a filter itself.
 * It is a controller that manages two FilterLists,
 * and the final Blend filter that combines the results.
 * The FilterLists are named 'top' and 'bottom'.
 * The 'top' output is applied as a blend texture to the 'bottom' output.
 *
 * You do not have to populate both lists. If only one is populated,
 * it will be blended with the original input at the end.
 * This is useful when you want to retain image data that would be lost
 * in the filter process.
 *
 * A Parallel Filters effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 * camera.filters.internal.addParallelFilters();
 * camera.filters.external.addParallelFilters();
 * ```
 *
 * @example
 * // Create a customizable Bloom effect.
 * const camera = this.cameras.main;
 * const parallelFilters = camera.filters.internal.addParallelFilters();
 * parallelFilters.top.addThreshold(0.5, 1);
 * parallelFilters.top.addBlur();
 * parallelFilters.blend.blendMode = Phaser.BlendModes.ADD;
 * parallelFilters.blend.amount = 0.5;
 *
 * @class ParallelFilters
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 */
var ParallelFilters = new Class({
    Extends: Controller,

    initialize: function ParallelFilters (camera)
    {
        Controller.call(this, camera, 'FilterParallelFilters');

        /**
         * The top FilterList. Filters added to this list receive the original
         * input and are processed independently from the bottom list. The final
         * output of this list is passed to the Blend controller as a blend
         * texture, which is then composited onto the bottom output.
         *
         * @name Phaser.Filters.ParallelFilters#top
         * @type {Phaser.GameObjects.Components.FilterList}
         * @since 4.0.0
         */
        this.top = new FilterList(camera);

        /**
         * The bottom FilterList. Filters added to this list receive the original
         * input and are processed independently from the top list. The final
         * output of this list serves as the base image onto which the top
         * output is blended by the Blend controller.
         *
         * @name Phaser.Filters.ParallelFilters#bottom
         * @type {Phaser.GameObjects.Components.FilterList}
         * @since 4.0.0
         */
        this.bottom = new FilterList(camera);

        /**
         * The Blend filter controller that composites the top and bottom
         * FilterList outputs into a single result. It is a standard
         * {@link Phaser.Filters.Blend} controller whose blend mode and amount
         * can be configured to control how the two outputs are combined.
         * See {@link Phaser.Filters.Blend} for more information.
         *
         * The `texture` property of the Blend controller will be
         * overwritten during rendering.
         *
         * @name Phaser.Filters.ParallelFilters#blend
         * @type {Phaser.Filters.Blend}
         * @since 4.0.0
         */
        this.blend = new Blend(camera);
    }
});

// To eliminate a circular dependency,
// addParallelFilters is defined and injected here.

/**
 * Adds a Parallel Filters effect.
 *
 * This filter controller splits the input into two lists of filters,
 * runs each list separately, and then blends the results together.
 *
 * The Parallel Filters effect is useful for reusing an input.
 * Ordinarily, a filter modifies the input and passes it to the next filter.
 * This effect allows you to split the input and re-use it elsewhere.
 * It does not gain performance benefits from parallel processing;
 * it is a convenience for reusing the input.
 *
 * The Parallel Filters effect is not a filter itself.
 * It is a controller that manages two FilterLists,
 * and the final Blend filter that combines the results.
 * The FilterLists are named 'top' and 'bottom'.
 * The 'top' output is applied as a blend texture to the 'bottom' output.
 *
 * You do not have to populate both lists. If only one is populated,
 * it will be blended with the original input at the end.
 * This is useful when you want to retain image data that would be lost
 * in the filter process.
 *
 * @example
 * // Create a customizable Bloom effect.
 * const camera = this.cameras.main;
 * const parallelFilters = camera.filters.internal.addParallelFilters();
 * parallelFilters.top.addThreshold(0.5, 1);
 * parallelFilters.top.addBlur();
 * parallelFilters.blend.blendMode = Phaser.BlendModes.ADD;
 * parallelFilters.blend.amount = 0.5;
 *
 * @method Phaser.GameObjects.Components.FilterList#addParallelFilters
 * @since 4.0.0
 * @return {Phaser.Filters.ParallelFilters} The new Parallel Filters filter controller.
 */
FilterList.prototype.addParallelFilters = function ()
{
    return this.add(new ParallelFilters(this.camera));
};

module.exports = ParallelFilters;
