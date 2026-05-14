/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Contains from './Contains.js';
import GetPoint from './GetPoint.js';
import GetPoints from './GetPoints.js';
import GEOM_CONST from '../const.js';
import Line from '../line/Line.js';
import Random from './Random.js';
import type { Vector2 } from '../../math/Vector2';

/**
 * @classdesc
 * A Rectangle is an axis-aligned region of 2D space defined by its top-left corner position (`x`, `y`) and its
 * dimensions (`width`, `height`). It is one of the core geometric primitives in Phaser and is used extensively
 * throughout the framework for bounds checking, camera viewports, hit areas, culling regions, and UI layout.
 *
 * Rectangles support containment tests, perimeter point sampling, and many other geometric operations available
 * via the `Phaser.Geom.Rectangle` static methods. The `left`, `right`, `top`, `bottom`, `centerX`, and `centerY`
 * properties provide convenient access to derived positional values and can be set directly to reposition or
 * resize the Rectangle.
 *
 * @memberof Phaser.Geom
 * @since 3.0.0
 */
export class Rectangle
{
    /**
     * The geometry constant type of this object: `GEOM_CONST.RECTANGLE`.
     * Used for fast type comparisons.
     *
     * @readonly
     * @since 3.19.0
     */
    readonly type: number;

    /**
     * The X coordinate of the top left corner of the Rectangle.
     *
     * @default 0
     * @since 3.0.0
     */
    x: number;

    /**
     * The Y coordinate of the top left corner of the Rectangle.
     *
     * @default 0
     * @since 3.0.0
     */
    y: number;

    /**
     * The width of the Rectangle, i.e. the distance between its left side (defined by `x`) and its right side.
     *
     * @default 0
     * @since 3.0.0
     */
    width: number;

    /**
     * The height of the Rectangle, i.e. the distance between its top side (defined by `y`) and its bottom side.
     *
     * @default 0
     * @since 3.0.0
     */
    height: number;

    /**
     * @param x - The X coordinate of the top left corner of the Rectangle.
     * @param y - The Y coordinate of the top left corner of the Rectangle.
     * @param width - The width of the Rectangle.
     * @param height - The height of the Rectangle.
     */
    constructor (x: number = 0, y: number = 0, width: number = 0, height: number = 0)
    {
        this.type = GEOM_CONST.RECTANGLE;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Checks if the given point is inside the Rectangle's bounds.
     *
     * @since 3.0.0
     *
     * @param x - The X coordinate of the point to check.
     * @param y - The Y coordinate of the point to check.
     *
     * @returns `true` if the point is within the Rectangle's bounds, otherwise `false`.
     */
    contains (x: number, y: number): boolean
    {
        return Contains(this, x, y);
    }

    /**
     * Calculates the coordinates of a point at a certain `position` on the Rectangle's perimeter.
     *
     * The `position` is a fraction between 0 and 1 which defines how far into the perimeter the point is.
     *
     * A value of 0 or 1 returns the point at the top left corner of the rectangle, while a value of 0.5
     * returns the point at the bottom right corner of the rectangle. Values between 0 and 0.5 are on the
     * top or the right side and values between 0.5 and 1 are on the bottom or the left side.
     *
     * @since 3.0.0
     *
     * @param position - The normalized distance into the Rectangle's perimeter to return.
     * @param output - A Vector2 instance to update with the `x` and `y` coordinates of the point.
     *
     * @returns The updated `output` object, or a new Vector2 if no `output` object was given.
     */
    getPoint<O extends Vector2 = Vector2> (position: number, output?: O): O
    {
        return GetPoint(this, position, output) as O;
    }

    /**
     * Returns an array of points from the perimeter of the Rectangle, each spaced out based
     * on the quantity or step required.
     *
     * @since 3.0.0
     *
     * @param quantity - The number of points to return. Set to `false` or 0 to return an arbitrary
     * number of points (`perimeter / stepRate`) evenly spaced around the Rectangle based on the `stepRate`.
     * @param stepRate - If `quantity` is 0, determines the normalized distance between each returned point.
     * @param output - An array to which to append the points.
     *
     * @returns The modified `output` array, or a new array if none was provided.
     */
    getPoints<O extends Vector2[] = Vector2[]> (quantity: number | false, stepRate?: number, output?: O): O
    {
        // @ts-expect-error - JS GetPoints handles undefined stepRate despite its JSDoc signature
        return GetPoints(this, quantity, stepRate, output) as O;
    }

    /**
     * Returns a random point within the Rectangle's bounds.
     *
     * @since 3.0.0
     *
     * @param vec - The object in which to store the `x` and `y` coordinates of the point.
     *
     * @returns The updated `vec`, or a new Vector2 if none was provided.
     */
    getRandomPoint<O extends Vector2 = Vector2> (vec?: O): O
    {
        return Random(this, vec) as O;
    }

    /**
     * Sets the position, width, and height of the Rectangle.
     *
     * @since 3.0.0
     *
     * @param x - The X coordinate of the top left corner of the Rectangle.
     * @param y - The Y coordinate of the top left corner of the Rectangle.
     * @param width - The width of the Rectangle.
     * @param height - The height of the Rectangle.
     *
     * @returns This Rectangle object.
     */
    setTo (x: number, y: number, width: number, height: number): this
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;
    }

    /**
     * Resets the position, width, and height of the Rectangle to 0.
     *
     * @since 3.0.0
     *
     * @returns This Rectangle object.
     */
    setEmpty (): this
    {
        return this.setTo(0, 0, 0, 0);
    }

