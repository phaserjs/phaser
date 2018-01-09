/**
* Given the rotation (in radians) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
* One way to use this is: velocityFromRotation(rotation, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
*
* @method Phaser.Physics.Arcade#velocityFromRotation
* @param {number} rotation - The angle in radians.
* @param {number} [speed=60] - The speed it will move, in pixels per second sq.
* @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated velocity.
* @return {Phaser.Point} - A Point where point.x contains the velocity x value and point.y contains the velocity y value.
*/

var VelocityFromRotation = function (rotation, speed, vec2)
{
    if (speed === undefined) { speed = 60; }

    return vec2.setToPolar(rotation, speed);
};

module.exports = VelocityFromRotation;
