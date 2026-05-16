/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { applyMixin, defineMixin } from '../../utils/Mixin.js';

//  bitmask flag for GameObject.renderMask
const _FLAG = 1; // 0001

/**
 * Interface describing the public API contributed by the Visible mixin.
 *
 * @memberof Phaser.GameObjects.Components
 * @since 3.0.0
 */
export interface VisibleMixin
{

    /**
     * Private internal value. Holds the visible value.
     *
     * @name Phaser.GameObjects.Components.Visible#_visible
     * @private
     * @default true
     * @since 3.0.0
     */
    _visible: boolean;

    /**
     * The visible state of the Game Object.
     *
     * An invisible Game Object will skip rendering, but will still process update logic.
     *
     * @name Phaser.GameObjects.Components.Visible#visible
     * @since 3.0.0
     */
    visible: boolean;

    /**
     * Sets the visibility of this Game Object.
     *
     * An invisible Game Object will skip rendering, but will still process update logic.
     *
     * @method Phaser.GameObjects.Components.Visible#setVisible
     * @since 3.0.0
     *
     * @param value - The visible state of the Game Object.
     *
     * @return This Game Object instance.
     */
    setVisible(value: boolean): this;
}

/**
 * Minimal shape expected by Visible descriptor-bag methods at runtime.
 * Describes only the properties the methods actually access.
 */
interface VisibleContext
{
    _visible: boolean;
    visible: boolean;
    renderFlags: number;
}

/**
 * Runtime descriptor-bag for the Visible mixin. Class.js detects the
 * `{ get, set }` shape on `visible` and installs it as a real prototype
 * getter/setter via `Object.defineProperty`.
 *
 * @since 3.0.0
 */
export const VisibleDescriptors = {

    _visible: true,

    visible: {

        get: function (this: VisibleContext): boolean
        {
            return this._visible;
        },

        set: function (this: VisibleContext, value: boolean): void
        {
            if (value)
            {
                this._visible = true;
                this.renderFlags |= _FLAG;
            }
            else
            {
                this._visible = false;
                this.renderFlags &= ~_FLAG;
            }
        }

    },

    setVisible: function (this: VisibleContext, value: boolean): VisibleContext
    {
        this.visible = value;

        return this;
    }

};

/**
 * Provides methods used for setting the visibility of a Game Object.
 * The Visible component is mixed into Game Objects to give them a `visible` boolean property
 * and a `setVisible` method. Visibility is tracked via a bitmask flag on `renderFlags`, so
 * toggling it is a fast bitwise operation. An invisible Game Object is excluded from the
 * render pass entirely, but its `update` logic continues to run normally each frame.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Visible
 * @since 3.0.0
 */
export const Visible = defineMixin<VisibleMixin>()(function Visible (Base)
{
    applyMixin(Base, VisibleDescriptors);
    return Base;
});

export default Visible;
