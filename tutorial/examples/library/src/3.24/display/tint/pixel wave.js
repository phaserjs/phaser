var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    backgroundColor: '#1a1a1a',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sonic', 'assets/sprites/sonic.png');
    this.load.image('pixel', 'assets/sprites/16x16.png');
}

function create ()
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
            // var startX = 1024/2;
            // var startY = 800;

            var startX = Phaser.Math.Between(0, 1024);
            var startY = Phaser.Math.Between(0, 768);

            var dx = 200 + x * 16;
            var dy = 64 + y * 16;

            var image = this.add.image(startX, startY, 'pixel').setScale(0);

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
                delay: i / 1.5,
                yoyo: true,
                repeat: -1,
                repeatDelay: 6000,
                hold: 6000

            });
        }

        x++;

        if (x === 38)
        {
            x = 0;
            y++;
        }
    }

}
