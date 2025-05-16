import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  require_maplibre_gl
} from "./chunk-JZAEP6BW.js";
import {
  __async,
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-ANGF2IQY.js";

// node_modules/@maptiler/sdk/dist/maptiler-sdk.mjs
var import_maplibre_gl = __toESM(require_maplibre_gl(), 1);

// node_modules/quick-lru/index.js
var QuickLRU = class extends Map {
  #size = 0;
  #cache = /* @__PURE__ */ new Map();
  #oldCache = /* @__PURE__ */ new Map();
  #maxSize;
  #maxAge;
  #onEviction;
  constructor(options = {}) {
    super();
    if (!(options.maxSize && options.maxSize > 0)) {
      throw new TypeError("`maxSize` must be a number greater than 0");
    }
    if (typeof options.maxAge === "number" && options.maxAge === 0) {
      throw new TypeError("`maxAge` must be a number greater than 0");
    }
    this.#maxSize = options.maxSize;
    this.#maxAge = options.maxAge || Number.POSITIVE_INFINITY;
    this.#onEviction = options.onEviction;
  }
  // For tests.
  get __oldCache() {
    return this.#oldCache;
  }
  #emitEvictions(cache) {
    if (typeof this.#onEviction !== "function") {
      return;
    }
    for (const [key, item] of cache) {
      this.#onEviction(key, item.value);
    }
  }
  #deleteIfExpired(key, item) {
    if (typeof item.expiry === "number" && item.expiry <= Date.now()) {
      if (typeof this.#onEviction === "function") {
        this.#onEviction(key, item.value);
      }
      return this.delete(key);
    }
    return false;
  }
  #getOrDeleteIfExpired(key, item) {
    const deleted = this.#deleteIfExpired(key, item);
    if (deleted === false) {
      return item.value;
    }
  }
  #getItemValue(key, item) {
    return item.expiry ? this.#getOrDeleteIfExpired(key, item) : item.value;
  }
  #peek(key, cache) {
    const item = cache.get(key);
    return this.#getItemValue(key, item);
  }
  #set(key, value) {
    this.#cache.set(key, value);
    this.#size++;
    if (this.#size >= this.#maxSize) {
      this.#size = 0;
      this.#emitEvictions(this.#oldCache);
      this.#oldCache = this.#cache;
      this.#cache = /* @__PURE__ */ new Map();
    }
  }
  #moveToRecent(key, item) {
    this.#oldCache.delete(key);
    this.#set(key, item);
  }
  *#entriesAscending() {
    for (const item of this.#oldCache) {
      const [key, value] = item;
      if (!this.#cache.has(key)) {
        const deleted = this.#deleteIfExpired(key, value);
        if (deleted === false) {
          yield item;
        }
      }
    }
    for (const item of this.#cache) {
      const [key, value] = item;
      const deleted = this.#deleteIfExpired(key, value);
      if (deleted === false) {
        yield item;
      }
    }
  }
  get(key) {
    if (this.#cache.has(key)) {
      const item = this.#cache.get(key);
      return this.#getItemValue(key, item);
    }
    if (this.#oldCache.has(key)) {
      const item = this.#oldCache.get(key);
      if (this.#deleteIfExpired(key, item) === false) {
        this.#moveToRecent(key, item);
        return item.value;
      }
    }
  }
  set(key, value, {
    maxAge = this.#maxAge
  } = {}) {
    const expiry = typeof maxAge === "number" && maxAge !== Number.POSITIVE_INFINITY ? Date.now() + maxAge : void 0;
    if (this.#cache.has(key)) {
      this.#cache.set(key, {
        value,
        expiry
      });
    } else {
      this.#set(key, {
        value,
        expiry
      });
    }
    return this;
  }
  has(key) {
    if (this.#cache.has(key)) {
      return !this.#deleteIfExpired(key, this.#cache.get(key));
    }
    if (this.#oldCache.has(key)) {
      return !this.#deleteIfExpired(key, this.#oldCache.get(key));
    }
    return false;
  }
  peek(key) {
    if (this.#cache.has(key)) {
      return this.#peek(key, this.#cache);
    }
    if (this.#oldCache.has(key)) {
      return this.#peek(key, this.#oldCache);
    }
  }
  delete(key) {
    const deleted = this.#cache.delete(key);
    if (deleted) {
      this.#size--;
    }
    return this.#oldCache.delete(key) || deleted;
  }
  clear() {
    this.#cache.clear();
    this.#oldCache.clear();
    this.#size = 0;
  }
  resize(newSize) {
    if (!(newSize && newSize > 0)) {
      throw new TypeError("`maxSize` must be a number greater than 0");
    }
    const items = [...this.#entriesAscending()];
    const removeCount = items.length - newSize;
    if (removeCount < 0) {
      this.#cache = new Map(items);
      this.#oldCache = /* @__PURE__ */ new Map();
      this.#size = items.length;
    } else {
      if (removeCount > 0) {
        this.#emitEvictions(items.slice(0, removeCount));
      }
      this.#oldCache = new Map(items.slice(removeCount));
      this.#cache = /* @__PURE__ */ new Map();
      this.#size = 0;
    }
    this.#maxSize = newSize;
  }
  *keys() {
    for (const [key] of this) {
      yield key;
    }
  }
  *values() {
    for (const [, value] of this) {
      yield value;
    }
  }
  *[Symbol.iterator]() {
    for (const item of this.#cache) {
      const [key, value] = item;
      const deleted = this.#deleteIfExpired(key, value);
      if (deleted === false) {
        yield [key, value.value];
      }
    }
    for (const item of this.#oldCache) {
      const [key, value] = item;
      if (!this.#cache.has(key)) {
        const deleted = this.#deleteIfExpired(key, value);
        if (deleted === false) {
          yield [key, value.value];
        }
      }
    }
  }
  *entriesDescending() {
    let items = [...this.#cache];
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i];
      const [key, value] = item;
      const deleted = this.#deleteIfExpired(key, value);
      if (deleted === false) {
        yield [key, value.value];
      }
    }
    items = [...this.#oldCache];
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i];
      const [key, value] = item;
      if (!this.#cache.has(key)) {
        const deleted = this.#deleteIfExpired(key, value);
        if (deleted === false) {
          yield [key, value.value];
        }
      }
    }
  }
  *entriesAscending() {
    for (const [key, value] of this.#entriesAscending()) {
      yield [key, value.value];
    }
  }
  get size() {
    if (!this.#size) {
      return this.#oldCache.size;
    }
    let oldCacheSize = 0;
    for (const key of this.#oldCache.keys()) {
      if (!this.#cache.has(key)) {
        oldCacheSize++;
      }
    }
    return Math.min(this.#size + oldCacheSize, this.#maxSize);
  }
  get maxSize() {
    return this.#maxSize;
  }
  entries() {
    return this.entriesAscending();
  }
  forEach(callbackFunction, thisArgument = this) {
    for (const [key, value] of this.entriesAscending()) {
      callbackFunction.call(thisArgument, value, key, this);
    }
  }
  get [Symbol.toStringTag]() {
    return JSON.stringify([...this.entriesAscending()]);
  }
};

// node_modules/@maptiler/client/dist/maptiler-client.mjs
function tryGettingFetch() {
  if (typeof self !== "undefined") {
    return fetch.bind(self);
  }
  if (typeof global !== "undefined" && global.fetch) {
    return global.fetch;
  }
  return null;
}
var ClientConfig = class {
  constructor() {
    this._apiKey = "";
    this._fetch = tryGettingFetch();
    this.tileCacheSize = 200;
  }
  /**
   * Set the MapTiler Cloud API key
   */
  set apiKey(k2) {
    this._apiKey = k2;
  }
  /**
   * Get the MapTiler Cloud API key
   */
  get apiKey() {
    return this._apiKey;
  }
  /**
   * Set a the custom fetch function to replace the default one
   */
  set fetch(f) {
    this._fetch = f;
  }
  /**
   * Get the fetch fucntion
   */
  get fetch() {
    return this._fetch;
  }
};
var config = new ClientConfig();
var NonISOLanguage = {
  /**
   * Language mode to display the labels in the end user's device language.
   */
  AUTO: {
    code: null,
    flag: "auto",
    name: "Auto",
    latin: false,
    isMode: true,
    geocoding: true
  },
  /**
   * The OSM language using latin script. MapTiler discourages its use as a primary language setting due to the lack of actual linguistic specificity,
   * though it can be an handy fallback. This is not to be confused with the "Classical Latin" language, which is available under the tag `.CLASSICAL_LATIN`.
   */
  LATIN: {
    code: "latin",
    flag: "name:latin",
    name: "Latin",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * The OSM language using non-latin script. MapTiler discourages its use as a primary language setting due to the lack of actual linguistic specificity,
   * though it can be an handy fallback.
   */
  NON_LATIN: {
    code: "nonlatin",
    flag: "name:nonlatin",
    name: "Non Latin",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Using the local language generaly (but not always) means that every labels of a given region will use the dominant local language.
   */
  LOCAL: {
    code: null,
    flag: "name",
    name: "Local",
    latin: true,
    isMode: false,
    geocoding: false
  }
};
var ISOLanguage = {
  /**
   * Albanian language
   */
  ALBANIAN: {
    code: "sq",
    flag: "name:sq",
    name: "Albanian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Amharic language
   */
  AMHARIC: {
    code: "am",
    flag: "name:am",
    name: "Amharic",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Arabic language (right-to-left script)
   */
  ARABIC: {
    code: "ar",
    flag: "name:ar",
    name: "Arabic",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Armenian language
   */
  ARMENIAN: {
    code: "hy",
    flag: "name:hy",
    name: "Armenian",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Azerbaijani language
   */
  AZERBAIJANI: {
    code: "az",
    flag: "name:az",
    name: "Azerbaijani",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Basque language
   */
  BASQUE: {
    code: "eu",
    flag: "name:eu",
    name: "Basque",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Belarusian langauge
   */
  BELARUSIAN: {
    code: "be",
    flag: "name:be",
    name: "Belarusian",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Bengali language
   */
  BENGALI: {
    code: "bn",
    flag: "name:bn",
    name: "Bengali",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Bosnian language
   */
  BOSNIAN: {
    code: "bs",
    flag: "name:bs",
    name: "Bosnian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Breton language
   */
  BRETON: {
    code: "br",
    flag: "name:br",
    name: "Breton",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Bulgarian language
   */
  BULGARIAN: {
    code: "bg",
    flag: "bg",
    name: "Bulgarian",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Catalan language
   */
  CATALAN: {
    code: "ca",
    flag: "name:ca",
    name: "Catalan",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Chinese language
   */
  CHINESE: {
    code: "zh",
    flag: "name:zh",
    name: "Chinese",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Traditional Chinese language
   */
  TRADITIONAL_CHINESE: {
    code: "zh-Hant",
    flag: "name:zh-Hant",
    name: "Chinese (traditional)",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Simplified Chinese language
   */
  SIMPLIFIED_CHINESE: {
    code: "zh-Hans",
    flag: "name:zh-Hans",
    name: "Chinese (simplified)",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Corsican language
   */
  CORSICAN: {
    code: "co",
    flag: "name:co",
    name: "Corsican",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Croatian language
   */
  CROATIAN: {
    code: "hr",
    flag: "name:hr",
    name: "Croatian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Czech language
   */
  CZECH: {
    code: "cs",
    flag: "name:cs",
    name: "Czech",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Danish language
   */
  DANISH: {
    code: "da",
    flag: "name:da",
    name: "Danish",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Dutch language
   */
  DUTCH: {
    code: "nl",
    flag: "name:nl",
    name: "Dutch",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * German language
   */
  GERMAN: {
    code: "de",
    flag: "name:de",
    name: "German",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Greek language
   */
  GREEK: {
    code: "el",
    flag: "name:el",
    name: "Greek",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * English language
   */
  ENGLISH: {
    code: "en",
    flag: "name:en",
    name: "English",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Esperanto language
   */
  ESPERANTO: {
    code: "eo",
    flag: "name:eo",
    name: "Esperanto",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Estonian language
   */
  ESTONIAN: {
    code: "et",
    flag: "name:et",
    name: "Estonian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Finnish language
   */
  FINNISH: {
    code: "fi",
    flag: "name:fi",
    name: "Finnish",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * French language
   */
  FRENCH: {
    code: "fr",
    flag: "name:fr",
    name: "French",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Frisian language
   */
  FRISIAN: {
    code: "fy",
    flag: "name:fy",
    name: "Frisian (West)",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Georgian language
   */
  GEORGIAN: {
    code: "ka",
    flag: "name:ka",
    name: "Georgian",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Hebrew language (right-to-left non-latin script)
   */
  HEBREW: {
    code: "he",
    flag: "name:he",
    name: "Hebrew",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Hindi language
   */
  HINDI: {
    code: "hi",
    flag: "name:hi",
    name: "Hindi",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Hungarian language
   */
  HUNGARIAN: {
    code: "hu",
    flag: "name:hu",
    name: "Hungarian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Icelandic language
   */
  ICELANDIC: {
    code: "is",
    flag: "name:is",
    name: "Icelandic",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Indonesian language
   */
  INDONESIAN: {
    code: "id",
    flag: "name:id",
    name: "Indonesian",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Irish language
   */
  IRISH: {
    code: "ga",
    flag: "name:ga",
    name: "Irish",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Italian language
   */
  ITALIAN: {
    code: "it",
    flag: "name:it",
    name: "Italian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Japanese language
   */
  JAPANESE: {
    code: "ja",
    flag: "name:ja",
    name: "Japanese",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Japanese language in Hiragana form
   */
  JAPANESE_HIRAGANA: {
    code: "ja-Hira",
    flag: "name:ja-Hira",
    name: "Japanese Hiragana form",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Japanese language (latin script)
   */
  JAPANESE_2018: {
    code: "ja-Latn",
    flag: "name:ja-Latn",
    name: "Japanese (Latin 2018)",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Japanese language in Kana form (non-latin script)
   */
  JAPANESE_KANA: {
    code: "ja_kana",
    flag: "name:ja_kana",
    name: "Japanese (Kana)",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Japanse language, romanized (latin script)
   */
  JAPANESE_LATIN: {
    code: "ja_rm",
    flag: "name:ja_rm",
    name: "Japanese (Latin script)",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Kannada language
   */
  KANNADA: {
    code: "kn",
    flag: "name:kn",
    name: "Kannada",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Kazakh language
   */
  KAZAKH: {
    code: "kk",
    flag: "name:kk",
    name: "Kazakh",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Korean language
   */
  KOREAN: {
    code: "ko",
    flag: "name:ko",
    name: "Korean",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Korean language (latin script)
   */
  KOREAN_LATIN: {
    code: "ko-Latn",
    flag: "name:ko-Latn",
    name: "Korean (Latin script)",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Kurdish language
   */
  KURDISH: {
    code: "ku",
    flag: "name:ku",
    name: "Kurdish",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Classical Latin language
   */
  CLASSICAL_LATIN: {
    code: "la",
    flag: "name:la",
    name: "Latin",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Latvian language
   */
  LATVIAN: {
    code: "lv",
    flag: "name:lv",
    name: "Latvian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Lithuanian language
   */
  LITHUANIAN: {
    code: "lt",
    flag: "name:lt",
    name: "Lithuanian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Luxembourgish language
   */
  LUXEMBOURGISH: {
    code: "lb",
    flag: "name:lb",
    name: "Luxembourgish",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Macedonian language
   */
  MACEDONIAN: {
    code: "mk",
    flag: "name:mk",
    name: "Macedonian",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Malayalm language
   */
  MALAYALAM: {
    code: "ml",
    flag: "name:ml",
    name: "Malayalam",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Maltese language
   */
  MALTESE: {
    code: "mt",
    flag: "name:mt",
    name: "Maltese",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Norwegian language
   */
  NORWEGIAN: {
    code: "no",
    flag: "name:no",
    name: "Norwegian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Occitan language
   */
  OCCITAN: {
    code: "oc",
    flag: "name:oc",
    name: "Occitan",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Persian language
   */
  PERSIAN: {
    code: "fa",
    flag: "name:fa",
    name: "Persian",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Polish language
   */
  POLISH: {
    code: "pl",
    flag: "name:pl",
    name: "Polish",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Portuguese language
   */
  PORTUGUESE: {
    code: "pt",
    flag: "name:pt",
    name: "Portuguese",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Punjabi language
   */
  PUNJABI: {
    code: "pa",
    flag: "name:pa",
    name: "Punjabi",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Western Punjabi language
   */
  WESTERN_PUNJABI: {
    code: "pnb",
    flag: "name:pnb",
    name: "Western Punjabi",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Romanian language
   */
  ROMANIAN: {
    code: "ro",
    flag: "name:ro",
    name: "Romanian",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Romansh language
   */
  ROMANSH: {
    code: "rm",
    flag: "name:rm",
    name: "Romansh",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Russian language
   */
  RUSSIAN: {
    code: "ru",
    flag: "name:ru",
    name: "Russian",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Serbian language (cyrillic script)
   */
  SERBIAN_CYRILLIC: {
    code: "sr",
    flag: "name:sr",
    name: "Serbian (Cyrillic script)",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Serbian language (latin script)
   */
  SERBIAN_LATIN: {
    code: "sr-Latn",
    flag: "name:sr-Latn",
    name: "Serbian (Latin script)",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Scottish Gaelic language
   */
  SCOTTISH_GAELIC: {
    code: "gd",
    flag: "name:gd",
    name: "Scottish Gaelic",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Slovak language
   */
  SLOVAK: {
    code: "sk",
    flag: "name:sk",
    name: "Slovak",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Slovene language
   */
  SLOVENE: {
    code: "sl",
    flag: "name:sl",
    name: "Slovene",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Spanish language
   */
  SPANISH: {
    code: "es",
    flag: "name:es",
    name: "Spanish",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Swedish language
   */
  SWEDISH: {
    code: "sv",
    flag: "name:sv",
    name: "Swedish",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Tamil language
   */
  TAMIL: {
    code: "ta",
    flag: "name:ta",
    name: "Tamil",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Telugu language
   */
  TELUGU: {
    code: "te",
    flag: "name:te",
    name: "Telugu",
    latin: false,
    isMode: false,
    geocoding: false
  },
  /**
   * Thai language
   */
  THAI: {
    code: "th",
    flag: "name:th",
    name: "Thai",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Turkish language
   */
  TURKISH: {
    code: "tr",
    flag: "name:tr",
    name: "Turkish",
    latin: true,
    isMode: false,
    geocoding: true
  },
  /**
   * Ukrainian language
   */
  UKRAINIAN: {
    code: "uk",
    flag: "name:uk",
    name: "Ukrainian",
    latin: false,
    isMode: false,
    geocoding: true
  },
  /**
   * Vietnamese language (latin script)
   */
  VIETNAMESE: {
    code: "vi",
    flag: "name:vi",
    name: "Vietnamese (Latin script)",
    latin: true,
    isMode: false,
    geocoding: false
  },
  /**
   * Welsh language
   */
  WELSH: {
    code: "cy",
    flag: "name:cy",
    name: "Welsh",
    latin: true,
    isMode: false,
    geocoding: true
  }
};
var Language = __spreadValues(__spreadValues({}, NonISOLanguage), ISOLanguage);
function getLanguageInfoFromKey(languageKey, languageDictionary = Language) {
  if (languageKey in languageDictionary) {
    return languageKey[languageKey];
  }
  return null;
}
function getLanguageInfoFromCode(languageCode, languageDictionary = Language) {
  for (const lang of Object.values(languageDictionary)) {
    if (lang.code === languageCode) {
      return lang;
    }
  }
  return null;
}
function getLanguageInfoFromFlag(languageFlag, languageDictionary = Language) {
  for (const lang of Object.values(languageDictionary)) {
    if (lang.flag === languageFlag) {
      return lang;
    }
  }
  return null;
}
function getAutoLanguage() {
  if (typeof navigator === "undefined") {
    const code = Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];
    const langInfo = getLanguageInfoFromCode(code);
    return langInfo ?? Language.ENGLISH;
  }
  const canditatelangs = Array.from(new Set(navigator.languages.map((l) => l.split("-")[0]))).map((code) => getLanguageInfoFromCode(code)).filter((li2) => li2);
  return canditatelangs[0] ?? Language.ENGLISH;
}
function isLanguageInfo(obj) {
  return obj !== null && typeof obj === "object" && "code" in obj && "flag" in obj && "name" in obj && "latin" in obj && "isMode" in obj && "geocoding" in obj && (typeof obj.code === "string" || obj.code === null) && typeof obj.flag === "string" && typeof obj.name === "string" && typeof obj.latin === "boolean" && typeof obj.isMode === "boolean" && typeof obj.geocoding === "boolean";
}
function toLanguageInfo(lang, languageDictionary = Language) {
  if (isLanguageInfo(lang)) {
    return getLanguageInfoFromFlag(lang.flag, languageDictionary);
  }
  if (typeof lang !== "string") {
    return null;
  }
  return getLanguageInfoFromKey(lang, languageDictionary) || getLanguageInfoFromCode(lang, languageDictionary) || getLanguageInfoFromFlag(lang, languageDictionary) || null;
}
function areSameLanguages(langA, langB, languageDictionary = Language) {
  const langAObj = toLanguageInfo(langA, languageDictionary);
  const langBObj = toLanguageInfo(langB, languageDictionary);
  return langAObj && langBObj && langAObj.flag === langBObj.flag;
}
function callFetch(_0) {
  return __async(this, arguments, function* (resource, options = {}) {
    if (config.fetch === null) {
      throw new Error("The fetch function was not found. If on NodeJS < 18 please specify the fetch function with config.fetch");
    }
    if (new URL(resource).searchParams.get("key").trim() === "") {
      throw new Error("The MapTiler Cloud API key is missing. Set it in `config.apiKey` or get one for free at https://maptiler.com");
    }
    return config.fetch(resource, options);
  });
}
var defaults = {
  maptilerApiURL: "https://api.maptiler.com/",
  mapStyle: "streets-v2"
};
Object.freeze(defaults);
var ServiceError = class extends Error {
  constructor(res, customMessage = "") {
    super(`Call to enpoint ${res.url} failed with the status code ${res.status}. ${customMessage}`);
    this.res = res;
  }
};
var customMessages$4 = {
  400: "Query too long / Invalid parameters",
  403: "Key is missing, invalid or restricted"
};
function addLanguageGeocodingOptions(searchParams, options) {
  const {
    language
  } = options;
  if (language === void 0) {
    return;
  }
  const languageCodes = (Array.isArray(language) ? language : [language]).map((elem) => toValidGeocodingLanguageCode(elem)).filter((elem) => elem);
  const languages = Array.from(new Set(languageCodes)).join(",");
  searchParams.set("language", languages);
}
function toValidGeocodingLanguageCode(lang) {
  const langInfo = lang === Language.AUTO.flag ? getAutoLanguage() : typeof lang === "string" ? getLanguageInfoFromCode(lang) : isLanguageInfo(lang) ? lang.flag === Language.AUTO.flag ? getAutoLanguage() : getLanguageInfoFromFlag(lang.flag) : null;
  return langInfo?.geocoding ? langInfo.code : null;
}
function addCommonForwardAndReverseGeocodingOptions(searchParams, options) {
  const {
    apiKey,
    limit,
    types,
    excludeTypes
  } = options;
  searchParams.set("key", apiKey ?? config.apiKey);
  if (limit !== void 0) {
    searchParams.set("limit", String(limit));
  }
  if (types !== void 0) {
    searchParams.set("types", types.join(","));
  }
  if (excludeTypes !== void 0) {
    searchParams.set("excludeTypes", String(excludeTypes));
  }
  addLanguageGeocodingOptions(searchParams, options);
}
function addForwardGeocodingOptions(searchParams, options) {
  addCommonForwardAndReverseGeocodingOptions(searchParams, options);
  const {
    bbox,
    proximity,
    country,
    fuzzyMatch,
    autocomplete
  } = options;
  if (bbox !== void 0) {
    searchParams.set("bbox", bbox.join(","));
  }
  if (proximity !== void 0) {
    searchParams.set("proximity", proximity === "ip" ? proximity : proximity.join(","));
  }
  if (country !== void 0) {
    searchParams.set("country", country.join(","));
  }
  if (fuzzyMatch !== void 0) {
    searchParams.set("fuzzyMatch", fuzzyMatch ? "true" : "false");
  }
  if (autocomplete !== void 0) {
    searchParams.set("autocomplete", autocomplete ? "true" : "false");
  }
}
function forward(_0) {
  return __async(this, arguments, function* (query, options = {}) {
    if (typeof query !== "string" || query.trim().length === 0) {
      throw new Error("The query must be a non-empty string");
    }
    const endpoint = new URL(`geocoding/${encodeURIComponent(query)}.json`, defaults.maptilerApiURL);
    addForwardGeocodingOptions(endpoint.searchParams, options);
    const res = yield callFetch(endpoint.toString());
    if (!res.ok) {
      throw new ServiceError(res, customMessages$4[res.status] ?? "");
    }
    return yield res.json();
  });
}
function reverse(_0) {
  return __async(this, arguments, function* (position, options = {}) {
    if (!Array.isArray(position) || position.length < 2) {
      throw new Error("The position must be an array of form [lng, lat].");
    }
    const endpoint = new URL(`geocoding/${position[0]},${position[1]}.json`, defaults.maptilerApiURL);
    addCommonForwardAndReverseGeocodingOptions(endpoint.searchParams, options);
    const res = yield callFetch(endpoint.toString());
    if (!res.ok) {
      throw new ServiceError(res, customMessages$4[res.status] ?? "");
    }
    return yield res.json();
  });
}
function byId(_0) {
  return __async(this, arguments, function* (id, options = {}) {
    const endpoint = new URL(`geocoding/${id}.json`, defaults.maptilerApiURL);
    endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
    addLanguageGeocodingOptions(endpoint.searchParams, options);
    const res = yield callFetch(endpoint.toString());
    if (!res.ok) {
      throw new ServiceError(res, customMessages$4[res.status] ?? "");
    }
    return yield res.json();
  });
}
function batch$1(_0) {
  return __async(this, arguments, function* (queries, options = {}) {
    if (!queries.length) {
      return [];
    }
    const joinedQuery = queries.map((query) => encodeURIComponent(query)).join(";");
    const endpoint = new URL(`geocoding/${joinedQuery}.json`, defaults.maptilerApiURL);
    addForwardGeocodingOptions(endpoint.searchParams, options);
    const res = yield callFetch(endpoint.toString());
    if (!res.ok) {
      throw new ServiceError(res, customMessages$4[res.status] ?? "");
    }
    const obj = yield res.json();
    return queries.length === 1 ? [obj] : obj;
  });
}
var geocoding = {
  forward,
  reverse,
  byId,
  batch: batch$1
};
var customMessages$3 = {
  403: "Key is missing, invalid or restricted"
};
function info() {
  return __async(this, arguments, function* (options = {}) {
    const endpoint = new URL(`geolocation/ip.json`, defaults.maptilerApiURL);
    endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
    const urlWithParams = endpoint.toString();
    const res = yield callFetch(urlWithParams);
    if (!res.ok) {
      throw new ServiceError(res, res.status in customMessages$3 ? customMessages$3[res.status] : "");
    }
    const obj = yield res.json();
    return obj;
  });
}
var geolocation = {
  info
};
var customMessages$2 = {
  403: "Key is missing, invalid or restricted"
};
function search(_0) {
  return __async(this, arguments, function* (query, options = {}) {
    if (typeof query !== "string" || query.trim().length === 0) {
      throw new Error("The query must be a non-empty string");
    }
    const endpoint = new URL(`coordinates/search/${query}.json`, defaults.maptilerApiURL);
    endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
    if ("limit" in options) {
      endpoint.searchParams.set("limit", options.limit.toString());
    }
    if ("transformations" in options) {
      endpoint.searchParams.set("transformations", options.transformations.toString());
    }
    if ("exports" in options) {
      endpoint.searchParams.set("exports", options.exports.toString());
    }
    const urlWithParams = endpoint.toString();
    const res = yield callFetch(urlWithParams);
    if (!res.ok) {
      throw new ServiceError(res, res.status in customMessages$2 ? customMessages$2[res.status] : "");
    }
    const obj = yield res.json();
    return obj;
  });
}
function transform(_0) {
  return __async(this, arguments, function* (positions, options = {}) {
    const coordinatesStr = (Array.isArray(positions[0]) ? positions : [positions]).map((coord) => `${coord[0]},${coord[1]}`).join(";");
    const endpoint = new URL(`coordinates/transform/${coordinatesStr}.json`, defaults.maptilerApiURL);
    endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
    if ("sourceCrs" in options) {
      endpoint.searchParams.set("s_srs", options.sourceCrs.toString());
    }
    if ("targetCrs" in options) {
      endpoint.searchParams.set("t_srs", options.targetCrs.toString());
    }
    if ("operations" in options) {
      endpoint.searchParams.set("ops", (Array.isArray(options.operations) ? options.operations : [options.operations]).join("|"));
    }
    const urlWithParams = endpoint.toString();
    const res = yield callFetch(urlWithParams);
    if (!res.ok) {
      throw new ServiceError(res, res.status in customMessages$2 ? customMessages$2[res.status] : "");
    }
    const obj = yield res.json();
    return obj;
  });
}
var coordinates = {
  search,
  transform
};
var customMessages$1 = {
  403: "Key is missing, invalid or restricted"
};
function get(_0) {
  return __async(this, arguments, function* (dataId, options = {}) {
    if (typeof dataId !== "string" || dataId.trim().length === 0) {
      throw new Error("The data ID must be a non-empty string");
    }
    const endpoint = new URL(`data/${encodeURIComponent(dataId)}/features.json`, defaults.maptilerApiURL);
    endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
    const urlWithParams = endpoint.toString();
    const res = yield callFetch(urlWithParams);
    if (!res.ok) {
      throw new ServiceError(res, res.status in customMessages$1 ? customMessages$1[res.status] : "");
    }
    const obj = yield res.json();
    return obj;
  });
}
var data = {
  get
};
function expandMapStyle(style) {
  const maptilerDomainRegex = /^maptiler:\/\/(.*)/;
  let match;
  const trimmed = style.trim();
  let expandedStyle;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    expandedStyle = trimmed;
  } else if ((match = maptilerDomainRegex.exec(trimmed)) !== null) {
    expandedStyle = `https://api.maptiler.com/maps/${match[1]}/style.json`;
  } else {
    expandedStyle = `https://api.maptiler.com/maps/${trimmed}/style.json`;
  }
  return expandedStyle;
}
var MapStyleVariant = class {
  constructor(name, variantType, id, referenceStyle, description, imageURL) {
    this.name = name;
    this.variantType = variantType;
    this.id = id;
    this.referenceStyle = referenceStyle;
    this.description = description;
    this.imageURL = imageURL;
  }
  /**
   * Get the human-friendly name
   * @returns
   */
  getName() {
    return this.name;
  }
  getFullName() {
    return `${this.referenceStyle.getName()} ${this.name}`;
  }
  /**
   * Get the variant type (eg. "DEFAULT", "DARK", "PASTEL", etc.)
   * @returns
   */
  getType() {
    return this.variantType;
  }
  /**
   * Get the MapTiler Cloud id
   * @returns
   */
  getId() {
    return this.id;
  }
  /**
   * Get the human-friendly description
   */
  getDescription() {
    return this.description;
  }
  /**
   * Get the reference style this variant belongs to
   * @returns
   */
  getReferenceStyle() {
    return this.referenceStyle;
  }
  /**
   * Check if a variant of a given type exists for _this_ variants
   * (eg. if this is a "DARK", then we can check if there is a "LIGHT" variant of it)
   * @param variantType
   * @returns
   */
  hasVariant(variantType) {
    return this.referenceStyle.hasVariant(variantType);
  }
  /**
   * Retrieve the variant of a given type. If not found, will return the "DEFAULT" variant.
   * (eg. _this_ "DARK" variant does not have any "PASTEL" variant, then the "DEFAULT" is returned)
   * @param variantType
   * @returns
   */
  getVariant(variantType) {
    return this.referenceStyle.getVariant(variantType);
  }
  /**
   * Get all the variants for _this_ variants, except _this_ current one
   * @returns
   */
  getVariants() {
    return this.referenceStyle.getVariants().filter((v) => v !== this);
  }
  /**
   * Get the image URL that represent _this_ variant
   * @returns
   */
  getImageURL() {
    return this.imageURL;
  }
  /**
   * Get the style as usable by MapLibre, a string (URL) or a plain style description (StyleSpecification)
   * @returns
   */
  getExpandedStyleURL() {
    return expandMapStyle(this.getId());
  }
};
var ReferenceMapStyle = class {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.variants = {};
    this.orderedVariants = [];
  }
  /**
   * Get the human-friendly name of this reference style
   * @returns
   */
  getName() {
    return this.name;
  }
  /**
   * Get the id of _this_ reference style
   * @returns
   */
  getId() {
    return this.id;
  }
  /**
   * Add a variant to _this_ reference style
   * @param v
   */
  addVariant(v) {
    this.variants[v.getType()] = v;
    this.orderedVariants.push(v);
  }
  /**
   * Check if a given variant type exists for this reference style
   * @param variantType
   * @returns
   */
  hasVariant(variantType) {
    return variantType in this.variants;
  }
  /**
   * Get a given variant. If the given type of variant does not exist for this reference style,
   * then the most relevant default variant is returned instead
   * @param variantType
   * @returns
   */
  getVariant(variantType) {
    return variantType in this.variants ? this.variants[variantType] : this.orderedVariants[0];
  }
  /**
   * Get the list of variants for this reference style
   * @returns
   */
  getVariants() {
    return Object.values(this.variants);
  }
  /**
   * Get the defualt variant for this reference style
   * @returns
   */
  getDefaultVariant() {
    return this.orderedVariants[0];
  }
};
var mapStylePresetList = [{
  referenceStyleID: "STREETS",
  name: "Streets",
  description: "",
  variants: [{
    id: "streets-v2",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "streets-v2-dark",
    name: "Dark",
    variantType: "DARK",
    description: "",
    imageURL: ""
  }, {
    id: "streets-v2-light",
    name: "Light",
    variantType: "LIGHT",
    description: "",
    imageURL: ""
  }, {
    id: "streets-v2-night",
    name: "Night",
    variantType: "NIGHT",
    description: "",
    imageURL: ""
  }, {
    id: "streets-v2-pastel",
    name: "Pastel",
    variantType: "PASTEL",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "OUTDOOR",
  name: "Outdoor",
  description: "",
  variants: [{
    id: "outdoor-v2",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "outdoor-v2-dark",
    name: "Dark",
    variantType: "DARK",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "WINTER",
  name: "Winter",
  description: "",
  variants: [{
    id: "winter-v2",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "winter-v2-dark",
    name: "Dark",
    variantType: "DARK",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "SATELLITE",
  name: "Satellite",
  description: "",
  variants: [{
    id: "satellite",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "HYBRID",
  name: "Hybrid",
  description: "",
  variants: [{
    id: "hybrid",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "BASIC",
  name: "Basic",
  description: "",
  variants: [{
    id: "basic-v2",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "basic-v2-dark",
    name: "Dark",
    variantType: "DARK",
    description: "",
    imageURL: ""
  }, {
    id: "basic-v2-light",
    name: "Light",
    variantType: "LIGHT",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "BRIGHT",
  name: "Bright",
  description: "",
  variants: [{
    id: "bright-v2",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "bright-v2-dark",
    name: "Dark",
    variantType: "DARK",
    description: "",
    imageURL: ""
  }, {
    id: "bright-v2-light",
    name: "Light",
    variantType: "LIGHT",
    description: "",
    imageURL: ""
  }, {
    id: "bright-v2-pastel",
    name: "Pastel",
    variantType: "PASTEL",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "OPENSTREETMAP",
  name: "OpenStreetMap",
  description: "",
  variants: [{
    id: "openstreetmap",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "TOPO",
  name: "Topo",
  description: "",
  variants: [{
    id: "topo-v2",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "topo-v2-dark",
    name: "Dark",
    variantType: "DARK",
    description: "",
    imageURL: ""
  }, {
    id: "topo-v2-shiny",
    name: "Shiny",
    variantType: "SHINY",
    description: "",
    imageURL: ""
  }, {
    id: "topo-v2-pastel",
    name: "Pastel",
    variantType: "PASTEL",
    description: "",
    imageURL: ""
  }, {
    id: "topo-v2-topographique",
    name: "Topographique",
    variantType: "TOPOGRAPHIQUE",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "VOYAGER",
  name: "Voyager",
  description: "",
  variants: [{
    id: "voyager-v2",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "voyager-v2-darkmatter",
    name: "Darkmatter",
    variantType: "DARK",
    description: "",
    imageURL: ""
  }, {
    id: "voyager-v2-positron",
    name: "Positron",
    variantType: "LIGHT",
    description: "",
    imageURL: ""
  }, {
    id: "voyager-v2-vintage",
    name: "Vintage",
    variantType: "VINTAGE",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "TONER",
  name: "Toner",
  description: "",
  variants: [{
    id: "toner-v2",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "toner-v2-background",
    name: "Background",
    variantType: "BACKGROUND",
    description: "",
    imageURL: ""
  }, {
    id: "toner-v2-lite",
    name: "Lite",
    variantType: "LITE",
    description: "",
    imageURL: ""
  }, {
    id: "toner-v2-lines",
    name: "Lines",
    variantType: "LINES",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "DATAVIZ",
  name: "Dataviz",
  description: "",
  variants: [{
    id: "dataviz",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "dataviz-dark",
    name: "Dark",
    variantType: "DARK",
    description: "",
    imageURL: ""
  }, {
    id: "dataviz-light",
    name: "Light",
    variantType: "LIGHT",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "BACKDROP",
  name: "Backdrop",
  description: "",
  variants: [{
    id: "backdrop",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }, {
    id: "backdrop-dark",
    name: "Dark",
    variantType: "DARK",
    description: "",
    imageURL: ""
  }, {
    id: "backdrop-light",
    name: "Light",
    variantType: "LIGHT",
    description: "",
    imageURL: ""
  }]
}, {
  referenceStyleID: "OCEAN",
  name: "Ocean",
  description: "",
  variants: [{
    id: "ocean",
    name: "Default",
    variantType: "DEFAULT",
    description: "",
    imageURL: ""
  }]
}];
function makeReferenceStyleProxy(referenceStyle) {
  return new Proxy(referenceStyle, {
    get(target, prop, receiver) {
      if (target.hasVariant(prop)) {
        return target.getVariant(prop);
      }
      if (prop.toString().toUpperCase() === prop) {
        return referenceStyle.getDefaultVariant();
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
function buildMapStyles() {
  const mapStyle = {};
  for (let i = 0; i < mapStylePresetList.length; i += 1) {
    const refStyleInfo = mapStylePresetList[i];
    const refStyle = makeReferenceStyleProxy(new ReferenceMapStyle(refStyleInfo.name, refStyleInfo.referenceStyleID));
    for (let j = 0; j < refStyleInfo.variants.length; j += 1) {
      const variantInfo = refStyleInfo.variants[j];
      const variant = new MapStyleVariant(
        variantInfo.name,
        // name
        variantInfo.variantType,
        // variantType
        variantInfo.id,
        // id
        refStyle,
        // referenceStyle
        variantInfo.description,
        variantInfo.imageURL
        // imageURL
      );
      refStyle.addVariant(variant);
    }
    mapStyle[refStyleInfo.referenceStyleID] = refStyle;
  }
  return mapStyle;
}
function styleToStyle(style) {
  if (!style) {
    return MapStyle[mapStylePresetList[0].referenceStyleID].getDefaultVariant().getId();
  }
  if (typeof style === "string" || style instanceof String) {
    return style.trim().toLowerCase();
  }
  if (style instanceof MapStyleVariant) {
    return style.getId();
  }
  if (style instanceof ReferenceMapStyle) {
    return style.getDefaultVariant().getId();
  }
}
var MapStyle = buildMapStyles();
function extractLineStrings(geoJson) {
  const lineStrings = [];
  function extractFromGeometry(geometry) {
    if (geometry.type === "LineString" || geometry.type === "MultiLineString") {
      lineStrings.push(geometry);
    }
  }
  function extractFromFeature(feature) {
    if (feature.geometry) {
      extractFromGeometry(feature.geometry);
    }
  }
  function extractFromFeatureCollection(collection) {
    for (const feature of collection.features) {
      if (feature.type === "Feature") {
        extractFromFeature(feature);
      } else if (feature.type === "FeatureCollection") {
        extractFromFeatureCollection(feature);
      }
    }
  }
  if (geoJson.type === "Feature") {
    extractFromFeature(geoJson);
  } else if (geoJson.type === "FeatureCollection") {
    extractFromFeatureCollection(geoJson);
  } else {
    extractFromGeometry(geoJson);
  }
  return lineStrings;
}
function getSqSegDist(p, p1, p2) {
  let x2 = p1[0], y = p1[1], dx = p2[0] - x2, dy = p2[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x2) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x2 = p2[0];
      y = p2[1];
    } else if (t > 0) {
      x2 += dx * t;
      y += dy * t;
    }
  }
  dx = p[0] - x2;
  dy = p[1] - y;
  return dx * dx + dy * dy;
}
function simplifyDPStep(points, first, last, sqTolerance, simplified) {
  let maxSqDist = sqTolerance, index;
  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);
    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }
  if (maxSqDist > sqTolerance) {
    if (index - first > 1) {
      simplifyDPStep(points, first, index, sqTolerance, simplified);
    }
    simplified.push(points[index]);
    if (last - index > 1) {
      simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
  }
}
function simplifyDouglasPeucker(points, sqTolerance) {
  const last = points.length - 1;
  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);
  return simplified;
}
function simplify(points, tolerance) {
  if (points.length <= 2) {
    return points;
  }
  const sqTolerance = tolerance !== void 0 ? tolerance * tolerance : 1;
  const simplePoints = simplifyDouglasPeucker(points, sqTolerance);
  return simplePoints;
}
var misc = {
  extractLineStrings,
  simplify
};
function staticMapMarkerToString(marker, includeColor = true) {
  let str = `${marker[0]},${marker[1]}`;
  if (marker.length === 3 && includeColor) {
    str += `,${marker[2]}`;
  }
  return str;
}
function simplifyAndStringify(path, maxNbChar = 3e3) {
  let str = path.map((point) => point.join(",")).join("|");
  let tolerance = 5e-6;
  const toleranceStep = 1e-5;
  while (str.length > maxNbChar) {
    const simplerPath = misc.simplify(path, tolerance);
    str = simplerPath.map((point) => `${point[0]},${point[1]}`).join("|");
    tolerance += toleranceStep;
  }
  return str;
}
function centered(center, zoom, options = {}) {
  const style = styleToStyle(options.style);
  const scale = options.hiDPI ? "@2x" : "";
  const format = options.format ?? "png";
  let width = ~~(options.width ?? 1024);
  let height = ~~(options.height ?? 1024);
  if (options.hiDPI) {
    width = ~~(width / 2);
    height = ~~(height / 2);
  }
  const endpoint = new URL(`maps/${encodeURIComponent(style)}/static/${center[0]},${center[1]},${zoom}/${width}x${height}${scale}.${format}`, defaults.maptilerApiURL);
  if ("attribution" in options) {
    endpoint.searchParams.set("attribution", options.attribution.toString());
  }
  if ("markers" in options) {
    let markerStr = "";
    const hasIcon = "markerIcon" in options;
    if (hasIcon) {
      markerStr += `icon:${options.markerIcon}|`;
    }
    if (hasIcon && "markerAnchor" in options) {
      markerStr += `anchor:${options.markerAnchor}|`;
    }
    if (hasIcon && options.hiDPI) {
      markerStr += `scale:2|`;
    }
    const markerList = Array.isArray(options.markers[0]) ? options.markers : [options.markers];
    markerStr += markerList.map((m) => staticMapMarkerToString(m, !hasIcon)).join("|");
    endpoint.searchParams.set("markers", markerStr);
  }
  if ("path" in options) {
    let pathStr = "";
    pathStr += `fill:${options.pathFillColor ?? "none"}|`;
    if ("pathStrokeColor" in options) {
      pathStr += `stroke:${options.pathStrokeColor}|`;
    }
    if ("pathWidth" in options) {
      const pathWidth = options.pathWidth / (options.hiDPI ? 2 : 1);
      pathStr += `width:${pathWidth.toString()}|`;
    }
    pathStr += simplifyAndStringify(options.path);
    endpoint.searchParams.set("path", pathStr);
  }
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
  return endpoint.toString();
}
function bounded(boundingBox, options = {}) {
  const style = styleToStyle(options.style);
  const scale = options.hiDPI ? "@2x" : "";
  const format = options.format ?? "png";
  let width = ~~(options.width ?? 1024);
  let height = ~~(options.height ?? 1024);
  if (options.hiDPI) {
    width = ~~(width / 2);
    height = ~~(height / 2);
  }
  const endpoint = new URL(`maps/${encodeURIComponent(style)}/static/${boundingBox[0]},${boundingBox[1]},${boundingBox[2]},${boundingBox[3]}/${width}x${height}${scale}.${format}`, defaults.maptilerApiURL);
  if ("attribution" in options) {
    endpoint.searchParams.set("attribution", options.attribution.toString());
  }
  if ("padding" in options) {
    endpoint.searchParams.set("padding", options.padding.toString());
  }
  if ("markers" in options) {
    let markerStr = "";
    const hasIcon = "markerIcon" in options;
    if (hasIcon) {
      markerStr += `icon:${options.markerIcon}|`;
    }
    if (hasIcon && "markerAnchor" in options) {
      markerStr += `anchor:${options.markerAnchor}|`;
    }
    if (hasIcon && options.hiDPI) {
      markerStr += `scale:2|`;
    }
    const markerList = Array.isArray(options.markers[0]) ? options.markers : [options.markers];
    markerStr += markerList.map((m) => staticMapMarkerToString(m, !hasIcon)).join("|");
    endpoint.searchParams.set("markers", markerStr);
  }
  if ("path" in options) {
    let pathStr = "";
    pathStr += `fill:${options.pathFillColor ?? "none"}|`;
    if ("pathStrokeColor" in options) {
      pathStr += `stroke:${options.pathStrokeColor}|`;
    }
    if ("pathWidth" in options) {
      const pathWidth = options.pathWidth / (options.hiDPI ? 2 : 1);
      pathStr += `width:${pathWidth.toString()}|`;
    }
    pathStr += simplifyAndStringify(options.path);
    endpoint.searchParams.set("path", pathStr);
  }
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
  return endpoint.toString();
}
function automatic(options = {}) {
  if (!("markers" in options) && !("path" in options)) {
    throw new Error("Automatic static maps require markers and/or path to be created.");
  }
  const style = styleToStyle(options.style);
  const scale = options.hiDPI ? "@2x" : "";
  const format = options.format ?? "png";
  let width = ~~(options.width ?? 1024);
  let height = ~~(options.height ?? 1024);
  if (options.hiDPI) {
    width = ~~(width / 2);
    height = ~~(height / 2);
  }
  const endpoint = new URL(`maps/${encodeURIComponent(style)}/static/auto/${width}x${height}${scale}.${format}`, defaults.maptilerApiURL);
  if ("attribution" in options) {
    endpoint.searchParams.set("attribution", options.attribution.toString());
  }
  if ("padding" in options) {
    endpoint.searchParams.set("padding", options.padding.toString());
  }
  if ("markers" in options) {
    let markerStr = "";
    const hasIcon = "markerIcon" in options;
    if (hasIcon) {
      markerStr += `icon:${options.markerIcon}|`;
    }
    if (hasIcon && "markerAnchor" in options) {
      markerStr += `anchor:${options.markerAnchor}|`;
    }
    if (hasIcon && options.hiDPI) {
      markerStr += `scale:2|`;
    }
    const markerList = Array.isArray(options.markers[0]) ? options.markers : [options.markers];
    markerStr += markerList.map((m) => staticMapMarkerToString(m, !hasIcon)).join("|");
    endpoint.searchParams.set("markers", markerStr);
  }
  if ("path" in options) {
    let pathStr = "";
    pathStr += `fill:${options.pathFillColor ?? "none"}|`;
    if ("pathStrokeColor" in options) {
      pathStr += `stroke:${options.pathStrokeColor}|`;
    }
    if ("pathWidth" in options) {
      const pathWidth = options.pathWidth / (options.hiDPI ? 2 : 1);
      pathStr += `width:${pathWidth.toString()}|`;
    }
    pathStr += simplifyAndStringify(options.path);
    endpoint.searchParams.set("path", pathStr);
  }
  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);
  return endpoint.toString();
}
var staticMaps = {
  centered,
  bounded,
  automatic
};
var EARTH_RADIUS = 63710088e-1;
var EARTH_CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS;
function longitudeToMercatorX(lng) {
  return (180 + lng) / 360;
}
function latitudeToMercatorY(lat) {
  return (180 - 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))) / 360;
}
function wgs84ToMercator(position) {
  const wrappedPos = wrapWgs84(position);
  return [longitudeToMercatorX(wrappedPos[0]), latitudeToMercatorY(wrappedPos[1])];
}
function mercatorXToLongitude(x2) {
  return x2 * 360 - 180;
}
function mercatorYToLatitude(y) {
  const y2 = 180 - y * 360;
  return 360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90;
}
function mercatorToWgs84(position) {
  return [mercatorXToLongitude(position[0]), mercatorYToLatitude(position[1])];
}
function haversineDistanceWgs84(from, to2) {
  const rad = Math.PI / 180;
  const lat1 = from[1] * rad;
  const lat2 = to2[1] * rad;
  const a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos((to2[0] - from[0]) * rad);
  const maxMeters = EARTH_RADIUS * Math.acos(Math.min(a, 1));
  return maxMeters;
}
function haversineCumulatedDistanceWgs84(positions) {
  const cumulatedDistance = Array(positions.length);
  cumulatedDistance[0] = 0;
  const l = cumulatedDistance.length;
  for (let i = 1; i < l; i++) {
    cumulatedDistance[i] = haversineDistanceWgs84(positions[i - 1], positions[i]) + cumulatedDistance[i - 1];
  }
  return cumulatedDistance;
}
function wrapWgs84(position) {
  const lng = position[0];
  const lat = position[1];
  const d = 360;
  const w = ((lng + 180) % d + d) % d - 180;
  const wrapLong = w === -180 ? 180 : w;
  return [wrapLong, lat];
}
function circumferenceAtLatitude(latitude) {
  return EARTH_CIRCUMFERENCE * Math.cos(latitude * Math.PI / 180);
}
function mercatorToTileIndex(position, zoom, strict = true) {
  const numberOfTilePerAxis = 2 ** zoom;
  const fIndex = [position[0] * numberOfTilePerAxis, position[1] * numberOfTilePerAxis];
  return strict ? [~~fIndex[0], ~~fIndex[1]] : fIndex;
}
function wgs84ToTileIndex(position, zoom, strict = true) {
  const merc = wgs84ToMercator(position);
  return mercatorToTileIndex(merc, zoom, strict);
}
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}
function haversineIntermediateWgs84(pos1, pos2, ratio) {
  const d = haversineDistanceWgs84(pos1, pos2);
  const λ1 = toRadians(pos1[0]);
  const φ1 = toRadians(pos1[1]);
  const λ2 = toRadians(pos2[0]);
  const φ2 = toRadians(pos2[1]);
  const δ = d / EARTH_RADIUS;
  const a = Math.sin((1 - ratio) * δ) / Math.sin(δ);
  const b = Math.sin(ratio * δ) / Math.sin(δ);
  const x2 = a * Math.cos(φ1) * Math.cos(λ1) + b * Math.cos(φ2) * Math.cos(λ2);
  const y = a * Math.cos(φ1) * Math.sin(λ1) + b * Math.cos(φ2) * Math.sin(λ2);
  const z2 = a * Math.sin(φ1) + b * Math.sin(φ2);
  const φ3 = Math.atan2(z2, Math.sqrt(x2 * x2 + y * y));
  const λ3 = Math.atan2(y, x2);
  return [toDegrees(λ3), toDegrees(φ3)];
}
var math = {
  EARTH_RADIUS,
  EARTH_CIRCUMFERENCE,
  longitudeToMercatorX,
  latitudeToMercatorY,
  wgs84ToMercator,
  mercatorXToLongitude,
  mercatorYToLatitude,
  mercatorToWgs84,
  haversineDistanceWgs84,
  wrapWgs84,
  circumferenceAtLatitude,
  mercatorToTileIndex,
  wgs84ToTileIndex,
  toRadians,
  toDegrees,
  haversineIntermediateWgs84,
  haversineCumulatedDistanceWgs84
};
var tileCache = null;
function getTileCache() {
  if (!tileCache) {
    tileCache = new QuickLRU({
      maxSize: config.tileCacheSize
    });
  }
  return tileCache;
}
function bufferToPixelDataBrowser(buff) {
  return __async(this, null, function* () {
    const blob = new Blob([buff]);
    const imageBitmap = yield createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return {
      pixels: imageData.data,
      width: canvas.width,
      height: canvas.height,
      components: imageData.data.length / (canvas.width * canvas.height)
    };
  });
}
function getBufferToPixelDataParser() {
  if (config.bufferToPixelData) {
    return config.bufferToPixelData;
  }
  if (typeof window !== "undefined") {
    return bufferToPixelDataBrowser;
  }
  throw new Error("An image file buffer to pixel data parser is necessary. Specify it in `config.bufferToPixelData`");
}
var terrainTileJsonURL = "tiles/terrain-rgb-v2/tiles.json";
var terrainTileJson = null;
var customMessages = {
  403: "Key is missing, invalid or restricted"
};
function fetchTerrainTileJson(apiKey) {
  return __async(this, null, function* () {
    const endpoint = new URL(terrainTileJsonURL, defaults.maptilerApiURL);
    endpoint.searchParams.set("key", apiKey);
    const urlWithParams = endpoint.toString();
    const res = yield callFetch(urlWithParams);
    if (res.ok) {
      terrainTileJson = yield res.json();
      return terrainTileJson;
    } else {
      if (!res.ok) {
        throw new ServiceError(res, customMessages[res.status] ?? "");
      }
    }
  });
}
function at(_0) {
  return __async(this, arguments, function* (position, options = {}) {
    const apiKey = options.apiKey ?? config.apiKey;
    if (!terrainTileJson) {
      yield fetchTerrainTileJson(apiKey);
    }
    const maxZoom = terrainTileJson.maxzoom;
    let zoom = ~~(options.zoom ?? maxZoom);
    if (zoom > maxZoom || zoom < 0) {
      zoom = maxZoom;
    }
    const tileIndex = math.wgs84ToTileIndex(position, zoom, false);
    const tileX = ~~tileIndex[0];
    const tileY = ~~tileIndex[1];
    if (!terrainTileJson.tiles.length) {
      throw new Error("Terrain tileJSON tile list is empty.");
    }
    const tileID = `terrain_${zoom.toString()}_${tileX.toString()}_${tileY.toString()}`;
    let tilePixelData;
    const cache = getTileCache();
    if (cache.has(tileID)) {
      tilePixelData = cache.get(tileID);
    } else {
      const tileURL = terrainTileJson.tiles[0].replace("{x}", tileX.toString()).replace("{y}", tileY.toString()).replace("{z}", zoom.toString());
      const tileRes = yield callFetch(tileURL);
      if (!tileRes.ok) {
        throw new ServiceError(tileRes, customMessages[tileRes.status] ?? "");
      }
      const tileBuff = yield tileRes.arrayBuffer();
      const tileParser = getBufferToPixelDataParser();
      tilePixelData = yield tileParser(tileBuff);
      cache.set(tileID, tilePixelData);
    }
    const pixelX = ~~(tilePixelData.width * (tileIndex[0] % 1));
    const pixelY = ~~(tilePixelData.height * (tileIndex[1] % 1));
    const pixelDataIndex = (pixelY * tilePixelData.width + pixelX) * tilePixelData.components;
    const R = tilePixelData.pixels[pixelDataIndex];
    const G2 = tilePixelData.pixels[pixelDataIndex + 1];
    const B2 = tilePixelData.pixels[pixelDataIndex + 2];
    const elevation2 = -1e4 + (R * 256 * 256 + G2 * 256 + B2) * 0.1;
    return [position[0], position[1], elevation2];
  });
}
function batch(_0) {
  return __async(this, arguments, function* (positions, options = {}) {
    const apiKey = options.apiKey ?? config.apiKey;
    if (!terrainTileJson) {
      yield fetchTerrainTileJson(apiKey);
    }
    const tileParser = getBufferToPixelDataParser();
    const tileURLSchema = terrainTileJson.tiles[0];
    const cache = getTileCache();
    const maxZoom = terrainTileJson.maxzoom;
    let zoom = ~~(options.zoom ?? maxZoom);
    if (zoom > maxZoom || zoom < 0) {
      zoom = maxZoom;
    }
    const tileIndicesFloats = positions.map((position) => math.wgs84ToTileIndex(position, zoom, false));
    const tileIndicesInteger = tileIndicesFloats.map((index) => [~~index[0], ~~index[1]]);
    const tileIDs = tileIndicesInteger.map((index) => `terrain_${zoom.toString()}_${index[0].toString()}_${index[1].toString()}`);
    const uniqueTilesToFetch = Array.from(new Set(tileIDs.filter((tileID) => !cache.has(tileID)))).map((tileID) => tileID.split("_").slice(1));
    const tileURLs = uniqueTilesToFetch.map((zxy) => tileURLSchema.replace("{x}", zxy[1].toString()).replace("{y}", zxy[2].toString()).replace("{z}", zxy[0].toString()));
    const promisesFetchTiles = tileURLs.map((url) => callFetch(url));
    const resTiles = yield Promise.allSettled(promisesFetchTiles);
    const fulfilledRes = resTiles.map((el2) => el2.status === "fulfilled" ? el2.value : null).filter((res) => res);
    const fulfilledRButNotOkRes = fulfilledRes.filter((res) => !res.ok);
    if (fulfilledRes.length !== promisesFetchTiles.length) {
      throw new Error("Some tiles could not be fetched.");
    }
    if (fulfilledRButNotOkRes.length) {
      throw new ServiceError(fulfilledRButNotOkRes[0], customMessages[fulfilledRButNotOkRes[0].status] ?? "");
    }
    const tileArrayBuffers = yield Promise.all(fulfilledRes.map((res) => res.arrayBuffer()));
    if (!tileArrayBuffers.every((buff) => buff.byteLength > 0)) {
      throw new Error("Some tiles are not available.");
    }
    const tilePixelDatas = yield Promise.all(tileArrayBuffers.map((buff) => tileParser(buff)));
    tilePixelDatas.forEach((tilePixelData, i) => {
      const zxy = uniqueTilesToFetch[i];
      const tileID = `terrain_${zxy[0].toString()}_${zxy[1].toString()}_${zxy[2].toString()}`;
      cache.set(tileID, tilePixelData);
    });
    const elevatedPositions = positions.map((position, i) => {
      const tileID = tileIDs[i];
      const tileIndexFloat = tileIndicesFloats[i];
      const tilePixelData = cache.get(tileID);
      const pixelX = Math.min(Math.round(tilePixelData.width * (tileIndexFloat[0] % 1)), tilePixelData.width - 1);
      const pixelY = Math.min(Math.round(tilePixelData.height * (tileIndexFloat[1] % 1)), tilePixelData.height - 1);
      const pixelDataIndex = (pixelY * tilePixelData.width + pixelX) * tilePixelData.components;
      const R = tilePixelData.pixels[pixelDataIndex];
      const G2 = tilePixelData.pixels[pixelDataIndex + 1];
      const B2 = tilePixelData.pixels[pixelDataIndex + 2];
      const elevation2 = -1e4 + (R * 256 * 256 + G2 * 256 + B2) * 0.1;
      return [position[0], position[1], ~~(elevation2 * 1e3) / 1e3];
    });
    if (options.smoothingKernelSize) {
      const kernelSize = ~~(options.smoothingKernelSize / 2) * 2 + 1;
      const elevations = elevatedPositions.map((pos) => pos[2]);
      const kernelSpan = ~~(kernelSize / 2);
      for (let i = kernelSpan; i < elevations.length - kernelSpan - 1; i += 1) {
        let sum = 0;
        for (let j = 0; j < kernelSize; j += 1) {
          const elev = elevations[i - kernelSpan + j];
          sum += elev;
        }
        sum /= kernelSize;
        elevatedPositions[i][2] = sum;
      }
    }
    return elevatedPositions;
  });
}
function fromLineString(_0) {
  return __async(this, arguments, function* (ls2, options = {}) {
    if (ls2.type !== "LineString") {
      throw new Error("The provided object is not a GeoJSON LineString");
    }
    const clone = structuredClone(ls2);
    const elevatedPositions = yield batch(clone.coordinates, options);
    clone.coordinates = elevatedPositions;
    return clone;
  });
}
function fromMultiLineString(_0) {
  return __async(this, arguments, function* (ls2, options = {}) {
    if (ls2.type !== "MultiLineString") {
      throw new Error("The provided object is not a GeoJSON MultiLineString");
    }
    const clone = structuredClone(ls2);
    const multiLengths = clone.coordinates.map((poss) => poss.length);
    const flattenPositions = clone.coordinates.flat();
    const flattenPositionsElevated = yield batch(flattenPositions, options);
    const result = [];
    let index = 0;
    for (const length of multiLengths) {
      result.push(flattenPositionsElevated.slice(index, index + length));
      index += length;
    }
    clone.coordinates = result;
    return clone;
  });
}
var elevation = {
  at,
  batch,
  fromLineString,
  fromMultiLineString
};

// node_modules/@maptiler/sdk/dist/maptiler-sdk.mjs
import Ra from "events";

// node_modules/uuid/dist/esm/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

// node_modules/uuid/dist/esm/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/uuid/dist/esm/parse.js
function parse(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v;
  return Uint8Array.of((v = parseInt(uuid.slice(0, 8), 16)) >>> 24, v >>> 16 & 255, v >>> 8 & 255, v & 255, (v = parseInt(uuid.slice(9, 13), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(14, 18), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(19, 23), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255, v / 4294967296 & 255, v >>> 24 & 255, v >>> 16 & 255, v >>> 8 & 255, v & 255);
}
var parse_default = parse;

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
import { randomFillSync } from "crypto";
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/md5.js
import { createHash } from "crypto";
function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === "string") {
    bytes = Buffer.from(bytes, "utf8");
  }
  return createHash("md5").update(bytes).digest();
}
var md5_default = md5;

// node_modules/uuid/dist/esm/v35.js
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str));
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; ++i) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}
var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
var URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
function v35(version2, hash, value, namespace, buf, offset) {
  const valueBytes = typeof value === "string" ? stringToBytes(value) : value;
  const namespaceBytes = typeof namespace === "string" ? parse_default(namespace) : namespace;
  if (typeof namespace === "string") {
    namespace = parse_default(namespace);
  }
  if (namespace?.length !== 16) {
    throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
  }
  let bytes = new Uint8Array(16 + valueBytes.length);
  bytes.set(namespaceBytes);
  bytes.set(valueBytes, namespaceBytes.length);
  bytes = hash(bytes);
  bytes[6] = bytes[6] & 15 | version2;
  bytes[8] = bytes[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = bytes[i];
    }
    return buf;
  }
  return unsafeStringify(bytes);
}

// node_modules/uuid/dist/esm/v3.js
function v3(value, namespace, buf, offset) {
  return v35(48, md5_default, value, namespace, buf, offset);
}
v3.DNS = DNS;
v3.URL = URL2;

// node_modules/uuid/dist/esm/native.js
import { randomUUID } from "crypto";
var native_default = {
  randomUUID
};

// node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// node_modules/uuid/dist/esm/sha1.js
import { createHash as createHash2 } from "crypto";
function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === "string") {
    bytes = Buffer.from(bytes, "utf8");
  }
  return createHash2("sha1").update(bytes).digest();
}
var sha1_default = sha1;

// node_modules/uuid/dist/esm/v5.js
function v5(value, namespace, buf, offset) {
  return v35(80, sha1_default, value, namespace, buf, offset);
}
v5.DNS = DNS;
v5.URL = URL2;

// node_modules/js-base64/base64.mjs
var version = "3.7.7";
var VERSION = version;
var _hasBuffer = typeof Buffer === "function";
var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64chs = Array.prototype.slice.call(b64ch);
var b64tab = ((a) => {
  let tab = {};
  a.forEach((c, i) => tab[c] = i);
  return tab;
})(b64chs);
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var _fromCC = String.fromCharCode.bind(String);
var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it2) => new Uint8Array(Array.prototype.slice.call(it2, 0));
var _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
var _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
var btoaPolyfill = (bin) => {
  let u32, c0, c1, c2, asc = "";
  const pad = bin.length % 3;
  for (let i = 0; i < bin.length; ) {
    if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255) throw new TypeError("invalid character found");
    u32 = c0 << 16 | c1 << 8 | c2;
    asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
  }
  return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
var _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
var _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
  const maxargs = 4096;
  let strs = [];
  for (let i = 0, l = u8a.length; i < l; i += maxargs) {
    strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
  }
  return _btoa(strs.join(""));
};
var fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
var cb_utob = (c) => {
  if (c.length < 2) {
    var cc = c.charCodeAt(0);
    return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  } else {
    var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
    return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  }
};
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = (u) => u.replace(re_utob, cb_utob);
var _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
var encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
var encodeURI = (src) => encode(src, true);
var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
var cb_btou = (cccc) => {
  switch (cccc.length) {
    case 4:
      var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
      return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
    case 3:
      return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
    default:
      return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
  }
};
var btou = (b) => b.replace(re_btou, cb_btou);
var atobPolyfill = (asc) => {
  asc = asc.replace(/\s+/g, "");
  if (!b64re.test(asc)) throw new TypeError("malformed base64.");
  asc += "==".slice(2 - (asc.length & 3));
  let u24, bin = "", r1, r2;
  for (let i = 0; i < asc.length; ) {
    u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
    bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
  }
  return bin;
};
var _atob = typeof atob === "function" ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
var _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
var toUint8Array = (a) => _toUint8Array(_unURI(a));
var _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
var _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
var decode = (src) => _decode(_unURI(src));
var isValid = (src) => {
  if (typeof src !== "string") return false;
  const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
  return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
var _noEnum = (v) => {
  return {
    value: v,
    enumerable: false,
    writable: true,
    configurable: true
  };
};
var extendString = function() {
  const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
  _add("fromBase64", function() {
    return decode(this);
  });
  _add("toBase64", function(urlsafe) {
    return encode(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return encode(this, true);
  });
  _add("toBase64URL", function() {
    return encode(this, true);
  });
  _add("toUint8Array", function() {
    return toUint8Array(this);
  });
};
var extendUint8Array = function() {
  const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
  _add("toBase64", function(urlsafe) {
    return fromUint8Array(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return fromUint8Array(this, true);
  });
  _add("toBase64URL", function() {
    return fromUint8Array(this, true);
  });
};
var extendBuiltins = () => {
  extendString();
  extendUint8Array();
};
var gBase64 = {
  version,
  VERSION,
  atob: _atob,
  atobPolyfill,
  btoa: _btoa,
  btoaPolyfill,
  fromBase64: decode,
  toBase64: encode,
  encode,
  encodeURI,
  encodeURL: encodeURI,
  utob,
  btou,
  decode,
  isValid,
  fromUint8Array,
  toUint8Array,
  extendString,
  extendUint8Array,
  extendBuiltins
};

// node_modules/@maptiler/sdk/dist/maptiler-sdk.mjs
var Ta = Object.defineProperty;
var Er = (r) => {
  throw TypeError(r);
};
var Ia = (r, e, t) => e in r ? Ta(r, e, {
  enumerable: true,
  configurable: true,
  writable: true,
  value: t
}) : r[e] = t;
var L = (r, e, t) => Ia(r, typeof e != "symbol" ? e + "" : e, t);
var Pt = (r, e, t) => e.has(r) || Er("Cannot " + t);
var E = (r, e, t) => (Pt(r, e, "read from private field"), t ? t.call(r) : e.get(r));
var ye = (r, e, t) => e.has(r) ? Er("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t);
var Se = (r, e, t, n) => (Pt(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t);
var G = (r, e, t) => (Pt(r, e, "access private method"), t);
var Na = "@maptiler/sdk";
var Fa = "3.0.1";
var Oa = "The Javascript & TypeScript map SDK tailored for MapTiler Cloud";
var Da = "dist/maptiler-sdk.mjs";
var qa = "dist/maptiler-sdk.d.ts";
var Ba = "dist/maptiler-sdk.css";
var Ua = "module";
var Va = {
  ".": {
    import: "./dist/maptiler-sdk.mjs",
    types: "./dist/maptiler-sdk.d.ts"
  },
  "./dist/maptiler-sdk.css": {
    import: "./dist/maptiler-sdk.css"
  },
  "./style.css": {
    import: "./dist/maptiler-sdk.css"
  }
};
var Ga = ["maptiler", "map", "sdk", "webmap", "cloud", "webGL", "maplibre"];
var Ha = "https://docs.maptiler.com/sdk-js/";
var Ka = "BSD-3-Clause";
var Wa = {
  type: "git",
  url: "https://github.com/maptiler/maptiler-sdk-js.git"
};
var Za = {
  biome: "biome check --max-diagnostics=1000",
  "biome:fix": "npx @biomejs/biome check --max-diagnostics=1000 --write",
  doc: "rm -rf docs/* && typedoc --out docs && cp -r images docs/",
  test: "vitest run -c vite.config-test.ts",
  "build-css": "mkdir -p dist build && node scripts/replace-path-with-content.js src/style/style_template.css dist/tmp_maptiler-sdk.css && cat node_modules/maplibre-gl/dist/maplibre-gl.css dist/tmp_maptiler-sdk.css > dist/maptiler-sdk.css && rm dist/tmp_maptiler-sdk.css && cp dist/maptiler-sdk.css build/maptiler-sdk.css",
  "build-umd": "tsc && NODE_ENV=production vite build -c vite.config-umd.ts",
  "build-es": "tsc && NODE_ENV=production vite build -c vite.config-es.ts",
  build: "npm run build-es; npm run build-umd; npm run build-css",
  make: "npm run biome:fix && npm run build",
  dev: 'concurrently "vite -c vite.config-dev.ts" "npm run dev-umd"',
  "dev-umd": "npm run build-css && tsc && NODE_ENV=development vite build -w -c vite.config-umd.ts",
  ncu: "npx npm-check-updates"
};
var Ja = "MapTiler";
var Ya = {
  "@biomejs/biome": "1.9.4",
  "@types/uuid": "^10.0.0",
  "@types/xmldom": "^0.1.31",
  "@xmldom/xmldom": "^0.8.10",
  concurrently: "^9.1.2",
  typedoc: "^0.27.6",
  typescript: "^5.7.3",
  vite: "^6.0.7",
  "vite-plugin-dts": "^4.5.0",
  vitest: "^2.1.8"
};
var Xa = {
  "@maplibre/maplibre-gl-style-spec": "^23.0.0",
  "@maptiler/client": "^2.2.0",
  events: "^3.3.0",
  "js-base64": "^3.7.7",
  "maplibre-gl": "^5.0.1",
  uuid: "^11.0.5"
};
var wn = {
  name: Na,
  version: Fa,
  description: Oa,
  module: Da,
  types: qa,
  style: Ba,
  type: Ua,
  exports: Va,
  keywords: Ga,
  homepage: Ha,
  license: Ka,
  repository: Wa,
  scripts: Za,
  author: Ja,
  devDependencies: Ya,
  dependencies: Xa
};
var M = __spreadValues({
  /**
   * Language mode to display labels in both the local language and the language of the visitor's device, concatenated.
   * Note that if those two languages are the same, labels won't be duplicated.
   */
  VISITOR: {
    code: null,
    flag: "visitor",
    name: "Visitor",
    latin: true,
    isMode: true,
    geocoding: false
  },
  /**
   * Language mode to display labels in both the local language and English, concatenated.
   * Note that if those two languages are the same, labels won't be duplicated.
   */
  VISITOR_ENGLISH: {
    code: null,
    flag: "visitor_en",
    name: "Visitor English",
    latin: true,
    isMode: true,
    geocoding: false
  },
  /**
   * Language mode to display labels in a language enforced in the style.
   */
  STYLE: {
    code: null,
    flag: "style",
    name: "Style",
    latin: false,
    isMode: true,
    geocoding: false
  },
  /**
   * Language mode to display labels in a language enforced in the style. The language cannot be further modified.
   */
  STYLE_LOCK: {
    code: null,
    flag: "style_lock",
    name: "Style Lock",
    latin: false,
    isMode: true,
    geocoding: false
  }
}, Language);
function Pr() {
  if (typeof navigator > "u") {
    const e = Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0], t = getLanguageInfoFromCode(e);
    return t || M.ENGLISH;
  }
  return Array.from(new Set(navigator.languages.map((e) => e.split("-")[0]))).map((e) => getLanguageInfoFromCode(e)).filter((e) => e)[0] ?? M.LOCAL;
}
var V = {
  maptilerLogoURL: "https://api.maptiler.com/resources/logo.svg",
  maptilerURL: "https://www.maptiler.com/",
  maptilerApiHost: "api.maptiler.com",
  telemetryURL: "https://api.maptiler.com/metrics",
  rtlPluginURL: "https://cdn.maptiler.com/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.min.js",
  primaryLanguage: M.STYLE,
  secondaryLanguage: M.LOCAL,
  terrainSourceURL: "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json",
  terrainSourceId: "maptiler-terrain"
};
Object.freeze(V);
var nr = v4_default();
var Qa = class extends Ra {
  constructor() {
    super(...arguments);
    L(this, "primaryLanguage", V.primaryLanguage);
    L(this, "secondaryLanguage");
    L(this, "session", true);
    L(this, "caching", true);
    L(this, "telemetry", true);
    L(this, "_unit", "metric");
    L(this, "_apiKey", "");
  }
  /**
   * Set the unit system
   */
  set unit(t) {
    this._unit = t, this.emit("unit", t);
  }
  /**
   * Get the unit system
   */
  get unit() {
    return this._unit;
  }
  /**
   * Set the MapTiler Cloud API key
   */
  set apiKey(t) {
    this._apiKey = t, config.apiKey = t, this.emit("apiKey", t);
  }
  /**
   * Get the MapTiler Cloud API key
   */
  get apiKey() {
    return this._apiKey;
  }
  /**
   * Set a the custom fetch function to replace the default one
   */
  set fetch(t) {
    config.fetch = t;
  }
  /**
   * Get the fetch fucntion
   */
  get fetch() {
    return config.fetch;
  }
};
var F = new Qa();
var {
  addProtocol: Rr
} = import_maplibre_gl.default;
var Ht = "localcache_source";
var Kt = "localcache";
var eo = "maptiler_sdk";
var to = 1e3;
var ro = 100;
var Wt = typeof caches < "u";
function no(r, e) {
  if (Wt && F.caching && F.session && r.host === V.maptilerApiHost) {
    if (e === "Source" && r.href.includes("tiles.json")) return r.href.replace("https://", `${Ht}://`);
    if (e === "Tile" || e === "Glyphs") return r.href.replace("https://", `${Kt}://`);
  }
  return r.href;
}
var jt;
function Sn() {
  return __async(this, null, function* () {
    return jt || (jt = yield caches.open(eo)), jt;
  });
}
var $r = 0;
function ao() {
  return __async(this, null, function* () {
    const r = yield Sn(), e = yield r.keys(), t = e.slice(0, Math.max(e.length - to, 0));
    for (const n of t) r.delete(n);
  });
}
function oo() {
  Rr(Ht, (r, e) => __async(this, null, function* () {
    if (!r.url) throw new Error("");
    r.url = r.url.replace(`${Ht}://`, "https://");
    const t = r;
    t.signal = e.signal;
    const n = yield fetch(r.url, t), a = yield n.json();
    return a.tiles && a.tiles.length > 0 && (a.tiles[0] += `&last-modified=${n.headers.get("Last-Modified")}`), {
      data: a,
      cacheControl: n.headers.get("Cache-Control"),
      expires: n.headers.get("Expires")
    };
  })), Rr(Kt, (r, e) => __async(this, null, function* () {
    if (!r.url) throw new Error("");
    r.url = r.url.replace(`${Kt}://`, "https://");
    const t = new URL(r.url), n = new URL(t);
    n.searchParams.delete("mtsid"), n.searchParams.delete("key");
    const a = n.toString(), o = new URL(t);
    o.searchParams.delete("last-modified");
    const i = o.toString(), s = (m) => __async(this, null, function* () {
      return {
        data: yield m.arrayBuffer(),
        cacheControl: m.headers.get("Cache-Control"),
        expires: m.headers.get("Expires")
      };
    }), l = yield Sn(), u = yield l.match(a);
    if (u) return s(u);
    const c = r;
    c.signal = e.signal;
    const p = yield fetch(i, c);
    return p.status >= 200 && p.status < 300 && (l.put(a, p.clone()).catch(() => {
    }), ++$r > ro && (ao(), $r = 0)), s(p);
  }));
}
function io() {
  if (typeof window > "u") return;
  const r = import_maplibre_gl.default.getRTLTextPluginStatus();
  if (r === "unavailable" || r === "requested") try {
    import_maplibre_gl.default.setRTLTextPlugin(V.rtlPluginURL, true);
  } catch {
  }
}
function so(r, e) {
  for (const t of r) typeof e[t] == "function" && (e[t] = e[t].bind(e));
}
function pe(r, e, t) {
  const n = window.document.createElement(r);
  return e !== void 0 && (n.className = e), t && t.appendChild(n), n;
}
function ar(r) {
  r.parentNode && r.parentNode.removeChild(r);
}
function jr(r, e) {
  let t = null;
  try {
    t = new URL(r);
  } catch {
    return {
      url: r
    };
  }
  return t.host === V.maptilerApiHost && (t.searchParams.has("key") || t.searchParams.append("key", F.apiKey), F.session && t.searchParams.append("mtsid", nr)), {
    url: no(t, e)
  };
}
function Nr(r) {
  return (e, t) => {
    if (r != null) {
      const n = r(e, t), a = jr((n == null ? void 0 : n.url) ?? "", t);
      return __spreadValues(__spreadValues({}, n), a);
    }
    return jr(e, t);
  };
}
function xn() {
  return Math.random().toString(36).substring(2);
}
function ht(r) {
  return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(r);
}
function lo(r) {
  try {
    return JSON.parse(r);
  } catch {
  }
  return null;
}
function uo() {
  return document.createElement("canvas").getContext("webgl2") ? null : typeof WebGL2RenderingContext < "u" ? "Graphic rendering with WebGL2 has been disabled or is not supported by your graphic card. The map cannot be displayed." : "Your browser does not support graphic rendering with WebGL2. The map cannot be displayed.";
}
function co(r) {
  const e = uo();
  if (!e) return;
  let t = null;
  if (typeof r == "string" ? t = document.getElementById(r) : r instanceof HTMLElement && (t = r), !t) throw new Error("The Map container must be provided.");
  const n = document.createElement("div");
  throw n.innerHTML = e, n.classList.add("webgl-warning-div"), t.appendChild(n), new Error(e);
}
function po(r) {
  const e = "The WebGL context was lost.";
  let t = null;
  if (typeof r == "string" ? t = document.getElementById(r) : r instanceof HTMLElement && (t = r), !t) throw new Error("The Map container must be provided.");
  const n = document.createElement("div");
  n.innerHTML = e, n.classList.add("webgl-warning-div"), t.appendChild(n);
}
function Fr(r, e) {
  return !(!Array.isArray(r) || r.length !== 2 || r[0] !== "get" || typeof r[1] != "string" || e && !r[1].startsWith("name:") || !e && r[1] !== "name");
}
function fo(r, e, t) {
  const n = structuredClone(r), a = (o) => {
    if (typeof o != "string") for (let i = 0; i < o.length; i += 1) Fr(o[i], t) ? o[i] = structuredClone(e) : a(o[i]);
  };
  return Fr(n, t) ? e : (a(n), n);
}
function yo(r, e) {
  const t = e ? /\{name:\S+\}/ : /\{name\}/;
  return {
    contains: t.test(r),
    exactMatch: new RegExp(`^${t.source}$`).test(r)
  };
}
function mo(r, e, t) {
  const n = t ? /\{name:\S+\}/ : /\{name\}/, a = r.split(n);
  return ["concat", ...a.flatMap((s, l) => l === a.length - 1 ? [s] : [s, e])];
}
function ho(r) {
  var n;
  const e = /\{name(?:\:(?<language>\S+))?\}/g, t = [];
  for (; ; ) {
    const a = e.exec(r);
    if (!a) break;
    const o = ((n = a.groups) == null ? void 0 : n.language) ?? null;
    t.push(o);
  }
  return t;
}
function go(r) {
  return !Array.isArray(r) || r.length !== 2 || r[0] !== "get" || typeof r[1] != "string" ? null : r[1].trim() === "name" ? {
    isLanguage: true,
    localization: null
  } : r[1].trim().startsWith("name:") ? {
    isLanguage: true,
    localization: r[1].trim().split(":").pop()
  } : null;
}
function vo(r) {
  const e = [], t = structuredClone(r), n = (a) => {
    if (typeof a != "string") for (let o = 0; o < a.length; o += 1) {
      const i = go(a[o]);
      i ? e.push(i.localization) : n(a[o]);
    }
  };
  return n([t]), e;
}
function bo(r, e) {
  const t = [];
  for (const o of r) {
    if (o.type !== "symbol") continue;
    const i = o, {
      id: s,
      layout: l
    } = i;
    if (!l || !("text-field" in l)) continue;
    const u = e.getLayoutProperty(s, "text-field");
    if (u) if (typeof u == "string") {
      const c = ho(u);
      t.push(c);
    } else {
      const c = vo(u);
      t.push(c);
    }
  }
  const n = t.flat(), a = {
    unlocalized: 0,
    localized: {}
  };
  for (const o of n) o === null ? a.unlocalized += 1 : (o in a.localized || (a.localized[o] = 0), a.localized[o] += 1);
  return a;
}
var hl = class extends import_maplibre_gl.default.Marker {
  addTo(e) {
    return super.addTo(e);
  }
};
var vl = class extends import_maplibre_gl.default.Popup {
  addTo(e) {
    return super.addTo(e);
  }
};
var bl = class extends import_maplibre_gl.default.Style {
  constructor(e, t = {}) {
    super(e, t);
  }
};
var wl = class extends import_maplibre_gl.default.CanvasSource {
  onAdd(e) {
    super.onAdd(e);
  }
};
var Sl = class extends import_maplibre_gl.default.GeoJSONSource {
  onAdd(e) {
    super.onAdd(e);
  }
};
var xl = class extends import_maplibre_gl.default.ImageSource {
  onAdd(e) {
    super.onAdd(e);
  }
};
var kl = class extends import_maplibre_gl.default.RasterTileSource {
  onAdd(e) {
    super.onAdd(e);
  }
};
var Ll = class extends import_maplibre_gl.default.RasterDEMTileSource {
  onAdd(e) {
    super.onAdd(e);
  }
};
var Cl = class extends import_maplibre_gl.default.VectorTileSource {
  onAdd(e) {
    super.onAdd(e);
  }
};
var Al = class extends import_maplibre_gl.default.VideoSource {
  onAdd(e) {
    super.onAdd(e);
  }
};
var wo = class extends import_maplibre_gl.default.NavigationControl {
  onAdd(e) {
    return super.onAdd(e);
  }
};
var So = class extends import_maplibre_gl.default.GeolocateControl {
  onAdd(e) {
    return super.onAdd(e);
  }
};
var Tl = class extends import_maplibre_gl.default.AttributionControl {
  onAdd(e) {
    return super.onAdd(e);
  }
};
var xo = class extends import_maplibre_gl.default.LogoControl {
  onAdd(e) {
    return super.onAdd(e);
  }
};
var ko = class extends import_maplibre_gl.default.ScaleControl {
  onAdd(e) {
    return super.onAdd(e);
  }
};
var Lo = class extends import_maplibre_gl.default.FullscreenControl {
  onAdd(e) {
    return super.onAdd(e);
  }
};
var Il = class extends import_maplibre_gl.default.TerrainControl {
  onAdd(e) {
    return super.onAdd(e);
  }
};
var El = class extends import_maplibre_gl.default.BoxZoomHandler {
  constructor(e, t) {
    super(e, t);
  }
};
var Ml = class extends import_maplibre_gl.default.ScrollZoomHandler {
  constructor(e, t) {
    super(e, t);
  }
};
var zl = class extends import_maplibre_gl.default.CooperativeGesturesHandler {
  constructor(e, t) {
    super(e, t);
  }
};
var _l = class extends import_maplibre_gl.default.KeyboardHandler {
  constructor(e) {
    super(e);
  }
};
var Pl = class extends import_maplibre_gl.default.TwoFingersTouchPitchHandler {
  constructor(e) {
    super(e);
  }
};
var Rl = class extends import_maplibre_gl.default.MapWheelEvent {
  constructor(e, t, n) {
    super(e, t, n);
  }
};
var $l = class extends import_maplibre_gl.default.MapTouchEvent {
  constructor(e, t, n) {
    super(e, t, n);
  }
};
var jl = class extends import_maplibre_gl.default.MapMouseEvent {
  constructor(e, t, n, a = {}) {
    super(e, t, n, a);
  }
};
var Or = class extends xo {
  constructor(t = {}) {
    super(t);
    L(this, "logoURL", "");
    L(this, "linkURL", "");
    this.logoURL = t.logoURL ?? V.maptilerLogoURL, this.linkURL = t.linkURL ?? V.maptilerURL;
  }
  onAdd(t) {
    this._map = t, this._compact = this.options.compact ?? false, this._container = window.document.createElement("div"), this._container.className = "maplibregl-ctrl";
    const n = window.document.createElement("a");
    return n.style.backgroundRepeat = "no-repeat", n.style.cursor = "pointer", n.style.display = "block", n.style.height = "23px", n.style.margin = "0 0 -4px -4px", n.style.overflow = "hidden", n.style.width = "88px", n.style.backgroundImage = `url(${this.logoURL})`, n.style.backgroundSize = "100px 30px", n.style.width = "100px", n.style.height = "30px", n.target = "_blank", n.rel = "noopener", n.href = this.linkURL, n.setAttribute("aria-label", "MapTiler logo"), n.setAttribute("rel", "noopener"), this._container.appendChild(n), this._container.style.display = "block", this._map.on("resize", this._updateCompact), this._updateCompact(), this._container;
  }
};
var Co = 8;
var Ao = {
  version: {
    required: true,
    type: "enum",
    values: [8]
  },
  name: {
    type: "string"
  },
  metadata: {
    type: "*"
  },
  center: {
    type: "array",
    value: "number"
  },
  centerAltitude: {
    type: "number"
  },
  zoom: {
    type: "number"
  },
  bearing: {
    type: "number",
    default: 0,
    period: 360,
    units: "degrees"
  },
  pitch: {
    type: "number",
    default: 0,
    units: "degrees"
  },
  roll: {
    type: "number",
    default: 0,
    units: "degrees"
  },
  light: {
    type: "light"
  },
  sky: {
    type: "sky"
  },
  projection: {
    type: "projection"
  },
  terrain: {
    type: "terrain"
  },
  sources: {
    required: true,
    type: "sources"
  },
  sprite: {
    type: "sprite"
  },
  glyphs: {
    type: "string"
  },
  transition: {
    type: "transition"
  },
  layers: {
    required: true,
    type: "array",
    value: "layer"
  }
};
var To = {
  "*": {
    type: "source"
  }
};
var Io = ["source_vector", "source_raster", "source_raster_dem", "source_geojson", "source_video", "source_image"];
var Eo = {
  type: {
    required: true,
    type: "enum",
    values: {
      vector: {}
    }
  },
  url: {
    type: "string"
  },
  tiles: {
    type: "array",
    value: "string"
  },
  bounds: {
    type: "array",
    value: "number",
    length: 4,
    default: [-180, -85.051129, 180, 85.051129]
  },
  scheme: {
    type: "enum",
    values: {
      xyz: {},
      tms: {}
    },
    default: "xyz"
  },
  minzoom: {
    type: "number",
    default: 0
  },
  maxzoom: {
    type: "number",
    default: 22
  },
  attribution: {
    type: "string"
  },
  promoteId: {
    type: "promoteId"
  },
  volatile: {
    type: "boolean",
    default: false
  },
  "*": {
    type: "*"
  }
};
var Mo = {
  type: {
    required: true,
    type: "enum",
    values: {
      raster: {}
    }
  },
  url: {
    type: "string"
  },
  tiles: {
    type: "array",
    value: "string"
  },
  bounds: {
    type: "array",
    value: "number",
    length: 4,
    default: [-180, -85.051129, 180, 85.051129]
  },
  minzoom: {
    type: "number",
    default: 0
  },
  maxzoom: {
    type: "number",
    default: 22
  },
  tileSize: {
    type: "number",
    default: 512,
    units: "pixels"
  },
  scheme: {
    type: "enum",
    values: {
      xyz: {},
      tms: {}
    },
    default: "xyz"
  },
  attribution: {
    type: "string"
  },
  volatile: {
    type: "boolean",
    default: false
  },
  "*": {
    type: "*"
  }
};
var zo = {
  type: {
    required: true,
    type: "enum",
    values: {
      "raster-dem": {}
    }
  },
  url: {
    type: "string"
  },
  tiles: {
    type: "array",
    value: "string"
  },
  bounds: {
    type: "array",
    value: "number",
    length: 4,
    default: [-180, -85.051129, 180, 85.051129]
  },
  minzoom: {
    type: "number",
    default: 0
  },
  maxzoom: {
    type: "number",
    default: 22
  },
  tileSize: {
    type: "number",
    default: 512,
    units: "pixels"
  },
  attribution: {
    type: "string"
  },
  encoding: {
    type: "enum",
    values: {
      terrarium: {},
      mapbox: {},
      custom: {}
    },
    default: "mapbox"
  },
  redFactor: {
    type: "number",
    default: 1
  },
  blueFactor: {
    type: "number",
    default: 1
  },
  greenFactor: {
    type: "number",
    default: 1
  },
  baseShift: {
    type: "number",
    default: 0
  },
  volatile: {
    type: "boolean",
    default: false
  },
  "*": {
    type: "*"
  }
};
var _o = {
  type: {
    required: true,
    type: "enum",
    values: {
      geojson: {}
    }
  },
  data: {
    required: true,
    type: "*"
  },
  maxzoom: {
    type: "number",
    default: 18
  },
  attribution: {
    type: "string"
  },
  buffer: {
    type: "number",
    default: 128,
    maximum: 512,
    minimum: 0
  },
  filter: {
    type: "*"
  },
  tolerance: {
    type: "number",
    default: 0.375
  },
  cluster: {
    type: "boolean",
    default: false
  },
  clusterRadius: {
    type: "number",
    default: 50,
    minimum: 0
  },
  clusterMaxZoom: {
    type: "number"
  },
  clusterMinPoints: {
    type: "number"
  },
  clusterProperties: {
    type: "*"
  },
  lineMetrics: {
    type: "boolean",
    default: false
  },
  generateId: {
    type: "boolean",
    default: false
  },
  promoteId: {
    type: "promoteId"
  }
};
var Po = {
  type: {
    required: true,
    type: "enum",
    values: {
      video: {}
    }
  },
  urls: {
    required: true,
    type: "array",
    value: "string"
  },
  coordinates: {
    required: true,
    type: "array",
    length: 4,
    value: {
      type: "array",
      length: 2,
      value: "number"
    }
  }
};
var Ro = {
  type: {
    required: true,
    type: "enum",
    values: {
      image: {}
    }
  },
  url: {
    required: true,
    type: "string"
  },
  coordinates: {
    required: true,
    type: "array",
    length: 4,
    value: {
      type: "array",
      length: 2,
      value: "number"
    }
  }
};
var $o = {
  id: {
    type: "string",
    required: true
  },
  type: {
    type: "enum",
    values: {
      fill: {},
      line: {},
      symbol: {},
      circle: {},
      heatmap: {},
      "fill-extrusion": {},
      raster: {},
      hillshade: {},
      background: {}
    },
    required: true
  },
  metadata: {
    type: "*"
  },
  source: {
    type: "string"
  },
  "source-layer": {
    type: "string"
  },
  minzoom: {
    type: "number",
    minimum: 0,
    maximum: 24
  },
  maxzoom: {
    type: "number",
    minimum: 0,
    maximum: 24
  },
  filter: {
    type: "filter"
  },
  layout: {
    type: "layout"
  },
  paint: {
    type: "paint"
  }
};
var jo = ["layout_fill", "layout_line", "layout_circle", "layout_heatmap", "layout_fill-extrusion", "layout_symbol", "layout_raster", "layout_hillshade", "layout_background"];
var No = {
  visibility: {
    type: "enum",
    values: {
      visible: {},
      none: {}
    },
    default: "visible",
    "property-type": "constant"
  }
};
var Fo = {
  "fill-sort-key": {
    type: "number",
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  visibility: {
    type: "enum",
    values: {
      visible: {},
      none: {}
    },
    default: "visible",
    "property-type": "constant"
  }
};
var Oo = {
  "circle-sort-key": {
    type: "number",
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  visibility: {
    type: "enum",
    values: {
      visible: {},
      none: {}
    },
    default: "visible",
    "property-type": "constant"
  }
};
var Do = {
  visibility: {
    type: "enum",
    values: {
      visible: {},
      none: {}
    },
    default: "visible",
    "property-type": "constant"
  }
};
var qo = {
  "line-cap": {
    type: "enum",
    values: {
      butt: {},
      round: {},
      square: {}
    },
    default: "butt",
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "line-join": {
    type: "enum",
    values: {
      bevel: {},
      round: {},
      miter: {}
    },
    default: "miter",
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "line-miter-limit": {
    type: "number",
    default: 2,
    requires: [{
      "line-join": "miter"
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "line-round-limit": {
    type: "number",
    default: 1.05,
    requires: [{
      "line-join": "round"
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "line-sort-key": {
    type: "number",
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  visibility: {
    type: "enum",
    values: {
      visible: {},
      none: {}
    },
    default: "visible",
    "property-type": "constant"
  }
};
var Bo = {
  "symbol-placement": {
    type: "enum",
    values: {
      point: {},
      line: {},
      "line-center": {}
    },
    default: "point",
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "symbol-spacing": {
    type: "number",
    default: 250,
    minimum: 1,
    units: "pixels",
    requires: [{
      "symbol-placement": "line"
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "symbol-avoid-edges": {
    type: "boolean",
    default: false,
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "symbol-sort-key": {
    type: "number",
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "symbol-z-order": {
    type: "enum",
    values: {
      auto: {},
      "viewport-y": {},
      source: {}
    },
    default: "auto",
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-allow-overlap": {
    type: "boolean",
    default: false,
    requires: ["icon-image", {
      "!": "icon-overlap"
    }],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-overlap": {
    type: "enum",
    values: {
      never: {},
      always: {},
      cooperative: {}
    },
    requires: ["icon-image"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-ignore-placement": {
    type: "boolean",
    default: false,
    requires: ["icon-image"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-optional": {
    type: "boolean",
    default: false,
    requires: ["icon-image", "text-field"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-rotation-alignment": {
    type: "enum",
    values: {
      map: {},
      viewport: {},
      auto: {}
    },
    default: "auto",
    requires: ["icon-image"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-size": {
    type: "number",
    default: 1,
    minimum: 0,
    units: "factor of the original icon size",
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "icon-text-fit": {
    type: "enum",
    values: {
      none: {},
      width: {},
      height: {},
      both: {}
    },
    default: "none",
    requires: ["icon-image", "text-field"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-text-fit-padding": {
    type: "array",
    value: "number",
    length: 4,
    default: [0, 0, 0, 0],
    units: "pixels",
    requires: ["icon-image", "text-field", {
      "icon-text-fit": ["both", "width", "height"]
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-image": {
    type: "resolvedImage",
    tokens: true,
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "icon-rotate": {
    type: "number",
    default: 0,
    period: 360,
    units: "degrees",
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "icon-padding": {
    type: "padding",
    default: [2],
    units: "pixels",
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "icon-keep-upright": {
    type: "boolean",
    default: false,
    requires: ["icon-image", {
      "icon-rotation-alignment": "map"
    }, {
      "symbol-placement": ["line", "line-center"]
    }],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-offset": {
    type: "array",
    value: "number",
    length: 2,
    default: [0, 0],
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "icon-anchor": {
    type: "enum",
    values: {
      center: {},
      left: {},
      right: {},
      top: {},
      bottom: {},
      "top-left": {},
      "top-right": {},
      "bottom-left": {},
      "bottom-right": {}
    },
    default: "center",
    requires: ["icon-image"],
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "icon-pitch-alignment": {
    type: "enum",
    values: {
      map: {},
      viewport: {},
      auto: {}
    },
    default: "auto",
    requires: ["icon-image"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-pitch-alignment": {
    type: "enum",
    values: {
      map: {},
      viewport: {},
      auto: {}
    },
    default: "auto",
    requires: ["text-field"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-rotation-alignment": {
    type: "enum",
    values: {
      map: {},
      viewport: {},
      "viewport-glyph": {},
      auto: {}
    },
    default: "auto",
    requires: ["text-field"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-field": {
    type: "formatted",
    default: "",
    tokens: true,
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-font": {
    type: "array",
    value: "string",
    default: ["Open Sans Regular", "Arial Unicode MS Regular"],
    requires: ["text-field"],
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-size": {
    type: "number",
    default: 16,
    minimum: 0,
    units: "pixels",
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-max-width": {
    type: "number",
    default: 10,
    minimum: 0,
    units: "ems",
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-line-height": {
    type: "number",
    default: 1.2,
    units: "ems",
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-letter-spacing": {
    type: "number",
    default: 0,
    units: "ems",
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-justify": {
    type: "enum",
    values: {
      auto: {},
      left: {},
      center: {},
      right: {}
    },
    default: "center",
    requires: ["text-field"],
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-radial-offset": {
    type: "number",
    units: "ems",
    default: 0,
    requires: ["text-field"],
    "property-type": "data-driven",
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    }
  },
  "text-variable-anchor": {
    type: "array",
    value: "enum",
    values: {
      center: {},
      left: {},
      right: {},
      top: {},
      bottom: {},
      "top-left": {},
      "top-right": {},
      "bottom-left": {},
      "bottom-right": {}
    },
    requires: ["text-field", {
      "symbol-placement": ["point"]
    }],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-variable-anchor-offset": {
    type: "variableAnchorOffsetCollection",
    requires: ["text-field", {
      "symbol-placement": ["point"]
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-anchor": {
    type: "enum",
    values: {
      center: {},
      left: {},
      right: {},
      top: {},
      bottom: {},
      "top-left": {},
      "top-right": {},
      "bottom-left": {},
      "bottom-right": {}
    },
    default: "center",
    requires: ["text-field", {
      "!": "text-variable-anchor"
    }],
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-max-angle": {
    type: "number",
    default: 45,
    units: "degrees",
    requires: ["text-field", {
      "symbol-placement": ["line", "line-center"]
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-writing-mode": {
    type: "array",
    value: "enum",
    values: {
      horizontal: {},
      vertical: {}
    },
    requires: ["text-field", {
      "symbol-placement": ["point"]
    }],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-rotate": {
    type: "number",
    default: 0,
    period: 360,
    units: "degrees",
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-padding": {
    type: "number",
    default: 2,
    minimum: 0,
    units: "pixels",
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-keep-upright": {
    type: "boolean",
    default: true,
    requires: ["text-field", {
      "text-rotation-alignment": "map"
    }, {
      "symbol-placement": ["line", "line-center"]
    }],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-transform": {
    type: "enum",
    values: {
      none: {},
      uppercase: {},
      lowercase: {}
    },
    default: "none",
    requires: ["text-field"],
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-offset": {
    type: "array",
    value: "number",
    units: "ems",
    length: 2,
    default: [0, 0],
    requires: ["text-field", {
      "!": "text-radial-offset"
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature"]
    },
    "property-type": "data-driven"
  },
  "text-allow-overlap": {
    type: "boolean",
    default: false,
    requires: ["text-field", {
      "!": "text-overlap"
    }],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-overlap": {
    type: "enum",
    values: {
      never: {},
      always: {},
      cooperative: {}
    },
    requires: ["text-field"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-ignore-placement": {
    type: "boolean",
    default: false,
    requires: ["text-field"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-optional": {
    type: "boolean",
    default: false,
    requires: ["text-field", "icon-image"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  visibility: {
    type: "enum",
    values: {
      visible: {},
      none: {}
    },
    default: "visible",
    "property-type": "constant"
  }
};
var Uo = {
  visibility: {
    type: "enum",
    values: {
      visible: {},
      none: {}
    },
    default: "visible",
    "property-type": "constant"
  }
};
var Vo = {
  visibility: {
    type: "enum",
    values: {
      visible: {},
      none: {}
    },
    default: "visible",
    "property-type": "constant"
  }
};
var Go = {
  type: "array",
  value: "*"
};
var Ho = {
  type: "enum",
  values: {
    "==": {},
    "!=": {},
    ">": {},
    ">=": {},
    "<": {},
    "<=": {},
    in: {},
    "!in": {},
    all: {},
    any: {},
    none: {},
    has: {},
    "!has": {}
  }
};
var Ko = {
  type: "enum",
  values: {
    Point: {},
    LineString: {},
    Polygon: {}
  }
};
var Wo = {
  type: "array",
  minimum: 0,
  maximum: 24,
  value: ["number", "color"],
  length: 2
};
var Zo = {
  type: "array",
  value: "*",
  minimum: 1
};
var Jo = {
  anchor: {
    type: "enum",
    default: "viewport",
    values: {
      map: {},
      viewport: {}
    },
    "property-type": "data-constant",
    transition: false,
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    }
  },
  position: {
    type: "array",
    default: [1.15, 210, 30],
    length: 3,
    value: "number",
    "property-type": "data-constant",
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    }
  },
  color: {
    type: "color",
    "property-type": "data-constant",
    default: "#ffffff",
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    transition: true
  },
  intensity: {
    type: "number",
    "property-type": "data-constant",
    default: 0.5,
    minimum: 0,
    maximum: 1,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    transition: true
  }
};
var Yo = {
  "sky-color": {
    type: "color",
    "property-type": "data-constant",
    default: "#88C6FC",
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    transition: true
  },
  "horizon-color": {
    type: "color",
    "property-type": "data-constant",
    default: "#ffffff",
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    transition: true
  },
  "fog-color": {
    type: "color",
    "property-type": "data-constant",
    default: "#ffffff",
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    transition: true
  },
  "fog-ground-blend": {
    type: "number",
    "property-type": "data-constant",
    default: 0.5,
    minimum: 0,
    maximum: 1,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    transition: true
  },
  "horizon-fog-blend": {
    type: "number",
    "property-type": "data-constant",
    default: 0.8,
    minimum: 0,
    maximum: 1,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    transition: true
  },
  "sky-horizon-blend": {
    type: "number",
    "property-type": "data-constant",
    default: 0.8,
    minimum: 0,
    maximum: 1,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    transition: true
  },
  "atmosphere-blend": {
    type: "number",
    "property-type": "data-constant",
    default: 0.8,
    minimum: 0,
    maximum: 1,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    transition: true
  }
};
var Xo = {
  source: {
    type: "string",
    required: true
  },
  exaggeration: {
    type: "number",
    minimum: 0,
    default: 1
  }
};
var Qo = {
  type: {
    type: "projectionDefinition",
    default: "mercator",
    "property-type": "data-constant",
    transition: false,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    }
  }
};
var ei = ["paint_fill", "paint_line", "paint_circle", "paint_heatmap", "paint_fill-extrusion", "paint_symbol", "paint_raster", "paint_hillshade", "paint_background"];
var ti = {
  "fill-antialias": {
    type: "boolean",
    default: true,
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "fill-opacity": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "fill-color": {
    type: "color",
    default: "#000000",
    transition: true,
    requires: [{
      "!": "fill-pattern"
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "fill-outline-color": {
    type: "color",
    transition: true,
    requires: [{
      "!": "fill-pattern"
    }, {
      "fill-antialias": true
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "fill-translate": {
    type: "array",
    value: "number",
    length: 2,
    default: [0, 0],
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "fill-translate-anchor": {
    type: "enum",
    values: {
      map: {},
      viewport: {}
    },
    default: "map",
    requires: ["fill-translate"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "fill-pattern": {
    type: "resolvedImage",
    transition: true,
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "cross-faded-data-driven"
  }
};
var ri = {
  "line-opacity": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "line-color": {
    type: "color",
    default: "#000000",
    transition: true,
    requires: [{
      "!": "line-pattern"
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "line-translate": {
    type: "array",
    value: "number",
    length: 2,
    default: [0, 0],
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "line-translate-anchor": {
    type: "enum",
    values: {
      map: {},
      viewport: {}
    },
    default: "map",
    requires: ["line-translate"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "line-width": {
    type: "number",
    default: 1,
    minimum: 0,
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "line-gap-width": {
    type: "number",
    default: 0,
    minimum: 0,
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "line-offset": {
    type: "number",
    default: 0,
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "line-blur": {
    type: "number",
    default: 0,
    minimum: 0,
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "line-dasharray": {
    type: "array",
    value: "number",
    minimum: 0,
    transition: true,
    units: "line widths",
    requires: [{
      "!": "line-pattern"
    }],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "cross-faded"
  },
  "line-pattern": {
    type: "resolvedImage",
    transition: true,
    expression: {
      interpolated: false,
      parameters: ["zoom", "feature"]
    },
    "property-type": "cross-faded-data-driven"
  },
  "line-gradient": {
    type: "color",
    transition: false,
    requires: [{
      "!": "line-dasharray"
    }, {
      "!": "line-pattern"
    }, {
      source: "geojson",
      has: {
        lineMetrics: true
      }
    }],
    expression: {
      interpolated: true,
      parameters: ["line-progress"]
    },
    "property-type": "color-ramp"
  }
};
var ni = {
  "circle-radius": {
    type: "number",
    default: 5,
    minimum: 0,
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "circle-color": {
    type: "color",
    default: "#000000",
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "circle-blur": {
    type: "number",
    default: 0,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "circle-opacity": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "circle-translate": {
    type: "array",
    value: "number",
    length: 2,
    default: [0, 0],
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "circle-translate-anchor": {
    type: "enum",
    values: {
      map: {},
      viewport: {}
    },
    default: "map",
    requires: ["circle-translate"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "circle-pitch-scale": {
    type: "enum",
    values: {
      map: {},
      viewport: {}
    },
    default: "map",
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "circle-pitch-alignment": {
    type: "enum",
    values: {
      map: {},
      viewport: {}
    },
    default: "viewport",
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "circle-stroke-width": {
    type: "number",
    default: 0,
    minimum: 0,
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "circle-stroke-color": {
    type: "color",
    default: "#000000",
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "circle-stroke-opacity": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  }
};
var ai = {
  "heatmap-radius": {
    type: "number",
    default: 30,
    minimum: 1,
    transition: true,
    units: "pixels",
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "heatmap-weight": {
    type: "number",
    default: 1,
    minimum: 0,
    transition: false,
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "heatmap-intensity": {
    type: "number",
    default: 1,
    minimum: 0,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "heatmap-color": {
    type: "color",
    default: ["interpolate", ["linear"], ["heatmap-density"], 0, "rgba(0, 0, 255, 0)", 0.1, "royalblue", 0.3, "cyan", 0.5, "lime", 0.7, "yellow", 1, "red"],
    transition: false,
    expression: {
      interpolated: true,
      parameters: ["heatmap-density"]
    },
    "property-type": "color-ramp"
  },
  "heatmap-opacity": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  }
};
var oi = {
  "icon-opacity": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "icon-color": {
    type: "color",
    default: "#000000",
    transition: true,
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "icon-halo-color": {
    type: "color",
    default: "rgba(0, 0, 0, 0)",
    transition: true,
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "icon-halo-width": {
    type: "number",
    default: 0,
    minimum: 0,
    transition: true,
    units: "pixels",
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "icon-halo-blur": {
    type: "number",
    default: 0,
    minimum: 0,
    transition: true,
    units: "pixels",
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "icon-translate": {
    type: "array",
    value: "number",
    length: 2,
    default: [0, 0],
    transition: true,
    units: "pixels",
    requires: ["icon-image"],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "icon-translate-anchor": {
    type: "enum",
    values: {
      map: {},
      viewport: {}
    },
    default: "map",
    requires: ["icon-image", "icon-translate"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-opacity": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "text-color": {
    type: "color",
    default: "#000000",
    transition: true,
    overridable: true,
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "text-halo-color": {
    type: "color",
    default: "rgba(0, 0, 0, 0)",
    transition: true,
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "text-halo-width": {
    type: "number",
    default: 0,
    minimum: 0,
    transition: true,
    units: "pixels",
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "text-halo-blur": {
    type: "number",
    default: 0,
    minimum: 0,
    transition: true,
    units: "pixels",
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom", "feature", "feature-state"]
    },
    "property-type": "data-driven"
  },
  "text-translate": {
    type: "array",
    value: "number",
    length: 2,
    default: [0, 0],
    transition: true,
    units: "pixels",
    requires: ["text-field"],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "text-translate-anchor": {
    type: "enum",
    values: {
      map: {},
      viewport: {}
    },
    default: "map",
    requires: ["text-field", "text-translate"],
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  }
};
var ii = {
  "raster-opacity": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "raster-hue-rotate": {
    type: "number",
    default: 0,
    period: 360,
    transition: true,
    units: "degrees",
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "raster-brightness-min": {
    type: "number",
    default: 0,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "raster-brightness-max": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "raster-saturation": {
    type: "number",
    default: 0,
    minimum: -1,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "raster-contrast": {
    type: "number",
    default: 0,
    minimum: -1,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "raster-resampling": {
    type: "enum",
    values: {
      linear: {},
      nearest: {}
    },
    default: "linear",
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "raster-fade-duration": {
    type: "number",
    default: 300,
    minimum: 0,
    transition: false,
    units: "milliseconds",
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  }
};
var si = {
  "hillshade-illumination-direction": {
    type: "number",
    default: 335,
    minimum: 0,
    maximum: 359,
    transition: false,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "hillshade-illumination-anchor": {
    type: "enum",
    values: {
      map: {},
      viewport: {}
    },
    default: "viewport",
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "hillshade-exaggeration": {
    type: "number",
    default: 0.5,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "hillshade-shadow-color": {
    type: "color",
    default: "#000000",
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "hillshade-highlight-color": {
    type: "color",
    default: "#FFFFFF",
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "hillshade-accent-color": {
    type: "color",
    default: "#000000",
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  }
};
var li = {
  "background-color": {
    type: "color",
    default: "#000000",
    transition: true,
    requires: [{
      "!": "background-pattern"
    }],
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  },
  "background-pattern": {
    type: "resolvedImage",
    transition: true,
    expression: {
      interpolated: false,
      parameters: ["zoom"]
    },
    "property-type": "cross-faded"
  },
  "background-opacity": {
    type: "number",
    default: 1,
    minimum: 0,
    maximum: 1,
    transition: true,
    expression: {
      interpolated: true,
      parameters: ["zoom"]
    },
    "property-type": "data-constant"
  }
};
var ui = {
  duration: {
    type: "number",
    default: 300,
    minimum: 0,
    units: "milliseconds"
  },
  delay: {
    type: "number",
    default: 0,
    minimum: 0,
    units: "milliseconds"
  }
};
var ci = {
  "*": {
    type: "string"
  }
};
var pi = {
  $version: Co,
  $root: Ao,
  sources: To,
  source: Io,
  source_vector: Eo,
  source_raster: Mo,
  source_raster_dem: zo,
  source_geojson: _o,
  source_video: Po,
  source_image: Ro,
  layer: $o,
  layout: jo,
  layout_background: No,
  layout_fill: Fo,
  layout_circle: Oo,
  layout_heatmap: Do,
  "layout_fill-extrusion": {
    visibility: {
      type: "enum",
      values: {
        visible: {},
        none: {}
      },
      default: "visible",
      "property-type": "constant"
    }
  },
  layout_line: qo,
  layout_symbol: Bo,
  layout_raster: Uo,
  layout_hillshade: Vo,
  filter: Go,
  filter_operator: Ho,
  geometry_type: Ko,
  function: {
    expression: {
      type: "expression"
    },
    stops: {
      type: "array",
      value: "function_stop"
    },
    base: {
      type: "number",
      default: 1,
      minimum: 0
    },
    property: {
      type: "string",
      default: "$zoom"
    },
    type: {
      type: "enum",
      values: {
        identity: {},
        exponential: {},
        interval: {},
        categorical: {}
      },
      default: "exponential"
    },
    colorSpace: {
      type: "enum",
      values: {
        rgb: {},
        lab: {},
        hcl: {}
      },
      default: "rgb"
    },
    default: {
      type: "*",
      required: false
    }
  },
  function_stop: Wo,
  expression: Zo,
  light: Jo,
  sky: Yo,
  terrain: Xo,
  projection: Qo,
  paint: ei,
  paint_fill: ti,
  "paint_fill-extrusion": {
    "fill-extrusion-opacity": {
      type: "number",
      default: 1,
      minimum: 0,
      maximum: 1,
      transition: true,
      expression: {
        interpolated: true,
        parameters: ["zoom"]
      },
      "property-type": "data-constant"
    },
    "fill-extrusion-color": {
      type: "color",
      default: "#000000",
      transition: true,
      requires: [{
        "!": "fill-extrusion-pattern"
      }],
      expression: {
        interpolated: true,
        parameters: ["zoom", "feature", "feature-state"]
      },
      "property-type": "data-driven"
    },
    "fill-extrusion-translate": {
      type: "array",
      value: "number",
      length: 2,
      default: [0, 0],
      transition: true,
      units: "pixels",
      expression: {
        interpolated: true,
        parameters: ["zoom"]
      },
      "property-type": "data-constant"
    },
    "fill-extrusion-translate-anchor": {
      type: "enum",
      values: {
        map: {},
        viewport: {}
      },
      default: "map",
      requires: ["fill-extrusion-translate"],
      expression: {
        interpolated: false,
        parameters: ["zoom"]
      },
      "property-type": "data-constant"
    },
    "fill-extrusion-pattern": {
      type: "resolvedImage",
      transition: true,
      expression: {
        interpolated: false,
        parameters: ["zoom", "feature"]
      },
      "property-type": "cross-faded-data-driven"
    },
    "fill-extrusion-height": {
      type: "number",
      default: 0,
      minimum: 0,
      units: "meters",
      transition: true,
      expression: {
        interpolated: true,
        parameters: ["zoom", "feature", "feature-state"]
      },
      "property-type": "data-driven"
    },
    "fill-extrusion-base": {
      type: "number",
      default: 0,
      minimum: 0,
      units: "meters",
      transition: true,
      requires: ["fill-extrusion-height"],
      expression: {
        interpolated: true,
        parameters: ["zoom", "feature", "feature-state"]
      },
      "property-type": "data-driven"
    },
    "fill-extrusion-vertical-gradient": {
      type: "boolean",
      default: true,
      transition: false,
      expression: {
        interpolated: false,
        parameters: ["zoom"]
      },
      "property-type": "data-constant"
    }
  },
  paint_line: ri,
  paint_circle: ni,
  paint_heatmap: ai,
  paint_symbol: oi,
  paint_raster: ii,
  paint_hillshade: si,
  paint_background: li,
  transition: ui,
  "property-type": {
    "data-driven": {
      type: "property-type"
    },
    "cross-faded": {
      type: "property-type"
    },
    "cross-faded-data-driven": {
      type: "property-type"
    },
    "color-ramp": {
      type: "property-type"
    },
    "data-constant": {
      type: "property-type"
    },
    constant: {
      type: "property-type"
    }
  },
  promoteId: ci
};
var h = class {
  constructor(e, t, n, a) {
    this.message = (e ? `${e}: ` : "") + n, a && (this.identifier = a), t != null && t.__line__ && (this.line = t.__line__);
  }
};
function lt(r, ...e) {
  for (const t of e) for (const n in t) r[n] = t[n];
  return r;
}
var oe = class extends Error {
  constructor(e, t) {
    super(t), this.message = t, this.key = e;
  }
};
var or = class _or {
  constructor(e, t = []) {
    this.parent = e, this.bindings = {};
    for (const [n, a] of t) this.bindings[n] = a;
  }
  concat(e) {
    return new _or(this, e);
  }
  get(e) {
    if (this.bindings[e]) return this.bindings[e];
    if (this.parent) return this.parent.get(e);
    throw new Error(`${e} not found in scope.`);
  }
  has(e) {
    return this.bindings[e] ? true : this.parent ? this.parent.has(e) : false;
  }
};
var gt = {
  kind: "null"
};
var g = {
  kind: "number"
};
var I = {
  kind: "string"
};
var C = {
  kind: "boolean"
};
var ie = {
  kind: "color"
};
var vt = {
  kind: "projectionDefinition"
};
var Re = {
  kind: "object"
};
var A = {
  kind: "value"
};
var fi = {
  kind: "error"
};
var bt = {
  kind: "collator"
};
var wt = {
  kind: "formatted"
};
var St = {
  kind: "padding"
};
var Xe = {
  kind: "resolvedImage"
};
var xt = {
  kind: "variableAnchorOffsetCollection"
};
function W(r, e) {
  return {
    kind: "array",
    itemType: r,
    N: e
  };
}
function N(r) {
  if (r.kind === "array") {
    const e = N(r.itemType);
    return typeof r.N == "number" ? `array<${e}, ${r.N}>` : r.itemType.kind === "value" ? "array" : `array<${e}>`;
  } else return r.kind;
}
var di = [gt, g, I, C, ie, vt, wt, Re, W(A), St, Xe, xt];
function Ve(r, e) {
  if (e.kind === "error") return null;
  if (r.kind === "array") {
    if (e.kind === "array" && (e.N === 0 && e.itemType.kind === "value" || !Ve(r.itemType, e.itemType)) && (typeof r.N != "number" || r.N === e.N)) return null;
  } else {
    if (r.kind === e.kind) return null;
    if (r.kind === "value") {
      for (const t of di) if (!Ve(t, e)) return null;
    }
  }
  return `Expected ${N(r)} but found ${N(e)} instead.`;
}
function ir(r, e) {
  return e.some((t) => t.kind === r.kind);
}
function Le(r, e) {
  return e.some((t) => t === "null" ? r === null : t === "array" ? Array.isArray(r) : t === "object" ? r && !Array.isArray(r) && typeof r == "object" : t === typeof r);
}
function ze(r, e) {
  return r.kind === "array" && e.kind === "array" ? r.itemType.kind === e.itemType.kind && typeof r.N == "number" : r.kind === e.kind;
}
var kn = 0.96422;
var Ln = 1;
var Cn = 0.82521;
var An = 4 / 29;
var $e = 6 / 29;
var Tn = 3 * $e * $e;
var yi = $e * $e * $e;
var mi = Math.PI / 180;
var hi = 180 / Math.PI;
function In(r) {
  return r = r % 360, r < 0 && (r += 360), r;
}
function En([r, e, t, n]) {
  r = Nt(r), e = Nt(e), t = Nt(t);
  let a, o;
  const i = Ft((0.2225045 * r + 0.7168786 * e + 0.0606169 * t) / Ln);
  r === e && e === t ? a = o = i : (a = Ft((0.4360747 * r + 0.3850649 * e + 0.1430804 * t) / kn), o = Ft((0.0139322 * r + 0.0971045 * e + 0.7141733 * t) / Cn));
  const s = 116 * i - 16;
  return [s < 0 ? 0 : s, 500 * (a - i), 200 * (i - o), n];
}
function Nt(r) {
  return r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
}
function Ft(r) {
  return r > yi ? Math.pow(r, 1 / 3) : r / Tn + An;
}
function Mn([r, e, t, n]) {
  let a = (r + 16) / 116, o = isNaN(e) ? a : a + e / 500, i = isNaN(t) ? a : a - t / 200;
  return a = Ln * Dt(a), o = kn * Dt(o), i = Cn * Dt(i), [
    Ot(3.1338561 * o - 1.6168667 * a - 0.4906146 * i),
    // D50 -> sRGB
    Ot(-0.9787684 * o + 1.9161415 * a + 0.033454 * i),
    Ot(0.0719453 * o - 0.2289914 * a + 1.4052427 * i),
    n
  ];
}
function Ot(r) {
  return r = r <= 304e-5 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055, r < 0 ? 0 : r > 1 ? 1 : r;
}
function Dt(r) {
  return r > $e ? r * r * r : Tn * (r - An);
}
function gi(r) {
  const [e, t, n, a] = En(r), o = Math.sqrt(t * t + n * n);
  return [Math.round(o * 1e4) ? In(Math.atan2(n, t) * hi) : NaN, o, e, a];
}
function vi([r, e, t, n]) {
  return r = isNaN(r) ? 0 : r * mi, Mn([t, Math.cos(r) * e, Math.sin(r) * e, n]);
}
function bi([r, e, t, n]) {
  r = In(r), e /= 100, t /= 100;
  function a(o) {
    const i = (o + r / 30) % 12, s = e * Math.min(t, 1 - t);
    return t - s * Math.max(-1, Math.min(i - 3, 9 - i, 1));
  }
  return [a(0), a(8), a(4), n];
}
function wi(r) {
  if (r = r.toLowerCase().trim(), r === "transparent") return [0, 0, 0, 0];
  const e = Si[r];
  if (e) {
    const [a, o, i] = e;
    return [a / 255, o / 255, i / 255, 1];
  }
  if (r.startsWith("#") && /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(r)) {
    const o = r.length < 6 ? 1 : 2;
    let i = 1;
    return [rt(r.slice(i, i += o)), rt(r.slice(i, i += o)), rt(r.slice(i, i += o)), rt(r.slice(i, i + o) || "ff")];
  }
  if (r.startsWith("rgb")) {
    const a = /^rgba?\(\s*([\de.+-]+)(%)?(?:\s+|\s*(,)\s*)([\de.+-]+)(%)?(?:\s+|\s*(,)\s*)([\de.+-]+)(%)?(?:\s*([,\/])\s*([\de.+-]+)(%)?)?\s*\)$/, o = r.match(a);
    if (o) {
      const [
        i,
        // eslint-disable-line @typescript-eslint/no-unused-vars
        s,
        // <numeric>
        l,
        // %         (optional)
        u,
        // ,         (optional)
        c,
        // <numeric>
        p,
        // %         (optional)
        m,
        // ,         (optional)
        f,
        // <numeric>
        d,
        // %         (optional)
        y,
        // ,|/       (optional)
        v,
        // <numeric> (optional)
        w
        // %         (optional)
      ] = o, b = [u || " ", m || " ", y].join("");
      if (b === "  " || b === "  /" || b === ",," || b === ",,,") {
        const T = [l, p, d].join(""), j = T === "%%%" ? 100 : T === "" ? 255 : 0;
        if (j) {
          const R = [_e(+s / j, 0, 1), _e(+c / j, 0, 1), _e(+f / j, 0, 1), v ? Dr(+v, w) : 1];
          if (qr(R)) return R;
        }
      }
      return;
    }
  }
  const t = /^hsla?\(\s*([\de.+-]+)(?:deg)?(?:\s+|\s*(,)\s*)([\de.+-]+)%(?:\s+|\s*(,)\s*)([\de.+-]+)%(?:\s*([,\/])\s*([\de.+-]+)(%)?)?\s*\)$/, n = r.match(t);
  if (n) {
    const [
      a,
      // eslint-disable-line @typescript-eslint/no-unused-vars
      o,
      // <numeric>
      i,
      // ,         (optional)
      s,
      // <numeric>
      l,
      // ,         (optional)
      u,
      // <numeric>
      c,
      // ,|/       (optional)
      p,
      // <numeric> (optional)
      m
      // %         (optional)
    ] = n, f = [i || " ", l || " ", c].join("");
    if (f === "  " || f === "  /" || f === ",," || f === ",,,") {
      const d = [+o, _e(+s, 0, 100), _e(+u, 0, 100), p ? Dr(+p, m) : 1];
      if (qr(d)) return bi(d);
    }
  }
}
function rt(r) {
  return parseInt(r.padEnd(2, r), 16) / 255;
}
function Dr(r, e) {
  return _e(e ? r / 100 : r, 0, 1);
}
function _e(r, e, t) {
  return Math.min(Math.max(e, r), t);
}
function qr(r) {
  return !r.some(Number.isNaN);
}
var Si = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
function ve(r, e, t) {
  return r + t * (e - r);
}
function Ge(r, e, t) {
  return r.map((n, a) => ve(n, e[a], t));
}
var $ = class _$ {
  /**
   * @param r Red component premultiplied by `alpha` 0..1
   * @param g Green component premultiplied by `alpha` 0..1
   * @param b Blue component premultiplied by `alpha` 0..1
   * @param [alpha=1] Alpha component 0..1
   * @param [premultiplied=true] Whether the `r`, `g` and `b` values have already
   * been multiplied by alpha. If `true` nothing happens if `false` then they will
   * be multiplied automatically.
   */
  constructor(e, t, n, a = 1, o = true) {
    this.r = e, this.g = t, this.b = n, this.a = a, o || (this.r *= a, this.g *= a, this.b *= a, a || this.overwriteGetter("rgb", [e, t, n, a]));
  }
  /**
   * Parses CSS color strings and converts colors to sRGB color space if needed.
   * Officially supported color formats:
   * - keyword, e.g. 'aquamarine' or 'steelblue'
   * - hex (with 3, 4, 6 or 8 digits), e.g. '#f0f' or '#e9bebea9'
   * - rgb and rgba, e.g. 'rgb(0,240,120)' or 'rgba(0%,94%,47%,0.1)' or 'rgb(0 240 120 / .3)'
   * - hsl and hsla, e.g. 'hsl(0,0%,83%)' or 'hsla(0,0%,83%,.5)' or 'hsl(0 0% 83% / 20%)'
   *
   * @param input CSS color string to parse.
   * @returns A `Color` instance, or `undefined` if the input is not a valid color string.
   */
  static parse(e) {
    if (e instanceof _$) return e;
    if (typeof e != "string") return;
    const t = wi(e);
    if (t) return new _$(...t, false);
  }
  /**
   * Used in color interpolation and by 'to-rgba' expression.
   *
   * @returns Gien color, with reversed alpha blending, in sRGB color space.
   */
  get rgb() {
    const {
      r: e,
      g: t,
      b: n,
      a
    } = this, o = a || 1 / 0;
    return this.overwriteGetter("rgb", [e / o, t / o, n / o, a]);
  }
  /**
   * Used in color interpolation.
   *
   * @returns Gien color, with reversed alpha blending, in HCL color space.
   */
  get hcl() {
    return this.overwriteGetter("hcl", gi(this.rgb));
  }
  /**
   * Used in color interpolation.
   *
   * @returns Gien color, with reversed alpha blending, in LAB color space.
   */
  get lab() {
    return this.overwriteGetter("lab", En(this.rgb));
  }
  /**
   * Lazy getter pattern. When getter is called for the first time lazy value
   * is calculated and then overwrites getter function in given object instance.
   *
   * @example:
   * const redColor = Color.parse('red');
   * let x = redColor.hcl; // this will invoke `get hcl()`, which will calculate
   * // the value of red in HCL space and invoke this `overwriteGetter` function
   * // which in turn will set a field with a key 'hcl' in the `redColor` object.
   * // In other words it will override `get hcl()` from its `Color` prototype
   * // with its own property: hcl = [calculated red value in hcl].
   * let y = redColor.hcl; // next call will no longer invoke getter but simply
   * // return the previously calculated value
   * x === y; // true - `x` is exactly the same object as `y`
   *
   * @param getterKey Getter key
   * @param lazyValue Lazily calculated value to be memoized by current instance
   * @private
   */
  overwriteGetter(e, t) {
    return Object.defineProperty(this, e, {
      value: t
    }), t;
  }
  /**
   * Used by 'to-string' expression.
   *
   * @returns Serialized color in format `rgba(r,g,b,a)`
   * where r,g,b are numbers within 0..255 and alpha is number within 1..0
   *
   * @example
   * var purple = new Color.parse('purple');
   * purple.toString; // = "rgba(128,0,128,1)"
   * var translucentGreen = new Color.parse('rgba(26, 207, 26, .73)');
   * translucentGreen.toString(); // = "rgba(26,207,26,0.73)"
   */
  toString() {
    const [e, t, n, a] = this.rgb;
    return `rgba(${[e, t, n].map((o) => Math.round(o * 255)).join(",")},${a})`;
  }
  static interpolate(e, t, n, a = "rgb") {
    switch (a) {
      case "rgb": {
        const [o, i, s, l] = Ge(e.rgb, t.rgb, n);
        return new _$(o, i, s, l, false);
      }
      case "hcl": {
        const [o, i, s, l] = e.hcl, [u, c, p, m] = t.hcl;
        let f, d;
        if (!isNaN(o) && !isNaN(u)) {
          let T = u - o;
          u > o && T > 180 ? T -= 360 : u < o && o - u > 180 && (T += 360), f = o + n * T;
        } else isNaN(o) ? isNaN(u) ? f = NaN : (f = u, (s === 1 || s === 0) && (d = c)) : (f = o, (p === 1 || p === 0) && (d = i));
        const [y, v, w, b] = vi([f, d ?? ve(i, c, n), ve(s, p, n), ve(l, m, n)]);
        return new _$(y, v, w, b, false);
      }
      case "lab": {
        const [o, i, s, l] = Mn(Ge(e.lab, t.lab, n));
        return new _$(o, i, s, l, false);
      }
    }
  }
};
$.black = new $(0, 0, 0, 1);
$.white = new $(1, 1, 1, 1);
$.transparent = new $(0, 0, 0, 0);
$.red = new $(1, 0, 0, 1);
var sr = class {
  constructor(e, t, n) {
    e ? this.sensitivity = t ? "variant" : "case" : this.sensitivity = t ? "accent" : "base", this.locale = n, this.collator = new Intl.Collator(this.locale ? this.locale : [], {
      sensitivity: this.sensitivity,
      usage: "search"
    });
  }
  compare(e, t) {
    return this.collator.compare(e, t);
  }
  resolvedLocale() {
    return new Intl.Collator(this.locale ? this.locale : []).resolvedOptions().locale;
  }
};
var Zt = class {
  constructor(e, t, n, a, o) {
    this.text = e, this.image = t, this.scale = n, this.fontStack = a, this.textColor = o;
  }
};
var fe = class _fe {
  constructor(e) {
    this.sections = e;
  }
  static fromString(e) {
    return new _fe([new Zt(e, null, null, null, null)]);
  }
  isEmpty() {
    return this.sections.length === 0 ? true : !this.sections.some((e) => e.text.length !== 0 || e.image && e.image.name.length !== 0);
  }
  static factory(e) {
    return e instanceof _fe ? e : _fe.fromString(e);
  }
  toString() {
    return this.sections.length === 0 ? "" : this.sections.map((e) => e.text).join("");
  }
};
var J = class _J {
  constructor(e) {
    this.values = e.slice();
  }
  /**
   * Numeric padding values
   * @param input A padding value
   * @returns A `Padding` instance, or `undefined` if the input is not a valid padding value.
   */
  static parse(e) {
    if (e instanceof _J) return e;
    if (typeof e == "number") return new _J([e, e, e, e]);
    if (Array.isArray(e) && !(e.length < 1 || e.length > 4)) {
      for (const t of e) if (typeof t != "number") return;
      switch (e.length) {
        case 1:
          e = [e[0], e[0], e[0], e[0]];
          break;
        case 2:
          e = [e[0], e[1], e[0], e[1]];
          break;
        case 3:
          e = [e[0], e[1], e[2], e[1]];
          break;
      }
      return new _J(e);
    }
  }
  toString() {
    return JSON.stringify(this.values);
  }
  static interpolate(e, t, n) {
    return new _J(Ge(e.values, t.values, n));
  }
};
var D = class {
  constructor(e) {
    this.name = "ExpressionEvaluationError", this.message = e;
  }
  toJSON() {
    return this.message;
  }
};
var xi = /* @__PURE__ */ new Set(["center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"]);
var ne = class _ne {
  constructor(e) {
    this.values = e.slice();
  }
  static parse(e) {
    if (e instanceof _ne) return e;
    if (!(!Array.isArray(e) || e.length < 1 || e.length % 2 !== 0)) {
      for (let t = 0; t < e.length; t += 2) {
        const n = e[t], a = e[t + 1];
        if (typeof n != "string" || !xi.has(n) || !Array.isArray(a) || a.length !== 2 || typeof a[0] != "number" || typeof a[1] != "number") return;
      }
      return new _ne(e);
    }
  }
  toString() {
    return JSON.stringify(this.values);
  }
  static interpolate(e, t, n) {
    const a = e.values, o = t.values;
    if (a.length !== o.length) throw new D(`Cannot interpolate values of different length. from: ${e.toString()}, to: ${t.toString()}`);
    const i = [];
    for (let s = 0; s < a.length; s += 2) {
      if (a[s] !== o[s]) throw new D(`Cannot interpolate values containing mismatched anchors. from[${s}]: ${a[s]}, to[${s}]: ${o[s]}`);
      i.push(a[s]);
      const [l, u] = a[s + 1], [c, p] = o[s + 1];
      i.push([ve(l, c, n), ve(u, p, n)]);
    }
    return new _ne(i);
  }
};
var be = class _be {
  constructor(e) {
    this.name = e.name, this.available = e.available;
  }
  toString() {
    return this.name;
  }
  static fromString(e) {
    return e ? new _be({
      name: e,
      available: false
    }) : null;
  }
};
var ee = class _ee {
  constructor(e, t, n) {
    this.from = e, this.to = t, this.transition = n;
  }
  static interpolate(e, t, n) {
    return new _ee(e, t, n);
  }
  static parse(e) {
    if (e instanceof _ee) return e;
    if (Array.isArray(e) && e.length === 3 && typeof e[0] == "string" && typeof e[1] == "string" && typeof e[2] == "number") return new _ee(e[0], e[1], e[2]);
    if (typeof e == "object" && typeof e.from == "string" && typeof e.to == "string" && typeof e.transition == "number") return new _ee(e.from, e.to, e.transition);
    if (typeof e == "string") return new _ee(e, e, 1);
  }
};
function zn(r, e, t, n) {
  return typeof r == "number" && r >= 0 && r <= 255 && typeof e == "number" && e >= 0 && e <= 255 && typeof t == "number" && t >= 0 && t <= 255 ? typeof n > "u" || typeof n == "number" && n >= 0 && n <= 1 ? null : `Invalid rgba value [${[r, e, t, n].join(", ")}]: 'a' must be between 0 and 1.` : `Invalid rgba value [${(typeof n == "number" ? [r, e, t, n] : [r, e, t]).join(", ")}]: 'r', 'g', and 'b' must be between 0 and 255.`;
}
function He(r) {
  if (r === null || typeof r == "string" || typeof r == "boolean" || typeof r == "number" || r instanceof ee || r instanceof $ || r instanceof sr || r instanceof fe || r instanceof J || r instanceof ne || r instanceof be) return true;
  if (Array.isArray(r)) {
    for (const e of r) if (!He(e)) return false;
    return true;
  } else if (typeof r == "object") {
    for (const e in r) if (!He(r[e])) return false;
    return true;
  } else return false;
}
function q(r) {
  if (r === null) return gt;
  if (typeof r == "string") return I;
  if (typeof r == "boolean") return C;
  if (typeof r == "number") return g;
  if (r instanceof $) return ie;
  if (r instanceof ee) return vt;
  if (r instanceof sr) return bt;
  if (r instanceof fe) return wt;
  if (r instanceof J) return St;
  if (r instanceof ne) return xt;
  if (r instanceof be) return Xe;
  if (Array.isArray(r)) {
    const e = r.length;
    let t;
    for (const n of r) {
      const a = q(n);
      if (!t) t = a;
      else {
        if (t === a) continue;
        t = A;
        break;
      }
    }
    return W(t || A, e);
  } else return Re;
}
function Be(r) {
  const e = typeof r;
  return r === null ? "" : e === "string" || e === "number" || e === "boolean" ? String(r) : r instanceof $ || r instanceof ee || r instanceof fe || r instanceof J || r instanceof ne || r instanceof be ? r.toString() : JSON.stringify(r);
}
var je = class _je {
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  static parse(e, t) {
    if (e.length !== 2) return t.error(`'literal' expression requires exactly one argument, but found ${e.length - 1} instead.`);
    if (!He(e[1])) return t.error("invalid value");
    const n = e[1];
    let a = q(n);
    const o = t.expectedType;
    return a.kind === "array" && a.N === 0 && o && o.kind === "array" && (typeof o.N != "number" || o.N === 0) && (a = o), new _je(a, n);
  }
  evaluate() {
    return this.value;
  }
  eachChild() {
  }
  outputDefined() {
    return true;
  }
};
var nt = {
  string: I,
  number: g,
  boolean: C,
  object: Re
};
var te = class _te {
  constructor(e, t) {
    this.type = e, this.args = t;
  }
  static parse(e, t) {
    if (e.length < 2) return t.error("Expected at least one argument.");
    let n = 1, a;
    const o = e[0];
    if (o === "array") {
      let s;
      if (e.length > 2) {
        const u = e[1];
        if (typeof u != "string" || !(u in nt) || u === "object") return t.error('The item type argument of "array" must be one of string, number, boolean', 1);
        s = nt[u], n++;
      } else s = A;
      let l;
      if (e.length > 3) {
        if (e[2] !== null && (typeof e[2] != "number" || e[2] < 0 || e[2] !== Math.floor(e[2]))) return t.error('The length argument to "array" must be a positive integer literal', 2);
        l = e[2], n++;
      }
      a = W(s, l);
    } else {
      if (!nt[o]) throw new Error(`Types doesn't contain name = ${o}`);
      a = nt[o];
    }
    const i = [];
    for (; n < e.length; n++) {
      const s = t.parse(e[n], n, A);
      if (!s) return null;
      i.push(s);
    }
    return new _te(a, i);
  }
  evaluate(e) {
    for (let t = 0; t < this.args.length; t++) {
      const n = this.args[t].evaluate(e);
      if (Ve(this.type, q(n))) {
        if (t === this.args.length - 1) throw new D(`Expected value to be of type ${N(this.type)}, but found ${N(q(n))} instead.`);
      } else return n;
    }
    throw new Error();
  }
  eachChild(e) {
    this.args.forEach(e);
  }
  outputDefined() {
    return this.args.every((e) => e.outputDefined());
  }
};
var Br = {
  "to-boolean": C,
  "to-color": ie,
  "to-number": g,
  "to-string": I
};
var ge = class _ge {
  constructor(e, t) {
    this.type = e, this.args = t;
  }
  static parse(e, t) {
    if (e.length < 2) return t.error("Expected at least one argument.");
    const n = e[0];
    if (!Br[n]) throw new Error(`Can't parse ${n} as it is not part of the known types`);
    if ((n === "to-boolean" || n === "to-string") && e.length !== 2) return t.error("Expected one argument.");
    const a = Br[n], o = [];
    for (let i = 1; i < e.length; i++) {
      const s = t.parse(e[i], i, A);
      if (!s) return null;
      o.push(s);
    }
    return new _ge(a, o);
  }
  evaluate(e) {
    switch (this.type.kind) {
      case "boolean":
        return !!this.args[0].evaluate(e);
      case "color": {
        let t, n;
        for (const a of this.args) {
          if (t = a.evaluate(e), n = null, t instanceof $) return t;
          if (typeof t == "string") {
            const o = e.parseColor(t);
            if (o) return o;
          } else if (Array.isArray(t) && (t.length < 3 || t.length > 4 ? n = `Invalid rgba value ${JSON.stringify(t)}: expected an array containing either three or four numeric values.` : n = zn(t[0], t[1], t[2], t[3]), !n)) return new $(t[0] / 255, t[1] / 255, t[2] / 255, t[3]);
        }
        throw new D(n || `Could not parse color from value '${typeof t == "string" ? t : JSON.stringify(t)}'`);
      }
      case "padding": {
        let t;
        for (const n of this.args) {
          t = n.evaluate(e);
          const a = J.parse(t);
          if (a) return a;
        }
        throw new D(`Could not parse padding from value '${typeof t == "string" ? t : JSON.stringify(t)}'`);
      }
      case "variableAnchorOffsetCollection": {
        let t;
        for (const n of this.args) {
          t = n.evaluate(e);
          const a = ne.parse(t);
          if (a) return a;
        }
        throw new D(`Could not parse variableAnchorOffsetCollection from value '${typeof t == "string" ? t : JSON.stringify(t)}'`);
      }
      case "number": {
        let t = null;
        for (const n of this.args) {
          if (t = n.evaluate(e), t === null) return 0;
          const a = Number(t);
          if (!isNaN(a)) return a;
        }
        throw new D(`Could not convert ${JSON.stringify(t)} to number.`);
      }
      case "formatted":
        return fe.fromString(Be(this.args[0].evaluate(e)));
      case "resolvedImage":
        return be.fromString(Be(this.args[0].evaluate(e)));
      case "projectionDefinition":
        return this.args[0].evaluate(e);
      default:
        return Be(this.args[0].evaluate(e));
    }
  }
  eachChild(e) {
    this.args.forEach(e);
  }
  outputDefined() {
    return this.args.every((e) => e.outputDefined());
  }
};
var ki = ["Unknown", "Point", "LineString", "Polygon"];
var _n = class {
  constructor() {
    this.globals = null, this.feature = null, this.featureState = null, this.formattedSection = null, this._parseColorCache = {}, this.availableImages = null, this.canonical = null;
  }
  id() {
    return this.feature && "id" in this.feature ? this.feature.id : null;
  }
  geometryType() {
    return this.feature ? typeof this.feature.type == "number" ? ki[this.feature.type] : this.feature.type : null;
  }
  geometry() {
    return this.feature && "geometry" in this.feature ? this.feature.geometry : null;
  }
  canonicalID() {
    return this.canonical;
  }
  properties() {
    return this.feature && this.feature.properties || {};
  }
  parseColor(e) {
    let t = this._parseColorCache[e];
    return t || (t = this._parseColorCache[e] = $.parse(e)), t;
  }
};
var kt = class _kt {
  constructor(e, t, n = [], a, o = new or(), i = []) {
    this.registry = e, this.path = n, this.key = n.map((s) => `[${s}]`).join(""), this.scope = o, this.errors = i, this.expectedType = a, this._isConstant = t;
  }
  /**
   * @param expr the JSON expression to parse
   * @param index the optional argument index if this expression is an argument of a parent expression that's being parsed
   * @param options
   * @param options.omitTypeAnnotations set true to omit inferred type annotations.  Caller beware: with this option set, the parsed expression's type will NOT satisfy `expectedType` if it would normally be wrapped in an inferred annotation.
   * @private
   */
  parse(e, t, n, a, o = {}) {
    return t ? this.concat(t, n, a)._parse(e, o) : this._parse(e, o);
  }
  _parse(e, t) {
    (e === null || typeof e == "string" || typeof e == "boolean" || typeof e == "number") && (e = ["literal", e]);
    function n(a, o, i) {
      return i === "assert" ? new te(o, [a]) : i === "coerce" ? new ge(o, [a]) : a;
    }
    if (Array.isArray(e)) {
      if (e.length === 0) return this.error('Expected an array with at least one element. If you wanted a literal array, use ["literal", []].');
      const a = e[0];
      if (typeof a != "string") return this.error(`Expression name must be a string, but found ${typeof a} instead. If you wanted a literal array, use ["literal", [...]].`, 0), null;
      const o = this.registry[a];
      if (o) {
        let i = o.parse(e, this);
        if (!i) return null;
        if (this.expectedType) {
          const s = this.expectedType, l = i.type;
          if ((s.kind === "string" || s.kind === "number" || s.kind === "boolean" || s.kind === "object" || s.kind === "array") && l.kind === "value") i = n(i, s, t.typeAnnotation || "assert");
          else if (s.kind === "projectionDefinition" && (l.kind === "string" || l.kind === "array")) i = n(i, s, t.typeAnnotation || "coerce");
          else if ((s.kind === "color" || s.kind === "formatted" || s.kind === "resolvedImage") && (l.kind === "value" || l.kind === "string")) i = n(i, s, t.typeAnnotation || "coerce");
          else if (s.kind === "padding" && (l.kind === "value" || l.kind === "number" || l.kind === "array")) i = n(i, s, t.typeAnnotation || "coerce");
          else if (s.kind === "variableAnchorOffsetCollection" && (l.kind === "value" || l.kind === "array")) i = n(i, s, t.typeAnnotation || "coerce");
          else if (this.checkSubtype(s, l)) return null;
        }
        if (!(i instanceof je) && i.type.kind !== "resolvedImage" && this._isConstant(i)) {
          const s = new _n();
          try {
            i = new je(i.type, i.evaluate(s));
          } catch (l) {
            return this.error(l.message), null;
          }
        }
        return i;
      }
      return this.error(`Unknown expression "${a}". If you wanted a literal array, use ["literal", [...]].`, 0);
    } else return typeof e > "u" ? this.error("'undefined' value invalid. Use null instead.") : typeof e == "object" ? this.error('Bare objects invalid. Use ["literal", {...}] instead.') : this.error(`Expected an array, but found ${typeof e} instead.`);
  }
  /**
   * Returns a copy of this context suitable for parsing the subexpression at
   * index `index`, optionally appending to 'let' binding map.
   *
   * Note that `errors` property, intended for collecting errors while
   * parsing, is copied by reference rather than cloned.
   * @private
   */
  concat(e, t, n) {
    const a = typeof e == "number" ? this.path.concat(e) : this.path, o = n ? this.scope.concat(n) : this.scope;
    return new _kt(this.registry, this._isConstant, a, t || null, o, this.errors);
  }
  /**
   * Push a parsing (or type checking) error into the `this.errors`
   * @param error The message
   * @param keys Optionally specify the source of the error at a child
   * of the current expression at `this.key`.
   * @private
   */
  error(e, ...t) {
    const n = `${this.key}${t.map((a) => `[${a}]`).join("")}`;
    this.errors.push(new oe(n, e));
  }
  /**
   * Returns null if `t` is a subtype of `expected`; otherwise returns an
   * error message and also pushes it to `this.errors`.
   * @param expected The expected type
   * @param t The actual type
   * @returns null if `t` is a subtype of `expected`; otherwise returns an error message
   */
  checkSubtype(e, t) {
    const n = Ve(e, t);
    return n && this.error(n), n;
  }
};
var Lt = class _Lt {
  constructor(e, t) {
    this.type = t.type, this.bindings = [].concat(e), this.result = t;
  }
  evaluate(e) {
    return this.result.evaluate(e);
  }
  eachChild(e) {
    for (const t of this.bindings) e(t[1]);
    e(this.result);
  }
  static parse(e, t) {
    if (e.length < 4) return t.error(`Expected at least 3 arguments, but found ${e.length - 1} instead.`);
    const n = [];
    for (let o = 1; o < e.length - 1; o += 2) {
      const i = e[o];
      if (typeof i != "string") return t.error(`Expected string, but found ${typeof i} instead.`, o);
      if (/[^a-zA-Z0-9_]/.test(i)) return t.error("Variable names must contain only alphanumeric characters or '_'.", o);
      const s = t.parse(e[o + 1], o + 1);
      if (!s) return null;
      n.push([i, s]);
    }
    const a = t.parse(e[e.length - 1], e.length - 1, t.expectedType, n);
    return a ? new _Lt(n, a) : null;
  }
  outputDefined() {
    return this.result.outputDefined();
  }
};
var Ct = class _Ct {
  constructor(e, t) {
    this.type = t.type, this.name = e, this.boundExpression = t;
  }
  static parse(e, t) {
    if (e.length !== 2 || typeof e[1] != "string") return t.error("'var' expression requires exactly one string literal argument.");
    const n = e[1];
    return t.scope.has(n) ? new _Ct(n, t.scope.get(n)) : t.error(`Unknown variable "${n}". Make sure "${n}" has been bound in an enclosing "let" expression before using it.`, 1);
  }
  evaluate(e) {
    return this.boundExpression.evaluate(e);
  }
  eachChild() {
  }
  outputDefined() {
    return false;
  }
};
var lr = class _lr {
  constructor(e, t, n) {
    this.type = e, this.index = t, this.input = n;
  }
  static parse(e, t) {
    if (e.length !== 3) return t.error(`Expected 2 arguments, but found ${e.length - 1} instead.`);
    const n = t.parse(e[1], 1, g), a = t.parse(e[2], 2, W(t.expectedType || A));
    if (!n || !a) return null;
    const o = a.type;
    return new _lr(o.itemType, n, a);
  }
  evaluate(e) {
    const t = this.index.evaluate(e), n = this.input.evaluate(e);
    if (t < 0) throw new D(`Array index out of bounds: ${t} < 0.`);
    if (t >= n.length) throw new D(`Array index out of bounds: ${t} > ${n.length - 1}.`);
    if (t !== Math.floor(t)) throw new D(`Array index must be an integer, but found ${t} instead.`);
    return n[t];
  }
  eachChild(e) {
    e(this.index), e(this.input);
  }
  outputDefined() {
    return false;
  }
};
var ur = class _ur {
  constructor(e, t) {
    this.type = C, this.needle = e, this.haystack = t;
  }
  static parse(e, t) {
    if (e.length !== 3) return t.error(`Expected 2 arguments, but found ${e.length - 1} instead.`);
    const n = t.parse(e[1], 1, A), a = t.parse(e[2], 2, A);
    return !n || !a ? null : ir(n.type, [C, I, g, gt, A]) ? new _ur(n, a) : t.error(`Expected first argument to be of type boolean, string, number or null, but found ${N(n.type)} instead`);
  }
  evaluate(e) {
    const t = this.needle.evaluate(e), n = this.haystack.evaluate(e);
    if (!n) return false;
    if (!Le(t, ["boolean", "string", "number", "null"])) throw new D(`Expected first argument to be of type boolean, string, number or null, but found ${N(q(t))} instead.`);
    if (!Le(n, ["string", "array"])) throw new D(`Expected second argument to be of type array or string, but found ${N(q(n))} instead.`);
    return n.indexOf(t) >= 0;
  }
  eachChild(e) {
    e(this.needle), e(this.haystack);
  }
  outputDefined() {
    return true;
  }
};
var ut = class _ut {
  constructor(e, t, n) {
    this.type = g, this.needle = e, this.haystack = t, this.fromIndex = n;
  }
  static parse(e, t) {
    if (e.length <= 2 || e.length >= 5) return t.error(`Expected 3 or 4 arguments, but found ${e.length - 1} instead.`);
    const n = t.parse(e[1], 1, A), a = t.parse(e[2], 2, A);
    if (!n || !a) return null;
    if (!ir(n.type, [C, I, g, gt, A])) return t.error(`Expected first argument to be of type boolean, string, number or null, but found ${N(n.type)} instead`);
    if (e.length === 4) {
      const o = t.parse(e[3], 3, g);
      return o ? new _ut(n, a, o) : null;
    } else return new _ut(n, a);
  }
  evaluate(e) {
    const t = this.needle.evaluate(e), n = this.haystack.evaluate(e);
    if (!Le(t, ["boolean", "string", "number", "null"])) throw new D(`Expected first argument to be of type boolean, string, number or null, but found ${N(q(t))} instead.`);
    let a;
    if (this.fromIndex && (a = this.fromIndex.evaluate(e)), Le(n, ["string"])) {
      const o = n.indexOf(t, a);
      return o === -1 ? -1 : [...n.slice(0, o)].length;
    } else {
      if (Le(n, ["array"])) return n.indexOf(t, a);
      throw new D(`Expected second argument to be of type array or string, but found ${N(q(n))} instead.`);
    }
  }
  eachChild(e) {
    e(this.needle), e(this.haystack), this.fromIndex && e(this.fromIndex);
  }
  outputDefined() {
    return false;
  }
};
var cr = class _cr {
  constructor(e, t, n, a, o, i) {
    this.inputType = e, this.type = t, this.input = n, this.cases = a, this.outputs = o, this.otherwise = i;
  }
  static parse(e, t) {
    if (e.length < 5) return t.error(`Expected at least 4 arguments, but found only ${e.length - 1}.`);
    if (e.length % 2 !== 1) return t.error("Expected an even number of arguments.");
    let n, a;
    t.expectedType && t.expectedType.kind !== "value" && (a = t.expectedType);
    const o = {}, i = [];
    for (let u = 2; u < e.length - 1; u += 2) {
      let c = e[u];
      const p = e[u + 1];
      Array.isArray(c) || (c = [c]);
      const m = t.concat(u);
      if (c.length === 0) return m.error("Expected at least one branch label.");
      for (const d of c) {
        if (typeof d != "number" && typeof d != "string") return m.error("Branch labels must be numbers or strings.");
        if (typeof d == "number" && Math.abs(d) > Number.MAX_SAFE_INTEGER) return m.error(`Branch labels must be integers no larger than ${Number.MAX_SAFE_INTEGER}.`);
        if (typeof d == "number" && Math.floor(d) !== d) return m.error("Numeric branch labels must be integer values.");
        if (!n) n = q(d);
        else if (m.checkSubtype(n, q(d))) return null;
        if (typeof o[String(d)] < "u") return m.error("Branch labels must be unique.");
        o[String(d)] = i.length;
      }
      const f = t.parse(p, u, a);
      if (!f) return null;
      a = a || f.type, i.push(f);
    }
    const s = t.parse(e[1], 1, A);
    if (!s) return null;
    const l = t.parse(e[e.length - 1], e.length - 1, a);
    return !l || s.type.kind !== "value" && t.concat(1).checkSubtype(n, s.type) ? null : new _cr(n, a, s, o, i, l);
  }
  evaluate(e) {
    const t = this.input.evaluate(e);
    return (q(t) === this.inputType && this.outputs[this.cases[t]] || this.otherwise).evaluate(e);
  }
  eachChild(e) {
    e(this.input), this.outputs.forEach(e), e(this.otherwise);
  }
  outputDefined() {
    return this.outputs.every((e) => e.outputDefined()) && this.otherwise.outputDefined();
  }
};
var pr = class _pr {
  constructor(e, t, n) {
    this.type = e, this.branches = t, this.otherwise = n;
  }
  static parse(e, t) {
    if (e.length < 4) return t.error(`Expected at least 3 arguments, but found only ${e.length - 1}.`);
    if (e.length % 2 !== 0) return t.error("Expected an odd number of arguments.");
    let n;
    t.expectedType && t.expectedType.kind !== "value" && (n = t.expectedType);
    const a = [];
    for (let i = 1; i < e.length - 1; i += 2) {
      const s = t.parse(e[i], i, C);
      if (!s) return null;
      const l = t.parse(e[i + 1], i + 1, n);
      if (!l) return null;
      a.push([s, l]), n = n || l.type;
    }
    const o = t.parse(e[e.length - 1], e.length - 1, n);
    if (!o) return null;
    if (!n) throw new Error("Can't infer output type");
    return new _pr(n, a, o);
  }
  evaluate(e) {
    for (const [t, n] of this.branches) if (t.evaluate(e)) return n.evaluate(e);
    return this.otherwise.evaluate(e);
  }
  eachChild(e) {
    for (const [t, n] of this.branches) e(t), e(n);
    e(this.otherwise);
  }
  outputDefined() {
    return this.branches.every(([e, t]) => t.outputDefined()) && this.otherwise.outputDefined();
  }
};
var ct = class _ct {
  constructor(e, t, n, a) {
    this.type = e, this.input = t, this.beginIndex = n, this.endIndex = a;
  }
  static parse(e, t) {
    if (e.length <= 2 || e.length >= 5) return t.error(`Expected 3 or 4 arguments, but found ${e.length - 1} instead.`);
    const n = t.parse(e[1], 1, A), a = t.parse(e[2], 2, g);
    if (!n || !a) return null;
    if (!ir(n.type, [W(A), I, A])) return t.error(`Expected first argument to be of type array or string, but found ${N(n.type)} instead`);
    if (e.length === 4) {
      const o = t.parse(e[3], 3, g);
      return o ? new _ct(n.type, n, a, o) : null;
    } else return new _ct(n.type, n, a);
  }
  evaluate(e) {
    const t = this.input.evaluate(e), n = this.beginIndex.evaluate(e);
    let a;
    if (this.endIndex && (a = this.endIndex.evaluate(e)), Le(t, ["string"])) return [...t].slice(n, a).join("");
    if (Le(t, ["array"])) return t.slice(n, a);
    throw new D(`Expected first argument to be of type array or string, but found ${N(q(t))} instead.`);
  }
  eachChild(e) {
    e(this.input), e(this.beginIndex), this.endIndex && e(this.endIndex);
  }
  outputDefined() {
    return false;
  }
};
function Pn(r, e) {
  const t = r.length - 1;
  let n = 0, a = t, o = 0, i, s;
  for (; n <= a; ) if (o = Math.floor((n + a) / 2), i = r[o], s = r[o + 1], i <= e) {
    if (o === t || e < s) return o;
    n = o + 1;
  } else if (i > e) a = o - 1;
  else throw new D("Input is not a number.");
  return 0;
}
var At = class _At {
  constructor(e, t, n) {
    this.type = e, this.input = t, this.labels = [], this.outputs = [];
    for (const [a, o] of n) this.labels.push(a), this.outputs.push(o);
  }
  static parse(e, t) {
    if (e.length - 1 < 4) return t.error(`Expected at least 4 arguments, but found only ${e.length - 1}.`);
    if ((e.length - 1) % 2 !== 0) return t.error("Expected an even number of arguments.");
    const n = t.parse(e[1], 1, g);
    if (!n) return null;
    const a = [];
    let o = null;
    t.expectedType && t.expectedType.kind !== "value" && (o = t.expectedType);
    for (let i = 1; i < e.length; i += 2) {
      const s = i === 1 ? -1 / 0 : e[i], l = e[i + 1], u = i, c = i + 1;
      if (typeof s != "number") return t.error('Input/output pairs for "step" expressions must be defined using literal numeric values (not computed expressions) for the input values.', u);
      if (a.length && a[a.length - 1][0] >= s) return t.error('Input/output pairs for "step" expressions must be arranged with input values in strictly ascending order.', u);
      const p = t.parse(l, c, o);
      if (!p) return null;
      o = o || p.type, a.push([s, p]);
    }
    return new _At(o, n, a);
  }
  evaluate(e) {
    const t = this.labels, n = this.outputs;
    if (t.length === 1) return n[0].evaluate(e);
    const a = this.input.evaluate(e);
    if (a <= t[0]) return n[0].evaluate(e);
    const o = t.length;
    if (a >= t[o - 1]) return n[o - 1].evaluate(e);
    const i = Pn(t, a);
    return n[i].evaluate(e);
  }
  eachChild(e) {
    e(this.input);
    for (const t of this.outputs) e(t);
  }
  outputDefined() {
    return this.outputs.every((e) => e.outputDefined());
  }
};
function Li(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var qt;
var Ur;
function Ci() {
  if (Ur) return qt;
  Ur = 1, qt = r;
  function r(e, t, n, a) {
    this.cx = 3 * e, this.bx = 3 * (n - e) - this.cx, this.ax = 1 - this.cx - this.bx, this.cy = 3 * t, this.by = 3 * (a - t) - this.cy, this.ay = 1 - this.cy - this.by, this.p1x = e, this.p1y = t, this.p2x = n, this.p2y = a;
  }
  return r.prototype = {
    sampleCurveX: function(e) {
      return ((this.ax * e + this.bx) * e + this.cx) * e;
    },
    sampleCurveY: function(e) {
      return ((this.ay * e + this.by) * e + this.cy) * e;
    },
    sampleCurveDerivativeX: function(e) {
      return (3 * this.ax * e + 2 * this.bx) * e + this.cx;
    },
    solveCurveX: function(e, t) {
      if (t === void 0 && (t = 1e-6), e < 0) return 0;
      if (e > 1) return 1;
      for (var n = e, a = 0; a < 8; a++) {
        var o = this.sampleCurveX(n) - e;
        if (Math.abs(o) < t) return n;
        var i = this.sampleCurveDerivativeX(n);
        if (Math.abs(i) < 1e-6) break;
        n = n - o / i;
      }
      var s = 0, l = 1;
      for (n = e, a = 0; a < 20 && (o = this.sampleCurveX(n), !(Math.abs(o - e) < t)); a++) e > o ? s = n : l = n, n = (l - s) * 0.5 + s;
      return n;
    },
    solve: function(e, t) {
      return this.sampleCurveY(this.solveCurveX(e, t));
    }
  }, qt;
}
var Ai = Ci();
var Ti = Li(Ai);
var se = class _se {
  constructor(e, t, n, a, o) {
    this.type = e, this.operator = t, this.interpolation = n, this.input = a, this.labels = [], this.outputs = [];
    for (const [i, s] of o) this.labels.push(i), this.outputs.push(s);
  }
  static interpolationFactor(e, t, n, a) {
    let o = 0;
    if (e.name === "exponential") o = Bt(t, e.base, n, a);
    else if (e.name === "linear") o = Bt(t, 1, n, a);
    else if (e.name === "cubic-bezier") {
      const i = e.controlPoints;
      o = new Ti(i[0], i[1], i[2], i[3]).solve(Bt(t, 1, n, a));
    }
    return o;
  }
  static parse(e, t) {
    let [n, a, o, ...i] = e;
    if (!Array.isArray(a) || a.length === 0) return t.error("Expected an interpolation type expression.", 1);
    if (a[0] === "linear") a = {
      name: "linear"
    };
    else if (a[0] === "exponential") {
      const u = a[1];
      if (typeof u != "number") return t.error("Exponential interpolation requires a numeric base.", 1, 1);
      a = {
        name: "exponential",
        base: u
      };
    } else if (a[0] === "cubic-bezier") {
      const u = a.slice(1);
      if (u.length !== 4 || u.some((c) => typeof c != "number" || c < 0 || c > 1)) return t.error("Cubic bezier interpolation requires four numeric arguments with values between 0 and 1.", 1);
      a = {
        name: "cubic-bezier",
        controlPoints: u
      };
    } else return t.error(`Unknown interpolation type ${String(a[0])}`, 1, 0);
    if (e.length - 1 < 4) return t.error(`Expected at least 4 arguments, but found only ${e.length - 1}.`);
    if ((e.length - 1) % 2 !== 0) return t.error("Expected an even number of arguments.");
    if (o = t.parse(o, 2, g), !o) return null;
    const s = [];
    let l = null;
    n === "interpolate-hcl" || n === "interpolate-lab" ? l = ie : t.expectedType && t.expectedType.kind !== "value" && (l = t.expectedType);
    for (let u = 0; u < i.length; u += 2) {
      const c = i[u], p = i[u + 1], m = u + 3, f = u + 4;
      if (typeof c != "number") return t.error('Input/output pairs for "interpolate" expressions must be defined using literal numeric values (not computed expressions) for the input values.', m);
      if (s.length && s[s.length - 1][0] >= c) return t.error('Input/output pairs for "interpolate" expressions must be arranged with input values in strictly ascending order.', m);
      const d = t.parse(p, f, l);
      if (!d) return null;
      l = l || d.type, s.push([c, d]);
    }
    return !ze(l, g) && !ze(l, vt) && !ze(l, ie) && !ze(l, St) && !ze(l, xt) && !ze(l, W(g)) ? t.error(`Type ${N(l)} is not interpolatable.`) : new _se(l, n, a, o, s);
  }
  evaluate(e) {
    const t = this.labels, n = this.outputs;
    if (t.length === 1) return n[0].evaluate(e);
    const a = this.input.evaluate(e);
    if (a <= t[0]) return n[0].evaluate(e);
    const o = t.length;
    if (a >= t[o - 1]) return n[o - 1].evaluate(e);
    const i = Pn(t, a), s = t[i], l = t[i + 1], u = _se.interpolationFactor(this.interpolation, a, s, l), c = n[i].evaluate(e), p = n[i + 1].evaluate(e);
    switch (this.operator) {
      case "interpolate":
        switch (this.type.kind) {
          case "number":
            return ve(c, p, u);
          case "color":
            return $.interpolate(c, p, u);
          case "padding":
            return J.interpolate(c, p, u);
          case "variableAnchorOffsetCollection":
            return ne.interpolate(c, p, u);
          case "array":
            return Ge(c, p, u);
          case "projectionDefinition":
            return ee.interpolate(c, p, u);
        }
      case "interpolate-hcl":
        return $.interpolate(c, p, u, "hcl");
      case "interpolate-lab":
        return $.interpolate(c, p, u, "lab");
    }
  }
  eachChild(e) {
    e(this.input);
    for (const t of this.outputs) e(t);
  }
  outputDefined() {
    return this.outputs.every((e) => e.outputDefined());
  }
};
function Bt(r, e, t, n) {
  const a = n - t, o = r - t;
  return a === 0 ? 0 : e === 1 ? o / a : (Math.pow(e, o) - 1) / (Math.pow(e, a) - 1);
}
$.interpolate, J.interpolate, ne.interpolate;
var Ke = class _Ke {
  constructor(e, t) {
    this.type = e, this.args = t;
  }
  static parse(e, t) {
    if (e.length < 2) return t.error("Expected at least one argument.");
    let n = null;
    const a = t.expectedType;
    a && a.kind !== "value" && (n = a);
    const o = [];
    for (const s of e.slice(1)) {
      const l = t.parse(s, 1 + o.length, n, void 0, {
        typeAnnotation: "omit"
      });
      if (!l) return null;
      n = n || l.type, o.push(l);
    }
    if (!n) throw new Error("No output type");
    return a && o.some((s) => Ve(a, s.type)) ? new _Ke(A, o) : new _Ke(n, o);
  }
  evaluate(e) {
    let t = null, n = 0, a;
    for (const o of this.args) if (n++, t = o.evaluate(e), t && t instanceof be && !t.available && (a || (a = t.name), t = null, n === this.args.length && (t = a)), t !== null) break;
    return t;
  }
  eachChild(e) {
    this.args.forEach(e);
  }
  outputDefined() {
    return this.args.every((e) => e.outputDefined());
  }
};
function Vr(r, e) {
  return r === "==" || r === "!=" ? e.kind === "boolean" || e.kind === "string" || e.kind === "number" || e.kind === "null" || e.kind === "value" : e.kind === "string" || e.kind === "number" || e.kind === "value";
}
function Ii(r, e, t) {
  return e === t;
}
function Ei(r, e, t) {
  return e !== t;
}
function Mi(r, e, t) {
  return e < t;
}
function zi(r, e, t) {
  return e > t;
}
function _i(r, e, t) {
  return e <= t;
}
function Pi(r, e, t) {
  return e >= t;
}
function Rn(r, e, t, n) {
  return n.compare(e, t) === 0;
}
function Ri(r, e, t, n) {
  return !Rn(r, e, t, n);
}
function $i(r, e, t, n) {
  return n.compare(e, t) < 0;
}
function ji(r, e, t, n) {
  return n.compare(e, t) > 0;
}
function Ni(r, e, t, n) {
  return n.compare(e, t) <= 0;
}
function Fi(r, e, t, n) {
  return n.compare(e, t) >= 0;
}
function Fe(r, e, t) {
  const n = r !== "==" && r !== "!=";
  return class $n {
    constructor(o, i, s) {
      this.type = C, this.lhs = o, this.rhs = i, this.collator = s, this.hasUntypedArgument = o.type.kind === "value" || i.type.kind === "value";
    }
    static parse(o, i) {
      if (o.length !== 3 && o.length !== 4) return i.error("Expected two or three arguments.");
      const s = o[0];
      let l = i.parse(o[1], 1, A);
      if (!l) return null;
      if (!Vr(s, l.type)) return i.concat(1).error(`"${s}" comparisons are not supported for type '${N(l.type)}'.`);
      let u = i.parse(o[2], 2, A);
      if (!u) return null;
      if (!Vr(s, u.type)) return i.concat(2).error(`"${s}" comparisons are not supported for type '${N(u.type)}'.`);
      if (l.type.kind !== u.type.kind && l.type.kind !== "value" && u.type.kind !== "value") return i.error(`Cannot compare types '${N(l.type)}' and '${N(u.type)}'.`);
      n && (l.type.kind === "value" && u.type.kind !== "value" ? l = new te(u.type, [l]) : l.type.kind !== "value" && u.type.kind === "value" && (u = new te(l.type, [u])));
      let c = null;
      if (o.length === 4) {
        if (l.type.kind !== "string" && u.type.kind !== "string" && l.type.kind !== "value" && u.type.kind !== "value") return i.error("Cannot use collator to compare non-string types.");
        if (c = i.parse(o[3], 3, bt), !c) return null;
      }
      return new $n(l, u, c);
    }
    evaluate(o) {
      const i = this.lhs.evaluate(o), s = this.rhs.evaluate(o);
      if (n && this.hasUntypedArgument) {
        const l = q(i), u = q(s);
        if (l.kind !== u.kind || !(l.kind === "string" || l.kind === "number")) throw new D(`Expected arguments for "${r}" to be (string, string) or (number, number), but found (${l.kind}, ${u.kind}) instead.`);
      }
      if (this.collator && !n && this.hasUntypedArgument) {
        const l = q(i), u = q(s);
        if (l.kind !== "string" || u.kind !== "string") return e(o, i, s);
      }
      return this.collator ? t(o, i, s, this.collator.evaluate(o)) : e(o, i, s);
    }
    eachChild(o) {
      o(this.lhs), o(this.rhs), this.collator && o(this.collator);
    }
    outputDefined() {
      return true;
    }
  };
}
var Oi = Fe("==", Ii, Rn);
var Di = Fe("!=", Ei, Ri);
var qi = Fe("<", Mi, $i);
var Bi = Fe(">", zi, ji);
var Ui = Fe("<=", _i, Ni);
var Vi = Fe(">=", Pi, Fi);
var Tt = class _Tt {
  constructor(e, t, n) {
    this.type = bt, this.locale = n, this.caseSensitive = e, this.diacriticSensitive = t;
  }
  static parse(e, t) {
    if (e.length !== 2) return t.error("Expected one argument.");
    const n = e[1];
    if (typeof n != "object" || Array.isArray(n)) return t.error("Collator options argument must be an object.");
    const a = t.parse(n["case-sensitive"] === void 0 ? false : n["case-sensitive"], 1, C);
    if (!a) return null;
    const o = t.parse(n["diacritic-sensitive"] === void 0 ? false : n["diacritic-sensitive"], 1, C);
    if (!o) return null;
    let i = null;
    return n.locale && (i = t.parse(n.locale, 1, I), !i) ? null : new _Tt(a, o, i);
  }
  evaluate(e) {
    return new sr(this.caseSensitive.evaluate(e), this.diacriticSensitive.evaluate(e), this.locale ? this.locale.evaluate(e) : null);
  }
  eachChild(e) {
    e(this.caseSensitive), e(this.diacriticSensitive), this.locale && e(this.locale);
  }
  outputDefined() {
    return false;
  }
};
var fr = class _fr {
  constructor(e, t, n, a, o) {
    this.type = I, this.number = e, this.locale = t, this.currency = n, this.minFractionDigits = a, this.maxFractionDigits = o;
  }
  static parse(e, t) {
    if (e.length !== 3) return t.error("Expected two arguments.");
    const n = t.parse(e[1], 1, g);
    if (!n) return null;
    const a = e[2];
    if (typeof a != "object" || Array.isArray(a)) return t.error("NumberFormat options argument must be an object.");
    let o = null;
    if (a.locale && (o = t.parse(a.locale, 1, I), !o)) return null;
    let i = null;
    if (a.currency && (i = t.parse(a.currency, 1, I), !i)) return null;
    let s = null;
    if (a["min-fraction-digits"] && (s = t.parse(a["min-fraction-digits"], 1, g), !s)) return null;
    let l = null;
    return a["max-fraction-digits"] && (l = t.parse(a["max-fraction-digits"], 1, g), !l) ? null : new _fr(n, o, i, s, l);
  }
  evaluate(e) {
    return new Intl.NumberFormat(this.locale ? this.locale.evaluate(e) : [], {
      style: this.currency ? "currency" : "decimal",
      currency: this.currency ? this.currency.evaluate(e) : void 0,
      minimumFractionDigits: this.minFractionDigits ? this.minFractionDigits.evaluate(e) : void 0,
      maximumFractionDigits: this.maxFractionDigits ? this.maxFractionDigits.evaluate(e) : void 0
    }).format(this.number.evaluate(e));
  }
  eachChild(e) {
    e(this.number), this.locale && e(this.locale), this.currency && e(this.currency), this.minFractionDigits && e(this.minFractionDigits), this.maxFractionDigits && e(this.maxFractionDigits);
  }
  outputDefined() {
    return false;
  }
};
var dr = class _dr {
  constructor(e) {
    this.type = wt, this.sections = e;
  }
  static parse(e, t) {
    if (e.length < 2) return t.error("Expected at least one argument.");
    const n = e[1];
    if (!Array.isArray(n) && typeof n == "object") return t.error("First argument must be an image or text section.");
    const a = [];
    let o = false;
    for (let i = 1; i <= e.length - 1; ++i) {
      const s = e[i];
      if (o && typeof s == "object" && !Array.isArray(s)) {
        o = false;
        let l = null;
        if (s["font-scale"] && (l = t.parse(s["font-scale"], 1, g), !l)) return null;
        let u = null;
        if (s["text-font"] && (u = t.parse(s["text-font"], 1, W(I)), !u)) return null;
        let c = null;
        if (s["text-color"] && (c = t.parse(s["text-color"], 1, ie), !c)) return null;
        const p = a[a.length - 1];
        p.scale = l, p.font = u, p.textColor = c;
      } else {
        const l = t.parse(e[i], 1, A);
        if (!l) return null;
        const u = l.type.kind;
        if (u !== "string" && u !== "value" && u !== "null" && u !== "resolvedImage") return t.error("Formatted text type must be 'string', 'value', 'image' or 'null'.");
        o = true, a.push({
          content: l,
          scale: null,
          font: null,
          textColor: null
        });
      }
    }
    return new _dr(a);
  }
  evaluate(e) {
    const t = (n) => {
      const a = n.content.evaluate(e);
      return q(a) === Xe ? new Zt("", a, null, null, null) : new Zt(Be(a), null, n.scale ? n.scale.evaluate(e) : null, n.font ? n.font.evaluate(e).join(",") : null, n.textColor ? n.textColor.evaluate(e) : null);
    };
    return new fe(this.sections.map(t));
  }
  eachChild(e) {
    for (const t of this.sections) e(t.content), t.scale && e(t.scale), t.font && e(t.font), t.textColor && e(t.textColor);
  }
  outputDefined() {
    return false;
  }
};
var yr = class _yr {
  constructor(e) {
    this.type = Xe, this.input = e;
  }
  static parse(e, t) {
    if (e.length !== 2) return t.error("Expected two arguments.");
    const n = t.parse(e[1], 1, I);
    return n ? new _yr(n) : t.error("No image name provided.");
  }
  evaluate(e) {
    const t = this.input.evaluate(e), n = be.fromString(t);
    return n && e.availableImages && (n.available = e.availableImages.indexOf(t) > -1), n;
  }
  eachChild(e) {
    e(this.input);
  }
  outputDefined() {
    return false;
  }
};
var mr = class _mr {
  constructor(e) {
    this.type = g, this.input = e;
  }
  static parse(e, t) {
    if (e.length !== 2) return t.error(`Expected 1 argument, but found ${e.length - 1} instead.`);
    const n = t.parse(e[1], 1);
    return n ? n.type.kind !== "array" && n.type.kind !== "string" && n.type.kind !== "value" ? t.error(`Expected argument of type string or array, but found ${N(n.type)} instead.`) : new _mr(n) : null;
  }
  evaluate(e) {
    const t = this.input.evaluate(e);
    if (typeof t == "string") return [...t].length;
    if (Array.isArray(t)) return t.length;
    throw new D(`Expected value to be of type string or array, but found ${N(q(t))} instead.`);
  }
  eachChild(e) {
    e(this.input);
  }
  outputDefined() {
    return false;
  }
};
var le = 8192;
function Gi(r, e) {
  const t = Hi(r[0]), n = Wi(r[1]), a = Math.pow(2, e.z);
  return [Math.round(t * a * le), Math.round(n * a * le)];
}
function hr(r, e) {
  const t = Math.pow(2, e.z), n = (r[0] / le + e.x) / t, a = (r[1] / le + e.y) / t;
  return [Ki(n), Zi(a)];
}
function Hi(r) {
  return (180 + r) / 360;
}
function Ki(r) {
  return r * 360 - 180;
}
function Wi(r) {
  return (180 - 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + r * Math.PI / 360))) / 360;
}
function Zi(r) {
  return 360 / Math.PI * Math.atan(Math.exp((180 - r * 360) * Math.PI / 180)) - 90;
}
function Qe(r, e) {
  r[0] = Math.min(r[0], e[0]), r[1] = Math.min(r[1], e[1]), r[2] = Math.max(r[2], e[0]), r[3] = Math.max(r[3], e[1]);
}
function We(r, e) {
  return !(r[0] <= e[0] || r[2] >= e[2] || r[1] <= e[1] || r[3] >= e[3]);
}
function Ji(r, e, t) {
  return e[1] > r[1] != t[1] > r[1] && r[0] < (t[0] - e[0]) * (r[1] - e[1]) / (t[1] - e[1]) + e[0];
}
function Yi(r, e, t) {
  const n = r[0] - e[0], a = r[1] - e[1], o = r[0] - t[0], i = r[1] - t[1];
  return n * i - o * a === 0 && n * o <= 0 && a * i <= 0;
}
function It(r, e, t, n) {
  const a = [e[0] - r[0], e[1] - r[1]], o = [n[0] - t[0], n[1] - t[1]];
  return ts(o, a) === 0 ? false : !!(Gr(r, e, t, n) && Gr(t, n, r, e));
}
function Xi(r, e, t) {
  for (const n of t) for (let a = 0; a < n.length - 1; ++a) if (It(r, e, n[a], n[a + 1])) return true;
  return false;
}
function Oe(r, e, t = false) {
  let n = false;
  for (const a of e) for (let o = 0; o < a.length - 1; o++) {
    if (Yi(r, a[o], a[o + 1])) return t;
    Ji(r, a[o], a[o + 1]) && (n = !n);
  }
  return n;
}
function Qi(r, e) {
  for (const t of e) if (Oe(r, t)) return true;
  return false;
}
function jn(r, e) {
  for (const t of r) if (!Oe(t, e)) return false;
  for (let t = 0; t < r.length - 1; ++t) if (Xi(r[t], r[t + 1], e)) return false;
  return true;
}
function es(r, e) {
  for (const t of e) if (jn(r, t)) return true;
  return false;
}
function ts(r, e) {
  return r[0] * e[1] - r[1] * e[0];
}
function Gr(r, e, t, n) {
  const a = r[0] - t[0], o = r[1] - t[1], i = e[0] - t[0], s = e[1] - t[1], l = n[0] - t[0], u = n[1] - t[1], c = a * u - l * o, p = i * u - l * s;
  return c > 0 && p < 0 || c < 0 && p > 0;
}
function gr(r, e, t) {
  const n = [];
  for (let a = 0; a < r.length; a++) {
    const o = [];
    for (let i = 0; i < r[a].length; i++) {
      const s = Gi(r[a][i], t);
      Qe(e, s), o.push(s);
    }
    n.push(o);
  }
  return n;
}
function Nn(r, e, t) {
  const n = [];
  for (let a = 0; a < r.length; a++) {
    const o = gr(r[a], e, t);
    n.push(o);
  }
  return n;
}
function Fn(r, e, t, n) {
  if (r[0] < t[0] || r[0] > t[2]) {
    const a = n * 0.5;
    let o = r[0] - t[0] > a ? -n : t[0] - r[0] > a ? n : 0;
    o === 0 && (o = r[0] - t[2] > a ? -n : t[2] - r[0] > a ? n : 0), r[0] += o;
  }
  Qe(e, r);
}
function rs(r) {
  r[0] = r[1] = 1 / 0, r[2] = r[3] = -1 / 0;
}
function Hr(r, e, t, n) {
  const a = Math.pow(2, n.z) * le, o = [n.x * le, n.y * le], i = [];
  for (const s of r) for (const l of s) {
    const u = [l.x + o[0], l.y + o[1]];
    Fn(u, e, t, a), i.push(u);
  }
  return i;
}
function Kr(r, e, t, n) {
  const a = Math.pow(2, n.z) * le, o = [n.x * le, n.y * le], i = [];
  for (const s of r) {
    const l = [];
    for (const u of s) {
      const c = [u.x + o[0], u.y + o[1]];
      Qe(e, c), l.push(c);
    }
    i.push(l);
  }
  if (e[2] - e[0] <= a / 2) {
    rs(e);
    for (const s of i) for (const l of s) Fn(l, e, t, a);
  }
  return i;
}
function ns(r, e) {
  const t = [1 / 0, 1 / 0, -1 / 0, -1 / 0], n = [1 / 0, 1 / 0, -1 / 0, -1 / 0], a = r.canonicalID();
  if (e.type === "Polygon") {
    const o = gr(e.coordinates, n, a), i = Hr(r.geometry(), t, n, a);
    if (!We(t, n)) return false;
    for (const s of i) if (!Oe(s, o)) return false;
  }
  if (e.type === "MultiPolygon") {
    const o = Nn(e.coordinates, n, a), i = Hr(r.geometry(), t, n, a);
    if (!We(t, n)) return false;
    for (const s of i) if (!Qi(s, o)) return false;
  }
  return true;
}
function as(r, e) {
  const t = [1 / 0, 1 / 0, -1 / 0, -1 / 0], n = [1 / 0, 1 / 0, -1 / 0, -1 / 0], a = r.canonicalID();
  if (e.type === "Polygon") {
    const o = gr(e.coordinates, n, a), i = Kr(r.geometry(), t, n, a);
    if (!We(t, n)) return false;
    for (const s of i) if (!jn(s, o)) return false;
  }
  if (e.type === "MultiPolygon") {
    const o = Nn(e.coordinates, n, a), i = Kr(r.geometry(), t, n, a);
    if (!We(t, n)) return false;
    for (const s of i) if (!es(s, o)) return false;
  }
  return true;
}
var Ce = class _Ce {
  constructor(e, t) {
    this.type = C, this.geojson = e, this.geometries = t;
  }
  static parse(e, t) {
    if (e.length !== 2) return t.error(`'within' expression requires exactly one argument, but found ${e.length - 1} instead.`);
    if (He(e[1])) {
      const n = e[1];
      if (n.type === "FeatureCollection") {
        const a = [];
        for (const o of n.features) {
          const {
            type: i,
            coordinates: s
          } = o.geometry;
          i === "Polygon" && a.push(s), i === "MultiPolygon" && a.push(...s);
        }
        if (a.length) {
          const o = {
            type: "MultiPolygon",
            coordinates: a
          };
          return new _Ce(n, o);
        }
      } else if (n.type === "Feature") {
        const a = n.geometry.type;
        if (a === "Polygon" || a === "MultiPolygon") return new _Ce(n, n.geometry);
      } else if (n.type === "Polygon" || n.type === "MultiPolygon") return new _Ce(n, n);
    }
    return t.error("'within' expression requires valid geojson object that contains polygon geometry type.");
  }
  evaluate(e) {
    if (e.geometry() != null && e.canonicalID() != null) {
      if (e.geometryType() === "Point") return ns(e, this.geometries);
      if (e.geometryType() === "LineString") return as(e, this.geometries);
    }
    return false;
  }
  eachChild() {
  }
  outputDefined() {
    return true;
  }
};
var On = class {
  constructor(e = [], t = (n, a) => n < a ? -1 : n > a ? 1 : 0) {
    if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0) for (let n = (this.length >> 1) - 1; n >= 0; n--) this._down(n);
  }
  push(e) {
    this.data.push(e), this._up(this.length++);
  }
  pop() {
    if (this.length === 0) return;
    const e = this.data[0], t = this.data.pop();
    return --this.length > 0 && (this.data[0] = t, this._down(0)), e;
  }
  peek() {
    return this.data[0];
  }
  _up(e) {
    const {
      data: t,
      compare: n
    } = this, a = t[e];
    for (; e > 0; ) {
      const o = e - 1 >> 1, i = t[o];
      if (n(a, i) >= 0) break;
      t[e] = i, e = o;
    }
    t[e] = a;
  }
  _down(e) {
    const {
      data: t,
      compare: n
    } = this, a = this.length >> 1, o = t[e];
    for (; e < a; ) {
      let i = (e << 1) + 1;
      const s = i + 1;
      if (s < this.length && n(t[s], t[i]) < 0 && (i = s), n(t[i], o) >= 0) break;
      t[e] = t[i], e = i;
    }
    t[e] = o;
  }
};
function os(r, e) {
  if (r.length <= 1) return [r];
  const n = [];
  let a, o;
  for (const i of r) {
    const s = is(i);
    s !== 0 && (i.area = Math.abs(s), o === void 0 && (o = s < 0), o === s < 0 ? (a && n.push(a), a = [i]) : a.push(i));
  }
  return a && n.push(a), n;
}
function is(r) {
  let e = 0;
  for (let t = 0, n = r.length, a = n - 1, o, i; t < n; a = t++) o = r[t], i = r[a], e += (i.x - o.x) * (o.y + i.y);
  return e;
}
var ss = 6378.137;
var Wr = 1 / 298.257223563;
var Zr = Wr * (2 - Wr);
var Jr = Math.PI / 180;
var vr = class {
  constructor(e) {
    const t = Jr * ss * 1e3, n = Math.cos(e * Jr), a = 1 / (1 - Zr * (1 - n * n)), o = Math.sqrt(a);
    this.kx = t * o * n, this.ky = t * o * a * (1 - Zr);
  }
  /**
   * Given two points of the form [longitude, latitude], returns the distance.
   *
   * @param a - point [longitude, latitude]
   * @param b - point [longitude, latitude]
   * @returns distance
   * @example
   * const distance = ruler.distance([30.5, 50.5], [30.51, 50.49]);
   * //=distance
   */
  distance(e, t) {
    const n = this.wrap(e[0] - t[0]) * this.kx, a = (e[1] - t[1]) * this.ky;
    return Math.sqrt(n * n + a * a);
  }
  /**
   * Returns an object of the form {point, index, t}, where point is closest point on the line
   * from the given point, index is the start index of the segment with the closest point,
   * and t is a parameter from 0 to 1 that indicates where the closest point is on that segment.
   *
   * @param line - an array of points that form the line
   * @param p - point [longitude, latitude]
   * @returns the nearest point, its index in the array and the proportion along the line
   * @example
   * const point = ruler.pointOnLine(line, [-67.04, 50.5]).point;
   * //=point
   */
  pointOnLine(e, t) {
    let n = 1 / 0, a, o, i, s;
    for (let l = 0; l < e.length - 1; l++) {
      let u = e[l][0], c = e[l][1], p = this.wrap(e[l + 1][0] - u) * this.kx, m = (e[l + 1][1] - c) * this.ky, f = 0;
      (p !== 0 || m !== 0) && (f = (this.wrap(t[0] - u) * this.kx * p + (t[1] - c) * this.ky * m) / (p * p + m * m), f > 1 ? (u = e[l + 1][0], c = e[l + 1][1]) : f > 0 && (u += p / this.kx * f, c += m / this.ky * f)), p = this.wrap(t[0] - u) * this.kx, m = (t[1] - c) * this.ky;
      const d = p * p + m * m;
      d < n && (n = d, a = u, o = c, i = l, s = f);
    }
    return {
      point: [a, o],
      index: i,
      t: Math.max(0, Math.min(1, s))
    };
  }
  wrap(e) {
    for (; e < -180; ) e += 360;
    for (; e > 180; ) e -= 360;
    return e;
  }
};
var Jt = 100;
var Yt = 50;
function Dn(r, e) {
  return e[0] - r[0];
}
function pt(r) {
  return r[1] - r[0] + 1;
}
function de(r, e) {
  return r[1] >= r[0] && r[1] < e;
}
function Xt(r, e) {
  if (r[0] > r[1]) return [null, null];
  const t = pt(r);
  if (e) {
    if (t === 2) return [r, null];
    const a = Math.floor(t / 2);
    return [[r[0], r[0] + a], [r[0] + a, r[1]]];
  }
  if (t === 1) return [r, null];
  const n = Math.floor(t / 2) - 1;
  return [[r[0], r[0] + n], [r[0] + n + 1, r[1]]];
}
function Qt(r, e) {
  if (!de(e, r.length)) return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
  const t = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
  for (let n = e[0]; n <= e[1]; ++n) Qe(t, r[n]);
  return t;
}
function er(r) {
  const e = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
  for (const t of r) for (const n of t) Qe(e, n);
  return e;
}
function Yr(r) {
  return r[0] !== -1 / 0 && r[1] !== -1 / 0 && r[2] !== 1 / 0 && r[3] !== 1 / 0;
}
function br(r, e, t) {
  if (!Yr(r) || !Yr(e)) return NaN;
  let n = 0, a = 0;
  return r[2] < e[0] && (n = e[0] - r[2]), r[0] > e[2] && (n = r[0] - e[2]), r[1] > e[3] && (a = r[1] - e[3]), r[3] < e[1] && (a = e[1] - r[3]), t.distance([0, 0], [n, a]);
}
function ke(r, e, t) {
  const n = t.pointOnLine(e, r);
  return t.distance(r, n.point);
}
function wr(r, e, t, n, a) {
  const o = Math.min(ke(r, [t, n], a), ke(e, [t, n], a)), i = Math.min(ke(t, [r, e], a), ke(n, [r, e], a));
  return Math.min(o, i);
}
function ls(r, e, t, n, a) {
  if (!(de(e, r.length) && de(n, t.length))) return 1 / 0;
  let i = 1 / 0;
  for (let s = e[0]; s < e[1]; ++s) {
    const l = r[s], u = r[s + 1];
    for (let c = n[0]; c < n[1]; ++c) {
      const p = t[c], m = t[c + 1];
      if (It(l, u, p, m)) return 0;
      i = Math.min(i, wr(l, u, p, m, a));
    }
  }
  return i;
}
function us(r, e, t, n, a) {
  if (!(de(e, r.length) && de(n, t.length))) return NaN;
  let i = 1 / 0;
  for (let s = e[0]; s <= e[1]; ++s) for (let l = n[0]; l <= n[1]; ++l) if (i = Math.min(i, a.distance(r[s], t[l])), i === 0) return i;
  return i;
}
function cs(r, e, t) {
  if (Oe(r, e, true)) return 0;
  let n = 1 / 0;
  for (const a of e) {
    const o = a[0], i = a[a.length - 1];
    if (o !== i && (n = Math.min(n, ke(r, [i, o], t)), n === 0)) return n;
    const s = t.pointOnLine(a, r);
    if (n = Math.min(n, t.distance(r, s.point)), n === 0) return n;
  }
  return n;
}
function ps(r, e, t, n) {
  if (!de(e, r.length)) return NaN;
  for (let o = e[0]; o <= e[1]; ++o) if (Oe(r[o], t, true)) return 0;
  let a = 1 / 0;
  for (let o = e[0]; o < e[1]; ++o) {
    const i = r[o], s = r[o + 1];
    for (const l of t) for (let u = 0, c = l.length, p = c - 1; u < c; p = u++) {
      const m = l[p], f = l[u];
      if (It(i, s, m, f)) return 0;
      a = Math.min(a, wr(i, s, m, f, n));
    }
  }
  return a;
}
function Xr(r, e) {
  for (const t of r) for (const n of t) if (Oe(n, e, true)) return true;
  return false;
}
function fs(r, e, t, n = 1 / 0) {
  const a = er(r), o = er(e);
  if (n !== 1 / 0 && br(a, o, t) >= n) return n;
  if (We(a, o)) {
    if (Xr(r, e)) return 0;
  } else if (Xr(e, r)) return 0;
  let i = 1 / 0;
  for (const s of r) for (let l = 0, u = s.length, c = u - 1; l < u; c = l++) {
    const p = s[c], m = s[l];
    for (const f of e) for (let d = 0, y = f.length, v = y - 1; d < y; v = d++) {
      const w = f[v], b = f[d];
      if (It(p, m, w, b)) return 0;
      i = Math.min(i, wr(p, m, w, b, t));
    }
  }
  return i;
}
function Qr(r, e, t, n, a, o) {
  if (!o) return;
  const i = br(Qt(n, o), a, t);
  i < e && r.push([i, o, [0, 0]]);
}
function at2(r, e, t, n, a, o, i) {
  if (!o || !i) return;
  const s = br(Qt(n, o), Qt(a, i), t);
  s < e && r.push([s, o, i]);
}
function ft(r, e, t, n, a = 1 / 0) {
  let o = Math.min(n.distance(r[0], t[0][0]), a);
  if (o === 0) return o;
  const i = new On([[0, [0, r.length - 1], [0, 0]]], Dn), s = er(t);
  for (; i.length > 0; ) {
    const l = i.pop();
    if (l[0] >= o) continue;
    const u = l[1], c = e ? Yt : Jt;
    if (pt(u) <= c) {
      if (!de(u, r.length)) return NaN;
      if (e) {
        const p = ps(r, u, t, n);
        if (isNaN(p) || p === 0) return p;
        o = Math.min(o, p);
      } else for (let p = u[0]; p <= u[1]; ++p) {
        const m = cs(r[p], t, n);
        if (o = Math.min(o, m), o === 0) return 0;
      }
    } else {
      const p = Xt(u, e);
      Qr(i, o, n, r, s, p[0]), Qr(i, o, n, r, s, p[1]);
    }
  }
  return o;
}
function dt(r, e, t, n, a, o = 1 / 0) {
  let i = Math.min(o, a.distance(r[0], t[0]));
  if (i === 0) return i;
  const s = new On([[0, [0, r.length - 1], [0, t.length - 1]]], Dn);
  for (; s.length > 0; ) {
    const l = s.pop();
    if (l[0] >= i) continue;
    const u = l[1], c = l[2], p = e ? Yt : Jt, m = n ? Yt : Jt;
    if (pt(u) <= p && pt(c) <= m) {
      if (!de(u, r.length) && de(c, t.length)) return NaN;
      let f;
      if (e && n) f = ls(r, u, t, c, a), i = Math.min(i, f);
      else if (e && !n) {
        const d = r.slice(u[0], u[1] + 1);
        for (let y = c[0]; y <= c[1]; ++y) if (f = ke(t[y], d, a), i = Math.min(i, f), i === 0) return i;
      } else if (!e && n) {
        const d = t.slice(c[0], c[1] + 1);
        for (let y = u[0]; y <= u[1]; ++y) if (f = ke(r[y], d, a), i = Math.min(i, f), i === 0) return i;
      } else f = us(r, u, t, c, a), i = Math.min(i, f);
    } else {
      const f = Xt(u, e), d = Xt(c, n);
      at2(s, i, a, r, t, f[0], d[0]), at2(s, i, a, r, t, f[0], d[1]), at2(s, i, a, r, t, f[1], d[0]), at2(s, i, a, r, t, f[1], d[1]);
    }
  }
  return i;
}
function ds(r, e) {
  const t = r.geometry(), n = t.flat().map((i) => hr([i.x, i.y], r.canonical));
  if (t.length === 0) return NaN;
  const a = new vr(n[0][1]);
  let o = 1 / 0;
  for (const i of e) {
    switch (i.type) {
      case "Point":
        o = Math.min(o, dt(n, false, [i.coordinates], false, a, o));
        break;
      case "LineString":
        o = Math.min(o, dt(n, false, i.coordinates, true, a, o));
        break;
      case "Polygon":
        o = Math.min(o, ft(n, false, i.coordinates, a, o));
        break;
    }
    if (o === 0) return o;
  }
  return o;
}
function ys(r, e) {
  const t = r.geometry(), n = t.flat().map((i) => hr([i.x, i.y], r.canonical));
  if (t.length === 0) return NaN;
  const a = new vr(n[0][1]);
  let o = 1 / 0;
  for (const i of e) {
    switch (i.type) {
      case "Point":
        o = Math.min(o, dt(n, true, [i.coordinates], false, a, o));
        break;
      case "LineString":
        o = Math.min(o, dt(n, true, i.coordinates, true, a, o));
        break;
      case "Polygon":
        o = Math.min(o, ft(n, true, i.coordinates, a, o));
        break;
    }
    if (o === 0) return o;
  }
  return o;
}
function ms(r, e) {
  const t = r.geometry();
  if (t.length === 0 || t[0].length === 0) return NaN;
  const n = os(t).map((i) => i.map((s) => s.map((l) => hr([l.x, l.y], r.canonical)))), a = new vr(n[0][0][0][1]);
  let o = 1 / 0;
  for (const i of e) for (const s of n) {
    switch (i.type) {
      case "Point":
        o = Math.min(o, ft([i.coordinates], false, s, a, o));
        break;
      case "LineString":
        o = Math.min(o, ft(i.coordinates, true, s, a, o));
        break;
      case "Polygon":
        o = Math.min(o, fs(s, i.coordinates, a, o));
        break;
    }
    if (o === 0) return o;
  }
  return o;
}
function Ut(r) {
  return r.type === "MultiPolygon" ? r.coordinates.map((e) => ({
    type: "Polygon",
    coordinates: e
  })) : r.type === "MultiLineString" ? r.coordinates.map((e) => ({
    type: "LineString",
    coordinates: e
  })) : r.type === "MultiPoint" ? r.coordinates.map((e) => ({
    type: "Point",
    coordinates: e
  })) : [r];
}
var Ae = class _Ae {
  constructor(e, t) {
    this.type = g, this.geojson = e, this.geometries = t;
  }
  static parse(e, t) {
    if (e.length !== 2) return t.error(`'distance' expression requires exactly one argument, but found ${e.length - 1} instead.`);
    if (He(e[1])) {
      const n = e[1];
      if (n.type === "FeatureCollection") return new _Ae(n, n.features.map((a) => Ut(a.geometry)).flat());
      if (n.type === "Feature") return new _Ae(n, Ut(n.geometry));
      if ("type" in n && "coordinates" in n) return new _Ae(n, Ut(n));
    }
    return t.error("'distance' expression requires valid geojson object that contains polygon geometry type.");
  }
  evaluate(e) {
    if (e.geometry() != null && e.canonicalID() != null) {
      if (e.geometryType() === "Point") return ds(e, this.geometries);
      if (e.geometryType() === "LineString") return ys(e, this.geometries);
      if (e.geometryType() === "Polygon") return ms(e, this.geometries);
    }
    return NaN;
  }
  eachChild() {
  }
  outputDefined() {
    return true;
  }
};
var Sr = {
  // special forms
  "==": Oi,
  "!=": Di,
  ">": Bi,
  "<": qi,
  ">=": Vi,
  "<=": Ui,
  array: te,
  at: lr,
  boolean: te,
  case: pr,
  coalesce: Ke,
  collator: Tt,
  format: dr,
  image: yr,
  in: ur,
  "index-of": ut,
  interpolate: se,
  "interpolate-hcl": se,
  "interpolate-lab": se,
  length: mr,
  let: Lt,
  literal: je,
  match: cr,
  number: te,
  "number-format": fr,
  object: te,
  slice: ct,
  step: At,
  string: te,
  "to-boolean": ge,
  "to-color": ge,
  "to-number": ge,
  "to-string": ge,
  var: Ct,
  within: Ce,
  distance: Ae
};
var re = class _re {
  constructor(e, t, n, a) {
    this.name = e, this.type = t, this._evaluate = n, this.args = a;
  }
  evaluate(e) {
    return this._evaluate(e, this.args);
  }
  eachChild(e) {
    this.args.forEach(e);
  }
  outputDefined() {
    return false;
  }
  static parse(e, t) {
    const n = e[0], a = _re.definitions[n];
    if (!a) return t.error(`Unknown expression "${n}". If you wanted a literal array, use ["literal", [...]].`, 0);
    const o = Array.isArray(a) ? a[0] : a.type, i = Array.isArray(a) ? [[a[1], a[2]]] : a.overloads, s = i.filter(([u]) => !Array.isArray(u) || // varags
    u.length === e.length - 1);
    let l = null;
    for (const [u, c] of s) {
      l = new kt(t.registry, yt, t.path, null, t.scope);
      const p = [];
      let m = false;
      for (let f = 1; f < e.length; f++) {
        const d = e[f], y = Array.isArray(u) ? u[f - 1] : u.type, v = l.parse(d, 1 + p.length, y);
        if (!v) {
          m = true;
          break;
        }
        p.push(v);
      }
      if (!m) {
        if (Array.isArray(u) && u.length !== p.length) {
          l.error(`Expected ${u.length} arguments, but found ${p.length} instead.`);
          continue;
        }
        for (let f = 0; f < p.length; f++) {
          const d = Array.isArray(u) ? u[f] : u.type, y = p[f];
          l.concat(f + 1).checkSubtype(d, y.type);
        }
        if (l.errors.length === 0) return new _re(n, o, c, p);
      }
    }
    if (s.length === 1) t.errors.push(...l.errors);
    else {
      const c = (s.length ? s : i).map(([m]) => gs(m)).join(" | "), p = [];
      for (let m = 1; m < e.length; m++) {
        const f = t.parse(e[m], 1 + p.length);
        if (!f) return null;
        p.push(N(f.type));
      }
      t.error(`Expected arguments of type ${c}, but found (${p.join(", ")}) instead.`);
    }
    return null;
  }
  static register(e, t) {
    _re.definitions = t;
    for (const n in t) e[n] = _re;
  }
};
function en(r, [e, t, n, a]) {
  e = e.evaluate(r), t = t.evaluate(r), n = n.evaluate(r);
  const o = a ? a.evaluate(r) : 1, i = zn(e, t, n, o);
  if (i) throw new D(i);
  return new $(e / 255, t / 255, n / 255, o, false);
}
function tn(r, e) {
  return r in e;
}
function Vt(r, e) {
  const t = e[r];
  return typeof t > "u" ? null : t;
}
function hs(r, e, t, n) {
  for (; t <= n; ) {
    const a = t + n >> 1;
    if (e[a] === r) return true;
    e[a] > r ? n = a - 1 : t = a + 1;
  }
  return false;
}
function xe(r) {
  return {
    type: r
  };
}
re.register(Sr, {
  error: [fi, [I], (r, [e]) => {
    throw new D(e.evaluate(r));
  }],
  typeof: [I, [A], (r, [e]) => N(q(e.evaluate(r)))],
  "to-rgba": [W(g, 4), [ie], (r, [e]) => {
    const [t, n, a, o] = e.evaluate(r).rgb;
    return [t * 255, n * 255, a * 255, o];
  }],
  rgb: [ie, [g, g, g], en],
  rgba: [ie, [g, g, g, g], en],
  has: {
    type: C,
    overloads: [[[I], (r, [e]) => tn(e.evaluate(r), r.properties())], [[I, Re], (r, [e, t]) => tn(e.evaluate(r), t.evaluate(r))]]
  },
  get: {
    type: A,
    overloads: [[[I], (r, [e]) => Vt(e.evaluate(r), r.properties())], [[I, Re], (r, [e, t]) => Vt(e.evaluate(r), t.evaluate(r))]]
  },
  "feature-state": [A, [I], (r, [e]) => Vt(e.evaluate(r), r.featureState || {})],
  properties: [Re, [], (r) => r.properties()],
  "geometry-type": [I, [], (r) => r.geometryType()],
  id: [A, [], (r) => r.id()],
  zoom: [g, [], (r) => r.globals.zoom],
  "heatmap-density": [g, [], (r) => r.globals.heatmapDensity || 0],
  "line-progress": [g, [], (r) => r.globals.lineProgress || 0],
  accumulated: [A, [], (r) => r.globals.accumulated === void 0 ? null : r.globals.accumulated],
  "+": [g, xe(g), (r, e) => {
    let t = 0;
    for (const n of e) t += n.evaluate(r);
    return t;
  }],
  "*": [g, xe(g), (r, e) => {
    let t = 1;
    for (const n of e) t *= n.evaluate(r);
    return t;
  }],
  "-": {
    type: g,
    overloads: [[[g, g], (r, [e, t]) => e.evaluate(r) - t.evaluate(r)], [[g], (r, [e]) => -e.evaluate(r)]]
  },
  "/": [g, [g, g], (r, [e, t]) => e.evaluate(r) / t.evaluate(r)],
  "%": [g, [g, g], (r, [e, t]) => e.evaluate(r) % t.evaluate(r)],
  ln2: [g, [], () => Math.LN2],
  pi: [g, [], () => Math.PI],
  e: [g, [], () => Math.E],
  "^": [g, [g, g], (r, [e, t]) => Math.pow(e.evaluate(r), t.evaluate(r))],
  sqrt: [g, [g], (r, [e]) => Math.sqrt(e.evaluate(r))],
  log10: [g, [g], (r, [e]) => Math.log(e.evaluate(r)) / Math.LN10],
  ln: [g, [g], (r, [e]) => Math.log(e.evaluate(r))],
  log2: [g, [g], (r, [e]) => Math.log(e.evaluate(r)) / Math.LN2],
  sin: [g, [g], (r, [e]) => Math.sin(e.evaluate(r))],
  cos: [g, [g], (r, [e]) => Math.cos(e.evaluate(r))],
  tan: [g, [g], (r, [e]) => Math.tan(e.evaluate(r))],
  asin: [g, [g], (r, [e]) => Math.asin(e.evaluate(r))],
  acos: [g, [g], (r, [e]) => Math.acos(e.evaluate(r))],
  atan: [g, [g], (r, [e]) => Math.atan(e.evaluate(r))],
  min: [g, xe(g), (r, e) => Math.min(...e.map((t) => t.evaluate(r)))],
  max: [g, xe(g), (r, e) => Math.max(...e.map((t) => t.evaluate(r)))],
  abs: [g, [g], (r, [e]) => Math.abs(e.evaluate(r))],
  round: [g, [g], (r, [e]) => {
    const t = e.evaluate(r);
    return t < 0 ? -Math.round(-t) : Math.round(t);
  }],
  floor: [g, [g], (r, [e]) => Math.floor(e.evaluate(r))],
  ceil: [g, [g], (r, [e]) => Math.ceil(e.evaluate(r))],
  "filter-==": [C, [I, A], (r, [e, t]) => r.properties()[e.value] === t.value],
  "filter-id-==": [C, [A], (r, [e]) => r.id() === e.value],
  "filter-type-==": [C, [I], (r, [e]) => r.geometryType() === e.value],
  "filter-<": [C, [I, A], (r, [e, t]) => {
    const n = r.properties()[e.value], a = t.value;
    return typeof n == typeof a && n < a;
  }],
  "filter-id-<": [C, [A], (r, [e]) => {
    const t = r.id(), n = e.value;
    return typeof t == typeof n && t < n;
  }],
  "filter->": [C, [I, A], (r, [e, t]) => {
    const n = r.properties()[e.value], a = t.value;
    return typeof n == typeof a && n > a;
  }],
  "filter-id->": [C, [A], (r, [e]) => {
    const t = r.id(), n = e.value;
    return typeof t == typeof n && t > n;
  }],
  "filter-<=": [C, [I, A], (r, [e, t]) => {
    const n = r.properties()[e.value], a = t.value;
    return typeof n == typeof a && n <= a;
  }],
  "filter-id-<=": [C, [A], (r, [e]) => {
    const t = r.id(), n = e.value;
    return typeof t == typeof n && t <= n;
  }],
  "filter->=": [C, [I, A], (r, [e, t]) => {
    const n = r.properties()[e.value], a = t.value;
    return typeof n == typeof a && n >= a;
  }],
  "filter-id->=": [C, [A], (r, [e]) => {
    const t = r.id(), n = e.value;
    return typeof t == typeof n && t >= n;
  }],
  "filter-has": [C, [A], (r, [e]) => e.value in r.properties()],
  "filter-has-id": [C, [], (r) => r.id() !== null && r.id() !== void 0],
  "filter-type-in": [C, [W(I)], (r, [e]) => e.value.indexOf(r.geometryType()) >= 0],
  "filter-id-in": [C, [W(A)], (r, [e]) => e.value.indexOf(r.id()) >= 0],
  "filter-in-small": [
    C,
    [I, W(A)],
    // assumes v is an array literal
    (r, [e, t]) => t.value.indexOf(r.properties()[e.value]) >= 0
  ],
  "filter-in-large": [
    C,
    [I, W(A)],
    // assumes v is a array literal with values sorted in ascending order and of a single type
    (r, [e, t]) => hs(r.properties()[e.value], t.value, 0, t.value.length - 1)
  ],
  all: {
    type: C,
    overloads: [[[C, C], (r, [e, t]) => e.evaluate(r) && t.evaluate(r)], [xe(C), (r, e) => {
      for (const t of e) if (!t.evaluate(r)) return false;
      return true;
    }]]
  },
  any: {
    type: C,
    overloads: [[[C, C], (r, [e, t]) => e.evaluate(r) || t.evaluate(r)], [xe(C), (r, e) => {
      for (const t of e) if (t.evaluate(r)) return true;
      return false;
    }]]
  },
  "!": [C, [C], (r, [e]) => !e.evaluate(r)],
  "is-supported-script": [
    C,
    [I],
    // At parse time this will always return true, so we need to exclude this expression with isGlobalPropertyConstant
    (r, [e]) => {
      const t = r.globals && r.globals.isSupportedScript;
      return t ? t(e.evaluate(r)) : true;
    }
  ],
  upcase: [I, [I], (r, [e]) => e.evaluate(r).toUpperCase()],
  downcase: [I, [I], (r, [e]) => e.evaluate(r).toLowerCase()],
  concat: [I, xe(A), (r, e) => e.map((t) => Be(t.evaluate(r))).join("")],
  "resolved-locale": [I, [bt], (r, [e]) => e.evaluate(r).resolvedLocale()]
});
function gs(r) {
  return Array.isArray(r) ? `(${r.map(N).join(", ")})` : `(${N(r.type)}...)`;
}
function yt(r) {
  if (r instanceof Ct) return yt(r.boundExpression);
  if (r instanceof re && r.name === "error") return false;
  if (r instanceof Tt) return false;
  if (r instanceof Ce) return false;
  if (r instanceof Ae) return false;
  const e = r instanceof ge || r instanceof te;
  let t = true;
  return r.eachChild((n) => {
    e ? t = t && yt(n) : t = t && n instanceof je;
  }), t ? Et(r) && Mt(r, ["zoom", "heatmap-density", "line-progress", "accumulated", "is-supported-script"]) : false;
}
function Et(r) {
  if (r instanceof re) {
    if (r.name === "get" && r.args.length === 1) return false;
    if (r.name === "feature-state") return false;
    if (r.name === "has" && r.args.length === 1) return false;
    if (r.name === "properties" || r.name === "geometry-type" || r.name === "id") return false;
    if (/^filter-/.test(r.name)) return false;
  }
  if (r instanceof Ce || r instanceof Ae) return false;
  let e = true;
  return r.eachChild((t) => {
    e && !Et(t) && (e = false);
  }), e;
}
function Ze(r) {
  if (r instanceof re && r.name === "feature-state") return false;
  let e = true;
  return r.eachChild((t) => {
    e && !Ze(t) && (e = false);
  }), e;
}
function Mt(r, e) {
  if (r instanceof re && e.indexOf(r.name) >= 0) return false;
  let t = true;
  return r.eachChild((n) => {
    t && !Mt(n, e) && (t = false);
  }), t;
}
function tr(r) {
  return {
    result: "success",
    value: r
  };
}
function Pe(r) {
  return {
    result: "error",
    value: r
  };
}
function mt(r) {
  return r["property-type"] === "data-driven" || r["property-type"] === "cross-faded-data-driven";
}
function qn(r) {
  return !!r.expression && r.expression.parameters.indexOf("zoom") > -1;
}
function Bn(r) {
  return !!r.expression && r.expression.interpolated;
}
function z(r) {
  return r instanceof Number ? "number" : r instanceof String ? "string" : r instanceof Boolean ? "boolean" : Array.isArray(r) ? "array" : r === null ? "null" : typeof r;
}
function xr(r) {
  return typeof r == "object" && r !== null && !Array.isArray(r);
}
var vs = class {
  constructor(e, t) {
    this.expression = e, this._warningHistory = {}, this._evaluator = new _n(), this._defaultValue = t ? Ss(t) : null, this._enumValues = t && t.type === "enum" ? t.values : null;
  }
  evaluateWithoutErrorHandling(e, t, n, a, o, i) {
    return this._evaluator.globals = e, this._evaluator.feature = t, this._evaluator.featureState = n, this._evaluator.canonical = a, this._evaluator.availableImages = o || null, this._evaluator.formattedSection = i, this.expression.evaluate(this._evaluator);
  }
  evaluate(e, t, n, a, o, i) {
    this._evaluator.globals = e, this._evaluator.feature = t || null, this._evaluator.featureState = n || null, this._evaluator.canonical = a, this._evaluator.availableImages = o || null, this._evaluator.formattedSection = i || null;
    try {
      const s = this.expression.evaluate(this._evaluator);
      if (s == null || typeof s == "number" && s !== s) return this._defaultValue;
      if (this._enumValues && !(s in this._enumValues)) throw new D(`Expected value to be one of ${Object.keys(this._enumValues).map((l) => JSON.stringify(l)).join(", ")}, but found ${JSON.stringify(s)} instead.`);
      return s;
    } catch (s) {
      return this._warningHistory[s.message] || (this._warningHistory[s.message] = true, typeof console < "u" && console.warn(s.message)), this._defaultValue;
    }
  }
};
function Un(r) {
  return Array.isArray(r) && r.length > 0 && typeof r[0] == "string" && r[0] in Sr;
}
function Vn(r, e) {
  const t = new kt(Sr, yt, [], e ? ws(e) : void 0), n = t.parse(r, void 0, void 0, void 0, e && e.type === "string" ? {
    typeAnnotation: "coerce"
  } : void 0);
  return n ? tr(new vs(n, e)) : Pe(t.errors);
}
var rn = class {
  constructor(e, t) {
    this.kind = e, this._styleExpression = t, this.isStateDependent = e !== "constant" && !Ze(t.expression);
  }
  evaluateWithoutErrorHandling(e, t, n, a, o, i) {
    return this._styleExpression.evaluateWithoutErrorHandling(e, t, n, a, o, i);
  }
  evaluate(e, t, n, a, o, i) {
    return this._styleExpression.evaluate(e, t, n, a, o, i);
  }
};
var nn = class {
  constructor(e, t, n, a) {
    this.kind = e, this.zoomStops = n, this._styleExpression = t, this.isStateDependent = e !== "camera" && !Ze(t.expression), this.interpolationType = a;
  }
  evaluateWithoutErrorHandling(e, t, n, a, o, i) {
    return this._styleExpression.evaluateWithoutErrorHandling(e, t, n, a, o, i);
  }
  evaluate(e, t, n, a, o, i) {
    return this._styleExpression.evaluate(e, t, n, a, o, i);
  }
  interpolationFactor(e, t, n) {
    return this.interpolationType ? se.interpolationFactor(this.interpolationType, e, t, n) : 0;
  }
};
function bs(r, e) {
  const t = Vn(r, e);
  if (t.result === "error") return t;
  const n = t.value.expression, a = Et(n);
  if (!a && !mt(e)) return Pe([new oe("", "data expressions not supported")]);
  const o = Mt(n, ["zoom"]);
  if (!o && !qn(e)) return Pe([new oe("", "zoom expressions not supported")]);
  const i = it(n);
  if (!i && !o) return Pe([new oe("", '"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.')]);
  if (i instanceof oe) return Pe([i]);
  if (i instanceof se && !Bn(e)) return Pe([new oe("", '"interpolate" expressions cannot be used with this property')]);
  if (!i) return tr(a ? new rn("constant", t.value) : new rn("source", t.value));
  const s = i instanceof se ? i.interpolation : void 0;
  return tr(a ? new nn("camera", t.value, i.labels, s) : new nn("composite", t.value, i.labels, s));
}
function it(r) {
  let e = null;
  if (r instanceof Lt) e = it(r.result);
  else if (r instanceof Ke) {
    for (const t of r.args) if (e = it(t), e) break;
  } else (r instanceof At || r instanceof se) && r.input instanceof re && r.input.name === "zoom" && (e = r);
  return e instanceof oe || r.eachChild((t) => {
    const n = it(t);
    n instanceof oe ? e = n : !e && n ? e = new oe("", '"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.') : e && n && e !== n && (e = new oe("", 'Only one zoom-based "step" or "interpolate" subexpression may be used in an expression.'));
  }), e;
}
function ws(r) {
  const e = {
    color: ie,
    string: I,
    number: g,
    enum: I,
    boolean: C,
    formatted: wt,
    padding: St,
    projectionDefinition: vt,
    resolvedImage: Xe,
    variableAnchorOffsetCollection: xt
  };
  return r.type === "array" ? W(e[r.value] || A, r.length) : e[r.type];
}
function Ss(r) {
  return r.type === "color" && xr(r.default) ? new $(0, 0, 0, 0) : r.type === "color" ? $.parse(r.default) || null : r.type === "padding" ? J.parse(r.default) || null : r.type === "variableAnchorOffsetCollection" ? ne.parse(r.default) || null : r.type === "projectionDefinition" ? ee.parse(r.default) || null : r.default === void 0 ? null : r.default;
}
function Gn(r) {
  if (r === true || r === false) return true;
  if (!Array.isArray(r) || r.length === 0) return false;
  switch (r[0]) {
    case "has":
      return r.length >= 2 && r[1] !== "$id" && r[1] !== "$type";
    case "in":
      return r.length >= 3 && (typeof r[1] != "string" || Array.isArray(r[2]));
    case "!in":
    case "!has":
    case "none":
      return false;
    case "==":
    case "!=":
    case ">":
    case ">=":
    case "<":
    case "<=":
      return r.length !== 3 || Array.isArray(r[1]) || Array.isArray(r[2]);
    case "any":
    case "all":
      for (const e of r.slice(1)) if (!Gn(e) && typeof e != "boolean") return false;
      return true;
    default:
      return true;
  }
}
function Hn(r) {
  const e = r.key, t = r.value;
  return t ? [new h(e, t, "constants have been deprecated as of v8")] : [];
}
function O(r) {
  return r instanceof Number || r instanceof String || r instanceof Boolean ? r.valueOf() : r;
}
function Ee(r) {
  if (Array.isArray(r)) return r.map(Ee);
  if (r instanceof Object && !(r instanceof Number || r instanceof String || r instanceof Boolean)) {
    const e = {};
    for (const t in r) e[t] = Ee(r[t]);
    return e;
  }
  return O(r);
}
function Y(r) {
  const e = r.key, t = r.value, n = r.valueSpec || {}, a = r.objectElementValidators || {}, o = r.style, i = r.styleSpec, s = r.validateSpec;
  let l = [];
  const u = z(t);
  if (u !== "object") return [new h(e, t, `object expected, ${u} found`)];
  for (const c in t) {
    const p = c.split(".")[0], m = n[p] || n["*"];
    let f;
    if (a[p]) f = a[p];
    else if (n[p]) f = s;
    else if (a["*"]) f = a["*"];
    else if (n["*"]) f = s;
    else {
      l.push(new h(e, t[c], `unknown property "${c}"`));
      continue;
    }
    l = l.concat(f({
      key: (e && `${e}.`) + c,
      value: t[c],
      valueSpec: m,
      style: o,
      styleSpec: i,
      object: t,
      objectKey: c,
      validateSpec: s
    }, t));
  }
  for (const c in n) a[c] || n[c].required && n[c].default === void 0 && t[c] === void 0 && l.push(new h(e, t, `missing required property "${c}"`));
  return l;
}
function kr(r) {
  const e = r.value, t = r.valueSpec, n = r.validateSpec, a = r.style, o = r.styleSpec, i = r.key, s = r.arrayElementValidator || n;
  if (z(e) !== "array") return [new h(i, e, `array expected, ${z(e)} found`)];
  if (t.length && e.length !== t.length) return [new h(i, e, `array length ${t.length} expected, length ${e.length} found`)];
  if (t["min-length"] && e.length < t["min-length"]) return [new h(i, e, `array length at least ${t["min-length"]} expected, length ${e.length} found`)];
  let l = {
    type: t.value,
    values: t.values
  };
  o.$version < 7 && (l.function = t.function), z(t.value) === "object" && (l = t.value);
  let u = [];
  for (let c = 0; c < e.length; c++) u = u.concat(s({
    array: e,
    arrayIndex: c,
    value: e[c],
    valueSpec: l,
    validateSpec: r.validateSpec,
    style: a,
    styleSpec: o,
    key: `${i}[${c}]`
  }));
  return u;
}
function Lr(r) {
  const e = r.key, t = r.value, n = r.valueSpec;
  let a = z(t);
  return a === "number" && t !== t && (a = "NaN"), a !== "number" ? [new h(e, t, `number expected, ${a} found`)] : "minimum" in n && t < n.minimum ? [new h(e, t, `${t} is less than the minimum value ${n.minimum}`)] : "maximum" in n && t > n.maximum ? [new h(e, t, `${t} is greater than the maximum value ${n.maximum}`)] : [];
}
function Kn(r) {
  const e = r.valueSpec, t = O(r.value.type);
  let n, a = {}, o, i;
  const s = t !== "categorical" && r.value.property === void 0, l = !s, u = z(r.value.stops) === "array" && z(r.value.stops[0]) === "array" && z(r.value.stops[0][0]) === "object", c = Y({
    key: r.key,
    value: r.value,
    valueSpec: r.styleSpec.function,
    validateSpec: r.validateSpec,
    style: r.style,
    styleSpec: r.styleSpec,
    objectElementValidators: {
      stops: p,
      default: d
    }
  });
  return t === "identity" && s && c.push(new h(r.key, r.value, 'missing required property "property"')), t !== "identity" && !r.value.stops && c.push(new h(r.key, r.value, 'missing required property "stops"')), t === "exponential" && r.valueSpec.expression && !Bn(r.valueSpec) && c.push(new h(r.key, r.value, "exponential functions not supported")), r.styleSpec.$version >= 8 && (l && !mt(r.valueSpec) ? c.push(new h(r.key, r.value, "property functions not supported")) : s && !qn(r.valueSpec) && c.push(new h(r.key, r.value, "zoom functions not supported"))), (t === "categorical" || u) && r.value.property === void 0 && c.push(new h(r.key, r.value, '"property" property is required')), c;
  function p(y) {
    if (t === "identity") return [new h(y.key, y.value, 'identity function may not have a "stops" property')];
    let v = [];
    const w = y.value;
    return v = v.concat(kr({
      key: y.key,
      value: w,
      valueSpec: y.valueSpec,
      validateSpec: y.validateSpec,
      style: y.style,
      styleSpec: y.styleSpec,
      arrayElementValidator: m
    })), z(w) === "array" && w.length === 0 && v.push(new h(y.key, w, "array must have at least one stop")), v;
  }
  function m(y) {
    let v = [];
    const w = y.value, b = y.key;
    if (z(w) !== "array") return [new h(b, w, `array expected, ${z(w)} found`)];
    if (w.length !== 2) return [new h(b, w, `array length 2 expected, length ${w.length} found`)];
    if (u) {
      if (z(w[0]) !== "object") return [new h(b, w, `object expected, ${z(w[0])} found`)];
      if (w[0].zoom === void 0) return [new h(b, w, "object stop key must have zoom")];
      if (w[0].value === void 0) return [new h(b, w, "object stop key must have value")];
      if (i && i > O(w[0].zoom)) return [new h(b, w[0].zoom, "stop zoom values must appear in ascending order")];
      O(w[0].zoom) !== i && (i = O(w[0].zoom), o = void 0, a = {}), v = v.concat(Y({
        key: `${b}[0]`,
        value: w[0],
        valueSpec: {
          zoom: {}
        },
        validateSpec: y.validateSpec,
        style: y.style,
        styleSpec: y.styleSpec,
        objectElementValidators: {
          zoom: Lr,
          value: f
        }
      }));
    } else v = v.concat(f({
      key: `${b}[0]`,
      value: w[0],
      valueSpec: {},
      validateSpec: y.validateSpec,
      style: y.style,
      styleSpec: y.styleSpec
    }, w));
    return Un(Ee(w[1])) ? v.concat([new h(`${b}[1]`, w[1], "expressions are not allowed in function stops.")]) : v.concat(y.validateSpec({
      key: `${b}[1]`,
      value: w[1],
      valueSpec: e,
      validateSpec: y.validateSpec,
      style: y.style,
      styleSpec: y.styleSpec
    }));
  }
  function f(y, v) {
    const w = z(y.value), b = O(y.value), T = y.value !== null ? y.value : v;
    if (!n) n = w;
    else if (w !== n) return [new h(y.key, T, `${w} stop domain type must match previous stop domain type ${n}`)];
    if (w !== "number" && w !== "string" && w !== "boolean") return [new h(y.key, T, "stop domain value must be a number, string, or boolean")];
    if (w !== "number" && t !== "categorical") {
      let j = `number expected, ${w} found`;
      return mt(e) && t === void 0 && (j += '\nIf you intended to use a categorical function, specify `"type": "categorical"`.'), [new h(y.key, T, j)];
    }
    return t === "categorical" && w === "number" && (!isFinite(b) || Math.floor(b) !== b) ? [new h(y.key, T, `integer expected, found ${b}`)] : t !== "categorical" && w === "number" && o !== void 0 && b < o ? [new h(y.key, T, "stop domain values must appear in ascending order")] : (o = b, t === "categorical" && b in a ? [new h(y.key, T, "stop domain values must be unique")] : (a[b] = true, []));
  }
  function d(y) {
    return y.validateSpec({
      key: y.key,
      value: y.value,
      valueSpec: e,
      validateSpec: y.validateSpec,
      style: y.style,
      styleSpec: y.styleSpec
    });
  }
}
function Ne(r) {
  const e = (r.expressionContext === "property" ? bs : Vn)(Ee(r.value), r.valueSpec);
  if (e.result === "error") return e.value.map((n) => new h(`${r.key}${n.key}`, r.value, n.message));
  const t = e.value.expression || e.value._styleExpression.expression;
  if (r.expressionContext === "property" && r.propertyKey === "text-font" && !t.outputDefined()) return [new h(r.key, r.value, `Invalid data expression for "${r.propertyKey}". Output values must be contained as literals within the expression.`)];
  if (r.expressionContext === "property" && r.propertyType === "layout" && !Ze(t)) return [new h(r.key, r.value, '"feature-state" data expressions are not supported with layout properties.')];
  if (r.expressionContext === "filter" && !Ze(t)) return [new h(r.key, r.value, '"feature-state" data expressions are not supported with filters.')];
  if (r.expressionContext && r.expressionContext.indexOf("cluster") === 0) {
    if (!Mt(t, ["zoom", "feature-state"])) return [new h(r.key, r.value, '"zoom" and "feature-state" expressions are not supported with cluster properties.')];
    if (r.expressionContext === "cluster-initial" && !Et(t)) return [new h(r.key, r.value, "Feature data expressions are not supported with initial expression part of cluster properties.")];
  }
  return [];
}
function xs(r) {
  const e = r.value, t = r.key, n = z(e);
  return n !== "boolean" ? [new h(t, e, `boolean expected, ${n} found`)] : [];
}
function ks(r) {
  const e = r.key, t = r.value, n = z(t);
  return n !== "string" ? [new h(e, t, `color expected, ${n} found`)] : $.parse(String(t)) ? [] : [new h(e, t, `color expected, "${t}" found`)];
}
function Je(r) {
  const e = r.key, t = r.value, n = r.valueSpec, a = [];
  return Array.isArray(n.values) ? n.values.indexOf(O(t)) === -1 && a.push(new h(e, t, `expected one of [${n.values.join(", ")}], ${JSON.stringify(t)} found`)) : Object.keys(n.values).indexOf(O(t)) === -1 && a.push(new h(e, t, `expected one of [${Object.keys(n.values).join(", ")}], ${JSON.stringify(t)} found`)), a;
}
function Cr(r) {
  return Gn(Ee(r.value)) ? Ne(lt({}, r, {
    expressionContext: "filter",
    valueSpec: {
      value: "boolean"
    }
  })) : Wn(r);
}
function Wn(r) {
  const e = r.value, t = r.key;
  if (z(e) !== "array") return [new h(t, e, `array expected, ${z(e)} found`)];
  const n = r.styleSpec;
  let a, o = [];
  if (e.length < 1) return [new h(t, e, "filter array must have at least 1 element")];
  switch (o = o.concat(Je({
    key: `${t}[0]`,
    value: e[0],
    valueSpec: n.filter_operator,
    style: r.style,
    styleSpec: r.styleSpec
  })), O(e[0])) {
    case "<":
    case "<=":
    case ">":
    case ">=":
      e.length >= 2 && O(e[1]) === "$type" && o.push(new h(t, e, `"$type" cannot be use with operator "${e[0]}"`));
    /* falls through */
    case "==":
    case "!=":
      e.length !== 3 && o.push(new h(t, e, `filter array for operator "${e[0]}" must have 3 elements`));
    /* falls through */
    case "in":
    case "!in":
      e.length >= 2 && (a = z(e[1]), a !== "string" && o.push(new h(`${t}[1]`, e[1], `string expected, ${a} found`)));
      for (let i = 2; i < e.length; i++) a = z(e[i]), O(e[1]) === "$type" ? o = o.concat(Je({
        key: `${t}[${i}]`,
        value: e[i],
        valueSpec: n.geometry_type,
        style: r.style,
        styleSpec: r.styleSpec
      })) : a !== "string" && a !== "number" && a !== "boolean" && o.push(new h(`${t}[${i}]`, e[i], `string, number, or boolean expected, ${a} found`));
      break;
    case "any":
    case "all":
    case "none":
      for (let i = 1; i < e.length; i++) o = o.concat(Wn({
        key: `${t}[${i}]`,
        value: e[i],
        style: r.style,
        styleSpec: r.styleSpec
      }));
      break;
    case "has":
    case "!has":
      a = z(e[1]), e.length !== 2 ? o.push(new h(t, e, `filter array for "${e[0]}" operator must have 2 elements`)) : a !== "string" && o.push(new h(`${t}[1]`, e[1], `string expected, ${a} found`));
      break;
  }
  return o;
}
function Zn(r, e) {
  const t = r.key, n = r.validateSpec, a = r.style, o = r.styleSpec, i = r.value, s = r.objectKey, l = o[`${e}_${r.layerType}`];
  if (!l) return [];
  const u = s.match(/^(.*)-transition$/);
  if (e === "paint" && u && l[u[1]] && l[u[1]].transition) return n({
    key: t,
    value: i,
    valueSpec: o.transition,
    style: a,
    styleSpec: o
  });
  const c = r.valueSpec || l[s];
  if (!c) return [new h(t, i, `unknown property "${s}"`)];
  let p;
  if (z(i) === "string" && mt(c) && !c.tokens && (p = /^{([^}]+)}$/.exec(i))) return [new h(t, i, `"${s}" does not support interpolation syntax
Use an identity property function instead: \`{ "type": "identity", "property": ${JSON.stringify(p[1])} }\`.`)];
  const m = [];
  return r.layerType === "symbol" && (s === "text-field" && a && !a.glyphs && m.push(new h(t, i, 'use of "text-field" requires a style "glyphs" property')), s === "text-font" && xr(Ee(i)) && O(i.type) === "identity" && m.push(new h(t, i, '"text-font" does not support identity functions'))), m.concat(n({
    key: r.key,
    value: i,
    valueSpec: c,
    style: a,
    styleSpec: o,
    expressionContext: "property",
    propertyType: e,
    propertyKey: s
  }));
}
function Jn(r) {
  return Zn(r, "paint");
}
function Yn(r) {
  return Zn(r, "layout");
}
function Xn(r) {
  let e = [];
  const t = r.value, n = r.key, a = r.style, o = r.styleSpec;
  !t.type && !t.ref && e.push(new h(n, t, 'either "type" or "ref" is required'));
  let i = O(t.type);
  const s = O(t.ref);
  if (t.id) {
    const l = O(t.id);
    for (let u = 0; u < r.arrayIndex; u++) {
      const c = a.layers[u];
      O(c.id) === l && e.push(new h(n, t.id, `duplicate layer id "${t.id}", previously used at line ${c.id.__line__}`));
    }
  }
  if ("ref" in t) {
    ["type", "source", "source-layer", "filter", "layout"].forEach((u) => {
      u in t && e.push(new h(n, t[u], `"${u}" is prohibited for ref layers`));
    });
    let l;
    a.layers.forEach((u) => {
      O(u.id) === s && (l = u);
    }), l ? l.ref ? e.push(new h(n, t.ref, "ref cannot reference another ref layer")) : i = O(l.type) : e.push(new h(n, t.ref, `ref layer "${s}" not found`));
  } else if (i !== "background") if (!t.source) e.push(new h(n, t, 'missing required property "source"'));
  else {
    const l = a.sources && a.sources[t.source], u = l && O(l.type);
    l ? u === "vector" && i === "raster" ? e.push(new h(n, t.source, `layer "${t.id}" requires a raster source`)) : u !== "raster-dem" && i === "hillshade" ? e.push(new h(n, t.source, `layer "${t.id}" requires a raster-dem source`)) : u === "raster" && i !== "raster" ? e.push(new h(n, t.source, `layer "${t.id}" requires a vector source`)) : u === "vector" && !t["source-layer"] ? e.push(new h(n, t, `layer "${t.id}" must specify a "source-layer"`)) : u === "raster-dem" && i !== "hillshade" ? e.push(new h(n, t.source, "raster-dem source can only be used with layer type 'hillshade'.")) : i === "line" && t.paint && t.paint["line-gradient"] && (u !== "geojson" || !l.lineMetrics) && e.push(new h(n, t, `layer "${t.id}" specifies a line-gradient, which requires a GeoJSON source with \`lineMetrics\` enabled.`)) : e.push(new h(n, t.source, `source "${t.source}" not found`));
  }
  return e = e.concat(Y({
    key: n,
    value: t,
    valueSpec: o.layer,
    style: r.style,
    styleSpec: r.styleSpec,
    validateSpec: r.validateSpec,
    objectElementValidators: {
      "*"() {
        return [];
      },
      // We don't want to enforce the spec's `"requires": true` for backward compatibility with refs;
      // the actual requirement is validated above. See https://github.com/mapbox/mapbox-gl-js/issues/5772.
      type() {
        return r.validateSpec({
          key: `${n}.type`,
          value: t.type,
          valueSpec: o.layer.type,
          style: r.style,
          styleSpec: r.styleSpec,
          validateSpec: r.validateSpec,
          object: t,
          objectKey: "type"
        });
      },
      filter: Cr,
      layout(l) {
        return Y({
          layer: t,
          key: l.key,
          value: l.value,
          style: l.style,
          styleSpec: l.styleSpec,
          validateSpec: l.validateSpec,
          objectElementValidators: {
            "*"(u) {
              return Yn(lt({
                layerType: i
              }, u));
            }
          }
        });
      },
      paint(l) {
        return Y({
          layer: t,
          key: l.key,
          value: l.value,
          style: l.style,
          styleSpec: l.styleSpec,
          validateSpec: l.validateSpec,
          objectElementValidators: {
            "*"(u) {
              return Jn(lt({
                layerType: i
              }, u));
            }
          }
        });
      }
    }
  })), e;
}
function Me(r) {
  const e = r.value, t = r.key, n = z(e);
  return n !== "string" ? [new h(t, e, `string expected, ${n} found`)] : [];
}
function Ls(r) {
  var e;
  const t = (e = r.sourceName) !== null && e !== void 0 ? e : "", n = r.value, a = r.styleSpec, o = a.source_raster_dem, i = r.style;
  let s = [];
  const l = z(n);
  if (n === void 0) return s;
  if (l !== "object") return s.push(new h("source_raster_dem", n, `object expected, ${l} found`)), s;
  const c = O(n.encoding) === "custom", p = ["redFactor", "greenFactor", "blueFactor", "baseShift"], m = r.value.encoding ? `"${r.value.encoding}"` : "Default";
  for (const f in n) !c && p.includes(f) ? s.push(new h(f, n[f], `In "${t}": "${f}" is only valid when "encoding" is set to "custom". ${m} encoding found`)) : o[f] ? s = s.concat(r.validateSpec({
    key: f,
    value: n[f],
    valueSpec: o[f],
    validateSpec: r.validateSpec,
    style: i,
    styleSpec: a
  })) : s.push(new h(f, n[f], `unknown property "${f}"`));
  return s;
}
var an = {
  promoteId: Cs
};
function Qn(r) {
  const e = r.value, t = r.key, n = r.styleSpec, a = r.style, o = r.validateSpec;
  if (!e.type) return [new h(t, e, '"type" is required')];
  const i = O(e.type);
  let s;
  switch (i) {
    case "vector":
    case "raster":
      return s = Y({
        key: t,
        value: e,
        valueSpec: n[`source_${i.replace("-", "_")}`],
        style: r.style,
        styleSpec: n,
        objectElementValidators: an,
        validateSpec: o
      }), s;
    case "raster-dem":
      return s = Ls({
        sourceName: t,
        value: e,
        style: r.style,
        styleSpec: n,
        validateSpec: o
      }), s;
    case "geojson":
      if (s = Y({
        key: t,
        value: e,
        valueSpec: n.source_geojson,
        style: a,
        styleSpec: n,
        validateSpec: o,
        objectElementValidators: an
      }), e.cluster) for (const l in e.clusterProperties) {
        const [u, c] = e.clusterProperties[l], p = typeof u == "string" ? [u, ["accumulated"], ["get", l]] : u;
        s.push(...Ne({
          key: `${t}.${l}.map`,
          value: c,
          validateSpec: o,
          expressionContext: "cluster-map"
        })), s.push(...Ne({
          key: `${t}.${l}.reduce`,
          value: p,
          validateSpec: o,
          expressionContext: "cluster-reduce"
        }));
      }
      return s;
    case "video":
      return Y({
        key: t,
        value: e,
        valueSpec: n.source_video,
        style: a,
        validateSpec: o,
        styleSpec: n
      });
    case "image":
      return Y({
        key: t,
        value: e,
        valueSpec: n.source_image,
        style: a,
        validateSpec: o,
        styleSpec: n
      });
    case "canvas":
      return [new h(t, null, "Please use runtime APIs to add canvas sources, rather than including them in stylesheets.", "source.canvas")];
    default:
      return Je({
        key: `${t}.type`,
        value: e.type,
        valueSpec: {
          values: ["vector", "raster", "raster-dem", "geojson", "video", "image"]
        },
        style: a,
        validateSpec: o,
        styleSpec: n
      });
  }
}
function Cs({
  key: r,
  value: e
}) {
  if (z(e) === "string") return Me({
    key: r,
    value: e
  });
  {
    const t = [];
    for (const n in e) t.push(...Me({
      key: `${r}.${n}`,
      value: e[n]
    }));
    return t;
  }
}
function ea(r) {
  const e = r.value, t = r.styleSpec, n = t.light, a = r.style;
  let o = [];
  const i = z(e);
  if (e === void 0) return o;
  if (i !== "object") return o = o.concat([new h("light", e, `object expected, ${i} found`)]), o;
  for (const s in e) {
    const l = s.match(/^(.*)-transition$/);
    l && n[l[1]] && n[l[1]].transition ? o = o.concat(r.validateSpec({
      key: s,
      value: e[s],
      valueSpec: t.transition,
      validateSpec: r.validateSpec,
      style: a,
      styleSpec: t
    })) : n[s] ? o = o.concat(r.validateSpec({
      key: s,
      value: e[s],
      valueSpec: n[s],
      validateSpec: r.validateSpec,
      style: a,
      styleSpec: t
    })) : o = o.concat([new h(s, e[s], `unknown property "${s}"`)]);
  }
  return o;
}
function ta(r) {
  const e = r.value, t = r.styleSpec, n = t.sky, a = r.style, o = z(e);
  if (e === void 0) return [];
  if (o !== "object") return [new h("sky", e, `object expected, ${o} found`)];
  let i = [];
  for (const s in e) n[s] ? i = i.concat(r.validateSpec({
    key: s,
    value: e[s],
    valueSpec: n[s],
    style: a,
    styleSpec: t
  })) : i = i.concat([new h(s, e[s], `unknown property "${s}"`)]);
  return i;
}
function ra(r) {
  const e = r.value, t = r.styleSpec, n = t.terrain, a = r.style;
  let o = [];
  const i = z(e);
  if (e === void 0) return o;
  if (i !== "object") return o = o.concat([new h("terrain", e, `object expected, ${i} found`)]), o;
  for (const s in e) n[s] ? o = o.concat(r.validateSpec({
    key: s,
    value: e[s],
    valueSpec: n[s],
    validateSpec: r.validateSpec,
    style: a,
    styleSpec: t
  })) : o = o.concat([new h(s, e[s], `unknown property "${s}"`)]);
  return o;
}
function As(r) {
  return Me(r).length === 0 ? [] : Ne(r);
}
function Ts(r) {
  return Me(r).length === 0 ? [] : Ne(r);
}
function Is(r) {
  const e = r.key, t = r.value;
  if (z(t) === "array") {
    if (t.length < 1 || t.length > 4) return [new h(e, t, `padding requires 1 to 4 values; ${t.length} values found`)];
    const a = {
      type: "number"
    };
    let o = [];
    for (let i = 0; i < t.length; i++) o = o.concat(r.validateSpec({
      key: `${e}[${i}]`,
      value: t[i],
      validateSpec: r.validateSpec,
      valueSpec: a
    }));
    return o;
  } else return Lr({
    key: e,
    value: t,
    valueSpec: {}
  });
}
function Es(r) {
  const e = r.key, t = r.value, n = z(t), a = r.styleSpec;
  if (n !== "array" || t.length < 1 || t.length % 2 !== 0) return [new h(e, t, "variableAnchorOffsetCollection requires a non-empty array of even length")];
  let o = [];
  for (let i = 0; i < t.length; i += 2) o = o.concat(Je({
    key: `${e}[${i}]`,
    value: t[i],
    valueSpec: a.layout_symbol["text-anchor"]
  })), o = o.concat(kr({
    key: `${e}[${i + 1}]`,
    value: t[i + 1],
    valueSpec: {
      length: 2,
      value: "number"
    },
    validateSpec: r.validateSpec,
    style: r.style,
    styleSpec: a
  }));
  return o;
}
function na(r) {
  let e = [];
  const t = r.value, n = r.key;
  if (Array.isArray(t)) {
    const a = [], o = [];
    for (const i in t) {
      t[i].id && a.includes(t[i].id) && e.push(new h(n, t, `all the sprites' ids must be unique, but ${t[i].id} is duplicated`)), a.push(t[i].id), t[i].url && o.includes(t[i].url) && e.push(new h(n, t, `all the sprites' URLs must be unique, but ${t[i].url} is duplicated`)), o.push(t[i].url);
      const s = {
        id: {
          type: "string",
          required: true
        },
        url: {
          type: "string",
          required: true
        }
      };
      e = e.concat(Y({
        key: `${n}[${i}]`,
        value: t[i],
        valueSpec: s,
        validateSpec: r.validateSpec
      }));
    }
    return e;
  } else return Me({
    key: n,
    value: t
  });
}
function Ms(r) {
  const e = r.value, t = r.styleSpec, n = t.projection, a = r.style, o = z(e);
  if (e === void 0) return [];
  if (o !== "object") return [new h("projection", e, `object expected, ${o} found`)];
  let i = [];
  for (const s in e) n[s] ? i = i.concat(r.validateSpec({
    key: s,
    value: e[s],
    valueSpec: n[s],
    style: a,
    styleSpec: t
  })) : i = i.concat([new h(s, e[s], `unknown property "${s}"`)]);
  return i;
}
function zs(r) {
  const e = r.key;
  let t = r.value;
  t = t instanceof String ? t.valueOf() : t;
  const n = z(t);
  return n === "array" && !Ps(t) && !_s(t) ? [new h(e, t, `projection expected, invalid array ${JSON.stringify(t)} found`)] : ["array", "string"].includes(n) ? [] : [new h(e, t, `projection expected, invalid type "${n}" found`)];
}
function _s(r) {
  return !!["interpolate", "step", "literal"].includes(r[0]);
}
function Ps(r) {
  return Array.isArray(r) && r.length === 3 && typeof r[0] == "string" && typeof r[1] == "string" && typeof r[2] == "number";
}
var on = {
  "*"() {
    return [];
  },
  array: kr,
  boolean: xs,
  number: Lr,
  color: ks,
  constants: Hn,
  enum: Je,
  filter: Cr,
  function: Kn,
  layer: Xn,
  object: Y,
  source: Qn,
  light: ea,
  sky: ta,
  terrain: ra,
  projection: Ms,
  projectionDefinition: zs,
  string: Me,
  formatted: As,
  resolvedImage: Ts,
  padding: Is,
  variableAnchorOffsetCollection: Es,
  sprite: na
};
function Ue(r) {
  const e = r.value, t = r.valueSpec, n = r.styleSpec;
  return r.validateSpec = Ue, t.expression && xr(O(e)) ? Kn(r) : t.expression && Un(Ee(e)) ? Ne(r) : t.type && on[t.type] ? on[t.type](r) : Y(lt({}, r, {
    valueSpec: t.type ? n[t.type] : t
  }));
}
function aa(r) {
  const e = r.value, t = r.key, n = Me(r);
  return n.length || (e.indexOf("{fontstack}") === -1 && n.push(new h(t, e, '"glyphs" url must include a "{fontstack}" token')), e.indexOf("{range}") === -1 && n.push(new h(t, e, '"glyphs" url must include a "{range}" token'))), n;
}
function X(r, e = pi) {
  let t = [];
  return t = t.concat(Ue({
    key: "",
    value: r,
    valueSpec: e.$root,
    styleSpec: e,
    style: r,
    validateSpec: Ue,
    objectElementValidators: {
      glyphs: aa,
      "*"() {
        return [];
      }
    }
  })), r.constants && (t = t.concat(Hn({
    key: "constants",
    value: r.constants,
    style: r,
    styleSpec: e,
    validateSpec: Ue
  }))), oa(t);
}
X.source = ce(ue(Qn));
X.sprite = ce(ue(na));
X.glyphs = ce(ue(aa));
X.light = ce(ue(ea));
X.sky = ce(ue(ta));
X.terrain = ce(ue(ra));
X.layer = ce(ue(Xn));
X.filter = ce(ue(Cr));
X.paintProperty = ce(ue(Jn));
X.layoutProperty = ce(ue(Yn));
function ue(r) {
  return function(e) {
    return r(__spreadProps(__spreadValues({}, e), {
      validateSpec: Ue
    }));
  };
}
function oa(r) {
  return [].concat(r).sort((e, t) => e.line - t.line);
}
function ce(r) {
  return function(...e) {
    return oa(r.apply(this, e));
  };
}
function sn(r) {
  if (!r) return {
    style: MapStyle[mapStylePresetList[0].referenceStyleID].getDefaultVariant().getExpandedStyleURL(),
    requiresUrlMonitoring: false,
    // default styles don't require URL monitoring
    isFallback: true
  };
  if (typeof r == "string") {
    const t = $s(r);
    return t.isValidStyle ? {
      style: t.styleObject,
      requiresUrlMonitoring: false,
      isFallback: false
    } : t.isValidJSON ? {
      style: MapStyle[mapStylePresetList[0].referenceStyleID].getDefaultVariant().getExpandedStyleURL(),
      requiresUrlMonitoring: false,
      // default styles don't require URL monitoring
      isFallback: true
    } : r.startsWith("http") ? {
      style: r,
      requiresUrlMonitoring: true,
      isFallback: false
    } : r.toLowerCase().includes(".json") ? {
      style: Rs(r),
      requiresUrlMonitoring: true,
      isFallback: false
    } : {
      style: expandMapStyle(r),
      requiresUrlMonitoring: true,
      isFallback: false
    };
  }
  return r instanceof MapStyleVariant ? {
    style: r.getExpandedStyleURL(),
    requiresUrlMonitoring: false,
    isFallback: false
  } : r instanceof ReferenceMapStyle ? {
    style: r.getDefaultVariant().getExpandedStyleURL(),
    requiresUrlMonitoring: false,
    isFallback: false
  } : X(r).length === 0 ? {
    style: r,
    requiresUrlMonitoring: false,
    isFallback: false
  } : {
    style: MapStyle[mapStylePresetList[0].referenceStyleID].getDefaultVariant().getExpandedStyleURL(),
    requiresUrlMonitoring: false,
    // default styles don't require URL monitoring
    isFallback: true
  };
}
function Rs(r) {
  try {
    return new URL(r).href;
  } catch {
  }
  return new URL(r, location.origin).href;
}
function $s(r) {
  try {
    const e = JSON.parse(r), t = X(e);
    return {
      isValidJSON: true,
      isValidStyle: t.length === 0,
      styleObject: t.length === 0 ? e : null
    };
  } catch {
    return {
      isValidJSON: false,
      isValidStyle: false,
      styleObject: null
    };
  }
}
var js = class {
  constructor() {
    L(this, "_map");
    L(this, "_container");
    L(this, "_terrainButton");
    so(["_toggleTerrain", "_updateTerrainIcon"], this);
  }
  onAdd(e) {
    return this._map = e, this._container = pe("div", "maplibregl-ctrl maplibregl-ctrl-group"), this._terrainButton = pe("button", "maplibregl-ctrl-terrain", this._container), pe("span", "maplibregl-ctrl-icon", this._terrainButton).setAttribute("aria-hidden", "true"), this._terrainButton.type = "button", this._terrainButton.addEventListener("click", this._toggleTerrain), this._updateTerrainIcon(), this._map.on("terrain", this._updateTerrainIcon), this._container;
  }
  onRemove() {
    ar(this._container), this._map.off("terrain", this._updateTerrainIcon), this._map = void 0;
  }
  _toggleTerrain() {
    this._map.hasTerrain() ? this._map.disableTerrain() : this._map.enableTerrain(), this._updateTerrainIcon();
  }
  _updateTerrainIcon() {
    this._terrainButton.classList.remove("maplibregl-ctrl-terrain"), this._terrainButton.classList.remove("maplibregl-ctrl-terrain-enabled"), this._map.hasTerrain() ? (this._terrainButton.classList.add("maplibregl-ctrl-terrain-enabled"), this._terrainButton.title = this._map._getUIString("TerrainControl.Disable")) : (this._terrainButton.classList.add("maplibregl-ctrl-terrain"), this._terrainButton.title = this._map._getUIString("TerrainControl.Enable"));
  }
};
var Ns = class extends wo {
  constructor(t = {}) {
    super({
      showCompass: t.showCompass ?? true,
      showZoom: t.showZoom ?? true,
      visualizePitch: t.visualizePitch ?? true
    });
    L(this, "_rotateCompassArrow", () => {
      const t2 = this._map.getBearing(), n = this._map.getPitch(), a = this.options.visualizePitch ? `scale(${Math.min(1.5, 1 / Math.cos(n * (Math.PI / 180)) ** 0.5)}) rotateX(${Math.min(70, n)}deg) rotateZ(${-t2}deg)` : `rotate(${-t2}deg)`;
      this._compassIcon.style.transform = a;
    });
    this._compass && (this._compass.removeEventListener("click", this._compass.clickFunction), this._compass.addEventListener("click", (n) => {
      this._map.getPitch() === 0 ? this._map.easeTo({
        pitch: Math.min(this._map.getMaxPitch(), 80)
      }) : this.options.visualizePitch ? this._map.resetNorthPitch({}, {
        originalEvent: n
      }) : this._map.resetNorth({}, {
        originalEvent: n
      });
    }));
  }
  /**
   * Overloading: the button now stores its click callback so that we can later on delete it and replace it
   */
  _createButton(t, n) {
    const a = super._createButton(t, n);
    return a.clickFunction = n, a;
  }
};
var ln = import_maplibre_gl.default.Marker;
var un = import_maplibre_gl.default.LngLat;
var Fs = import_maplibre_gl.default.LngLatBounds;
var Os = class extends So {
  constructor() {
    super(...arguments);
    L(this, "lastUpdatedCenter", new un(0, 0));
    L(this, "_updateCamera", (t) => {
      var c, p;
      const n = new un(t.coords.longitude, t.coords.latitude), a = t.coords.accuracy, i = __spreadProps(__spreadValues({
        bearing: this._map.getBearing()
      }, this.options.fitBoundsOptions), {
        linear: true
      }), s = this._map.getZoom();
      s > (((p = (c = this.options) == null ? void 0 : c.fitBoundsOptions) == null ? void 0 : p.maxZoom) ?? 30) && (i.zoom = s), this._map.fitBounds(Fs.fromLngLat(n, a), i, {
        geolocateSource: true
        // tag this camera change so it won't cause the control to change to background state
      });
      let l = false;
      const u = () => {
        l = true;
      };
      this._map.once("click", u), this._map.once("dblclick", u), this._map.once("dragstart", u), this._map.once("mousedown", u), this._map.once("touchstart", u), this._map.once("wheel", u), this._map.once("moveend", () => {
        this._map.off("click", u), this._map.off("dblclick", u), this._map.off("dragstart", u), this._map.off("mousedown", u), this._map.off("touchstart", u), this._map.off("wheel", u), !l && (this.lastUpdatedCenter = this._map.getCenter());
      });
    });
    L(this, "_finishSetupUI", (t) => {
      if (this._map) {
        if (t === false) {
          const n = this._map._getUIString("GeolocateControl.LocationNotAvailable");
          this._geolocateButton.disabled = true, this._geolocateButton.title = n, this._geolocateButton.setAttribute("aria-label", n);
        } else {
          const n = this._map._getUIString("GeolocateControl.FindMyLocation");
          this._geolocateButton.disabled = false, this._geolocateButton.title = n, this._geolocateButton.setAttribute("aria-label", n);
        }
        this.options.trackUserLocation && (this._geolocateButton.setAttribute("aria-pressed", "false"), this._watchState = "OFF"), this.options.showUserLocation && (this._dotElement = pe("div", "maplibregl-user-location-dot"), this._userLocationDotMarker = new ln({
          element: this._dotElement
        }), this._circleElement = pe("div", "maplibregl-user-location-accuracy-circle"), this._accuracyCircleMarker = new ln({
          element: this._circleElement,
          pitchAlignment: "map"
        }), this.options.trackUserLocation && (this._watchState = "OFF"), this._map.on("move", this._onZoom)), this._geolocateButton.addEventListener("click", this.trigger.bind(this)), this._setup = true, this.options.trackUserLocation && this._map.on("moveend", (n) => {
          const a = n.originalEvent && n.originalEvent.type === "resize", o = this.lastUpdatedCenter.distanceTo(this._map.getCenter());
          !n.geolocateSource && this._watchState === "ACTIVE_LOCK" && !a && o > 1 && (this._watchState = "BACKGROUND", this._geolocateButton.classList.add("maplibregl-ctrl-geolocate-background"), this._geolocateButton.classList.remove("maplibregl-ctrl-geolocate-active"), this.fire(new Event("trackuserlocationend")));
        });
      }
    });
    L(this, "_onZoom", () => {
      this.options.showUserLocation && this.options.showAccuracyCircle && this._updateCircleRadius();
    });
  }
  _updateCircleRadius() {
    if (this._watchState !== "BACKGROUND" && this._watchState !== "ACTIVE_LOCK") return;
    const t = [this._lastKnownPosition.coords.longitude, this._lastKnownPosition.coords.latitude], n = this._map.project(t), a = this._map.unproject([n.x, n.y]), o = this._map.unproject([n.x + 20, n.y]), i = a.distanceTo(o) / 20, s = Math.ceil(2 * this._accuracy / i);
    this._circleElement.style.width = `${s}px`, this._circleElement.style.height = `${s}px`;
  }
  // We are overwriting the method _setErrorState from Maplibre's GeolocateControl because the
  // case BACKGROUND_ERROR is not dealt with in the original function and yields an error.
  // Related issue: https://github.com/maplibre/maplibre-gl-js/issues/2294
  _setErrorState() {
    switch (this._watchState) {
      case "WAITING_ACTIVE":
        this._watchState = "ACTIVE_ERROR", this._geolocateButton.classList.remove("maplibregl-ctrl-geolocate-active"), this._geolocateButton.classList.add("maplibregl-ctrl-geolocate-active-error");
        break;
      case "ACTIVE_LOCK":
        this._watchState = "ACTIVE_ERROR", this._geolocateButton.classList.remove("maplibregl-ctrl-geolocate-active"), this._geolocateButton.classList.add("maplibregl-ctrl-geolocate-active-error"), this._geolocateButton.classList.add("maplibregl-ctrl-geolocate-waiting");
        break;
      case "BACKGROUND":
        this._watchState = "BACKGROUND_ERROR", this._geolocateButton.classList.remove("maplibregl-ctrl-geolocate-background"), this._geolocateButton.classList.add("maplibregl-ctrl-geolocate-background-error"), this._geolocateButton.classList.add("maplibregl-ctrl-geolocate-waiting");
        break;
      case "ACTIVE_ERROR":
        break;
      case "BACKGROUND_ERROR":
        break;
      default:
        throw new Error(`Unexpected watchState ${this._watchState}`);
    }
  }
};
var H;
var Q;
var me;
var he;
var K;
var Ye;
var B;
var ia;
var Z;
var sa;
var Gt = class {
  constructor(e, t) {
    ye(this, B);
    ye(this, H);
    L(this, "map");
    ye(this, Q);
    ye(this, me);
    ye(this, he);
    ye(this, K, false);
    ye(this, Ye);
    e.style !== void 0 && Se(this, K, true), Se(this, H, __spreadProps(__spreadValues(__spreadProps(__spreadValues({
      // set defaults
      zoomAdjust: -4,
      position: "top-right"
    }, t), {
      // override any lingering control options
      forceNoAttributionControl: true,
      attributionControl: false,
      navigationControl: false,
      geolocateControl: false,
      maptilerLogo: false,
      minimap: false,
      hash: false,
      pitchAdjust: false
    }), e), {
      containerStyle: __spreadValues({
        border: "1px solid #000",
        width: "400px",
        height: "300px"
      }, e.containerStyle ?? {})
    })), e.lockZoom !== void 0 && (E(this, H).minZoom = e.lockZoom, E(this, H).maxZoom = e.lockZoom);
  }
  setStyle(e, t) {
    E(this, K) || this.map.setStyle(e, t), G(this, B, Z).call(this);
  }
  addLayer(e, t) {
    return E(this, K) || this.map.addLayer(e, t), G(this, B, Z).call(this), this.map;
  }
  moveLayer(e, t) {
    return E(this, K) || this.map.moveLayer(e, t), G(this, B, Z).call(this), this.map;
  }
  removeLayer(e) {
    return E(this, K) || this.map.removeLayer(e), G(this, B, Z).call(this), this;
  }
  setLayerZoomRange(e, t, n) {
    return E(this, K) || this.map.setLayerZoomRange(e, t, n), G(this, B, Z).call(this), this;
  }
  setFilter(e, t, n) {
    return E(this, K) || this.map.setFilter(e, t, n), G(this, B, Z).call(this), this;
  }
  setPaintProperty(e, t, n, a) {
    return E(this, K) || this.map.setPaintProperty(e, t, n, a), G(this, B, Z).call(this), this;
  }
  setLayoutProperty(e, t, n, a) {
    return E(this, K) || this.map.setLayoutProperty(e, t, n, a), G(this, B, Z).call(this), this;
  }
  setGlyphs(e, t) {
    return E(this, K) || this.map.setGlyphs(e, t), G(this, B, Z).call(this), this;
  }
  onAdd(e) {
    Se(this, Q, e), Se(this, me, pe("div", "maplibregl-ctrl maplibregl-ctrl-group"));
    for (const [t, n] of Object.entries(E(this, H).containerStyle)) E(this, me).style.setProperty(t, n);
    return E(this, H).container = E(this, me), E(this, H).zoom = e.getZoom() + E(this, H).zoomAdjust, this.map = new Us(E(this, H)), this.map.once("style.load", () => {
      this.map.resize();
    }), this.map.once("load", () => {
      G(this, B, ia).call(this, E(this, H).parentRect), Se(this, Ye, G(this, B, sa).call(this));
    }), E(this, me);
  }
  onRemove() {
    var e;
    (e = E(this, Ye)) == null || e.call(this), ar(E(this, me));
  }
};
H = /* @__PURE__ */ new WeakMap(), Q = /* @__PURE__ */ new WeakMap(), me = /* @__PURE__ */ new WeakMap(), he = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakSet(), ia = function(e) {
  e === void 0 || e.linePaint === void 0 && e.fillPaint === void 0 || (Se(this, he, {
    type: "Feature",
    properties: {
      name: "parentRect"
    },
    geometry: {
      type: "Polygon",
      coordinates: [[[], [], [], [], []]]
    }
  }), this.map.addSource("parentRect", {
    type: "geojson",
    data: E(this, he)
  }), (e.lineLayout !== void 0 || e.linePaint !== void 0) && this.map.addLayer({
    id: "parentRectOutline",
    type: "line",
    source: "parentRect",
    layout: __spreadValues({}, e.lineLayout),
    paint: __spreadValues({
      "line-color": "#FFF",
      "line-width": 1,
      "line-opacity": 0.85
    }, e.linePaint)
  }), e.fillPaint !== void 0 && this.map.addLayer({
    id: "parentRectFill",
    type: "fill",
    source: "parentRect",
    layout: {},
    paint: __spreadValues({
      "fill-color": "#08F",
      "fill-opacity": 0.135
    }, e.fillPaint)
  }), G(this, B, Z).call(this));
}, Z = function() {
  if (E(this, he) === void 0) return;
  const {
    devicePixelRatio: e
  } = window, t = E(this, Q).getCanvas(), n = t.width / e, a = t.height / e, o = E(this, Q).unproject.bind(E(this, Q)), i = o([0, 0]), s = o([n, 0]), l = o([0, a]), u = o([n, a]);
  E(this, he).geometry.coordinates = [[l.toArray(), u.toArray(), s.toArray(), i.toArray(), l.toArray()]], this.map.getSource("parentRect").setData(E(this, he));
}, sa = function() {
  const {
    pitchAdjust: e
  } = E(this, H), t = () => {
    i("parent");
  }, n = () => {
    i("minimap");
  }, a = () => {
    E(this, Q).on("move", t), this.map.on("move", n);
  }, o = () => {
    E(this, Q).off("move", t), this.map.off("move", n);
  }, i = (s) => {
    o();
    const l = s === "parent" ? E(this, Q) : this.map, u = s === "parent" ? this.map : E(this, Q), c = l.getCenter(), p = l.getZoom() + E(this, H).zoomAdjust * (s === "parent" ? 1 : -1), m = l.getBearing(), f = l.getPitch();
    u.jumpTo({
      center: c,
      zoom: p,
      bearing: m,
      pitch: e ? f : 0
    }), G(this, B, Z).call(this), a();
  };
  return a(), () => {
    o();
  };
};
var Ds = class {
  constructor() {
    L(this, "map");
    L(this, "container");
    L(this, "projectionButton");
  }
  onAdd(e) {
    return this.map = e, this.container = pe("div", "maplibregl-ctrl maplibregl-ctrl-group"), this.projectionButton = pe("button", "maplibregl-ctrl-projection", this.container), pe("span", "maplibregl-ctrl-icon", this.projectionButton).setAttribute("aria-hidden", "true"), this.projectionButton.type = "button", this.projectionButton.addEventListener("click", this.toggleProjection.bind(this)), e.on("projectiontransition", this.updateProjectionIcon.bind(this)), this.updateProjectionIcon(), this.container;
  }
  onRemove() {
    ar(this.container), this.map.off("projectiontransition", this.updateProjectionIcon), this.map = void 0;
  }
  toggleProjection() {
    this.map.getProjection() === void 0 && this.map.setProjection({
      type: "mercator"
    }), this.map.isGlobeProjection() ? this.map.enableMercatorProjection() : this.map.enableGlobeProjection(), this.updateProjectionIcon();
  }
  updateProjectionIcon() {
    this.projectionButton.classList.remove("maplibregl-ctrl-projection-globe"), this.projectionButton.classList.remove("maplibregl-ctrl-projection-mercator"), this.map.isGlobeProjection() ? (this.projectionButton.classList.add("maplibregl-ctrl-projection-mercator"), this.projectionButton.title = "Enable Mercator projection") : (this.projectionButton.classList.add("maplibregl-ctrl-projection-globe"), this.projectionButton.title = "Enable Globe projection");
  }
};
var qs = class {
  /**
   *
   * @param map : a Map instance
   * @param delay : a delay in milliseconds after which the payload is sent to MapTiler cloud (cannot be less than 1000ms)
   */
  constructor(e, t = 2e3) {
    L(this, "map");
    L(this, "registeredModules", /* @__PURE__ */ new Set());
    this.map = e, setTimeout(() => __async(this, null, function* () {
      if (!F.telemetry) return;
      const n = this.preparePayload();
      try {
        (yield fetch(n, {
          method: "POST"
        })).ok || console.warn("The metrics could not be sent to MapTiler Cloud");
      } catch (a) {
        console.warn("The metrics could not be sent to MapTiler Cloud", a);
      }
    }), Math.max(1e3, t));
  }
  /**
   * Register a module to the telemetry system of the SDK.
   * The arguments `name` and `version` likely come from the package.json
   * of each module.
   */
  registerModule(e, t) {
    this.registeredModules.add(`${e}:${t}`);
  }
  preparePayload() {
    const e = new URL(V.telemetryURL);
    return e.searchParams.append("sdk", wn.version), e.searchParams.append("key", F.apiKey), e.searchParams.append("mtsid", nr), e.searchParams.append("session", F.session ? "1" : "0"), e.searchParams.append("caching", F.caching ? "1" : "0"), e.searchParams.append("lang-updated", this.map.isLanguageUpdated() ? "1" : "0"), e.searchParams.append("terrain", this.map.getTerrain() ? "1" : "0"), e.searchParams.append("globe", this.map.isGlobeProjection() ? "1" : "0"), this.registeredModules.size > 0 && e.searchParams.append("modules", Array.from(this.registeredModules).join("|")), e.href;
  }
};
var Bs = {
  POINT: "POINT",
  COUNTRY: "COUNTRY"
};
var Us = class extends import_maplibre_gl.default.Map {
  constructor(t) {
    co(t.container), t.apiKey && (F.apiKey = t.apiKey);
    const {
      style: n,
      requiresUrlMonitoring: a,
      isFallback: o
    } = sn(t.style);
    o && console.warn("Invalid style. A style must be a valid URL to a style.json, a JSON string representing a valid StyleSpecification or a valid StyleSpecification object. Fallback to default MapTiler style."), F.apiKey || console.warn("MapTiler Cloud API key is not set. Visit https://maptiler.com and try Cloud for free!");
    const i = location.hash;
    let s = {
      compact: false
    };
    t.customAttribution ? s.customAttribution = t.customAttribution : t.attributionControl && typeof t.attributionControl == "object" && (s = __spreadValues(__spreadValues({}, s), t.attributionControl));
    const l = __spreadProps(__spreadValues({}, t), {
      style: n,
      maplibreLogo: false,
      transformRequest: Nr(t.transformRequest),
      attributionControl: t.forceNoAttributionControl === true ? false : s
    });
    delete l.style;
    super(l);
    L(this, "telemetry");
    L(this, "isTerrainEnabled", false);
    L(this, "terrainExaggeration", 1);
    L(this, "primaryLanguage");
    L(this, "terrainGrowing", false);
    L(this, "terrainFlattening", false);
    L(this, "minimap");
    L(this, "forceLanguageUpdate");
    L(this, "languageAlwaysBeenStyle");
    L(this, "isReady", false);
    L(this, "terrainAnimationDuration", 1e3);
    L(this, "monitoredStyleUrls");
    L(this, "styleInProcess", false);
    L(this, "curentProjection");
    L(this, "originalLabelStyle", new window.Map());
    L(this, "isStyleLocalized", false);
    L(this, "languageIsUpdated", false);
    this.setStyle(n), a && this.monitorStyleUrl(n);
    const u = () => {
      let d = "The distant style could not be loaded.";
      this.getStyle() ? d += "Leaving the style as is." : (this.setStyle(MapStyle.STREETS), d += `Loading default MapTiler Cloud style "${MapStyle.STREETS.getDefaultVariant().getId()}" as a fallback.`), console.warn(d);
    };
    if (this.on("style.load", () => {
      this.styleInProcess = false;
    }), this.on("error", (d) => {
      if (d.error instanceof import_maplibre_gl.default.AJAXError) {
        const v = d.error.url, w = new URL(v);
        w.search = "";
        const b = w.href;
        this.monitoredStyleUrls && this.monitoredStyleUrls.has(b) && (this.monitoredStyleUrls.delete(b), u());
        return;
      }
      if (this.styleInProcess) return u();
    }), F.caching && !Wt && console.warn("The cache API is only available in secure contexts. More info at https://developer.mozilla.org/en-US/docs/Web/API/Cache"), F.caching && Wt && oo(), typeof t.language > "u") this.primaryLanguage = F.primaryLanguage;
    else {
      const d = toLanguageInfo(t.language, M);
      this.primaryLanguage = d ?? F.primaryLanguage;
    }
    this.forceLanguageUpdate = !(this.primaryLanguage === M.STYLE || this.primaryLanguage === M.STYLE_LOCK), this.languageAlwaysBeenStyle = this.primaryLanguage === M.STYLE, this.terrainExaggeration = t.terrainExaggeration ?? this.terrainExaggeration, this.curentProjection = t.projection, this.on("styledata", () => {
      this.curentProjection === "mercator" ? this.setProjection({
        type: "mercator"
      }) : this.curentProjection === "globe" && this.setProjection({
        type: "globe"
      });
    }), this.once("styledata", () => __async(this, null, function* () {
      if (!t.geolocate || t.center || t.hash && i) return;
      try {
        if (t.geolocate === Bs.COUNTRY) {
          yield this.fitToIpBounds();
          return;
        }
      } catch (v) {
        console.warn(v.message);
      }
      let d;
      try {
        yield this.centerOnIpPoint(t.zoom), d = this.getCameraHash();
      } catch (v) {
        console.warn(v.message);
      }
      (yield navigator.permissions.query({
        name: "geolocation"
      })).state === "granted" && navigator.geolocation.getCurrentPosition(
        // success callback
        (v) => {
          d === this.getCameraHash() && (this.terrain ? this.easeTo({
            center: [v.coords.longitude, v.coords.latitude],
            zoom: t.zoom || 12,
            duration: 2e3
          }) : this.once("terrain", () => {
            this.easeTo({
              center: [v.coords.longitude, v.coords.latitude],
              zoom: t.zoom || 12,
              duration: 2e3
            });
          }));
        },
        // error callback
        null,
        // options
        {
          maximumAge: 24 * 3600 * 1e3,
          // a day in millisec
          timeout: 5e3,
          // milliseconds
          enableHighAccuracy: false
        }
      );
    })), this.on("styledata", () => {
      this.setPrimaryLanguage(this.primaryLanguage);
    }), this.on("styledata", () => {
      this.getTerrain() === null && this.isTerrainEnabled && this.enableTerrain(this.terrainExaggeration);
    }), this.once("load", () => __async(this, null, function* () {
      let d = {
        logo: null
      };
      try {
        const y = Object.keys(this.style.sourceCaches).map((b) => this.getSource(b)).filter((b) => b && "url" in b && typeof b.url == "string" && (b == null ? void 0 : b.url.includes("tiles.json"))), v = new URL(y[0].url);
        v.searchParams.has("key") || v.searchParams.append("key", F.apiKey), d = yield (yield fetch(v.href)).json();
      } catch {
      }
      if (t.forceNoAttributionControl !== true) if ("logo" in d && d.logo) {
        const y = d.logo;
        this.addControl(new Or({
          logoURL: y
        }), t.logoPosition);
      } else t.maptilerLogo && this.addControl(new Or(), t.logoPosition);
      if (t.scaleControl) {
        const y = t.scaleControl === true || t.scaleControl === void 0 ? "bottom-right" : t.scaleControl, v = new ko({
          unit: F.unit
        });
        this.addControl(v, y), F.on("unit", (w) => {
          v.setUnit(w);
        });
      }
      if (t.navigationControl !== false) {
        const y = t.navigationControl === true || t.navigationControl === void 0 ? "top-right" : t.navigationControl;
        this.addControl(new Ns(), y);
      }
      if (t.geolocateControl !== false) {
        const y = t.geolocateControl === true || t.geolocateControl === void 0 ? "top-right" : t.geolocateControl;
        this.addControl(
          // new maplibregl.GeolocateControl({
          new Os({
            positionOptions: {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 6e3
            },
            fitBoundsOptions: {
              maxZoom: 15
            },
            trackUserLocation: true,
            showAccuracyCircle: true,
            showUserLocation: true
          }),
          y
        );
      }
      if (t.terrainControl) {
        const y = t.terrainControl === true || t.terrainControl === void 0 ? "top-right" : t.terrainControl;
        this.addControl(new js(), y);
      }
      if (t.projectionControl) {
        const y = t.projectionControl === true || t.projectionControl === void 0 ? "top-right" : t.projectionControl;
        this.addControl(new Ds(), y);
      }
      if (t.fullscreenControl) {
        const y = t.fullscreenControl === true || t.fullscreenControl === void 0 ? "top-right" : t.fullscreenControl;
        this.addControl(new Lo({}), y);
      }
      this.isReady = true, this.fire("ready", {
        target: this
      });
    }));
    let c = false, p = false, m;
    this.once("ready", () => {
      c = true, p && this.fire("loadWithTerrain", m);
    }), this.once("style.load", () => {
      const {
        minimap: d
      } = t;
      if (typeof d == "object") {
        const {
          zoom: y,
          center: v,
          style: w,
          language: b,
          apiKey: T,
          maptilerLogo: j,
          canvasContextAttributes: R,
          refreshExpiredTiles: ae,
          maxBounds: we,
          scrollZoom: De,
          minZoom: et,
          maxZoom: tt,
          boxZoom: va,
          locale: ba,
          fadeDuration: wa,
          crossSourceCollisions: Sa,
          clickTolerance: xa,
          bounds: ka,
          fitBoundsOptions: La,
          pixelRatio: Ca,
          validateStyle: Aa
        } = t;
        this.minimap = new Gt(d, {
          zoom: y,
          center: v,
          style: w,
          language: b,
          apiKey: T,
          container: "null",
          maptilerLogo: j,
          canvasContextAttributes: R,
          refreshExpiredTiles: ae,
          maxBounds: we,
          scrollZoom: De,
          minZoom: et,
          maxZoom: tt,
          boxZoom: va,
          locale: ba,
          fadeDuration: wa,
          crossSourceCollisions: Sa,
          clickTolerance: xa,
          bounds: ka,
          fitBoundsOptions: La,
          pixelRatio: Ca,
          validateStyle: Aa
        }), this.addControl(this.minimap, d.position ?? "bottom-left");
      } else d === true ? (this.minimap = new Gt({}, t), this.addControl(this.minimap, "bottom-left")) : d !== void 0 && d !== false && (this.minimap = new Gt({}, t), this.addControl(this.minimap, d));
    });
    const f = (d) => {
      d.terrain && (p = true, m = {
        type: "loadWithTerrain",
        target: this,
        terrain: d.terrain
      }, this.off("terrain", f), c && this.fire("loadWithTerrain", m));
    };
    this.on("terrain", f), t.terrain && this.enableTerrain(t.terrainExaggeration ?? this.terrainExaggeration), this.once("load", () => {
      this.getCanvas().addEventListener("webglcontextlost", (d) => {
        console.warn(d), po(t.container), this.fire("webglContextLost", {
          error: d
        });
      });
    }), this.telemetry = new qs(this);
  }
  /**
   * Set the duration (millisec) of the terrain animation for growing or flattening.
   * Must be positive. (Built-in default: `1000` milliseconds)
   */
  setTerrainAnimationDuration(t) {
    this.terrainAnimationDuration = Math.max(t, 0);
  }
  /**
   * Awaits for _this_ Map instance to be "loaded" and returns a Promise to the Map.
   * If _this_ Map instance is already loaded, the Promise is resolved directly,
   * otherwise, it is resolved as a result of the "load" event.
   * @returns
   */
  onLoadAsync() {
    return __async(this, null, function* () {
      return new Promise((t) => {
        if (this.loaded()) return t(this);
        this.once("load", () => {
          t(this);
        });
      });
    });
  }
  /**
   * Awaits for _this_ Map instance to be "ready" and returns a Promise to the Map.
   * If _this_ Map instance is already ready, the Promise is resolved directly,
   * otherwise, it is resolved as a result of the "ready" event.
   * A map instance is "ready" when all the controls that can be managed by the contructor are
   * dealt with. This happens after the "load" event, due to the asynchronous nature
   * of some built-in controls.
   */
  onReadyAsync() {
    return __async(this, null, function* () {
      return new Promise((t) => {
        if (this.isReady) return t(this);
        this.once("ready", () => {
          t(this);
        });
      });
    });
  }
  /**
   * Awaits for _this_ Map instance to be "loaded" as well as with terrain being non-null for the first time
   * and returns a Promise to the Map.
   * If _this_ Map instance is already loaded with terrain, the Promise is resolved directly,
   * otherwise, it is resolved as a result of the "loadWithTerrain" event.
   * @returns
   */
  onLoadWithTerrainAsync() {
    return __async(this, null, function* () {
      return new Promise((t) => {
        if (this.isReady && this.terrain) return t(this);
        this.once("loadWithTerrain", () => {
          t(this);
        });
      });
    });
  }
  monitorStyleUrl(t) {
    typeof this.monitoredStyleUrls > "u" && (this.monitoredStyleUrls = /* @__PURE__ */ new Set());
    const n = new URL(t);
    n.search = "", this.monitoredStyleUrls.add(n.href);
  }
  /**
   * Update the style of the map.
   * Can be:
   * - a full style URL (possibly with API key)
   * - a shorthand with only the MapTIler style name (eg. `"streets-v2"`)
   * - a longer form with the prefix `"maptiler://"` (eg. `"maptiler://streets-v2"`)
   */
  setStyle(t, n) {
    var o;
    this.originalLabelStyle.clear(), (o = this.minimap) == null || o.setStyle(t), this.forceLanguageUpdate = true, this.once("idle", () => {
      this.forceLanguageUpdate = false;
    });
    const a = sn(t);
    if (a.requiresUrlMonitoring && this.monitorStyleUrl(a.style), a.isFallback) {
      if (this.getStyle()) return console.warn("Invalid style. A style must be a valid URL to a style.json, a JSON string representing a valid StyleSpecification or a valid StyleSpecification object. Keeping the curent style instead."), this;
      console.warn("Invalid style. A style must be a valid URL to a style.json, a JSON string representing a valid StyleSpecification or a valid StyleSpecification object. Fallback to default MapTiler style.");
    }
    return this.styleInProcess = true, super.setStyle(a.style, n), this;
  }
  /**
   * Adds a [MapLibre style layer](https://maplibre.org/maplibre-style-spec/layers)
   * to the map's style.
   *
   * A layer defines how data from a specified source will be styled. Read more about layer types
   * and available paint and layout properties in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/layers).
   *
   * @param layer - The layer to add,
   * conforming to either the MapLibre Style Specification's [layer definition](https://maplibre.org/maplibre-style-spec/layers) or,
   * less commonly, the {@link CustomLayerInterface} specification.
   * The MapLibre Style Specification's layer definition is appropriate for most layers.
   *
   * @param beforeId - The ID of an existing layer to insert the new layer before,
   * resulting in the new layer appearing visually beneath the existing layer.
   * If this argument is not specified, the layer will be appended to the end of the layers array
   * and appear visually above all other layers.
   *
   * @returns `this`
   */
  addLayer(t, n) {
    var a;
    return (a = this.minimap) == null || a.addLayer(t, n), super.addLayer(t, n);
  }
  /**
   * Moves a layer to a different z-position.
   *
   * @param id - The ID of the layer to move.
   * @param beforeId - The ID of an existing layer to insert the new layer before. When viewing the map, the `id` layer will appear beneath the `beforeId` layer. If `beforeId` is omitted, the layer will be appended to the end of the layers array and appear above all other layers on the map.
   * @returns `this`
   *
   * @example
   * Move a layer with ID 'polygon' before the layer with ID 'country-label'. The `polygon` layer will appear beneath the `country-label` layer on the map.
   * ```ts
   * map.moveLayer('polygon', 'country-label');
   * ```
   */
  moveLayer(t, n) {
    var a;
    return (a = this.minimap) == null || a.moveLayer(t, n), super.moveLayer(t, n);
  }
  /**
   * Removes the layer with the given ID from the map's style.
   *
   * An {@link ErrorEvent} will be fired if the image parameter is invald.
   *
   * @param id - The ID of the layer to remove
   * @returns `this`
   *
   * @example
   * If a layer with ID 'state-data' exists, remove it.
   * ```ts
   * if (map.getLayer('state-data')) map.removeLayer('state-data');
   * ```
   */
  removeLayer(t) {
    var n;
    return (n = this.minimap) == null || n.removeLayer(t), super.removeLayer(t);
  }
  /**
   * Sets the zoom extent for the specified style layer. The zoom extent includes the
   * [minimum zoom level](https://maplibre.org/maplibre-style-spec/layers/#minzoom)
   * and [maximum zoom level](https://maplibre.org/maplibre-style-spec/layers/#maxzoom))
   * at which the layer will be rendered.
   *
   * Note: For style layers using vector sources, style layers cannot be rendered at zoom levels lower than the
   * minimum zoom level of the _source layer_ because the data does not exist at those zoom levels. If the minimum
   * zoom level of the source layer is higher than the minimum zoom level defined in the style layer, the style
   * layer will not be rendered at all zoom levels in the zoom range.
   */
  setLayerZoomRange(t, n, a) {
    var o;
    return (o = this.minimap) == null || o.setLayerZoomRange(t, n, a), super.setLayerZoomRange(t, n, a);
  }
  /**
   * Sets the filter for the specified style layer.
   *
   * Filters control which features a style layer renders from its source.
   * Any feature for which the filter expression evaluates to `true` will be
   * rendered on the map. Those that are false will be hidden.
   *
   * Use `setFilter` to show a subset of your source data.
   *
   * To clear the filter, pass `null` or `undefined` as the second parameter.
   */
  setFilter(t, n, a) {
    var o;
    return (o = this.minimap) == null || o.setFilter(t, n, a), super.setFilter(t, n, a);
  }
  /**
   * Sets the value of a paint property in the specified style layer.
   *
   * @param layerId - The ID of the layer to set the paint property in.
   * @param name - The name of the paint property to set.
   * @param value - The value of the paint property to set.
   * Must be of a type appropriate for the property, as defined in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/).
   * @param options - Options object.
   * @returns `this`
   * @example
   * ```ts
   * map.setPaintProperty('my-layer', 'fill-color', '#faafee');
   * ```
   */
  setPaintProperty(t, n, a, o) {
    var i;
    return (i = this.minimap) == null || i.setPaintProperty(t, n, a, o), super.setPaintProperty(t, n, a, o);
  }
  /**
   * Sets the value of a layout property in the specified style layer.
   * Layout properties define how the layer is styled.
   * Layout properties for layers of the same type are documented together.
   * Layers of different types have different layout properties.
   * See the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/) for the complete list of layout properties.
   * @param layerId - The ID of the layer to set the layout property in.
   * @param name - The name of the layout property to set.
   * @param value - The value of the layout property to set.
   * Must be of a type appropriate for the property, as defined in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/).
   * @param options - Options object.
   * @returns `this`
   */
  setLayoutProperty(t, n, a, o) {
    var i;
    return (i = this.minimap) == null || i.setLayoutProperty(t, n, a, o), super.setLayoutProperty(t, n, a, o);
  }
  /**
   * Sets the value of the style's glyphs property.
   *
   * @param glyphsUrl - Glyph URL to set. Must conform to the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/glyphs/).
   * @param options - Options object.
   * @returns `this`
   * @example
   * ```ts
   * map.setGlyphs('https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf');
   * ```
   */
  setGlyphs(t, n) {
    var a;
    return (a = this.minimap) == null || a.setGlyphs(t, n), super.setGlyphs(t, n);
  }
  getStyleLanguage() {
    return !this.style || !this.style.stylesheet || !this.style.stylesheet.metadata || typeof this.style.stylesheet.metadata != "object" ? null : "maptiler:language" in this.style.stylesheet.metadata && typeof this.style.stylesheet.metadata["maptiler:language"] == "string" ? getLanguageInfoFromFlag(this.style.stylesheet.metadata["maptiler:language"]) : null;
  }
  /**
   * Define the primary language of the map. Note that not all the languages shorthands provided are available.
   */
  setLanguage(t) {
    var n, a;
    (a = (n = this.minimap) == null ? void 0 : n.map) == null || a.setLanguage(t), this.onStyleReady(() => {
      this.setPrimaryLanguage(t);
    });
  }
  /**
   * Define the primary language of the map. Note that not all the languages shorthands provided are available.
   */
  setPrimaryLanguage(t) {
    const n = this.getStyleLanguage(), a = toLanguageInfo(t, M);
    if (!a) {
      console.warn(`The language "${a}" is not supported.`);
      return;
    }
    if (!(a.flag === M.STYLE.flag && n && (n.flag === M.AUTO.flag || n.flag === M.VISITOR.flag)) && (a.flag !== M.STYLE.flag && (this.languageAlwaysBeenStyle = false), this.languageAlwaysBeenStyle || this.primaryLanguage === a && !this.forceLanguageUpdate)) return;
    if (this.primaryLanguage.flag === M.STYLE_LOCK.flag) {
      console.warn("The language cannot be changed because this map has been instantiated with the STYLE_LOCK language flag.");
      return;
    }
    this.primaryLanguage = a;
    let o = a;
    if (a.flag === M.STYLE.flag) {
      if (!n) {
        console.warn("The style has no default languages or has an invalid one.");
        return;
      }
      o = n;
    }
    let i = M.LOCAL.flag, s = ["get", i];
    o.flag === M.VISITOR.flag ? (i = Pr().flag, s = ["case", ["all", ["has", i], ["has", M.LOCAL.flag]], ["case", ["==", ["get", i], ["get", M.LOCAL.flag]], ["get", M.LOCAL.flag], ["format", ["get", i], {
      "font-scale": 0.8
    }, `
`, ["get", M.LOCAL.flag], {
      "font-scale": 1.1
    }]], ["get", M.LOCAL.flag]]) : o.flag === M.VISITOR_ENGLISH.flag ? (i = M.ENGLISH.flag, s = ["case", ["all", ["has", i], ["has", M.LOCAL.flag]], ["case", ["==", ["get", i], ["get", M.LOCAL.flag]], ["get", M.LOCAL.flag], ["format", ["get", i], {
      "font-scale": 0.8
    }, `
`, ["get", M.LOCAL.flag], {
      "font-scale": 1.1
    }]], ["get", M.LOCAL.flag]]) : o.flag === M.AUTO.flag ? (i = Pr().flag, s = ["coalesce", ["get", i], ["get", M.LOCAL.flag]]) : o === M.LOCAL ? (i = M.LOCAL.flag, s = ["get", i]) : (i = o.flag, s = ["coalesce", ["get", i], ["get", M.LOCAL.flag]]);
    const {
      layers: l
    } = this.getStyle(), u = this.originalLabelStyle.size === 0;
    if (u) {
      const c = bo(l, this);
      this.isStyleLocalized = Object.keys(c.localized).length > 0;
    }
    for (const c of l) {
      if (c.type !== "symbol") continue;
      const p = c, m = this.getSource(p.source);
      if (!m || !("url" in m && typeof m.url == "string") || new URL(m.url).host !== V.maptilerApiHost) continue;
      const {
        id: d,
        layout: y
      } = p;
      if (!y || !("text-field" in y)) continue;
      let v;
      if (u ? (v = this.getLayoutProperty(d, "text-field"), this.originalLabelStyle.set(d, v)) : v = this.originalLabelStyle.get(d), typeof v == "string") {
        const {
          contains: w,
          exactMatch: b
        } = yo(v, this.isStyleLocalized);
        if (!w) continue;
        if (b) this.setLayoutProperty(d, "text-field", s);
        else {
          const T = mo(v, s, this.isStyleLocalized);
          this.setLayoutProperty(d, "text-field", T);
        }
      } else {
        const w = fo(v, s, this.isStyleLocalized);
        this.setLayoutProperty(d, "text-field", w);
      }
    }
    this.languageIsUpdated = true;
  }
  /**
   * Get the primary language
   * @returns
   */
  getPrimaryLanguage() {
    return this.primaryLanguage;
  }
  /**
   * Get the exaggeration factor applied to the terrain
   * @returns
   */
  getTerrainExaggeration() {
    return this.terrainExaggeration;
  }
  /**
   * Know if terrian is enabled or not
   * @returns
   */
  hasTerrain() {
    return this.isTerrainEnabled;
  }
  growTerrain(t) {
    if (!this.terrain) return;
    const n = performance.now(), a = this.terrain.exaggeration, o = t - a, i = () => {
      if (!this.terrain || this.terrainFlattening) return;
      const s = (performance.now() - n) / this.terrainAnimationDuration;
      if (s < 0.99) {
        const l = 1 - (1 - s) ** 4, u = a + l * o;
        this.terrain.exaggeration = u, requestAnimationFrame(i);
      } else this.terrainGrowing = false, this.terrainFlattening = false, this.terrain.exaggeration = t, this.fire("terrainAnimationStop", {
        terrain: this.terrain
      });
      this._elevationFreeze = false, this.triggerRepaint();
    };
    !this.terrainGrowing && !this.terrainFlattening && this.fire("terrainAnimationStart", {
      terrain: this.terrain
    }), this.terrainGrowing = true, this.terrainFlattening = false, requestAnimationFrame(i);
  }
  /**
   * Enables the 3D terrain visualization
   */
  enableTerrain(t = this.terrainExaggeration) {
    if (t < 0) {
      console.warn("Terrain exaggeration cannot be negative.");
      return;
    }
    const n = (o) => __async(this, null, function* () {
      !this.terrain || o.type !== "data" || o.dataType !== "source" || !("source" in o) || o.sourceId !== "maptiler-terrain" || o.source.type !== "raster-dem" || o.isSourceLoaded && (this.off("data", n), this.growTerrain(t));
    }), a = () => {
      this.isTerrainEnabled = true, this.terrainExaggeration = t, this.on("data", n), this.addSource(V.terrainSourceId, {
        type: "raster-dem",
        url: V.terrainSourceURL
      }), this.setTerrain({
        source: V.terrainSourceId,
        exaggeration: 0
      });
    };
    if (this.getTerrain()) {
      this.isTerrainEnabled = true, this.growTerrain(t);
      return;
    }
    this.loaded() || this.isTerrainEnabled ? a() : this.once("load", () => {
      this.getTerrain() && this.getSource(V.terrainSourceId) || a();
    });
  }
  /**
   * Disable the 3D terrain visualization
   */
  disableTerrain() {
    if (!this.terrain) return;
    this.isTerrainEnabled = false;
    const t = performance.now(), n = this.terrain.exaggeration, a = () => {
      if (!this.terrain || this.terrainGrowing) return;
      const o = (performance.now() - t) / this.terrainAnimationDuration;
      if (this._elevationFreeze = false, o < 0.99) {
        const i = (1 - o) ** 4, s = n * i;
        this.terrain.exaggeration = s, requestAnimationFrame(a);
      } else this.terrain.exaggeration = 0, this.terrainGrowing = false, this.terrainFlattening = false, this.setTerrain(), this.getSource(V.terrainSourceId) && this.removeSource(V.terrainSourceId), this.fire("terrainAnimationStop", {
        terrain: null
      });
      this.triggerRepaint();
    };
    !this.terrainGrowing && !this.terrainFlattening && this.fire("terrainAnimationStart", {
      terrain: this.terrain
    }), this.terrainGrowing = false, this.terrainFlattening = true, requestAnimationFrame(a);
  }
  /**
   * Sets the 3D terrain exageration factor.
   * If the terrain was not enabled prior to the call of this method,
   * the method `.enableTerrain()` will be called.
   * If `animate` is `true`, the terrain transformation will be animated in the span of 1 second.
   * If `animate` is `false`, no animated transition to the newly defined exaggeration.
   */
  setTerrainExaggeration(t, n = true) {
    !n && this.terrain ? (this.terrainExaggeration = t, this.terrain.exaggeration = t, this.triggerRepaint()) : this.enableTerrain(t);
  }
  /**
   * Perform an action when the style is ready. It could be at the moment of calling this method
   * or later.
   */
  onStyleReady(t) {
    this.isStyleLoaded() ? t() : this.once("styledata", () => {
      t();
    });
  }
  fitToIpBounds() {
    return __async(this, null, function* () {
      const t = yield geolocation.info();
      this.fitBounds(t.country_bounds, {
        duration: 0,
        padding: 100
      });
    });
  }
  centerOnIpPoint(t) {
    return __async(this, null, function* () {
      const n = yield geolocation.info();
      this.jumpTo({
        center: [(n == null ? void 0 : n.longitude) ?? 0, (n == null ? void 0 : n.latitude) ?? 0],
        zoom: t || 11
      });
    });
  }
  getCameraHash() {
    const t = new Float32Array(5), n = this.getCenter();
    return t[0] = n.lng, t[1] = n.lat, t[2] = this.getZoom(), t[3] = this.getPitch(), t[4] = this.getBearing(), gBase64.fromUint8Array(new Uint8Array(t.buffer));
  }
  /**
   * Get the SDK config object.
   * This is convenient to dispatch the SDK configuration to externally built layers
   * that do not directly have access to the SDK configuration but do have access to a Map instance.
   */
  getSdkConfig() {
    return F;
  }
  /**
   * Get the MapTiler session ID. Convenient to dispatch to externaly built component
   * that do not directly have access to the SDK configuration but do have access to a Map instance.
   * @returns
   */
  getMaptilerSessionId() {
    return nr;
  }
  /**
   *  Updates the requestManager's transform request with a new function.
   *
   * @param transformRequest A callback run before the Map makes a request for an external URL. The callback can be used to modify the url, set headers, or set the credentials property for cross-origin requests.
   *    Expected to return an object with a `url` property and optionally `headers` and `credentials` properties
   *
   * @returns {Map} `this`
   *
   *  @example
   *  map.setTransformRequest((url: string, resourceType: string) => {});
   */
  setTransformRequest(t) {
    return super.setTransformRequest(Nr(t)), this;
  }
  /**
   * Returns whether a globe projection is currently being used
   */
  isGlobeProjection() {
    const t = this.getProjection();
    return (t == null ? void 0 : t.type) === "globe";
  }
  /**
   * Activate the globe projection.
   */
  enableGlobeProjection() {
    this.isGlobeProjection() !== true && (this.setProjection({
      type: "globe"
    }), this.curentProjection = "globe");
  }
  /**
   * Activate the mercator projection.
   */
  enableMercatorProjection() {
    this.isGlobeProjection() !== false && (this.setProjection({
      type: "mercator"
    }), this.curentProjection = "mercator");
  }
  /**
   * Returns `true` is the language was ever updated, meaning changed
   * from what is delivered in the style.
   * Returns `false` if language in use is the language from the style
   * and has never been changed.
   */
  isLanguageUpdated() {
    return this.languageIsUpdated;
  }
};
function Ar(r) {
  if (typeof DOMParser < "u") {
    const e = new DOMParser().parseFromString(r, "application/xml");
    if (e.querySelector("parsererror")) throw new Error("The provided string is not valid XML");
    return e;
  }
  throw new Error("No XML parser found");
}
function la(r, e) {
  if (!r.hasChildNodes()) return false;
  for (const t of Array.from(r.childNodes)) {
    const n = t.nodeName;
    if (typeof n == "string" && n.trim().toLowerCase() === e.toLowerCase()) return true;
  }
  return false;
}
function cn(r) {
  if (typeof XMLSerializer < "u") return new XMLSerializer().serializeToString(r);
  throw new Error("No XML serializer found");
}
function ua(r) {
  const e = typeof r == "string" ? Ar(r) : r;
  if (!la(e, "gpx")) throw new Error("The XML document is not valid GPX");
  const t = U(e, "trk"), n = U(e, "rte"), a = U(e, "wpt"), o = {
    type: "FeatureCollection",
    features: []
  };
  for (const i of Array.from(t)) {
    const s = Ks(i);
    s && o.features.push(s);
  }
  for (const i of Array.from(n)) {
    const s = Ws(i);
    s && o.features.push(s);
  }
  for (const i of Array.from(a)) o.features.push(Zs(i));
  return o;
}
function ca(r, e) {
  let t = r;
  if (typeof t == "string" && (t = Ar(t)), !la(t, "kml")) throw new Error("The XML document is not valid KML");
  const n = {
    type: "FeatureCollection",
    features: []
  }, a = {}, o = {}, i = {}, s = U(t, "Placemark"), l = U(t, "Style"), u = U(t, "StyleMap");
  for (const c of Array.from(l)) {
    const p = fn(e !== void 0 ? e(c) : cn(c)).toString(16);
    a[`#${Te(c, "id")}`] = p, o[p] = c;
  }
  for (const c of Array.from(u)) {
    a[`#${Te(c, "id")}`] = fn(e !== void 0 ? e(c) : cn(c)).toString(16);
    const p = U(c, "Pair"), m = {};
    for (const f of Array.from(p)) m[_(k(f, "key")) ?? ""] = _(k(f, "styleUrl"));
    i[`#${Te(c, "id")}`] = m;
  }
  for (const c of Array.from(s)) n.features = n.features.concat(Hs(c, a, o, i));
  return n;
}
function pn(r) {
  if (r === null) return ["#000000", 1];
  let e = "", t = 1, n = r;
  return n.substring(0, 1) === "#" && (n = n.substring(1)), (n.length === 6 || n.length === 3) && (e = n), n.length === 8 && (t = Number.parseInt(n.substring(0, 2), 16) / 255, e = `#${n.substring(6, 8)}${n.substring(4, 6)}${n.substring(2, 4)}`), [e ?? "#000000", t ?? 1];
}
function Vs(r) {
  return da(r.split(" "));
}
function Gs(r) {
  let e = U(r, "coord");
  const t = [], n = [];
  e.length === 0 && (e = U(r, "gx:coord"));
  for (const o of Array.from(e)) t.push(Vs(_(o) ?? ""));
  const a = U(r, "when");
  for (const o of Array.from(a)) n.push(_(o));
  return {
    coords: t,
    times: n
  };
}
function st(r) {
  const e = ["Polygon", "LineString", "Point", "Track", "gx:Track"];
  let t, n, a, o, i;
  const s = [], l = [];
  if (k(r, "MultiGeometry") !== null) return st(k(r, "MultiGeometry"));
  if (k(r, "MultiTrack") !== null) return st(k(r, "MultiTrack"));
  if (k(r, "gx:MultiTrack") !== null) return st(k(r, "gx:MultiTrack"));
  for (a = 0; a < e.length; a++) if (n = U(r, e[a]), n) {
    for (o = 0; o < n.length; o++) if (t = n[o], e[a] === "Point") s.push({
      type: "Point",
      coordinates: ya(_(k(t, "coordinates")) ?? "")
    });
    else if (e[a] === "LineString") s.push({
      type: "LineString",
      coordinates: yn(_(k(t, "coordinates")) ?? "")
    });
    else if (e[a] === "Polygon") {
      const u = U(t, "LinearRing"), c = [];
      for (i = 0; i < u.length; i++) c.push(yn(_(k(u[i], "coordinates")) ?? ""));
      s.push({
        type: "Polygon",
        coordinates: c
      });
    } else if (e[a] === "Track" || e[a] === "gx:Track") {
      const u = Gs(t);
      s.push({
        type: "LineString",
        coordinates: u.coords
      }), u.times.length && l.push(u.times);
    }
  }
  return {
    geoms: s,
    coordTimes: l
  };
}
function Hs(r, e, t, n) {
  const a = st(r), o = {}, i = _(k(r, "name")), s = _(k(r, "address")), l = _(k(r, "description")), u = k(r, "TimeSpan"), c = k(r, "TimeStamp"), p = k(r, "ExtendedData"), m = k(r, "visibility");
  let f, d = _(k(r, "styleUrl")), y = k(r, "LineStyle"), v = k(r, "PolyStyle");
  if (!a.geoms.length) return [];
  if (i && (o.name = i), s && (o.address = s), d) {
    d[0] !== "#" && (d = `#${d}`), o.styleUrl = d, e[d] && (o.styleHash = e[d]), n[d] && (o.styleMapHash = n[d], o.styleHash = e[n[d].normal ?? ""]);
    const b = t[o.styleHash ?? ""];
    if (b) {
      y || (y = k(b, "LineStyle")), v || (v = k(b, "PolyStyle"));
      const T = k(b, "IconStyle");
      if (T) {
        const j = k(T, "Icon");
        if (j) {
          const R = _(k(j, "href"));
          R && (o.icon = R);
        }
      }
    }
  }
  if (l && (o.description = l), u) {
    const b = _(k(u, "begin")), T = _(k(u, "end"));
    b && T && (o.timespan = {
      begin: b,
      end: T
    });
  }
  if (c !== null && (o.timestamp = _(k(c, "when")) ?? (/* @__PURE__ */ new Date()).toISOString()), y !== null) {
    const b = pn(_(k(y, "color"))), T = b[0], j = b[1], R = Number.parseFloat(_(k(y, "width")) ?? "");
    T && (o.stroke = T), Number.isNaN(j) || (o["stroke-opacity"] = j), Number.isNaN(R) || (o["stroke-width"] = R);
  }
  if (v) {
    const b = pn(_(k(v, "color"))), T = b[0], j = b[1], R = _(k(v, "fill")), ae = _(k(v, "outline"));
    T && (o.fill = T), Number.isNaN(j) || (o["fill-opacity"] = j), R && (o["fill-opacity"] = R === "1" ? o["fill-opacity"] || 1 : 0), ae && (o["stroke-opacity"] = ae === "1" ? o["stroke-opacity"] || 1 : 0);
  }
  if (p) {
    const b = U(p, "Data"), T = U(p, "SimpleData");
    for (f = 0; f < b.length; f++) o[b[f].getAttribute("name") ?? ""] = _(k(b[f], "value")) ?? "";
    for (f = 0; f < T.length; f++) o[T[f].getAttribute("name") ?? ""] = _(T[f]) ?? "";
  }
  m !== null && (o.visibility = _(m) ?? ""), a.coordTimes.length !== 0 && (o.coordTimes = a.coordTimes.length === 1 ? a.coordTimes[0] : a.coordTimes);
  const w = {
    type: "Feature",
    geometry: a.geoms.length === 1 ? a.geoms[0] : {
      type: "GeometryCollection",
      geometries: a.geoms
    },
    properties: o
  };
  return Te(r, "id") && (w.id = Te(r, "id") ?? void 0), [w];
}
function pa(r, e) {
  const t = U(r, e), n = [], a = [];
  let o = [];
  const i = t.length;
  if (!(i < 2)) {
    for (let s = 0; s < i; s++) {
      const l = ma(t[s]);
      n.push(l.coordinates), l.time && a.push(l.time), (l.heartRate || o.length) && (o.length === 0 && (o = new Array(s).fill(null)), o.push(l.heartRate));
    }
    return {
      line: n,
      times: a,
      heartRates: o
    };
  }
}
function Ks(r) {
  const e = U(r, "trkseg"), t = [], n = [], a = [];
  let o;
  for (let s = 0; s < e.length; s++) if (o = pa(e[s], "trkpt"), o !== void 0 && (o.line && t.push(o.line), o.times && o.times.length && n.push(o.times), a.length || o.heartRates && o.heartRates.length)) {
    if (!a.length) for (let l = 0; l < s; l++) a.push(new Array(t[l].length).fill(null));
    o.heartRates && o.heartRates.length ? a.push(o.heartRates) : a.push(new Array(o.line.length).fill(null));
  }
  if (t.length === 0) return;
  const i = __spreadValues(__spreadValues({}, Tr(r)), fa(k(r, "extensions")));
  return n.length !== 0 && (i.coordTimes = t.length === 1 ? n[0] : n), a.length !== 0 && (i.heartRates = t.length === 1 ? a[0] : a), t.length === 1 ? {
    type: "Feature",
    properties: i,
    geometry: {
      type: "LineString",
      coordinates: t[0]
    }
  } : {
    type: "Feature",
    properties: i,
    geometry: {
      type: "MultiLineString",
      coordinates: t
    }
  };
}
function Ws(r) {
  const e = pa(r, "rtept");
  return e === void 0 ? void 0 : {
    type: "Feature",
    properties: __spreadValues(__spreadValues({}, Tr(r)), fa(k(r, "extensions"))),
    geometry: {
      type: "LineString",
      coordinates: e.line
    }
  };
}
function Zs(r) {
  return {
    type: "Feature",
    properties: __spreadValues(__spreadValues({}, Tr(r)), rr(r, ["sym"])),
    geometry: {
      type: "Point",
      coordinates: ma(r).coordinates
    }
  };
}
function fa(r) {
  const e = {};
  if (r) {
    const t = k(r, "line");
    if (t) {
      const n = _(k(t, "color")), a = Number.parseFloat(_(k(t, "opacity")) ?? "0"), o = Number.parseFloat(_(k(t, "width")) ?? "0");
      n && (e.stroke = n), Number.isNaN(a) || (e["stroke-opacity"] = a), Number.isNaN(o) || (e["stroke-width"] = o * 96 / 25.4);
    }
  }
  return e;
}
function Tr(r) {
  const e = rr(r, ["name", "cmt", "desc", "type", "time", "keywords"]), t = U(r, "link");
  if (t.length !== 0) {
    e.links = [];
    for (const n of Array.from(t)) {
      const a = __spreadValues({
        href: Te(n, "href")
      }, rr(n, ["text", "type"]));
      e.links.push(a);
    }
  }
  return e;
}
function fn(r) {
  let e = 0;
  if (!r || !r.length) return e;
  for (let t = 0; t < r.length; t++) e = (e << 5) - e + r.charCodeAt(t) | 0;
  return e;
}
function U(r, e) {
  return r.getElementsByTagName(e);
}
function Te(r, e) {
  return r.getAttribute(e);
}
function dn(r, e) {
  return Number.parseFloat(Te(r, e) ?? "0");
}
function k(r, e) {
  const t = U(r, e);
  return t.length ? t[0] : null;
}
function Js(r) {
  return r.normalize && r.normalize(), r;
}
function da(r) {
  return r.map(Number.parseFloat).map((e) => Number.isNaN(e) ? null : e);
}
function _(r) {
  return r && Js(r), r && r.textContent;
}
function rr(r, e) {
  const t = {};
  let n, a;
  for (a = 0; a < e.length; a++) n = k(r, e[a]), n && (t[e[a]] = _(n) ?? "");
  return t;
}
function ya(r) {
  return da(r.replace(/\s*/g, "").split(","));
}
function yn(r) {
  const e = r.replace(/^\s*|\s*$/g, "").split(/\s+/), t = [];
  for (const n of e) t.push(ya(n));
  return t;
}
function ma(r) {
  const e = [dn(r, "lon"), dn(r, "lat")], t = k(r, "ele"), n = k(r, "gpxtpx:hr") || k(r, "hr"), a = k(r, "time");
  let o;
  return t && (o = Number.parseFloat(_(t) ?? "0"), Number.isNaN(o) || e.push(o)), {
    coordinates: e,
    time: a ? _(a) : null,
    heartRate: n !== null ? Number.parseFloat(_(n) ?? "0") : null
  };
}
function Ys(r) {
  let e = r;
  try {
    typeof e == "string" && (e = Ar(e));
  } catch {
    return null;
  }
  try {
    return ua(e);
  } catch {
  }
  try {
    return ca(e);
  } catch {
  }
  return null;
}
function ot(r) {
  const e = r.toString(16);
  return e.length === 1 ? `0${e}` : e;
}
function Xs(r) {
  return `#${ot(r[0])}${ot(r[1])}${ot(r[2])}${r.length === 4 ? ot(r[3]) : ""}`;
}
var x = class _x extends Array {
  constructor(t = {}) {
    super();
    L(this, "min", 0);
    L(this, "max", 1);
    "min" in t && (this.min = t.min), "max" in t && (this.max = t.max), "stops" in t && this.setStops(t.stops, {
      clone: false
    });
  }
  /**
   * Converts a array-definition color ramp definition into a usable ColorRamp instance.
   * Note: units are not converted and may need to to be converted beforehand (eg. kelvin to centigrade)
   * @param cr
   * @returns
   */
  static fromArrayDefinition(t) {
    return new _x({
      stops: t.map((n) => ({
        value: n[0],
        color: n[1]
      }))
    });
  }
  setStops(t, n = {
    clone: true
  }) {
    const a = n.clone ? this.clone() : this;
    a.length = 0;
    let o = Number.POSITIVE_INFINITY, i = Number.NEGATIVE_INFINITY;
    for (let s = 0; s < t.length; s += 1) o = Math.min(o, t[s].value), i = Math.max(i, t[s].value), a.push({
      value: t[s].value,
      color: t[s].color.slice()
      // we want to make sure we do a deep copy and not a reference
    });
    return a.sort((s, l) => s.value < l.value ? -1 : 1), this.min = o, this.max = i, a;
  }
  scale(t, n, a = {
    clone: true
  }) {
    const o = a.clone, i = this[0].value, l = this.at(-1).value - i, u = n - t, c = [];
    for (let p = 0; p < this.length; p += 1) {
      const d = (this[p].value - i) / l * u + t;
      o ? c.push({
        value: d,
        color: this[p].color.slice()
      }) : this[p].value = d;
    }
    return o ? new _x({
      stops: c
    }) : this;
  }
  // for some reason, I had to reimplement this
  at(t) {
    return t < 0 ? this[this.length + t] : this[t];
  }
  clone() {
    return new _x({
      stops: this.getRawColorStops()
    });
  }
  getRawColorStops() {
    const t = [];
    for (let n = 0; n < this.length; n += 1) t.push({
      value: this[n].value,
      color: this[n].color
    });
    return t;
  }
  reverse(t = {
    clone: true
  }) {
    const n = t.clone ? this.clone() : this;
    for (let a = 0; a < ~~(n.length / 2); a += 1) {
      const o = n[a].color;
      n[a].color = n.at(-(a + 1)).color, n.at(-(a + 1)).color = o;
    }
    return n;
  }
  getBounds() {
    return {
      min: this.min,
      max: this.max
    };
  }
  getColor(t, n = {
    smooth: true
  }) {
    if (t <= this[0].value) return this[0].color;
    if (t >= this.at(-1).value) return this.at(-1).color;
    for (let a = 0; a < this.length - 1; a += 1) {
      if (t > this[a + 1].value) continue;
      const o = this[a].color;
      if (!n.smooth) return o.slice();
      const i = this[a].value, s = this[a + 1].value, l = this[a + 1].color, u = (s - t) / (s - i);
      return o.map((c, p) => Math.round(c * u + l[p] * (1 - u)));
    }
    return [0, 0, 0];
  }
  /**
   * Get the color as an hexadecimal string
   */
  getColorHex(t, n = {
    smooth: true,
    withAlpha: false
  }) {
    return Xs(this.getColor(t, n));
  }
  /**
   * Get the color of the color ramp at a relative position in [0, 1]
   */
  getColorRelative(t, n = {
    smooth: true
  }) {
    const a = this.getBounds();
    return this.getColor(a.min + t * (a.max - a.min), n);
  }
  getCanvasStrip(t = {
    horizontal: true,
    size: 512,
    smooth: true
  }) {
    const n = document.createElement("canvas");
    n.width = t.horizontal ? t.size : 1, n.height = t.horizontal ? 1 : t.size;
    const a = n.getContext("2d");
    if (!a) throw new Error("Canvs context is missing");
    const o = a.getImageData(0, 0, n.width, n.height), i = o.data, s = t.size, l = this[0].value, p = (this.at(-1).value - l) / s;
    for (let m = 0; m < s; m += 1) {
      const f = this.getColor(l + m * p, {
        smooth: t.smooth
      });
      i[m * 4] = f[0], i[m * 4 + 1] = f[1], i[m * 4 + 2] = f[2], i[m * 4 + 3] = f.length > 3 ? f[3] : 255;
    }
    return a.putImageData(o, 0, 0), n;
  }
  /**
   * Apply a non-linear ressampling. This will create a new instance of ColorRamp with the same bounds.
   */
  resample(t, n = 15) {
    const a = this.getBounds(), o = this.scale(0, 1), i = 1 / (n - 1);
    let s;
    if (t === "ease-in-square") s = Array.from({
      length: n
    }, (c, p) => {
      const m = p * i, f = m ** 2, d = o.getColor(f);
      return {
        value: m,
        color: d
      };
    });
    else if (t === "ease-out-square") s = Array.from({
      length: n
    }, (c, p) => {
      const m = p * i, f = 1 - (1 - m) ** 2, d = o.getColor(f);
      return {
        value: m,
        color: d
      };
    });
    else if (t === "ease-out-sqrt") s = Array.from({
      length: n
    }, (c, p) => {
      const m = p * i, f = m ** 0.5, d = o.getColor(f);
      return {
        value: m,
        color: d
      };
    });
    else if (t === "ease-in-sqrt") s = Array.from({
      length: n
    }, (c, p) => {
      const m = p * i, f = 1 - (1 - m) ** 0.5, d = o.getColor(f);
      return {
        value: m,
        color: d
      };
    });
    else if (t === "ease-out-exp") s = Array.from({
      length: n
    }, (c, p) => {
      const m = p * i, f = 1 - 2 ** (-10 * m), d = o.getColor(f);
      return {
        value: m,
        color: d
      };
    });
    else if (t === "ease-in-exp") s = Array.from({
      length: n
    }, (c, p) => {
      const m = p * i, f = 2 ** (10 * m - 10), d = o.getColor(f);
      return {
        value: m,
        color: d
      };
    });
    else throw new Error("Invalid ressampling method.");
    return new _x({
      stops: s
    }).scale(a.min, a.max);
  }
  /**
   * Makes a clone of this color ramp that is fully transparant at the begining of their range
   */
  transparentStart() {
    const t = this.getRawColorStops();
    t.unshift({
      value: t[0].value,
      color: t[0].color.slice()
    }), t[1].value += 1e-3;
    for (const n of t) n.color.length === 3 && n.color.push(255);
    return t[0].color[3] = 0, new _x({
      stops: t
    });
  }
  /**
   * Check if this color ramp has a transparent start
   */
  hasTransparentStart() {
    return this[0].color.length === 4 && this[0].color[3] === 0;
  }
};
var ha = {
  /**
   * A fully transparent [0, 0, 0, 0] colorramp to hide data.
   * Defined in interval [0, 1], without unit.
   */
  NULL: new x({
    stops: [{
      value: 0,
      color: [0, 0, 0, 0]
    }, {
      value: 1,
      color: [0, 0, 0, 0]
    }]
  }),
  GRAY: new x({
    stops: [{
      value: 0,
      color: [0, 0, 0]
    }, {
      value: 1,
      color: [255, 255, 255]
    }]
  }),
  /**
   * Classic jet color ramp.
   * Defined in interval [0, 1], without unit.
   */
  JET: new x({
    stops: [{
      value: 0,
      color: [0, 0, 131]
    }, {
      value: 0.125,
      color: [0, 60, 170]
    }, {
      value: 0.375,
      color: [5, 255, 255]
    }, {
      value: 0.625,
      color: [255, 255, 0]
    }, {
      value: 0.875,
      color: [250, 0, 0]
    }, {
      value: 1,
      color: [128, 0, 0]
    }]
  }),
  /**
   * Classic HSV color ramp (hue, saturation, value).
   * Defined in interval [0, 1], without unit.
   */
  HSV: new x({
    stops: [{
      value: 0,
      color: [255, 0, 0]
    }, {
      value: 0.169,
      color: [253, 255, 2]
    }, {
      value: 0.173,
      color: [247, 255, 2]
    }, {
      value: 0.337,
      color: [0, 252, 4]
    }, {
      value: 0.341,
      color: [0, 252, 10]
    }, {
      value: 0.506,
      color: [1, 249, 255]
    }, {
      value: 0.671,
      color: [2, 0, 253]
    }, {
      value: 0.675,
      color: [8, 0, 253]
    }, {
      value: 0.839,
      color: [255, 0, 251]
    }, {
      value: 0.843,
      color: [255, 0, 245]
    }, {
      value: 1,
      color: [255, 0, 6]
    }]
  }),
  /**
   * Classic hot color ramp.
   * Defined in interval [0, 1], without unit.
   */
  HOT: new x({
    stops: [{
      value: 0,
      color: [0, 0, 0]
    }, {
      value: 0.3,
      color: [230, 0, 0]
    }, {
      value: 0.6,
      color: [255, 210, 0]
    }, {
      value: 1,
      color: [255, 255, 255]
    }]
  }),
  /**
   * Classic spring color ramp.
   * Defined in interval [0, 1], without unit.
   */
  SPRING: new x({
    stops: [{
      value: 0,
      color: [255, 0, 255]
    }, {
      value: 1,
      color: [255, 255, 0]
    }]
  }),
  /**
   * Classic summer color ramp.
   * Defined in interval [0, 1], without unit.
   */
  SUMMER: new x({
    stops: [{
      value: 0,
      color: [0, 128, 102]
    }, {
      value: 1,
      color: [255, 255, 102]
    }]
  }),
  /**
   * Classic autommn color ramp.
   * Defined in interval [0, 1], without unit.
   */
  AUTOMN: new x({
    stops: [{
      value: 0,
      color: [255, 0, 0]
    }, {
      value: 1,
      color: [255, 255, 0]
    }]
  }),
  /**
   * Classic winter color ramp.
   * Defined in interval [0, 1], without unit.
   */
  WINTER: new x({
    stops: [{
      value: 0,
      color: [0, 0, 255]
    }, {
      value: 1,
      color: [0, 255, 128]
    }]
  }),
  /**
   * Classic bone color ramp.
   * Defined in interval [0, 1], without unit.
   */
  BONE: new x({
    stops: [{
      value: 0,
      color: [0, 0, 0]
    }, {
      value: 0.376,
      color: [84, 84, 116]
    }, {
      value: 0.753,
      color: [169, 200, 200]
    }, {
      value: 1,
      color: [255, 255, 255]
    }]
  }),
  /**
   * Classic copper color ramp.
   * Defined in interval [0, 1], without unit.
   */
  COPPER: new x({
    stops: [{
      value: 0,
      color: [0, 0, 0]
    }, {
      value: 0.804,
      color: [255, 160, 102]
    }, {
      value: 1,
      color: [255, 199, 127]
    }]
  }),
  /**
   * Classic greys color ramp.
   * Defined in interval [0, 1], without unit.
   */
  GREYS: new x({
    stops: [{
      value: 0,
      color: [0, 0, 0]
    }, {
      value: 1,
      color: [255, 255, 255]
    }]
  }),
  /**
   * Classic yignbu color ramp (blue to light yellow).
   * Defined in interval [0, 1], without unit.
   */
  YIGNBU: new x({
    stops: [{
      value: 0,
      color: [8, 29, 88]
    }, {
      value: 0.125,
      color: [37, 52, 148]
    }, {
      value: 0.25,
      color: [34, 94, 168]
    }, {
      value: 0.375,
      color: [29, 145, 192]
    }, {
      value: 0.5,
      color: [65, 182, 196]
    }, {
      value: 0.625,
      color: [127, 205, 187]
    }, {
      value: 0.75,
      color: [199, 233, 180]
    }, {
      value: 0.875,
      color: [237, 248, 217]
    }, {
      value: 1,
      color: [255, 255, 217]
    }]
  }),
  /**
   * Classic greens color ramp.
   * Defined in interval [0, 1], without unit.
   */
  GREENS: new x({
    stops: [{
      value: 0,
      color: [0, 68, 27]
    }, {
      value: 0.125,
      color: [0, 109, 44]
    }, {
      value: 0.25,
      color: [35, 139, 69]
    }, {
      value: 0.375,
      color: [65, 171, 93]
    }, {
      value: 0.5,
      color: [116, 196, 118]
    }, {
      value: 0.625,
      color: [161, 217, 155]
    }, {
      value: 0.75,
      color: [199, 233, 192]
    }, {
      value: 0.875,
      color: [229, 245, 224]
    }, {
      value: 1,
      color: [247, 252, 245]
    }]
  }),
  /**
   * Classic yiorrd color ramp (red to light yellow).
   * Defined in interval [0, 1], without unit.
   */
  YIORRD: new x({
    stops: [{
      value: 0,
      color: [128, 0, 38]
    }, {
      value: 0.125,
      color: [189, 0, 38]
    }, {
      value: 0.25,
      color: [227, 26, 28]
    }, {
      value: 0.375,
      color: [252, 78, 42]
    }, {
      value: 0.5,
      color: [253, 141, 60]
    }, {
      value: 0.625,
      color: [254, 178, 76]
    }, {
      value: 0.75,
      color: [254, 217, 118]
    }, {
      value: 0.875,
      color: [255, 237, 160]
    }, {
      value: 1,
      color: [255, 255, 204]
    }]
  }),
  /**
   * Classic blue-red color ramp.
   * Defined in interval [0, 1], without unit.
   */
  BLUERED: new x({
    stops: [{
      value: 0,
      color: [0, 0, 255]
    }, {
      value: 1,
      color: [255, 0, 0]
    }]
  }),
  /**
   * Classic rdbu color ramp.
   * Defined in interval [0, 1], without unit.
   */
  RDBU: new x({
    stops: [{
      value: 0,
      color: [5, 10, 172]
    }, {
      value: 0.35,
      color: [106, 137, 247]
    }, {
      value: 0.5,
      color: [190, 190, 190]
    }, {
      value: 0.6,
      color: [220, 170, 132]
    }, {
      value: 0.7,
      color: [230, 145, 90]
    }, {
      value: 1,
      color: [178, 10, 28]
    }]
  }),
  /**
   * Classic picnic color ramp.
   * Defined in interval [0, 1], without unit.
   */
  PICNIC: new x({
    stops: [{
      value: 0,
      color: [0, 0, 255]
    }, {
      value: 0.1,
      color: [51, 153, 255]
    }, {
      value: 0.2,
      color: [102, 204, 255]
    }, {
      value: 0.3,
      color: [153, 204, 255]
    }, {
      value: 0.4,
      color: [204, 204, 255]
    }, {
      value: 0.5,
      color: [255, 255, 255]
    }, {
      value: 0.6,
      color: [255, 204, 255]
    }, {
      value: 0.7,
      color: [255, 153, 255]
    }, {
      value: 0.8,
      color: [255, 102, 204]
    }, {
      value: 0.9,
      color: [255, 102, 102]
    }, {
      value: 1,
      color: [255, 0, 0]
    }]
  }),
  /**
   * Classic rainbow color ramp.
   * Defined in interval [0, 1], without unit.
   */
  RAINBOW: new x({
    stops: [{
      value: 0,
      color: [150, 0, 90]
    }, {
      value: 0.125,
      color: [0, 0, 200]
    }, {
      value: 0.25,
      color: [0, 25, 255]
    }, {
      value: 0.375,
      color: [0, 152, 255]
    }, {
      value: 0.5,
      color: [44, 255, 150]
    }, {
      value: 0.625,
      color: [151, 255, 0]
    }, {
      value: 0.75,
      color: [255, 234, 0]
    }, {
      value: 0.875,
      color: [255, 111, 0]
    }, {
      value: 1,
      color: [255, 0, 0]
    }]
  }),
  /**
   * Classic Portland color ramp.
   * Defined in interval [0, 1], without unit.
   */
  PORTLAND: new x({
    stops: [{
      value: 0,
      color: [12, 51, 131]
    }, {
      value: 0.25,
      color: [10, 136, 186]
    }, {
      value: 0.5,
      color: [242, 211, 56]
    }, {
      value: 0.75,
      color: [242, 143, 56]
    }, {
      value: 1,
      color: [217, 30, 30]
    }]
  }),
  /**
   * Classic blackbody color ramp.
   * Defined in interval [0, 1], without unit.
   */
  BLACKBODY: new x({
    stops: [{
      value: 0,
      color: [0, 0, 0]
    }, {
      value: 0.2,
      color: [230, 0, 0]
    }, {
      value: 0.4,
      color: [230, 210, 0]
    }, {
      value: 0.7,
      color: [255, 255, 255]
    }, {
      value: 1,
      color: [160, 200, 255]
    }]
  }),
  /**
   * Classic earth color ramp.
   * Defined in interval [0, 1], without unit.
   */
  EARTH: new x({
    stops: [{
      value: 0,
      color: [0, 0, 130]
    }, {
      value: 0.1,
      color: [0, 180, 180]
    }, {
      value: 0.2,
      color: [40, 210, 40]
    }, {
      value: 0.4,
      color: [230, 230, 50]
    }, {
      value: 0.6,
      color: [120, 70, 20]
    }, {
      value: 1,
      color: [255, 255, 255]
    }]
  }),
  /**
   * Classic electric color ramp.
   * Defined in interval [0, 1], without unit.
   */
  ELECTRIC: new x({
    stops: [{
      value: 0,
      color: [0, 0, 0]
    }, {
      value: 0.15,
      color: [30, 0, 100]
    }, {
      value: 0.4,
      color: [120, 0, 100]
    }, {
      value: 0.6,
      color: [160, 90, 0]
    }, {
      value: 0.8,
      color: [230, 200, 0]
    }, {
      value: 1,
      color: [255, 250, 220]
    }]
  }),
  /**
   * Classic viridis color ramp.
   * Defined in interval [0, 1], without unit.
   */
  VIRIDIS: new x({
    stops: [{
      value: 0,
      color: [68, 1, 84]
    }, {
      value: 0.13,
      color: [71, 44, 122]
    }, {
      value: 0.25,
      color: [59, 81, 139]
    }, {
      value: 0.38,
      color: [44, 113, 142]
    }, {
      value: 0.5,
      color: [33, 144, 141]
    }, {
      value: 0.63,
      color: [39, 173, 129]
    }, {
      value: 0.75,
      color: [92, 200, 99]
    }, {
      value: 0.88,
      color: [170, 220, 50]
    }, {
      value: 1,
      color: [253, 231, 37]
    }]
  }),
  /**
   * Classic inferno color ramp.
   * Defined in interval [0, 1], without unit.
   */
  INFERNO: new x({
    stops: [{
      value: 0,
      color: [0, 0, 4]
    }, {
      value: 0.13,
      color: [31, 12, 72]
    }, {
      value: 0.25,
      color: [85, 15, 109]
    }, {
      value: 0.38,
      color: [136, 34, 106]
    }, {
      value: 0.5,
      color: [186, 54, 85]
    }, {
      value: 0.63,
      color: [227, 89, 51]
    }, {
      value: 0.75,
      color: [249, 140, 10]
    }, {
      value: 0.88,
      color: [249, 201, 50]
    }, {
      value: 1,
      color: [252, 255, 164]
    }]
  }),
  /**
   * Classic magma color ramp.
   * Defined in interval [0, 1], without unit.
   */
  MAGMA: new x({
    stops: [{
      value: 0,
      color: [0, 0, 4]
    }, {
      value: 0.13,
      color: [28, 16, 68]
    }, {
      value: 0.25,
      color: [79, 18, 123]
    }, {
      value: 0.38,
      color: [129, 37, 129]
    }, {
      value: 0.5,
      color: [181, 54, 122]
    }, {
      value: 0.63,
      color: [229, 80, 100]
    }, {
      value: 0.75,
      color: [251, 135, 97]
    }, {
      value: 0.88,
      color: [254, 194, 135]
    }, {
      value: 1,
      color: [252, 253, 191]
    }]
  }),
  /**
   * Classic plasma color ramp.
   * Defined in interval [0, 1], without unit.
   */
  PLASMA: new x({
    stops: [{
      value: 0,
      color: [13, 8, 135]
    }, {
      value: 0.13,
      color: [75, 3, 161]
    }, {
      value: 0.25,
      color: [125, 3, 168]
    }, {
      value: 0.38,
      color: [168, 34, 150]
    }, {
      value: 0.5,
      color: [203, 70, 121]
    }, {
      value: 0.63,
      color: [229, 107, 93]
    }, {
      value: 0.75,
      color: [248, 148, 65]
    }, {
      value: 0.88,
      color: [253, 195, 40]
    }, {
      value: 1,
      color: [240, 249, 33]
    }]
  }),
  /**
   * Classic warm color ramp.
   * Defined in interval [0, 1], without unit.
   */
  WARM: new x({
    stops: [{
      value: 0,
      color: [125, 0, 179]
    }, {
      value: 0.13,
      color: [172, 0, 187]
    }, {
      value: 0.25,
      color: [219, 0, 170]
    }, {
      value: 0.38,
      color: [255, 0, 130]
    }, {
      value: 0.5,
      color: [255, 63, 74]
    }, {
      value: 0.63,
      color: [255, 123, 0]
    }, {
      value: 0.75,
      color: [234, 176, 0]
    }, {
      value: 0.88,
      color: [190, 228, 0]
    }, {
      value: 1,
      color: [147, 255, 0]
    }]
  }),
  /**
   * Classic cool color ramp.
   * Defined in interval [0, 1], without unit.
   */
  COOL: new x({
    stops: [{
      value: 0,
      color: [125, 0, 179]
    }, {
      value: 0.13,
      color: [116, 0, 218]
    }, {
      value: 0.25,
      color: [98, 74, 237]
    }, {
      value: 0.38,
      color: [68, 146, 231]
    }, {
      value: 0.5,
      color: [0, 204, 197]
    }, {
      value: 0.63,
      color: [0, 247, 146]
    }, {
      value: 0.75,
      color: [0, 255, 88]
    }, {
      value: 0.88,
      color: [40, 255, 8]
    }, {
      value: 1,
      color: [147, 255, 0]
    }]
  }),
  /**
   * Classic rainboz soft color ramp.
   * Defined in interval [0, 1], without unit.
   */
  RAINBOW_SOFT: new x({
    stops: [{
      value: 0,
      color: [125, 0, 179]
    }, {
      value: 0.1,
      color: [199, 0, 180]
    }, {
      value: 0.2,
      color: [255, 0, 121]
    }, {
      value: 0.3,
      color: [255, 108, 0]
    }, {
      value: 0.4,
      color: [222, 194, 0]
    }, {
      value: 0.5,
      color: [150, 255, 0]
    }, {
      value: 0.6,
      color: [0, 255, 55]
    }, {
      value: 0.7,
      color: [0, 246, 150]
    }, {
      value: 0.8,
      color: [50, 167, 222]
    }, {
      value: 0.9,
      color: [103, 51, 235]
    }, {
      value: 1,
      color: [124, 0, 186]
    }]
  }),
  /**
   * Classic bathymetry color ramp.
   * Defined in interval [0, 1], without unit.
   */
  BATHYMETRY: new x({
    stops: [{
      value: 0,
      color: [40, 26, 44]
    }, {
      value: 0.13,
      color: [59, 49, 90]
    }, {
      value: 0.25,
      color: [64, 76, 139]
    }, {
      value: 0.38,
      color: [63, 110, 151]
    }, {
      value: 0.5,
      color: [72, 142, 158]
    }, {
      value: 0.63,
      color: [85, 174, 163]
    }, {
      value: 0.75,
      color: [120, 206, 163]
    }, {
      value: 0.88,
      color: [187, 230, 172]
    }, {
      value: 1,
      color: [253, 254, 204]
    }]
  }),
  /**
   * Classic cdom color ramp.
   * Defined in interval [0, 1], without unit.
   */
  CDOM: new x({
    stops: [{
      value: 0,
      color: [47, 15, 62]
    }, {
      value: 0.13,
      color: [87, 23, 86]
    }, {
      value: 0.25,
      color: [130, 28, 99]
    }, {
      value: 0.38,
      color: [171, 41, 96]
    }, {
      value: 0.5,
      color: [206, 67, 86]
    }, {
      value: 0.63,
      color: [230, 106, 84]
    }, {
      value: 0.75,
      color: [242, 149, 103]
    }, {
      value: 0.88,
      color: [249, 193, 135]
    }, {
      value: 1,
      color: [254, 237, 176]
    }]
  }),
  /**
   * Classic chlorophyll color ramp.
   * Defined in interval [0, 1], without unit.
   */
  CHLOROPHYLL: new x({
    stops: [{
      value: 0,
      color: [18, 36, 20]
    }, {
      value: 0.13,
      color: [25, 63, 41]
    }, {
      value: 0.25,
      color: [24, 91, 59]
    }, {
      value: 0.38,
      color: [13, 119, 72]
    }, {
      value: 0.5,
      color: [18, 148, 80]
    }, {
      value: 0.63,
      color: [80, 173, 89]
    }, {
      value: 0.75,
      color: [132, 196, 122]
    }, {
      value: 0.88,
      color: [175, 221, 162]
    }, {
      value: 1,
      color: [215, 249, 208]
    }]
  }),
  /**
   * Classic density color ramp.
   * Defined in interval [0, 1], without unit.
   */
  DENSITY: new x({
    stops: [{
      value: 0,
      color: [54, 14, 36]
    }, {
      value: 0.13,
      color: [89, 23, 80]
    }, {
      value: 0.25,
      color: [110, 45, 132]
    }, {
      value: 0.38,
      color: [120, 77, 178]
    }, {
      value: 0.5,
      color: [120, 113, 213]
    }, {
      value: 0.63,
      color: [115, 151, 228]
    }, {
      value: 0.75,
      color: [134, 185, 227]
    }, {
      value: 0.88,
      color: [177, 214, 227]
    }, {
      value: 1,
      color: [230, 241, 241]
    }]
  }),
  /**
   * Classic freesurface blue color ramp.
   * Defined in interval [0, 1], without unit.
   */
  FREESURFACE_BLUE: new x({
    stops: [{
      value: 0,
      color: [30, 4, 110]
    }, {
      value: 0.13,
      color: [47, 14, 176]
    }, {
      value: 0.25,
      color: [41, 45, 236]
    }, {
      value: 0.38,
      color: [25, 99, 212]
    }, {
      value: 0.5,
      color: [68, 131, 200]
    }, {
      value: 0.63,
      color: [114, 156, 197]
    }, {
      value: 0.75,
      color: [157, 181, 203]
    }, {
      value: 0.88,
      color: [200, 208, 216]
    }, {
      value: 1,
      color: [241, 237, 236]
    }]
  }),
  /**
   * Classic freesurface red color ramp.
   * Defined in interval [0, 1], without unit.
   */
  FREESURFACE_RED: new x({
    stops: [{
      value: 0,
      color: [60, 9, 18]
    }, {
      value: 0.13,
      color: [100, 17, 27]
    }, {
      value: 0.25,
      color: [142, 20, 29]
    }, {
      value: 0.38,
      color: [177, 43, 27]
    }, {
      value: 0.5,
      color: [192, 87, 63]
    }, {
      value: 0.63,
      color: [205, 125, 105]
    }, {
      value: 0.75,
      color: [216, 162, 148]
    }, {
      value: 0.88,
      color: [227, 199, 193]
    }, {
      value: 1,
      color: [241, 237, 236]
    }]
  }),
  /**
   * Classic oxygen color ramp.
   * Defined in interval [0, 1], without unit.
   */
  OXYGEN: new x({
    stops: [{
      value: 0,
      color: [64, 5, 5]
    }, {
      value: 0.13,
      color: [106, 6, 15]
    }, {
      value: 0.25,
      color: [144, 26, 7]
    }, {
      value: 0.38,
      color: [168, 64, 3]
    }, {
      value: 0.5,
      color: [188, 100, 4]
    }, {
      value: 0.63,
      color: [206, 136, 11]
    }, {
      value: 0.75,
      color: [220, 174, 25]
    }, {
      value: 0.88,
      color: [231, 215, 44]
    }, {
      value: 1,
      color: [248, 254, 105]
    }]
  }),
  /**
   * Classic par color ramp.
   * Defined in interval [0, 1], without unit.
   */
  PAR: new x({
    stops: [{
      value: 0,
      color: [51, 20, 24]
    }, {
      value: 0.13,
      color: [90, 32, 35]
    }, {
      value: 0.25,
      color: [129, 44, 34]
    }, {
      value: 0.38,
      color: [159, 68, 25]
    }, {
      value: 0.5,
      color: [182, 99, 19]
    }, {
      value: 0.63,
      color: [199, 134, 22]
    }, {
      value: 0.75,
      color: [212, 171, 35]
    }, {
      value: 0.88,
      color: [221, 210, 54]
    }, {
      value: 1,
      color: [225, 253, 75]
    }]
  }),
  /**
   * Classic phase color ramp.
   * Defined in interval [0, 1], without unit.
   */
  PHASE: new x({
    stops: [{
      value: 0,
      color: [145, 105, 18]
    }, {
      value: 0.13,
      color: [184, 71, 38]
    }, {
      value: 0.25,
      color: [186, 58, 115]
    }, {
      value: 0.38,
      color: [160, 71, 185]
    }, {
      value: 0.5,
      color: [110, 97, 218]
    }, {
      value: 0.63,
      color: [50, 123, 164]
    }, {
      value: 0.75,
      color: [31, 131, 110]
    }, {
      value: 0.88,
      color: [77, 129, 34]
    }, {
      value: 1,
      color: [145, 105, 18]
    }]
  }),
  /**
   * Classic salinity color ramp.
   * Defined in interval [0, 1], without unit.
   */
  SALINITY: new x({
    stops: [{
      value: 0,
      color: [42, 24, 108]
    }, {
      value: 0.13,
      color: [33, 50, 162]
    }, {
      value: 0.25,
      color: [15, 90, 145]
    }, {
      value: 0.38,
      color: [40, 118, 137]
    }, {
      value: 0.5,
      color: [59, 146, 135]
    }, {
      value: 0.63,
      color: [79, 175, 126]
    }, {
      value: 0.75,
      color: [120, 203, 104]
    }, {
      value: 0.88,
      color: [193, 221, 100]
    }, {
      value: 1,
      color: [253, 239, 154]
    }]
  }),
  /**
   * Classic temperature color ramp.
   * Defined in interval [0, 1], without unit.
   */
  TEMPERATURE: new x({
    stops: [{
      value: 0,
      color: [4, 35, 51]
    }, {
      value: 0.13,
      color: [23, 51, 122]
    }, {
      value: 0.25,
      color: [85, 59, 157]
    }, {
      value: 0.38,
      color: [129, 79, 143]
    }, {
      value: 0.5,
      color: [175, 95, 130]
    }, {
      value: 0.63,
      color: [222, 112, 101]
    }, {
      value: 0.75,
      color: [249, 146, 66]
    }, {
      value: 0.88,
      color: [249, 196, 65]
    }, {
      value: 1,
      color: [232, 250, 91]
    }]
  }),
  /**
   * Classic turbidity color ramp.
   * Defined in interval [0, 1], without unit.
   */
  TURBIDITY: new x({
    stops: [{
      value: 0,
      color: [34, 31, 27]
    }, {
      value: 0.13,
      color: [65, 50, 41]
    }, {
      value: 0.25,
      color: [98, 69, 52]
    }, {
      value: 0.38,
      color: [131, 89, 57]
    }, {
      value: 0.5,
      color: [161, 112, 59]
    }, {
      value: 0.63,
      color: [185, 140, 66]
    }, {
      value: 0.75,
      color: [202, 174, 88]
    }, {
      value: 0.88,
      color: [216, 209, 126]
    }, {
      value: 1,
      color: [233, 246, 171]
    }]
  }),
  /**
   * Classic velocity blue color ramp.
   * Defined in interval [0, 1], without unit.
   */
  VELOCITY_BLUE: new x({
    stops: [{
      value: 0,
      color: [17, 32, 64]
    }, {
      value: 0.13,
      color: [35, 52, 116]
    }, {
      value: 0.25,
      color: [29, 81, 156]
    }, {
      value: 0.38,
      color: [31, 113, 162]
    }, {
      value: 0.5,
      color: [50, 144, 169]
    }, {
      value: 0.63,
      color: [87, 173, 176]
    }, {
      value: 0.75,
      color: [149, 196, 189]
    }, {
      value: 0.88,
      color: [203, 221, 211]
    }, {
      value: 1,
      color: [254, 251, 230]
    }]
  }),
  /**
   * Classic velocity green color ramp.
   * Defined in interval [0, 1], without unit.
   */
  VELOCITY_GREEN: new x({
    stops: [{
      value: 0,
      color: [23, 35, 19]
    }, {
      value: 0.13,
      color: [24, 64, 38]
    }, {
      value: 0.25,
      color: [11, 95, 45]
    }, {
      value: 0.38,
      color: [39, 123, 35]
    }, {
      value: 0.5,
      color: [95, 146, 12]
    }, {
      value: 0.63,
      color: [152, 165, 18]
    }, {
      value: 0.75,
      color: [201, 186, 69]
    }, {
      value: 0.88,
      color: [233, 216, 137]
    }, {
      value: 1,
      color: [255, 253, 205]
    }]
  }),
  /**
   * Classic cube helix color ramp.
   * Defined in interval [0, 1], without unit.
   */
  CUBEHELIX: new x({
    stops: [{
      value: 0,
      color: [0, 0, 0]
    }, {
      value: 0.07,
      color: [22, 5, 59]
    }, {
      value: 0.13,
      color: [60, 4, 105]
    }, {
      value: 0.2,
      color: [109, 1, 135]
    }, {
      value: 0.27,
      color: [161, 0, 147]
    }, {
      value: 0.33,
      color: [210, 2, 142]
    }, {
      value: 0.4,
      color: [251, 11, 123]
    }, {
      value: 0.47,
      color: [255, 29, 97]
    }, {
      value: 0.53,
      color: [255, 54, 69]
    }, {
      value: 0.6,
      color: [255, 85, 46]
    }, {
      value: 0.67,
      color: [255, 120, 34]
    }, {
      value: 0.73,
      color: [255, 157, 37]
    }, {
      value: 0.8,
      color: [241, 191, 57]
    }, {
      value: 0.87,
      color: [224, 220, 93]
    }, {
      value: 0.93,
      color: [218, 241, 142]
    }, {
      value: 1,
      color: [227, 253, 198]
    }]
  }),
  /**
   * The cividis color ramp is color blind friendly.
   * Read more here https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0199239
   * Defined in interval [0, 1], without unit.
   */
  CIVIDIS: new x({
    stops: [{
      value: 0,
      color: [0, 32, 77, 255]
    }, {
      value: 0.125,
      color: [5, 54, 110, 255]
    }, {
      value: 0.25,
      color: [65, 77, 108, 255]
    }, {
      value: 0.375,
      color: [97, 100, 111, 255]
    }, {
      value: 0.5,
      color: [125, 124, 121, 255]
    }, {
      value: 0.625,
      color: [156, 149, 120, 255]
    }, {
      value: 0.75,
      color: [190, 175, 111, 255]
    }, {
      value: 0.875,
      color: [225, 204, 94, 255]
    }, {
      value: 1,
      color: [255, 235, 70, 255]
    }]
  }),
  /**
   * Classic turbo color ramp.
   * This is a luminance-constant alternative to the jet, making it more
   * clor-blind friendly.
   * Defined in interval [0, 1], without unit.
   */
  TURBO: new x({
    stops: [{
      value: 0,
      color: [48, 18, 59, 255]
    }, {
      value: 0.125,
      color: [70, 107, 227, 255]
    }, {
      value: 0.25,
      color: [40, 187, 236, 255]
    }, {
      value: 0.375,
      color: [49, 242, 153, 255]
    }, {
      value: 0.5,
      color: [162, 252, 60, 255]
    }, {
      value: 0.625,
      color: [237, 208, 58, 255]
    }, {
      value: 0.75,
      color: [251, 128, 34, 255]
    }, {
      value: 0.875,
      color: [210, 49, 5, 255]
    }, {
      value: 1,
      color: [122, 4, 3, 255]
    }]
  }),
  /**
   * The rocket color ramp is perceptually uniform, which makes it more
   * color bliend friendly than the classic magma color ramp.
   * Defined in interval [0, 1], without unit.
   */
  ROCKET: new x({
    stops: [{
      value: 0,
      color: [250, 235, 221, 0]
    }, {
      value: 0.133,
      color: [250, 235, 221, 255]
    }, {
      value: 0.266,
      color: [246, 170, 130, 255]
    }, {
      value: 0.4,
      color: [240, 96, 67, 255]
    }, {
      value: 0.533,
      color: [203, 27, 79, 255]
    }, {
      value: 0.666,
      color: [132, 30, 90, 255]
    }, {
      value: 0.8,
      color: [63, 27, 68, 255]
    }, {
      value: 1,
      color: [3, 5, 26, 255]
    }]
  }),
  /**
   * The mako color ramp is perceptually uniform and can be seen as
   * a color blind friendly alternative to bathymetry or yignbu.
   * Defined in interval [0, 1], without unit.
   */
  MAKO: new x({
    stops: [{
      value: 0,
      color: [11, 4, 5, 255]
    }, {
      value: 0.125,
      color: [43, 28, 53, 255]
    }, {
      value: 0.25,
      color: [62, 53, 107, 255]
    }, {
      value: 0.375,
      color: [59, 86, 152, 255]
    }, {
      value: 0.5,
      color: [53, 123, 162, 255]
    }, {
      value: 0.625,
      color: [53, 158, 170, 255]
    }, {
      value: 0.75,
      color: [73, 193, 173, 255]
    }, {
      value: 0.875,
      color: [150, 221, 181, 255]
    }, {
      value: 1,
      color: [222, 245, 229, 255]
    }]
  })
};
function Qs(_0) {
  return __async(this, arguments, function* (r, e = {}) {
    const t = e.download ?? false, n = yield el(r);
    if (t) {
      const a = e.filename ?? "maptiler_screenshot.png", o = document.createElement("a");
      o.style.display = "none", document.body.appendChild(o), o.href = URL.createObjectURL(n), o.download = a, o.click(), setTimeout(() => {
        document.body.removeChild(o), URL.revokeObjectURL(o.href);
      }, 0);
    }
    return n;
  });
}
function el(r) {
  return new Promise((e, t) => {
    r.redraw(), r.once("idle", () => {
      r.getCanvas().toBlob((n) => {
        if (!n) return t(Error("Screenshot could not be created."));
        e(n);
      }, "image/png");
    });
  });
}
var mn = [
  // https://colorhunt.co/palette/1d5b79468b97ef6262f3aa60
  ["#1D5B79", "#468B97", "#EF6262", "#F3AA60"],
  // https://colorhunt.co/palette/614bc333bbc585e6c5c8ffe0
  ["#614BC3", "#33BBC5", "#85E6C5", "#C8FFE0"],
  // https://colorhunt.co/palette/4619597a316fcd6688aed8cc
  ["#461959", "#7A316F", "#CD6688", "#AED8CC"],
  // https://colorhunt.co/palette/0079ff00dfa2f6fa70ff0060
  ["#0079FF", "#00DFA2", "#F6FA70", "#FF0060"],
  //https://colorhunt.co/palette/39b5e0a31acbff78f0f5ea5a
  ["#39B5E0", "#A31ACB", "#FF78F0", "#F5EA5A"],
  // https://colorhunt.co/palette/37e2d5590696c70a80fbcb0a
  ["#37E2D5", "#590696", "#C70A80", "#FBCB0A"],
  // https://colorhunt.co/palette/ffd36efff56d99ffcd9fb4ff
  ["#FFD36E", "#FFF56D", "#99FFCD", "#9FB4FF"],
  // https://colorhunt.co/palette/00ead3fff5b7ff449f005f99
  ["#00EAD3", "#FFF5B7", "#FF449F", "#005F99"],
  // https://colorhunt.co/palette/10a19d540375ff7000ffbf00
  ["#10A19D", "#540375", "#FF7000", "#FFBF00"]
];
function Ir() {
  return mn[~~(Math.random() * mn.length)][~~(Math.random() * 4)];
}
function zt() {
  return `maptiler_source_${xn()}`;
}
function _t() {
  return `maptiler_layer_${xn()}`;
}
function hn(r, e) {
  if (e <= r[0].zoom) return r[0].value;
  if (e >= r[r.length - 1].zoom) return r[r.length - 1].value;
  for (let t = 0; t < r.length - 1; t += 1) if (e >= r[t].zoom && e < r[t + 1].zoom) {
    const n = r[t + 1].zoom - r[t].zoom, a = (e - r[t].zoom) / n;
    return a * r[t + 1].value + (1 - a) * r[t].value;
  }
  return 0;
}
function Ie(r) {
  return ["interpolate", ["linear"], ["zoom"], ...r.flatMap((e) => [e.zoom, e.value])];
}
function P(r) {
  return ["interpolate", ["linear"], ["zoom"], ...r.flatMap((e) => [e.zoom, e.value])];
}
function tl(r, e) {
  if (typeof e == "number" && typeof r == "number") return 2 * e + r;
  if (typeof e == "number" && Array.isArray(r)) return ["interpolate", ["linear"], ["zoom"], ...r.flatMap((t) => [t.zoom, 2 * e + t.value])];
  if (typeof r == "number" && Array.isArray(e)) return ["interpolate", ["linear"], ["zoom"], ...e.flatMap((t) => [t.zoom, 2 * t.value + r])];
  if (Array.isArray(r) && Array.isArray(e)) {
    const t = Array.from(/* @__PURE__ */ new Set([...r.map((n) => n.zoom), ...e.map((n) => n.zoom)])).sort((n, a) => n < a ? -1 : 1);
    return ["interpolate", ["linear"], ["zoom"], ...t.flatMap((n) => [n, 2 * hn(e, n) + hn(r, n)])];
  }
  return 0;
}
function rl(r, e) {
  return ["interpolate", ["linear"], ["get", e], ...r.flatMap((t) => [t.propertyValue, t.value])];
}
function ga(r) {
  const e = r.trimStart(), t = `${e}${" ".repeat(r.length - e.length)}`, n = Array.from(t);
  if (!n.every((s) => s === " " || s === "_")) throw new Error("A dash pattern must be composed only of whitespace and underscore characters.");
  if (!(n.some((s) => s === "_") && n.some((s) => s === " "))) throw new Error("A dash pattern must contain at least one underscore and one whitespace character");
  const i = [1];
  for (let s = 1; s < n.length; s += 1) {
    const l = n[s - 1], u = n[s];
    l === u ? i[i.length - 1] += 1 : i.push(1);
  }
  return i;
}
function gn(r, e) {
  return ["interpolate", ["linear"], ["get", e], ...r.flatMap((t) => [t.value, t.color])];
}
function vn(r, e, t = true) {
  return t ? ["interpolate", ["linear"], ["zoom"], 0, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.value, n.pointRadius * 0.025])], 2, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.value, n.pointRadius * 0.05])], 4, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.value, n.pointRadius * 0.1])], 8, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.value, n.pointRadius * 0.25])], 16, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.value, n.pointRadius])]] : ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.value, n.pointRadius])];
}
function nl(r, e, t = true) {
  return t ? ["interpolate", ["linear"], ["zoom"], 0, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.propertyValue, n.value * 0.025])], 2, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.propertyValue, n.value * 0.05])], 4, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.propertyValue, n.value * 0.1])], 8, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.propertyValue, n.value * 0.25])], 16, ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.propertyValue, n.value])]] : ["interpolate", ["linear"], ["get", e], ...r.flatMap((n) => [n.propertyValue, n.value])];
}
function bn(r, e) {
  return r.every((t) => t.color[3] === r[0].color[3]) ? r[0].color[3] ? r[0].color[3] / 255 : 1 : ["interpolate", ["linear"], ["get", e], ...r.getRawColorStops().flatMap((t) => {
    const n = t.value, a = t.color;
    return [n, a.length === 4 ? a[3] / 255 : 1];
  })];
}
function al(r, e = 10) {
  return ["interpolate", ["linear"], ["heatmap-density"], ...Array.from({
    length: e + 1
  }, (t, n) => {
    const a = n / e;
    return [a, r.getColorHex(a)];
  }).flat()];
}
function ol(_0, _1) {
  return __async(this, arguments, function* (r, e, t = {}) {
    var a, o;
    if (!e.sourceId && !e.data) throw new Error("Creating a polyline layer requires an existing .sourceId or a valid .data property");
    let n = e.data;
    if (typeof n == "string") {
      if (ht(n)) n = `https://api.maptiler.com/data/${e.data}/features.json?key=${F.apiKey}`;
      else if (((a = n.split(".").pop()) == null ? void 0 : a.toLowerCase().trim()) === "gpx") {
        const s = yield (yield fetch(n, t)).text();
        n = ua(s);
      } else if (((o = n.split(".").pop()) == null ? void 0 : o.toLowerCase().trim()) === "kml") {
        const s = yield (yield fetch(n, t)).text();
        n = ca(s);
      } else {
        const i = lo(n) ?? Ys(n);
        i && (n = i);
      }
      if (!n) throw new Error("Polyline data was provided as string but is incompatible with valid formats.");
    }
    return il(r, __spreadProps(__spreadValues({}, e), {
      data: n
    }));
  });
}
function il(r, e) {
  if (e.layerId && r.getLayer(e.layerId)) throw new Error(`A layer already exists with the layer id: ${e.layerId}`);
  const t = e.sourceId ?? zt(), n = e.layerId ?? _t(), a = {
    polylineLayerId: n,
    polylineOutlineLayerId: "",
    polylineSourceId: t
  };
  e.data && !r.getSource(t) && r.addSource(t, {
    type: "geojson",
    data: e.data
  });
  const o = e.lineWidth ?? 3, i = e.lineColor ?? Ir(), s = e.lineOpacity ?? 1, l = e.lineBlur ?? 0, u = e.lineGapWidth ?? 0;
  let c = e.lineDashArray ?? null;
  const p = e.outlineWidth ?? 1, m = e.outlineColor ?? "#FFFFFF", f = e.outlineOpacity ?? 1, d = e.outlineBlur ?? 0;
  if (typeof c == "string" && (c = ga(c)), e.outline === true) {
    const y = `${n}_outline`;
    a.polylineOutlineLayerId = y, r.addLayer({
      id: y,
      type: "line",
      source: t,
      layout: {
        "line-join": e.lineJoin ?? "round",
        "line-cap": e.lineCap ?? "round"
      },
      minzoom: e.minzoom ?? 0,
      maxzoom: e.maxzoom ?? 23,
      paint: {
        "line-opacity": typeof f == "number" ? f : P(f),
        "line-color": typeof m == "string" ? m : Ie(m),
        "line-width": tl(o, p),
        "line-blur": typeof d == "number" ? d : P(d)
      }
    }, e.beforeId);
  }
  return r.addLayer({
    id: n,
    type: "line",
    source: t,
    layout: {
      "line-join": e.lineJoin ?? "round",
      "line-cap": e.lineCap ?? "round"
    },
    minzoom: e.minzoom ?? 0,
    maxzoom: e.maxzoom ?? 23,
    paint: __spreadValues({
      "line-opacity": typeof s == "number" ? s : P(s),
      "line-color": typeof i == "string" ? i : Ie(i),
      "line-width": typeof o == "number" ? o : P(o),
      "line-blur": typeof l == "number" ? l : P(l),
      "line-gap-width": typeof u == "number" ? u : P(u)
    }, c && {
      "line-dasharray": c
    })
  }, e.beforeId), a;
}
function sl(r, e) {
  if (e.layerId && r.getLayer(e.layerId)) throw new Error(`A layer already exists with the layer id: ${e.layerId}`);
  const t = e.sourceId ?? zt(), n = e.layerId ?? _t(), a = {
    polygonLayerId: n,
    polygonOutlineLayerId: e.outline ? `${n}_outline` : "",
    polygonSourceId: t
  };
  if (e.data && !r.getSource(t)) {
    let y = e.data;
    typeof y == "string" && ht(y) && (y = `https://api.maptiler.com/data/${y}/features.json?key=${F.apiKey}`), r.addSource(t, {
      type: "geojson",
      data: y
    });
  }
  let o = e.outlineDashArray ?? null;
  const i = e.outlineWidth ?? 1, s = e.outlineColor ?? "#FFFFFF", l = e.outlineOpacity ?? 1, u = e.outlineBlur ?? 0, c = e.fillColor ?? Ir(), p = e.fillOpacity ?? 1, m = e.outlinePosition ?? "center", f = e.pattern ?? null;
  typeof o == "string" && (o = ga(o));
  const d = (y = null) => {
    if (r.addLayer({
      id: n,
      type: "fill",
      source: t,
      minzoom: e.minzoom ?? 0,
      maxzoom: e.maxzoom ?? 23,
      paint: __spreadValues({
        "fill-color": typeof c == "string" ? c : Ie(c),
        "fill-opacity": typeof p == "number" ? p : P(p)
      }, y && {
        "fill-pattern": y
      })
    }, e.beforeId), e.outline === true) {
      let v;
      m === "inside" ? typeof i == "number" ? v = 0.5 * i : v = P(i.map(({
        zoom: w,
        value: b
      }) => ({
        zoom: w,
        value: 0.5 * b
      }))) : m === "outside" ? typeof i == "number" ? v = -0.5 * i : v = P(i.map((w) => ({
        zoom: w.zoom,
        value: -0.5 * w.value
      }))) : v = 0, r.addLayer({
        id: a.polygonOutlineLayerId,
        type: "line",
        source: t,
        layout: {
          "line-join": e.outlineJoin ?? "round",
          "line-cap": e.outlineCap ?? "butt"
        },
        minzoom: e.minzoom ?? 0,
        maxzoom: e.maxzoom ?? 23,
        paint: __spreadValues({
          "line-opacity": typeof l == "number" ? l : P(l),
          "line-color": typeof s == "string" ? s : Ie(s),
          "line-width": typeof i == "number" ? i : P(i),
          "line-blur": typeof u == "number" ? u : P(u),
          "line-offset": v
        }, o && {
          "line-dasharray": o
        })
      }, e.beforeId);
    }
  };
  return f ? r.hasImage(f) ? d(f) : r.loadImage(f).then((y) => {
    r.addImage(f, y.data), d(f);
  }).catch((y) => (console.error("Could not load the pattern image.", y.message), d())) : d(), a;
}
function ll(r, e) {
  if (e.layerId && r.getLayer(e.layerId)) throw new Error(`A layer already exists with the layer id: ${e.layerId}`);
  const t = e.minPointRadius ?? 10, n = e.maxPointRadius ?? 50, a = e.cluster ?? false, o = 20, i = Array.isArray(e.pointColor) ? e.pointColor : ha.TURBO.scale(10, e.cluster ? 1e4 : 1e3).resample("ease-out-square"), s = i.getBounds(), l = e.sourceId ?? zt(), u = e.layerId ?? _t(), c = e.showLabel ?? a, p = e.alignOnViewport ?? true, m = e.outline ?? false, f = e.outlineOpacity ?? 1, d = e.outlineWidth ?? 1, y = e.outlineColor ?? "#FFFFFF";
  let v;
  const w = e.zoomCompensation ?? true, b = e.minzoom ?? 0, T = e.maxzoom ?? 23;
  typeof e.pointOpacity == "number" ? v = e.pointOpacity : Array.isArray(e.pointOpacity) ? v = P(e.pointOpacity) : e.cluster ? v = bn(i, "point_count") : e.property ? v = bn(i, e.property) : v = P([{
    zoom: b,
    value: 0
  }, {
    zoom: b + 0.25,
    value: 1
  }, {
    zoom: T - 0.25,
    value: 1
  }, {
    zoom: T,
    value: 0
  }]);
  const j = {
    pointLayerId: u,
    clusterLayerId: "",
    labelLayerId: "",
    pointSourceId: l
  };
  if (e.data && !r.getSource(l)) {
    let R = e.data;
    typeof R == "string" && ht(R) && (R = `https://api.maptiler.com/data/${R}/features.json?key=${F.apiKey}`), r.addSource(l, {
      type: "geojson",
      data: R,
      cluster: a
    });
  }
  if (a) {
    j.clusterLayerId = `${u}_cluster`;
    const R = Array.from({
      length: o
    }, (ae, we) => {
      const De = s.min + we * (s.max - s.min) / (o - 1);
      return {
        value: De,
        pointRadius: t + (n - t) * (we / (o - 1)) ** 0.5,
        color: i.getColorHex(De)
      };
    });
    r.addLayer({
      id: j.clusterLayerId,
      type: "circle",
      source: l,
      filter: ["has", "point_count"],
      paint: __spreadValues({
        // 'circle-color': options.pointColor ?? colorDrivenByProperty(clusterStyle, "point_count"),
        "circle-color": typeof e.pointColor == "string" ? e.pointColor : gn(R, "point_count"),
        "circle-radius": typeof e.pointRadius == "number" ? e.pointRadius : Array.isArray(e.pointRadius) ? P(e.pointRadius) : vn(R, "point_count", false),
        "circle-pitch-alignment": p ? "viewport" : "map",
        "circle-pitch-scale": "map",
        // scale with camera distance regardless of viewport/biewport alignement
        "circle-opacity": v
      }, m && {
        "circle-stroke-opacity": typeof f == "number" ? f : P(f),
        "circle-stroke-width": typeof d == "number" ? d : P(d),
        "circle-stroke-color": typeof y == "string" ? y : Ie(y)
      }),
      minzoom: b,
      maxzoom: T
    }, e.beforeId), r.addLayer({
      id: j.pointLayerId,
      type: "circle",
      source: l,
      filter: ["!", ["has", "point_count"]],
      paint: __spreadValues({
        "circle-pitch-alignment": p ? "viewport" : "map",
        "circle-pitch-scale": "map",
        // scale with camera distance regardless of viewport/biewport alignement
        // 'circle-color':  options.pointColor ?? clusterStyle[0].color,
        "circle-color": typeof e.pointColor == "string" ? e.pointColor : i.getColorHex(i.getBounds().min),
        "circle-radius": typeof e.pointRadius == "number" ? e.pointRadius : Array.isArray(e.pointRadius) ? P(e.pointRadius) : R[0].pointRadius * 0.75,
        "circle-opacity": v
      }, m && {
        "circle-stroke-opacity": typeof f == "number" ? f : P(f),
        "circle-stroke-width": typeof d == "number" ? d : P(d),
        "circle-stroke-color": typeof y == "string" ? y : Ie(y)
      }),
      minzoom: b,
      maxzoom: T
    }, e.beforeId);
  } else {
    let R = typeof e.pointColor == "string" ? e.pointColor : Array.isArray(e.pointColor) ? e.pointColor.getColorHex(e.pointColor.getBounds().min) : Ir(), ae = typeof e.pointRadius == "number" ? w ? P([{
      zoom: 0,
      value: e.pointRadius * 0.025
    }, {
      zoom: 2,
      value: e.pointRadius * 0.05
    }, {
      zoom: 4,
      value: e.pointRadius * 0.1
    }, {
      zoom: 8,
      value: e.pointRadius * 0.25
    }, {
      zoom: 16,
      value: e.pointRadius * 1
    }]) : e.pointRadius : Array.isArray(e.pointRadius) ? P(e.pointRadius) : w ? P([{
      zoom: 0,
      value: t * 0.05
    }, {
      zoom: 2,
      value: t * 0.1
    }, {
      zoom: 4,
      value: t * 0.2
    }, {
      zoom: 8,
      value: t * 0.5
    }, {
      zoom: 16,
      value: t * 1
    }]) : t;
    if (e.property && Array.isArray(e.pointColor)) {
      const we = Array.from({
        length: o
      }, (De, et) => {
        const tt = s.min + et * (s.max - s.min) / (o - 1);
        return {
          value: tt,
          pointRadius: typeof e.pointRadius == "number" ? e.pointRadius : t + (n - t) * (et / (o - 1)) ** 0.5,
          color: typeof e.pointColor == "string" ? e.pointColor : i.getColorHex(tt)
        };
      });
      R = gn(we, e.property), ae = vn(we, e.property, w);
    }
    r.addLayer({
      id: j.pointLayerId,
      type: "circle",
      source: l,
      layout: {
        // Contrary to labels, we want to see the small one in front. Weirdly "circle-sort-key" works in the opposite direction as "symbol-sort-key".
        "circle-sort-key": e.property ? ["/", 1, ["get", e.property]] : 0
      },
      paint: __spreadValues({
        "circle-pitch-alignment": p ? "viewport" : "map",
        "circle-pitch-scale": "map",
        // scale with camera distance regardless of viewport/biewport alignement
        "circle-color": R,
        "circle-opacity": v,
        "circle-radius": ae
      }, m && {
        "circle-stroke-opacity": typeof f == "number" ? f : P(f),
        "circle-stroke-width": typeof d == "number" ? d : P(d),
        "circle-stroke-color": typeof y == "string" ? y : Ie(y)
      }),
      minzoom: b,
      maxzoom: T
    }, e.beforeId);
  }
  if (c !== false && (e.cluster || e.property)) {
    j.labelLayerId = `${u}_label`;
    const R = e.labelColor ?? "#fff", ae = e.labelSize ?? 12;
    r.addLayer({
      id: j.labelLayerId,
      type: "symbol",
      source: l,
      filter: ["has", e.cluster ? "point_count" : e.property],
      layout: {
        "text-field": e.cluster ? "{point_count_abbreviated}" : `{${e.property}}`,
        "text-font": ["Noto Sans Regular"],
        "text-size": ae,
        "text-pitch-alignment": p ? "viewport" : "map",
        "symbol-sort-key": ["/", 1, ["get", e.cluster ? "point_count" : e.property]]
        // so that the largest value goes on top
      },
      paint: {
        "text-color": R,
        "text-opacity": v
      },
      minzoom: b,
      maxzoom: T
    }, e.beforeId);
  }
  return j;
}
function ul(r, e) {
  if (e.layerId && r.getLayer(e.layerId)) throw new Error(`A layer already exists with the layer id: ${e.layerId}`);
  const t = e.sourceId ?? zt(), n = e.layerId ?? _t(), a = e.minzoom ?? 0, o = e.maxzoom ?? 23, i = e.zoomCompensation ?? true, s = e.opacity ?? [{
    zoom: a,
    value: 0
  }, {
    zoom: a + 0.25,
    value: 1
  }, {
    zoom: o - 0.25,
    value: 1
  }, {
    zoom: o,
    value: 0
  }];
  let l = Array.isArray(e.colorRamp) ? e.colorRamp : ha.TURBO.transparentStart();
  const u = l.getBounds();
  (u.min !== 0 || u.max !== 1) && (l = l.scale(0, 1)), l.hasTransparentStart() || (l = l.transparentStart());
  const c = e.intensity ?? [{
    zoom: 0,
    value: 0.01
  }, {
    zoom: 4,
    value: 0.2
  }, {
    zoom: 16,
    value: 1
  }], p = e.property ?? null, m = e.weight ?? 1;
  let f = 1;
  p ? typeof m == "number" ? (f = m, typeof e.weight == "number" && console.warn("The option `.property` is ignored when `.propertyValueWeights` is not of type `PropertyValueWeights`")) : Array.isArray(m) ? f = rl(m, p) : console.warn("The option `.property` is ignored when `.propertyValueWeights` is not of type `PropertyValueWeights`") : typeof m == "number" ? f = m : Array.isArray(m) && console.warn("The options `.propertyValueWeights` can only be used when `.property` is provided.");
  const d = [{
    zoom: 0,
    value: 50 * 0.025
  }, {
    zoom: 2,
    value: 50 * 0.05
  }, {
    zoom: 4,
    value: 50 * 0.1
  }, {
    zoom: 8,
    value: 50 * 0.25
  }, {
    zoom: 16,
    value: 50
  }], y = e.radius ?? (i ? d : 10);
  let v = 1;
  typeof y == "number" ? v = y : Array.isArray(y) && "zoom" in y[0] ? v = P(y) : p && Array.isArray(y) && "propertyValue" in y[0] ? v = nl(y, p, i) : !p && Array.isArray(y) && "propertyValue" in y[0] ? (v = P(d), console.warn("The option `.radius` can only be property-driven if the option `.property` is provided.")) : v = P(d);
  const w = {
    heatmapLayerId: n,
    heatmapSourceId: t
  };
  if (e.data && !r.getSource(t)) {
    let b = e.data;
    typeof b == "string" && ht(b) && (b = `https://api.maptiler.com/data/${b}/features.json?key=${F.apiKey}`), r.addSource(t, {
      type: "geojson",
      data: b
    });
  }
  return r.addLayer({
    id: n,
    type: "heatmap",
    source: t,
    minzoom: a,
    maxzoom: o,
    paint: {
      "heatmap-weight": f,
      "heatmap-intensity": typeof c == "number" ? c : P(c),
      "heatmap-color": al(l),
      "heatmap-radius": v,
      "heatmap-opacity": typeof s == "number" ? s : P(s)
    }
  }, e.beforeId), w;
}
var Nl = {
  addPolyline: ol,
  addPolygon: sl,
  addPoint: ll,
  addHeatmap: ul,
  takeScreenshot: Qs
};
io();
function Fl() {
  return wn.version;
}
var Ol = import_maplibre_gl.default.Map;
var Dl = import_maplibre_gl.default.Marker;
var ql = import_maplibre_gl.default.Popup;
var Bl = import_maplibre_gl.default.Style;
var Ul = import_maplibre_gl.default.CanvasSource;
var Vl = import_maplibre_gl.default.GeoJSONSource;
var Gl = import_maplibre_gl.default.ImageSource;
var Hl = import_maplibre_gl.default.RasterTileSource;
var Kl = import_maplibre_gl.default.RasterDEMTileSource;
var Wl = import_maplibre_gl.default.VectorTileSource;
var Zl = import_maplibre_gl.default.VideoSource;
var Jl = import_maplibre_gl.default.NavigationControl;
var Yl = import_maplibre_gl.default.GeolocateControl;
var Xl = import_maplibre_gl.default.AttributionControl;
var Ql = import_maplibre_gl.default.LogoControl;
var eu = import_maplibre_gl.default.ScaleControl;
var tu = import_maplibre_gl.default.FullscreenControl;
var ru = import_maplibre_gl.default.TerrainControl;
var nu = import_maplibre_gl.default.BoxZoomHandler;
var au = import_maplibre_gl.default.ScrollZoomHandler;
var ou = import_maplibre_gl.default.CooperativeGesturesHandler;
var iu = import_maplibre_gl.default.KeyboardHandler;
var su = import_maplibre_gl.default.TwoFingersTouchPitchHandler;
var lu = import_maplibre_gl.default.MapWheelEvent;
var uu = import_maplibre_gl.default.MapTouchEvent;
var cu = import_maplibre_gl.default.MapMouseEvent;
var pu = import_maplibre_gl.default.config;
var fu = import_maplibre_gl.default.getVersion;
var {
  setRTLTextPlugin: du,
  getRTLTextPluginStatus: yu,
  LngLat: mu,
  LngLatBounds: hu,
  MercatorCoordinate: gu,
  Evented: vu,
  AJAXError: bu,
  prewarm: wu,
  clearPrewarmedResources: Su,
  Hash: xu,
  Point: ku,
  EdgeInsets: Lu,
  DragRotateHandler: Cu,
  DragPanHandler: Au,
  TwoFingersTouchZoomRotateHandler: Tu,
  DoubleClickZoomHandler: Iu,
  TwoFingersTouchZoomHandler: Eu,
  TwoFingersTouchRotateHandler: Mu,
  getWorkerCount: zu,
  setWorkerCount: _u,
  getMaxParallelImageRequests: Pu,
  setMaxParallelImageRequests: Ru,
  getWorkerUrl: $u,
  setWorkerUrl: ju,
  addSourceType: Nu,
  importScriptInWorkers: Fu,
  addProtocol: Ou,
  removeProtocol: Du
} = import_maplibre_gl.default;
export {
  bu as AJAXError,
  Tl as AttributionControl,
  Xl as AttributionControlMLGL,
  El as BoxZoomHandler,
  nu as BoxZoomHandlerMLGL,
  wl as CanvasSource,
  Ul as CanvasSourceMLGL,
  x as ColorRamp,
  ha as ColorRampCollection,
  zl as CooperativeGesturesHandler,
  ou as CooperativeGesturesHandlerMLGL,
  Iu as DoubleClickZoomHandler,
  Au as DragPanHandler,
  Cu as DragRotateHandler,
  Lu as EdgeInsets,
  vu as Evented,
  Lo as FullscreenControl,
  tu as FullscreenControlMLGL,
  Sl as GeoJSONSource,
  Vl as GeoJSONSourceMLGL,
  So as GeolocateControl,
  Yl as GeolocateControlMLGL,
  Bs as GeolocationType,
  xu as Hash,
  xl as ImageSource,
  Gl as ImageSourceMLGL,
  _l as KeyboardHandler,
  iu as KeyboardHandlerMLGL,
  M as Language,
  mu as LngLat,
  hu as LngLatBounds,
  xo as LogoControl,
  Ql as LogoControlMLGL,
  Us as Map,
  Ol as MapMLGL,
  jl as MapMouseEvent,
  cu as MapMouseEventMLGL,
  MapStyle,
  MapStyleVariant,
  $l as MapTouchEvent,
  uu as MapTouchEventMLGL,
  Rl as MapWheelEvent,
  lu as MapWheelEventMLGL,
  Os as MaptilerGeolocateControl,
  Or as MaptilerLogoControl,
  Ns as MaptilerNavigationControl,
  Ds as MaptilerProjectionControl,
  js as MaptilerTerrainControl,
  hl as Marker,
  Dl as MarkerMLGL,
  gu as MercatorCoordinate,
  Jl as NavigationControMLGL,
  wo as NavigationControl,
  ku as Point,
  vl as Popup,
  ql as PopupMLGL,
  Ll as RasterDEMTileSource,
  Kl as RasterDEMTileSourceMLGL,
  kl as RasterTileSource,
  Hl as RasterTileSourceMLGL,
  ReferenceMapStyle,
  ko as ScaleControl,
  eu as ScaleControlMLGL,
  Ml as ScrollZoomHandler,
  au as ScrollZoomHandlerMLGL,
  Qa as SdkConfig,
  ServiceError,
  bl as Style,
  Bl as StyleMLGL,
  ru as TerrainControMLGL,
  Il as TerrainControl,
  Pl as TwoFingersTouchPitchHandler,
  su as TwoFingersTouchPitchHandlerMLGL,
  Mu as TwoFingersTouchRotateHandler,
  Eu as TwoFingersTouchZoomHandler,
  Tu as TwoFingersTouchZoomRotateHandler,
  Cl as VectorTileSource,
  Wl as VectorTileSourceMLGL,
  Al as VideoSource,
  Zl as VideoSourceMLGL,
  Ou as addProtocol,
  Nu as addSourceType,
  areSameLanguages,
  bufferToPixelDataBrowser,
  circumferenceAtLatitude,
  Su as clearPrewarmedResources,
  F as config,
  pu as configMLGL,
  coordinates,
  data,
  elevation,
  expandMapStyle,
  geocoding,
  geolocation,
  getAutoLanguage,
  Pr as getBrowserLanguage,
  getBufferToPixelDataParser,
  getLanguageInfoFromCode,
  getLanguageInfoFromFlag,
  getLanguageInfoFromKey,
  fu as getMapLibreVersion,
  Pu as getMaxParallelImageRequests,
  yu as getRTLTextPluginStatus,
  getTileCache,
  Fl as getVersion,
  uo as getWebGLSupportError,
  zu as getWorkerCount,
  $u as getWorkerUrl,
  ua as gpx,
  Ys as gpxOrKml,
  la as hasChildNodeWithName,
  Nl as helpers,
  Fu as importScriptInWorkers,
  isLanguageInfo,
  ca as kml,
  mapStylePresetList,
  math,
  misc,
  wu as prewarm,
  Du as removeProtocol,
  Ru as setMaxParallelImageRequests,
  du as setRTLTextPlugin,
  _u as setWorkerCount,
  ju as setWorkerUrl,
  staticMaps,
  Ar as str2xml,
  styleToStyle,
  toLanguageInfo,
  cn as xml2str
};
//# sourceMappingURL=@maptiler_sdk.js.map
