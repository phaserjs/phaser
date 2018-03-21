export default class CanvasRenderer {
    game: any;
    clearBeforeRender: any;
    transparent: any;
    autoResize: any;
    preserveDrawingBuffer: any;
    width: any;
    height: any;
    resolution: any;
    view: any;
    context: any;
    batch: any;
    roundPixels: any;
    currentAlpha: any;
    currentBlendMode: any;
    currentScaleMode: any;
    startTime: any;
    endTime: any;
    drawCount: any;
    blendModes: any;
    constructor(game: any);
    init(): void;
    /**
     * Maps Blend modes to Canvas blend modes.
     *
     * @method mapBlendModes
     * @private
     */
    mapBlendModes(): void;
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
    /**
     * Removes everything from the renderer and optionally removes the Canvas DOM element.
     *
     * @method destroy
     * @param [removeView=true] {boolean} Removes the Canvas element from the DOM.
     */
    destroy(): void;
}
