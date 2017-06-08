import State from '../state/State';
import Game from '../boot/Game';
import Transform from '../components/Transform';
export default class Camera {
    state: State;
    game: Game;
    viewportWidth: number;
    viewportHeight: number;
    transform: Transform;
    atLimit: {
        x: boolean;
        y: boolean;
    };
    bounds: any;
    view: {
        x: number;
        y: number;
    };
    width: number;
    height: number;
    private _shake;
    /**
    * A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
    * The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Phaser.Camera.x/y
    *
    * @class Phaser.Camera
    * @constructor
    * @param {Phaser.Game} game - Game reference to the currently running game.
    * @param {number} id - Not being used at the moment, will be when Phaser supports multiple camera
    * @param {number} x - Position of the camera on the X axis
    * @param {number} y - Position of the camera on the Y axis
    * @param {number} width - The width of the view rectangle
    * @param {number} height - The height of the view rectangle
    */
    constructor(state: State, x: number, y: number, viewportWidth: number, viewportHeight: number);
    /**
    * Method called to ensure the camera doesn't venture outside of the game world.
    * Called automatically by Camera.update.
    *
    * @method Phaser.Camera#checkBounds
    * @protected
    */
    protected checkBounds(): void;
    x: number;
    y: number;
    readonly right: number;
    readonly bottom: number;
    scale: number;
    scaleX: number;
    scaleY: number;
    pivotX: number;
    pivotY: number;
    angle: number;
    rotation: number;
}
