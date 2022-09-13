var DemoA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function DemoA ()
    {
        Phaser.Scene.call(this, { key: 'DemoA', active: true });

        this.move = 0;
        this.mushroom0;
        this.mushroom1;
        this.mushroom2;
    },

    preload: function ()
    {
        this.load.atlas('veg', 'assets/tests/fruit/veg.png', 'assets/tests/fruit/veg.json');
        this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    },

    create: function ()
    {
        for (var i = 0; i < 2000; i++)
        {
            var image = this.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'veg', 'veg0' + Math.floor(1 + Math.random() * 9));
            image.depth = image.y;
        }

        this.mushroom0 = this.add.image(400, 300, 'mushroom');
        this.mushroom1 = this.add.image(400, 300, 'mushroom');
        this.mushroom2 = this.add.image(400, 300, 'mushroom');
    },

    update: function (time, delta)
    {
        this.mushroom0.x = 400 + Math.cos(this.move) * 200;
        this.mushroom0.y = 300 + Math.sin(this.move) * 200;
        this.mushroom0.depth = this.mushroom0.y + this.mushroom0.height / 2;
        
        this.mushroom1.x = 400 + Math.sin(-this.move) * 200;
        this.mushroom1.y = 300 + Math.cos(-this.move) * 200;
        this.mushroom1.depth = this.mushroom1.y + this.mushroom1.height / 2;

        this.mushroom2.y = 300 + Math.sin(this.move) * 180;
        this.mushroom2.depth = this.mushroom2.y + this.mushroom2.height / 2;

        this.move += 0.01;
    }

});