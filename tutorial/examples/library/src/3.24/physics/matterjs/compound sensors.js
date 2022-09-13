var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                y: 0
            },
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('platform', 'assets/sprites/platform.png');
}

function create ()
{
    var Bodies = Phaser.Physics.Matter.Matter.Bodies;

    var rect = Bodies.rectangle(0, 0, 98, 98);
    var circleA = Bodies.circle(-70, 0, 24, { isSensor: true, label: 'left' });
    var circleB = Bodies.circle(70, 0, 24, { isSensor: true, label: 'right' });
    var circleC = Bodies.circle(0, -70, 24, { isSensor: true, label: 'top' });
    var circleD = Bodies.circle(0, 70, 24, { isSensor: true, label: 'bottom' });

    var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
        parts: [ rect, circleA, circleB, circleC, circleD ],
        inertia: Infinity
    });

    player = this.matter.add.image(0, 0, 'block');

    player.setExistingBody(compoundBody);
    player.setPosition(100, 300);

    var testA = this.matter.add.image(400, 150, 'block').setStatic(true);
    var testB = this.matter.add.image(600, 450, 'block').setStatic(true);
    var testC = this.matter.add.image(200, 550, 'block').setStatic(true);

    this.matter.world.on('collisionstart', function (event) {

        //  Loop through all of the collision pairs
        var pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++)
        {
            var bodyA = pairs[i].bodyA;
            var bodyB = pairs[i].bodyB;

            //  We only want sensor collisions
            if (pairs[i].isSensor)
            {
                var blockBody;
                var playerBody;

                if (bodyA.isSensor)
                {
                    blockBody = bodyB;
                    playerBody = bodyA;
                }
                else if (bodyB.isSensor)
                {
                    blockBody = bodyA;
                    playerBody = bodyB;
                }

                //  You can get to the Sprite via `gameObject` property
                var playerSprite = playerBody.gameObject;
                var blockSprite = blockBody.gameObject;

                var color;

                if (playerBody.label === 'left')
                {
                    color = 0xff0000;
                }
                else if (playerBody.label === 'right')
                {
                    color = 0x00ff00;
                }
                else if (playerBody.label === 'top')
                {
                    color = 0x0000ff;
                }
                else if (playerBody.label === 'bottom')
                {
                    color = 0xffff00;
                }

                blockSprite.setTintFill(color);
            }
        }

    });

    cursors = this.input.keyboard.createCursorKeys();

    this.add.text(10, 10, 'Move with cursor keys. Hit blocks with sensors.', { font: '16px Courier', fill: '#ffffff' });
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-10);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(10);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-10);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(10);
    }
    else
    {
        player.setVelocityY(0);
    }
}
