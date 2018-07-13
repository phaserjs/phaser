/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Body: any;
declare var MATH_CONST: any;
declare var WrapAngle: any;
declare var WrapAngleDegrees: any;
declare var _FLAG: number;
/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Transform
 * @since 3.0.0
 */
declare var Transform: {
    _scaleX: number;
    _scaleY: number;
    _rotation: number;
    x: number;
    y: number;
    z: number;
    w: number;
    scaleX: {
        get: () => any;
        set: (value: any) => void;
    };
    scaleY: {
        get: () => any;
        set: (value: any) => void;
    };
    angle: {
        get: () => any;
        set: (value: any) => void;
    };
    rotation: {
        get: () => any;
        set: (value: any) => void;
    };
    setPosition: (x: any, y: any, z: any, w: any) => any;
    setRandomPosition: (x: any, y: any, width: any, height: any) => any;
    setRotation: (radians: any) => any;
    setAngle: (degrees: any) => any;
    setScale: (x: any, y: any) => any;
    setX: (value: any) => any;
    setY: (value: any) => any;
    setZ: (value: any) => any;
    setW: (value: any) => any;
    getLocalTransformMatrix: (tempMatrix: any) => any;
    getWorldTransformMatrix: (tempMatrix: any) => any;
};
