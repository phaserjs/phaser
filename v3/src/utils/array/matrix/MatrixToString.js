import Pad from 'utils/string/Pad.js';
import CheckMatrix from 'utils/array/matrix/CheckMatrix.js';

//  Generates a string (which you can pass to console.log) from the given
//  Array Matrix.

export default function MatrixToString (matrix) {

    let str = '';

    if (!CheckMatrix(matrix))
    {
        return str;
    }

    for (let r = 0; r < matrix.length; r++)
    {
        for (let c = 0; c < matrix[r].length; c++)
        {
            let cell = matrix[r][c].toString();

            if (cell !== 'undefined')
            {
                str += Pad(cell, 2);
            }
            else
            {
                str += '?';
            }

            if (c < matrix[r].length - 1)
            {
                str += ' |';
            }
        }

        if (r < matrix.length - 1)
        {
            str += '\n';

            for (let i = 0; i < matrix[r].length; i++)
            {
                str += '---';

                if (i < matrix[r].length - 1)
                {
                    str += '+';
                }
            }

            str += '\n';
        }

    }

    return str;

}
