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
        let data: Set<string> = JSON.parse(text) as Set<string>;
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
}