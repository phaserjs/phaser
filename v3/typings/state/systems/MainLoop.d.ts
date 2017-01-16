/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
export default class MainLoop {
    state: any;
    game: any;
    timestep: any;
    physicsStep: any;
    frameDelta: any;
    lastFrameTimeMs: any;
    fps: any;
    lastFpsUpdate: any;
    framesThisSecond: any;
    numUpdateSteps: any;
    minFrameDelay: any;
    running: any;
    started: any;
    panic: any;
    constructor(state: any, framerate: any);
    setMaxFPS(fps: any): void;
    getMaxFPS(): number;
    resetFrameDelta(): any;
    start(): this;
    step(timestamp: any): void;
    stop(): this;
}
