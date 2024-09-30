interface iMessage {
    source: string;
    type: string;
    data: SocialNetwork;
}

interface iSocialNetwork {
    name: string;
    url: string;
    jwt: string | null;
    csrf_token: string | null;
}

class SocialNetwork {
    name: string;
    url: string;
    jwt: string | null;
    csrf_token: string | null;

    constructor(name: string, url: string, jwt: string | null = null,
                csrf_token: string | null = null) {
        this.name = name;
        this.url = url;
        this.jwt = jwt;
        this.csrf_token = csrf_token;
    }
}

let socialNetworks: Dictionary<SocialNetwork> = {
    'x.com': new SocialNetwork('Twitter', 'x.com'),
    'youtube.com': new SocialNetwork('YouTube', 'youtube.com'),
    'facebook.com': new SocialNetwork('Facebook', 'facebook.com'),
    'instagram.com': new SocialNetwork('Instagram', 'instagram.com')
}