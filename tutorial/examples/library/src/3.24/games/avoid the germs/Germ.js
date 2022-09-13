export default class Germ extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y, animation, speed)
    {
        super(scene, x, y, 'assets');

        this.play(animation)

        this.setScale(Phaser.Math.FloatBetween(1, 2));

        this.speed = speed;

        this.alpha = 0;
        this.lifespan = 0;
        this.isChasing = false;

        this.target = new Phaser.Math.Vector2();
    }

    start (chaseDelay)
    {
        this.setCircle(14, 6, 2);

        if (!chaseDelay)
        {
            chaseDelay = Phaser.Math.RND.between(3000, 8000);

            this.scene.sound.play('appear');
        }

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 2000,
            ease: 'Linear',
            hold: chaseDelay,
            onComplete: () => {
                if (this.scene.player.isAlive)
                {
                    this.lifespan = Phaser.Math.RND.between(6000, 12000);
                    this.isChasing = true;
                }
            }
        });

        return this;
    }

    restart (x, y)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
        this.setAlpha(0);

        return this.start();
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.isChasing)
        {
            this.lifespan -= delta;

            if (this.lifespan <= 0)
            {
                this.isChasing = false;

                this.body.stop();

                this.scene.tweens.add({
                    targets: this,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Linear',
                    onComplete: () => {
                        this.setActive(false);
                        this.setVisible(false);
                    }
                });
            }
            else
            {
                this.scene.getPlayer(this.target);
            
                //  Add 90 degrees because the sprite is drawn facing up
                this.rotation = this.scene.physics.moveToObject(this, this.target, this.speed) + 1.5707963267948966;
            }
        }
    }

    stop ()
    {
        this.isChasing = false;

        this.body.stop();
    }
}
