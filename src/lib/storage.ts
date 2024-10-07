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

    get_list_sync(key: string): [] {
        let text: string | null = this.storage.getItem(key);
        if (text == undefined) {
            return [];
        }
        let data: [] = JSON.parse(text) || [] as [];
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