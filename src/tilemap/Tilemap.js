Phaser.Tilemap = function (game, key, x, y, resizeWorld, tileWidth, tileHeight) {

};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Tilemap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Phaser.Tilemap.prototype.constructor = Phaser.Tilemap;

Phaser.Tilemap.CSV = 0;
Phaser.Tilemap.JSON = 1;

