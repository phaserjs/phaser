/**
 * A generic constructor type. Used as a constraint for mixin base classes.
 *
 * The `any[]` for args is the standard TypeScript mixin pattern — required
 * because `unknown[]` breaks assignability of concrete constructors like
 * `new (scene: Scene, type: string) => T` to the generic constraint.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T;

/**
 * A descriptor-bag entry shaped as `{ get, set }` that `applyMixin` installs
 * as a prototype getter/setter via `Object.defineProperty`.
 */
interface AccessorDescriptor
{
    get?: () => unknown;
    set?: (value: unknown) => void;
}

/**
 * Type guard: returns true when `value` is a getter/setter descriptor object.
 */
function isAccessorDescriptor (value: unknown): value is AccessorDescriptor
{
    if (value === null || typeof value !== 'object') { return false; }

    const record = value as Record<string, unknown>;

    return typeof record.get === 'function' || typeof record.set === 'function';
}

/**
 * Applies a Phaser-style descriptor-bag mixin object to a class prototype,
 * mirroring what the Class() factory's mixin() + extend() functions do.
 *
 * A descriptor-bag is a plain object where:
 *   - Entries shaped as `{ get: fn, set: fn }` become prototype getters/setters.
 *   - All other entries become regular writable prototype properties.
 *
 * This is the runtime half of the mixin pattern. Each migrated component
 * exports a typed mixin function that calls `applyMixin` internally and
 * returns a properly typed constructor via the return-type cast.
 *
 * @param target - The class whose prototype receives the mixin.
 * @param mixin  - A Phaser component descriptor-bag object.
 *
 */
export function applyMixin (target: Constructor, mixin: Record<string, unknown>): void
{
    for (const key of Object.keys(mixin))
    {
        const value = mixin[key];

        if (isAccessorDescriptor(value))
        {
            //  Getter / setter descriptor
            Object.defineProperty(target.prototype, key, {
                get: value.get,
                set: value.set,
                enumerable: true,
                configurable: true
            });
        }
        else
        {
            //  Plain value (method, default property)
            Object.defineProperty(target.prototype, key, {
                value,
                writable: true,
                enumerable: false,
                configurable: true
            });
        }
    }
}

export type Mixin<TAdded extends object> =
  <TBase extends Constructor>(
    Base: TBase
  ) => TBase & Constructor<InstanceType<TBase> & TAdded>;

export function defineMixin<TAdded extends object> ()
{
    return function <TBase extends Constructor> (
        fn: (Base: TBase) => TBase
    ): Mixin<TAdded>
    {
        return fn as unknown as Mixin<TAdded>;
    };
}

type AddedBy<T> =
  T extends Mixin<infer TAdded>
    ? TAdded
    : never;

type UnionToIntersection<T> =
  (T extends unknown ? (value: T) => void : never) extends
    (value: infer I) => void
      ? I
      : never;

type AddedByAll<TMixins extends readonly Mixin<object>[]> =
  UnionToIntersection<AddedBy<TMixins[number]>>;

export function composeMixins<const TMixins extends readonly Mixin<object>[]> (
    ...mixins: TMixins
): <TBase extends Constructor>(
  Base: TBase
) => TBase & Constructor<InstanceType<TBase> & AddedByAll<TMixins>>
{
    // The reduce chain is type-safe at call sites via the overload signature;
    // the implementation needs a single cast to bridge the generic gap.
    return ((Base: Constructor) =>
        mixins.reduce((Current, mixin) => mixin(Current), Base)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
}
