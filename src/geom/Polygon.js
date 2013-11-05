Phaser.Polygon = function (points) {

    PIXI.Polygon.call(this, points);

    /**
	* @property {Description} type - Description.
	*/
    this.type = Phaser.POLYGON;

};

Phaser.Polygon.prototype = Object.create(PIXI.Polygon.prototype);
Phaser.Polygon.prototype.constructor = Phaser.Polygon;