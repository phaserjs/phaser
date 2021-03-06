import { CONFIG_DEFAULTS } from '../const';
import { ConfigStore } from '../ConfigStore';

export function GetWorldSize (): number
{
    return ConfigStore.get(CONFIG_DEFAULTS.WORLD_SIZE);
}
