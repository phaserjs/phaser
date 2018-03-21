/**
* The justDown value allows you to test if this Key has just been pressed down or not.
* When you check this value it will return `true` if the Key is down, otherwise `false`.
* You can only call justDown once per key press. It will only return `true` once, until the Key is released and pressed down again.
* This allows you to use it in situations where you want to check if this key is down without using a Signal, such as in a core game loop.
* 
* @property {boolean} justDown
* @memberof Phaser.Key
* @default false
*/

var JustDown = function (key)
{
    var current = false;

    if (key.isDown)
    {
        current = key._justDown;
        key._justDown = false;
    }

    return current;
};

module.exports = JustDown;
