Phaser.Component.Animation = function () {};

Phaser.Component.Animation.prototype = {

    /**
    * Play an animation based on the given key. The animation should previously have been added via sprite.animations.add()
    * If the requested animation is already playing this request will be ignored. If you need to reset an already running animation do so directly on the Animation object itself.
    *
    * @method Phaser.Sprite#play
    * @memberof Phaser.Sprite
    * @param {string} name - The name of the animation to be played, e.g. "fire", "walk", "jump".
    * @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
    * @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
    * @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
    * @return {Phaser.Animation} A reference to playing Animation instance.
    */
    play: function (name, frameRate, loop, killOnComplete) {

        if (this.animations)
        {
            return this.animations.play(name, frameRate, loop, killOnComplete);
        }

    }

};
