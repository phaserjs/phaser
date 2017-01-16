/**
* A BaseTransform class that you can use when extending Game Objects.
* Hides away the 'private' stuff and exposes only the useful getters and setters
*
* @class
*/
export default class BaseTransform {
    transform: any;
    constructor(x: any, y: any);
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
}
