export interface iMessage<Type> {
    source: string;
    type: string;
    data: Type;
};

export interface iSocialNetworkAuth {
    name: string;
    jwt: string | undefined;
    csrf_token: string | undefined;
};

export class SocialNetwork {
    name: string;
    url: string;
    jwt: string | undefined;
    csrf_token: string | undefined;

    constructor(name: string, url: string, jwt: string | undefined = undefined,
                csrf_token: string | undefined = undefined) {
        this.name = name;
        this.url = url;
        this.jwt = jwt;
        this.csrf_token = csrf_token;
    }

    get_keyname(key: string): string {
        return `byomod_${this.name}_${key}`
    }
};

// This type is used by the socialNetworks constant in constants.ts
export interface Dictionary<T> {
    [key: string]: T
};

export interface iListOfLists {
    lists: string[];
}