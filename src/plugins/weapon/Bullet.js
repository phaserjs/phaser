Phaser.Bullet = function (game, x, y, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.anchor.set(0.5);

    this.data = {
        bulletManager: null,
        fromX: 0,
        fromY: 0,
        bodyDirty: true,
        rotateToVelocity: false,
        killType: 0,
        killDistance: 0
    };

};

Phaser.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.Bullet.prototype.constructor = Phaser.Bullet;

Phaser.Bullet.prototype.kill = function () {

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.data.bulletManager.onKill.dispatch(this);

    return this;

};

Phaser.Bullet.prototype.update = function () {

    if (!this.exists)
    {
        return;
    }

    if (this.data.killType > Phaser.Weapon.KILL_LIFESPAN)
    {
        if (this.data.killType === Phaser.Weapon.KILL_DISTANCE)
        {
            if (this.game.physics.arcade.distanceToXY(this, this.data.fromX, this.data.fromY, true) > this.data.killDistance)
            {
                this.kill();
            }
        }
        else
        {
            if (!this.data.bulletManager.bulletBounds.intersects(this))
            {
                this.kill();
            }
        }
    }
    
    if (this.data.rotateToVelocity)
    {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (this.data.bulletManager.bulletWorldWrap)
    {
        this.game.world.wrap(this, this.data.bulletManager.bulletWorldWrapPadding);
    }

};
