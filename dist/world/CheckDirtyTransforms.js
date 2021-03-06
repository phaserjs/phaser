import { GetWorldID } from "../components/hierarchy";
export function CheckDirtyTransforms(worldID, list) {
  for (let i = 0; i < list.length; i++) {
    if (GetWorldID(list[i]) === worldID) {
      return true;
    }
  }
  return false;
}
