/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

import FuzzyEqual from './fuzzy/Equal.js';

/**
 * @memberof Phaser.Types.Math
 * @since 3.0.0
 */
export interface Vector2Like
{
    x: number;
    y: number;
}

/**
 * @classdesc
 * A representation of a vector in 2D space, defined by an `x` and `y` component.
 *
 * Vector2 is used throughout Phaser for positions, directions, velocities, and other
 * quantities that have both magnitude and direction. It provides methods for common
 * vector operations such as addition, subtraction, scaling, normalization, dot and
 * cross products, linear interpolation, and rotation. Many Phaser APIs accept a
 * `Vector2Like` object (any object with `x` and `y` number properties), making
 * Vector2 easy to integrate across the framework.
 *
 * @memberof Phaser.Math
 * @since 3.0.0
 */
export class Vector2
{
    /**
     * The x component of this Vector.
     *
     * @default 0
     * @since 3.0.0
     */
    x: number;

    /**
     * The y component of this Vector.
     *
     * @default 0
     * @since 3.0.0
     */
    y: number;

    /**
     * @param x - The x component, or an object with `x` and `y` properties.
     * @param y - The y component.
     */
    constructor (x?: number | Vector2Like, y?: number)
    {
        this.x = 0;
        this.y = 0;

        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
        }
        else
        {
            if (y === undefined) { y = x; }

            this.x = x || 0;
            this.y = y || 0;
        }
    }

    /**
     * Make a clone of this Vector2.
     *
     * @since 3.0.0
     *
     * @returns A clone of this Vector2.
     */
    clone (): Vector2
    {
        return new Vector2(this.x, this.y);
    }

    /**
     * Copy the components of a given Vector into this Vector.
     *
     * @since 3.0.0
     *
     * @param src - The Vector to copy the components from.
     * @returns This Vector2.
     */
    copy (src: Vector2Like): this
    {
        this.x = src.x || 0;
        this.y = src.y || 0;

        return this;
    }

    /**
     * Set the component values of this Vector from a given Vector2Like object.
     *
     * @since 3.0.0
     *
     * @param obj - The object containing the component values to set for this Vector.
     * @returns This Vector2.
     */
    setFromObject (obj: Vector2Like): this
    {
        this.x = obj.x || 0;
        this.y = obj.y || 0;

        return this;
    }

    /**
     * Set the `x` and `y` components of this Vector to the given `x` and `y` values.
     *
     * @since 3.0.0
     *
     * @param x - The x value to set for this Vector.
     * @param y - The y value to set for this Vector.
     * @returns This Vector2.
     */
    set (x: number, y?: number): this
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * This method is an alias for `Vector2.set`.
     *
     * @since 3.4.0
     *
     * @param x - The x value to set for this Vector.
     * @param y - The y value to set for this Vector.
     * @returns This Vector2.
     */
    setTo (x: number, y?: number): this
    {
        return this.set(x, y);
    }

    /**
     * Runs the x and y components of this Vector2 through Math.ceil and then sets them.
     *
     * @since 4.0.0
     *
     * @returns This Vector2.
     */
    ceil (): this
    {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);

        return this;
    }

    /**
     * Runs the x and y components of this Vector2 through Math.floor and then sets them.
     *
     * @since 4.0.0
     *
     * @returns This Vector2.
     */
    floor (): this
    {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

        return this;
    }

    /**
     * Swaps the x and y components of this Vector2.
     *
     * @since 4.0.0
     *
     * @returns This Vector2.
     */
    invert (): this
    {
        return this.set(this.y, this.x);
    }

    /**
     * Sets the x and y components of this Vector from the given angle and length.
     *
     * @since 3.0.0
     *
     * @param angle - The angle from the positive x-axis, in radians.
     * @param length - The distance from the origin.
     * @returns This Vector2.
     */
    setToPolar (angle: number, length?: number | null): this
    {
        if (length === null || length === undefined) { length = 1; }

        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;

        return this;
    }

    /**
     * Check whether this Vector is equal to a given Vector.
     *
     * Performs a strict equality check against each Vector's components.
     *
     * @since 3.0.0
     *
     * @param v - The vector to compare with this Vector.
     * @returns Whether the given Vector is equal to this Vector.
     */
    equals (v: Vector2Like): boolean
    {
        return ((this.x === v.x) && (this.y === v.y));
    }

    /**
     * Check whether this Vector is approximately equal to a given Vector.
     *
     * @since 3.23.0
     *
     * @param v - The vector to compare with this Vector.
     * @param epsilon - The tolerance value.
     * @returns Whether both absolute differences of the x and y components are smaller than `epsilon`.
     */
    fuzzyEquals (v: Vector2Like, epsilon?: number): boolean
    {
        return (FuzzyEqual(this.x, v.x, epsilon) && FuzzyEqual(this.y, v.y, epsilon));
    }

    /**
     * Calculate the angle between this Vector and the positive x-axis, in radians.
     *
     * @since 3.0.0
     *
     * @returns The angle between this Vector, and the positive x-axis, given in radians.
     */
    angle (): number
    {
        // computes the angle in radians with respect to the positive x-axis

        let angle = Math.atan2(this.y, this.x);

        if (angle < 0)
        {
            angle += 2 * Math.PI;
        }

        return angle;
    }

    /**
     * Set the angle of this Vector.
     *
     * @since 3.23.0
     *
     * @param angle - The angle, in radians.
     * @returns This Vector2.
     */
    setAngle (angle: number): this
    {
        return this.setToPolar(angle, this.length());
    }

    /**
     * Add a given Vector to this Vector. Addition is component-wise.
     *
     * @since 3.0.0
     *
     * @param src - The Vector to add to this Vector.
     * @returns This Vector2.
     */
    add (src: Vector2Like): this
    {
        this.x += src.x;
        this.y += src.y;

        return this;
    }

    /**
     * Subtract the given Vector from this Vector. Subtraction is component-wise.
     *
     * @since 3.0.0
     *
     * @param src - The Vector to subtract from this Vector.
     * @returns This Vector2.
     */
    subtract (src: Vector2Like): this
    {
        this.x -= src.x;
        this.y -= src.y;

        return this;
    }

    /**
     * Perform a component-wise multiplication between this Vector and the given Vector.
     *
     * Multiplies this Vector by the given Vector.
     *
     * @since 3.0.0
     *
     * @param src - The Vector to multiply this Vector by.
     * @returns This Vector2.
     */
    multiply (src: Vector2Like): this
    {
        this.x *= src.x;
        this.y *= src.y;

        return this;
    }

    /**
     * Scale this Vector by the given value.
     *
     * @since 3.0.0
     *
     * @param value - The value to scale this Vector by.
     * @returns This Vector2.
     */
    scale (value: number): this
    {
        if (isFinite(value))
        {
            this.x *= value;
            this.y *= value;
        }
        else
        {
            this.x = 0;
            this.y = 0;
        }

        return this;
    }

    /**
     * Perform a component-wise division between this Vector and the given Vector.
     *
     * Divides this Vector by the given Vector.
     *
     * @since 3.0.0
     *
     * @param src - The Vector to divide this Vector by.
     * @returns This Vector2.
     */
    divide (src: Vector2Like): this
    {
        this.x /= src.x;
        this.y /= src.y;

        return this;
    }

    /**
     * Negate the `x` and `y` components of this Vector.
     *
     * @since 3.0.0
     *
     * @returns This Vector2.
     */
    negate (): this
    {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    /**
     * Calculate the distance between this Vector and the given Vector.
     *
     * @since 3.0.0
     *
     * @param src - The Vector to calculate the distance to.
     * @returns The distance from this Vector to the given Vector.
     */
    distance (src: Vector2Like): number
    {
        const dx = src.x - this.x;
        const dy = src.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Calculate the distance between this Vector and the given Vector, squared.
     *
     * @since 3.0.0
     *
     * @param src - The Vector to calculate the distance to.
     * @returns The distance from this Vector to the given Vector, squared.
     */
    distanceSq (src: Vector2Like): number
    {
        const dx = src.x - this.x;
        const dy = src.y - this.y;

        return dx * dx + dy * dy;
    }

    /**
     * Calculate the length (or magnitude) of this Vector.
     *
     * @since 3.0.0
     *
     * @returns The length of this Vector.
     */
    length (): number
    {
        const x = this.x;
        const y = this.y;

        return Math.sqrt(x * x + y * y);
    }

    /**
     * Set the length (or magnitude) of this Vector.
     *
     * @since 3.23.0
     *
     * @param length - The new magnitude of this Vector.
     * @returns This Vector2.
     */
    setLength (length: number): this
    {
        return this.normalize().scale(length);
    }

    /**
     * Calculate the length of this Vector squared.
     *
     * @since 3.0.0
     *
     * @returns The length of this Vector, squared.
     */
    lengthSq (): number
    {
        const x = this.x;
        const y = this.y;

        return x * x + y * y;
    }

    /**
     * Normalize this Vector.
     *
     * Makes the vector a unit length vector (magnitude of 1) in the same direction.
     *
     * @since 3.0.0
     *
     * @returns This Vector2.
     */
    normalize (): this
    {
        const x = this.x;
        const y = this.y;
        let len = x * x + y * y;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);

            this.x = x * len;
            this.y = y * len;
        }

        return this;
    }

    /**
     * Rotate this Vector to its perpendicular, in the positive direction.
     *
     * @since 3.0.0
     *
     * @returns This Vector2.
     */
    normalizeRightHand (): this
    {
        const x = this.x;

        this.x = this.y * -1;
        this.y = x;

        return this;
    }

    /**
     * Rotate this Vector to its perpendicular, in the negative direction.
     *
     * @since 3.23.0
     *
     * @returns This Vector2.
     */
    normalizeLeftHand (): this
    {
        const x = this.x;

        this.x = this.y;
        this.y = x * -1;

        return this;
    }

    /**
     * Calculate the dot product of this Vector and the given Vector.
     *
     * @since 3.0.0
     *
     * @param src - The Vector2 to dot product with this Vector2.
     * @returns The dot product of this Vector and the given Vector.
     */
    dot (src: Vector2Like): number
    {
        return this.x * src.x + this.y * src.y;
    }

    /**
     * Calculate the cross product of this Vector and the given Vector.
     *
     * @since 3.0.0
     *
     * @param src - The Vector2 to cross with this Vector2.
     * @returns The cross product of this Vector and the given Vector.
     */
    cross (src: Vector2Like): number
    {
        return this.x * src.y - this.y * src.x;
    }

    /**
     * Linearly interpolate between this Vector and the given Vector.
     *
     * Interpolates this Vector towards the given Vector.
     *
     * @since 3.0.0
     *
     * @param src - The Vector2 to interpolate towards.
     * @param t - The interpolation percentage, between 0 and 1.
     * @returns This Vector2.
     */
    lerp (src: Vector2Like, t: number = 0): this
    {
        const ax = this.x;
        const ay = this.y;

        this.x = ax + t * (src.x - ax);
        this.y = ay + t * (src.y - ay);

        return this;
    }

    /**
     * Transform this Vector with the given Matrix3.
     *
     * @since 3.0.0
     *
     * @param mat - The Matrix3 to transform this Vector2 with.
     * @returns This Vector2.
     */
    transformMat3 (mat: { val: Float32Array | number[] }): this
    {
        const x = this.x;
        const y = this.y;
        const m = mat.val;

        this.x = m[0] * x + m[3] * y + m[6];
        this.y = m[1] * x + m[4] * y + m[7];

        return this;
    }

    /**
     * Transform this Vector with the given Matrix4.
     *
     * @since 3.0.0
     *
     * @param mat - The Matrix4 to transform this Vector2 with.
     * @returns This Vector2.
     */
    transformMat4 (mat: { val: Float32Array | number[] }): this
    {
        const x = this.x;
        const y = this.y;
        const m = mat.val;

        this.x = m[0] * x + m[4] * y + m[12];
        this.y = m[1] * x + m[5] * y + m[13];

        return this;
    }

    /**
     * Make this Vector the zero vector (0, 0).
     *
     * @since 3.0.0
     *
     * @returns This Vector2.
     */
    reset (): this
    {
        this.x = 0;
        this.y = 0;

        return this;
    }

    /**
     * Limit the length (or magnitude) of this Vector.
     *
     * @since 3.23.0
     *
     * @param max - The maximum length.
     * @returns This Vector2.
     */
    limit (max: number): this
    {
        const len = this.length();

        if (len && len > max)
        {
            this.scale(max / len);
        }

        return this;
    }

    /**
     * Reflect this Vector off a line defined by a normal.
     *
     * @since 3.23.0
     *
     * @param normal - A vector perpendicular to the line.
     * @returns This Vector2.
     */
    reflect (normal: Vector2): this
    {
        const n = normal.clone().normalize();

        return this.subtract(n.scale(2 * this.dot(n)));
    }

    /**
     * Reflect this Vector across another.
     *
     * @since 3.23.0
     *
     * @param axis - A vector to reflect across.
     * @returns This Vector2.
     */
    mirror (axis: Vector2): this
    {
        return this.reflect(axis).negate();
    }

    /**
     * Rotate this Vector by an angle amount.
     *
     * @since 3.23.0
     *
     * @param delta - The angle to rotate by, in radians.
     * @returns This Vector2.
     */
    rotate (delta: number): this
    {
        const cos = Math.cos(delta);
        const sin = Math.sin(delta);

        return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
    }

    /**
     * Project this Vector onto another.
     *
     * @since 3.60.0
     *
     * @param src - The vector to project onto.
     * @returns This Vector2.
     */
    project (src: Vector2): this
    {
        const scalar = this.dot(src) / src.dot(src);

        return this.copy(src).scale(scalar);
    }

    /**
     * Calculates the vector projection of this Vector2 onto the non-zero `vecB`. This is the
     * orthogonal projection of this vector onto a straight line parallel to `vecB`.
     *
     * @since 4.0.0
     *
     * @param vecB - The vector to project onto.
     * @param out - The Vector2 object to store the position in. If not given, a new Vector2 instance is created.
     * @returns The `out` Vector2 containing the projected values.
     */
    projectUnit (vecB: Vector2, out?: Vector2): Vector2
    {
        if (out === undefined) { out = new Vector2(); }

        const amt = ((this.x * vecB.x) + (this.y * vecB.y));

        if (amt !== 0)
        {
            out.x = amt * vecB.x;
            out.y = amt * vecB.y;
        }

        return out;
    }

    /**
     * A static zero Vector2 for use by reference.
     *
     * This constant is meant for comparison operations and should not be modified directly.
     *
     * @constant
     * @since 3.1.0
     */
    static readonly ZERO = new Vector2();

    /**
     * A static right Vector2 for use by reference.
     *
     * This constant is meant for comparison operations and should not be modified directly.
     *
     * @constant
     * @since 3.16.0
     */
    static readonly RIGHT = new Vector2(1, 0);

    /**
     * A static left Vector2 for use by reference.
     *
     * This constant is meant for comparison operations and should not be modified directly.
     *
     * @constant
     * @since 3.16.0
     */
    static readonly LEFT = new Vector2(-1, 0);

    /**
     * A static up Vector2 for use by reference.
     *
     * This constant is meant for comparison operations and should not be modified directly.
     *
     * @constant
     * @since 3.16.0
     */
    static readonly UP = new Vector2(0, -1);

    /**
     * A static down Vector2 for use by reference.
     *
     * This constant is meant for comparison operations and should not be modified directly.
     *
     * @constant
     * @since 3.16.0
     */
    static readonly DOWN = new Vector2(0, 1);

    /**
     * A static one Vector2 for use by reference.
     *
     * This constant is meant for comparison operations and should not be modified directly.
     *
     * @constant
     * @since 3.16.0
     */
    static readonly ONE = new Vector2(1, 1);
}

export default Vector2;
