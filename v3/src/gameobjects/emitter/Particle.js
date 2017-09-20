var Class = require('../../utils/Class');

var Particle = new Class({

    initialize: 

    function Particle (x, y)
    {
        this.index = 0;
        this.x = x;
        this.y = y;
        this.velocityX = 0.0;
        this.velocityY = 0.0;
        this.angularVelocity = 0.0;
        this.rotation = 0.0;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.life = 1.0;
        this.color = 0xFFFFFFFF;
        this.lifeStep = 1.0;
        this.normLifeStep = 1.0;

        this.start = {
            tint: 0xFFFFFF,
            alpha: 1.0,
            scale: 1.0
        };

        this.end = {
            tint: 0xFFFFFF,
            alpha: 1.0,
            scale: 1.0
        };
    },

    reset: function (x, y)
    {
        this.index = 0;
        this.x = x;
        this.y = y;
        this.velocityX = 0.0;
        this.velocityY = 0.0;
        this.rotation = 0.0;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.life = 1.0;
        this.color = 0xFFFFFFFF;
        this.lifeStep = 1.0;
        this.normLifeStep = 1.0;

        this.start = {
            tint: 0xFFFFFF,
            alpha: 1.0,
            scale: 1.0
        };

        this.end = {
            tint: 0xFFFFFF,
            alpha: 1.0,
            scale: 1.0
        };
        return this;
    },

    isAlive: function ()
    {
        return this.lifeStep > 0;
    }

});

module.exports = Particle;
