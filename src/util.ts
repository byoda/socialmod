import {SocialNetwork} from './datatypes.ts'

export function get_keyname(net: SocialNetwork, key: string): string {
    return `socialmod_${net.name}_${key}`
}