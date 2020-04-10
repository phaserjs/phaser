/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Distance
 */

module.exports = {

    Between: require('./DistanceBetween'),
    BetweenPoints: require('./DistanceBetweenPoints'),
    BetweenPointsSquared: require('./DistanceBetweenPointsSquared'),
    Chebyshev: require('./DistanceChebyshev'),
    Power: require('./DistancePower'),
    Snake: require('./DistanceSnake'),
    Squared: require('./DistanceSquared')

};
