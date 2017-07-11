var SortStates = function (stateA, stateB)
{
    // console.log('sortStates', stateA.state.sys.settings.key, stateA.index, stateB.state.sys.settings.key, stateB.index);

    //  Sort descending
    if (stateA.index < stateB.index)
    {
        return -1;
    }
    else if (stateA.index > stateB.index)
    {
        return 1;
    }
    else
    {
        return 0;
    }
};

module.exports = SortStates;
