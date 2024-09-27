
let jwtAnyExpression = /([a-zA-Z0-9+/\-_=]+\.[a-zA-Z0-9+/\-_=]+\.[a-zA-Z0-9+/\-_=]+)/;
let jwtExactExpression = /^[a-zA-Z0-9+/\-_=]+\.[a-zA-Z0-9+/\-_=]+\.[a-zA-Z0-9+/\-_=]+$/;

export class JWT{
    public type: string;
    public name: string;
    public value: string;
    public rawValue: string;

    constructor(type, name, value, rawValue){
        this.type = type;
        this.name = name;
        this.value = value;
        this.rawValue = rawValue;
    }
}

export function parseJwt(value, skipValidate) {
    if (!value) {
        return false;
    }

    value = value.trim();

    if (value.match(jwtExactExpression) === null) {
        return false;
    }

    let [header, body, signature] = value.split('.');

    try {
        return {
            header: JSON.parse(base64Decode(header)),
            body: JSON.parse(base64Decode(body)),
            signature: signature,
            raw: value
        };
    } catch (err) {
        return false;
    }
}

export function isJwt(value) {
    return parseJwt(value, false) !== false;
}

export function base64Decode(value) {
    return new Buffer(value, 'base64').toString('utf8');
}