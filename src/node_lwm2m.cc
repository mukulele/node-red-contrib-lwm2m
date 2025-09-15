/**
 * @license
 * Copyright (c) 2019 CANDY LINE INC.
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

// TODO Future Use

#include "node_lwm2m.hpp"

#ifdef LWM2M_WITH_LOGS
#define TAG "node_lwm2m"
#define DP(format, ...) printf("\x1b[32m [" TAG "] " format "\x1b[39m\n", ##__VA_ARGS__)
#else /* LWM2M_WITH_LOGS */
#define DP(format, ...)
#endif /* LWM2M_WITH_LOGS */


#include <napi.h>

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  // Future Use
  return exports;
}

NODE_API_MODULE(node_lwm2m, Init)
