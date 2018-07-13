/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var GetValue: any;
declare var NOOP: any;
declare var RequestAnimationFrame: any;
/**
 * @callback TimeStepCallback
 *
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} average - The Delta Average.
 * @param {number} interpolation - Interpolation - how far between what is expected and where we are?
 */
/**
 * @classdesc
 * [description]
 *
 * @class TimeStep
 * @memberOf Phaser.Boot
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance that owns this Time Step.
 * @param {FPSConfig} config
 */
declare var TimeStep: any;
