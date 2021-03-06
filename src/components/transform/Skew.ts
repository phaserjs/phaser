import { IVec2 } from '../../math/vec2/IVec2';
import { Transform2DComponent } from './Transform2DComponent';

export class Skew implements IVec2
{
    private id: number;

    constructor (id: number, x: number = 0, y: number = 0)
    {
        this.id = id;

        this.x = x;
        this.y = y;
    }

    set (x: number, y: number = x): this
    {
        this.x = x;
        this.y = y;

        return this;
    }

    set x (value: number)
    {
        Transform2DComponent.skewX[this.id] = value;
    }

    get x (): number
    {
        return Transform2DComponent.skewX[this.id];
    }

    set y (value: number)
    {
        Transform2DComponent.skewY[this.id] = value;
    }

    get y (): number
    {
        return Transform2DComponent.skewY[this.id];
    }
}
