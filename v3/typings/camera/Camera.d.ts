export default class Camera {
    state: any;
    game: any;
    viewportWidth: any;
    viewportHeight: any;
    transform: any;
    atLimit: any;
    bounds: any;
    view: any;
    width: any;
    height: any;
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
    constructor(state: any, x: any, y: any, viewportWidth: any, viewportHeight: any);
    /**
    * Method called to ensure the camera doesn't venture outside of the game world.
    * Called automatically by Camera.update.
    *
    * @method Phaser.Camera#checkBounds
    * @protected
    */
    protected checkBounds(): void;
    x: any;
    y: any;
    readonly right: any;
    readonly bottom: any;
    scale: any;
    scaleX: any;
    scaleY: any;
    pivotX: any;
    pivotY: any;
    angle: any;
    rotation: any;
}
