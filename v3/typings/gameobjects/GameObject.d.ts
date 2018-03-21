/**
* This is the base Game Object class that you can use when creating your own extended Game Objects.
* It hides away the 'private' stuff and exposes only the useful getters, setters and properties.
*
* @class
*/
export default class GameObject {
    state: any;
    game: any;
    name: any;
    type: any;
    parent: any;
    texture: any;
    frame: any;
    transform: any;
    data: any;
    color: any;
    scaleMode: any;
    skipRender: any;
    visible: any;
    children: any;
    exists: any;
    render: any;
    constructor(state: any, x: any, y: any, texture: any, frame: any, parent?: any);
    preUpdate(): void;
    update(): void;
    postUpdate(): void;
    destroy(): void;
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
    alpha: any;
    blendMode: any;
}
