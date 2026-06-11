/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import type { Rectangle } from './Rectangle';

/**
 * Checks if a given point is inside a Rectangle's bounds.
 *
 * @function Phaser.Geom.Rectangle.Contains
 * @since 3.0.0
 *
 * @param rect - The Rectangle to check.
 * @param x - The X coordinate of the point to check.
 * @param y - The Y coordinate of the point to check.
 *
 * @returns `true` if the point is within the Rectangle's bounds, otherwise `false`.
 */
export function Contains (rect: Rectangle, x: number, y: number): boolean
{
    if (rect.width <= 0 || rect.height <= 0)
    {
        return false;
    }

    return (rect.x <= x && rect.x + rect.width >= x && rect.y <= y && rect.y + rect.height >= y);
}

export default Contains;
