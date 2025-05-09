import {
  require_leaflet_src
} from "./chunk-QCU47NUP.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty
} from "./chunk-3LKO5WQ4.js";
import "./chunk-XS73CW5H.js";
import "./chunk-SGMLAKGD.js";
import "./chunk-XT6ZCHFH.js";
import "./chunk-ZYKX7RMX.js";
import {
  __toESM
} from "./chunk-KTESVR3Q.js";

// node_modules/ng-leaflet-universal/fesm2020/ng-leaflet-universal.mjs
var import_leaflet = __toESM(require_leaflet_src(), 1);
function generate(prefix = "ng-leaflet-universal") {
  const hexstring = Math.random().toString(16).slice(2);
  return [prefix, hexstring].filter(Boolean).join("-");
}
var getCardHtml = (card) => card?.customHtml ? card.customHtml : `
    <div class="map-card">
      <div class="map-card-body">
        <div class="top-card">
          <img src="${card?.image?.url}" alt="${card?.title?.text}" />
          <div class="content">
            <h2 class="map-card-title">${card?.title?.text}</h2>
            <h4 class="map-card-subtitle">${card?.subtitle?.text}</h4>
            <h5 class="map-address">${card?.address?.text}</h5>
          </div>
        </div>
        <div class="map-card-content">
          ${card?.content?.text}
        </div>
        <div class="cta-wrapper">
          ${card?.callToActions?.map((cta) => `
              <a href="${cta.link}"
                target="_blank"
                style="
                background-color: ${cta.backgroundColor || "#007FFF"};
                color: ${cta.textColor || "white"};"
                class="map-card-cta">
                  ${cta.icon ? `<i class="${cta.icon}"></i>` : ""}
              ${cta.text}</a>
              `).reduce((a, b) => a + b)}
          </div>
      </div>
    </div>`;
