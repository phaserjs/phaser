Phaser.State.Systems = function (state, config)
{
    this.state = state;

    this.config = config;

    //  State specific managers (Factory, Tweens, Loader, Physics, etc)
    this.add;
    this.input;
    this.load;
    this.tweens;

    //  State specific properties (transform, data, children, etc)
    this.children;
    this.color;
    this.data;
    this.fbo;
    this.time;
    this.transform;
};

Phaser.State.Systems.prototype.constructor = Phaser.State.Systems;

Phaser.State.Systems.prototype = {

    init: function ()
    {
        //  State specific managers (Factory, Tweens, Loader, Physics, etc)
        this.add = new Phaser.GameObject.Factory(this.state);
        this.load = new Phaser.Loader(this.state);

        //  State specific properties (transform, data, children, etc)
        this.children = new Phaser.Component.Children(this.state);
        this.color = new Phaser.Component.Color(this.state);
        this.data = new Phaser.Component.Data(this.state);
        this.transform = new Phaser.Component.Transform(this.state);

        //  Defaults

        this.state.add = this.add;
        this.state.load = this.load;
        this.state.children = this.children;
        this.state.color = this.color;
        // this.state.data = this.data;
        this.state.transform = this.transform;

        //  Here we can check which Systems to install as properties into the State object
        //  (default systems always exist in here, regardless)

        var config = this.config;
        var t = typeof config;

        if (t !== 'object' || (t === 'object' && !t.hasOwnProperty('systems')))
        {
            return;
        }

        // this.key = (config.hasOwnProperty('key')) ? config.key : '';
    }

};
