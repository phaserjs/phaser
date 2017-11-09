var DistanceBetween = require('../../../math/distance/DistanceBetween');

/**
* Move the given display object towards the x/y coordinates at a steady velocity.
* If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
* Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
* Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
* Note: The display object doesn't stop moving once it reaches the destination coordinates.
* Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
*
* @method Phaser.Physics.Arcade#moveTo
* @param {any} displayObject - The display object to move.
* @param {any} destination - The display object to move towards. Can be any object but must have visible x/y properties.
* @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
* @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
* @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
*/
var MoveTo = function (gameObject, x, y, speed, maxTime)
{
    if (speed === undefined) { speed = 60; }
    if (maxTime === undefined) { maxTime = 0; }

    var angle = Math.atan2(y - gameObject.y, x - gameObject.x);

    if (maxTime > 0)
    {
        //  We know how many pixels we need to move, but how fast?
        speed = DistanceBetween(gameObject.x, gameObject.y, x, y) / (maxTime / 1000);
    }

    gameObject.body.velocity.setToPolar(angle, speed);

    return angle;
};

module.exports = MoveTo;
