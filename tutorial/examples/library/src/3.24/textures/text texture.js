var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

function create() {
    var text = this.make.text({
        add: false,
        x: 0,
        y: 0,
        text: 'Phaser',
        style: {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#ff00ff'
        }
    });
    var texture = this.textures.addCanvas('text', text.canvas);
    
    this.add.particles('text').createEmitter({
        alpha: { start: 1, end: 0 },
        speed: { min: 60, max: 60 },
        blendMode: 'ADD',
        x: 300,
        y: 300,
        lifespan: { min: 1000, max: 2000 }
    });
}

function update() {

}
