/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Back = require('./back');
var Bounce = require('./bounce');
var Circular = require('./circular');
var Cubic = require('./cubic');
var Elastic = require('./elastic');
var Expo = require('./expo');
var Linear = require('./linear');
var Quadratic = require('./quadratic');
var Quartic = require('./quartic');
var Quintic = require('./quintic');
var Sine = require('./sine');
var Stepped = require('./stepped');

//  EaseMap
module.exports = {

    Power0: Linear,
    Power1: Quadratic.Out,
    Power2: Cubic.Out,
    Power3: Quartic.Out,
    Power4: Quintic.Out,

    Linear: Linear,
    Quad: Quadratic.Out,
    Cubic: Cubic.Out,
    Quart: Quartic.Out,
    Quint: Quintic.Out,
    Sine: Sine.Out,
    Expo: Expo.Out,
    Circ: Circular.Out,
    Elastic: Elastic.Out,
    Back: Back.Out,
    Bounce: Bounce.Out,
    Stepped: Stepped,

    'Quad.easeIn': Quadratic.In,
    'Cubic.easeIn': Cubic.In,
    'Quart.easeIn': Quartic.In,
    'Quint.easeIn': Quintic.In,
    'Sine.easeIn': Sine.In,
    'Expo.easeIn': Expo.In,
    'Circ.easeIn': Circular.In,
    'Elastic.easeIn': Elastic.In,
    'Back.easeIn': Back.In,
    'Bounce.easeIn': Bounce.In,

    'Quad.easeOut': Quadratic.Out,
    'Cubic.easeOut': Cubic.Out,
    'Quart.easeOut': Quartic.Out,
    'Quint.easeOut': Quintic.Out,
    'Sine.easeOut': Sine.Out,
    'Expo.easeOut': Expo.Out,
    'Circ.easeOut': Circular.Out,
    'Elastic.easeOut': Elastic.Out,
    'Back.easeOut': Back.Out,
    'Bounce.easeOut': Bounce.Out,

    'Quad.easeInOut': Quadratic.InOut,
    'Cubic.easeInOut': Cubic.InOut,
    'Quart.easeInOut': Quartic.InOut,
    'Quint.easeInOut': Quintic.InOut,
    'Sine.easeInOut': Sine.InOut,
    'Expo.easeInOut': Expo.InOut,
    'Circ.easeInOut': Circular.InOut,
    'Elastic.easeInOut': Elastic.InOut,
    'Back.easeInOut': Back.InOut,
    'Bounce.easeInOut': Bounce.InOut

};
