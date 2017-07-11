var SortStates = require('./SortStates');

var Create = function (state)
{
    // console.log('create', state.sys.settings.key);
    // console.log(state);

    //  Insert at the correct index, or it just all goes wrong :)

    var i = this.getStateIndex(state);

    // console.log('create.index', state.sys.settings.key, i);

    this.active.push({ index: i, state: state });

    //  Sort the 'active' array based on the index property
    this.active.sort(SortStates);

    if (state.create)
    {
        state.create.call(state, state.sys.settings.data);
    }
};

module.exports = Create;
