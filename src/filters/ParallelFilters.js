/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
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
         * The top FilterList.
         *
         * @name Phaser.Filters.ParallelFilters#top
         * @type {Phaser.GameObjects.Components.FilterList}
         * @since 4.0.0
         */
        this.top = new FilterList(camera);

        /**
         * The bottom FilterList.
         *
         * @name Phaser.Filters.ParallelFilters#bottom
         * @type {Phaser.GameObjects.Components.FilterList}
         * @since 4.0.0
         */
        this.bottom = new FilterList(camera);

        /**
         * The Blend filter controller that combines the top and bottom FilterLists.
         * This is just another filter controller.
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

module.exports = ParallelFilters;
