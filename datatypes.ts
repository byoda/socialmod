export interface ModerationList {
    meta:           Meta;
    recommend_list: UserEntry[];
    trust_list:     UserEntry[];
    block_list:     BlockList[];
}

export interface Meta {
    author_email: string;
    author_name:  string;
    author_url:   string;
    categories:   string[];
    disclaimer:   string;
    download_url: string;
    last_updated: Date;
    list_name:    string;
}

export interface UserEntry {
    email:          string;
    name:           string;
    url:            string;
}

export interface BlockList {
    business_name:   string;
    business_type:   string;
    categories:      string[];
    first_name:      string;
    last_name:       string;
    social_accounts: SocialAccount[];
    urls:            any[];
}

export interface SocialAccount {
    handle:      string;
    is_primary:  boolean;
    last_active: string;
    platform:    string;
    stats:       Stat[];
    status:      string;
    url:         string;
}

export interface Stat {
    assets:    number;
    followers: number;
    timestamp: Date;
    views:     number;
}



