import {
  __commonJS,
  __export,
  __toESM
} from "./chunk-KTESVR3Q.js";

// node_modules/wgs84/index.js
var require_wgs84 = __commonJS({
  "node_modules/wgs84/index.js"(exports, module) {
    module.exports.RADIUS = 6378137;
    module.exports.FLATTENING = 1 / 298.257223563;
    module.exports.POLAR_RADIUS = 63567523142e-4;
  }
});

// node_modules/@mapbox/geojson-area/index.js
var require_geojson_area = __commonJS({
  "node_modules/@mapbox/geojson-area/index.js"(exports, module) {
    var wgs84 = require_wgs84();
    module.exports.geometry = geometry;
    module.exports.ring = ringArea;
    function geometry(_) {
      var area2 = 0, i;
      switch (_.type) {
        case "Polygon":
          return polygonArea(_.coordinates);
        case "MultiPolygon":
          for (i = 0; i < _.coordinates.length; i++) {
            area2 += polygonArea(_.coordinates[i]);
          }
          return area2;
        case "Point":
        case "MultiPoint":
        case "LineString":
        case "MultiLineString":
          return 0;
        case "GeometryCollection":
          for (i = 0; i < _.geometries.length; i++) {
            area2 += geometry(_.geometries[i]);
          }
          return area2;
      }
    }
    function polygonArea(coords) {
      var area2 = 0;
      if (coords && coords.length > 0) {
        area2 += Math.abs(ringArea(coords[0]));
        for (var i = 1; i < coords.length; i++) {
          area2 -= Math.abs(ringArea(coords[i]));
        }
      }
      return area2;
    }
    function ringArea(coords) {
      var p1, p2, p3, lowerIndex, middleIndex, upperIndex, i, area2 = 0, coordsLength = coords.length;
      if (coordsLength > 2) {
        for (i = 0; i < coordsLength; i++) {
          if (i === coordsLength - 2) {
            lowerIndex = coordsLength - 2;
            middleIndex = coordsLength - 1;
            upperIndex = 0;
          } else if (i === coordsLength - 1) {
            lowerIndex = coordsLength - 1;
            middleIndex = 0;
            upperIndex = 1;
          } else {
            lowerIndex = i;
            middleIndex = i + 1;
            upperIndex = i + 2;
          }
          p1 = coords[lowerIndex];
          p2 = coords[middleIndex];
          p3 = coords[upperIndex];
          area2 += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
        }
        area2 = area2 * wgs84.RADIUS * wgs84.RADIUS / 2;
      }
      return area2;
    }
    function rad(_) {
      return _ * Math.PI / 180;
    }
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; ) if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/@mapbox/geojson-normalize/index.js
var require_geojson_normalize = __commonJS({
  "node_modules/@mapbox/geojson-normalize/index.js"(exports, module) {
    module.exports = normalize2;
    var types2 = {
      Point: "geometry",
      MultiPoint: "geometry",
      LineString: "geometry",
      MultiLineString: "geometry",
      Polygon: "geometry",
      MultiPolygon: "geometry",
      GeometryCollection: "geometry",
      Feature: "feature",
      FeatureCollection: "featurecollection"
    };
    function normalize2(gj) {
      if (!gj || !gj.type) return null;
      var type = types2[gj.type];
      if (!type) return null;
      if (type === "geometry") {
        return {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            properties: {},
            geometry: gj
          }]
        };
      } else if (type === "feature") {
        return {
          type: "FeatureCollection",
          features: [gj]
        };
      } else if (type === "featurecollection") {
        return gj;
      }
    }
  }
});

// node_modules/@mapbox/mapbox-gl-draw/src/lib/mode_handler.js
var ModeHandler = function(mode, DrawContext) {
  const handlers = {
    drag: [],
    click: [],
    mousemove: [],
    mousedown: [],
    mouseup: [],
    mouseout: [],
    keydown: [],
    keyup: [],
    touchstart: [],
    touchmove: [],
    touchend: [],
    tap: []
  };
  const ctx = {
    on(event, selector, fn) {
      if (handlers[event] === void 0) {
        throw new Error(`Invalid event type: ${event}`);
      }
      handlers[event].push({
        selector,
        fn
      });
    },
    render(id) {
      DrawContext.store.featureChanged(id);
    }
  };
  const delegate = function(eventName, event) {
    const handles = handlers[eventName];
    let iHandle = handles.length;
    while (iHandle--) {
      const handle = handles[iHandle];
      if (handle.selector(event)) {
        const skipRender = handle.fn.call(ctx, event);
        if (!skipRender) {
          DrawContext.store.render();
        }
        DrawContext.ui.updateMapClasses();
        break;
      }
    }
  };
  mode.start.call(ctx);
  return {
    render: mode.render,
    stop() {
      if (mode.stop) mode.stop();
    },
    trash() {
      if (mode.trash) {
        mode.trash();
        DrawContext.store.render();
      }
    },
    combineFeatures() {
      if (mode.combineFeatures) {
        mode.combineFeatures();
      }
    },
    uncombineFeatures() {
      if (mode.uncombineFeatures) {
        mode.uncombineFeatures();
      }
    },
    drag(event) {
      delegate("drag", event);
    },
    click(event) {
      delegate("click", event);
    },
    mousemove(event) {
      delegate("mousemove", event);
    },
    mousedown(event) {
      delegate("mousedown", event);
    },
    mouseup(event) {
      delegate("mouseup", event);
    },
    mouseout(event) {
      delegate("mouseout", event);
    },
    keydown(event) {
      delegate("keydown", event);
    },
    keyup(event) {
      delegate("keyup", event);
    },
    touchstart(event) {
      delegate("touchstart", event);
    },
    touchmove(event) {
      delegate("touchmove", event);
    },
    touchend(event) {
      delegate("touchend", event);
    },
    tap(event) {
      delegate("tap", event);
    }
  };
};
var mode_handler_default = ModeHandler;

// node_modules/@mapbox/mapbox-gl-draw/src/lib/sort_features.js
var import_geojson_area = __toESM(require_geojson_area(), 1);

// node_modules/@mapbox/mapbox-gl-draw/src/constants.js
var constants_exports = {};
__export(constants_exports, {
  LAT_MAX: () => LAT_MAX,
  LAT_MIN: () => LAT_MIN,
  LAT_RENDERED_MAX: () => LAT_RENDERED_MAX,
  LAT_RENDERED_MIN: () => LAT_RENDERED_MIN,
  LNG_MAX: () => LNG_MAX,
  LNG_MIN: () => LNG_MIN,
  activeStates: () => activeStates,
  classes: () => classes,
  cursors: () => cursors,
  events: () => events,
  geojsonTypes: () => geojsonTypes,
  interactions: () => interactions,
  meta: () => meta,
  modes: () => modes,
  sources: () => sources,
  types: () => types,
  updateActions: () => updateActions
});
var classes = {
  CANVAS: "mapboxgl-canvas",
  CONTROL_BASE: "mapboxgl-ctrl",
  CONTROL_PREFIX: "mapboxgl-ctrl-",
  CONTROL_BUTTON: "mapbox-gl-draw_ctrl-draw-btn",
  CONTROL_BUTTON_LINE: "mapbox-gl-draw_line",
  CONTROL_BUTTON_POLYGON: "mapbox-gl-draw_polygon",
  CONTROL_BUTTON_POINT: "mapbox-gl-draw_point",
  CONTROL_BUTTON_TRASH: "mapbox-gl-draw_trash",
  CONTROL_BUTTON_COMBINE_FEATURES: "mapbox-gl-draw_combine",
  CONTROL_BUTTON_UNCOMBINE_FEATURES: "mapbox-gl-draw_uncombine",
  CONTROL_GROUP: "mapboxgl-ctrl-group",
  ATTRIBUTION: "mapboxgl-ctrl-attrib",
  ACTIVE_BUTTON: "active",
  BOX_SELECT: "mapbox-gl-draw_boxselect"
};
var sources = {
  HOT: "mapbox-gl-draw-hot",
  COLD: "mapbox-gl-draw-cold"
};
var cursors = {
  ADD: "add",
  MOVE: "move",
  DRAG: "drag",
  POINTER: "pointer",
  NONE: "none"
};
var types = {
  POLYGON: "polygon",
  LINE: "line_string",
  POINT: "point"
};
var geojsonTypes = {
  FEATURE: "Feature",
  POLYGON: "Polygon",
  LINE_STRING: "LineString",
  POINT: "Point",
  FEATURE_COLLECTION: "FeatureCollection",
  MULTI_PREFIX: "Multi",
  MULTI_POINT: "MultiPoint",
  MULTI_LINE_STRING: "MultiLineString",
  MULTI_POLYGON: "MultiPolygon"
};
var modes = {
  DRAW_LINE_STRING: "draw_line_string",
  DRAW_POLYGON: "draw_polygon",
  DRAW_POINT: "draw_point",
  SIMPLE_SELECT: "simple_select",
  DIRECT_SELECT: "direct_select"
};
var events = {
  CREATE: "draw.create",
  DELETE: "draw.delete",
  UPDATE: "draw.update",
  SELECTION_CHANGE: "draw.selectionchange",
  MODE_CHANGE: "draw.modechange",
  ACTIONABLE: "draw.actionable",
  RENDER: "draw.render",
  COMBINE_FEATURES: "draw.combine",
  UNCOMBINE_FEATURES: "draw.uncombine"
};
var updateActions = {
  MOVE: "move",
  CHANGE_PROPERTIES: "change_properties",
  CHANGE_COORDINATES: "change_coordinates"
};
var meta = {
  FEATURE: "feature",
  MIDPOINT: "midpoint",
  VERTEX: "vertex"
};
var activeStates = {
  ACTIVE: "true",
  INACTIVE: "false"
};
var interactions = ["scrollZoom", "boxZoom", "dragRotate", "dragPan", "keyboard", "doubleClickZoom", "touchZoomRotate"];
var LAT_MIN = -90;
var LAT_RENDERED_MIN = -85;
var LAT_MAX = 90;
var LAT_RENDERED_MAX = 85;
var LNG_MIN = -270;
var LNG_MAX = 270;

// node_modules/@mapbox/mapbox-gl-draw/src/lib/sort_features.js
var FEATURE_SORT_RANKS = {
  Point: 0,
  LineString: 1,
  MultiLineString: 1,
  Polygon: 2
};
function comparator(a, b) {
  const score = FEATURE_SORT_RANKS[a.geometry.type] - FEATURE_SORT_RANKS[b.geometry.type];
  if (score === 0 && a.geometry.type === geojsonTypes.POLYGON) {
    return a.area - b.area;
  }
  return score;
}
function sortFeatures(features) {
  return features.map((feature) => {
    if (feature.geometry.type === geojsonTypes.POLYGON) {
      feature.area = import_geojson_area.default.geometry({
        type: geojsonTypes.FEATURE,
        property: {},
        geometry: feature.geometry
      });
    }
    return feature;
  }).sort(comparator).map((feature) => {
    delete feature.area;
    return feature;
  });
}
var sort_features_default = sortFeatures;

// node_modules/@mapbox/mapbox-gl-draw/src/lib/map_event_to_bounding_box.js
function mapEventToBoundingBox(mapEvent, buffer = 0) {
  return [[mapEvent.point.x - buffer, mapEvent.point.y - buffer], [mapEvent.point.x + buffer, mapEvent.point.y + buffer]];
}
var map_event_to_bounding_box_default = mapEventToBoundingBox;

// node_modules/@mapbox/mapbox-gl-draw/src/lib/string_set.js
function StringSet(items) {
  this._items = {};
  this._nums = {};
  this._length = items ? items.length : 0;
  if (!items) return;
  for (let i = 0, l = items.length; i < l; i++) {
    this.add(items[i]);
    if (items[i] === void 0) continue;
    if (typeof items[i] === "string") this._items[items[i]] = i;
    else this._nums[items[i]] = i;
  }
}
StringSet.prototype.add = function(x) {
  if (this.has(x)) return this;
  this._length++;
  if (typeof x === "string") this._items[x] = this._length;
  else this._nums[x] = this._length;
  return this;
};
StringSet.prototype.delete = function(x) {
  if (this.has(x) === false) return this;
  this._length--;
  delete this._items[x];
  delete this._nums[x];
  return this;
};
StringSet.prototype.has = function(x) {
  if (typeof x !== "string" && typeof x !== "number") return false;
  return this._items[x] !== void 0 || this._nums[x] !== void 0;
};
StringSet.prototype.values = function() {
  const values = [];
  Object.keys(this._items).forEach((k) => {
    values.push({
      k,
      v: this._items[k]
    });
  });
  Object.keys(this._nums).forEach((k) => {
    values.push({
      k: JSON.parse(k),
      v: this._nums[k]
    });
  });
  return values.sort((a, b) => a.v - b.v).map((a) => a.k);
};
StringSet.prototype.clear = function() {
  this._length = 0;
  this._items = {};
  this._nums = {};
  return this;
};
var string_set_default = StringSet;

// node_modules/@mapbox/mapbox-gl-draw/src/lib/features_at.js
var META_TYPES = [meta.FEATURE, meta.MIDPOINT, meta.VERTEX];
var features_at_default = {
  click: featuresAtClick,
  touch: featuresAtTouch
};
function featuresAtClick(event, bbox, ctx) {
  return featuresAt(event, bbox, ctx, ctx.options.clickBuffer);
}
function featuresAtTouch(event, bbox, ctx) {
  return featuresAt(event, bbox, ctx, ctx.options.touchBuffer);
}
function featuresAt(event, bbox, ctx, buffer) {
  if (ctx.map === null) return [];
  const box = event ? map_event_to_bounding_box_default(event, buffer) : bbox;
  const queryParams = {};
  if (ctx.options.styles) queryParams.layers = ctx.options.styles.map((s) => s.id).filter((id) => ctx.map.getLayer(id) != null);
  const features = ctx.map.queryRenderedFeatures(box, queryParams).filter((feature) => META_TYPES.indexOf(feature.properties.meta) !== -1);
  const featureIds = new string_set_default();
  const uniqueFeatures = [];
  features.forEach((feature) => {
    const featureId = feature.properties.id;
    if (featureIds.has(featureId)) return;
    featureIds.add(featureId);
    uniqueFeatures.push(feature);
  });
  return sort_features_default(uniqueFeatures);
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/get_features_and_set_cursor.js
function getFeatureAtAndSetCursors(event, ctx) {
  const features = features_at_default.click(event, null, ctx);
  const classes2 = {
    mouse: cursors.NONE
  };
  if (features[0]) {
    classes2.mouse = features[0].properties.active === activeStates.ACTIVE ? cursors.MOVE : cursors.POINTER;
    classes2.feature = features[0].properties.meta;
  }
  if (ctx.events.currentModeName().indexOf("draw") !== -1) {
    classes2.mouse = cursors.ADD;
  }
  ctx.ui.queueMapClasses(classes2);
  ctx.ui.updateMapClasses();
  return features[0];
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/euclidean_distance.js
function euclidean_distance_default(a, b) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.sqrt(x * x + y * y);
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/is_click.js
var FINE_TOLERANCE = 4;
var GROSS_TOLERANCE = 12;
var INTERVAL = 500;
function isClick(start, end, options = {}) {
  const fineTolerance = options.fineTolerance != null ? options.fineTolerance : FINE_TOLERANCE;
  const grossTolerance = options.grossTolerance != null ? options.grossTolerance : GROSS_TOLERANCE;
  const interval = options.interval != null ? options.interval : INTERVAL;
  start.point = start.point || end.point;
  start.time = start.time || end.time;
  const moveDistance = euclidean_distance_default(start.point, end.point);
  return moveDistance < fineTolerance || moveDistance < grossTolerance && end.time - start.time < interval;
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/is_tap.js
var TAP_TOLERANCE = 25;
var TAP_INTERVAL = 250;
function isTap(start, end, options = {}) {
  const tolerance = options.tolerance != null ? options.tolerance : TAP_TOLERANCE;
  const interval = options.interval != null ? options.interval : TAP_INTERVAL;
  start.point = start.point || end.point;
  start.time = start.time || end.time;
  const moveDistance = euclidean_distance_default(start.point, end.point);
  return moveDistance < tolerance && end.time - start.time < interval;
}

// node_modules/@mapbox/mapbox-gl-draw/node_modules/nanoid/non-secure/index.js
var customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = "";
    let i = size | 0;
    while (i--) {
      id += alphabet[Math.random() * alphabet.length | 0];
    }
    return id;
  };
};

// node_modules/@mapbox/mapbox-gl-draw/src/lib/id.js
var nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 32);
function generateID() {
  return nanoid();
}