    /**
     * Sets the position of the Rectangle.
     *
     * @since 3.0.0
     *
     * @param x - The X coordinate of the top left corner of the Rectangle.
     * @param y - The Y coordinate of the top left corner of the Rectangle.
     *
     * @returns This Rectangle object.
     */
    setPosition (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Sets the width and height of the Rectangle.
     *
     * @since 3.0.0
     *
     * @param width - The width to set the Rectangle to.
     * @param height - The height to set the Rectangle to.
     *
     * @returns This Rectangle object.
     */
    setSize (width: number, height?: number): this
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    }

    /**
     * Determines if the Rectangle is empty. A Rectangle is empty if its width or height is less than or equal to 0.
     *
     * @since 3.0.0
     *
     * @returns `true` if the Rectangle is empty, otherwise `false`.
     */
    isEmpty (): boolean
    {
        return (this.width <= 0 || this.height <= 0);
    }

    /**
     * Returns a Line object that corresponds to the top of this Rectangle.
     *
     * @since 3.0.0
     *
     * @param line - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @returns A Line object that corresponds to the top of this Rectangle.
     */
    // @ts-expect-error - Line is a JS Class() factory value, not a TypeScript type
    getLineA<O extends typeof Line.prototype = typeof Line.prototype> (line?: O): O
    {
        // @ts-expect-error - Class() factory is not seen as constructable by TypeScript
        if (line === undefined) { line = new Line() as O; }

        line!.setTo(this.x, this.y, this.right, this.y);

        return line!;
    }

    /**
     * Returns a Line object that corresponds to the right of this Rectangle.
     *
     * @since 3.0.0
     *
     * @param line - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @returns A Line object that corresponds to the right of this Rectangle.
     */
    // @ts-expect-error - Line is a JS Class() factory value, not a TypeScript type
    getLineB<O extends typeof Line.prototype = typeof Line.prototype> (line?: O): O
    {
        // @ts-expect-error - Class() factory is not seen as constructable by TypeScript
        if (line === undefined) { line = new Line() as O; }

        line!.setTo(this.right, this.y, this.right, this.bottom);

        return line!;
    }

    /**
     * Returns a Line object that corresponds to the bottom of this Rectangle.
     *
     * @since 3.0.0
     *
     * @param line - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @returns A Line object that corresponds to the bottom of this Rectangle.
     */
    // @ts-expect-error - Line is a JS Class() factory value, not a TypeScript type
    getLineC<O extends typeof Line.prototype = typeof Line.prototype> (line?: O): O
    {
        // @ts-expect-error - Class() factory is not seen as constructable by TypeScript
        if (line === undefined) { line = new Line() as O; }

        line!.setTo(this.right, this.bottom, this.x, this.bottom);

        return line!;
    }

    /**
     * Returns a Line object that corresponds to the left of this Rectangle.
     *
     * @since 3.0.0
     *
     * @param line - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @returns A Line object that corresponds to the left of this Rectangle.
     */
    // @ts-expect-error - Line is a JS Class() factory value, not a TypeScript type
    getLineD<O extends typeof Line.prototype = typeof Line.prototype> (line?: O): O
    {
        // @ts-expect-error - Class() factory is not seen as constructable by TypeScript
        if (line === undefined) { line = new Line() as O; }

        line!.setTo(this.x, this.bottom, this.x, this.y);

        return line!;
    }

    /**
     * The x coordinate of the left of the Rectangle.
     * Changing the left property of a Rectangle object has no effect on the y and height properties.
     * However it does affect the width property, whereas changing the x value does not affect the width property.
     *
     * @since 3.0.0
     */
    get left (): number
    {
        return this.x;
    }

    set left (value: number)
    {
        if (value >= this.right)
        {
            this.width = 0;
        }
        else
        {
            this.width = this.right - value;
        }

        this.x = value;
    }

    /**
     * The sum of the x and width properties.
     * Changing the right property of a Rectangle object has no effect on the x, y and height properties,
     * however it does affect the width property.
     *
     * @since 3.0.0
     */
    get right (): number
    {
        return this.x + this.width;
    }

    set right (value: number)
    {
        if (value <= this.x)
        {
            this.width = 0;
        }
        else
        {
            this.width = value - this.x;
        }
    }

    /**
     * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no
     * effect on the x and width properties. However it does affect the height property, whereas changing
     * the y value does not affect the height property.
     *
     * @since 3.0.0
     */
    get top (): number
    {
        return this.y;
    }

    set top (value: number)
    {
        if (value >= this.bottom)
        {
            this.height = 0;
        }
        else
        {
            this.height = (this.bottom - value);
        }

        this.y = value;
    }

    /**
     * The sum of the y and height properties.
     * Changing the bottom property of a Rectangle object has no effect on the x, y and width properties,
     * but does change the height property.
     *
     * @since 3.0.0
     */
    get bottom (): number
    {
        return this.y + this.height;
    }

    set bottom (value: number)
    {
        if (value <= this.y)
        {
            this.height = 0;
        }
        else
        {
            this.height = value - this.y;
        }
    }

    /**
     * The x coordinate of the center of the Rectangle.
     *
     * @since 3.0.0
     */
    get centerX (): number
    {
        return this.x + (this.width / 2);
    }

    set centerX (value: number)
    {
        this.x = value - (this.width / 2);
    }

    /**
     * The y coordinate of the center of the Rectangle.
     *
     * @since 3.0.0
     */
    get centerY (): number
    {
        return this.y + (this.height / 2);
    }

    set centerY (value: number)
    {
        this.y = value - (this.height / 2);
    }
}

export default Rectangle;
