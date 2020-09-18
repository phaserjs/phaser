/// <reference path="./spine.d.ts" />
/// <reference path="./SpinePlugin.d.ts" />
/// <reference path="./SpineGameObject.d.ts" />

declare class SpineContainer extends Phaser.GameObjects.Container implements Phaser.GameObjects.Components.AlphaSingle, Phaser.GameObjects.Components.BlendMode, Phaser.GameObjects.Components.ComputedSize, Phaser.GameObjects.Components.Depth, Phaser.GameObjects.Components.Mask, Phaser.GameObjects.Components.Transform, Phaser.GameObjects.Components.Visible {
    constructor(scene: Phaser.Scene, pluginManager: SpinePlugin, x?: number, y?: number, children?: SpineGameObject[]);

    list: SpineGameObject[];

    exclusive: boolean;

    maxSize: number;
    position: number;

    localTransform: Phaser.GameObjects.Components.TransformMatrix;

    scrollFactorX: number;
    scrollFactorY: number;

    readonly originX: number;
    readonly originY: number;
    readonly displayOriginX: number;
    readonly displayOriginY: number;

    setExclusive(value?: boolean): this;
    getBounds(output?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;
    pointToContainer(source: object | Phaser.Geom.Point | Phaser.Math.Vector2, output?: object | Phaser.Geom.Point | Phaser.Math.Vector2): object | Phaser.Geom.Point | Phaser.Math.Vector2;
    getBoundsTransformMatrix(): Phaser.GameObjects.Components.TransformMatrix;
    add(child: SpineGameObject | SpineGameObject[]): this;
    addAt(child: SpineGameObject | SpineGameObject[], index?: number): this;
    getAt(index: number): SpineGameObject;
    getIndex(child: SpineGameObject): number;
    sort(property: string, handler?: Function): this;
    getByName(name: string): SpineGameObject;
    getRandom(startIndex?: number, length?: number): SpineGameObject;
    getFirst(property: string, value: any, startIndex?: number, endIndex?: number): SpineGameObject;
    getAll(property?: string, value?: any, startIndex?: number, endIndex?: number): SpineGameObject[];
    count(property: string, value: any, startIndex?: number, endIndex?: number): number;
    swap(child1: SpineGameObject, child2: SpineGameObject): this;
    moveTo(child: SpineGameObject, index: number): this;
    remove(child: SpineGameObject | SpineGameObject[], destroyChild?: boolean): this;
    removeAt(index: number, destroyChild?: boolean): this;
    removeBetween(startIndex?: number, endIndex?: number, destroyChild?: boolean): this;
    removeAll(destroyChild?: boolean): this;
    bringToTop(child: SpineGameObject): this;
    sendToBack(child: SpineGameObject): this;
    moveUp(child: SpineGameObject): this;
    moveDown(child: SpineGameObject): this;
    reverse(): this;
    shuffle(): this;
    replace(oldChild: SpineGameObject, newChild: SpineGameObject, destroyChild?: boolean): this;
    exists(child: SpineGameObject): boolean;
    setAll(property: string, value: any, startIndex?: number, endIndex?: number): this;
    each(callback: Function, context?: object, ...args: any[]): this;
    iterate(callback: Function, context?: object, ...args: any[]): this;
    setScrollFactor(x: number, y?: number, updateChildren?: boolean): this;

    readonly length: number;
    readonly first: SpineGameObject;
    readonly last: SpineGameObject;
    readonly next: SpineGameObject;
    readonly previous: SpineGameObject;

    protected preDestroy(): void;

    clearAlpha(): this;
    setAlpha(value?: number): this;

    alpha: number;
    blendMode: Phaser.BlendModes | string;

    setBlendMode(value: string | Phaser.BlendModes): this;

    width: number;
    height: number;

    displayWidth: number;
    displayHeight: number;

    setSize(width: number, height: number): this;
    setDisplaySize(width: number, height: number): this;

    depth: number;

    setDepth(value: number): this;

    mask: Phaser.Display.Masks.BitmapMask | Phaser.Display.Masks.GeometryMask;

    setMask(mask: Phaser.Display.Masks.BitmapMask | Phaser.Display.Masks.GeometryMask): this;
    clearMask(destroyMask?: boolean): this;
    createBitmapMask(renderable?: Phaser.GameObjects.GameObject): Phaser.Display.Masks.BitmapMask;
    createGeometryMask(graphics?: Phaser.GameObjects.Graphics): Phaser.Display.Masks.GeometryMask;

    x: number;
    y: number;
    z: number;
    w: number;

    scale: number;
    scaleX: number;
    scaleY: number;

    angle: number;
    rotation: number;

    setPosition(x?: number, y?: number, z?: number, w?: number): this;
    setRandomPosition(x?: number, y?: number, width?: number, height?: number): this;
    setRotation(radians?: number): this;
    setAngle(degrees?: number): this;
    setScale(x: number, y?: number): this;
    setX(value?: number): this;
    setY(value?: number): this;
    setZ(value?: number): this;
    setW(value?: number): this;

    getLocalTransformMatrix(tempMatrix?: Phaser.GameObjects.Components.TransformMatrix): Phaser.GameObjects.Components.TransformMatrix;
    getWorldTransformMatrix(tempMatrix?: Phaser.GameObjects.Components.TransformMatrix, parentMatrix?: Phaser.GameObjects.Components.TransformMatrix): Phaser.GameObjects.Components.TransformMatrix;

    getParentRotation(): number;

    visible: boolean;

    setVisible(value: boolean): this;
}

declare interface SpineContainerConfig extends Phaser.Types.GameObjects.GameObjectConfig {
    x?: number;
    y?: number;
    children?: SpineGameObject | SpineGameObject[];
}
