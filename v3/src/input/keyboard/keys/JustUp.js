/**
* The justUp value allows you to test if this Key has just been released or not.
* When you check this value it will return `true` if the Key is up, otherwise `false`.
* You can only call justUp once per key release. It will only return `true` once, until the Key is pressed down and released again.
* This allows you to use it in situations where you want to check if this key is up without using a Signal, such as in a core game loop.
* 
* @property {boolean} justUp
* @memberof Phaser.Key
* @default false
*/

var JustUp = function (key)
{
    var current = false;

    if (key.isDown)
    {
        current = key._justUp;
        key._justUp = false;
    }

    return current;
};

module.exports = JustUp;
