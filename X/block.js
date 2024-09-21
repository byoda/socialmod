
const user_id = '245963716'
// const endpointURL = `https://api.x.com/2/users/${user_id}/blocking`;
const block_endpointURL = 'https://x.com/i/api/1.1/blocks/create.json';
const unblock_endpointURL = 'https://api.x.com/1.1/blocks/destroy.json';
// const block_endpointURL = 'https://api.x.com/i/api/1.1/blocks/create.json';
// const unblock_endpointURL = 'https://api.x.com/i/api/1.1/blocks/destroy.json';
const publicToken = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
const csrfToken = 'd6330d41f0cc181504998f8b3285c43ef1619ba5e943949aa063837ff7a6c352907bd18e9d7a84c21e7a8b3796edfa321c17d4e6de2269f77c9bafdd92d447fcd797e36d04464e7e663fc585c81b8be0'
window.onload = async () => {
    console.log('Page loaded!');
    // let selector = '#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div'
    // elem = document.querySelector('selector');
    // console.log('Elem: ' + elem)

    var manifest = chrome.runtime.getManifest();
    let auth_header = 'Bearer ' + manifest.auth_header;
    console.log('Auth Header: ' + auth_header);
    const formData = new FormData();
    formData.append('user_id', '245963716');
    try {
        console.log('URL:' + block_endpointURL);
        const response = await fetch(
            block_endpointURL, // + '?user_id=245963716',
            {
                method: 'POST',
                headers: {
                    // ':authority': 'x.com',
                    // ':method': 'POST',
                    // ':scheme': 'https',
                    // 'Origin': 'https://x.com',
                    'authorization': publicToken,
                    'X-Csrf-Token': csrfToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Twitter-Active-User': 'yes',
                    'X-Twitter-Client-Language': 'en',
                    'X-Twitter-Auth-Type': 'OAuth2Session',
                    'X-Client-Transaction-Id': 'KV4OduB1PqQNoxbExJyKFtDSytBfTlHocq8hsUUkVw8XZyCSL9nSW7gFREuEoAmQPpqDtyu9M+SmxHEPnFnviUAGC9qsKg'
                },
                credentials: 'include',
                // Set the FormData instance as the request body
                // body: formData
                body: 'user_id=245963716'
            }
        );
        if (response.status === 200) {
            let data = await response.json();
            console.log(data);
        } else if (response.status === 410) {
            console.log('User already blocked');
        }
    } catch (e) {
        console.log(e);
    }
}


function getCsrf() {
    console.log("Getting CSRF!")
    let csrf = document.cookie.match(/(?:^|;\s*)ct0=([0-9a-f]+)\s*(?:;|$)/);
    return csrf ? csrf[1] : "";
}

function debugLog(...args) {
    if(typeof vars === "object" && vars.developerMode) {
        if(args[0] === 'notifications.get' && !document.querySelector('.notifications-modal') && !location.pathname.startsWith('/notifications')) return;
        if(vars.extensiveLogging) {
            console.trace(...args);
        } else {
            console.log(...args, new Error().stack.split("\n")[2].trim()); // genius
        }
    }
}

// extract full text and url entities from "note_tweet"
function parseNoteTweet(result) {
    console.log("Parsing Note Tweet!")

    let text, entities;
    if(result.note_tweet.note_tweet_results.result) {
        text = result.note_tweet.note_tweet_results.result.text;
        entities = result.note_tweet.note_tweet_results.result.entity_set;
        if(result.note_tweet.note_tweet_results.result.richtext?.richtext_tags.length) {
            entities.richtext = result.note_tweet.note_tweet_results.result.richtext.richtext_tags // logically, richtext is an entity, right?
        }
    } else {
        text = result.note_tweet.note_tweet_results.text;
        entities = result.note_tweet.note_tweet_results.entity_set;
    }
    return {text, entities};
}