// node_modules/@mapbox/mapbox-gl-draw/src/feature_types/feature.js
var Feature = function(ctx, geojson) {
  this.ctx = ctx;
  this.properties = geojson.properties || {};
  this.coordinates = geojson.geometry.coordinates;
  this.id = geojson.id || generateID();
  this.type = geojson.geometry.type;
};
Feature.prototype.changed = function() {
  this.ctx.store.featureChanged(this.id);
};
Feature.prototype.incomingCoords = function(coords) {
  this.setCoordinates(coords);
};
Feature.prototype.setCoordinates = function(coords) {
  this.coordinates = coords;
  this.changed();
};
Feature.prototype.getCoordinates = function() {
  return JSON.parse(JSON.stringify(this.coordinates));
};
Feature.prototype.setProperty = function(property, value) {
  this.properties[property] = value;
};
Feature.prototype.toGeoJSON = function() {
  return JSON.parse(JSON.stringify({
    id: this.id,
    type: geojsonTypes.FEATURE,
    properties: this.properties,
    geometry: {
      coordinates: this.getCoordinates(),
      type: this.type
    }
  }));
};
Feature.prototype.internal = function(mode) {
  const properties = {
    id: this.id,
    meta: meta.FEATURE,
    "meta:type": this.type,
    active: activeStates.INACTIVE,
    mode
  };
  if (this.ctx.options.userProperties) {
    for (const name in this.properties) {
      properties[`user_${name}`] = this.properties[name];
    }
  }
  return {
    type: geojsonTypes.FEATURE,
    properties,
    geometry: {
      coordinates: this.getCoordinates(),
      type: this.type
    }
  };
};
var feature_default = Feature;

// node_modules/@mapbox/mapbox-gl-draw/src/feature_types/point.js
var Point = function(ctx, geojson) {
  feature_default.call(this, ctx, geojson);
};
Point.prototype = Object.create(feature_default.prototype);
Point.prototype.isValid = function() {
  return typeof this.coordinates[0] === "number" && typeof this.coordinates[1] === "number";
};
Point.prototype.updateCoordinate = function(pathOrLng, lngOrLat, lat) {
  if (arguments.length === 3) {
    this.coordinates = [lngOrLat, lat];
  } else {
    this.coordinates = [pathOrLng, lngOrLat];
  }
  this.changed();
};
Point.prototype.getCoordinate = function() {
  return this.getCoordinates();
};
var point_default = Point;

// node_modules/@mapbox/mapbox-gl-draw/src/feature_types/line_string.js
var LineString = function(ctx, geojson) {
  feature_default.call(this, ctx, geojson);
};
LineString.prototype = Object.create(feature_default.prototype);
LineString.prototype.isValid = function() {
  return this.coordinates.length > 1;
};
LineString.prototype.addCoordinate = function(path, lng, lat) {
  this.changed();
  const id = parseInt(path, 10);
  this.coordinates.splice(id, 0, [lng, lat]);
};
LineString.prototype.getCoordinate = function(path) {
  const id = parseInt(path, 10);
  return JSON.parse(JSON.stringify(this.coordinates[id]));
};
LineString.prototype.removeCoordinate = function(path) {
  this.changed();
  this.coordinates.splice(parseInt(path, 10), 1);
};
LineString.prototype.updateCoordinate = function(path, lng, lat) {
  const id = parseInt(path, 10);
  this.coordinates[id] = [lng, lat];
  this.changed();
};
var line_string_default = LineString;

// node_modules/@mapbox/mapbox-gl-draw/src/feature_types/polygon.js
var Polygon = function(ctx, geojson) {
  feature_default.call(this, ctx, geojson);
  this.coordinates = this.coordinates.map((ring) => ring.slice(0, -1));
};
Polygon.prototype = Object.create(feature_default.prototype);
Polygon.prototype.isValid = function() {
  if (this.coordinates.length === 0) return false;
  return this.coordinates.every((ring) => ring.length > 2);
};
Polygon.prototype.incomingCoords = function(coords) {
  this.coordinates = coords.map((ring) => ring.slice(0, -1));
  this.changed();
};
Polygon.prototype.setCoordinates = function(coords) {
  this.coordinates = coords;
  this.changed();
};
Polygon.prototype.addCoordinate = function(path, lng, lat) {
  this.changed();
  const ids = path.split(".").map((x) => parseInt(x, 10));
  const ring = this.coordinates[ids[0]];
  ring.splice(ids[1], 0, [lng, lat]);
};
Polygon.prototype.removeCoordinate = function(path) {
  this.changed();
  const ids = path.split(".").map((x) => parseInt(x, 10));
  const ring = this.coordinates[ids[0]];
  if (ring) {
    ring.splice(ids[1], 1);
    if (ring.length < 3) {
      this.coordinates.splice(ids[0], 1);
    }
  }
};
Polygon.prototype.getCoordinate = function(path) {
  const ids = path.split(".").map((x) => parseInt(x, 10));
  const ring = this.coordinates[ids[0]];
  return JSON.parse(JSON.stringify(ring[ids[1]]));
};
Polygon.prototype.getCoordinates = function() {
  return this.coordinates.map((coords) => coords.concat([coords[0]]));
};
Polygon.prototype.updateCoordinate = function(path, lng, lat) {
  this.changed();
  const parts = path.split(".");
  const ringId = parseInt(parts[0], 10);
  const coordId = parseInt(parts[1], 10);
  if (this.coordinates[ringId] === void 0) {
    this.coordinates[ringId] = [];
  }
  this.coordinates[ringId][coordId] = [lng, lat];
};
var polygon_default = Polygon;

// node_modules/@mapbox/mapbox-gl-draw/src/feature_types/multi_feature.js
var models = {
  MultiPoint: point_default,
  MultiLineString: line_string_default,
  MultiPolygon: polygon_default
};
var takeAction = (features, action, path, lng, lat) => {
  const parts = path.split(".");
  const idx = parseInt(parts[0], 10);
  const tail = !parts[1] ? null : parts.slice(1).join(".");
  return features[idx][action](tail, lng, lat);
};
var MultiFeature = function(ctx, geojson) {
  feature_default.call(this, ctx, geojson);
  delete this.coordinates;
  this.model = models[geojson.geometry.type];
  if (this.model === void 0) throw new TypeError(`${geojson.geometry.type} is not a valid type`);
  this.features = this._coordinatesToFeatures(geojson.geometry.coordinates);
};
MultiFeature.prototype = Object.create(feature_default.prototype);
MultiFeature.prototype._coordinatesToFeatures = function(coordinates) {
  const Model = this.model.bind(this);
  return coordinates.map((coords) => new Model(this.ctx, {
    id: generateID(),
    type: geojsonTypes.FEATURE,
    properties: {},
    geometry: {
      coordinates: coords,
      type: this.type.replace("Multi", "")
    }
  }));
};
MultiFeature.prototype.isValid = function() {
  return this.features.every((f) => f.isValid());
};
MultiFeature.prototype.setCoordinates = function(coords) {
  this.features = this._coordinatesToFeatures(coords);
  this.changed();
};
MultiFeature.prototype.getCoordinate = function(path) {
  return takeAction(this.features, "getCoordinate", path);
};
MultiFeature.prototype.getCoordinates = function() {
  return JSON.parse(JSON.stringify(this.features.map((f) => {
    if (f.type === geojsonTypes.POLYGON) return f.getCoordinates();
    return f.coordinates;
  })));
};
MultiFeature.prototype.updateCoordinate = function(path, lng, lat) {
  takeAction(this.features, "updateCoordinate", path, lng, lat);
  this.changed();
};
MultiFeature.prototype.addCoordinate = function(path, lng, lat) {
  takeAction(this.features, "addCoordinate", path, lng, lat);
  this.changed();
};
MultiFeature.prototype.removeCoordinate = function(path) {
  takeAction(this.features, "removeCoordinate", path);
  this.changed();
};
MultiFeature.prototype.getFeatures = function() {
  return this.features;
};
var multi_feature_default = MultiFeature;

// node_modules/@mapbox/mapbox-gl-draw/src/modes/mode_interface_accessors.js
function ModeInterface(ctx) {
  this.map = ctx.map;
  this.drawConfig = JSON.parse(JSON.stringify(ctx.options || {}));
  this._ctx = ctx;
}
ModeInterface.prototype.setSelected = function(features) {
  return this._ctx.store.setSelected(features);
};
ModeInterface.prototype.setSelectedCoordinates = function(coords) {
  this._ctx.store.setSelectedCoordinates(coords);
  coords.reduce((m, c) => {
    if (m[c.feature_id] === void 0) {
      m[c.feature_id] = true;
      this._ctx.store.get(c.feature_id).changed();
    }
    return m;
  }, {});
};
ModeInterface.prototype.getSelected = function() {
  return this._ctx.store.getSelected();
};
ModeInterface.prototype.getSelectedIds = function() {
  return this._ctx.store.getSelectedIds();
};
ModeInterface.prototype.isSelected = function(id) {
  return this._ctx.store.isSelected(id);
};
ModeInterface.prototype.getFeature = function(id) {
  return this._ctx.store.get(id);
};
ModeInterface.prototype.select = function(id) {
  return this._ctx.store.select(id);
};
ModeInterface.prototype.deselect = function(id) {
  return this._ctx.store.deselect(id);
};
ModeInterface.prototype.deleteFeature = function(id, opts = {}) {
  return this._ctx.store.delete(id, opts);
};
ModeInterface.prototype.addFeature = function(feature, opts = {}) {
  return this._ctx.store.add(feature, opts);
};
ModeInterface.prototype.clearSelectedFeatures = function() {
  return this._ctx.store.clearSelected();
};
ModeInterface.prototype.clearSelectedCoordinates = function() {
  return this._ctx.store.clearSelectedCoordinates();
};
ModeInterface.prototype.setActionableState = function(actions = {}) {
  const newSet = {
    trash: actions.trash || false,
    combineFeatures: actions.combineFeatures || false,
    uncombineFeatures: actions.uncombineFeatures || false
  };
  return this._ctx.events.actionable(newSet);
};
ModeInterface.prototype.changeMode = function(mode, opts = {}, eventOpts = {}) {
  return this._ctx.events.changeMode(mode, opts, eventOpts);
};
ModeInterface.prototype.fire = function(eventName, eventData) {
  return this._ctx.events.fire(eventName, eventData);
};
ModeInterface.prototype.updateUIClasses = function(opts) {
  return this._ctx.ui.queueMapClasses(opts);
};
ModeInterface.prototype.activateUIButton = function(name) {
  return this._ctx.ui.setActiveButton(name);
};
ModeInterface.prototype.featuresAt = function(event, bbox, bufferType = "click") {
  if (bufferType !== "click" && bufferType !== "touch") throw new Error("invalid buffer type");
  return features_at_default[bufferType](event, bbox, this._ctx);
};
ModeInterface.prototype.newFeature = function(geojson) {
  const type = geojson.geometry.type;
  if (type === geojsonTypes.POINT) return new point_default(this._ctx, geojson);
  if (type === geojsonTypes.LINE_STRING) return new line_string_default(this._ctx, geojson);
  if (type === geojsonTypes.POLYGON) return new polygon_default(this._ctx, geojson);
  return new multi_feature_default(this._ctx, geojson);
};
ModeInterface.prototype.isInstanceOf = function(type, feature) {
  if (type === geojsonTypes.POINT) return feature instanceof point_default;
  if (type === geojsonTypes.LINE_STRING) return feature instanceof line_string_default;
  if (type === geojsonTypes.POLYGON) return feature instanceof polygon_default;
  if (type === "MultiFeature") return feature instanceof multi_feature_default;
  throw new Error(`Unknown feature class: ${type}`);
};
ModeInterface.prototype.doRender = function(id) {
  return this._ctx.store.featureChanged(id);
};

// node_modules/@mapbox/mapbox-gl-draw/src/modes/mode_interface.js
var mode_interface_default = ModeInterface;
ModeInterface.prototype.onSetup = function() {
};
ModeInterface.prototype.onDrag = function() {
};
ModeInterface.prototype.onClick = function() {
};
ModeInterface.prototype.onMouseMove = function() {
};
ModeInterface.prototype.onMouseDown = function() {
};
ModeInterface.prototype.onMouseUp = function() {
};
ModeInterface.prototype.onMouseOut = function() {
};
ModeInterface.prototype.onKeyUp = function() {
};
ModeInterface.prototype.onKeyDown = function() {
};
ModeInterface.prototype.onTouchStart = function() {
};
ModeInterface.prototype.onTouchMove = function() {
};
ModeInterface.prototype.onTouchEnd = function() {
};
ModeInterface.prototype.onTap = function() {
};
ModeInterface.prototype.onStop = function() {
};
ModeInterface.prototype.onTrash = function() {
};
ModeInterface.prototype.onCombineFeature = function() {
};
ModeInterface.prototype.onUncombineFeature = function() {
};
ModeInterface.prototype.toDisplayFeatures = function() {
  throw new Error("You must overwrite toDisplayFeatures");
};

