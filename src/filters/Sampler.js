/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Sampler Filter Controller.
 *
 * This controller reads pixel data from the camera's rendered output and passes
 * it to a user-defined callback. Unlike other filter controllers, the Sampler
 * does not alter the rendered image in any way — it is purely a data extraction
 * tool. It can sample a single point, a rectangular region, or the entire
 * camera view, and is useful for techniques such as color picking, pixel-perfect
 * hit detection, or runtime visual analysis.
 *
 * This operation is expensive, so use sparingly.
 *
 * A Sampler is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addSampler(callback, region);
 * camera.filters.external.addSampler(callback, region);
 * ```
 *
 * @class Sampler
 * @memberof Phaser.Filters
 * @extends Phaser.Filters.Controller
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The callback to call with the results of the sampler.
 * @param {null|Phaser.Types.Math.Vector2Like|Phaser.Geom.Rectangle} [region=null] - The region to sample. If `null`, the entire camera view is sampled. If a `Phaser.Types.Math.Vector2Like`, a point is sampled. If a `Phaser.Geom.Rectangle`, the region is sampled.
 */
var Sampler = new Class({
    Extends: Controller,

    initialize: function Sampler (camera, callback, region)
    {
        if (region === undefined) { region = null; }

        Controller.call(this, camera, 'FilterSampler');

        this.allowBaseDraw = false;

        /**
         * The callback to invoke once the pixel data has been read from the
         * sampled region. It receives the snapshot result, which may be an
         * `HTMLImageElement` (for region snapshots) or a `Phaser.Display.Color`
         * (for point snapshots), depending on the `region` type.
         *
         * @name Phaser.Filters.Sampler#callback
         * @type {Phaser.Types.Renderer.Snapshot.SnapshotCallback}
         * @since 4.0.0
         */
        this.callback = callback;

        /**
         * The region to sample. If `null`, the entire camera view is sampled.
         * If a `Phaser.Types.Math.Vector2Like`, a point is sampled.
         * If a `Phaser.Geom.Rectangle`, the region is sampled.
         *
         * @name Phaser.Filters.Sampler#region
         * @type {null|Phaser.Types.Math.Vector2Like|Phaser.Geom.Rectangle}
         * @since 4.0.0
         */
        this.region = region;
    }
});

module.exports = Sampler;