// transform ugly useless twitter api reply to usable legacy tweet
function parseTweet(res) {
    console.log('Parsing a Tweet')
    if(typeof res !== "object") return;
    if(res.limitedActionResults) {
        let limitation = res.limitedActionResults.limited_actions.find(l => l.action === "Reply");
        if(limitation) {
            res.tweet.legacy.limited_actions_text = limitation.prompt ? limitation.prompt.subtext.text : LOC.limited_tweet.message;
        }
        res = res.tweet;
    }
    if(!res.legacy && res.tweet) res = res.tweet;
    let tweet = res.legacy;
    if(!res.core) return;
    tweet.user = res.core.user_results.result.legacy;
    tweet.user.id_str = tweet.user_id_str;
    if(res.core.user_results.result.is_blue_verified && !res.core.user_results.result.legacy.verified_type) {
        tweet.user.verified = true;
        tweet.user.verified_type = "Blue";
    }
    if(tweet.retweeted_status_result) {
        let result = tweet.retweeted_status_result.result;
        if(result.limitedActionResults && result.tweet && result.tweet.legacy) {
            let limitation = result.limitedActionResults.limited_actions.find(l => l.action === "Reply");
            if(limitation) {
                result.tweet.legacy.limited_actions_text = limitation.prompt ? limitation.prompt.subtext.text : LOC.limited_tweet.message;
            }
        }
        if(result.tweet) result = result.tweet;
        if(
            result.quoted_status_result &&
            result.quoted_status_result.result &&
            result.quoted_status_result.result.legacy &&
            result.quoted_status_result.result.core &&
            result.quoted_status_result.result.core.user_results.result.legacy
        ) {
            result.legacy.quoted_status = result.quoted_status_result.result.legacy;
            if(result.legacy.quoted_status) {
                result.legacy.quoted_status.user = result.quoted_status_result.result.core.user_results.result.legacy;
                result.legacy.quoted_status.user.id_str = result.legacy.quoted_status.user_id_str;
                if(result.quoted_status_result.result.core.user_results.result.is_blue_verified && !result.quoted_status_result.result.core.user_results.result.legacy.verified_type) {
                    result.legacy.quoted_status.user.verified = true;
                    result.legacy.quoted_status.user.verified_type = "Blue";
                }
                tweetStorage[result.legacy.quoted_status.id_str] = result.legacy.quoted_status;
                tweetStorage[result.legacy.quoted_status.id_str].cacheDate = Date.now();
                userStorage[result.legacy.quoted_status.user.id_str] = result.legacy.quoted_status.user;
                userStorage[result.legacy.quoted_status.user.id_str].cacheDate = Date.now();
            } else {
                console.warn("No retweeted quoted status", result);
            }
        } else if(
            result.quoted_status_result &&
            result.quoted_status_result.result &&
            result.quoted_status_result.result.tweet &&
            result.quoted_status_result.result.tweet.legacy &&
            result.quoted_status_result.result.tweet.core &&
            result.quoted_status_result.result.tweet.core.user_results.result.legacy
        ) {
            result.legacy.quoted_status = result.quoted_status_result.result.tweet.legacy;
            if(result.legacy.quoted_status) {
                result.legacy.quoted_status.user = result.quoted_status_result.result.tweet.core.user_results.result.legacy;
                result.legacy.quoted_status.user.id_str = result.legacy.quoted_status.user_id_str;
                if(result.quoted_status_result.result.tweet.core.user_results.result.is_blue_verified && !result.core.user_results.result.verified_type) {
                    result.legacy.quoted_status.user.verified = true;
                    result.legacy.quoted_status.user.verified_type = "Blue";
                }
                tweetStorage[result.legacy.quoted_status.id_str] = result.legacy.quoted_status;
                tweetStorage[result.legacy.quoted_status.id_str].cacheDate = Date.now();
                userStorage[result.legacy.quoted_status.user.id_str] = result.legacy.quoted_status.user;
                userStorage[result.legacy.quoted_status.user.id_str].cacheDate = Date.now();
            } else {
                console.warn("No retweeted quoted status", result);
            }
        }
        tweet.retweeted_status = result.legacy;
        if(tweet.retweeted_status && result.core.user_results.result.legacy) {
            tweet.retweeted_status.user = result.core.user_results.result.legacy;
            tweet.retweeted_status.user.id_str = tweet.retweeted_status.user_id_str;
            if(result.core.user_results.result.is_blue_verified && !result.core.user_results.result.legacy.verified_type) {
                tweet.retweeted_status.user.verified = true;
                tweet.retweeted_status.user.verified_type = "Blue";
            }
            tweet.retweeted_status.ext = {};
            if(result.views) {
                tweet.retweeted_status.ext.views = {r: {ok: {count: +result.views.count}}};
            }
            tweet.retweeted_status.res = res;
            if(res.card && res.card.legacy && res.card.legacy.binding_values) {
                tweet.retweeted_status.card = res.card.legacy;
            }
            tweetStorage[tweet.retweeted_status.id_str] = tweet.retweeted_status;
            tweetStorage[tweet.retweeted_status.id_str].cacheDate = Date.now();
            userStorage[tweet.retweeted_status.user.id_str] = tweet.retweeted_status.user;
            userStorage[tweet.retweeted_status.user.id_str].cacheDate = Date.now();
        } else {
            console.warn("No retweeted status", result);
        }
        if(result.note_tweet && result.note_tweet.note_tweet_results) {
            let note = parseNoteTweet(result);
            tweet.retweeted_status.full_text = note.text;
            tweet.retweeted_status.entities = note.entities;
            tweet.retweeted_status.display_text_range = undefined; // no text range for long tweets
        }
    }

    if(res.quoted_status_result) {
        tweet.quoted_status_result = res.quoted_status_result;
    }
    if(res.note_tweet && res.note_tweet.note_tweet_results) {
        let note = parseNoteTweet(res);
        tweet.full_text = note.text;
        tweet.entities = note.entities;
        tweet.display_text_range = undefined; // no text range for long tweets
    }
    if(tweet.quoted_status_result && tweet.quoted_status_result.result) {
        let result = tweet.quoted_status_result.result;
        if(!result.core && result.tweet) result = result.tweet;
        if(result.limitedActionResults) {
            let limitation = result.limitedActionResults.limited_actions.find(l => l.action === "Reply");
            if(limitation) {
                result.tweet.legacy.limited_actions_text = limitation.prompt ? limitation.prompt.subtext.text : LOC.limited_tweet.message;
            }
            result = result.tweet;
        }
        tweet.quoted_status = result.legacy;
        if(tweet.quoted_status) {
            tweet.quoted_status.user = result.core.user_results.result.legacy;
            if(!tweet.quoted_status.user) {
                delete tweet.quoted_status;
            } else {
                tweet.quoted_status.user.id_str = tweet.quoted_status.user_id_str;
                if(result.core.user_results.result.is_blue_verified && !result.core.user_results.result.legacy.verified_type) {
                    tweet.quoted_status.user.verified = true;
                    tweet.quoted_status.user.verified_type = "Blue";
                }
                tweet.quoted_status.ext = {};
                if(result.views) {
                    tweet.quoted_status.ext.views = {r: {ok: {count: +result.views.count}}};
                }
                tweetStorage[tweet.quoted_status.id_str] = tweet.quoted_status;
                tweetStorage[tweet.quoted_status.id_str].cacheDate = Date.now();
                userStorage[tweet.quoted_status.user.id_str] = tweet.quoted_status.user;
                userStorage[tweet.quoted_status.user.id_str].cacheDate = Date.now();
            }
        } else {
            console.warn("No quoted status", result);
        }
    }
    if(res.card && res.card.legacy) {
        tweet.card = res.card.legacy;
        let bvo = {};
        for(let i = 0; i < tweet.card.binding_values.length; i++) {
            let bv = tweet.card.binding_values[i];
            bvo[bv.key] = bv.value;
        }
        tweet.card.binding_values = bvo;
    }
    if(res.views) {
        if(!tweet.ext) tweet.ext = {};
        tweet.ext.views = {r: {ok: {count: +res.views.count}}};
    }
    if(res.source) {
        tweet.source = res.source;
    }
    if(res.birdwatch_pivot) { // community notes
        tweet.birdwatch = res.birdwatch_pivot;
    }
    if(res.trusted_friends_info_result && res.trusted_friends_info_result.owner_results && res.trusted_friends_info_result.owner_results.result && res.trusted_friends_info_result.owner_results.result.legacy) {
        tweet.trusted_circle_owner = res.trusted_friends_info_result.owner_results.result.legacy.screen_name;
    }

    if(tweet.favorited && tweet.favorite_count === 0) {
        tweet.favorite_count = 1;
    }
    if(tweet.retweeted && tweet.retweet_count === 0) {
        tweet.retweet_count = 1;
    }

    tweet.res = res;

    tweetStorage[tweet.id_str] = tweet;
    tweetStorage[tweet.id_str].cacheDate = Date.now();
    userStorage[tweet.user.id_str] = tweet.user;
    userStorage[tweet.user.id_str].cacheDate = Date.now();
    return tweet;
}


