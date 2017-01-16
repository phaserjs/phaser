/**
* Frame Buffer Object with drawing quad + shader
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
export default class QuadFBO {
    renderer: any;
    parent: any;
    gl: any;
    private _x;
    private _y;
    private _width;
    private _height;
    textureIndex: any;
    clipX: any;
    clipY: any;
    vertexBuffer: any;
    indexBuffer: any;
    textureBuffer: any;
    vertices: any;
    texture: any;
    renderBuffer: any;
    frameBuffer: any;
    program: any;
    aVertexPosition: any;
    aTextureCoord: any;
    private _normal;
    private _twirl;
    constructor(renderer: any, parent: any, x: any, y: any, width: any, height: any);
    init(): void;
    createShader(): void;
    setPosition(x: any, y: any): void;
    setSize(width: any, height: any): void;
    updateVerts(): void;
    activate(): void;
    bindShader(): void;
    render(destinationBuffer: any): void;
    destroy(): void;
    x: any;
    y: any;
    width: any;
    height: any;
}
