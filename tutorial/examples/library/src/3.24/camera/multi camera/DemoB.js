var DemoB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function DemoB ()
    {
        Phaser.Scene.call(this, { key: 'DemoB', active: true });
    },

    preload: function ()
    {
        this.load.image('sonic', 'assets/sprites/sonic.png');
        this.load.image('pixel', 'assets/sprites/16x16.png');
    },

    create: function ()
    {
        var source = this.textures.get('sonic').source[0].image;
        var canvas = this.textures.createCanvas('pad', 38, 42).source[0].image;
        var ctx = canvas.getContext('2d');

        ctx.drawImage(source, 0, 0);

        var imageData = ctx.getImageData(0, 0, 38, 42);

        var x = 0;
        var y = 0;
        var color = new Phaser.Display.Color();

        for (var i = 0; i < imageData.data.length; i += 4)
        {
            var r = imageData.data[i];
            var g = imageData.data[i + 1];
            var b = imageData.data[i + 2];
            var a = imageData.data[i + 3];

            if (a > 0)
            {
                var dx = 100 + x * 16;
                var dy = 0 + y * 16;

                var image = this.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'pixel').setScale(0);

                color.setTo(r, g, b, a);

                image.setTint(color.color);

                this.tweens.add({
                    targets: image,
                    duration: 2000,
                    x: dx,
                    y: dy,
                    scaleX: 1,
                    scaleY: 1,
                    angle: 360,
                    delay: i / 1500,
                    yoyo: true,
                    repeat: -1,
                    repeatDelay: 6

                });
            }

            x++;

            if (x === 38)
            {
                x = 0;
                y++;
            }
        }

        var cam = this.cameras.main;

        cam.setBackgroundColor('#2d2d2d');

        cam.x = 800;
        cam.y = 0;
    }

});