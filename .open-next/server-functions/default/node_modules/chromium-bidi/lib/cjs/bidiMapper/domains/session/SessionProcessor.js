"use strict";
/**
 * Copyright 2023 Google LLC.
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionProcessor = void 0;
class SessionProcessor {
    #eventManager;
    constructor(eventManager) {
        this.#eventManager = eventManager;
    }
    status() {
        return { ready: false, message: 'already connected' };
    }
    async subscribe(params, channel = null) {
        await this.#eventManager.subscribe(params.events, params.contexts ?? [null], channel);
        return {};
    }
    async unsubscribe(params, channel = null) {
        await this.#eventManager.unsubscribe(params.events, params.contexts ?? [null], channel);
        return {};
    }
}
exports.SessionProcessor = SessionProcessor;
//# sourceMappingURL=SessionProcessor.js.map