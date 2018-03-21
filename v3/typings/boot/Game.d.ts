/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
import Config from './Config';
import * as Device from '../device';
import RequestAnimationFrame from '../dom/RequestAnimationFrame';
import RandomDataGenerator from '../math/random-data-generator/RandomDataGenerator';
import StateManager from '../state/StateManager';
export default class Game {
    config: Config;
    renderer: any;
    canvas: any;
    context: any;
    isBooted: boolean;
    isRunning: boolean;
    raf: RequestAnimationFrame;
    textures: any;
    input: any;
    state: StateManager;
    device: typeof Device;
    rnd: RandomDataGenerator;
    constructor(config: any);
    boot(): void;
    update(timestamp: any): void;
}