const API = {
    tweet: {
        postV2: tweet => {
            return new Promise((resolve, reject) => {
                console.log("Tweet v2 API!")

                let text;
                if(tweet.text) {
                    text = tweet.text;
                } else if(tweet.tweet_text) {
                    text = tweet.tweet_text;
                } else if(tweet.status) {
                    text = tweet.status;
                } else {
                    text = "";
                }
                let variables = {
                    "tweet_text": text,
                    "media": {
                        "media_entities": [],
                        "possibly_sensitive": false
                    },
                    "semantic_annotation_ids": [],
                    "dark_request": false
                };
                if(tweet.card_uri) {
                    variables.card_uri = tweet.card_uri;
                }
                if(tweet.media_ids) {
                    if(typeof tweet.media_ids === "string") {
                        tweet.media = tweet.media_ids.split(",");
                    } else {
                        tweet.media = tweet.media_ids;
                    }
                }
                if(tweet.media) {
                    variables.media.media_entities = tweet.media.map(i => ({media_id: i, tagged_users: []}));
                    if(tweet.sensitive) {
                        variables.media.possibly_sensitive = true;
                    }
                }
                if(tweet.conversation_control === 'follows') {
                    variables.conversation_control = { mode: 'Community' };
                } else if(tweet.conversation_control === 'mentions') {
                    variables.conversation_control = { mode: 'ByInvitation' };
                }
                if(tweet.circle) {
                    variables.trusted_friends_control_options = { "trusted_friends_list_id": tweet.circle };
                }
                if(tweet.in_reply_to_status_id) {
                    tweet.in_reply_to_tweet_id = tweet.in_reply_to_status_id;
                    delete tweet.in_reply_to_status_id;
                }
                if(tweet.in_reply_to_tweet_id) {
                    variables.reply = {
                        in_reply_to_tweet_id: tweet.in_reply_to_tweet_id,
                        exclude_reply_user_ids: []
                    }
                    if(tweet.exclude_reply_user_ids) {
                        if(typeof tweet.exclude_reply_user_ids === "string") {
                            tweet.exclude_reply_user_ids = tweet.exclude_reply_user_ids.split(",");
                        }
                        variables.reply.exclude_reply_user_ids = tweet.exclude_reply_user_ids;
                    }
                }
                if(tweet.attachment_url) {
                    variables.attachment_url = tweet.attachment_url;
                }
                debugLog('tweet.postV2', 'init', {tweet, variables});
                let parsedTweet = twttr.txt.parseTweet(text);
                fetch(`/i/api/graphql/${parsedTweet.weightedLength > 280 ? 'cuvrhmg0s4pGaLWV68NNnQ/CreateNoteTweet' : 'I_J3_LvnnihD0Gjbq5pD2g/CreateTweet'}`, {
                    method: 'POST',
                    headers: {
                        "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw",
                        "x-csrf-token": getCsrf(),
                        "x-twitter-auth-type": "OAuth2Session",
                        "content-type": "application/json; charset=utf-8",
                        "x-twitter-client-language": LANGUAGE ? LANGUAGE : navigator.language ? navigator.language : "en"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        variables,
                        "features": {"c9s_tweet_anatomy_moderator_badge_enabled":true,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":false,"tweet_awards_web_tipping_enabled":false,"responsive_web_home_pinned_timelines_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"responsive_web_media_download_video_enabled":false,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_enhance_cards_enabled":false},
                        "queryId": parsedTweet.weightedLength > 280 ? 'cuvrhmg0s4pGaLWV68NNnQ' : 'I_J3_LvnnihD0Gjbq5pD2g'
                    })
                }).then(i => i.json()).then(data => {
                    debugLog('tweet.postV2', 'start', data);
                    if (data.errors && data.errors[0]) {
                        return reject(data.errors[0].message);
                    }
                    let ct = data.data.create_tweet ? data.data.create_tweet : data.data.notetweet_create;
                    let result = ct.tweet_results.result;
                    let tweet = parseTweet(result);
                    if(result.trusted_friends_info_result && !tweet.limited_actions) {
                        tweet.limited_actions = 'limit_trusted_friends_tweet';
                    }
                    debugLog('tweet.postV2', 'end', tweet);
                    resolve(tweet);
                }).catch(e => {
                    reject(e);
                });
            });
        },
        get: id => { // deprecated
            return new Promise((resolve, reject) => {
                console.log("Get API!")

                fetch(`https://api.${location.hostname}/1.1/statuses/show.json?id=${id}&include_my_retweet=1&cards_platform=Web13&include_entities=1&include_user_entities=1&include_cards=1&send_error_codes=1&tweet_mode=extended&include_ext_alt_text=true&include_reply_count=true&ext=views%2CmediaStats%2CverifiedType%2CisBlueVerified`, {
                    headers: {
                        "authorization": publicToken,
                        "x-csrf-token": getCsrf(),
                        "x-twitter-auth-type": "OAuth2Session",
                        "x-twitter-client-language": LANGUAGE ? LANGUAGE : navigator.language ? navigator.language : "en"
                    },
                    credentials: "include"
                }).then(i => i.json()).then(data => {
                    if (data.errors && data.errors[0]) {
                        return reject(data.errors[0].message);
                    }
                    resolve(data);
                }).catch(e => {
                    reject(e);
                });
            });
        },
        lookup: ids => {
            return new Promise((resolve, reject) => {
                console.log("Lookup API!")

                fetch(`https://api.${location.hostname}/1.1/statuses/lookup.json?id=${ids.join(',')}&include_entities=true&include_ext_alt_text=true&include_card_uri=true&tweet_mode=extended&include_reply_count=true&ext=views%2CmediaStats`, {
                    headers: {
                        "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF",
                        "x-csrf-token": getCsrf(),
                        "x-twitter-auth-type": "OAuth2Session",
                        "x-twitter-client-language": navigator.language ? navigator.language : "en"
                    },
                    credentials: "include"
                }).then(i => i.json()).then(data => {
                    if (data.errors && data.errors[0].code === 32) {
                        return reject("Not logged in");
                    }
                    if (data.errors && data.errors[0]) {
                        return reject(data.errors[0].message);
                    }
                    resolve(data);
                }).catch(e => {
                    reject(e);
                });
            });
        },
        moderate: id => {
            return new Promise((resolve, reject) => {
                console.log("Moderate API!")
                fetch(`/i/api/graphql/pjFnHGVqCjTcZol0xcBJjw/ModerateTweet`, {
                    method: 'POST',
                    headers: {
                        "authorization": publicToken,
                        "x-csrf-token": getCsrf(),
                        "x-twitter-auth-type": "OAuth2Session",
                        "content-type": "application/json; charset=utf-8"
                    },
                    credentials: "include",
                    body: JSON.stringify({"variables":{"tweetId":id},"queryId":"pjFnHGVqCjTcZol0xcBJjw"})
                }).then(i => i.json()).then(data => {
                    debugLog('tweet.moderate', id, data);
                    if (data.errors && data.errors[0]) {
                        return reject(data.errors[0].message);
                    }
                    resolve(data);
                }).catch(e => {
                    reject(e);
                });
            });
        },
        unmoderate: id => {
            return new Promise((resolve, reject) => {
                console.log("Unmoderate API!")
                fetch(`/i/api/graphql/pVSyu6PA57TLvIE4nN2tsA/UnmoderateTweet`, {
                    method: 'POST',
                    headers: {
                        "authorization": publicToken,
                        "x-csrf-token": getCsrf(),
                        "x-twitter-auth-type": "OAuth2Session",
                        "content-type": "application/json; charset=utf-8"
                    },
                    credentials: "include",
                    body: JSON.stringify({"variables":{"tweetId":"1683331680751308802"},"queryId":"pVSyu6PA57TLvIE4nN2tsA"})
                }).then(i => i.json()).then(data => {
                    debugLog('tweet.unmoderate', id, data);
                    if (data.errors && data.errors[0]) {
                        return reject(data.errors[0].message);
                    }
                    resolve(data);
                }).catch(e => {
                    reject(e);
                });
            });
        },
        getModeratedReplies: (id, cursor) => {
            return new Promise((resolve, reject) => {
                console.log("Get Moderated Replies API!")

                let variables = {"rootTweetId":id,"count":20,"includePromotedContent":false};
                if(cursor) variables.cursor = cursor;
                fetch(`/i/api/graphql/SiKS1_3937rb72ytFnDHmA/ModeratedTimeline?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify({"rweb_lists_timeline_redesign_enabled":false,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":false,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_media_download_video_enabled":false,"responsive_web_enhance_cards_enabled":false}))}`, {
                    method: 'POST',
                    headers: {
                        "authorization": publicToken,
                        "x-csrf-token": getCsrf(),
                        "x-twitter-auth-type": "OAuth2Session",
                        "content-type": "application/x-www-form-urlencoded",
                        "x-twitter-client-language": LANGUAGE ? LANGUAGE : navigator.language ? navigator.language : "en"
                    },
                    credentials: "include"
                }).then(i => i.json()).then(data => {
                    debugLog('tweet.getModeratedReplies', 'start', id, data);
                    if (data.errors && data.errors[0]) {
                        return reject(data.errors[0].message);
                    }
                    let entries = data.data.tweet.result.timeline_response.timeline.instructions.find(i => i.entries);
                    if(!entries) return resolve({
                        list: [],
                        cursor: undefined
                    });
                    entries = entries.entries;
                    let list = entries.filter(e => e.entryId.startsWith('tweet-'));
                    let cursor = entries.find(e => e.entryId.startsWith('cursor-bottom'));
                    if(!cursor) {
                        let entries = data.data.tweet.result.timeline_response.timeline.instructions.find(i => i.replaceEntry && i.replaceEntry.entryIdToReplace.includes('cursor-bottom'));
                        if(entries) {
                            cursor = entries.replaceEntry.entry.content.operation.cursor.value;
                        }
                    } else {
                        cursor = cursor.content.operation.cursor.value;
                    }
                    let out = {
                        list: list.map(e => {
                            let tweet = parseTweet(e.content.itemContent.tweet_results.result);
                            if(!tweet) return;
                            tweet.moderated = true;
                            return tweet;
                        }).filter(e => e),
                        cursor
                    };
                    debugLog('tweet.getModeratedReplies', 'end', id, out);
                    resolve(data);
                }).catch(e => {
                    reject(e);
                });
            });
        }
    },
};