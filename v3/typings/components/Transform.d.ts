import Game from '../boot/Game';
import State from '../state/State';
import Renderer from '../renderer/Renderer';
/**
* 2D Transformation Component.
*
* @class
*/
export default class Transform {
    gameObject: any;
    game: Game;
    state: State;
    world: any;
    old: any;
    cache: any;
    glVertextData: any;
    canvasData: any;
    immediate: boolean;
    interpolate: boolean;
    hasLocalRotation: boolean;
    _posX: number;
    _posY: number;
    _scaleX: number;
    _scaleY: number;
    _rotation: number;
    _pivotX: number;
    _pivotY: number;
    _anchorX: number;
    _anchorY: number;
    _worldRotation: number;
    _worldScaleX: number;
    _worldScaleY: number;
    _dirty: boolean;
    _dirtyVertex: boolean;
    parent: Transform;
    children: Transform[];
    constructor(gameObject: any, x?: number, y?: number, scaleX?: number, scaleY?: number);
    add(child: Transform): Transform;
    addAt(child: Transform, index: number): Transform;
    remove(child: Transform): Transform;
    removeAt(index: number): Transform;
    enableInterpolation(): void;
    syncInterpolation(): void;
    disableInterpolation(): void;
    setPosition(x: number, y?: number): Transform;
    setScale(x: number, y?: number): Transform;
    setPivot(x: number, y?: number): Transform;
    setAnchor(x: number, y?: number): void;
    setRotation(rotation: number): Transform;
    updateFromRoot(): Transform;
    updateFromParent(): Transform;
    updateAncestors(): Transform;
    updateChildren(): void;
    updateFromDirtyParent(): void;
    update(): Transform;
    updateCache(): void;
    updateVertexData(interpolationPercentage: number, renderer: Renderer): any;
    getVertexData(interpolationPercentage: any, renderer: any): any;
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
    getCanvasTransformData(interpolationPercentage: number, renderer: Renderer): any;
    x: number;
    y: number;
    scale: number;
    scaleX: number;
    scaleY: number;
    anchor: number;
    anchorX: number;
    anchorY: number;
    pivotX: number;
    pivotY: number;
    angle: number;
    rotation: number;
    dirty: boolean;
    readonly name: string;
    readonly worldRotation: number;
    readonly worldScaleX: number;
    readonly worldScaleY: number;
    readonly worldX: number;
    readonly worldY: number;
}
