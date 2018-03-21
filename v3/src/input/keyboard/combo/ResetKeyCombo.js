var ResetKeyCombo = function (combo)
{
    combo.current = combo.keyCodes[0];
    combo.index = 0;
    combo.timeLastMatched = 0;
    combo.matched = false;
    combo.timeMatched = 0;

    return combo;
};

module.exports = ResetKeyCombo;
