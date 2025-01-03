/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require('./polyfills/requestVideoFrame');

var CONST = require('./const');

export const Actions = require('./actions');
export const Animations = require('./animations');
export const BlendModes = require('./renderer/BlendModes');
export const Cache = require('./cache');
export const Cameras = require('./cameras');
export const Core = require('./core');
export const Create = require('./create');
export const Curves = require('./curves');
export const Data = require('./data');
export const Display = require('./display');
export const DOM = require('./dom');
export const Events = require('./events');
export const FX = require('./fx');
export const Game = require('./core/Game');
export const GameObjects = require('./gameobjects');
export const Geom = require('./geom');
export const Input = require('./input');
export const Loader = require('./loader');
export const Math = require('./math');
export const Physics = require('./physics');
export const Plugins = require('./plugins');
export const Renderer = require('./renderer');
export const Scale = require('./scale');
export const ScaleModes = require('./renderer/ScaleModes');
export const Scene = require('./scene/Scene');
export const Scenes = require('./scene');
export const Structs = require('./structs');
export const Sound = require('./sound');
export const Textures = require('./textures');
export const Tilemaps = require('./tilemaps');
export const Time = require('./time');
export const Tweens = require('./tweens');
export const Utils = require('./utils');

export const VERSION = CONST.VERSION;
export const AUTO = CONST.AUTO;
export const CANVAS = CONST.CANVAS;
export const WEBGL = CONST.WEBGL;
export const HEADLESS = CONST.HEADLESS;
export const FOREVER = CONST.FOREVER;
export const NONE = CONST.NONE;
export const LEFT = CONST.LEFT;
export const RIGHT = CONST.RIGHT;
export const UP = CONST.UP;
export const DOWN = CONST.DOWN;
