/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Easing function identifiers.
 *
 * @ignore
 */
var EasingEncoding = {
    None: 0,

    Power0: 1,
    Power1: 10,
    Power2: 20,
    Power3: 30,
    Power4: 40,
    Linear: 1,

    Gravity: 2,

    Quad: 10,
    'Quad.easeOut': 10,
    'Quad.easeIn': 11,
    'Quad.easeInOut': 12,

    Cubic: 20,
    'Cubic.easeOut': 20,
    'Cubic.easeIn': 21,
    'Cubic.easeInOut': 22,

    Quart: 30,
    'Quart.easeOut': 30,
    'Quart.easeIn': 31,
    'Quart.easeInOut': 32,

    Quint: 40,
    'Quint.easeOut': 40,
    'Quint.easeIn': 41,
    'Quint.easeInOut': 42,

    Sine: 50,
    'Sine.easeOut': 50,
    'Sine.easeIn': 51,
    'Sine.easeInOut': 52,

    Expo: 60,
    'Expo.easeOut': 60,
    'Expo.easeIn': 61,
    'Expo.easeInOut': 62,

    Circ: 70,
    'Circ.easeOut': 70,
    'Circ.easeIn': 71,
    'Circ.easeInOut': 72,

    // // Elastic requires extra parameters, so we skip it.
    // Elastic: 80,
    // 'Elastic.easeOut': 80,
    // 'Elastic.easeIn': 81,
    // 'Elastic.easeInOut': 82,

    Back: 90,
    'Back.easeOut': 90,
    'Back.easeIn': 91,
    'Back.easeInOut': 92,

    Bounce: 100,
    'Bounce.easeOut': 100,
    'Bounce.easeIn': 101,
    'Bounce.easeInOut': 102,

    // Stepped could require extra parameters, but we assume just 2.
    Stepped: 110,

    Smoothstep: 120,
    'Smoothstep.easeOut': 120,
    'Smoothstep.easeIn': 121,
    'Smoothstep.easeInOut': 122
};

module.exports = EasingEncoding;
