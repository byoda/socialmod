import type { iListOfLists } from "./datatypes";

export default class ByoStorage {
    storage: Storage;

    constructor() {
        this.storage = window.localStorage;
    }

    get_sync(key: string): object | undefined {
        let text: string | null = this.storage.getItem(key);
        if (text == undefined) {
            return undefined;
        }
        let data: object = JSON.parse(text);
        return data
    }

    get_set_sync(key: string): Set<string> {
        let text: string | null = this.storage.getItem(key);
        if (text == undefined) {
            let new_set: Set<string> = new Set<string>();
            return new_set;
        }
        console.log(text);
        let data: Set<string> = JSON.parse(text);
        if (typeof data === 'object') {
            data = new Set(data);
        }
        return data
    }

    set_sync(key: string, value: object) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    async get(key: string): Promise<object | undefined> {
        let text: string | null = this.storage.getItem(key);
        if (text == undefined) {
            return undefined;
        }
        let data: object = JSON.parse(text);
        return data
    }

    async set(key: string, value: object) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    get_list_of_lists_sync(key_prefix: string): iListOfLists {
        let key: string = `${key_prefix}_LoL`;
        const parsed = this.get_sync(key);
        if (this.isListOfLists(parsed)) {
            let data: iListOfLists = parsed as iListOfLists;
            return data
        };

        return { lists: new Set<string>() };
    }

    set_list_of_lists_sync(key_prefix: string, value: iListOfLists) {
        let key: string = `${key_prefix}_LoL`;
        this.set_sync(key, value);
    }

    isListOfLists(obj: any): obj is iListOfLists {
        console.log('Got data:', obj);
        if (obj === undefined) {
            console.error('obj is undefined');
            return false;
        }
        return obj.lists !== undefined;
    }
}