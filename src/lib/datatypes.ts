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
        return `socialmod_${this.name}_${key}`
    }
};

interface Dictionary<T> {
    [key: string]: T
};

export let socialNetworks: Dictionary<SocialNetwork> = {
    'x.com': new SocialNetwork('Twitter', 'x.com'),
    'youtube.com': new SocialNetwork('YouTube', 'youtube.com'),
    'facebook.com': new SocialNetwork('Facebook', 'facebook.com'),
    'instagram.com': new SocialNetwork('Instagram', 'instagram.com')
};