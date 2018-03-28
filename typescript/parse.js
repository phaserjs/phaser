const genericRegex = /{(.*)} (\w+) - \[(.*)\]/;

function parseGeneric (genericValue)
{
    const matches = genericRegex.exec(genericValue);

    if (matches)
    {
        return {
            type: matches[1],
            name: matches[2],
            params: matches[3].replace(/\$/g, '@').split(',')
        };
    }
}

module.exports = { parseGeneric: parseGeneric };
