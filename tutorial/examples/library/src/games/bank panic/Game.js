import Door from './Door.js';

export default class MainGame extends Phaser.Scene
{
    constructor ()
    {
        super('MainGame');

        this.hats;
        this.goals;
        this.gold;
        this.doors;

        this.isPaused = false;
        this.goalsComplete = 0;
        this.sign;

        this.level = 1;
        this.levelImage;

        this.killDelay = 0.7;
        this.closeDurationLow = 2000;
        this.closeDurationHigh = 4000;
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        //  Level text
        this.add.image(450, 650, 'assets', 'levelText');

        this.levelImage = this.add.image(600, 650, 'assets', '1');

        this.createGoals();
        this.createDoors();

        this.hats = this.add.group({
            defaultKey: 'assets',
            defaultFrame: 'hat',
            key: 'assets',
            frame: 'hat',
            active: false,
            visible: false,
            repeat: 32,
            maxSize: 32
        });

        this.gold = this.add.group({
            defaultKey: 'assets',
            defaultFrame: 'gold',
            key: 'assets',
            frame: 'gold',
            active: false,
            visible: false,
            repeat: 11,
            maxSize: 12
        });

        this.isPaused = false;

        this.level = 1;
        this.killDelay = 0.8;
        this.closeDurationLow = 2000;
        this.closeDurationHigh = 4000;

        this.doors.forEach((door) => {
            door.start(this.game.getTime());
        });
    }

    createGoals ()
    {
        this.goals = [];
        this.goalsComplete = 0;

        for (let i = 1; i <= 12; i++)
        {
            this.goals.push(this.add.image(0, 0, 'assets', i));
        }

        Phaser.Actions.GridAlign(this.goals, {
            width: 12,
            height: 1,
            cellWidth: 80,
            cellHeight: 36,
            x: 80,
            y: 86
        });
    }

    createDoors ()
    {
        this.doors = [];

        let doorWidth = 200;
        let doorSpace = Math.floor((1024 - (doorWidth * 4)) / 5);

        let x = 100 + doorSpace;
        let y = 352;

        for (let i = 1; i <= 4; i++)
        {
            this.doors.push(new Door('Door' + i, this, x, y))

            x += doorWidth + doorSpace;
        }
    }

    addGold (x, y)
    {
        let target = this.goals[this.goalsComplete];

        let gold = this.gold.get(x + 50, y + 100);

        gold.setActive(true).setVisible(true);

        this.sound.play('money');

        this.tweens.add({
            targets: gold,
            x: target.x,
            y: target.y,
            duration: 600,
            ease: 'Quad.easeOut',
            onComplete: () => {
                target.setVisible(false);
            }
        });

        this.goalsComplete++;

        if (this.goalsComplete === 12)
        {
            this.levelComplete();
        }
    }

    addHat (x, y, stackPosition)
    {
        y = 180 + (30 * (5 - stackPosition));

        let hat = this.hats.get(x, y);

        hat.setActive(true).setVisible(true);
        hat.setScale(1).setAlpha(1);

        const destX = Phaser.Math.RND.between(x - 400, x + 400);
        const destY = y - 400;

        this.tweens.add({
            targets: hat,
            x: destX,
            y: destY,
            angle: 960,
            duration: 1000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                hat.setActive(false);
                hat.setVisible(false);
            }
        });
    }

    levelFail ()
    {
        this.isPaused = true;

        this.sign = this.add.image(512, -200, 'assets', 'gameOver');

        this.sound.play('gameOver');

        this.tweens.add({
            targets: this.sign,
            y: 384,
            ease: 'Bounce.easeOut',
            duration: 1500,
            onComplete: () => {
                this.input.once('pointerdown', () => this.scene.start('MainMenu'));
            }
        });
    }

    levelComplete ()
    {
        this.isPaused = true;

        this.sign = this.add.image(512, -200, 'assets', 'levelComplete');

        this.sound.play('levelComplete');

        this.tweens.add({
            targets: this.sign,
            y: 384,
            ease: 'Bounce.easeOut',
            duration: 1500,
            onComplete: () => {
                this.input.once('pointerdown', () => this.nextLevel());
            }
        });
    }

    nextLevel ()
    {
        this.goals.forEach((goal, index) => {
            goal.setFrame((index + 1).toString());
            goal.setVisible(true);
        });

        this.gold.getChildren().forEach((gold) => {
            gold.setVisible(false);
            gold.setActive(false);
        });

        //  Reset everything
        this.doors.forEach((door) => {
            door.reset(this.game.getTime());
        });

        this.goalsComplete = 0;

        //  Change difficulty

        if (this.level < 5)
        {
            this.killDelay -= 0.1;
        }

        if (this.level < 10)
        {
            this.closeDurationLow -= 100;
            this.closeDurationHigh -= 200;
        }

        //  Change level counter
        this.level++;

        this.levelImage.setFrame(this.level);

        this.sign.setVisible(false);

        this.isPaused = false;
    }

    killed (x, y)
    {
        //  Bullet holes on the screen

        let offsetX = 100;

        for (let i = 0; i < 3; i++)
        {
            let x = Phaser.Math.RND.between(offsetX, offsetX + 200);
            let y = Phaser.Math.RND.between(200, 600);

            let hole = this.add.image(x, y, 'bulletHole').setAlpha(0);

            this.tweens.add({
                targets: hole,
                alpha: 1,
                duration: 30,
                delay: 200 * i
            });

            offsetX += 340;
        }

        this.levelFail();
    }

    update (time)
    {
        if (!this.isPaused)
        {
            this.doors.forEach((door) => {
                door.update(time);
            });
        }
    }
}
