"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    accumulateMetadata: null,
    accumulateViewport: null,
    collectMetadata: null,
    resolveMetadata: null,
    resolveMetadataItems: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    accumulateMetadata: function() {
        return accumulateMetadata;
    },
    accumulateViewport: function() {
        return accumulateViewport;
    },
    collectMetadata: function() {
        return collectMetadata;
    },
    resolveMetadata: function() {
        return resolveMetadata;
    },
    resolveMetadataItems: function() {
        return resolveMetadataItems;
    }
});
const _defaultmetadata = require("./default-metadata");
const _resolveopengraph = require("./resolvers/resolve-opengraph");
const _resolvetitle = require("./resolvers/resolve-title");
const _utils = require("./generate/utils");
const _clientreference = require("../client-reference");
const _appdirmodule = require("../../server/lib/app-dir-module");
const _interopdefault = require("../interop-default");
const _resolvebasics = require("./resolvers/resolve-basics");
const _resolveicons = require("./resolvers/resolve-icons");
const _tracer = require("../../server/lib/trace/tracer");
const _constants = require("../../server/lib/trace/constants");
const _segment = require("../../shared/lib/segment");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../../build/output/log"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function hasIconsProperty(icons, prop) {
    if (!icons) return false;
    if (prop === "icon") {
        // Detect if icons.icon will be presented, icons array and icons string will all be merged into icons.icon
        return !!(typeof icons === "string" || icons instanceof URL || Array.isArray(icons) || prop in icons && icons[prop]);
    } else {
        // Detect if icons.apple will be presented, only icons.apple will be merged into icons.apple
        return !!(typeof icons === "object" && prop in icons && icons[prop]);
    }
}
function mergeStaticMetadata(source, target, staticFilesMetadata, metadataContext, titleTemplates) {
    var _source_twitter, _source_openGraph;
    if (!staticFilesMetadata) return;
    const { icon, apple, openGraph, twitter, manifest } = staticFilesMetadata;
    // file based metadata is specified and current level metadata icons is not specified
    if (icon && !hasIconsProperty(source == null ? void 0 : source.icons, "icon") || apple && !hasIconsProperty(source == null ? void 0 : source.icons, "apple")) {
        target.icons = {
            icon: icon || [],
            apple: apple || []
        };
    }
    // file based metadata is specified and current level metadata twitter.images is not specified
    if (twitter && !(source == null ? void 0 : (_source_twitter = source.twitter) == null ? void 0 : _source_twitter.hasOwnProperty("images"))) {
        const resolvedTwitter = (0, _resolveopengraph.resolveTwitter)({
            ...target.twitter,
            images: twitter
        }, target.metadataBase, titleTemplates.twitter);
        target.twitter = resolvedTwitter;
    }
    // file based metadata is specified and current level metadata openGraph.images is not specified
    if (openGraph && !(source == null ? void 0 : (_source_openGraph = source.openGraph) == null ? void 0 : _source_openGraph.hasOwnProperty("images"))) {
        const resolvedOpenGraph = (0, _resolveopengraph.resolveOpenGraph)({
            ...target.openGraph,
            images: openGraph
        }, target.metadataBase, metadataContext, titleTemplates.openGraph);
        target.openGraph = resolvedOpenGraph;
    }
    if (manifest) {
        target.manifest = manifest;
    }
    return target;
}
// Merge the source metadata into the resolved target metadata.
function mergeMetadata({ source, target, staticFilesMetadata, titleTemplates, metadataContext, buildState }) {
    // If there's override metadata, prefer it otherwise fallback to the default metadata.
    const metadataBase = typeof (source == null ? void 0 : source.metadataBase) !== "undefined" ? source.metadataBase : target.metadataBase;
    for(const key_ in source){
        const key = key_;
        switch(key){
            case "title":
                {
                    target.title = (0, _resolvetitle.resolveTitle)(source.title, titleTemplates.title);
                    break;
                }
            case "alternates":
                {
                    target.alternates = (0, _resolvebasics.resolveAlternates)(source.alternates, metadataBase, metadataContext);
                    break;
                }
            case "openGraph":
                {
                    target.openGraph = (0, _resolveopengraph.resolveOpenGraph)(source.openGraph, metadataBase, metadataContext, titleTemplates.openGraph);
                    break;
                }
            case "twitter":
                {
                    target.twitter = (0, _resolveopengraph.resolveTwitter)(source.twitter, metadataBase, titleTemplates.twitter);
                    break;
                }
            case "verification":
                target.verification = (0, _resolvebasics.resolveVerification)(source.verification);
                break;
            case "icons":
                {
                    target.icons = (0, _resolveicons.resolveIcons)(source.icons);
                    break;
                }
            case "appleWebApp":
                target.appleWebApp = (0, _resolvebasics.resolveAppleWebApp)(source.appleWebApp);
                break;
            case "appLinks":
                target.appLinks = (0, _resolvebasics.resolveAppLinks)(source.appLinks);
                break;
            case "robots":
                {
                    target.robots = (0, _resolvebasics.resolveRobots)(source.robots);
                    break;
                }
            case "archives":
            case "assets":
            case "bookmarks":
            case "keywords":
                {
                    target[key] = (0, _utils.resolveAsArrayOrUndefined)(source[key]);
                    break;
                }
            case "authors":
                {
                    target[key] = (0, _utils.resolveAsArrayOrUndefined)(source.authors);
                    break;
                }
            case "itunes":
                {
                    target[key] = (0, _resolvebasics.resolveItunes)(source.itunes, metadataBase, metadataContext);
                    break;
                }
            // directly assign fields that fallback to null
            case "applicationName":
            case "description":
            case "generator":
            case "creator":
            case "publisher":
            case "category":
            case "classification":
            case "referrer":
            case "formatDetection":
            case "manifest":
                // @ts-ignore TODO: support inferring
                target[key] = source[key] || null;
                break;
            case "other":
                target.other = Object.assign({}, target.other, source.other);
                break;
            case "metadataBase":
                target.metadataBase = metadataBase;
                break;
            default:
                {
                    if ((key === "viewport" || key === "themeColor" || key === "colorScheme") && source[key] != null) {
                        buildState.warnings.add(`Unsupported metadata ${key} is configured in metadata export in ${metadataContext.pathname}. Please move it to viewport export instead.\nRead more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport`);
                    }
                    break;
                }
        }
    }
    mergeStaticMetadata(source, target, staticFilesMetadata, metadataContext, titleTemplates);
}
function mergeViewport({ target, source }) {
    if (!source) return;
    for(const key_ in source){
        const key = key_;
        switch(key){
            case "themeColor":
                {
                    target.themeColor = (0, _resolvebasics.resolveThemeColor)(source.themeColor);
                    break;
                }
            case "colorScheme":
                target.colorScheme = source.colorScheme || null;
                break;
            default:
                if (typeof source[key] !== "undefined") {
                    // @ts-ignore viewport properties
                    target[key] = source[key];
                }
                break;
        }
    }
}
async function getDefinedViewport(mod, props, tracingProps) {
    if ((0, _clientreference.isClientReference)(mod)) {
        return null;
    }
    if (typeof mod.generateViewport === "function") {
        const { route } = tracingProps;
        return (parent)=>(0, _tracer.getTracer)().trace(_constants.ResolveMetadataSpan.generateViewport, {
                spanName: `generateViewport ${route}`,
                attributes: {
                    "next.page": route
                }
            }, ()=>mod.generateViewport(props, parent));
    }
    return mod.viewport || null;
}
async function getDefinedMetadata(mod, props, tracingProps) {
    // Layer is a client component, we just skip it. It can't have metadata exported.
    // Return early to avoid accessing properties error for client references.
    if ((0, _clientreference.isClientReference)(mod)) {
        return null;
    }
    if (typeof mod.generateMetadata === "function") {
        const { route } = tracingProps;
        return (parent)=>(0, _tracer.getTracer)().trace(_constants.ResolveMetadataSpan.generateMetadata, {
                spanName: `generateMetadata ${route}`,
                attributes: {
                    "next.page": route
                }
            }, ()=>mod.generateMetadata(props, parent));
    }
    return mod.metadata || null;
}
async function collectStaticImagesFiles(metadata, props, type) {
    var _this;
    if (!(metadata == null ? void 0 : metadata[type])) return undefined;
    const iconPromises = metadata[type].map(async (imageModule)=>(0, _interopdefault.interopDefault)(await imageModule(props)));
    return (iconPromises == null ? void 0 : iconPromises.length) > 0 ? (_this = await Promise.all(iconPromises)) == null ? void 0 : _this.flat() : undefined;
}
async function resolveStaticMetadata(components, props) {
    const { metadata } = components;
    if (!metadata) return null;
    const [icon, apple, openGraph, twitter] = await Promise.all([
        collectStaticImagesFiles(metadata, props, "icon"),
        collectStaticImagesFiles(metadata, props, "apple"),
        collectStaticImagesFiles(metadata, props, "openGraph"),
        collectStaticImagesFiles(metadata, props, "twitter")
    ]);
    const staticMetadata = {
        icon,
        apple,
        openGraph,
        twitter,
        manifest: metadata.manifest
    };
    return staticMetadata;
}
async function collectMetadata({ tree, metadataItems, errorMetadataItem, props, route, errorConvention }) {
    let mod;
    let modType;
    const hasErrorConventionComponent = Boolean(errorConvention && tree[2][errorConvention]);
    if (errorConvention) {
        mod = await (0, _appdirmodule.getComponentTypeModule)(tree, "layout");
        modType = errorConvention;
    } else {
        [mod, modType] = await (0, _appdirmodule.getLayoutOrPageModule)(tree);
    }
    if (modType) {
        route += `/${modType}`;
    }
    const staticFilesMetadata = await resolveStaticMetadata(tree[2], props);
    const metadataExport = mod ? await getDefinedMetadata(mod, props, {
        route
    }) : null;
    const viewportExport = mod ? await getDefinedViewport(mod, props, {
        route
    }) : null;
    metadataItems.push([
        metadataExport,
        staticFilesMetadata,
        viewportExport
    ]);
    if (hasErrorConventionComponent && errorConvention) {
        const errorMod = await (0, _appdirmodule.getComponentTypeModule)(tree, errorConvention);
        const errorViewportExport = errorMod ? await getDefinedViewport(errorMod, props, {
            route
        }) : null;
        const errorMetadataExport = errorMod ? await getDefinedMetadata(errorMod, props, {
            route
        }) : null;
        errorMetadataItem[0] = errorMetadataExport;
        errorMetadataItem[1] = staticFilesMetadata;
        errorMetadataItem[2] = errorViewportExport;
    }
}
async function resolveMetadataItems({ tree, parentParams, metadataItems, errorMetadataItem, treePrefix = [], getDynamicParamFromSegment, searchParams, errorConvention }) {
    const [segment, parallelRoutes, { page }] = tree;
    const currentTreePrefix = [
        ...treePrefix,
        segment
    ];
    const isPage = typeof page !== "undefined";
    // Handle dynamic segment params.
    const segmentParam = getDynamicParamFromSegment(segment);
    /**
   * Create object holding the parent params and current params
   */ const currentParams = // Handle null case where dynamic param is optional
    segmentParam && segmentParam.value !== null ? {
        ...parentParams,
        [segmentParam.param]: segmentParam.value
    } : parentParams;
    let layerProps;
    if (isPage) {
        layerProps = {
            params: currentParams,
            searchParams
        };
    } else {
        layerProps = {
            params: currentParams
        };
    }
    await collectMetadata({
        tree,
        metadataItems,
        errorMetadataItem,
        errorConvention,
        props: layerProps,
        route: currentTreePrefix// __PAGE__ shouldn't be shown in a route
        .filter((s)=>s !== _segment.PAGE_SEGMENT_KEY).join("/")
    });
    for(const key in parallelRoutes){
        const childTree = parallelRoutes[key];
        await resolveMetadataItems({
            tree: childTree,
            metadataItems,
            errorMetadataItem,
            parentParams: currentParams,
            treePrefix: currentTreePrefix,
            searchParams,
            getDynamicParamFromSegment,
            errorConvention
        });
    }
    if (Object.keys(parallelRoutes).length === 0 && errorConvention) {
        // If there are no parallel routes, place error metadata as the last item.
        // e.g. layout -> layout -> not-found
        metadataItems.push(errorMetadataItem);
    }
    return metadataItems;
}
const isTitleTruthy = (title)=>!!(title == null ? void 0 : title.absolute);
const hasTitle = (metadata)=>isTitleTruthy(metadata == null ? void 0 : metadata.title);
function inheritFromMetadata(target, metadata) {
    if (target) {
        if (!hasTitle(target) && hasTitle(metadata)) {
            target.title = metadata.title;
        }
        if (!target.description && metadata.description) {
            target.description = metadata.description;
        }
    }
}
const commonOgKeys = [
    "title",
    "description",
    "images"
];
function postProcessMetadata(metadata, titleTemplates) {
    const { openGraph, twitter } = metadata;
    if (openGraph) {
        // If there's openGraph information but not configured in twitter,
        // inherit them from openGraph metadata.
        let autoFillProps = {};
        const hasTwTitle = hasTitle(twitter);
        const hasTwDescription = twitter == null ? void 0 : twitter.description;
        const hasTwImages = Boolean((twitter == null ? void 0 : twitter.hasOwnProperty("images")) && twitter.images);
        if (!hasTwTitle) {
            if (isTitleTruthy(openGraph.title)) {
                autoFillProps.title = openGraph.title;
            } else if (metadata.title && isTitleTruthy(metadata.title)) {
                autoFillProps.title = metadata.title;
            }
        }
        if (!hasTwDescription) autoFillProps.description = openGraph.description || metadata.description || undefined;
        if (!hasTwImages) autoFillProps.images = openGraph.images;
        if (Object.keys(autoFillProps).length > 0) {
            const partialTwitter = (0, _resolveopengraph.resolveTwitter)(autoFillProps, metadata.metadataBase, titleTemplates.twitter);
            if (metadata.twitter) {
                metadata.twitter = Object.assign({}, metadata.twitter, {
                    ...!hasTwTitle && {
                        title: partialTwitter == null ? void 0 : partialTwitter.title
                    },
                    ...!hasTwDescription && {
                        description: partialTwitter == null ? void 0 : partialTwitter.description
                    },
                    ...!hasTwImages && {
                        images: partialTwitter == null ? void 0 : partialTwitter.images
                    }
                });
            } else {
                metadata.twitter = partialTwitter;
            }
        }
    }
    // If there's no title and description configured in openGraph or twitter,
    // use the title and description from metadata.
    inheritFromMetadata(openGraph, metadata);
    inheritFromMetadata(twitter, metadata);
    return metadata;
}
function collectMetadataExportPreloading(results, dynamicMetadataExportFn, resolvers) {
    const result = dynamicMetadataExportFn(new Promise((resolve)=>{
        resolvers.push(resolve);
    }));
    if (result instanceof Promise) {
        // since we eager execute generateMetadata and
        // they can reject at anytime we need to ensure
        // we attach the catch handler right away to
        // prevent unhandled rejections crashing the process
        result.catch((err)=>{
            return {
                __nextError: err
            };
        });
    }
    results.push(result);
}
async function getMetadataFromExport(getPreloadMetadataExport, dynamicMetadataResolveState, metadataItems, currentIndex, resolvedMetadata, metadataResults) {
    const metadataExport = getPreloadMetadataExport(metadataItems[currentIndex]);
    const dynamicMetadataResolvers = dynamicMetadataResolveState.resolvers;
    let metadata = null;
    if (typeof metadataExport === "function") {
        // Only preload at the beginning when resolves are empty
        if (!dynamicMetadataResolvers.length) {
            for(let j = currentIndex; j < metadataItems.length; j++){
                const preloadMetadataExport = getPreloadMetadataExport(metadataItems[j]) // metadataItems[j][0]
                ;
                // call each `generateMetadata function concurrently and stash their resolver
                if (typeof preloadMetadataExport === "function") {
                    collectMetadataExportPreloading(metadataResults, preloadMetadataExport, dynamicMetadataResolvers);
                }
            }
        }
        const resolveParent = dynamicMetadataResolvers[dynamicMetadataResolveState.resolvingIndex];
        const metadataResult = metadataResults[dynamicMetadataResolveState.resolvingIndex++];
        // In dev we clone and freeze to prevent relying on mutating resolvedMetadata directly.
        // In prod we just pass resolvedMetadata through without any copying.
        const currentResolvedMetadata = process.env.NODE_ENV === "development" ? Object.freeze(require("./clone-metadata").cloneMetadata(resolvedMetadata)) : resolvedMetadata;
        // This resolve should unblock the generateMetadata function if it awaited the parent
        // argument. If it didn't await the parent argument it might already have a value since it was
        // called concurrently. Regardless we await the return value before continuing on to the next layer
        resolveParent(currentResolvedMetadata);
        metadata = metadataResult instanceof Promise ? await metadataResult : metadataResult;
        if (metadata && typeof metadata === "object" && "__nextError" in metadata) {
            // re-throw caught metadata error from preloading
            throw metadata["__nextError"];
        }
    } else if (metadataExport !== null && typeof metadataExport === "object") {
        // This metadataExport is the object form
        metadata = metadataExport;
    }
    return metadata;
}
async function accumulateMetadata(metadataItems, metadataContext) {
    const resolvedMetadata = (0, _defaultmetadata.createDefaultMetadata)();
    const metadataResults = [];
    let titleTemplates = {
        title: null,
        twitter: null,
        openGraph: null
    };
    // Loop over all metadata items again, merging synchronously any static object exports,
    // awaiting any static promise exports, and resolving parent metadata and awaiting any generated metadata
    const dynamicMetadataResolvers = {
        resolvers: [],
        resolvingIndex: 0
    };
    const buildState = {
        warnings: new Set()
    };
    for(let i = 0; i < metadataItems.length; i++){
        const staticFilesMetadata = metadataItems[i][1];
        const metadata = await getMetadataFromExport((metadataItem)=>metadataItem[0], dynamicMetadataResolvers, metadataItems, i, resolvedMetadata, metadataResults);
        mergeMetadata({
            target: resolvedMetadata,
            source: metadata,
            metadataContext,
            staticFilesMetadata,
            titleTemplates,
            buildState
        });
        // If the layout is the same layer with page, skip the leaf layout and leaf page
        // The leaf layout and page are the last two items
        if (i < metadataItems.length - 2) {
            var _resolvedMetadata_title, _resolvedMetadata_openGraph, _resolvedMetadata_twitter;
            titleTemplates = {
                title: ((_resolvedMetadata_title = resolvedMetadata.title) == null ? void 0 : _resolvedMetadata_title.template) || null,
                openGraph: ((_resolvedMetadata_openGraph = resolvedMetadata.openGraph) == null ? void 0 : _resolvedMetadata_openGraph.title.template) || null,
                twitter: ((_resolvedMetadata_twitter = resolvedMetadata.twitter) == null ? void 0 : _resolvedMetadata_twitter.title.template) || null
            };
        }
    }
    // Only log warnings if there are any, and only once after the metadata resolving process is finished
    if (buildState.warnings.size > 0) {
        for (const warning of buildState.warnings){
            _log.warn(warning);
        }
    }
    return postProcessMetadata(resolvedMetadata, titleTemplates);
}
async function accumulateViewport(metadataItems) {
    const resolvedViewport = (0, _defaultmetadata.createDefaultViewport)();
    const viewportResults = [];
    const dynamicMetadataResolvers = {
        resolvers: [],
        resolvingIndex: 0
    };
    for(let i = 0; i < metadataItems.length; i++){
        const viewport = await getMetadataFromExport((metadataItem)=>metadataItem[2], dynamicMetadataResolvers, metadataItems, i, resolvedViewport, viewportResults);
        mergeViewport({
            target: resolvedViewport,
            source: viewport
        });
    }
    return resolvedViewport;
}
async function resolveMetadata({ tree, parentParams, metadataItems, errorMetadataItem, getDynamicParamFromSegment, searchParams, errorConvention, metadataContext }) {
    const resolvedMetadataItems = await resolveMetadataItems({
        tree,
        parentParams,
        metadataItems,
        errorMetadataItem,
        getDynamicParamFromSegment,
        searchParams,
        errorConvention
    });
    let error;
    let metadata = (0, _defaultmetadata.createDefaultMetadata)();
    let viewport = (0, _defaultmetadata.createDefaultViewport)();
    try {
        viewport = await accumulateViewport(resolvedMetadataItems);
        metadata = await accumulateMetadata(resolvedMetadataItems, metadataContext);
    } catch (err) {
        error = err;
    }
    return [
        error,
        metadata,
        viewport
    ];
}

//# sourceMappingURL=resolve-metadata.js.map