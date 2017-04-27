//  distance - usually in pixels
//  time - how long should it take to cover the distance? In seconds
//  Returns the amount you will need to increment by each step to cover the distance in the time given
var GetSpeed = function (distance, time)
{
    return (distance / time) / 1000;
};

module.exports = GetSpeed;
