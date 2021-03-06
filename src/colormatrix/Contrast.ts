import { IColorComponent } from '../components/color/IColorComponent';
import { IGameObject } from '../gameobjects/IGameObject';
import { SetColorMatrix } from './SetColorMatrix';

export function Contrast <T extends IGameObject & IColorComponent> (gameObject: T, value: number, multiply: boolean = false): T
{
    const v = value + 1;
    const o = -0.5 * (v - 1);

    const values = [
        v, 0, 0, 0,
        0, v, 0, 0,
        0, 0, v, 0,
        0, 0, 0, 1
    ];

    if (SetColorMatrix(gameObject.id, values, [ o, o, o, 0 ], multiply))
    {
        gameObject.color.colorMatrixEnabled = true;
    }

    return gameObject;
}
