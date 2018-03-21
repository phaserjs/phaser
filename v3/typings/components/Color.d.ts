/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
/**
* The Color Component allows you to control the alpha, blend mode, tint and background color
* of a Game Object.
*
* @class
*/
export default class Color {
    gameObject: any;
    state: any;
    private _dirty;
    private _alpha;
    private _worldAlpha;
    private _blendMode;
    private _tint;
    private _glTint;
    private _hasTint;
    private _r;
    private _g;
    private _b;
    private _a;
    private _rgba;
    private _glBg;
    private _hasBackground;
    constructor(gameObject: any);
    setBackground(red: any, green: any, blue: any, alpha: any): void;
    clearTint(): void;
    setTint(topLeft: any, topRight?: any, bottomLeft?: any, bottomRight?: any): void;
    update(): void;
    getColor(value: any): number;
    getColor32(r: any, g: any, b: any, a: any): number;
    destroy(): void;
    dirty: any;
    tintTopLeft: any;
    tintTopRight: any;
    tintBottomLeft: any;
    tintBottomRight: any;
    tint: any;
    alpha: any;
    blendMode: any;
    worldAlpha: any;
    backgroundAlpha: any;
    red: any;
    green: any;
    blue: any;
}
