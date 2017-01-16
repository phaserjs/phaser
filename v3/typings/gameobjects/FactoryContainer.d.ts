/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
/**
* The GameObject Factory is a global level container of Factory instances.
* Factories register themselves with this container (when required)
*
* @class Phaser.GameObject.Factory
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
export declare class FactoryContainer {
    private static factories;
    register(factory: any): any;
    getType(key: any): any;
    load(dest: any, isFactory: any): any;
}
declare var _default: FactoryContainer;
export default _default;
