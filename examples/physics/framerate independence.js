var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

// This example pokes around with the internal Phaser time and physics systems
// just to demonstrate collision and physics behaviour with different framerates.
// Doing this in your game is not recommended

function preload() {

    game.load.image('sprite', 'assets/sprites/diamond.png');

}

var sprite, box;

var configurations = [
    {
        framerate: null,
        description: 'Default (as fast as possible)',
        color: 0x999999
    },
    {
        framerate: 120,
        color: 0x0000FF
    },
    {
        framerate: 60,
        color: 0x00FF00
    },
    {
        framerate: 30,
        color: 0x00CCCC
    },
    {
        framerate: 11,
        color: 0xFF0000
    },
    {
        framerate: 7,
        color: 0xCC00CC
    },
    {
        framerate: 5,
        color: 0xCCCC00
    },
    {
        framerate: function() { return Math.random() * 30 + 30; },
        description: 'Jittered 30-60hz',
        color: 0x333399
    },
    {
        framerate: function() { return Math.random() * 119 + 1; },
        description: 'Jittered 1-120hz',
        color: 0x339933
    }

];

var configurationIndex = 0;
var currentConfiguration = configurations[0];

var floor = game.height - 40;

// Here we keep a copy of the original framerate update method
Phaser.Time.prototype.originalUpdate = Phaser.Time.prototype.update;

// And replace it with one that overrides the framerate
Phaser.Time.prototype.update = function (time) {

    this.originalUpdate(time);

    if(currentConfiguration.framerate)
    {
        if(typeof(currentConfiguration.framerate) == 'function')
        {
            this.physicsElapsed = 1.0 / currentConfiguration.framerate();
        } else {
            this.physicsElapsed = 1.0 / currentConfiguration.framerate;
        }
    }
};

function resetSprite()
{
    sprite.body.x = 40;
    sprite.body.y = floor;
    sprite.body.velocity.x = 300;
    sprite.body.velocity.y = -900;
    sprite.body.gravity.y = 20;
    
};

function create() {

    sprite = game.add.sprite(40, floor, 'sprite');
    sprite.body.bounce.y = 0.5;
    resetSprite();

    for(var i = 0; i < configurations.length; i++)
    {
        configurations[i].graphics = game.add.graphics(0, 0);
        configurations[i].points = [];
    }

    box = game.add.sprite(450, floor - 40, 'missing');
    box.width = 100;
    box.body.immovable = true;
};

function update() {

    game.physics.collide(sprite, box);

    currentConfiguration.points.push([sprite.center.x, sprite.center.y]);

    if(sprite.body.velocity.y > 0 && sprite.body.y > floor)
    {
        currentConfiguration.graphics.clear();
        currentConfiguration.graphics.lineStyle(1, currentConfiguration.color, 1)
        currentConfiguration.graphics.moveTo(currentConfiguration.points[0][0], currentConfiguration.points[0][1]);

        for(var i = 1; i < currentConfiguration.points.length; i++)
        {
            currentConfiguration.graphics.lineTo(currentConfiguration.points[i][0], currentConfiguration.points[i][1]);          
        }

        currentConfiguration.points.length = 0;

        configurationIndex = (configurationIndex + 1) % configurations.length;
        currentConfiguration = configurations[configurationIndex];

        resetSprite();
    }
};

function render() {
    game.debug.text("Framerate: " + (currentConfiguration.description || (currentConfiguration.framerate + 'hz')), 10, 40);
};