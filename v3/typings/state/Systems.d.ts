export default class Systems {
    state: any;
    config: any;
    events: any;
    textures: any;
    add: any;
    make: any;
    input: any;
    load: any;
    tweens: any;
    mainloop: any;
    updates: any;
    camera: any;
    children: any;
    color: any;
    data: any;
    fbo: any;
    time: any;
    transform: any;
    constructor(state: any, config?: any);
    init(): void;
    begin(timestamp: any, frameDelta: any): void;
    update(timestep: any, physicsStep: any): void;
    preRender(): void;
    end(fps: any, panic: any): void;
}
