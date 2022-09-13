var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var containers = [];
var containerTails = [];
var game = new Phaser.Game(config);

function preload() {

    this.load.image('backdrop', 'assets/pics/platformer-backdrop.png');
    this.load.image('arrow', 'assets/sprites/arrow.png');
    this.load.image('mask', 'assets/pics/mask.png');
    this.load.image('bunny', 'assets/sprites/bunny.png');
}


function create() 
{
    var backdrop = this.make.image({
        x: game.config.width / 2,
        y: game.config.height / 2,
        key: 'backdrop',
        add: true
    }).setScale(3);

    var maskImage = this.make.image({
        x: game.config.width / 2,
        y: game.config.height / 2,
        key: 'mask',
        add: false
    }).setScale(2);
    var lastContainer;
    var count = 40;

    var bunny = this.make.sprite({
        x: game.config.width / 2, 
        y: game.config.height / 2, 
        key: 'bunny',
        add: true
    });


    this.rootContainer = this.make.container({x: game.config.width / 2, y: game.config.height / 2, add: false });

    bunny.mask = new Phaser.Display.Masks.BitmapMask(this, this.rootContainer);


    for (var j = 0; j < 4; ++j)
    {
        for (var index = 0; index < count; ++index)
        {
            var image = this.make.image({x: 0, y: 0, key: 'arrow', add: false});
            if (index === 0)
            {
                lastContainer = this.make.container({x:0, y:0, add:false});
                containers.push(lastContainer);
                lastContainer.rotation += (j * 90) * Math.PI / 180;
                this.rootContainer.add(lastContainer);
            }
            else
            {
                var newContainer = this.make.container({x: image.width, y: 0, add: false});
                lastContainer.add(newContainer);
                lastContainer = newContainer;
                newContainer.setScale(1.0 - index / (count))
                newContainer.rotation = index / count * 2;
            }
            image.setOrigin(0, 0.5);
            lastContainer.add(image);

            if (index === 5 || index === 4 || index === 10)
            {
                var leafContainer = lastContainer;
                var direction = index === 5 ? 1 : -1;
                for (var k = 0; k < 10; ++k)
                {
                    var image = this.make.image({x: 0, y: 0, key: 'arrow', add: false})
                    var newContainer = this.make.container({x: image.width, y: 0, add: false});
                    leafContainer.add(newContainer);
                    leafContainer = newContainer;
                    leafContainer.setScale(1.0 - k / 10);
                    leafContainer.rotation = 0.1 * direction;
                    image.setOrigin(0, 0.5);
                    leafContainer.add(image);
                }
            }

            if (index === count - 1) containerTails.push(lastContainer);
        }
    }

    var move = false;

    this.input.on('pointerdown', function (pointer) {
        move = true;
    });
    this.input.on('pointerup', function (pointer) {
        move = false;
    });

    this.input.on('pointermove', function (pointer) {

        if (move)
        {
            bunny.x = pointer.x;
            bunny.y = pointer.y;
        }

    });

}

function rotateContainer(container, rotation)
{
    if (container)
    {
        container.rotation += rotation;
        rotateContainer(container.parentContainer, rotation);
    }
}

function update() {
    for (var index = 0; index < containerTails.length; ++index)
    {
        var container = containerTails[index];
        rotateContainer(container, 0.01);
    }
    this.rootContainer.rotation += 0.01;
}