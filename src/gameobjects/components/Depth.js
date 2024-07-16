/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the depth of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Depth
 * @since 3.0.0
 */

var ArrayUtils = require('../../utils/array');

var Depth = {

    /**
     * Private internal value. Holds the depth of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Depth#_depth
     * @type {number}
     * @private
     * @default 0
     * @since 3.0.0
     */
    _depth: 0,

    /**
     * The depth of this Game Object within the Scene. Ensure this value is only ever set to a number data-type.
     *
     * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
     * of Game Objects, without actually moving their position in the display list.
     *
     * The default depth is zero. A Game Object with a higher depth
     * value will always render in front of one with a lower value.
     *
     * Setting the depth will queue a depth sort event within the Scene.
     *
     * @name Phaser.GameObjects.Components.Depth#depth
     * @type {number}
     * @since 3.0.0
     */
    depth: {

        get: function ()
        {
            return this._depth;
        },

        set: function (value)
        {
            if (this.displayList)
            {
                this.displayList.queueDepthSort();
            }

            this._depth = value;
        }

    },

    /**
     * The depth of this Game Object within the Scene.
     *
     * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
     * of Game Objects, without actually moving their position in the display list.
     *
     * The default depth is zero. A Game Object with a higher depth
     * value will always render in front of one with a lower value.
     *
     * Setting the depth will queue a depth sort event within the Scene.
     *
     * @method Phaser.GameObjects.Components.Depth#setDepth
     * @since 3.0.0
     *
     * @param {number} value - The depth of this Game Object. Ensure this value is only ever a number data-type.
     *
     * @return {this} This Game Object instance.
     */
    setDepth: function (value)
    {
        if (value === undefined) { value = 0; }

        this.depth = value;

        return this;
    },

    /**
     * Bring this Game Object to top of display list.
     *
     * @method Phaser.GameObjects.Components.Depth#bringMeToTop
     * @since 3.80.2
     * @return {this} This Game Object instance.
     */
    bringMeToTop: function()
    {
        var list;
        if (this.parentContainer)
        {
            list = this.parentContainer.list;
        }
        else if (this.displayList)
        {
            list = this.displayList.list;
        }

        if (!list)
        {
            return this;
        }

        ArrayUtils.BringToTop(list, this);

        return this;
    },

    /**
     * Send this Game Object to bottom of display list.
     *
     * @method Phaser.GameObjects.Components.Depth#sendMeToBack
     * @since 3.80.2
     * @return {this} This Game Object instance.
     */
    sendMeToBack: function()
    {
        var list;
        if (this.parentContainer)
        {
            list = this.parentContainer.list;
        }
        else if (this.displayList)
        {
            list = this.displayList.list;
        }

        if (!list)
        {
            return this;
        }

        ArrayUtils.SendToBack(list, this);

        return this;
    },

    /**
     * Move this Game Object below another Game Object.
     *
     * @method Phaser.GameObjects.Components.Depth#moveMyDepthBelow
     * @since 3.80.2
     * 
     * @param {Phaser.GameObjects.GameObject} gameObject - Move this Game Object below this Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    moveMyDepthBelow: function(gameObject)
    {
        var list;
        if (this.parentContainer)
        {
            list = this.parentContainer.list;
        }
        else if (this.displayList)
        {
            list = this.displayList.list;
        }

        if (!list)
        {
            return this;
        }

        ArrayUtils.MoveBelow(list, this, gameObject);

        return this;
    },

    /**
     * Move this Game Object above another Game Object.
     *
     * @method Phaser.GameObjects.Components.Depth#moveMyDepthAbove
     * @since 3.80.2
     * 
     * @param {Phaser.GameObjects.GameObject} gameObject - Move this Game Object above this Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    moveMyDepthAbove: function(gameObject)
    {
        var list;
        if (this.parentContainer)
        {
            list = this.parentContainer.list;
        }
        else if (this.displayList)
        {
            list = this.displayList.list;
        }

        if (!list)
        {
            return this;
        }

        ArrayUtils.MoveAbove(list, this, gameObject);

        return this;
    }

};

module.exports = Depth;
