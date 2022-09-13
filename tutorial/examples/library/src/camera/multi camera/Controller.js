class Controller extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'Controller', active: true });
        this.camera1;
        this.camera2;
        this.camera3;
        this.camera4;
    }

    create ()
    {
        this.camera1 = this.scene.get('DemoA').cameras.main;
        this.camera2 = this.scene.get('DemoB').cameras.main;
        this.camera3 = this.scene.get('DemoC').cameras.main;
        this.camera4 = this.scene.get('DemoD').cameras.main;

        this.run();
    }

    run ()
    {
        this.slideLeft(2000, 3000);
        this.slideUp(2000, 6000);
        this.slideRight(2000, 9000);
        this.slideCenter(2000, 12000);
        this.slideTopLeft(2000, 16000);
        this.zoomOut(2000, 20000);
        this.exchange1(2000, 23000);
        this.exchange2(2000, 26000);
        this.exchange3(2000, 29000);
        this.zoomIn(2000, 32000);

        this.time.addEvent({ delay: 34000, callback: this.run, callbackScope: this, repeat: -1 });
    }

    slideLeft (speed, delay)
    {
       var tween = this.tweens.add({
            targets: [ this.camera1, this.camera2, this.camera3, this.camera4 ],
            x: '-=800',
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    slideRight(speed, delay)
    {
       var tween = this.tweens.add({
            targets: [ this.camera1, this.camera2, this.camera3, this.camera4 ],
            x: '+=800',
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    slideUp(speed, delay)
    {
       var tween = this.tweens.add({
            targets: [ this.camera1, this.camera2, this.camera3, this.camera4 ],
            y: '-=600',
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    slideDown(speed, delay)
    {
       var tween = this.tweens.add({
            targets: [ this.camera1, this.camera2, this.camera3, this.camera4 ],
            y: '+=600',
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    slideCenter(speed, delay)
    {
       var tween = this.tweens.add({
            targets: [ this.camera1, this.camera2, this.camera3, this.camera4 ],
            x: '-=400',
            y: '+=300',
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    slideTopLeft(speed, delay)
    {
       var tween = this.tweens.add({
            targets: [ this.camera1, this.camera2, this.camera3, this.camera4 ],
            x: '+=400',
            y: '+=300',
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    exchange1(speed, delay)
    {
       var tween = this.tweens.add({
            targets: this.camera1,
            x: 400,
            y: 300,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera4,
            x: 0,
            y: 0,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    exchange2(speed, delay)
    {
       var tween = this.tweens.add({
            targets: this.camera2,
            x: 0,
            y: 300,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera3,
            x: 400,
            y: 0,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    exchange3(speed, delay)
    {
       var tween = this.tweens.add({
            targets: this.camera1,
            x: 0,
            y: 0,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera2,
            x: 400,
            y: 0,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera3,
            x: 0,
            y: 300,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera4,
            x: 400,
            y: 300,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    zoomOut(speed, delay)
    {
       var tween = this.tweens.add({
            targets: this.camera1,
            x: 0,
            y: 0,
            zoom: 0.5,
            width: 400,
            height: 300,
            scrollX: 200,
            scrollY: 150,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera2,
            x: 400,
            y: 0,
            zoom: 0.5,
            width: 400,
            height: 300,
            scrollX: 200,
            scrollY: 150,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera3,
            x: 0,
            y: 300,
            zoom: 0.5,
            width: 400,
            height: 300,
            scrollX: 200,
            scrollY: 150,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera4,
            x: 400,
            y: 300,
            zoom: 0.5,
            width: 400,
            height: 300,
            scrollX: 200,
            scrollY: 150,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    zoomIn(speed, delay)
    {
       var tween = this.tweens.add({
            targets: this.camera1,
            x: 0,
            y: 0,
            zoom: 1,
            width: 800,
            height: 600,
            scrollX: 0,
            scrollY: 0,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera2,
            x: 800,
            y: 0,
            zoom: 1,
            width: 800,
            height: 600,
            scrollX: 0,
            scrollY: 0,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera3,
            x: 0,
            y: 600,
            zoom: 1,
            width: 800,
            height: 600,
            scrollX: 0,
            scrollY: 0,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });

       var tween = this.tweens.add({
            targets: this.camera4,
            x: 800,
            y: 600,
            zoom: 1,
            width: 800,
            height: 600,
            scrollX: 0,
            scrollY: 0,
            ease: 'Power1',
            duration: speed,
            delay: delay
        });
    }

    setCameraFull(cam, x, y)
    {
        cam.zoom = 1;
        cam.x = x;
        cam.y = y;
        cam.width = 800;
        cam.height = 600;
        cam.scrollX = 0;
        cam.scrollY = 0;
    }
}
