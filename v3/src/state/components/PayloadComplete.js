var PayloadComplete = function (event)
{
    var state = event.loader.state;

    // console.log('payloadComplete', state.sys.settings.key);

    this.bootState(state);
};

module.exports = PayloadComplete;