// node_modules/@mapbox/mapbox-gl-draw/src/modes/object_to_mode.js
var eventMapper = {
  drag: "onDrag",
  click: "onClick",
  mousemove: "onMouseMove",
  mousedown: "onMouseDown",
  mouseup: "onMouseUp",
  mouseout: "onMouseOut",
  keyup: "onKeyUp",
  keydown: "onKeyDown",
  touchstart: "onTouchStart",
  touchmove: "onTouchMove",
  touchend: "onTouchEnd",
  tap: "onTap"
};
var eventKeys = Object.keys(eventMapper);
function object_to_mode_default(modeObject) {
  const modeObjectKeys = Object.keys(modeObject);
  return function(ctx, startOpts = {}) {
    let state = {};
    const mode = modeObjectKeys.reduce((m, k) => {
      m[k] = modeObject[k];
      return m;
    }, new mode_interface_default(ctx));
    function wrapper(eh) {
      return (e) => mode[eh](state, e);
    }
    return {
      start() {
        state = mode.onSetup(startOpts);
        eventKeys.forEach((key) => {
          const modeHandler = eventMapper[key];
          let selector = () => false;
          if (modeObject[modeHandler]) {
            selector = () => true;
          }
          this.on(key, selector, wrapper(modeHandler));
        });
      },
      stop() {
        mode.onStop(state);
      },
      trash() {
        mode.onTrash(state);
      },
      combineFeatures() {
        mode.onCombineFeatures(state);
      },
      uncombineFeatures() {
        mode.onUncombineFeatures(state);
      },
      render(geojson, push) {
        mode.toDisplayFeatures(state, geojson, push);
      }
    };
  };
}

// node_modules/@mapbox/mapbox-gl-draw/src/events.js
function events_default(ctx) {
  const modes2 = Object.keys(ctx.options.modes).reduce((m, k) => {
    m[k] = object_to_mode_default(ctx.options.modes[k]);
    return m;
  }, {});
  let mouseDownInfo = {};
  let touchStartInfo = {};
  const events2 = {};
  let currentModeName = null;
  let currentMode = null;
  events2.drag = function(event, isDrag) {
    if (isDrag({
      point: event.point,
      time: (/* @__PURE__ */ new Date()).getTime()
    })) {
      ctx.ui.queueMapClasses({
        mouse: cursors.DRAG
      });
      currentMode.drag(event);
    } else {
      event.originalEvent.stopPropagation();
    }
  };
  events2.mousedrag = function(event) {
    events2.drag(event, (endInfo) => !isClick(mouseDownInfo, endInfo));
  };
  events2.touchdrag = function(event) {
    events2.drag(event, (endInfo) => !isTap(touchStartInfo, endInfo));
  };
  events2.mousemove = function(event) {
    const button = event.originalEvent.buttons !== void 0 ? event.originalEvent.buttons : event.originalEvent.which;
    if (button === 1) {
      return events2.mousedrag(event);
    }
    const target = getFeatureAtAndSetCursors(event, ctx);
    event.featureTarget = target;
    currentMode.mousemove(event);
  };
  events2.mousedown = function(event) {
    mouseDownInfo = {
      time: (/* @__PURE__ */ new Date()).getTime(),
      point: event.point
    };
    const target = getFeatureAtAndSetCursors(event, ctx);
    event.featureTarget = target;
    currentMode.mousedown(event);
  };
  events2.mouseup = function(event) {
    const target = getFeatureAtAndSetCursors(event, ctx);
    event.featureTarget = target;
    if (isClick(mouseDownInfo, {
      point: event.point,
      time: (/* @__PURE__ */ new Date()).getTime()
    })) {
      currentMode.click(event);
    } else {
      currentMode.mouseup(event);
    }
  };
  events2.mouseout = function(event) {
    currentMode.mouseout(event);
  };
  events2.touchstart = function(event) {
    if (!ctx.options.touchEnabled) {
      return;
    }
    touchStartInfo = {
      time: (/* @__PURE__ */ new Date()).getTime(),
      point: event.point
    };
    const target = features_at_default.touch(event, null, ctx)[0];
    event.featureTarget = target;
    currentMode.touchstart(event);
  };
  events2.touchmove = function(event) {
    if (!ctx.options.touchEnabled) {
      return;
    }
    currentMode.touchmove(event);
    return events2.touchdrag(event);
  };
  events2.touchend = function(event) {
    event.originalEvent.preventDefault();
    if (!ctx.options.touchEnabled) {
      return;
    }
    const target = features_at_default.touch(event, null, ctx)[0];
    event.featureTarget = target;
    if (isTap(touchStartInfo, {
      time: (/* @__PURE__ */ new Date()).getTime(),
      point: event.point
    })) {
      currentMode.tap(event);
    } else {
      currentMode.touchend(event);
    }
  };
  const isKeyModeValid = (code) => !(code === 8 || code === 46 || code >= 48 && code <= 57);
  events2.keydown = function(event) {
    const isMapElement = (event.srcElement || event.target).classList.contains(classes.CANVAS);
    if (!isMapElement) return;
    if ((event.keyCode === 8 || event.keyCode === 46) && ctx.options.controls.trash) {
      event.preventDefault();
      currentMode.trash();
    } else if (isKeyModeValid(event.keyCode)) {
      currentMode.keydown(event);
    } else if (event.keyCode === 49 && ctx.options.controls.point) {
      changeMode(modes.DRAW_POINT);
    } else if (event.keyCode === 50 && ctx.options.controls.line_string) {
      changeMode(modes.DRAW_LINE_STRING);
    } else if (event.keyCode === 51 && ctx.options.controls.polygon) {
      changeMode(modes.DRAW_POLYGON);
    }
  };
  events2.keyup = function(event) {
    if (isKeyModeValid(event.keyCode)) {
      currentMode.keyup(event);
    }
  };
  events2.zoomend = function() {
    ctx.store.changeZoom();
  };
  events2.data = function(event) {
    if (event.dataType === "style") {
      const {
        setup,
        map,
        options,
        store
      } = ctx;
      const hasLayers = options.styles.some((style) => map.getLayer(style.id));
      if (!hasLayers) {
        setup.addLayers();
        store.setDirty();
        store.render();
      }
    }
  };
  function changeMode(modename, nextModeOptions, eventOptions = {}) {
    currentMode.stop();
    const modebuilder = modes2[modename];
    if (modebuilder === void 0) {
      throw new Error(`${modename} is not valid`);
    }
    currentModeName = modename;
    const mode = modebuilder(ctx, nextModeOptions);
    currentMode = mode_handler_default(mode, ctx);
    if (!eventOptions.silent) {
      ctx.map.fire(events.MODE_CHANGE, {
        mode: modename
      });
    }
    ctx.store.setDirty();
    ctx.store.render();
  }
  const actionState = {
    trash: false,
    combineFeatures: false,
    uncombineFeatures: false
  };
  function actionable(actions) {
    let changed = false;
    Object.keys(actions).forEach((action) => {
      if (actionState[action] === void 0) throw new Error("Invalid action type");
      if (actionState[action] !== actions[action]) changed = true;
      actionState[action] = actions[action];
    });
    if (changed) ctx.map.fire(events.ACTIONABLE, {
      actions: actionState
    });
  }
  const api = {
    start() {
      currentModeName = ctx.options.defaultMode;
      currentMode = mode_handler_default(modes2[currentModeName](ctx), ctx);
    },
    changeMode,
    actionable,
    currentModeName() {
      return currentModeName;
    },
    currentModeRender(geojson, push) {
      return currentMode.render(geojson, push);
    },
    fire(eventName, eventData) {
      if (!ctx.map) return;
      ctx.map.fire(eventName, eventData);
    },
    addEventListeners() {
      ctx.map.on("mousemove", events2.mousemove);
      ctx.map.on("mousedown", events2.mousedown);
      ctx.map.on("mouseup", events2.mouseup);
      ctx.map.on("data", events2.data);
      ctx.map.on("touchmove", events2.touchmove);
      ctx.map.on("touchstart", events2.touchstart);
      ctx.map.on("touchend", events2.touchend);
      ctx.container.addEventListener("mouseout", events2.mouseout);
      if (ctx.options.keybindings) {
        ctx.container.addEventListener("keydown", events2.keydown);
        ctx.container.addEventListener("keyup", events2.keyup);
      }
    },
    removeEventListeners() {
      ctx.map.off("mousemove", events2.mousemove);
      ctx.map.off("mousedown", events2.mousedown);
      ctx.map.off("mouseup", events2.mouseup);
      ctx.map.off("data", events2.data);
      ctx.map.off("touchmove", events2.touchmove);
      ctx.map.off("touchstart", events2.touchstart);
      ctx.map.off("touchend", events2.touchend);
      ctx.container.removeEventListener("mouseout", events2.mouseout);
      if (ctx.options.keybindings) {
        ctx.container.removeEventListener("keydown", events2.keydown);
        ctx.container.removeEventListener("keyup", events2.keyup);
      }
    },
    trash(options) {
      currentMode.trash(options);
    },
    combineFeatures() {
      currentMode.combineFeatures();
    },
    uncombineFeatures() {
      currentMode.uncombineFeatures();
    },
    getMode() {
      return currentModeName;
    }
  };
  return api;
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/to_dense_array.js
function toDenseArray(x) {
  return [].concat(x).filter((y) => y !== void 0);
}
var to_dense_array_default = toDenseArray;

// node_modules/@mapbox/mapbox-gl-draw/src/render.js
function render() {
  const store = this;
  const mapExists = store.ctx.map && store.ctx.map.getSource(sources.HOT) !== void 0;
  if (!mapExists) return cleanup();
  const mode = store.ctx.events.currentModeName();
  store.ctx.ui.queueMapClasses({
    mode
  });
  let newHotIds = [];
  let newColdIds = [];
  if (store.isDirty) {
    newColdIds = store.getAllIds();
  } else {
    newHotIds = store.getChangedIds().filter((id) => store.get(id) !== void 0);
    newColdIds = store.sources.hot.filter((geojson) => geojson.properties.id && newHotIds.indexOf(geojson.properties.id) === -1 && store.get(geojson.properties.id) !== void 0).map((geojson) => geojson.properties.id);
  }
  store.sources.hot = [];
  const lastColdCount = store.sources.cold.length;
  store.sources.cold = store.isDirty ? [] : store.sources.cold.filter((geojson) => {
    const id = geojson.properties.id || geojson.properties.parent;
    return newHotIds.indexOf(id) === -1;
  });
  const coldChanged = lastColdCount !== store.sources.cold.length || newColdIds.length > 0;
  newHotIds.forEach((id) => renderFeature(id, "hot"));
  newColdIds.forEach((id) => renderFeature(id, "cold"));
  function renderFeature(id, source) {
    const feature = store.get(id);
    const featureInternal = feature.internal(mode);
    store.ctx.events.currentModeRender(featureInternal, (geojson) => {
      geojson.properties.mode = mode;
      store.sources[source].push(geojson);
    });
  }
  if (coldChanged) {
    store.ctx.map.getSource(sources.COLD).setData({
      type: geojsonTypes.FEATURE_COLLECTION,
      features: store.sources.cold
    });
  }
  store.ctx.map.getSource(sources.HOT).setData({
    type: geojsonTypes.FEATURE_COLLECTION,
    features: store.sources.hot
  });
  cleanup();
  function cleanup() {
    store.isDirty = false;
    store.clearChangedIds();
  }
}

// node_modules/@mapbox/mapbox-gl-draw/src/store.js
function Store(ctx) {
  this._features = {};
  this._featureIds = new string_set_default();
  this._selectedFeatureIds = new string_set_default();
  this._selectedCoordinates = [];
  this._changedFeatureIds = new string_set_default();
  this._emitSelectionChange = false;
  this._mapInitialConfig = {};
  this.ctx = ctx;
  this.sources = {
    hot: [],
    cold: []
  };
  let renderRequest;
  this.render = () => {
    if (!renderRequest) {
      renderRequest = requestAnimationFrame(() => {
        renderRequest = null;
        render.call(this);
        if (this._emitSelectionChange) {
          this.ctx.events.fire(events.SELECTION_CHANGE, {
            features: this.getSelected().map((feature) => feature.toGeoJSON()),
            points: this.getSelectedCoordinates().map((coordinate) => ({
              type: geojsonTypes.FEATURE,
              properties: {},
              geometry: {
                type: geojsonTypes.POINT,
                coordinates: coordinate.coordinates
              }
            }))
          });
          this._emitSelectionChange = false;
        }
        this.ctx.events.fire(events.RENDER, {});
      });
    }
  };
  this.isDirty = false;
}
Store.prototype.createRenderBatch = function() {
  const holdRender = this.render;
  let numRenders = 0;
  this.render = function() {
    numRenders++;
  };
  return () => {
    this.render = holdRender;
    if (numRenders > 0) {
      this.render();
    }
  };
};
Store.prototype.setDirty = function() {
  this.isDirty = true;
  return this;
};
Store.prototype.featureCreated = function(featureId, options = {}) {
  this._changedFeatureIds.add(featureId);
  const silent = options.silent != null ? options.silent : this.ctx.options.suppressAPIEvents;
  if (silent !== true) {
    const feature = this.get(featureId);
    this.ctx.events.fire(events.CREATE, {
      features: [feature.toGeoJSON()]
    });
  }
  return this;
};
Store.prototype.featureChanged = function(featureId, options = {}) {
  this._changedFeatureIds.add(featureId);
  const silent = options.silent != null ? options.silent : this.ctx.options.suppressAPIEvents;
  if (silent !== true) {
    this.ctx.events.fire(events.UPDATE, {
      action: options.action ? options.action : updateActions.CHANGE_COORDINATES,
      features: [this.get(featureId).toGeoJSON()]
    });
  }
  return this;
};
Store.prototype.getChangedIds = function() {
  return this._changedFeatureIds.values();
};
Store.prototype.clearChangedIds = function() {
  this._changedFeatureIds.clear();
  return this;
};
Store.prototype.getAllIds = function() {
  return this._featureIds.values();
};
Store.prototype.add = function(feature, options = {}) {
  this._features[feature.id] = feature;
  this._featureIds.add(feature.id);
  this.featureCreated(feature.id, {
    silent: options.silent
  });
  return this;
};
Store.prototype.delete = function(featureIds, options = {}) {
  const deletedFeaturesToEmit = [];
  to_dense_array_default(featureIds).forEach((id) => {
    if (!this._featureIds.has(id)) return;
    this._featureIds.delete(id);
    this._selectedFeatureIds.delete(id);
    if (!options.silent) {
      if (deletedFeaturesToEmit.indexOf(this._features[id]) === -1) {
        deletedFeaturesToEmit.push(this._features[id].toGeoJSON());
      }
    }
    delete this._features[id];
    this.isDirty = true;
  });
  if (deletedFeaturesToEmit.length) {
    this.ctx.events.fire(events.DELETE, {
      features: deletedFeaturesToEmit
    });
  }
  refreshSelectedCoordinates(this, options);
  return this;
};
Store.prototype.get = function(id) {
  return this._features[id];
};
Store.prototype.getAll = function() {
  return Object.keys(this._features).map((id) => this._features[id]);
};
Store.prototype.select = function(featureIds, options = {}) {
  to_dense_array_default(featureIds).forEach((id) => {
    if (this._selectedFeatureIds.has(id)) return;
    this._selectedFeatureIds.add(id);
    this._changedFeatureIds.add(id);
    if (!options.silent) {
      this._emitSelectionChange = true;
    }
  });
  return this;
};
Store.prototype.deselect = function(featureIds, options = {}) {
  to_dense_array_default(featureIds).forEach((id) => {
    if (!this._selectedFeatureIds.has(id)) return;
    this._selectedFeatureIds.delete(id);
    this._changedFeatureIds.add(id);
    if (!options.silent) {
      this._emitSelectionChange = true;
    }
  });
  refreshSelectedCoordinates(this, options);
  return this;
};
Store.prototype.clearSelected = function(options = {}) {
  this.deselect(this._selectedFeatureIds.values(), {
    silent: options.silent
  });
  return this;
};
Store.prototype.setSelected = function(featureIds, options = {}) {
  featureIds = to_dense_array_default(featureIds);
  this.deselect(this._selectedFeatureIds.values().filter((id) => featureIds.indexOf(id) === -1), {
    silent: options.silent
  });
  this.select(featureIds.filter((id) => !this._selectedFeatureIds.has(id)), {
    silent: options.silent
  });
  return this;
};
Store.prototype.setSelectedCoordinates = function(coordinates) {
  this._selectedCoordinates = coordinates;
  this._emitSelectionChange = true;
  return this;
};
Store.prototype.clearSelectedCoordinates = function() {
  this._selectedCoordinates = [];
  this._emitSelectionChange = true;
  return this;
};
Store.prototype.getSelectedIds = function() {
  return this._selectedFeatureIds.values();
};
Store.prototype.getSelected = function() {
  return this.getSelectedIds().map((id) => this.get(id));
};
Store.prototype.getSelectedCoordinates = function() {
  const selected = this._selectedCoordinates.map((coordinate) => {
    const feature = this.get(coordinate.feature_id);
    return {
      coordinates: feature.getCoordinate(coordinate.coord_path)
    };
  });
  return selected;
};
Store.prototype.isSelected = function(featureId) {
  return this._selectedFeatureIds.has(featureId);
};
Store.prototype.setFeatureProperty = function(featureId, property, value, options = {}) {
  this.get(featureId).setProperty(property, value);
  this.featureChanged(featureId, {
    silent: options.silent,
    action: updateActions.CHANGE_PROPERTIES
  });
};
function refreshSelectedCoordinates(store, options = {}) {
  const newSelectedCoordinates = store._selectedCoordinates.filter((point) => store._selectedFeatureIds.has(point.feature_id));
  if (store._selectedCoordinates.length !== newSelectedCoordinates.length && !options.silent) {
    store._emitSelectionChange = true;
  }
  store._selectedCoordinates = newSelectedCoordinates;
}
Store.prototype.storeMapConfig = function() {
  interactions.forEach((interaction) => {
    const interactionSet = this.ctx.map[interaction];
    if (interactionSet) {
      this._mapInitialConfig[interaction] = this.ctx.map[interaction].isEnabled();
    }
  });
};
Store.prototype.restoreMapConfig = function() {
  Object.keys(this._mapInitialConfig).forEach((key) => {
    const value = this._mapInitialConfig[key];
    if (value) {
      this.ctx.map[key].enable();
    } else {
      this.ctx.map[key].disable();
    }
  });
};
Store.prototype.getInitialConfigValue = function(interaction) {
  if (this._mapInitialConfig[interaction] !== void 0) {
    return this._mapInitialConfig[interaction];
  } else {
    return true;
  }
};

// node_modules/@mapbox/mapbox-gl-draw/src/ui.js
var classTypes = ["mode", "feature", "mouse"];
function ui_default(ctx) {
  const buttonElements = {};
  let activeButton = null;
  let currentMapClasses = {
    mode: null,
    // e.g. mode-direct_select
    feature: null,
    // e.g. feature-vertex
    mouse: null
    // e.g. mouse-move
  };
  let nextMapClasses = {
    mode: null,
    feature: null,
    mouse: null
  };
  function clearMapClasses() {
    queueMapClasses({
      mode: null,
      feature: null,
      mouse: null
    });
    updateMapClasses();
  }
  function queueMapClasses(options) {
    nextMapClasses = Object.assign(nextMapClasses, options);
  }
  function updateMapClasses() {
    if (!ctx.container) return;
    const classesToRemove = [];
    const classesToAdd = [];
    classTypes.forEach((type) => {
      if (nextMapClasses[type] === currentMapClasses[type]) return;
      classesToRemove.push(`${type}-${currentMapClasses[type]}`);
      if (nextMapClasses[type] !== null) {
        classesToAdd.push(`${type}-${nextMapClasses[type]}`);
      }
    });
    if (classesToRemove.length > 0) {
      ctx.container.classList.remove(...classesToRemove);
    }
    if (classesToAdd.length > 0) {
      ctx.container.classList.add(...classesToAdd);
    }
    currentMapClasses = Object.assign(currentMapClasses, nextMapClasses);
  }
  function createControlButton(id, options = {}) {
    const button = document.createElement("button");
    button.className = `${classes.CONTROL_BUTTON} ${options.className}`;
    button.setAttribute("title", options.title);
    options.container.appendChild(button);
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const clickedButton = e.target;
      if (clickedButton === activeButton) {
        deactivateButtons();
        options.onDeactivate();
        return;
      }
      setActiveButton(id);
      options.onActivate();
    }, true);
    return button;
  }
  function deactivateButtons() {
    if (!activeButton) return;
    activeButton.classList.remove(classes.ACTIVE_BUTTON);
    activeButton = null;
  }
  function setActiveButton(id) {
    deactivateButtons();
    const button = buttonElements[id];
    if (!button) return;
    if (button && id !== "trash") {
      button.classList.add(classes.ACTIVE_BUTTON);
      activeButton = button;
    }
  }
  function addButtons() {
    const controls = ctx.options.controls;
    const controlGroup = document.createElement("div");
    controlGroup.className = `${classes.CONTROL_GROUP} ${classes.CONTROL_BASE}`;
    if (!controls) return controlGroup;
    if (controls[types.LINE]) {
      buttonElements[types.LINE] = createControlButton(types.LINE, {
        container: controlGroup,
        className: classes.CONTROL_BUTTON_LINE,
        title: `LineString tool ${ctx.options.keybindings ? "(l)" : ""}`,
        onActivate: () => ctx.events.changeMode(modes.DRAW_LINE_STRING),
        onDeactivate: () => ctx.events.trash()
      });
    }
    if (controls[types.POLYGON]) {
      buttonElements[types.POLYGON] = createControlButton(types.POLYGON, {
        container: controlGroup,
        className: classes.CONTROL_BUTTON_POLYGON,
        title: `Polygon tool ${ctx.options.keybindings ? "(p)" : ""}`,
        onActivate: () => ctx.events.changeMode(modes.DRAW_POLYGON),
        onDeactivate: () => ctx.events.trash()
      });
    }
    if (controls[types.POINT]) {
      buttonElements[types.POINT] = createControlButton(types.POINT, {
        container: controlGroup,
        className: classes.CONTROL_BUTTON_POINT,
        title: `Marker tool ${ctx.options.keybindings ? "(m)" : ""}`,
        onActivate: () => ctx.events.changeMode(modes.DRAW_POINT),
        onDeactivate: () => ctx.events.trash()
      });
    }
    if (controls.trash) {
      buttonElements.trash = createControlButton("trash", {
        container: controlGroup,
        className: classes.CONTROL_BUTTON_TRASH,
        title: "Delete",
        onActivate: () => {
          ctx.events.trash();
        }
      });
    }
    if (controls.combine_features) {
      buttonElements.combine_features = createControlButton("combineFeatures", {
        container: controlGroup,
        className: classes.CONTROL_BUTTON_COMBINE_FEATURES,
        title: "Combine",
        onActivate: () => {
          ctx.events.combineFeatures();
        }
      });
    }
    if (controls.uncombine_features) {
      buttonElements.uncombine_features = createControlButton("uncombineFeatures", {
        container: controlGroup,
        className: classes.CONTROL_BUTTON_UNCOMBINE_FEATURES,
        title: "Uncombine",
        onActivate: () => {
          ctx.events.uncombineFeatures();
        }
      });
    }
    return controlGroup;
  }
  function removeButtons() {
    Object.keys(buttonElements).forEach((buttonId) => {
      const button = buttonElements[buttonId];
      if (button.parentNode) {
        button.parentNode.removeChild(button);
      }
      delete buttonElements[buttonId];
    });
  }
  return {
    setActiveButton,
    queueMapClasses,
    updateMapClasses,
    clearMapClasses,
    addButtons,
    removeButtons
  };
}

