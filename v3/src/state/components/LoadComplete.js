var LoadComplete = function (event)
{
    var state = event.loader.state;

    // console.log('loadComplete', state.sys.settings.key);

    this.create(state);
};

module.exports = LoadComplete;
