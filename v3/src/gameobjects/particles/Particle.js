var Class = require('../../utils/Class');

var Particle = new Class({

    initialize:

    function Particle (x, y, frame)
    {
        //  Phaser.Texture.Frame
        this.frame = frame;

        this.index = 0;

        this.x = x;
        this.y = y;

        this.velocityX = 0;
        this.velocityY = 0;

        this.scaleX = 1;
        this.scaleY = 1;

        this.rotation = 0;

        this.scrollFactorX = 1;
        this.scrollFactorY = 1;

        this.color = 0xFFFFFFFF;

        //  Floats?
        this.life = 1;
        this.lifeStep = 1;
        this.normLifeStep = 1;

        this.start = {
            tint: 0xFFFFFF,
            alpha: 1,
            scale: 1,
            angle: 0
        };

        this.end = {
            tint: 0xFFFFFF,
            alpha: 1,
            scale: 1,
            angle: 0
        };
    },

    reset: function (x, y, frame)
    {
        this.index = 0;

        this.frame = frame;

        this.x = x;
        this.y = y;

        this.velocityX = 0;
        this.velocityY = 0;

        this.scaleX = 1;
        this.scaleY = 1;

        this.rotation = 0;

        this.color = 0xFFFFFFFF;

        this.life = 1;
        this.lifeStep = 1;
        this.normLifeStep = 1;

        var start = this.start;

        start.tint = 0xFFFFFF;
        start.alpha = 1;
        start.scale = 1;
        start.angle = 0;

        var end = this.end;

        end.tint = 0xFFFFFF;
        end.alpha = 1;
        end.scale = 1;
        end.angle = 0;

        return this;
    },

    isAlive: function ()
    {
        return (this.lifeStep > 0);
    },

    /*
    setPosition: function (x, y)
    {
        this.x = x;
        this.y = y;
    },

    setScale: function (x, y)
    {
        this.scaleX = x;
        this.scaleY = y;
    }
    */

});

module.exports = Particle;
