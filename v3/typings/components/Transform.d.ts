/**
* 2D Transformation Component.
*
* @class
*/
export default class Transform {
    gameObject: any;
    game: any;
    state: any;
    world: any;
    old: any;
    cache: any;
    glVertextData: any;
    canvasData: any;
    immediate: any;
    interpolate: any;
    hasLocalRotation: any;
    private _posX;
    private _posY;
    private _scaleX;
    private _scaleY;
    private _rotation;
    private _pivotX;
    private _pivotY;
    private _anchorX;
    private _anchorY;
    private _worldRotation;
    private _worldScaleX;
    private _worldScaleY;
    private _dirty;
    private _dirtyVertex;
    parent: any;
    children: any;
    constructor(gameObject: any, x?: any, y?: any, scaleX?: any, scaleY?: any);
    add(child: any): any;
    addAt(child: any, index: any): any;
    remove(child: any): any;
    removeAt(index: any): any;
    enableInterpolation(): void;
    syncInterpolation(): void;
    disableInterpolation(): void;
    setPosition(x: any, y: any): void;
    setScale(x: any, y: any): void;
    setPivot(x: any, y: any): void;
    setAnchor(x: any, y?: any): void;
    setRotation(rotation: any): void;
    updateFromRoot(): this;
    updateFromParent(): this;
    updateAncestors(): this;
    updateChildren(): void;
    updateFromDirtyParent(): void;
    update(): void;
    updateCache(): void;
    updateVertexData(interpolationPercentage: any): any;
    getVertexData(interpolationPercentage: any): any;
    cloneVertexData(): {
        x0: any;
        y0: any;
        x1: any;
        y1: any;
        x2: any;
        y2: any;
        x3: any;
        y3: any;
    };
    getCanvasTransformData(interpolationPercentage: any): any;
    x: any;
    y: any;
    scale: any;
    scaleX: any;
    scaleY: any;
    anchor: any;
    anchorX: any;
    anchorY: any;
    pivotX: any;
    pivotY: any;
    angle: any;
    rotation: any;
    dirty: any;
    readonly name: any;
    readonly worldRotation: any;
    readonly worldScaleX: any;
    readonly worldScaleY: any;
    readonly worldX: any;
    readonly worldY: any;
}
