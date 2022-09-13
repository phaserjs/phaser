var UIText2;

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload () 
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    }

    create () 
    {
        const image = this.add.image(400, 300, 'einstein');

        this.UIText1 = this.add.text(0, 32, '0');
        this.UIText2 = this.add.text(0, 64, '0');
    
        this.cont = this.add.container();
    
        this.cont.add([this.UIText1, this.UIText2]);
    
        //  Add in a new camera, the same size and position as the main camera
        this.UICam = this.cameras.add(0, 0, 800, 600);
    
        //  The main camera will not render the container
        this.cameras.main.ignore(this.cont);
    
        //  The new UI Camera will not render the background image
        this.UICam.ignore(image);
    }

    update () 
    {
        this.UIText1.setText("Main camera rotation: " + this.cameras.main.rotation);
        this.UIText2.setText("Main camera zoom: " + this.cameras.main.zoom);
    
        //wobble the container
        this.cont.y = Math.sin(this.time.now / 100) * 10;
    
        this.cameras.main.setZoom(Math.abs(Math.sin(this.cameras.main.rotation)) * 0.5 + 1);
        this.cameras.main.rotation += 0.01;
    }
}


const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
