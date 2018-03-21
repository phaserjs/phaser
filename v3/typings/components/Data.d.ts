/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
/**
* The Data Component features a means to store pieces of data specific to a Game Object,
* search it, query it, and retrieve it.
*
* @class
*/
export default class Data {
    private _beforeCallbacks;
    private _afterCallbacks;
    private _frozen;
    parent: any;
    list: any;
    constructor(parent: any);
    get(key: any): any;
    getAll(): {};
    query(search: any): {};
    set(key: any, data: any): this;
    before(key: any, callback: any, scope: any): void;
    after(key: any, callback: any, scope: any): void;
    /**
    * Passes all data entries to the given callback. Stores the result of the callback.
    *
    * @method each
    * @param {function} callback - The function to call.
    * @param {object} [scope] - Value to use as `this` when executing callback.
    * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the game object, key, and data.
    */
    each(callback: any, scope: any): void;
    merge(data: any, overwrite: any): void;
    remove(key: any): void;
    removeListeners(key: any): void;
    pop(key: any): any;
    has(key: any): any;
    reset(): void;
    /**
    * Freeze this Data component, so no changes can be written to it.
    *
    * @name freeze
    * @property {boolean} freeze
    */
    freeze: boolean;
    readonly count: number;
}
