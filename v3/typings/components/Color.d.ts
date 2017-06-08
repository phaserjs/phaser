/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
import State from '../state/State';
/**
* The Color Component allows you to control the alpha, blend mode, tint and background color
* of a Game Object.
*
* @class
*/
export default class Color {
    gameObject: any;
    state: State;
    _dirty: boolean;
    _alpha: number;
    _worldAlpha: number;
    _blendMode: any;
    _tint: any;
    _glTint: any;
    _hasTint: boolean;
    _r: number;
    _g: number;
    _b: number;
    _a: number;
    _rgba: string;
    _glBg: number;
    _hasBackground: boolean;
    constructor(gameObject: any);
    setBackground(red?: number, green?: number, blue?: number, alpha?: number): void;
    clearTint(): void;
    setTint(topLeft: any, topRight?: any, bottomLeft?: any, bottomRight?: any): void;
    update(): void;
    getColor(value: any): number;
    getColor32(r: any, g: any, b: any, a: any): number;
    destroy(): void;
    dirty: boolean;
    tintTopLeft: any;
    tintTopRight: any;
    tintBottomLeft: any;
    tintBottomRight: any;
    tint: any;
    alpha: number;
    blendMode: any;
    worldAlpha: number;
    backgroundAlpha: number;
    red: number;
    green: number;
    blue: number;
}
