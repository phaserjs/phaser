var ReverseColumns = function (matrix)
{
    for (let i = 0; i < matrix.length; i++)
    {
        matrix[i].reverse();
    }

    return matrix;
};

module.exports = ReverseColumns;
