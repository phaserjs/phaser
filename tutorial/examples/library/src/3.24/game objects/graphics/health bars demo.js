class HealthBar {

    constructor (scene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 76 / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

        if (this.value < 30)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}

class Missile extends Phaser.GameObjects.Image {

    constructor (scene, frame)
    {
        super(scene, 0, 0, 'elves', frame);

        this.visible = false;
    }

}

class Elf extends Phaser.GameObjects.Sprite {

    constructor (scene, color, x, y)
    {
        super(scene, x, y);

        this.color = color;

        this.setTexture('elves');
        this.setPosition(x, y);

        this.play(this.color + 'Idle');

        scene.add.existing(this);

        this.on('animationcomplete', this.animComplete, this);

        this.alive = true;

        var hx = (this.color === 'blue') ? 110 : -40;

        this.hp = new HealthBar(scene, x - hx, y - 110);

        this.timer = scene.time.addEvent({ delay: Phaser.Math.Between(1000, 3000), callback: this.fire, callbackScope: this });
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }

    animComplete (animation)
    {
        if (animation.key === this.color + 'Attack')
        {
            this.play(this.color + 'Idle');
        }
    }

    damage (amount)
    {
        if (this.hp.decrease(amount))
        {
            this.alive = false;

            this.play(this.color + 'Dead');

            (this.color === 'blue') ? bluesAlive-- : greensAlive--;
        }
    }

    fire ()
    {
        var target = (this.color === 'blue') ? getGreen() : getBlue();

        if (target && this.alive)
        {
            this.play(this.color + 'Attack');

            var offset = (this.color === 'blue') ? 20 : -20;
            var targetX = (this.color === 'blue') ? target.x + 30 : target.x - 30;

            this.missile.setPosition(this.x + offset, this.y + 20).setVisible(true);

            this.scene.tweens.add({
                targets: this.missile,
                x: targetX,
                ease: 'Linear',
                duration: 500,
                onComplete: function (tween, targets) {
                    targets[0].setVisible(false);
                }
            });

            target.damage(Phaser.Math.Between(2, 8));

            this.timer = this.scene.time.addEvent({ delay: Phaser.Math.Between(1000, 3000), callback: this.fire, callbackScope: this });
        }
    }

}

class BlueElf extends Elf {

    constructor (scene, x, y)
    {
        super(scene, 'blue', x, y);

        this.missile = new Missile(scene, 'blue-missile');

        scene.add.existing(this.missile);
    }

}

class GreenElf extends Elf {

    constructor (scene, x, y)
    {
        super(scene, 'green', x, y);

        this.missile = new Missile(scene, 'green-missile');

        scene.add.existing(this.missile);
    }

}

var config = {
    width: 1024,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var blues = [];
var greens = [];

var bluesAlive = 4;
var greensAlive = 4;

var game = new Phaser.Game(config);

function preload ()
{
    //  The graphics used in this example were free downloads from https://craftpix.net
    //  Check out their excellent asset packs!
    this.load.image('background', 'assets/pics/fairy-background-craft-pixel.png');
    this.load.atlas('elves', 'assets/animations/elves-craft-pixel.png', 'assets/animations/elves-craft-pixel.json');
}

function create ()
{
    this.anims.create({ key: 'greenIdle', frames: this.anims.generateFrameNames('elves', { prefix: 'green_idle_', start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'blueIdle', frames: this.anims.generateFrameNames('elves', { prefix: 'blue_idle_', start: 0, end: 4 }), frameRate: 10, repeat: -1 });

    this.anims.create({ key: 'greenAttack', frames: this.anims.generateFrameNames('elves', { prefix: 'green_attack_', start: 0, end: 5 }), frameRate: 10 });
    this.anims.create({ key: 'blueAttack', frames: this.anims.generateFrameNames('elves', { prefix: 'blue_attack_', start: 0, end: 4 }), frameRate: 10 });

    this.anims.create({ key: 'greenDead', frames: this.anims.generateFrameNames('elves', { prefix: 'green_die_', start: 0, end: 4 }), frameRate: 6 });
    this.anims.create({ key: 'blueDead', frames: this.anims.generateFrameNames('elves', { prefix: 'blue_die_', start: 0, end: 4 }), frameRate: 6 });

    this.add.image(0, 0, 'background').setOrigin(0);

    blues.push(new BlueElf(this, 120, 476));
    blues.push(new BlueElf(this, 220, 480));
    blues.push(new BlueElf(this, 320, 484));
    blues.push(new BlueElf(this, 440, 480));

    greens.push(new GreenElf(this, 560, 486));
    greens.push(new GreenElf(this, 670, 488));
    greens.push(new GreenElf(this, 780, 485));
    greens.push(new GreenElf(this, 890, 484));
}

function getGreen ()
{
    if (greensAlive)
    {
        greens = Phaser.Utils.Array.Shuffle(greens);

        for (var i = 0; i < greens.length; i++)
        {
            if (greens[i].alive)
            {
                return greens[i];
            }
        }
    }

    return false;
}

function getBlue ()
{
    if (bluesAlive)
    {
        blues = Phaser.Utils.Array.Shuffle(blues);

        for (var i = 0; i < blues.length; i++)
        {
            if (blues[i].alive)
            {
                return blues[i];
            }
        }
    }

    return false;
}
