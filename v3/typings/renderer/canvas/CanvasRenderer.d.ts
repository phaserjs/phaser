import Renderer from '../Renderer';
import Game from '../../boot/Game';
import State from '../../state/State';
export default class CanvasRenderer implements Renderer {
    game: Game;
    clearBeforeRender: boolean;
    transparent: false;
    autoResize: boolean;
    preserveDrawingBuffer: boolean;
    width: number;
    height: number;
    resolution: number;
    view: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    drawImage: any;
    roundPixels: boolean;
    currentAlpha: number;
    currentBlendMode: number;
    currentScaleMode: number;
    startTime: number;
    endTime: number;
    drawCount: number;
    blendModes: string[];
    constructor(game: Game);
    init(): void;
    /**
     * Maps Blend modes to Canvas blend modes.
     *
     * @method mapBlendModes
     * @private
     */
    mapBlendModes(): void;
    resize(width: number, height: number): void;
    /**
     * Renders the State.
     *
     * @method render
     * @param {Phaser.State} state - The State to be rendered.
     * @param {number} interpolationPercentage - The cumulative amount of time that hasn't been simulated yet, divided
     *   by the amount of time that will be simulated the next time update()
     *   runs. Useful for interpolating frames.
     */
    render(state: State, interpolationPercentage: number): void;
    /**
     * Removes everything from the renderer and optionally removes the Canvas DOM element.
     *
     * @method destroy
     * @param [removeView=true] {boolean} Removes the Canvas element from the DOM.
     */
    destroy(): void;
}
