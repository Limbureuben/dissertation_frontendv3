import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  HttpClient
} from "./chunk-LDSGMV6U.js";
import "./chunk-EJF4SFNG.js";
import {
  Inject,
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-2W3MNUWV.js";
import "./chunk-DFRHWMTS.js";
import "./chunk-OGIUALEI.js";
import "./chunk-7RL4FTI4.js";
import "./chunk-ANGF2IQY.js";

// node_modules/@ngx-translate/http-loader/fesm2022/ngx-translate-http-loader.mjs
var TranslateHttpLoader = class _TranslateHttpLoader {
  http;
  prefix;
  suffix;
  constructor(http, prefix = "/assets/i18n/", suffix = ".json") {
    this.http = http;
    this.prefix = prefix;
    this.suffix = suffix;
  }
  /**
   * Gets the translations from the server
   */
  getTranslation(lang) {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
  static ɵfac = function TranslateHttpLoader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TranslateHttpLoader)(ɵɵinject(HttpClient), ɵɵinject(String), ɵɵinject(String));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _TranslateHttpLoader,
    factory: _TranslateHttpLoader.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateHttpLoader, [{
    type: Injectable
  }], () => [{
    type: HttpClient
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [String]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [String]
    }]
  }], null);
})();
export {
  TranslateHttpLoader
};
//# sourceMappingURL=@ngx-translate_http-loader.js.map
