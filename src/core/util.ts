import {SocialNetwork} from './datatypes'

export function get_keyname(net: SocialNetwork, key: string): string {
    return `socialmod_${net.name}_${key}`
}