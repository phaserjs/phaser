/**
* Returns `true` if the Key was pressed down within the `duration` value given, or `false` if it either isn't down,
* or was pressed down longer ago than then given duration.
* 
* @method Phaser.Key#downDuration
* @param {number} [duration=50] - The duration within which the key is considered as being just pressed. Given in ms.
* @return {boolean} True if the key was pressed down within the given duration.
*/
var DownDuration = function (key, duration)
{
    if (duration === undefined) { duration = 50; }

    return (key.isDown && key.duration < duration);
};

module.exports = DownDuration;
