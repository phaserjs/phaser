export default class WebGLRenderer {
    gl: any;
    view: any;
    config: any;
    contextLost: any;
    width: any;
    height: any;
    blendModes: any;
    game: any;
    autoResize: any;
    type: any;
    resolution: any;
    multiTexture: any;
    maxTextures: any;
    constructor(game: any);
    init(): void;
    resize(width: any, height: any): void;
    /**
     * Renders the State.
     *
     * @method render
     * @param {Phaser.State} state - The State to be rendered.
     * @param {number} interpolationPercentage - The cumulative amount of time that hasn't been simulated yet, divided
     *   by the amount of time that will be simulated the next time update()
     *   runs. Useful for interpolating frames.
     */
    render(state: any, interpolationPercentage: any): void;
    destroy(): void;
}
