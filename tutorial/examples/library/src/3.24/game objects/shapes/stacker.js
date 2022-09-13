var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        init: init,
        preload: preload,
        create: create,
        extend: {
            startGame: startGame,
            moveBlocks: moveBlocks,
            getGridX: getGridX,
            nextRow: nextRow,
            hasBlockBelow: hasBlockBelow,
            drop: drop,
            totalBlocks: totalBlocks,
            gameOver: gameOver,
            gameWon: gameWon
        }
    }
};

var grid;
var gridWidth = 7;
var gridHeight = 15;
var gridSize = 32;

var block1;
var block2;
var block3;

var speed = 250;

var direction = 0;
var currentY = gridHeight;
var timer;

var game = new Phaser.Game(config);

function init ()
{
    var element = document.createElement('style');

    document.head.appendChild(element);

    element.sheet.insertRule('@font-face { font-family: "bebas"; src: url("assets/fonts/ttf/bebas.ttf") format("truetype"); }', 0);
}

function preload ()
{
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
}

function create ()
{
    WebFont.load({
        custom: {
            families: [ 'bebas' ]
        },
        active: this.startGame.bind(this)
    });
}

function startGame ()
{
    this.add.text(400, 32, 'Stacker', { fontFamily: 'bebas', fontSize: 80, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);

    this.add.grid(0, 0, gridWidth * gridSize, gridHeight * gridSize, gridSize, gridSize, 0x999999, 1, 0x666666).setOrigin(0);

    var space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    block1 = this.add.rectangle(gridSize * 2, (currentY - 1) * gridSize, gridSize - 1, gridSize - 1, 0x6666ff).setOrigin(0);
    block2 = this.add.rectangle(gridSize * 3, (currentY - 1) * gridSize, gridSize - 1, gridSize - 1, 0x6666ff).setOrigin(0);
    block3 = this.add.rectangle(gridSize * 4, (currentY - 1) * gridSize, gridSize - 1, gridSize - 1, 0x6666ff).setOrigin(0);

    grid = [];

    for (var y = 0; y < gridHeight; y++)
    {
        grid.push([ 0, 0, 0, 0, 0, 0, 0 ]);
    }

    timer = this.time.addEvent({ delay: speed, callback: this.moveBlocks, callbackScope: this, loop: true });

    this.input.keyboard.on('keydown_SPACE', this.drop, this);
    this.input.on('pointerdown', this.drop, this);
}

function gameOver ()
{

}

function gameWon ()
{
    
}

function getGridX (block)
{
    return Math.ceil(block.x / gridSize);
}

function hasBlockBelow (block)
{
    return (block && grid[currentY][this.getGridX(block)]);
}

function moveBlocks ()
{
    if (direction === 0)
    {
        //  Moving right
        if (block1)
        {
            block1.x += gridSize;

            if (this.getGridX(block1) === gridWidth - 1)
            {
                direction = 1;
            }
        }

        if (block2)
        {
            block2.x += gridSize;

            if (this.getGridX(block2) === gridWidth - 1)
            {
                direction = 1;
            }
        }

        if (block3)
        {
            block3.x += gridSize;

            if (this.getGridX(block3) === gridWidth - 1)
            {
                direction = 1;
            }
        }
    }
    else
    {
        //  Moving left
        if (block1)
        {
            block1.x -= gridSize;

            if (block1 && this.getGridX(block1) === 0)
            {
                direction = 0;
            }
        }

        if (block2)
        {
            block2.x -= gridSize;

            if (block2 && this.getGridX(block2) === 0)
            {
                direction = 0;
            }
        }

        if (block3)
        {
            block3.x -= gridSize;

            if (block3 && this.getGridX(block3) === 0)
            {
                direction = 0;
            }
        }
    }

}

function totalBlocks ()
{
    var total = 0;

    if (block1)
    {
        total++;
    }

    if (block2)
    {
        total++;
    }

    if (block3)
    {
        total++;
    }

    return total;
}

function nextRow ()
{
    currentY--;

    if (currentY === 10 || currentY === 5)
    {
        console.log('GETTING HARDER!', currentY);

        speed -= (currentY === 10) ? 90 : 50;

        //  We also need to remove a block if they've still got the full amount
        if (currentY === 10 && this.totalBlocks() === 3)
        {
            //  3 down to 2
            block1 = null;
        }
        else if (currentY === 5 && this.totalBlocks() === 2)
        {
            //  2 down to 1
            if (block1 && block2 || block1 && block3)
            {
                block1 = null;
            }
            else
            {
                block2 = null;
            }
        }
    }

    //  Pick either left or right to appear from

    var side = 0;
    var shift = gridSize;

    if (Math.random() >= 0.5)
    {
        direction = 1;
        side = (gridWidth - 1) * gridSize;
        shift = -gridSize;
    }
    else
    {
        direction = 0;
    }

    if (block1)
    {
        block1 = this.add.rectangle(side, (currentY - 1) * gridSize, gridSize - 1, gridSize - 1, 0x6666ff).setOrigin(0);
        side += shift;
    }

    if (block2)
    {
        block2 = this.add.rectangle(side, (currentY - 1) * gridSize, gridSize - 1, gridSize - 1, 0x6666ff).setOrigin(0);
        side += shift;
    }

    if (block3)
    {
        block3 = this.add.rectangle(side, (currentY - 1) * gridSize, gridSize - 1, gridSize - 1, 0x6666ff).setOrigin(0);
    }

    timer = this.time.addEvent({ delay: speed, callback: this.moveBlocks, callbackScope: this, loop: true });
}

function drop ()
{
    timer.remove(false);

    var pos1 = (block1) ? this.getGridX(block1) : -1;
    var pos2 = (block2) ? this.getGridX(block2) : -1;
    var pos3 = (block3) ? this.getGridX(block3) : -1;

    // console.log('drop y', currentY, 'pos', pos1, pos2, pos3);

    var mapY = currentY - 1;

    if (currentY === gridHeight)
    {
        //  Is this the first row? If so we just drop and carry on.

        grid[mapY][pos1] = 1;
        grid[mapY][pos2] = 1;
        grid[mapY][pos3] = 1;

        this.nextRow();
    }
    else
    {
        //  Can we drop? First check all 3 blocks. If none of them have anything
        //  below then it's game over.

        if (!this.hasBlockBelow(block1) && !this.hasBlockBelow(block2) && !this.hasBlockBelow(block3))
        {
            this.gameOver();
        }
        else
        {
            //  Drop them one by one
            if (block1)
            {
                if (this.hasBlockBelow(block1))
                {
                    //  There's something below this block, so we're good to carry on
                    grid[mapY][pos1] = 1;
                }
                else
                {
                    //  There's nothing below this block, so they loose it
                    block1.visible = false;
                    block1 = null;
                }
            }

            if (block2)
            {
                if (this.hasBlockBelow(block2))
                {
                    //  There's something below this block, so we're good to carry on
                    grid[mapY][pos2] = 1;
                }
                else
                {
                    //  There's nothing below this block, so they loose it
                    block2.visible = false;
                    block2 = null;
                }
            }

            if (block3)
            {
                if (this.hasBlockBelow(block3))
                {
                    //  There's something below this block, so we're good to carry on
                    grid[mapY][pos3] = 1;
                }
                else
                {
                    //  There's nothing below this block, so they loose it
                    block3.visible = false;
                    block3 = null;
                }
            }

            // console.table(grid);

            if (block1 || block2 || block3)
            {
                if (currentY === 1)
                {
                    this.gameWon();
                }
                else
                {
                    this.nextRow();
                }
            }
            else
            {
                this.gameOver();
            }
        }
    }
}
