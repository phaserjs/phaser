// mods by Patrick OReilly 
// Twitter: @pato_reilly Web: http://patricko.byethost9.com

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('matching', 'assets/maps/phaser_tiles.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tiles', 'assets/tiles/phaser_tiles.png', 100, 100, -1, 1, 1);

}

var timeCheck = 0;
var flipFlag = false;

var startList = new Array();
var squareList = new Array();

var masterCounter = 0;
var squareCounter = 0;
var square1Num;
var square2Num;
var savedSquareX1;
var savedSquareY1;
var savedSquareX2;
var savedSquareY2;

var map;
var tileset;
var layer;

var marker;
var currentTile;
var currentTilePosition;

var tileBack = 25;
var timesUp = '+';
var youWin = '+';

function create() {

    map = game.add.tilemap('matching');

    tileset = game.add.tileset('tiles');

    layer = game.add.tilemapLayer(0, 0, 600, 600, tileset, map, 0);

    marker = game.add.graphics();
    marker.lineStyle(2, 0x00FF00, 1);
    marker.drawRect(0, 0, 100, 100);

    randomizeTiles();

}

function update() {

    countDownTimer();

    if (layer.getTileX(game.input.activePointer.worldX) <= 5) // to prevent the marker from going out of bounds
    {
        marker.x = layer.getTileX(game.input.activePointer.worldX) * 100;
        marker.y = layer.getTileY(game.input.activePointer.worldY) * 100;
    }

    if (flipFlag == true)
    {
        if (game.time.now - timeCheck > 1000)
        {
            flipBack();
        }
    }
    else
    {
        processClick();
    }

}

function countDownTimer() {

    var timeLimit = 120;

    myTime = game.time.now;
    mySeconds = parseInt(myTime / 1000);
    myCountdownSeconds = timeLimit - mySeconds;

    if (myCountdownSeconds <= 0)
    {
        // time is up
        timesUp = 'Time is up!';
    }

}

function processClick() {

    currentTile = map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y));
    currentTilePosition = ((layer.getTileY(game.input.activePointer.worldY) + 1) * 6) - (6 - (layer.getTileX(game.input.activePointer.worldX) + 1));

    if (game.input.mousePointer.isDown)
    {
        // check to make sure the tile is not already flipped
        if (currentTile == tileBack)
        {
            // get the corresponding item out of squareList
            currentNum = squareList[currentTilePosition - 1];
            flipOver();
            squareCounter++;

            // is the second tile of pair flipped?
            if (squareCounter == 2)
            {
                // reset squareCounter
                squareCounter = 0;
                square2Num = currentNum;

                // check for match
                if (square1Num == square2Num)
                {
                    masterCounter++;

                    if (masterCounter == 18)
                    {
                        // go "win"
                        youWin = 'Got them all!';
                    }
                }
                else
                {
                    savedSquareX2 = layer.getTileX(marker.x);
                    savedSquareY2 = layer.getTileY(marker.y);
                    flipFlag = true;
                    timeCheck = game.time.now;
                }
            }
            else
            {
                savedSquareX1 = layer.getTileX(marker.x);
                savedSquareY1 = layer.getTileY(marker.y);
                square1Num = currentNum;
            }
        }
    }
}

function flipOver() {

    map.putTile(currentNum, layer.getTileX(marker.x), layer.getTileY(marker.y));
}

function flipBack() {

    flipFlag = false;

    map.putTile(tileBack, savedSquareX1, savedSquareY1);
    map.putTile(tileBack, savedSquareX2, savedSquareY2);

}

function randomizeTiles() {

    for (num = 1; num <= 18; num++)
    {
        startList.push(num);
    }
    
    for (num = 1; num <= 18; num++)
    {
        startList.push(num);
    }

    // for debugging
    myString1 = startList.toString();

    // randomize squareList
    for (i = 1; i <= 36; i++)
    {
        randomPosition = game.rnd.integerInRange(0, startList.length);

        thisNumber = startList[randomPosition];

        squareList.push(thisNumber);

        a = startList.indexOf(thisNumber);

        startList.splice(a, 1);
    }

    // for debugging
    myString2 = squareList.toString();

    for (col = 0; col < 6; col++)
    {
        for (row = 0; row < 6; row++)
        {
            map.putTile(tileBack, col, row);
        }
    }
}

function getHiddenTile() {

    thisTile = squareList[currentTilePosition - 1];
    return thisTile;
}

function render() {

    game.debug.renderText(timesUp, 620, 208, 'rgb(0,255,0)');
    game.debug.renderText(youWin, 620, 240, 'rgb(0,255,0)');

    game.debug.renderText('Time: ' + myCountdownSeconds, 620, 15, 'rgb(0,255,0)');
    game.debug.renderText('Matched Pairs: ' + masterCounter, 620, 304, 'rgb(0,0,255)');
    game.debug.renderText('Tile: ' + map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y)), 620, 48, 'rgb(255,0,0)');

    game.debug.renderText('LayerX: ' + layer.getTileX(marker.x), 620, 80, 'rgb(255,0,0)');
    game.debug.renderText('LayerY: ' + layer.getTileY(marker.y), 620, 112, 'rgb(255,0,0)');

    game.debug.renderText('Tile Position: ' + currentTilePosition, 620, 144, 'rgb(255,0,0)');
    game.debug.renderText('Hidden Tile: ' + getHiddenTile(), 620, 176, 'rgb(255,0,0)');

}