var MapComponent = class {
  constructor() {
    this.mapEvent = new EventEmitter();
    this.id = generate("div");
  }
  ngOnChanges(changes) {
    if (changes.markers && this.map) {
      this.updateMarkers(this.markers);
    }
  }
  ngAfterViewInit() {
    this.map = (0, import_leaflet.map)(this.id).setView([18.4, -66.9], 4);
    (0, import_leaflet.tileLayer)("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data © OpenStreetMap contributors"
    }).addTo(this.map);
    this.updateMarkers(this.markers);
  }
  removeMarkers() {
    this.map.eachLayer((layer) => {
      if (layer.options?.attribution) return;
      layer.remove();
    });
  }
  updateMarkers(markers) {
    this.removeMarkers();
    if (!markers?.length) return;
    const leafletMarkers = markers.map(createLeafletMarker).map((marker, i) => {
      return marker.on("click", () => this.mapEvent.emit(markers[i]));
    });
    const group = new import_leaflet.FeatureGroup(leafletMarkers);
    group.addTo(this.map);
    this.map.fitBounds(group.getBounds());
  }
};
MapComponent.ɵfac = function MapComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || MapComponent)();
};
MapComponent.ɵcmp = ɵɵdefineComponent({
  type: MapComponent,
  selectors: [["ng-leaflet-universal"]],
  inputs: {
    markers: "markers"
  },
  outputs: {
    mapEvent: "mapEvent"
  },
  standalone: false,
  features: [ɵɵNgOnChangesFeature],
  decls: 3,
  vars: 1,
  consts: [[1, "map"], [1, "map-frame"], [3, "id"]],
  template: function MapComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementStart(0, "div", 0)(1, "div", 1);
      ɵɵelement(2, "div", 2);
      ɵɵelementEnd()();
    }
    if (rf & 2) {
      ɵɵadvance(2);
      ɵɵproperty("id", ctx.id);
    }
  },
  styles: [".map[_ngcontent-%COMP%]{position:absolute;inset:0}.map[_ngcontent-%COMP%]   .map-frame[_ngcontent-%COMP%], .map[_ngcontent-%COMP%]   .map-frame[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{height:100%}  .leaflet-popup-tip{border-radius:0 0 20%!important}  .map-marker-icon .item-marker{border-radius:100% 100% 100% 35%;border:2px solid #444444;width:22px!important;height:22px!important;background-color:#444;box-shadow:0 0 3px #0000005d;transform:rotate(-45deg);overflow:hidden}  .map-marker-icon .item-marker .icon-image{width:100%;height:100%;border-radius:100%;background-position:center;background-size:cover;transform:rotate(38deg)}  .leaflet-container a.leaflet-popup-close-button{position:absolute;top:5px;right:5px;padding:3px!important;color:#ff0f0f98;text-decoration:none;font-weight:700;background:#f2f2f2}  .leaflet-container a.leaflet-popup-close-button:hover{color:#ff0f0f}  .leaflet-popup{bottom:32px!important}  .leaflet-popup-content{min-width:350px!important;height:auto!important}  .leaflet-popup-content .map-card .map-card-body{padding:10px}  .leaflet-popup-content .map-card .map-card-body .top-card{display:flex;align-items:center}  .leaflet-popup-content .map-card .map-card-body .top-card img{width:100px;height:100px;margin-right:20px}  .leaflet-popup-content .map-card .map-card-body .top-card .content .map-card-title{font-weight:700;margin:0}  .leaflet-popup-content .map-card .map-card-body .top-card .content .map-card-subtitle{font-weight:400;font-size:14px;color:#585858;margin:0}  .leaflet-popup-content .map-card .map-card-body .top-card .content .map-card-content h4{font-size:16px}  .leaflet-popup-content .map-card .map-card-body .top-card .content .map-card-content p{font-size:14px}  .leaflet-popup-content .map-card .map-card-body .cta-wrapper{margin-top:20px;width:100%;display:grid;grid-template-columns:repeat(3,1fr);grid-gap:15px}  .leaflet-popup-content .map-card .map-card-body .cta-wrapper .map-card-cta{cursor:pointer;text-decoration:none;border:none;padding:8px 10px;font-size:12px;text-align:center;margin-bottom:6px;height:20px;display:flex;justify-content:center;align-items:center;border-radius:2px}  .leaflet-popup-content .map-card .map-card-body .cta-wrapper .map-card-cta:hover{opacity:.6}  .leaflet-popup-content .map-card .map-card-body .cta-wrapper .map-card-cta i{margin-right:5px;font-size:10px}"],
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MapComponent, [{
    type: Component,
    args: [{
      selector: "ng-leaflet-universal",
      template: `
    <div class="map">
      <div class="map-frame">
        <div [id]="id"></div>
      </div>
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [".map{position:absolute;inset:0}.map .map-frame,.map .map-frame div{height:100%}::ng-deep .leaflet-popup-tip{border-radius:0 0 20%!important}::ng-deep .map-marker-icon .item-marker{border-radius:100% 100% 100% 35%;border:2px solid #444444;width:22px!important;height:22px!important;background-color:#444;box-shadow:0 0 3px #0000005d;transform:rotate(-45deg);overflow:hidden}::ng-deep .map-marker-icon .item-marker .icon-image{width:100%;height:100%;border-radius:100%;background-position:center;background-size:cover;transform:rotate(38deg)}::ng-deep .leaflet-container a.leaflet-popup-close-button{position:absolute;top:5px;right:5px;padding:3px!important;color:#ff0f0f98;text-decoration:none;font-weight:700;background:#f2f2f2}::ng-deep .leaflet-container a.leaflet-popup-close-button:hover{color:#ff0f0f}::ng-deep .leaflet-popup{bottom:32px!important}::ng-deep .leaflet-popup-content{min-width:350px!important;height:auto!important}::ng-deep .leaflet-popup-content .map-card .map-card-body{padding:10px}::ng-deep .leaflet-popup-content .map-card .map-card-body .top-card{display:flex;align-items:center}::ng-deep .leaflet-popup-content .map-card .map-card-body .top-card img{width:100px;height:100px;margin-right:20px}::ng-deep .leaflet-popup-content .map-card .map-card-body .top-card .content .map-card-title{font-weight:700;margin:0}::ng-deep .leaflet-popup-content .map-card .map-card-body .top-card .content .map-card-subtitle{font-weight:400;font-size:14px;color:#585858;margin:0}::ng-deep .leaflet-popup-content .map-card .map-card-body .top-card .content .map-card-content h4{font-size:16px}::ng-deep .leaflet-popup-content .map-card .map-card-body .top-card .content .map-card-content p{font-size:14px}::ng-deep .leaflet-popup-content .map-card .map-card-body .cta-wrapper{margin-top:20px;width:100%;display:grid;grid-template-columns:repeat(3,1fr);grid-gap:15px}::ng-deep .leaflet-popup-content .map-card .map-card-body .cta-wrapper .map-card-cta{cursor:pointer;text-decoration:none;border:none;padding:8px 10px;font-size:12px;text-align:center;margin-bottom:6px;height:20px;display:flex;justify-content:center;align-items:center;border-radius:2px}::ng-deep .leaflet-popup-content .map-card .map-card-body .cta-wrapper .map-card-cta:hover{opacity:.6}::ng-deep .leaflet-popup-content .map-card .map-card-body .cta-wrapper .map-card-cta i{margin-right:5px;font-size:10px}\n"]
    }]
  }], null, {
    mapEvent: [{
      type: Output
    }],
    markers: [{
      type: Input
    }]
  });
})();
function createLeafletMarker(marker) {
  const leafletMarker = new import_leaflet.Marker({
    lat: marker.location.latitude,
    lng: marker.location.longitude
  });
  leafletMarker.setIcon((0, import_leaflet.divIcon)({
    html: marker.html || `
      <div class="item-marker">
          <div class="icon-image" style="background-image: url('${marker.icon}')">
          </div>
      </div>`,
    className: "map-marker-icon",
    iconSize: [26, 30],
    iconAnchor: [13, 30]
  }));
  leafletMarker.on("click", function({
    target,
    latlng
  }) {
    if (marker.cardActivated && marker?.card) {
      const html = getCardHtml(marker.card);
      const popup = target.getPopup();
      if (popup) popup?.openPopup();
      else {
        target.bindPopup(html, {
          autoClose: false,
          maxWidth: 200
        }).openPopup();
      }
    }
    target._map.setView(latlng, 15);
  });
  return leafletMarker;
}
var NgLeafletUniversalModule = class {
};
NgLeafletUniversalModule.ɵfac = function NgLeafletUniversalModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgLeafletUniversalModule)();
};
NgLeafletUniversalModule.ɵmod = ɵɵdefineNgModule({
  type: NgLeafletUniversalModule,
  declarations: [MapComponent],
  exports: [MapComponent]
});
NgLeafletUniversalModule.ɵinj = ɵɵdefineInjector({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgLeafletUniversalModule, [{
    type: NgModule,
    args: [{
      declarations: [MapComponent],
      exports: [MapComponent]
    }]
  }], null, null);
})();
export {
  MapComponent,
  NgLeafletUniversalModule
};
//# sourceMappingURL=ng-leaflet-universal.js.map
