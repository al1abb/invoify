"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getSocialImageFallbackMetadataBase: null,
    isStringOrURL: null,
    resolveAbsoluteUrlWithPathname: null,
    resolveRelativeUrl: null,
    resolveUrl: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getSocialImageFallbackMetadataBase: function() {
        return getSocialImageFallbackMetadataBase;
    },
    isStringOrURL: function() {
        return isStringOrURL;
    },
    resolveAbsoluteUrlWithPathname: function() {
        return resolveAbsoluteUrlWithPathname;
    },
    resolveRelativeUrl: function() {
        return resolveRelativeUrl;
    },
    resolveUrl: function() {
        return resolveUrl;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("../../../shared/lib/isomorphic/path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isStringOrURL(icon) {
    return typeof icon === "string" || icon instanceof URL;
}
function createLocalMetadataBase() {
    return new URL(`http://localhost:${process.env.PORT || 3000}`);
}
function getSocialImageFallbackMetadataBase(metadataBase) {
    const isMetadataBaseMissing = !metadataBase;
    const defaultMetadataBase = createLocalMetadataBase();
    const deploymentUrl = process.env.VERCEL_URL && new URL(`https://${process.env.VERCEL_URL}`);
    let fallbackMetadataBase;
    if (process.env.NODE_ENV === "development") {
        fallbackMetadataBase = defaultMetadataBase;
    } else {
        fallbackMetadataBase = process.env.NODE_ENV === "production" && deploymentUrl && process.env.VERCEL_ENV === "preview" ? deploymentUrl : metadataBase || deploymentUrl || defaultMetadataBase;
    }
    return {
        fallbackMetadataBase,
        isMetadataBaseMissing
    };
}
function resolveUrl(url, metadataBase) {
    if (url instanceof URL) return url;
    if (!url) return null;
    try {
        // If we can construct a URL instance from url, ignore metadataBase
        const parsedUrl = new URL(url);
        return parsedUrl;
    } catch  {}
    if (!metadataBase) {
        metadataBase = createLocalMetadataBase();
    }
    // Handle relative or absolute paths
    const basePath = metadataBase.pathname || "";
    const joinedPath = _path.default.posix.join(basePath, url);
    return new URL(joinedPath, metadataBase);
}
// Resolve with `pathname` if `url` is a relative path.
function resolveRelativeUrl(url, pathname) {
    if (typeof url === "string" && url.startsWith("./")) {
        return _path.default.posix.resolve(pathname, url);
    }
    return url;
}
// Resolve `pathname` if `url` is a relative path the compose with `metadataBase`.
function resolveAbsoluteUrlWithPathname(url, metadataBase, { trailingSlash, pathname }) {
    // Resolve url with pathname that always starts with `/`
    url = resolveRelativeUrl(url, pathname);
    // Convert string url or URL instance to absolute url string,
    // if there's case needs to be resolved with metadataBase
    let resolvedUrl = "";
    const result = metadataBase ? resolveUrl(url, metadataBase) : url;
    if (typeof result === "string") {
        resolvedUrl = result;
    } else {
        resolvedUrl = result.pathname === "/" ? result.origin : result.href;
    }
    // Add trailing slash if it's enabled for urls matches the condition
    // - Not external, same origin with metadataBase
    // - Doesn't have query
    if (trailingSlash && !resolvedUrl.endsWith("/")) {
        let isRelative = resolvedUrl.startsWith("/");
        let isExternal = false;
        let hasQuery = resolvedUrl.includes("?");
        if (!isRelative) {
            try {
                const parsedUrl = new URL(resolvedUrl);
                isExternal = metadataBase != null && parsedUrl.origin !== metadataBase.origin;
            } catch  {
                // If it's not a valid URL, treat it as external
                isExternal = true;
            }
            if (!isExternal && !hasQuery) return `${resolvedUrl}/`;
        }
    }
    return resolvedUrl;
}

//# sourceMappingURL=resolve-url.js.map