// node_modules/@mapbox/mapbox-gl-draw/src/setup.js
function setup_default(ctx) {
  let controlContainer = null;
  let mapLoadedInterval = null;
  const setup = {
    onRemove() {
      ctx.map.off("load", setup.connect);
      clearInterval(mapLoadedInterval);
      setup.removeLayers();
      ctx.store.restoreMapConfig();
      ctx.ui.removeButtons();
      ctx.events.removeEventListeners();
      ctx.ui.clearMapClasses();
      if (ctx.boxZoomInitial) ctx.map.boxZoom.enable();
      ctx.map = null;
      ctx.container = null;
      ctx.store = null;
      if (controlContainer && controlContainer.parentNode) controlContainer.parentNode.removeChild(controlContainer);
      controlContainer = null;
      return this;
    },
    connect() {
      ctx.map.off("load", setup.connect);
      clearInterval(mapLoadedInterval);
      setup.addLayers();
      ctx.store.storeMapConfig();
      ctx.events.addEventListeners();
    },
    onAdd(map) {
      ctx.map = map;
      ctx.events = events_default(ctx);
      ctx.ui = ui_default(ctx);
      ctx.container = map.getContainer();
      ctx.store = new Store(ctx);
      controlContainer = ctx.ui.addButtons();
      if (ctx.options.boxSelect) {
        ctx.boxZoomInitial = map.boxZoom.isEnabled();
        map.boxZoom.disable();
        const dragPanIsEnabled = map.dragPan.isEnabled();
        map.dragPan.disable();
        map.dragPan.enable();
        if (!dragPanIsEnabled) {
          map.dragPan.disable();
        }
      }
      if (map.loaded()) {
        setup.connect();
      } else {
        map.on("load", setup.connect);
        mapLoadedInterval = setInterval(() => {
          if (map.loaded()) setup.connect();
        }, 16);
      }
      ctx.events.start();
      return controlContainer;
    },
    addLayers() {
      ctx.map.addSource(sources.COLD, {
        data: {
          type: geojsonTypes.FEATURE_COLLECTION,
          features: []
        },
        type: "geojson"
      });
      ctx.map.addSource(sources.HOT, {
        data: {
          type: geojsonTypes.FEATURE_COLLECTION,
          features: []
        },
        type: "geojson"
      });
      ctx.options.styles.forEach((style) => {
        ctx.map.addLayer(style);
      });
      ctx.store.setDirty(true);
      ctx.store.render();
    },
    // Check for layers and sources before attempting to remove
    // If user adds draw control and removes it before the map is loaded, layers and sources will be missing
    removeLayers() {
      ctx.options.styles.forEach((style) => {
        if (ctx.map.getLayer(style.id)) {
          ctx.map.removeLayer(style.id);
        }
      });
      if (ctx.map.getSource(sources.COLD)) {
        ctx.map.removeSource(sources.COLD);
      }
      if (ctx.map.getSource(sources.HOT)) {
        ctx.map.removeSource(sources.HOT);
      }
    }
  };
  ctx.setup = setup;
  return setup;
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/theme.js
var blue = "#3bb2d0";
var orange = "#fbb03b";
var white = "#fff";
var theme_default = [
  // Polygons
  //   Solid fill
  //   Active state defines color
  {
    "id": "gl-draw-polygon-fill",
    "type": "fill",
    "filter": ["all", ["==", "$type", "Polygon"]],
    "paint": {
      "fill-color": ["case", ["==", ["get", "active"], "true"], orange, blue],
      "fill-opacity": 0.1
    }
  },
  // Lines
  // Polygon
  //   Matches Lines AND Polygons
  //   Active state defines color
  {
    "id": "gl-draw-lines",
    "type": "line",
    "filter": ["any", ["==", "$type", "LineString"], ["==", "$type", "Polygon"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": ["case", ["==", ["get", "active"], "true"], orange, blue],
      "line-dasharray": ["case", ["==", ["get", "active"], "true"], [0.2, 2], [2, 0]],
      "line-width": 2
    }
  },
  // Points
  //   Circle with an outline
  //   Active state defines size and color
  {
    "id": "gl-draw-point-outer",
    "type": "circle",
    "filter": ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
    "paint": {
      "circle-radius": ["case", ["==", ["get", "active"], "true"], 7, 5],
      "circle-color": white
    }
  },
  {
    "id": "gl-draw-point-inner",
    "type": "circle",
    "filter": ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
    "paint": {
      "circle-radius": ["case", ["==", ["get", "active"], "true"], 5, 3],
      "circle-color": ["case", ["==", ["get", "active"], "true"], orange, blue]
    }
  },
  // Vertex
  //   Visible when editing polygons and lines
  //   Similar behaviour to Points
  //   Active state defines size
  {
    "id": "gl-draw-vertex-outer",
    "type": "circle",
    "filter": ["all", ["==", "$type", "Point"], ["==", "meta", "vertex"], ["!=", "mode", "simple_select"]],
    "paint": {
      "circle-radius": ["case", ["==", ["get", "active"], "true"], 7, 5],
      "circle-color": white
    }
  },
  {
    "id": "gl-draw-vertex-inner",
    "type": "circle",
    "filter": ["all", ["==", "$type", "Point"], ["==", "meta", "vertex"], ["!=", "mode", "simple_select"]],
    "paint": {
      "circle-radius": ["case", ["==", ["get", "active"], "true"], 5, 3],
      "circle-color": orange
    }
  },
  // Midpoint
  //   Visible when editing polygons and lines
  //   Tapping or dragging them adds a new vertex to the feature
  {
    "id": "gl-draw-midpoint",
    "type": "circle",
    "filter": ["all", ["==", "meta", "midpoint"]],
    "paint": {
      "circle-radius": 3,
      "circle-color": orange
    }
  }
];

// node_modules/@mapbox/mapbox-gl-draw/src/lib/common_selectors.js
var common_selectors_exports = {};
__export(common_selectors_exports, {
  isActiveFeature: () => isActiveFeature,
  isEnterKey: () => isEnterKey,
  isEscapeKey: () => isEscapeKey,
  isFeature: () => isFeature,
  isInactiveFeature: () => isInactiveFeature,
  isOfMetaType: () => isOfMetaType,
  isShiftDown: () => isShiftDown,
  isShiftMousedown: () => isShiftMousedown,
  isTrue: () => isTrue,
  isVertex: () => isVertex,
  noTarget: () => noTarget
});
function isOfMetaType(type) {
  return function(e) {
    const featureTarget = e.featureTarget;
    if (!featureTarget) return false;
    if (!featureTarget.properties) return false;
    return featureTarget.properties.meta === type;
  };
}
function isShiftMousedown(e) {
  if (!e.originalEvent) return false;
  if (!e.originalEvent.shiftKey) return false;
  return e.originalEvent.button === 0;
}
function isActiveFeature(e) {
  if (!e.featureTarget) return false;
  if (!e.featureTarget.properties) return false;
  return e.featureTarget.properties.active === activeStates.ACTIVE && e.featureTarget.properties.meta === meta.FEATURE;
}
function isInactiveFeature(e) {
  if (!e.featureTarget) return false;
  if (!e.featureTarget.properties) return false;
  return e.featureTarget.properties.active === activeStates.INACTIVE && e.featureTarget.properties.meta === meta.FEATURE;
}
function noTarget(e) {
  return e.featureTarget === void 0;
}
function isFeature(e) {
  if (!e.featureTarget) return false;
  if (!e.featureTarget.properties) return false;
  return e.featureTarget.properties.meta === meta.FEATURE;
}
function isVertex(e) {
  const featureTarget = e.featureTarget;
  if (!featureTarget) return false;
  if (!featureTarget.properties) return false;
  return featureTarget.properties.meta === meta.VERTEX;
}
function isShiftDown(e) {
  if (!e.originalEvent) return false;
  return e.originalEvent.shiftKey === true;
}
function isEscapeKey(e) {
  return e.keyCode === 27;
}
function isEnterKey(e) {
  return e.keyCode === 13;
}
function isTrue() {
  return true;
}

// node_modules/@mapbox/mapbox-gl-draw/node_modules/@mapbox/point-geometry/index.js
function Point2(x, y) {
  this.x = x;
  this.y = y;
}
Point2.prototype = {
  /**
   * Clone this point, returning a new point that can be modified
   * without affecting the old one.
   * @return {Point} the clone
   */
  clone() {
    return new Point2(this.x, this.y);
  },
  /**
   * Add this point's x & y coordinates to another point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  add(p) {
    return this.clone()._add(p);
  },
  /**
   * Subtract this point's x & y coordinates to from point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  sub(p) {
    return this.clone()._sub(p);
  },
  /**
   * Multiply this point's x & y coordinates by point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  multByPoint(p) {
    return this.clone()._multByPoint(p);
  },
  /**
   * Divide this point's x & y coordinates by point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  divByPoint(p) {
    return this.clone()._divByPoint(p);
  },
  /**
   * Multiply this point's x & y coordinates by a factor,
   * yielding a new point.
   * @param {number} k factor
   * @return {Point} output point
   */
  mult(k) {
    return this.clone()._mult(k);
  },
  /**
   * Divide this point's x & y coordinates by a factor,
   * yielding a new point.
   * @param {number} k factor
   * @return {Point} output point
   */
  div(k) {
    return this.clone()._div(k);
  },
  /**
   * Rotate this point around the 0, 0 origin by an angle a,
   * given in radians
   * @param {number} a angle to rotate around, in radians
   * @return {Point} output point
   */
  rotate(a) {
    return this.clone()._rotate(a);
  },
  /**
   * Rotate this point around p point by an angle a,
   * given in radians
   * @param {number} a angle to rotate around, in radians
   * @param {Point} p Point to rotate around
   * @return {Point} output point
   */
  rotateAround(a, p) {
    return this.clone()._rotateAround(a, p);
  },
  /**
   * Multiply this point by a 4x1 transformation matrix
   * @param {[number, number, number, number]} m transformation matrix
   * @return {Point} output point
   */
  matMult(m) {
    return this.clone()._matMult(m);
  },
  /**
   * Calculate this point but as a unit vector from 0, 0, meaning
   * that the distance from the resulting point to the 0, 0
   * coordinate will be equal to 1 and the angle from the resulting
   * point to the 0, 0 coordinate will be the same as before.
   * @return {Point} unit vector point
   */
  unit() {
    return this.clone()._unit();
  },
  /**
   * Compute a perpendicular point, where the new y coordinate
   * is the old x coordinate and the new x coordinate is the old y
   * coordinate multiplied by -1
   * @return {Point} perpendicular point
   */
  perp() {
    return this.clone()._perp();
  },
  /**
   * Return a version of this point with the x & y coordinates
   * rounded to integers.
   * @return {Point} rounded point
   */
  round() {
    return this.clone()._round();
  },
  /**
   * Return the magnitude of this point: this is the Euclidean
   * distance from the 0, 0 coordinate to this point's x and y
   * coordinates.
   * @return {number} magnitude
   */
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  /**
   * Judge whether this point is equal to another point, returning
   * true or false.
   * @param {Point} other the other point
   * @return {boolean} whether the points are equal
   */
  equals(other) {
    return this.x === other.x && this.y === other.y;
  },
  /**
   * Calculate the distance from this point to another point
   * @param {Point} p the other point
   * @return {number} distance
   */
  dist(p) {
    return Math.sqrt(this.distSqr(p));
  },
  /**
   * Calculate the distance from this point to another point,
   * without the square root step. Useful if you're comparing
   * relative distances.
   * @param {Point} p the other point
   * @return {number} distance
   */
  distSqr(p) {
    const dx = p.x - this.x, dy = p.y - this.y;
    return dx * dx + dy * dy;
  },
  /**
   * Get the angle from the 0, 0 coordinate to this point, in radians
   * coordinates.
   * @return {number} angle
   */
  angle() {
    return Math.atan2(this.y, this.x);
  },
  /**
   * Get the angle from this point to another point, in radians
   * @param {Point} b the other point
   * @return {number} angle
   */
  angleTo(b) {
    return Math.atan2(this.y - b.y, this.x - b.x);
  },
  /**
   * Get the angle between this point and another point, in radians
   * @param {Point} b the other point
   * @return {number} angle
   */
  angleWith(b) {
    return this.angleWithSep(b.x, b.y);
  },
  /**
   * Find the angle of the two vectors, solving the formula for
   * the cross product a x b = |a||b|sin(θ) for θ.
   * @param {number} x the x-coordinate
   * @param {number} y the y-coordinate
   * @return {number} the angle in radians
   */
  angleWithSep(x, y) {
    return Math.atan2(this.x * y - this.y * x, this.x * x + this.y * y);
  },
  /** @param {[number, number, number, number]} m */
  _matMult(m) {
    const x = m[0] * this.x + m[1] * this.y, y = m[2] * this.x + m[3] * this.y;
    this.x = x;
    this.y = y;
    return this;
  },
  /** @param {Point} p */
  _add(p) {
    this.x += p.x;
    this.y += p.y;
    return this;
  },
  /** @param {Point} p */
  _sub(p) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  },
  /** @param {number} k */
  _mult(k) {
    this.x *= k;
    this.y *= k;
    return this;
  },
  /** @param {number} k */
  _div(k) {
    this.x /= k;
    this.y /= k;
    return this;
  },
  /** @param {Point} p */
  _multByPoint(p) {
    this.x *= p.x;
    this.y *= p.y;
    return this;
  },
  /** @param {Point} p */
  _divByPoint(p) {
    this.x /= p.x;
    this.y /= p.y;
    return this;
  },
  _unit() {
    this._div(this.mag());
    return this;
  },
  _perp() {
    const y = this.y;
    this.y = this.x;
    this.x = -y;
    return this;
  },
  /** @param {number} angle */
  _rotate(angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle), x = cos * this.x - sin * this.y, y = sin * this.x + cos * this.y;
    this.x = x;
    this.y = y;
    return this;
  },
  /**
   * @param {number} angle
   * @param {Point} p
   */
  _rotateAround(angle, p) {
    const cos = Math.cos(angle), sin = Math.sin(angle), x = p.x + cos * (this.x - p.x) - sin * (this.y - p.y), y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y);
    this.x = x;
    this.y = y;
    return this;
  },
  _round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  },
  constructor: Point2
};
Point2.convert = function(p) {
  if (p instanceof Point2) {
    return (
      /** @type {Point} */
      p
    );
  }
  if (Array.isArray(p)) {
    return new Point2(+p[0], +p[1]);
  }
  if (p.x !== void 0 && p.y !== void 0) {
    return new Point2(+p.x, +p.y);
  }
  throw new Error("Expected [x, y] or {x, y} point format");
};

