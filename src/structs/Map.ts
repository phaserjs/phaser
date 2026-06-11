/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { objectKeys } from '../utils/object/TypedObjectUtils.js';

/**
 * @param key - The key of the Map entry.
 * @param entry - The value of the Map entry.
 *
 * @returns The callback result.
 */
type EachMapCallback<K extends string, V> = (key: K, entry: V) => boolean | void;

/**
 * @classdesc
 * A custom Map implementation that stores entries as key-value pairs with ordered iteration.
 * Unlike a native JavaScript Map, it also maintains an internal object of entries for efficient
 * keyed access and iteration. Supports filtering, merging, and contains/size operations.
 * Used internally by various Phaser systems for managing collections.
 *
 * ```javascript
 * var map = new Map([
 *    [ 1, 'one' ],
 *    [ 2, 'two' ],
 *    [ 3, 'three' ]
 * ]);
 * ```
 *
 * @memberof Phaser.Structs
 * @since 3.0.0
 */
export class Map<K extends string = string, V = unknown>
{
    /**
     * The entries in this Map.
     *
     * @default {}
     * @since 3.0.0
     */
    entries: Record<K, V>;

    /**
     * The number of key / value pairs in this Map.
     *
     * @default 0
     * @since 3.0.0
     */
    size: number;

    /**
     * @param elements - An optional array of key-value pairs to populate this Map with.
     */
    constructor (elements?: Array<[K, V]> | null)
    {
        this.entries = {} as Record<K, V>;
        this.size = 0;

        this.setAll(elements);
    }

    /**
     * Adds all the elements in the given array to this Map.
     *
     * If the key already exists, the value will be replaced.
     *
     * @since 3.70.0
     *
     * @param elements - An array of key-value pairs to populate this Map with.
     * @returns This Map object.
     */
    setAll (elements?: Array<[K, V]> | null): this
    {
        if (Array.isArray(elements))
        {
            for (let i = 0; i < elements.length; i++)
            {
                this.set(elements[i][0], elements[i][1]);
            }
        }

        return this;
    }

    /**
     * Adds an element with a specified `key` and `value` to this Map.
     *
     * If the `key` already exists, the value will be replaced.
     *
     * If you wish to add multiple elements in a single call, use the `setAll` method instead.
     *
     * @since 3.0.0
     *
     * @param key - The key of the element to be added to this Map.
     * @param value - The value of the element to be added to this Map.
     * @returns This Map object.
     */
    set (key: K, value: V): this
    {
        if (!this.has(key))
        {
            this.size++;
        }

        this.entries[key] = value;

        return this;
    }

    /**
     * Returns the value associated to the `key`, or `undefined` if there is none.
     *
     * @since 3.0.0
     *
     * @param key - The key of the element to return from the `Map` object.
     * @returns The element associated with the specified key or `undefined` if the key can't be found in this Map object.
     */
    get (key: K): V | undefined
    {
        if (this.has(key))
        {
            return this.entries[key];
        }
    }

    /**
     * Returns an `Array` of all the values stored in this Map.
     *
     * @since 3.0.0
     *
     * @returns An array of the values stored in this Map.
     */
    getArray (): V[]
    {
        const output: V[] = [];
        const entries = this.entries;

        for (const key of objectKeys(entries))
        {
            output.push(entries[key]);
        }

        return output;
    }

    /**
     * Returns a boolean indicating whether an element with the specified key exists or not.
     *
     * @since 3.0.0
     *
     * @param key - The key of the element to test for presence of in this Map.
     * @returns Returns `true` if an element with the specified key exists in this Map, otherwise `false`.
     */
    has (key: K): boolean
    {
        return (this.entries.hasOwnProperty(key));
    }

    /**
     * Delete the specified element from this Map.
     *
     * @since 3.0.0
     *
     * @param key - The key of the element to delete from this Map.
     * @returns This Map object.
     */
    delete (key: K): this
    {
        if (this.has(key))
        {
            delete this.entries[key];
            this.size--;
        }

        return this;
    }

    /**
     * Delete all entries from this Map.
     *
     * @since 3.0.0
     *
     * @returns This Map object.
     */
    clear (): this
    {
        for (const prop of objectKeys(this.entries))
        {
            delete this.entries[prop];
        }

        this.size = 0;

        return this;
    }

    /**
     * Returns an array of all entry keys in this Map.
     *
     * @since 3.0.0
     *
     * @returns Array containing entries' keys.
     */
    keys (): K[]
    {
        return objectKeys(this.entries);
    }

    /**
     * Returns an `Array` of all values stored in this Map.
     *
     * @since 3.0.0
     *
     * @returns An `Array` of values.
     */
    values (): V[]
    {
        const output: V[] = [];
        const entries = this.entries;

        for (const key of objectKeys(entries))
        {
            output.push(entries[key]);
        }

        return output;
    }

    /**
     * Dumps the contents of this Map to the console via `console.group`.
     *
     * @since 3.0.0
     */
    dump (): void
    {
        const entries = this.entries;

        // eslint-disable-next-line no-console
        console.group('Map');

        for (const key of objectKeys(entries))
        {
            console.log(key, entries[key]);
        }

        // eslint-disable-next-line no-console
        console.groupEnd();
    }

    /**
     * Iterates through all entries in this Map, passing each one to the given callback.
     *
     * If the callback returns `false`, the iteration will break.
     *
     * @since 3.0.0
     *
     * @param callback - The callback which will receive the keys and entries held in this Map.
     * @returns This Map object.
     */
    each (callback: EachMapCallback<K, V>): this
    {
        const entries = this.entries;

        for (const key of objectKeys(entries))
        {
            if (callback(key, entries[key]) === false)
            {
                break;
            }
        }

        return this;
    }

    /**
     * Returns `true` if the value exists within this Map. Otherwise, returns `false`.
     *
     * @since 3.0.0
     *
     * @param value - The value to search for.
     * @returns `true` if the value is found, otherwise `false`.
     */
    contains (value: V): boolean
    {
        const entries = this.entries;

        for (const key of objectKeys(entries))
        {
            if (entries[key] === value)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Merges all new keys from the given Map into this one.
     * If it encounters a key that already exists it will be skipped unless override is set to `true`.
     *
     * @since 3.0.0
     *
     * @param map - The Map to merge in to this Map.
     * @param override - Set to `true` to replace values in this Map with those from the source map, or `false` to skip them.
     * @returns This Map object.
     */
    merge (map: Map<K, V>, override: boolean = false): this
    {
        const local = this.entries;
        const source = map.entries;

        for (const key of objectKeys(source))
        {
            if (local.hasOwnProperty(key) && override)
            {
                local[key] = source[key];
            }
            else
            {
                this.set(key, source[key]);
            }
        }

        return this;
    }
}

export default Map;
