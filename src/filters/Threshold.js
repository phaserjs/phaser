/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Threshold Filter Controller.
 *
 * This controller manages a threshold filter.
 * Input values are compared to a threshold value or range.
 * Values below the threshold are set to 0, and values above the threshold are set to 1.
 * Values within the range are linearly interpolated between 0 and 1.
 *
 * This is useful for creating effects such as sharp edges from gradients,
 * or for creating binary effects.
 *
 * The threshold is stored as a range, with two edges.
 * Each edge has a value for each channel, between 0 and 1.
 * If the two edges are the same, the threshold has no interpolation,
 * and will output either 0 or 1.
 * Each channel can also be inverted.
 *
 * A Threshold effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addThreshold();
 * camera.filters.external.addThreshold();
 * ```
 *
 * @class Threshold
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {number|number[]} [edge1=0.5] - The first edge of the threshold. This may be an array of the RGBA channels, or a single number to apply to all 4 channels.
 * @param {number|number[]} [edge2=0.5] - The second edge of the threshold. This may be an array of the RGBA channels, or a single number to apply to all 4 channels.
 * @param {boolean|boolean[]} [invert=false] - Whether each channel is inverted. This may be an array of the RGBA channels, or a single boolean to apply to all 4 channels.
 */
var Threshold = new Class({
    Extends: Controller,

    initialize: function Threshold (camera, edge1, edge2, invert)
    {
        Controller.call(this, camera, 'FilterThreshold');

        /**
         * The first edge of the threshold.
         * This contains the lowest value for each channel.
         *
         * @name Phaser.Filters.Threshold#edge1
         * @type {number[]}
         * @default [ 0.5, 0.5, 0.5, 0.5 ]
         * @since 4.0.0
         */
        this.edge1 = [ 0.5, 0.5, 0.5, 0.5 ];

        /**
         * The second edge of the threshold.
         * This contains the highest value for each channel.
         * If it is the same as the first edge, the threshold is a single value.
         *
         * @name Phaser.Filters.Threshold#edge2
         * @type {number[]}
         * @default [ 0.5, 0.5, 0.5, 0.5 ]
         * @since 4.0.0
         */
        this.edge2 = [ 0.5, 0.5, 0.5, 0.5 ];

        /**
         * Whether each channel is inverted.
         *
         * @name Phaser.Filters.Threshold#invert
         * @type {boolean[]}
         * @default [ false, false, false, false ]
         * @since 4.0.0
         */
        this.invert = [ false, false, false, false ];

        this.setEdge(edge1, edge2);
        this.setInvert(invert);
    },

    /**
     * Set the edges of the threshold.
     * If the second edge is not provided, it will be set to the first edge.
     *
     * This ensures that the first edge is not greater than the second edge.
     * It may swap channels between edges to ensure this.
     *
     * @method Phaser.Filters.Threshold#setEdge
     * @since 4.0.0
     * @param {number|number[]} [edge1=0.5] - The first edge of the threshold. This may be an array of the RGBA channels, or a single number to apply to all 4 channels.
     * @param {number|number[]} [edge2=0.5] - The second edge of the threshold. This may be an array of the RGBA channels, or a single number to apply to all 4 channels.
     * @return {Phaser.Filters.Threshold} This Threshold instance.
     */
    setEdge: function (edge1, edge2)
    {
        if (edge1 === undefined)
        {
            edge1 = 0.5;
        }
        if (typeof edge1 === 'number')
        {
            edge1 = [ edge1, edge1, edge1, edge1 ];
        }

        this.edge1[0] = edge1[0];
        this.edge1[1] = edge1[1];
        this.edge1[2] = edge1[2];
        this.edge1[3] = edge1[3];

        if (edge2 === undefined)
        {
            edge2 = edge1;
        }
        if (typeof edge2 === 'number')
        {
            edge2 = [ edge2, edge2, edge2, edge2 ];
        }

        this.edge2[0] = edge2[0];
        this.edge2[1] = edge2[1];
        this.edge2[2] = edge2[2];
        this.edge2[3] = edge2[3];

        for (var i = 0; i < 4; i++)
        {
            if (this.edge1[i] > this.edge2[i])
            {
                var temp = this.edge1[i];
                this.edge1[i] = this.edge2[i];
                this.edge2[i] = temp;
            }
        }

        return this;
    },

    /**
     * Set the invert state of the threshold.
     * If invert is not provided, it will be set to false.
     *
     * @method Phaser.Filters.Threshold#setInvert
     * @since 4.0.0
     * @param {boolean|boolean[]} [invert=false] - Whether each channel is inverted. This may be an array of the RGBA channels, or a single boolean to apply to all 4 channels.
     * @return {Phaser.Filters.Threshold} This Threshold instance.
     */
    setInvert: function (invert)
    {
        if (invert === undefined)
        {
            invert = false;
        }
        if (typeof invert === 'boolean')
        {
            invert = [ invert, invert, invert, invert ];
        }

        this.invert[0] = invert[0];
        this.invert[1] = invert[1];
        this.invert[2] = invert[2];
        this.invert[3] = invert[3];

        return this;
    }
});

module.exports = Threshold;
