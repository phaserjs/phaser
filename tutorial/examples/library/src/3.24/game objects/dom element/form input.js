var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    dom: {
        createContainer: true
    },
    scene: {
        preload: preload,
        create: create
    }
};

var element;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.html('nameform', 'assets/text/loginform.html');
    this.load.image('pic', 'assets/pics/turkey-1985086.jpg');
}

function create ()
{
    this.add.image(400, 300, 'pic');

    var text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});

    var element = this.add.dom(400, 600).createFromCache('nameform');

    element.setPerspective(800);

    element.addListener('click');

    element.on('click', function (event) {

        if (event.target.name === 'loginButton')
        {
            var inputUsername = this.getChildByName('username');
            var inputPassword = this.getChildByName('password');

            //  Have they entered anything?
            if (inputUsername.value !== '' && inputPassword.value !== '')
            {
                //  Turn off the click events
                this.removeListener('click');

                //  Tween the login form out
                this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });

                this.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 3000, ease: 'Power3',
                    onComplete: function ()
                    {
                        element.setVisible(false);
                    }
                });

                //  Populate the text with whatever they typed in as the username!
                text.setText('Welcome ' + inputUsername.value);
            }
            else
            {
                //  Flash the prompt
                this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
            }
        }

    });
 
    this.tweens.add({
        targets: element,
        y: 300,
        duration: 3000,
        ease: 'Power3'
    });
}
