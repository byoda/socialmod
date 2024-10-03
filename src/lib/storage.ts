export default class ByoStorage {
    storage: Storage;

    constructor() {
        this.storage = window.localStorage;
    }

    get(key: string): object | undefined {
        let text: string | null = this.storage.getItem(key);
        if (text == undefined) {
            return undefined;
        }
        let data: object = JSON.parse(text);
        return data
    }

    set(key: string, value: object) {
        this.storage.setItem(key, JSON.stringify(value));
    }
}