import { ClearWorldAndParentID } from '../components/hierarchy';
import { GameObjectCache } from '../gameobjects/GameObjectCache';
import { GameObjectTree } from '../gameobjects/GameObjectTree';
import { IGameObject } from '../gameobjects/IGameObject';

export function RemoveChildAt <T extends IGameObject> (parent: T, index: number): IGameObject | undefined
{
    const children = GameObjectTree.get(parent.id);

    if (index >= 0 && index < children.length)
    {
        const removedID = children.splice(index, 1)[0];

        if (removedID)
        {
            ClearWorldAndParentID(removedID);

            //  Emit remove event?

            return GameObjectCache.get(removedID);
        }
    }
}
