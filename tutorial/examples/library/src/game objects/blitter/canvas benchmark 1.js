
let blitter;
let gravity = 0.5;
let idx = 1;
let frame = 'veg01';
let numbers = [];
let iter = 0;

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('atlas', 'assets/tests/fruit/veg.png', 'assets/tests/fruit/veg.json');
    }

    create ()
    {
        numbers.push(this.add.image(32 + 0 * 50, 742, 'atlas', '0'));
        numbers.push(this.add.image(32 + 1 * 50, 742, 'atlas', '0'));
        numbers.push(this.add.image(32 + 2 * 50, 742, 'atlas', '0'));
        numbers.push(this.add.image(32 + 3 * 50, 742, 'atlas', '0'));
        numbers.push(this.add.image(32 + 4 * 50, 742, 'atlas', '0'));
        numbers.push(this.add.image(32 + 5 * 50, 742, 'atlas', '0'));
        numbers.push(this.add.image(32 + 6 * 50, 742, 'atlas', '0'));

        blitter = this.add.blitter(0, 0, 'atlas');

        for (var i = 0; i < 50; ++i)
        {
            this.launch();
        }

        this.updateDigits();
    }

    update ()
    {
        if (this.input.activePointer.isDown)
        {
            for (var i = 0; i < 50; ++i)
            {
                this.launch();
            }

            this.updateDigits();
        }

        for (var index = 0, length = blitter.children.list.length; index < length; ++index)
        {
            var bob = blitter.children.list[index];

            bob.data.vy += gravity;

            bob.y += bob.data.vy;
            bob.x += bob.data.vx;

            if (bob.x > 1024)
            {
                bob.x = 1024;
                bob.data.vx *= -bob.data.bounce;
            }
            else if (bob.x < 0)
            {
                bob.x = 0;
                bob.data.vx *= -bob.data.bounce;
            }

            if (bob.y > 684)
            {
                bob.y = 684;
                bob.data.vy *= -bob.data.bounce;
            }
        }

        // this.cameras.main.scrollX = Math.sin(iter) * 200;
        // iter += 0.01;
    }

    launch ()
    {
        idx++;

        if (idx === 38)
        {
            idx = 1;
        }

        if (idx < 10)
        {
            frame = 'veg0' + idx.toString();
        }
        else
        {
            frame = 'veg' + idx.toString();
        }

        var bob = blitter.create(0, 0, frame);

        bob.data.vx = Math.random() * 10;
        bob.data.vy = Math.random() * 10;
        bob.data.bounce = 0.8 + (Math.random() * 0.3);
    }

    updateDigits ()
    {
        var len = Phaser.Utils.String.Pad(blitter.children.list.length.toString(), 7, '0', 1);

        numbers[0].setFrame(len[0]);
        numbers[1].setFrame(len[1]);
        numbers[2].setFrame(len[2]);
        numbers[3].setFrame(len[3]);
        numbers[4].setFrame(len[4]);
        numbers[5].setFrame(len[5]);
        numbers[6].setFrame(len[6]);
    }

}

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
