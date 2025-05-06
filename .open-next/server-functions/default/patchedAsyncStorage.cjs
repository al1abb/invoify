"use strict";
//@ts-nocheck
const asyncStorage = require("next/dist/client/components/static-generation-async-storage.external.original");
const staticGenerationAsyncStorage = {
    run: (store, cb, ...args) => asyncStorage.staticGenerationAsyncStorage.run(store, cb, ...args),
    getStore: () => {
        const store = asyncStorage.staticGenerationAsyncStorage.getStore();
        if (store) {
            store.isOnDemandRevalidate =
                store.isOnDemandRevalidate &&
                    !globalThis.__openNextAls.getStore().isISRRevalidation;
        }
        return store;
    },
};
exports.staticGenerationAsyncStorage = staticGenerationAsyncStorage;
