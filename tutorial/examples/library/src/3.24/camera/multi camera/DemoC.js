var DemoC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function DemoC ()
    {
        Phaser.Scene.call(this, { key: 'DemoC', active: true });

        this.tilesprites = [];
    },

    preload: function ()
    {
        this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
    },

    create: function ()
    {
        var frames = ['atari400', 'bunny', 'cokecan', 'copy-that-floppy', 'hotdog'];

        for (var i = 0; i < frames.length; ++i) 
        {
            this.tilesprites[i] = this.add.tileSprite(i * 160, 0, 160, 600, 'atlas', frames[i]);
            this.tilesprites[i].setOrigin(0)
            this.tilesprites[i].setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        }

        var cam = this.cameras.main;

        cam.x = 0;
        cam.y = 600;
    },

    update: function ()
    {
        var x = 4;

        for (var i = 0; i < this.tilesprites.length; ++i) 
        {
            this.tilesprites[i].tilePositionX += x;
            this.tilesprites[i].tilePositionY += x;
            x *= -1;
        }
    }

});