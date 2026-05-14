/**
 * Type-safe wrapper around `Object.keys()` that preserves the key type.
 *
 * The built-in `Object.keys()` always returns `string[]`, which loses
 * generic key information. This helper returns `K[]` instead, making it
 * safe to use the result to index back into the same record without casts.
 *
 *
 * @param obj - The object whose own enumerable property names to retrieve.
 * @returns An array of the object's own enumerable property names, typed as `K[]`.
 */
export function objectKeys<K extends string> (obj: Record<K, unknown>): K[]
{
    return Object.keys(obj) as K[];
}
