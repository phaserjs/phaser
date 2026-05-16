/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import BlendModes from '../../renderer/BlendModes.js';
import Circle from '../../geom/circle/Circle.js';
import CircleContains from '../../geom/circle/Contains.js';
import Components from '../components/index.js';
import { Rectangle } from '../../geom/rectangle/Rectangle.js';
import { Contains as RectangleContains } from '../../geom/rectangle/Contains.js';
import { Visible } from '../components/Visible.js';
import { Depth } from '../components/Depth.js';
import { applyMixin, composeMixins } from '../../utils/Mixin.js';
import { TODO_MIGRATE_GameObjectCtor, TODO_MIGRATE_Scene } from '../../utils/migrationPlaceholders.js';
import type { HitAreaCallback } from '../../input/typedefs/HitAreaCallback';

const ZoneBase = composeMixins(Visible, Depth)(TODO_MIGRATE_GameObjectCtor);

/**
 * @classdesc
 * A Zone is a non-rendering rectangular Game Object that has a position and size but no texture.
 * It never displays visually, but it does live on the display list and can be moved, scaled,
 * and rotated like any other Game Object.
 *
 * Its primary use is for creating Drop Zones and Input Hit Areas. It provides helper methods for
 * both circular and rectangular drop zones, and can also accept custom geometry shapes. Zones are
 * also useful for object overlap checks, or as a base class for your own non-displaying Game Objects.
 *
 * The default origin is 0.5, placing it at the center of the Zone, consistent with other Game Objects.
 *
 * @class Zone
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param scene - The Scene to which this Game Object belongs.
 * @param x - The horizontal position of this Game Object in the world.
 * @param y - The vertical position of this Game Object in the world.
 * @param [width=1] - The width of the Game Object.
 * @param [height=1] - The height of the Game Object.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Zone extends ZoneBase
{
    /**
     * The native (un-scaled) width of this Game Object.
     *
     * @name Phaser.GameObjects.Zone#width
     * @since 3.0.0
     */
    width: number;

    /**
     * The native (un-scaled) height of this Game Object.
     *
     * @name Phaser.GameObjects.Zone#height
     * @since 3.0.0
     */
    height: number;

    /**
     * The Blend Mode of the Game Object.
     * Although a Zone never renders, it still has a blend mode to allow it to fit seamlessly into
     * display lists without causing a batch flush.
     *
     * @name Phaser.GameObjects.Zone#blendMode
     * @since 3.0.0
     */
    blendMode: number;

    /**
     * @since 3.0.0
     */
    constructor (scene: TODO_MIGRATE_Scene, x: number, y: number, width: number = 1, height: number = width)
    {
        super(scene, 'Zone');

        this.setPosition(x, y);

        this.width = width;
        this.height = height;

        this.blendMode = BlendModes.NORMAL;

        this.updateDisplayOrigin();
    }

    /**
     * The displayed width of this Game Object.
     * This value takes into account the scale factor.
     *
     * @name Phaser.GameObjects.Zone#displayWidth
     * @since 3.0.0
     */
    get displayWidth (): number
    {
        return this.scaleX * this.width;
    }

    set displayWidth (value: number)
    {
        this.scaleX = value / this.width;
    }

    /**
     * The displayed height of this Game Object.
     * This value takes into account the scale factor.
     *
     * @since 3.0.0
     */
    get displayHeight (): number
    {
        return this.scaleY * this.height;
    }

    set displayHeight (value: number)
    {
        this.scaleY = value / this.height;
    }

    /**
     * Sets the native (un-scaled) width and height of this Zone. Also updates the display origin
     * and, by default, resizes any non-custom input hit area associated with this Zone.
     *
     * @since 3.0.0
     *
     * @param width - The width of this Game Object.
     * @param height - The height of this Game Object.
     * @param [resizeInput=true] - If this Zone has a Rectangle for a hit area this argument will resize the hit area as well.
     *
     * @return This Game Object.
     */
    setSize (width: number, height: number, resizeInput: boolean = true): this
    {
        this.width = width;
        this.height = height;

        this.updateDisplayOrigin();

        const input = this.input;

        if (resizeInput && input && !input.customHitArea)
        {
            input.hitArea.width = width;
            input.hitArea.height = height;
        }

        return this;
    }

    /**
     * Sets the display size of this Game Object.
     * Calling this will adjust the scale.
     *
     * @since 3.0.0
     *
     * @param width - The width of this Game Object.
     * @param height - The height of this Game Object.
     *
     * @return This Game Object.
     */
    setDisplaySize (width: number, height: number): this
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

    /**
     * Sets this Zone to be a Circular Drop Zone.
     * The circle is centered on this Zone's `x` and `y` coordinates.
     *
     * @since 3.0.0
     *
     * @param radius - The radius of the Circle that will form the Drop Zone.
     *
     * @return This Game Object.
     */
    setCircleDropZone (radius: number): this
    {
        // @ts-expect-error - Circle is a JS Class() factory, not a native ES6 class
        return this.setDropZone(new Circle(0, 0, radius), CircleContains);
    }

    /**
     * Sets this Zone to be a Rectangle Drop Zone.
     * The rectangle is centered on this Zone's `x` and `y` coordinates.
     *
     * @since 3.0.0
     *
     * @param width - The width of the rectangle drop zone.
     * @param height - The height of the rectangle drop zone.
     *
     * @return This Game Object.
     */
    setRectangleDropZone (width: number, height: number): this
    {
        return this.setDropZone(new Rectangle(0, 0, width, height), RectangleContains);
    }

    /**
     * Enables this Zone as an interactive Drop Zone by calling `setInteractive` with the given
     * hit area shape and callback. You can pass any Phaser geometry shape, or a custom shape with
     * a matching hit-test callback. If no arguments are provided, a Rectangle matching the size of
     * this Zone will be used automatically. Has no effect if this Zone is already interactive.
     *
     * @since 3.0.0
     *
     * @param [hitArea] - A Geometry shape instance, such as Phaser.Geom.Ellipse, or your own custom shape.
     * @param [hitAreaCallback] - A function that will return `true` if the given x/y coords it is sent are within the shape.
     *
     * @return This Game Object.
     */
    setDropZone<T = unknown> (hitArea?: T, hitAreaCallback?: HitAreaCallback<T>): this
    {
        if (!this.input)
        {
            this.setInteractive(hitArea, hitAreaCallback, true);
        }

        return this;
    }

    /**
     * A NOOP method so you can pass a Zone to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Zone#setAlpha
     * @private
     * @since 3.11.0
     */
    setAlpha (): void
    {
    }

    /**
     * A NOOP method so you can pass a Zone to a Container in Canvas.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Zone#setBlendMode
     * @private
     * @since 3.16.2
     */
    setBlendMode (): void
    {
    }

    /**
     * A Zone does not render.
     *
     * @method Phaser.GameObjects.Zone#renderCanvas
     * @private
     * @since 3.53.0
     *
     * @param renderer - A reference to the current active Canvas renderer.
     * @param src - The Game Object being rendered in this call.
     * @param camera - The Camera that is rendering the Game Object.
     */
    renderCanvas (_renderer: object, src: Zone, camera: { addToRenderList(src: object): void }): void
    {
        camera.addToRenderList(src);
    }

    /**
     * A Zone does not render.
     *
     * @method Phaser.GameObjects.Zone#renderWebGL
     * @private
     * @since 3.53.0
     *
     * @param renderer - A reference to the current active WebGL renderer.
     * @param src - The Game Object being rendered in this call.
     * @param drawingContext - The current drawing context.
     */
    renderWebGL (_renderer: object, src: Zone, drawingContext: { camera: { addToRenderList(src: object): void } }): void
    {
        drawingContext.camera.addToRenderList(src);
    }
}

// ---------------------------------------------------------------------------
// Unmigrated JS mixin application
// ---------------------------------------------------------------------------
// These remain as runtime applyMixin() calls until each component .js is
// converted to a typed mixin function. Remove each line as you migrate its
// component to TypeScript.
applyMixin(Zone, Components.GetBounds);
applyMixin(Zone, Components.Origin);
applyMixin(Zone, Components.ScrollFactor);
applyMixin(Zone, Components.Transform);

// ---------------------------------------------------------------------------
// Declaration merging — unmigrated mixin / parent surface used by Zone's body.
// Remove entries as each dependency is migrated to TypeScript.
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-redeclare, @typescript-eslint/no-unsafe-declaration-merging
export interface Zone
{

    // From Transform mixin
    scaleX: number;
    scaleY: number;
    setPosition(x: number, y: number): this;

    // From Origin mixin
    updateDisplayOrigin(): this;

    // From GameObject parent
    input: { customHitArea: boolean; hitArea: { width: number; height: number } } | null;
    setInteractive<T = unknown>(hitArea?: T, hitAreaCallback?: HitAreaCallback<T>, dropZone?: boolean): this;
}

export default Zone;
