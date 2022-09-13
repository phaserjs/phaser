var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d6b2d',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite;
var healthGroup;
var text;
var cursors;
var currentHealth = 100;
var maxHealth = 100;
var timedEvent;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('cat', 'assets/sprites/orange-cat1.png');
    this.load.image('health', 'assets/sprites/firstaid.png');
}

function create ()
{
    sprite = this.physics.add.image(400, 300, 'cat');

    sprite.setCollideWorldBounds(true);

    //  Create 10 random health pick-ups
    healthGroup = this.physics.add.staticGroup({
        key: 'health',
        frameQuantity: 10,
        immovable: true
    });

    var children = healthGroup.getChildren();

    for (var i = 0; i < children.length; i++)
    {
        var x = Phaser.Math.Between(50, 750);
        var y = Phaser.Math.Between(50, 550);

        children[i].setPosition(x, y);
    }

    healthGroup.refresh();

    //  So we can see how much health we have left
    text = this.add.text(10, 10, 'Health: 100', { font: '32px Courier', fill: '#000000' });

    //  Cursors to move
    cursors = this.input.keyboard.createCursorKeys();

    //  When the player sprite his the health packs, call this function ...
    this.physics.add.overlap(sprite, healthGroup, spriteHitHealth);

    //  Decrease the health by calling reduceHealth every 50ms
    timedEvent = this.time.addEvent({ delay: 50, callback: reduceHealth, callbackScope: this, loop: true });
}

function reduceHealth ()
{
    currentHealth--;

    if (currentHealth === 0)
    {
        //  Uh oh, we're dead
        sprite.body.reset(400, 300);

        text.setText('Health: RIP');

        //  Stop the timer
        timedEvent.remove();
    }
}

function spriteHitHealth (sprite, health)
{
    //  Hide the sprite
    healthGroup.killAndHide(health);

    //  And disable the body
    health.body.enable = false;

    //  Add 10 health, it'll never go over maxHealth
    currentHealth = Phaser.Math.MaxAdd(currentHealth, 10, maxHealth);
}

function update ()
{
    if (currentHealth === 0)
    {
        return;
    }

    text.setText('Health: ' + currentHealth);

    sprite.setVelocity(0);

    if (cursors.left.isDown)
    {
        sprite.setVelocityX(-200);
    }
    else if (cursors.right.isDown)
    {
        sprite.setVelocityX(200);
    }

    if (cursors.up.isDown)
    {
        sprite.setVelocityY(-200);
    }
    else if (cursors.down.isDown)
    {
        sprite.setVelocityY(200);
    }
}
