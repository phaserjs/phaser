/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
import { default as Config, GameConfig } from './Config';
import * as Device from '../device';
import RequestAnimationFrame from '../dom/RequestAnimationFrame';
import RandomDataGenerator from '../math/random-data-generator/RandomDataGenerator';
import StateManager from '../state/StateManager';
import Renderer from '../renderer/Renderer';
export default class Game {
    config: Config;
    renderer: Renderer;
    canvas: HTMLCanvasElement;
    context: any;
    isBooted: boolean;
    isRunning: boolean;
    raf: RequestAnimationFrame;
    textures: any;
    input: any;
    state: StateManager;
    device: typeof Device;
    rnd: RandomDataGenerator;
    constructor(config: GameConfig);
    boot(): void;
    update(timestamp: number): void;
}
