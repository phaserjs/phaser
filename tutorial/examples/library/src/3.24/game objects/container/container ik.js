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

    this.load.image('arrow', 'assets/sprites/arrow.png');
}


function create() 
{
    var lastContainer;
    var count = 40;

    for (var j = 0; j < 4; ++j)
    {
        for (var index = 0; index < count; ++index)
        {
            var image = this.make.image({x: 0, y: 0, key: 'arrow', add: false});
            if (index === 0)
            {
                lastContainer = this.add.container(game.config.width / 2, game.config.height / 2);
                containers.push(lastContainer);
                lastContainer.rotation += (j * 90) * Math.PI / 180;            
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
                    var image = this.make.image({x: 0, y: 0, key: 'arrow', add: false});
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
        rotateContainer(container, 0.02);
    }
}