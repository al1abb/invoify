"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    resolveImages: null,
    resolveOpenGraph: null,
    resolveTwitter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    resolveImages: function() {
        return resolveImages;
    },
    resolveOpenGraph: function() {
        return resolveOpenGraph;
    },
    resolveTwitter: function() {
        return resolveTwitter;
    }
});
const _utils = require("../generate/utils");
const _resolveurl = require("./resolve-url");
const _resolvetitle = require("./resolve-title");
const _url = require("../../url");
const _log = require("../../../build/output/log");
const OgTypeFields = {
    article: [
        "authors",
        "tags"
    ],
    song: [
        "albums",
        "musicians"
    ],
    playlist: [
        "albums",
        "musicians"
    ],
    radio: [
        "creators"
    ],
    video: [
        "actors",
        "directors",
        "writers",
        "tags"
    ],
    basic: [
        "emails",
        "phoneNumbers",
        "faxNumbers",
        "alternateLocale",
        "audio",
        "videos"
    ]
};
function resolveAndValidateImage(item, metadataBase, isMetadataBaseMissing) {
    if (!item) return undefined;
    const isItemUrl = (0, _resolveurl.isStringOrURL)(item);
    const inputUrl = isItemUrl ? item : item.url;
    if (!inputUrl) return undefined;
    validateResolvedImageUrl(inputUrl, metadataBase, isMetadataBaseMissing);
    return isItemUrl ? {
        url: (0, _resolveurl.resolveUrl)(inputUrl, metadataBase)
    } : {
        ...item,
        // Update image descriptor url
        url: (0, _resolveurl.resolveUrl)(inputUrl, metadataBase)
    };
}
function resolveImages(images, metadataBase) {
    const resolvedImages = (0, _utils.resolveAsArrayOrUndefined)(images);
    if (!resolvedImages) return resolvedImages;
    const { isMetadataBaseMissing, fallbackMetadataBase } = (0, _resolveurl.getSocialImageFallbackMetadataBase)(metadataBase);
    const nonNullableImages = [];
    for (const item of resolvedImages){
        const resolvedItem = resolveAndValidateImage(item, fallbackMetadataBase, isMetadataBaseMissing);
        if (!resolvedItem) continue;
        nonNullableImages.push(resolvedItem);
    }
    return nonNullableImages;
}
function getFieldsByOgType(ogType) {
    switch(ogType){
        case "article":
        case "book":
            return OgTypeFields.article;
        case "music.song":
        case "music.album":
            return OgTypeFields.song;
        case "music.playlist":
            return OgTypeFields.playlist;
        case "music.radio_station":
            return OgTypeFields.radio;
        case "video.movie":
        case "video.episode":
            return OgTypeFields.video;
        default:
            return OgTypeFields.basic;
    }
}
function validateResolvedImageUrl(inputUrl, fallbackMetadataBase, isMetadataBaseMissing) {
    // Only warn on the image url that needs to be resolved with metadataBase
    if (typeof inputUrl === "string" && !(0, _url.isFullStringUrl)(inputUrl) && isMetadataBaseMissing) {
        (0, _log.warnOnce)(`metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "${fallbackMetadataBase.origin}". See https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase`);
    }
}
const resolveOpenGraph = (openGraph, metadataBase, metadataContext, titleTemplate)=>{
    if (!openGraph) return null;
    function resolveProps(target, og) {
        const ogType = og && "type" in og ? og.type : undefined;
        const keys = getFieldsByOgType(ogType);
        for (const k of keys){
            const key = k;
            if (key in og && key !== "url") {
                const value = og[key];
                if (value) {
                    const arrayValue = (0, _utils.resolveAsArrayOrUndefined)(value);
                    target[key] = arrayValue;
                }
            }
        }
        target.images = resolveImages(og.images, metadataBase);
    }
    const resolved = {
        ...openGraph,
        title: (0, _resolvetitle.resolveTitle)(openGraph.title, titleTemplate)
    };
    resolveProps(resolved, openGraph);
    resolved.url = openGraph.url ? (0, _resolveurl.resolveAbsoluteUrlWithPathname)(openGraph.url, metadataBase, metadataContext) : null;
    return resolved;
};
const TwitterBasicInfoKeys = [
    "site",
    "siteId",
    "creator",
    "creatorId",
    "description"
];
const resolveTwitter = (twitter, metadataBase, titleTemplate)=>{
    var _resolved_images;
    if (!twitter) return null;
    let card = "card" in twitter ? twitter.card : undefined;
    const resolved = {
        ...twitter,
        title: (0, _resolvetitle.resolveTitle)(twitter.title, titleTemplate)
    };
    for (const infoKey of TwitterBasicInfoKeys){
        resolved[infoKey] = twitter[infoKey] || null;
    }
    resolved.images = resolveImages(twitter.images, metadataBase);
    card = card || (((_resolved_images = resolved.images) == null ? void 0 : _resolved_images.length) ? "summary_large_image" : "summary");
    resolved.card = card;
    if ("card" in resolved) {
        switch(resolved.card){
            case "player":
                {
                    resolved.players = (0, _utils.resolveAsArrayOrUndefined)(resolved.players) || [];
                    break;
                }
            case "app":
                {
                    resolved.app = resolved.app || {};
                    break;
                }
            default:
                break;
        }
    }
    return resolved;
};

//# sourceMappingURL=resolve-opengraph.js.map