// node_modules/@mapbox/mapbox-gl-draw/src/lib/mouse_event_point.js
function mouseEventPoint(mouseEvent, container) {
  const rect = container.getBoundingClientRect();
  return new Point2(mouseEvent.clientX - rect.left - (container.clientLeft || 0), mouseEvent.clientY - rect.top - (container.clientTop || 0));
}
var mouse_event_point_default = mouseEventPoint;

// node_modules/@mapbox/mapbox-gl-draw/src/lib/create_vertex.js
function create_vertex_default(parentId, coordinates, path, selected) {
  return {
    type: geojsonTypes.FEATURE,
    properties: {
      meta: meta.VERTEX,
      parent: parentId,
      coord_path: path,
      active: selected ? activeStates.ACTIVE : activeStates.INACTIVE
    },
    geometry: {
      type: geojsonTypes.POINT,
      coordinates
    }
  };
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/create_midpoint.js
function create_midpoint_default(parent, startVertex, endVertex) {
  const startCoord = startVertex.geometry.coordinates;
  const endCoord = endVertex.geometry.coordinates;
  if (startCoord[1] > LAT_RENDERED_MAX || startCoord[1] < LAT_RENDERED_MIN || endCoord[1] > LAT_RENDERED_MAX || endCoord[1] < LAT_RENDERED_MIN) {
    return null;
  }
  const mid = {
    lng: (startCoord[0] + endCoord[0]) / 2,
    lat: (startCoord[1] + endCoord[1]) / 2
  };
  return {
    type: geojsonTypes.FEATURE,
    properties: {
      meta: meta.MIDPOINT,
      parent,
      lng: mid.lng,
      lat: mid.lat,
      coord_path: endVertex.properties.coord_path
    },
    geometry: {
      type: geojsonTypes.POINT,
      coordinates: [mid.lng, mid.lat]
    }
  };
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/create_supplementary_points.js
function createSupplementaryPoints(geojson, options = {}, basePath = null) {
  const {
    type,
    coordinates
  } = geojson.geometry;
  const featureId = geojson.properties && geojson.properties.id;
  let supplementaryPoints = [];
  if (type === geojsonTypes.POINT) {
    supplementaryPoints.push(create_vertex_default(featureId, coordinates, basePath, isSelectedPath(basePath)));
  } else if (type === geojsonTypes.POLYGON) {
    coordinates.forEach((line, lineIndex) => {
      processLine(line, basePath !== null ? `${basePath}.${lineIndex}` : String(lineIndex));
    });
  } else if (type === geojsonTypes.LINE_STRING) {
    processLine(coordinates, basePath);
  } else if (type.indexOf(geojsonTypes.MULTI_PREFIX) === 0) {
    processMultiGeometry();
  }
  function processLine(line, lineBasePath) {
    let firstPointString = "";
    let lastVertex = null;
    line.forEach((point, pointIndex) => {
      const pointPath = lineBasePath !== void 0 && lineBasePath !== null ? `${lineBasePath}.${pointIndex}` : String(pointIndex);
      const vertex = create_vertex_default(featureId, point, pointPath, isSelectedPath(pointPath));
      if (options.midpoints && lastVertex) {
        const midpoint = create_midpoint_default(featureId, lastVertex, vertex);
        if (midpoint) {
          supplementaryPoints.push(midpoint);
        }
      }
      lastVertex = vertex;
      const stringifiedPoint = JSON.stringify(point);
      if (firstPointString !== stringifiedPoint) {
        supplementaryPoints.push(vertex);
      }
      if (pointIndex === 0) {
        firstPointString = stringifiedPoint;
      }
    });
  }
  function isSelectedPath(path) {
    if (!options.selectedPaths) return false;
    return options.selectedPaths.indexOf(path) !== -1;
  }
  function processMultiGeometry() {
    const subType = type.replace(geojsonTypes.MULTI_PREFIX, "");
    coordinates.forEach((subCoordinates, index) => {
      const subFeature = {
        type: geojsonTypes.FEATURE,
        properties: geojson.properties,
        geometry: {
          type: subType,
          coordinates: subCoordinates
        }
      };
      supplementaryPoints = supplementaryPoints.concat(createSupplementaryPoints(subFeature, options, index));
    });
  }
  return supplementaryPoints;
}
var create_supplementary_points_default = createSupplementaryPoints;

// node_modules/@mapbox/mapbox-gl-draw/src/lib/double_click_zoom.js
var double_click_zoom_default = {
  enable(ctx) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) return;
      if (!ctx._ctx.store.getInitialConfigValue("doubleClickZoom")) return;
      ctx.map.doubleClickZoom.enable();
    }, 0);
  },
  disable(ctx) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom) return;
      ctx.map.doubleClickZoom.disable();
    }, 0);
  }
};

