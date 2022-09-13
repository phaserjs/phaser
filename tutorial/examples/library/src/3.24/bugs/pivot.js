class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.debug;
        this.zombie1;
        this.zombie2;
        this.zombie3;
        this.zombie4;
        this.zombie5;
        this.zombie6;

        this.groundY = 500;
    }

    preload ()
    {
        this.load.setPath('assets/tests/');

        this.load.atlas('zombieNoPivot', 'zombie-no-pivot.png', 'zombie-no-pivot.json');
        this.load.atlas('zombiePivot', 'zombie-pivot.png', 'zombie-pivot.json');
        this.load.atlas('zombieAbsolutePivot', 'zombie-pivot-absolute.png', 'zombie-pivot-absolute.json');
    }

    create ()
    {
        this.game.anims.create({ key: 'walk1', frames: this.game.anims.generateFrameNames('zombieNoPivot', { prefix: 'Walk', start: 1, end: 10 }), frameRate: 13, repeat: -1 });
        this.game.anims.create({ key: 'walk2', frames: this.game.anims.generateFrameNames('zombiePivot', { prefix: 'Walk', start: 1, end: 10 }), frameRate: 13, repeat: -1 });
        this.game.anims.create({ key: 'walk3', frames: this.game.anims.generateFrameNames('zombieAbsolutePivot', { prefix: 'Walk', start: 1, end: 10 }), frameRate: 13, repeat: -1 });

        this.zombie1 = this.add.sprite(150, this.groundY).play('walk1', true).setOrigin(0.5, 1);
        this.zombie2 = this.add.sprite(400, this.groundY).play('walk1', true).setOrigin(0.5, 1).setFlipX(true);

        this.zombie3 = this.add.sprite(700, this.groundY).play('walk2', true);
        this.zombie4 = this.add.sprite(1050, this.groundY).play('walk2', true).setFlipX(true);

        this.zombie5 = this.add.sprite(1200, this.groundY).play('walk3', true);
        this.zombie6 = this.add.sprite(1700, this.groundY).play('walk3', true).setFlipX(true);

        this.debug = this.add.graphics();
    }

    update ()
    {
        let debug = this.debug;
        let zombie1 = this.zombie1;
        let zombie2 = this.zombie2;
        let zombie3 = this.zombie3;
        let zombie4 = this.zombie4;
        let zombie5 = this.zombie5;
        let zombie6 = this.zombie6;

        debug.clear();

        debug.fillStyle(0x00aa00, 0.5);
        debug.fillRect(0, this.groundY, 1800, 64);

        this.drawOrigin(zombie1, debug);
        this.drawOrigin(zombie2, debug);
        this.drawOrigin(zombie3, debug);
        this.drawOrigin(zombie4, debug);
        this.drawOrigin(zombie5, debug);
        this.drawOrigin(zombie6, debug);
    }

    drawOrigin (sprite, debug)
    {
        debug.lineStyle(1, 0x00ff00);
        debug.fillStyle(0x00ff00);

        debug.fillRect(sprite.x - 2, sprite.y - 2, 5, 5);
        debug.lineBetween(sprite.x, sprite.y, sprite.x, 0);
    }

    drawBounds (sprite, debug)
    {
        debug.lineStyle(2, 0xffff00);

        let bounds = sprite.getBounds();

        debug.strokeRectShape(bounds);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 1800,
    height: 700,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
