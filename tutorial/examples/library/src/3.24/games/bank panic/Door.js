export default class Door extends Phaser.GameObjects.Container
{
    constructor (name, scene, x, y)
    {
        super(scene, x, y);

        this.name = name;

        this.background = scene.add.image(0, 0, 'assets', 'doorBackground');
        this.door = scene.add.sprite(0, 0, 'assets', 'door1');
        this.character = scene.add.image(0, 0, 'assets', 'bandit1');
        this.characterFrame = 'bandit1';

        this.isOpen = false;
        this.isBandit = false;
        this.isHats = false;
        this.isDead = false;
        this.wasBandit = (scene.doors.length % 2) ? true : false;

        this.hats = 0;
        this.timeToOpen = Number.MAX_SAFE_INTEGER;
        this.timeToClose = Number.MAX_SAFE_INTEGER;
        this.timeToKill = 0;

        this.characters = [
            'bandit1',
            'bandit2',
            'cowboy1',
            'cowboy2',
            'hat'
        ];

        this.add([ this.background, this.character, this.door ]);

        this.setSize(200, 400);
        this.setInteractive();

        this.on('pointerup', this.shoot, this);

        scene.add.existing(this);
    }

    destroy ()
    {
        this.off('pointerup');
    }

    start (time)
    {
        this.timeToOpen = time + Phaser.Math.RND.between(500, 4000);
    }

    reset (time)
    {
        this.isOpen = false;
        this.isBandit = false;
        this.isHats = false;
        this.isDead = false;

        this.door.play('doorClose');

        this.timeToOpen = time + Phaser.Math.RND.between(500, 4000);
    }

    openDoor (time)
    {
        this.isOpen = true;
        this.isBandit = false;
        this.isHats = false;
        this.isDead = false;

        this.characterFrame = Phaser.Utils.Array.GetRandom(this.characters);

        //  When should this door close again?
        const duration = Phaser.Math.RND.between(this.scene.closeDurationLow, this.scene.closeDurationHigh);

        this.timeToClose = time + duration;

        if (this.characterFrame === 'bandit1' || this.characterFrame === 'bandit2')
        {
            this.isBandit = true;
        }
        else if (this.characterFrame === 'hat')
        {
            this.isHats = true;

            //  Pick random number of hats
            this.hats = Phaser.Math.RND.between(2, 5);

            this.characterFrame += this.hats.toString();
        }
        else
        {
            this.timeToClose = time + (duration / 2);
        }

        //  If we had a citizen or hats on our last go, we have to have a bandit now
        if (!this.wasBandit && !this.isBandit)
        {
            this.isHats = false;
            this.hats = 0;
            this.isBandit = true;
            this.characterFrame = (Math.random() > 0.5) ? 'bandit1' : 'bandit2';
            this.timeToClose = time + duration;
        }

        this.character.setFrame(this.characterFrame);
        this.character.setScale(1).setAlpha(1);

        if (this.isBandit)
        {
            this.timeToKill = time + (duration * this.scene.killDelay);
        }

        this.scene.sound.play('door');

        this.door.play('doorOpen');
    }

    closeDoor (time)
    {
        this.door.play('doorClose');

        this.isOpen = false;
        this.wasBandit = this.isBandit;

        if (!this.isBandit && !this.isHats && !this.isDead)
        {
            this.scene.addGold(this.x, this.y);
        }

        //  When should this door open again?
        this.timeToOpen = time + Phaser.Math.RND.between(2000, 4000);
    }

    shoot ()
    {
        if (!this.isOpen || this.scene.isPaused)
        {
            return;
        }

        this.scene.sound.play('shot');

        if (this.isDead)
        {
            //  We will want to hear the gunshot, but not actually do anything with it
            return;
        }

        if (this.isBandit)
        {
            this.shootCharacter(true);
        }
        else
        {
            if (this.isHats)
            {
                this.shootHat();
            }
            else
            {
                this.shootCharacter(false);
            }
        }
    }

    shootCharacter (closeDoor)
    {
        this.isDead = true;

        this.characterFrame += 'Dead';

        this.character.setFrame(this.characterFrame);

        this.scene.sound.play('scream' + Phaser.Math.RND.between(1, 3));

        this.scene.tweens.add({
            targets: this.character,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 300,
            onComplete: () => {
                if (closeDoor)
                {
                    this.closeDoor(this.scene.game.getTime());
                }
                else
                {
                    this.scene.levelFail();
                }
            }
        });

        //  No more shots at this door
        if (!closeDoor)
        {
            this.off('pointerup');
            this.scene.isPaused = true;
        }
    }

    shootHat ()
    {
        if (this.hats > 0)
        {
            this.scene.addHat(this.x, this.y, this.hats);

            this.hats--;

            this.characterFrame = 'hat' + this.hats;
        }

        this.character.setFrame(this.characterFrame);
    }

    shootYou ()
    {
        this.off('pointerup');

        this.scene.isPaused = true;

        //  Shots

        let shot1 = this.scene.add.image(this.x, this.y, 'assets', this.characterFrame + 'shot1');
        let shot2 = this.scene.add.image(this.x, this.y, 'assets', this.characterFrame + 'shot2');

        this.scene.sound.play('banditShot');
        this.scene.sound.play('banditShot', { delay: 0.25 });
        this.scene.sound.play('banditShot', { delay: 0.5 });

        this.scene.tweens.add({
            targets: shot1,
            alpha: 0,
            duration: 200,
            ease: 'Power2'
        });

        this.scene.tweens.add({
            targets: shot2,
            alpha: 0,
            duration: 200,
            delay: 200,
            ease: 'Power2',
            onComplete: () => {
                this.scene.killed(this.x, this.y);
            }
        });

        //  Gun smoke rising from the bandit

        let smoke1 = this.scene.add.image(this.x, this.y, 'assets', this.characterFrame + 'smoke1');
        let smoke2 = this.scene.add.image(this.x, this.y, 'assets', this.characterFrame + 'smoke2');

        this.scene.tweens.add({
            targets: smoke1,
            props: {
                y: { value: 150, duration: 1000, ease: 'Sine.easeInOut' },
                alpha: { value: 0, duration: 250, ease: 'Power2', delay: 750 }
            }
        });

        this.scene.tweens.add({
            targets: smoke2,
            props: {
                y: { value: 150, duration: 1000, ease: 'Sine.easeInOut', delay: 500 },
                alpha: { value: 0, duration: 250, ease: 'Power2', delay: 1250 }
            }
        });
    }

    update (time)
    {
        if (!this.isOpen && time >= this.timeToOpen)
        {
            this.openDoor(time);
        }
        else if (this.isOpen && time >= this.timeToClose)
        {
            this.closeDoor(time);
        }
        else if (this.isOpen && this.isBandit && !this.isDead && time >= this.timeToKill)
        {
            this.shootYou();
        }
    }
}
