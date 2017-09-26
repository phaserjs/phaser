var Class = require('../../utils/Class');
var Sprite = require('../sprite/Sprite');
var Vector2 = require('../../math/Vector2');

var PathFollower = new Class({

    Extends: Sprite,

    initialize:

    function PathFollower (scene, path, x, y, texture, frame)
    {
        Sprite.call(this, scene, x, y, texture, frame);

        this.path = path;

        this.pathOffset = new Vector2(x, y);

        this.pathVector = new Vector2();

        this.pathTween;

        this.pathData = {
            t: 0
        };
    },

    start: function (config)
    {
        if (config === undefined) { config = {}; }

        if (typeof config === 'number')
        {
            config = { duration: config };
        }

        //  Add the targets and property into the mix
        config.targets = this.pathData;
        config.t = 1;

        this.pathTween = this.scene.sys.tweens.add(config);

        //  The starting point of the path, relative to this follower

        // this.path.getStartPoint(this.pathOffset);
        var start = this.path.getStartPoint();

        // console.log('getStartPoint', this.pathOffset.x, this.pathOffset.y);
        console.log('getStartPoint2', this.x, this.y);

        var diffX = this.x - start.x;
        var diffY = this.y - start.y;

        console.log('diffX', diffX, 'diffY', diffY);

        this.pathOffset.set(diffX, diffY);


    },

    /*
    playing: {

        get: function ()
        {
            return this.pathData.playing;
        },

        set: function (value)
        {
            if (!value)
            {
                this.stop();
            }
            else
            {
                this.start();
            }
        }

    }
    */

    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);

        if (this.pathTween && this.pathTween.isPlaying())
        {
            this.path.getPoint(this.pathData.t, this.pathVector);

            this.pathVector.add(this.pathOffset);

            this.setPosition(this.pathVector.x, this.pathVector.y);
        }
    }

});

module.exports = PathFollower;
