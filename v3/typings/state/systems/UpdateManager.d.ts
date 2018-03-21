/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
/**
* Dirty! Manager
*
* @class
*/
export default class UpdateManager {
    state: any;
    game: any;
    list: any;
    running: any;
    processed: any;
    constructor(state: any);
    stop(): void;
    start(): void;
    add(transform: any): void;
}
