// all interfaces and classes related to a BYOMod list

import * as fs from 'fs';

// import { parse } from 'yaml'
// import YAML from 'yaml'
import * as yaml from 'js-yaml';

import ByoStorage from './storage';
import {SocialNetwork} from './datatypes';

export interface iAccountStat {
    timestamp: Date;
    followers: number;
    assets: number;
    views: number;
}

export interface iSocialAccount {
    platform: string;
    handle: string;
    url: string;
    is_primary: boolean;
    status: iAccountStat[];
}

export interface ModerationEntry {
    first_name: string;
    last_name: string;
    business_name: string;
    business_type: string;
    status: string;
    languages: string[];
    categories: iByoListCategory[];
    annotations: string[];
    urls: string[];
    social_accounts: iSocialAccount[];
}

export interface iByoListCategory {
    name: string;
    description: string;
}

export interface iByoListMeta {
    author_email: string;
    author_name: string;
    author_url: string;
    categories: iByoListCategory[];
}

export interface iByoList {
    meta: iByoListMeta;
    block_list: ModerationEntry[];
    trust_list: string[];
    recommend_list: string[];
}

export default class ByoList {
    storage: ByoStorage;
    url: URL
    list: iByoList | undefined;
    net: SocialNetwork

    constructor(net: SocialNetwork, url: string | URL) {
        this.net = net;
        this.storage = new ByoStorage();
        if (typeof url === 'string') {
            url = new URL(url);
        }
        this.url = url;
    }

    async load(): Promise<number> {
        let key: string = this.net.get_keyname(`'list_${this.url.href}`);
        let data: iByoList = await this.storage.get(key) as iByoList;
        this.list = data;
        return this.list!.block_list!.length;
    }

    async save(data: iByoList) {
        let key: string = this.net.get_keyname(`'list_${this.url.href}`);
        await this.storage.set(key, data);
    }

    async download() {
        let response = await fetch(this.url.href);
        if (response.status === 200) {
            let text: string = await response.json();
            this.list = yaml.load(text) as iByoList;
        };
    }

    // Used for test purposes
    from_file(filename: string): number {
        let text: string = fs.readFileSync(filename, 'utf8');
        let data: iByoList = yaml.load(text) as iByoList ;
        this.list = data;
        return this.list.block_list.length;
    }
}
