export default class MainGame extends Phaser.Scene
{
    constructor ()
    {
        super('MainGame');

        this.emojis;

        this.circle1;
        this.circle2;

        this.child1;
        this.child2;

        this.selectedEmoji = null;
        this.matched = false;

        this.score = 0;
        this.highscore = 0;
        this.scoreText;

        this.timer;
        this.timerText;
    }

    create ()
    {
        this.add.image(400, 300, 'background');

        this.circle1 = this.add.circle(0, 0, 42).setStrokeStyle(3, 0xf8960e);
        this.circle2 = this.add.circle(0, 0, 42).setStrokeStyle(3, 0x00ff00);

        this.circle1.setVisible(false);
        this.circle2.setVisible(false);

        //  Create a 4x4 grid aligned group to hold our sprites

        this.emojis = this.add.group({
            key: 'emojis',
            frameQuantity: 1,
            repeat: 15,
            gridAlign: {
                width: 4,
                height: 4,
                cellWidth: 90,
                cellHeight: 90,
                x: 280,
                y: 200
            }
        });

        const fontStyle = {
            fontFamily: 'Arial',
            fontSize: 48,
            color: '#ffffff',
            fontStyle: 'bold',
            padding: 16,
            shadow: {
                color: '#000000',
                fill: true,
                offsetX: 2,
                offsetY: 2,
                blur: 4
            }
        };

        this.timerText = this.add.text(20, 20, '30:00', fontStyle);
        this.scoreText = this.add.text(530, 20, 'Found: 0', fontStyle);

        let children = this.emojis.getChildren();

        children.forEach((child) => {

            child.setInteractive();

        });

        this.input.on('gameobjectdown', this.selectEmoji, this);
        this.input.once('pointerdown', this.start, this);

        this.highscore = this.registry.get('highscore');

        this.arrangeGrid();
    }

    start ()
    {
        this.score = 0;
        this.matched = false;

        this.timer = this.time.addEvent({ delay: 30000, callback: this.gameOver, callbackScope: this });

        this.sound.play('countdown', { delay: 27 });
    }

    selectEmoji (pointer, emoji)
    {
        if (this.matched)
        {
            return;
        }

        //  Is this the first or second selection?
        if (!this.selectedEmoji)
        {
            //  Our first emoji
            this.circle1.setPosition(emoji.x, emoji.y);
            this.circle1.setVisible(true);

            this.selectedEmoji = emoji;
        }
        else if (emoji !== this.selectedEmoji)
        {
            //  Our second emoji

            //  Is it a match?
            if (emoji.frame.name === this.selectedEmoji.frame.name)
            {
                this.circle1.setStrokeStyle(3, 0x00ff00);
                this.circle2.setPosition(emoji.x, emoji.y);
                this.circle2.setVisible(true);

                this.tweens.add({
                    targets: [ this.child1, this.child2 ],
                    scale: 1.4,
                    angle: '-=30',
                    yoyo: true,
                    ease: 'sine.inout',
                    duration: 200,
                    completeDelay: 200,
                    onComplete: () => this.newRound()
                });
        
                this.sound.play('match');
            }
            else
            {
                this.circle1.setPosition(emoji.x, emoji.y);
                this.circle1.setVisible(true);

                this.selectedEmoji = emoji;
            }
        }
    }

    newRound ()
    {
        this.matched = false;

        this.score++;

        this.scoreText.setText('Found: ' + this.score);

        this.circle1.setStrokeStyle(3, 0xf8960e);

        this.circle1.setVisible(false);
        this.circle2.setVisible(false);

        //  Stagger tween them all out
        this.tweens.add({
            targets: this.emojis.getChildren(),
            scale: 0,
            ease: 'power2',
            duration: 600,
            delay: this.tweens.stagger(100, { grid: [ 4, 4 ], from: 'center' }),
            onComplete: () => this.arrangeGrid()
        });
    }

    arrangeGrid ()
    {
        //  We need to make sure there is only one pair in the grid
        //  Let's create an array with all possible frames in it:

        let frames = Phaser.Utils.Array.NumberArray(1, 40);
        let selected = Phaser.Utils.Array.NumberArray(0, 15);
        let children = this.emojis.getChildren();

        //  Now we pick 16 random values, removing each one from the array so we can't pick it again
        //  and set those into the sprites

        for (let i = 0; i < 16; i++)
        {
            let frame = Phaser.Utils.Array.RemoveRandomElement(frames);

            children[i].setFrame('smile' + frame);
        }

        //  Finally, pick two random children and make them a pair:
        let index1 = Phaser.Utils.Array.RemoveRandomElement(selected);
        let index2 = Phaser.Utils.Array.RemoveRandomElement(selected);

        this.child1 = children[index1];
        this.child2 = children[index2];

        //  Set the frame to match
        this.child2.setFrame(this.child1.frame.name);

        console.log('Pair: ', index1, index2);

        //  Clear the currently selected emojis (if any)
        this.selectedEmoji = null;

        //  Stagger tween them all in
        this.tweens.add({
            targets: children,
            scale: { start: 0, from: 0, to: 1 },
            ease: 'bounce.out',
            duration: 600,
            delay: this.tweens.stagger(100, { grid: [ 4, 4 ], from: 'center' })
        });
    }

    update ()
    {
        if (this.timer)
        {
            if (this.timer.getProgress() === 1)
            {
                this.timerText.setText('00:00');
            }
            else
            {
                const remaining = (30 - this.timer.getElapsedSeconds()).toPrecision(4);
                const pos = remaining.indexOf('.');

                let seconds = remaining.substring(0, pos);
                let ms = remaining.substr(pos + 1, 2);

                seconds = Phaser.Utils.String.Pad(seconds, 2, '0', 1);

                this.timerText.setText(seconds + ':' + ms);
            }
        }
    }

    gameOver ()
    {
        //  Show them where the match actually was
        this.circle1.setStrokeStyle(4, 0xfc29a6).setPosition(this.child1.x, this.child1.y).setVisible(true);
        this.circle2.setStrokeStyle(4, 0xfc29a6).setPosition(this.child2.x, this.child2.y).setVisible(true);

        this.input.off('gameobjectdown', this.selectEmoji, this);

        console.log(this.score, this.highscore);

        if (this.score > this.highscore)
        {
            console.log('high set');

            this.registry.set('highscore', this.score);
        }

        this.tweens.add({
            targets: [ this.circle1, this.circle2 ],
            alpha: 0,
            yoyo: true,
            repeat: 2,
            duration: 250,
            ease: 'sine.inout',
            onComplete: () => {

                this.input.once('pointerdown', () => {
                    this.scene.start('MainMenu');
                }, this);

            }
        });
    }
}
