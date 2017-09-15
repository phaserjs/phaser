var Class = require('../../utils/Class');

var Particle = new Class({

    initialize: 

    function Particle ()
    {
        this.x = 0.0;
        this.y = 0.0;
        this.gravityX = 0.0;        
        this.gravityY = 0.0;
        this.velocityX = 0.0;
        this.velocityY = 0.0;
    }

});

module.exports = Particle;