// node_modules/@mapbox/mapbox-gl-draw/src/lib/constrain_feature_movement.js
var {
  LAT_MIN: LAT_MIN2,
  LAT_MAX: LAT_MAX2,
  LAT_RENDERED_MIN: LAT_RENDERED_MIN2,
  LAT_RENDERED_MAX: LAT_RENDERED_MAX2,
  LNG_MIN: LNG_MIN2,
  LNG_MAX: LNG_MAX2
} = constants_exports;
function extent(feature) {
  const depth = {
    Point: 0,
    LineString: 1,
    Polygon: 2,
    MultiPoint: 1,
    MultiLineString: 2,
    MultiPolygon: 3
  }[feature.geometry.type];
  const coords = [feature.geometry.coordinates].flat(depth);
  const lngs = coords.map((coord) => coord[0]);
  const lats = coords.map((coord) => coord[1]);
  const min = (vals) => Math.min.apply(null, vals);
  const max = (vals) => Math.max.apply(null, vals);
  return [min(lngs), min(lats), max(lngs), max(lats)];
}
function constrain_feature_movement_default(geojsonFeatures, delta) {
  let northInnerEdge = LAT_MIN2;
  let southInnerEdge = LAT_MAX2;
  let northOuterEdge = LAT_MIN2;
  let southOuterEdge = LAT_MAX2;
  let westEdge = LNG_MAX2;
  let eastEdge = LNG_MIN2;
  geojsonFeatures.forEach((feature) => {
    const bounds = extent(feature);
    const featureSouthEdge = bounds[1];
    const featureNorthEdge = bounds[3];
    const featureWestEdge = bounds[0];
    const featureEastEdge = bounds[2];
    if (featureSouthEdge > northInnerEdge) northInnerEdge = featureSouthEdge;
    if (featureNorthEdge < southInnerEdge) southInnerEdge = featureNorthEdge;
    if (featureNorthEdge > northOuterEdge) northOuterEdge = featureNorthEdge;
    if (featureSouthEdge < southOuterEdge) southOuterEdge = featureSouthEdge;
    if (featureWestEdge < westEdge) westEdge = featureWestEdge;
    if (featureEastEdge > eastEdge) eastEdge = featureEastEdge;
  });
  const constrainedDelta = delta;
  if (northInnerEdge + constrainedDelta.lat > LAT_RENDERED_MAX2) {
    constrainedDelta.lat = LAT_RENDERED_MAX2 - northInnerEdge;
  }
  if (northOuterEdge + constrainedDelta.lat > LAT_MAX2) {
    constrainedDelta.lat = LAT_MAX2 - northOuterEdge;
  }
  if (southInnerEdge + constrainedDelta.lat < LAT_RENDERED_MIN2) {
    constrainedDelta.lat = LAT_RENDERED_MIN2 - southInnerEdge;
  }
  if (southOuterEdge + constrainedDelta.lat < LAT_MIN2) {
    constrainedDelta.lat = LAT_MIN2 - southOuterEdge;
  }
  if (westEdge + constrainedDelta.lng <= LNG_MIN2) {
    constrainedDelta.lng += Math.ceil(Math.abs(constrainedDelta.lng) / 360) * 360;
  }
  if (eastEdge + constrainedDelta.lng >= LNG_MAX2) {
    constrainedDelta.lng -= Math.ceil(Math.abs(constrainedDelta.lng) / 360) * 360;
  }
  return constrainedDelta;
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/move_features.js
function move_features_default(features, delta) {
  const constrainedDelta = constrain_feature_movement_default(features.map((feature) => feature.toGeoJSON()), delta);
  features.forEach((feature) => {
    const currentCoordinates = feature.getCoordinates();
    const moveCoordinate = (coord) => {
      const point = {
        lng: coord[0] + constrainedDelta.lng,
        lat: coord[1] + constrainedDelta.lat
      };
      return [point.lng, point.lat];
    };
    const moveRing = (ring) => ring.map((coord) => moveCoordinate(coord));
    const moveMultiPolygon = (multi) => multi.map((ring) => moveRing(ring));
    let nextCoordinates;
    if (feature.type === geojsonTypes.POINT) {
      nextCoordinates = moveCoordinate(currentCoordinates);
    } else if (feature.type === geojsonTypes.LINE_STRING || feature.type === geojsonTypes.MULTI_POINT) {
      nextCoordinates = currentCoordinates.map(moveCoordinate);
    } else if (feature.type === geojsonTypes.POLYGON || feature.type === geojsonTypes.MULTI_LINE_STRING) {
      nextCoordinates = currentCoordinates.map(moveRing);
    } else if (feature.type === geojsonTypes.MULTI_POLYGON) {
      nextCoordinates = currentCoordinates.map(moveMultiPolygon);
    }
    feature.incomingCoords(nextCoordinates);
  });
}

// node_modules/@mapbox/mapbox-gl-draw/src/modes/simple_select.js
var SimpleSelect = {};
SimpleSelect.onSetup = function(opts) {
  const state = {
    dragMoveLocation: null,
    boxSelectStartLocation: null,
    boxSelectElement: void 0,
    boxSelecting: false,
    canBoxSelect: false,
    dragMoving: false,
    canDragMove: false,
    initialDragPanState: this.map.dragPan.isEnabled(),
    initiallySelectedFeatureIds: opts.featureIds || []
  };
  this.setSelected(state.initiallySelectedFeatureIds.filter((id) => this.getFeature(id) !== void 0));
  this.fireActionable();
  this.setActionableState({
    combineFeatures: true,
    uncombineFeatures: true,
    trash: true
  });
  return state;
};
SimpleSelect.fireUpdate = function() {
  this.fire(events.UPDATE, {
    action: updateActions.MOVE,
    features: this.getSelected().map((f) => f.toGeoJSON())
  });
};
SimpleSelect.fireActionable = function() {
  const selectedFeatures = this.getSelected();
  const multiFeatures = selectedFeatures.filter((feature) => this.isInstanceOf("MultiFeature", feature));
  let combineFeatures = false;
  if (selectedFeatures.length > 1) {
    combineFeatures = true;
    const featureType = selectedFeatures[0].type.replace("Multi", "");
    selectedFeatures.forEach((feature) => {
      if (feature.type.replace("Multi", "") !== featureType) {
        combineFeatures = false;
      }
    });
  }
  const uncombineFeatures = multiFeatures.length > 0;
  const trash = selectedFeatures.length > 0;
  this.setActionableState({
    combineFeatures,
    uncombineFeatures,
    trash
  });
};
SimpleSelect.getUniqueIds = function(allFeatures) {
  if (!allFeatures.length) return [];
  const ids = allFeatures.map((s) => s.properties.id).filter((id) => id !== void 0).reduce((memo, id) => {
    memo.add(id);
    return memo;
  }, new string_set_default());
  return ids.values();
};
SimpleSelect.stopExtendedInteractions = function(state) {
  if (state.boxSelectElement) {
    if (state.boxSelectElement.parentNode) state.boxSelectElement.parentNode.removeChild(state.boxSelectElement);
    state.boxSelectElement = null;
  }
  if ((state.canDragMove || state.canBoxSelect) && state.initialDragPanState === true) {
    this.map.dragPan.enable();
  }
  state.boxSelecting = false;
  state.canBoxSelect = false;
  state.dragMoving = false;
  state.canDragMove = false;
};
SimpleSelect.onStop = function() {
  double_click_zoom_default.enable(this);
};
SimpleSelect.onMouseMove = function(state, e) {
  const isFeature2 = isFeature(e);
  if (isFeature2 && state.dragMoving) this.fireUpdate();
  this.stopExtendedInteractions(state);
  return true;
};
SimpleSelect.onMouseOut = function(state) {
  if (state.dragMoving) return this.fireUpdate();
  return true;
};
SimpleSelect.onTap = SimpleSelect.onClick = function(state, e) {
  if (noTarget(e)) return this.clickAnywhere(state, e);
  if (isOfMetaType(meta.VERTEX)(e)) return this.clickOnVertex(state, e);
  if (isFeature(e)) return this.clickOnFeature(state, e);
};
SimpleSelect.clickAnywhere = function(state) {
  const wasSelected = this.getSelectedIds();
  if (wasSelected.length) {
    this.clearSelectedFeatures();
    wasSelected.forEach((id) => this.doRender(id));
  }
  double_click_zoom_default.enable(this);
  this.stopExtendedInteractions(state);
};
SimpleSelect.clickOnVertex = function(state, e) {
  this.changeMode(modes.DIRECT_SELECT, {
    featureId: e.featureTarget.properties.parent,
    coordPath: e.featureTarget.properties.coord_path,
    startPos: e.lngLat
  });
  this.updateUIClasses({
    mouse: cursors.MOVE
  });
};
SimpleSelect.startOnActiveFeature = function(state, e) {
  this.stopExtendedInteractions(state);
  this.map.dragPan.disable();
  this.doRender(e.featureTarget.properties.id);
  state.canDragMove = true;
  state.dragMoveLocation = e.lngLat;
};
SimpleSelect.clickOnFeature = function(state, e) {
  double_click_zoom_default.disable(this);
  this.stopExtendedInteractions(state);
  const isShiftClick = isShiftDown(e);
  const selectedFeatureIds = this.getSelectedIds();
  const featureId = e.featureTarget.properties.id;
  const isFeatureSelected = this.isSelected(featureId);
  if (!isShiftClick && isFeatureSelected && this.getFeature(featureId).type !== geojsonTypes.POINT) {
    return this.changeMode(modes.DIRECT_SELECT, {
      featureId
    });
  }
  if (isFeatureSelected && isShiftClick) {
    this.deselect(featureId);
    this.updateUIClasses({
      mouse: cursors.POINTER
    });
    if (selectedFeatureIds.length === 1) {
      double_click_zoom_default.enable(this);
    }
  } else if (!isFeatureSelected && isShiftClick) {
    this.select(featureId);
    this.updateUIClasses({
      mouse: cursors.MOVE
    });
  } else if (!isFeatureSelected && !isShiftClick) {
    selectedFeatureIds.forEach((id) => this.doRender(id));
    this.setSelected(featureId);
    this.updateUIClasses({
      mouse: cursors.MOVE
    });
  }
  this.doRender(featureId);
};
SimpleSelect.onMouseDown = function(state, e) {
  state.initialDragPanState = this.map.dragPan.isEnabled();
  if (isActiveFeature(e)) return this.startOnActiveFeature(state, e);
  if (this.drawConfig.boxSelect && isShiftMousedown(e)) return this.startBoxSelect(state, e);
};
SimpleSelect.startBoxSelect = function(state, e) {
  this.stopExtendedInteractions(state);
  this.map.dragPan.disable();
  state.boxSelectStartLocation = mouse_event_point_default(e.originalEvent, this.map.getContainer());
  state.canBoxSelect = true;
};
SimpleSelect.onTouchStart = function(state, e) {
  if (isActiveFeature(e)) return this.startOnActiveFeature(state, e);
};
SimpleSelect.onDrag = function(state, e) {
  if (state.canDragMove) return this.dragMove(state, e);
  if (this.drawConfig.boxSelect && state.canBoxSelect) return this.whileBoxSelect(state, e);
};
SimpleSelect.whileBoxSelect = function(state, e) {
  state.boxSelecting = true;
  this.updateUIClasses({
    mouse: cursors.ADD
  });
  if (!state.boxSelectElement) {
    state.boxSelectElement = document.createElement("div");
    state.boxSelectElement.classList.add(classes.BOX_SELECT);
    this.map.getContainer().appendChild(state.boxSelectElement);
  }
  const current = mouse_event_point_default(e.originalEvent, this.map.getContainer());
  const minX = Math.min(state.boxSelectStartLocation.x, current.x);
  const maxX = Math.max(state.boxSelectStartLocation.x, current.x);
  const minY = Math.min(state.boxSelectStartLocation.y, current.y);
  const maxY = Math.max(state.boxSelectStartLocation.y, current.y);
  const translateValue = `translate(${minX}px, ${minY}px)`;
  state.boxSelectElement.style.transform = translateValue;
  state.boxSelectElement.style.WebkitTransform = translateValue;
  state.boxSelectElement.style.width = `${maxX - minX}px`;
  state.boxSelectElement.style.height = `${maxY - minY}px`;
};
SimpleSelect.dragMove = function(state, e) {
  state.dragMoving = true;
  e.originalEvent.stopPropagation();
  const delta = {
    lng: e.lngLat.lng - state.dragMoveLocation.lng,
    lat: e.lngLat.lat - state.dragMoveLocation.lat
  };
  move_features_default(this.getSelected(), delta);
  state.dragMoveLocation = e.lngLat;
};
SimpleSelect.onTouchEnd = SimpleSelect.onMouseUp = function(state, e) {
  if (state.dragMoving) {
    this.fireUpdate();
  } else if (state.boxSelecting) {
    const bbox = [state.boxSelectStartLocation, mouse_event_point_default(e.originalEvent, this.map.getContainer())];
    const featuresInBox = this.featuresAt(null, bbox, "click");
    const idsToSelect = this.getUniqueIds(featuresInBox).filter((id) => !this.isSelected(id));
    if (idsToSelect.length) {
      this.select(idsToSelect);
      idsToSelect.forEach((id) => this.doRender(id));
      this.updateUIClasses({
        mouse: cursors.MOVE
      });
    }
  }
  this.stopExtendedInteractions(state);
};
SimpleSelect.toDisplayFeatures = function(state, geojson, display) {
  geojson.properties.active = this.isSelected(geojson.properties.id) ? activeStates.ACTIVE : activeStates.INACTIVE;
  display(geojson);
  this.fireActionable();
  if (geojson.properties.active !== activeStates.ACTIVE || geojson.geometry.type === geojsonTypes.POINT) return;
  create_supplementary_points_default(geojson).forEach(display);
};
SimpleSelect.onTrash = function() {
  this.deleteFeature(this.getSelectedIds());
  this.fireActionable();
};
SimpleSelect.onCombineFeatures = function() {
  const selectedFeatures = this.getSelected();
  if (selectedFeatures.length === 0 || selectedFeatures.length < 2) return;
  const coordinates = [], featuresCombined = [];
  const featureType = selectedFeatures[0].type.replace("Multi", "");
  for (let i = 0; i < selectedFeatures.length; i++) {
    const feature = selectedFeatures[i];
    if (feature.type.replace("Multi", "") !== featureType) {
      return;
    }
    if (feature.type.includes("Multi")) {
      feature.getCoordinates().forEach((subcoords) => {
        coordinates.push(subcoords);
      });
    } else {
      coordinates.push(feature.getCoordinates());
    }
    featuresCombined.push(feature.toGeoJSON());
  }
  if (featuresCombined.length > 1) {
    const multiFeature = this.newFeature({
      type: geojsonTypes.FEATURE,
      properties: featuresCombined[0].properties,
      geometry: {
        type: `Multi${featureType}`,
        coordinates
      }
    });
    this.addFeature(multiFeature);
    this.deleteFeature(this.getSelectedIds(), {
      silent: true
    });
    this.setSelected([multiFeature.id]);
    this.fire(events.COMBINE_FEATURES, {
      createdFeatures: [multiFeature.toGeoJSON()],
      deletedFeatures: featuresCombined
    });
  }
  this.fireActionable();
};
SimpleSelect.onUncombineFeatures = function() {
  const selectedFeatures = this.getSelected();
  if (selectedFeatures.length === 0) return;
  const createdFeatures = [];
  const featuresUncombined = [];
  for (let i = 0; i < selectedFeatures.length; i++) {
    const feature = selectedFeatures[i];
    if (this.isInstanceOf("MultiFeature", feature)) {
      feature.getFeatures().forEach((subFeature) => {
        this.addFeature(subFeature);
        subFeature.properties = feature.properties;
        createdFeatures.push(subFeature.toGeoJSON());
        this.select([subFeature.id]);
      });
      this.deleteFeature(feature.id, {
        silent: true
      });
      featuresUncombined.push(feature.toGeoJSON());
    }
  }
  if (createdFeatures.length > 1) {
    this.fire(events.UNCOMBINE_FEATURES, {
      createdFeatures,
      deletedFeatures: featuresUncombined
    });
  }
  this.fireActionable();
};
var simple_select_default = SimpleSelect;

// node_modules/@mapbox/mapbox-gl-draw/src/modes/direct_select.js
var isVertex2 = isOfMetaType(meta.VERTEX);
var isMidpoint = isOfMetaType(meta.MIDPOINT);
var DirectSelect = {};
DirectSelect.fireUpdate = function() {
  this.fire(events.UPDATE, {
    action: updateActions.CHANGE_COORDINATES,
    features: this.getSelected().map((f) => f.toGeoJSON())
  });
};
DirectSelect.fireActionable = function(state) {
  this.setActionableState({
    combineFeatures: false,
    uncombineFeatures: false,
    trash: state.selectedCoordPaths.length > 0
  });
};
DirectSelect.startDragging = function(state, e) {
  state.initialDragPanState = this.map.dragPan.isEnabled();
  this.map.dragPan.disable();
  state.canDragMove = true;
  state.dragMoveLocation = e.lngLat;
};
DirectSelect.stopDragging = function(state) {
  if (state.canDragMove && state.initialDragPanState === true) {
    this.map.dragPan.enable();
  }
  state.dragMoving = false;
  state.canDragMove = false;
  state.dragMoveLocation = null;
};
DirectSelect.onVertex = function(state, e) {
  this.startDragging(state, e);
  const about = e.featureTarget.properties;
  const selectedIndex = state.selectedCoordPaths.indexOf(about.coord_path);
  if (!isShiftDown(e) && selectedIndex === -1) {
    state.selectedCoordPaths = [about.coord_path];
  } else if (isShiftDown(e) && selectedIndex === -1) {
    state.selectedCoordPaths.push(about.coord_path);
  }
  const selectedCoordinates = this.pathsToCoordinates(state.featureId, state.selectedCoordPaths);
  this.setSelectedCoordinates(selectedCoordinates);
};
DirectSelect.onMidpoint = function(state, e) {
  this.startDragging(state, e);
  const about = e.featureTarget.properties;
  state.feature.addCoordinate(about.coord_path, about.lng, about.lat);
  this.fireUpdate();
  state.selectedCoordPaths = [about.coord_path];
};
DirectSelect.pathsToCoordinates = function(featureId, paths) {
  return paths.map((coord_path) => ({
    feature_id: featureId,
    coord_path
  }));
};
DirectSelect.onFeature = function(state, e) {
  if (state.selectedCoordPaths.length === 0) this.startDragging(state, e);
  else this.stopDragging(state);
};
DirectSelect.dragFeature = function(state, e, delta) {
  move_features_default(this.getSelected(), delta);
  state.dragMoveLocation = e.lngLat;
};
DirectSelect.dragVertex = function(state, e, delta) {
  const selectedCoords = state.selectedCoordPaths.map((coord_path) => state.feature.getCoordinate(coord_path));
  const selectedCoordPoints = selectedCoords.map((coords) => ({
    type: geojsonTypes.FEATURE,
    properties: {},
    geometry: {
      type: geojsonTypes.POINT,
      coordinates: coords
    }
  }));
  const constrainedDelta = constrain_feature_movement_default(selectedCoordPoints, delta);
  for (let i = 0; i < selectedCoords.length; i++) {
    const coord = selectedCoords[i];
    state.feature.updateCoordinate(state.selectedCoordPaths[i], coord[0] + constrainedDelta.lng, coord[1] + constrainedDelta.lat);
  }
};
DirectSelect.clickNoTarget = function() {
  this.changeMode(modes.SIMPLE_SELECT);
};
DirectSelect.clickInactive = function() {
  this.changeMode(modes.SIMPLE_SELECT);
};
DirectSelect.clickActiveFeature = function(state) {
  state.selectedCoordPaths = [];
  this.clearSelectedCoordinates();
  state.feature.changed();
};
DirectSelect.onSetup = function(opts) {
  const featureId = opts.featureId;
  const feature = this.getFeature(featureId);
  if (!feature) {
    throw new Error("You must provide a featureId to enter direct_select mode");
  }
  if (feature.type === geojsonTypes.POINT) {
    throw new TypeError("direct_select mode doesn't handle point features");
  }
  const state = {
    featureId,
    feature,
    dragMoveLocation: opts.startPos || null,
    dragMoving: false,
    canDragMove: false,
    selectedCoordPaths: opts.coordPath ? [opts.coordPath] : []
  };
  this.setSelectedCoordinates(this.pathsToCoordinates(featureId, state.selectedCoordPaths));
  this.setSelected(featureId);
  double_click_zoom_default.disable(this);
  this.setActionableState({
    trash: true
  });
  return state;
};
DirectSelect.onStop = function() {
  double_click_zoom_default.enable(this);
  this.clearSelectedCoordinates();
};
DirectSelect.toDisplayFeatures = function(state, geojson, push) {
  if (state.featureId === geojson.properties.id) {
    geojson.properties.active = activeStates.ACTIVE;
    push(geojson);
    create_supplementary_points_default(geojson, {
      map: this.map,
      midpoints: true,
      selectedPaths: state.selectedCoordPaths
    }).forEach(push);
  } else {
    geojson.properties.active = activeStates.INACTIVE;
    push(geojson);
  }
  this.fireActionable(state);
};
DirectSelect.onTrash = function(state) {
  state.selectedCoordPaths.sort((a, b) => b.localeCompare(a, "en", {
    numeric: true
  })).forEach((id) => state.feature.removeCoordinate(id));
  this.fireUpdate();
  state.selectedCoordPaths = [];
  this.clearSelectedCoordinates();
  this.fireActionable(state);
  if (state.feature.isValid() === false) {
    this.deleteFeature([state.featureId]);
    this.changeMode(modes.SIMPLE_SELECT, {});
  }
};
DirectSelect.onMouseMove = function(state, e) {
  const isFeature2 = isActiveFeature(e);
  const onVertex = isVertex2(e);
  const isMidPoint = isMidpoint(e);
  const noCoords = state.selectedCoordPaths.length === 0;
  if (isFeature2 && noCoords) this.updateUIClasses({
    mouse: cursors.MOVE
  });
  else if (onVertex && !noCoords) this.updateUIClasses({
    mouse: cursors.MOVE
  });
  else this.updateUIClasses({
    mouse: cursors.NONE
  });
  const isDraggableItem = onVertex || isFeature2 || isMidPoint;
  if (isDraggableItem && state.dragMoving) this.fireUpdate();
  this.stopDragging(state);
  return true;
};
DirectSelect.onMouseOut = function(state) {
  if (state.dragMoving) this.fireUpdate();
  return true;
};
DirectSelect.onTouchStart = DirectSelect.onMouseDown = function(state, e) {
  if (isVertex2(e)) return this.onVertex(state, e);
  if (isActiveFeature(e)) return this.onFeature(state, e);
  if (isMidpoint(e)) return this.onMidpoint(state, e);
};
DirectSelect.onDrag = function(state, e) {
  if (state.canDragMove !== true) return;
  state.dragMoving = true;
  e.originalEvent.stopPropagation();
  const delta = {
    lng: e.lngLat.lng - state.dragMoveLocation.lng,
    lat: e.lngLat.lat - state.dragMoveLocation.lat
  };
  if (state.selectedCoordPaths.length > 0) this.dragVertex(state, e, delta);
  else this.dragFeature(state, e, delta);
  state.dragMoveLocation = e.lngLat;
};
DirectSelect.onClick = function(state, e) {
  if (noTarget(e)) return this.clickNoTarget(state, e);
  if (isActiveFeature(e)) return this.clickActiveFeature(state, e);
  if (isInactiveFeature(e)) return this.clickInactive(state, e);
  this.stopDragging(state);
};
DirectSelect.onTap = function(state, e) {
  if (noTarget(e)) return this.clickNoTarget(state, e);
  if (isActiveFeature(e)) return this.clickActiveFeature(state, e);
  if (isInactiveFeature(e)) return this.clickInactive(state, e);
};
DirectSelect.onTouchEnd = DirectSelect.onMouseUp = function(state) {
  if (state.dragMoving) {
    this.fireUpdate();
  }
  this.stopDragging(state);
};
var direct_select_default = DirectSelect;

// node_modules/@mapbox/mapbox-gl-draw/src/modes/draw_point.js
var DrawPoint = {};
DrawPoint.onSetup = function() {
  const point = this.newFeature({
    type: geojsonTypes.FEATURE,
    properties: {},
    geometry: {
      type: geojsonTypes.POINT,
      coordinates: []
    }
  });
  this.addFeature(point);
  this.clearSelectedFeatures();
  this.updateUIClasses({
    mouse: cursors.ADD
  });
  this.activateUIButton(types.POINT);
  this.setActionableState({
    trash: true
  });
  return {
    point
  };
};
DrawPoint.stopDrawingAndRemove = function(state) {
  this.deleteFeature([state.point.id], {
    silent: true
  });
  this.changeMode(modes.SIMPLE_SELECT);
};
DrawPoint.onTap = DrawPoint.onClick = function(state, e) {
  this.updateUIClasses({
    mouse: cursors.MOVE
  });
  state.point.updateCoordinate("", e.lngLat.lng, e.lngLat.lat);
  this.fire(events.CREATE, {
    features: [state.point.toGeoJSON()]
  });
  this.changeMode(modes.SIMPLE_SELECT, {
    featureIds: [state.point.id]
  });
};
DrawPoint.onStop = function(state) {
  this.activateUIButton();
  if (!state.point.getCoordinate().length) {
    this.deleteFeature([state.point.id], {
      silent: true
    });
  }
};
DrawPoint.toDisplayFeatures = function(state, geojson, display) {
  const isActivePoint = geojson.properties.id === state.point.id;
  geojson.properties.active = isActivePoint ? activeStates.ACTIVE : activeStates.INACTIVE;
  if (!isActivePoint) return display(geojson);
};
DrawPoint.onTrash = DrawPoint.stopDrawingAndRemove;
DrawPoint.onKeyUp = function(state, e) {
  if (isEscapeKey(e) || isEnterKey(e)) {
    return this.stopDrawingAndRemove(state, e);
  }
};
var draw_point_default = DrawPoint;

// node_modules/@mapbox/mapbox-gl-draw/src/lib/is_event_at_coordinates.js
function isEventAtCoordinates(event, coordinates) {
  if (!event.lngLat) return false;
  return event.lngLat.lng === coordinates[0] && event.lngLat.lat === coordinates[1];
}
var is_event_at_coordinates_default = isEventAtCoordinates;

// node_modules/@mapbox/mapbox-gl-draw/src/modes/draw_polygon.js
var DrawPolygon = {};
DrawPolygon.onSetup = function() {
  const polygon = this.newFeature({
    type: geojsonTypes.FEATURE,
    properties: {},
    geometry: {
      type: geojsonTypes.POLYGON,
      coordinates: [[]]
    }
  });
  this.addFeature(polygon);
  this.clearSelectedFeatures();
  double_click_zoom_default.disable(this);
  this.updateUIClasses({
    mouse: cursors.ADD
  });
  this.activateUIButton(types.POLYGON);
  this.setActionableState({
    trash: true
  });
  return {
    polygon,
    currentVertexPosition: 0
  };
};
DrawPolygon.clickAnywhere = function(state, e) {
  if (state.currentVertexPosition > 0 && is_event_at_coordinates_default(e, state.polygon.coordinates[0][state.currentVertexPosition - 1])) {
    return this.changeMode(modes.SIMPLE_SELECT, {
      featureIds: [state.polygon.id]
    });
  }
  this.updateUIClasses({
    mouse: cursors.ADD
  });
  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
  state.currentVertexPosition++;
  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
};
DrawPolygon.clickOnVertex = function(state) {
  return this.changeMode(modes.SIMPLE_SELECT, {
    featureIds: [state.polygon.id]
  });
};
DrawPolygon.onMouseMove = function(state, e) {
  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
  if (isVertex(e)) {
    this.updateUIClasses({
      mouse: cursors.POINTER
    });
  }
};
DrawPolygon.onTap = DrawPolygon.onClick = function(state, e) {
  if (isVertex(e)) return this.clickOnVertex(state, e);
  return this.clickAnywhere(state, e);
};
DrawPolygon.onKeyUp = function(state, e) {
  if (isEscapeKey(e)) {
    this.deleteFeature([state.polygon.id], {
      silent: true
    });
    this.changeMode(modes.SIMPLE_SELECT);
  } else if (isEnterKey(e)) {
    this.changeMode(modes.SIMPLE_SELECT, {
      featureIds: [state.polygon.id]
    });
  }
};
DrawPolygon.onStop = function(state) {
  this.updateUIClasses({
    mouse: cursors.NONE
  });
  double_click_zoom_default.enable(this);
  this.activateUIButton();
  if (this.getFeature(state.polygon.id) === void 0) return;
  state.polygon.removeCoordinate(`0.${state.currentVertexPosition}`);
  if (state.polygon.isValid()) {
    this.fire(events.CREATE, {
      features: [state.polygon.toGeoJSON()]
    });
  } else {
    this.deleteFeature([state.polygon.id], {
      silent: true
    });
    this.changeMode(modes.SIMPLE_SELECT, {}, {
      silent: true
    });
  }
};
DrawPolygon.toDisplayFeatures = function(state, geojson, display) {
  const isActivePolygon = geojson.properties.id === state.polygon.id;
  geojson.properties.active = isActivePolygon ? activeStates.ACTIVE : activeStates.INACTIVE;
  if (!isActivePolygon) return display(geojson);
  if (geojson.geometry.coordinates.length === 0) return;
  const coordinateCount = geojson.geometry.coordinates[0].length;
  if (coordinateCount < 3) {
    return;
  }
  geojson.properties.meta = meta.FEATURE;
  display(create_vertex_default(state.polygon.id, geojson.geometry.coordinates[0][0], "0.0", false));
  if (coordinateCount > 3) {
    const endPos = geojson.geometry.coordinates[0].length - 3;
    display(create_vertex_default(state.polygon.id, geojson.geometry.coordinates[0][endPos], `0.${endPos}`, false));
  }
  if (coordinateCount <= 4) {
    const lineCoordinates = [[geojson.geometry.coordinates[0][0][0], geojson.geometry.coordinates[0][0][1]], [geojson.geometry.coordinates[0][1][0], geojson.geometry.coordinates[0][1][1]]];
    display({
      type: geojsonTypes.FEATURE,
      properties: geojson.properties,
      geometry: {
        coordinates: lineCoordinates,
        type: geojsonTypes.LINE_STRING
      }
    });
    if (coordinateCount === 3) {
      return;
    }
  }
  return display(geojson);
};
DrawPolygon.onTrash = function(state) {
  this.deleteFeature([state.polygon.id], {
    silent: true
  });
  this.changeMode(modes.SIMPLE_SELECT);
};
var draw_polygon_default = DrawPolygon;

// node_modules/@mapbox/mapbox-gl-draw/src/modes/draw_line_string.js
var DrawLineString = {};
DrawLineString.onSetup = function(opts) {
  opts = opts || {};
  const featureId = opts.featureId;
  let line, currentVertexPosition;
  let direction = "forward";
  if (featureId) {
    line = this.getFeature(featureId);
    if (!line) {
      throw new Error("Could not find a feature with the provided featureId");
    }
    let from = opts.from;
    if (from && from.type === "Feature" && from.geometry && from.geometry.type === "Point") {
      from = from.geometry;
    }
    if (from && from.type === "Point" && from.coordinates && from.coordinates.length === 2) {
      from = from.coordinates;
    }
    if (!from || !Array.isArray(from)) {
      throw new Error("Please use the `from` property to indicate which point to continue the line from");
    }
    const lastCoord = line.coordinates.length - 1;
    if (line.coordinates[lastCoord][0] === from[0] && line.coordinates[lastCoord][1] === from[1]) {
      currentVertexPosition = lastCoord + 1;
      line.addCoordinate(currentVertexPosition, ...line.coordinates[lastCoord]);
    } else if (line.coordinates[0][0] === from[0] && line.coordinates[0][1] === from[1]) {
      direction = "backwards";
      currentVertexPosition = 0;
      line.addCoordinate(currentVertexPosition, ...line.coordinates[0]);
    } else {
      throw new Error("`from` should match the point at either the start or the end of the provided LineString");
    }
  } else {
    line = this.newFeature({
      type: geojsonTypes.FEATURE,
      properties: {},
      geometry: {
        type: geojsonTypes.LINE_STRING,
        coordinates: []
      }
    });
    currentVertexPosition = 0;
    this.addFeature(line);
  }
  this.clearSelectedFeatures();
  double_click_zoom_default.disable(this);
  this.updateUIClasses({
    mouse: cursors.ADD
  });
  this.activateUIButton(types.LINE);
  this.setActionableState({
    trash: true
  });
  return {
    line,
    currentVertexPosition,
    direction
  };
};
DrawLineString.clickAnywhere = function(state, e) {
  if (state.currentVertexPosition > 0 && is_event_at_coordinates_default(e, state.line.coordinates[state.currentVertexPosition - 1]) || state.direction === "backwards" && is_event_at_coordinates_default(e, state.line.coordinates[state.currentVertexPosition + 1])) {
    return this.changeMode(modes.SIMPLE_SELECT, {
      featureIds: [state.line.id]
    });
  }
  this.updateUIClasses({
    mouse: cursors.ADD
  });
  state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
  if (state.direction === "forward") {
    state.currentVertexPosition++;
    state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
  } else {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
  }
};
DrawLineString.clickOnVertex = function(state) {
  return this.changeMode(modes.SIMPLE_SELECT, {
    featureIds: [state.line.id]
  });
};
DrawLineString.onMouseMove = function(state, e) {
  state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
  if (isVertex(e)) {
    this.updateUIClasses({
      mouse: cursors.POINTER
    });
  }
};
DrawLineString.onTap = DrawLineString.onClick = function(state, e) {
  if (isVertex(e)) return this.clickOnVertex(state, e);
  this.clickAnywhere(state, e);
};
DrawLineString.onKeyUp = function(state, e) {
  if (isEnterKey(e)) {
    this.changeMode(modes.SIMPLE_SELECT, {
      featureIds: [state.line.id]
    });
  } else if (isEscapeKey(e)) {
    this.deleteFeature([state.line.id], {
      silent: true
    });
    this.changeMode(modes.SIMPLE_SELECT);
  }
};
DrawLineString.onStop = function(state) {
  double_click_zoom_default.enable(this);
  this.activateUIButton();
  if (this.getFeature(state.line.id) === void 0) return;
  state.line.removeCoordinate(`${state.currentVertexPosition}`);
  if (state.line.isValid()) {
    this.fire(events.CREATE, {
      features: [state.line.toGeoJSON()]
    });
  } else {
    this.deleteFeature([state.line.id], {
      silent: true
    });
    this.changeMode(modes.SIMPLE_SELECT, {}, {
      silent: true
    });
  }
};
DrawLineString.onTrash = function(state) {
  this.deleteFeature([state.line.id], {
    silent: true
  });
  this.changeMode(modes.SIMPLE_SELECT);
};
DrawLineString.toDisplayFeatures = function(state, geojson, display) {
  const isActiveLine = geojson.properties.id === state.line.id;
  geojson.properties.active = isActiveLine ? activeStates.ACTIVE : activeStates.INACTIVE;
  if (!isActiveLine) return display(geojson);
  if (geojson.geometry.coordinates.length < 2) return;
  geojson.properties.meta = meta.FEATURE;
  display(create_vertex_default(state.line.id, geojson.geometry.coordinates[state.direction === "forward" ? geojson.geometry.coordinates.length - 2 : 1], `${state.direction === "forward" ? geojson.geometry.coordinates.length - 2 : 1}`, false));
  display(geojson);
};
var draw_line_string_default = DrawLineString;

// node_modules/@mapbox/mapbox-gl-draw/src/modes/index.js
var modes_default = {
  simple_select: simple_select_default,
  direct_select: direct_select_default,
  draw_point: draw_point_default,
  draw_polygon: draw_polygon_default,
  draw_line_string: draw_line_string_default
};

// node_modules/@mapbox/mapbox-gl-draw/src/options.js
var defaultOptions = {
  defaultMode: modes.SIMPLE_SELECT,
  keybindings: true,
  touchEnabled: true,
  clickBuffer: 2,
  touchBuffer: 25,
  boxSelect: true,
  displayControlsDefault: true,
  styles: theme_default,
  modes: modes_default,
  controls: {},
  userProperties: false,
  suppressAPIEvents: true
};
var showControls = {
  point: true,
  line_string: true,
  polygon: true,
  trash: true,
  combine_features: true,
  uncombine_features: true
};
var hideControls = {
  point: false,
  line_string: false,
  polygon: false,
  trash: false,
  combine_features: false,
  uncombine_features: false
};
function addSources(styles, sourceBucket) {
  return styles.map((style) => {
    if (style.source) return style;
    return Object.assign({}, style, {
      id: `${style.id}.${sourceBucket}`,
      source: sourceBucket === "hot" ? sources.HOT : sources.COLD
    });
  });
}
function options_default(options = {}) {
  let withDefaults = Object.assign({}, options);
  if (!options.controls) {
    withDefaults.controls = {};
  }
  if (options.displayControlsDefault === false) {
    withDefaults.controls = Object.assign({}, hideControls, options.controls);
  } else {
    withDefaults.controls = Object.assign({}, showControls, options.controls);
  }
  withDefaults = Object.assign({}, defaultOptions, withDefaults);
  withDefaults.styles = addSources(withDefaults.styles, "cold").concat(addSources(withDefaults.styles, "hot"));
  return withDefaults;
}

// node_modules/@mapbox/mapbox-gl-draw/src/api.js
var import_fast_deep_equal = __toESM(require_fast_deep_equal(), 1);
var import_geojson_normalize = __toESM(require_geojson_normalize(), 1);

// node_modules/@mapbox/mapbox-gl-draw/src/lib/string_sets_are_equal.js
function string_sets_are_equal_default(a, b) {
  if (a.length !== b.length) return false;
  return JSON.stringify(a.map((id) => id).sort()) === JSON.stringify(b.map((id) => id).sort());
}

// node_modules/@mapbox/mapbox-gl-draw/src/api.js
var featureTypes = {
  Polygon: polygon_default,
  LineString: line_string_default,
  Point: point_default,
  MultiPolygon: multi_feature_default,
  MultiLineString: multi_feature_default,
  MultiPoint: multi_feature_default
};
function api_default(ctx, api) {
  api.modes = modes;
  const silent = ctx.options.suppressAPIEvents !== void 0 ? !!ctx.options.suppressAPIEvents : true;
  api.getFeatureIdsAt = function(point) {
    const features = features_at_default.click({
      point
    }, null, ctx);
    return features.map((feature) => feature.properties.id);
  };
  api.getSelectedIds = function() {
    return ctx.store.getSelectedIds();
  };
  api.getSelected = function() {
    return {
      type: geojsonTypes.FEATURE_COLLECTION,
      features: ctx.store.getSelectedIds().map((id) => ctx.store.get(id)).map((feature) => feature.toGeoJSON())
    };
  };
  api.getSelectedPoints = function() {
    return {
      type: geojsonTypes.FEATURE_COLLECTION,
      features: ctx.store.getSelectedCoordinates().map((coordinate) => ({
        type: geojsonTypes.FEATURE,
        properties: {},
        geometry: {
          type: geojsonTypes.POINT,
          coordinates: coordinate.coordinates
        }
      }))
    };
  };
  api.set = function(featureCollection) {
    if (featureCollection.type === void 0 || featureCollection.type !== geojsonTypes.FEATURE_COLLECTION || !Array.isArray(featureCollection.features)) {
      throw new Error("Invalid FeatureCollection");
    }
    const renderBatch = ctx.store.createRenderBatch();
    let toDelete = ctx.store.getAllIds().slice();
    const newIds = api.add(featureCollection);
    const newIdsLookup = new string_set_default(newIds);
    toDelete = toDelete.filter((id) => !newIdsLookup.has(id));
    if (toDelete.length) {
      api.delete(toDelete);
    }
    renderBatch();
    return newIds;
  };
  api.add = function(geojson) {
    const featureCollection = JSON.parse(JSON.stringify((0, import_geojson_normalize.default)(geojson)));
    const ids = featureCollection.features.map((feature) => {
      feature.id = feature.id || generateID();
      if (feature.geometry === null) {
        throw new Error("Invalid geometry: null");
      }
      if (ctx.store.get(feature.id) === void 0 || ctx.store.get(feature.id).type !== feature.geometry.type) {
        const Model = featureTypes[feature.geometry.type];
        if (Model === void 0) {
          throw new Error(`Invalid geometry type: ${feature.geometry.type}.`);
        }
        const internalFeature = new Model(ctx, feature);
        ctx.store.add(internalFeature, {
          silent
        });
      } else {
        const internalFeature = ctx.store.get(feature.id);
        const originalProperties = internalFeature.properties;
        internalFeature.properties = feature.properties;
        if (!(0, import_fast_deep_equal.default)(originalProperties, feature.properties)) {
          ctx.store.featureChanged(internalFeature.id, {
            silent
          });
        }
        if (!(0, import_fast_deep_equal.default)(internalFeature.getCoordinates(), feature.geometry.coordinates)) {
          internalFeature.incomingCoords(feature.geometry.coordinates);
        }
      }
      return feature.id;
    });
    ctx.store.render();
    return ids;
  };
  api.get = function(id) {
    const feature = ctx.store.get(id);
    if (feature) {
      return feature.toGeoJSON();
    }
  };
  api.getAll = function() {
    return {
      type: geojsonTypes.FEATURE_COLLECTION,
      features: ctx.store.getAll().map((feature) => feature.toGeoJSON())
    };
  };
  api.delete = function(featureIds) {
    ctx.store.delete(featureIds, {
      silent
    });
    if (api.getMode() === modes.DIRECT_SELECT && !ctx.store.getSelectedIds().length) {
      ctx.events.changeMode(modes.SIMPLE_SELECT, void 0, {
        silent
      });
    } else {
      ctx.store.render();
    }
    return api;
  };
  api.deleteAll = function() {
    ctx.store.delete(ctx.store.getAllIds(), {
      silent
    });
    if (api.getMode() === modes.DIRECT_SELECT) {
      ctx.events.changeMode(modes.SIMPLE_SELECT, void 0, {
        silent
      });
    } else {
      ctx.store.render();
    }
    return api;
  };
  api.changeMode = function(mode, modeOptions = {}) {
    if (mode === modes.SIMPLE_SELECT && api.getMode() === modes.SIMPLE_SELECT) {
      if (string_sets_are_equal_default(modeOptions.featureIds || [], ctx.store.getSelectedIds())) return api;
      ctx.store.setSelected(modeOptions.featureIds, {
        silent
      });
      ctx.store.render();
      return api;
    }
    if (mode === modes.DIRECT_SELECT && api.getMode() === modes.DIRECT_SELECT && modeOptions.featureId === ctx.store.getSelectedIds()[0]) {
      return api;
    }
    ctx.events.changeMode(mode, modeOptions, {
      silent
    });
    return api;
  };
  api.getMode = function() {
    return ctx.events.getMode();
  };
  api.trash = function() {
    ctx.events.trash({
      silent
    });
    return api;
  };
  api.combineFeatures = function() {
    ctx.events.combineFeatures({
      silent
    });
    return api;
  };
  api.uncombineFeatures = function() {
    ctx.events.uncombineFeatures({
      silent
    });
    return api;
  };
  api.setFeatureProperty = function(featureId, property, value) {
    ctx.store.setFeatureProperty(featureId, property, value, {
      silent
    });
    return api;
  };
  return api;
}

// node_modules/@mapbox/mapbox-gl-draw/src/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  CommonSelectors: () => common_selectors_exports,
  ModeHandler: () => mode_handler_default,
  StringSet: () => string_set_default,
  constrainFeatureMovement: () => constrain_feature_movement_default,
  createMidPoint: () => create_midpoint_default,
  createSupplementaryPoints: () => create_supplementary_points_default,
  createVertex: () => create_vertex_default,
  doubleClickZoom: () => double_click_zoom_default,
  euclideanDistance: () => euclidean_distance_default,
  featuresAt: () => features_at_default,
  getFeatureAtAndSetCursors: () => getFeatureAtAndSetCursors,
  isClick: () => isClick,
  isEventAtCoordinates: () => is_event_at_coordinates_default,
  isTap: () => isTap,
  mapEventToBoundingBox: () => map_event_to_bounding_box_default,
  moveFeatures: () => move_features_default,
  sortFeatures: () => sort_features_default,
  stringSetsAreEqual: () => string_sets_are_equal_default,
  theme: () => theme_default,
  toDenseArray: () => to_dense_array_default
});

// node_modules/@mapbox/mapbox-gl-draw/index.js
var setupDraw = function(options, api) {
  options = options_default(options);
  const ctx = {
    options
  };
  api = api_default(ctx, api);
  ctx.api = api;
  const setup = setup_default(ctx);
  api.onAdd = setup.onAdd;
  api.onRemove = setup.onRemove;
  api.types = types;
  api.options = options;
  return api;
};
function MapboxDraw(options) {
  setupDraw(options, this);
}
MapboxDraw.modes = modes_default;
MapboxDraw.constants = constants_exports;
MapboxDraw.lib = lib_exports;
var mapbox_gl_draw_default = MapboxDraw;
export {
  mapbox_gl_draw_default as default
};
//# sourceMappingURL=@mapbox_mapbox-gl-draw.js.map
