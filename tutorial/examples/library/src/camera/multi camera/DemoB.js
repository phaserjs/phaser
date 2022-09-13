class DemoB extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'DemoB', active: true });
    }

    preload ()
    {
        this.load.image('sonic', 'assets/sprites/sonic.png');
        this.load.image('pixel', 'assets/sprites/16x16.png');
    }

    create ()
    {
        const source = this.textures.get('sonic').source[0].image;
        const canvas = this.textures.createCanvas('pad', 38, 42).source[0].image;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(source, 0, 0);

        const imageData = ctx.getImageData(0, 0, 38, 42);

        let x = 0;
        let y = 0;
        const color = new Phaser.Display.Color();

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

        const cam = this.cameras.main;
        cam.setBackgroundColor('#2d2d2d');

        cam.x = 800;
        cam.y = 0;
    }
}
