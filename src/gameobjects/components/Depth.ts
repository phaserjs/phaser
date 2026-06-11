/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { applyMixin, defineMixin } from '../../utils/Mixin.js';
import ArrayUtils from '../../utils/array/index.js';

/**
 * Interface describing the public API contributed by the Depth mixin.
 *
 * @memberof Phaser.GameObjects.Components
 * @since 3.0.0
 */
export interface DepthMixin
{

    /**
     * Private internal value. Holds the depth of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Depth#_depth
     * @private
     * @default 0
     * @since 3.0.0
     */
    _depth: number;

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
     * @since 3.0.0
     */
    depth: number;

    /**
     * Sets the depth of this Game Object. If the `value` argument is not provided, the depth defaults to `0`.
     *
     * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
     * of Game Objects, without actually moving their position in the display list.
     *
     * A Game Object with a higher depth value will always render in front of one with a lower value.
     *
     * Setting the depth will queue a depth sort event within the Scene.
     *
     * @method Phaser.GameObjects.Components.Depth#setDepth
     * @since 3.0.0
     *
     * @param value - The depth of this Game Object. Ensure this value is only ever a number data-type.
     *
     * @return This Game Object instance.
     */
    setDepth(value?: number): this;

    /**
     * Sets this Game Object to be at the top of the display list, or the top of its parent container.
     *
     * Being at the top means it will render on top of everything else.
     *
     * This method does not change this Game Objects `depth` value, it simply alters its list position.
     *
     * @method Phaser.GameObjects.Components.Depth#setToTop
     * @since 3.85.0
     *
     * @return This Game Object instance.
     */
    setToTop(): this;

    /**
     * Sets this Game Object to the back of the display list, or the back of its parent container.
     *
     * Being at the back means it will render below everything else.
     *
     * This method does not change this Game Objects `depth` value, it simply alters its list position.
     *
     * @method Phaser.GameObjects.Components.Depth#setToBack
     * @since 3.85.0
     *
     * @return This Game Object instance.
     */
    setToBack(): this;

    /**
     * Move this Game Object so that it appears above the given Game Object.
     *
     * This means it will render immediately after the other object in the display list.
     *
     * Both objects must belong to the same display list, or parent container.
     *
     * This method does not change this Game Objects `depth` value, it simply alters its list position.
     *
     * @method Phaser.GameObjects.Components.Depth#setAbove
     * @since 3.85.0
     *
     * @param gameObject - The Game Object that this Game Object will be moved to be above.
     *
     * @return This Game Object instance.
     */
    setAbove(gameObject: object): this;

    /**
     * Move this Game Object so that it appears below the given Game Object.
     *
     * This means it will render immediately under the other object in the display list.
     *
     * Both objects must belong to the same display list, or parent container.
     *
     * This method does not change this Game Objects `depth` value, it simply alters its list position.
     *
     * @method Phaser.GameObjects.Components.Depth#setBelow
     * @since 3.85.0
     *
     * @param gameObject - The Game Object that this Game Object will be moved to be below.
     *
     * @return This Game Object instance.
     */
    setBelow(gameObject: object): this;
}

/**
 * Minimal shape expected by Depth descriptor-bag methods at runtime.
 * Describes only the properties the methods actually access.
 */
interface DepthContext
{
    _depth: number;
    depth: number;
    displayList: { queueDepthSort(): void } | null;
    getDisplayList(): unknown[];
}

/**
 * Runtime descriptor-bag for the Depth mixin. The `{ get, set }` shape on
 * `depth` is installed as a real prototype getter/setter via `applyMixin`.
 *
 * @since 3.0.0
 */
export const DepthDescriptors = {

    _depth: 0,

    depth: {

        get: function (this: DepthContext): number
        {
            return this._depth;
        },

        set: function (this: DepthContext, value: number): void
        {
            if (this.displayList)
            {
                this.displayList.queueDepthSort();
            }

            this._depth = value;
        }

    },

    setDepth: function (this: DepthContext, value?: number): DepthContext
    {
        if (value === undefined) { value = 0; }

        this.depth = value;

        return this;
    },

    setToTop: function (this: DepthContext): DepthContext
    {
        const list = this.getDisplayList();

        if (list)
        {
            ArrayUtils.BringToTop(list, this);
        }

        return this;
    },

    setToBack: function (this: DepthContext): DepthContext
    {
        const list = this.getDisplayList();

        if (list)
        {
            ArrayUtils.SendToBack(list, this);
        }

        return this;
    },

    setAbove: function (this: DepthContext, gameObject: object): DepthContext
    {
        const list = this.getDisplayList();

        if (list && gameObject)
        {
            ArrayUtils.MoveAbove(list, this, gameObject);
        }

        return this;
    },

    setBelow: function (this: DepthContext, gameObject: object): DepthContext
    {
        const list = this.getDisplayList();

        if (list && gameObject)
        {
            ArrayUtils.MoveBelow(list, this, gameObject);
        }

        return this;
    }

};

/**
 * Provides methods used for setting the depth of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Depth
 * @since 3.0.0
 */
export const Depth = defineMixin<DepthMixin>()(function Depth (Base)
{
    applyMixin(Base, DepthDescriptors);
    return Base;
});

export default Depth;
