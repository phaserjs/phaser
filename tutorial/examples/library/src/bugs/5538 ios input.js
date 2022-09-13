class Example extends Phaser.Scene {
    constructor() {
        super({ key: 'Example' });
    }
    create() {
        let textbutton = this.add.text(50, 50, "Text", { font: '64px Courier' });
        textbutton.setInteractive();
        let self = this;
        let x = 0;
        textbutton.on('pointerup', function (event) {
            self.add.text(100, 100 + 50 * x, "inserted", { font: '64px Courier' });
            x++;
            // el.destroy()    //does not cause the issue either
        });
        var div = document.createElement('div');
        div.setAttribute("style", "color: white; font: 48px Arial;");
        div.innerText = "DOM Element";
        let el = this.add.dom(500, 80, div);
        //after the following event handler is called, the event handler for "textbutton" above does not get called any further
        div.addEventListener('pointerup', function (event) {
            textbutton.text = 'boom';
            el.destroy();
            // div.remove() //causes the same issue
        });
        // el.destroy()  //if "el" is destroyed outside of event handler, the issue does not arise
    }
}
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#220000',
    parent: 'phaser-example',
    scene: [Example],
    dom: {
        createContainer: true
    },
};
const game = new Phaser.Game(config);
