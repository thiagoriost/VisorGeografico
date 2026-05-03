import { useEffect, useRef, useState } from "react";
import schoolsRaw from "../../data/centrosEducativos.geojson?raw";
import type { Props } from "../../utils/interfaces";
import maplibregl from "maplibre-gl";
import { getSchoolsOSM } from "../../services/osmService";
import FeatureDetailsPanel from "./FeatureDetailsPanel";
import LayerLoading from "./LayerLoading";
import "./LayerManager.css";

type SchoolsFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  { nombre: string }
>;

const schools = JSON.parse(schoolsRaw) as SchoolsFeatureCollection;
const getCurrentTimestamp = () => Date.now();

const LAYER_CACHE_PREFIX = "layer-cache-v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type LayerCacheEntry = {
  version: 1;
  savedAt: number;
  expiresAt: number;
  data: SchoolsFeatureCollection;
};

type LayerItem = {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
};

type SelectedFeatureDetails = {
  featureName: string;
  lat: number;
  lon: number;
};

export default function LayerManager({ map }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [loadingLayerId, setLoadingLayerId] = useState<string | null>(null);
  const [selectedFeatureDetails, setSelectedFeatureDetails] =
    useState<SelectedFeatureDetails | null>(null);
  const [isDetailsMinimized, setIsDetailsMinimized] = useState(false);
  const inMemoryCacheRef = useRef<Record<string, SchoolsFeatureCollection>>({});
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const [layers, setLayers] = useState<LayerItem[]>([
    {
      id: "schools",
      name: "Centros educativos",
      visible: false,
      opacity: 1,
    },
  ]);

  const getSourceId = (layerId: string) => `${layerId}-source`;
  const getCircleId = (layerId: string) => `${layerId}-circle`;

  const getCacheKey = (layerId: string) => `${LAYER_CACHE_PREFIX}:${layerId}`;

  const purgeExpiredLayerCaches = () => {
    try {
      const now = getCurrentTimestamp();

      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(`${LAYER_CACHE_PREFIX}:`)) continue;

        const rawValue = localStorage.getItem(key);
        if (!rawValue) continue;

        try {
          const parsed = JSON.parse(rawValue) as Partial<LayerCacheEntry>;
          if (!parsed.expiresAt || parsed.expiresAt <= now) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // localStorage puede estar bloqueado por permisos del navegador.
    }
  };

  const readLayerLocalCache = (
    layerId: string,
  ): SchoolsFeatureCollection | null => {
    try {
      const rawValue = localStorage.getItem(getCacheKey(layerId));
      if (!rawValue) return null;

      const parsed = JSON.parse(rawValue) as Partial<LayerCacheEntry>;
      const now = getCurrentTimestamp();

      if (!parsed.expiresAt || parsed.expiresAt <= now) {
        localStorage.removeItem(getCacheKey(layerId));
        return null;
      }

      if (
        !parsed.data ||
        parsed.data.type !== "FeatureCollection" ||
        !Array.isArray(parsed.data.features)
      ) {
        localStorage.removeItem(getCacheKey(layerId));
        return null;
      }

      return parsed.data as SchoolsFeatureCollection;
    } catch {
      return null;
    }
  };

  const saveLayerLocalCache = (layerId: string, data: SchoolsFeatureCollection) => {
    try {
      const now = getCurrentTimestamp();
      const payload: LayerCacheEntry = {
        version: 1,
        savedAt: now,
        expiresAt: now + CACHE_TTL_MS,
        data,
      };

      localStorage.setItem(getCacheKey(layerId), JSON.stringify(payload));
    } catch {
      // Puede fallar por cuota llena; el mapa sigue funcionando con cache en memoria.
    }
  };

  const setLayerVisibility = (layerId: string, visible: boolean) => {
    if (!map) return;

    const circleId = getCircleId(layerId);
    if (!map.getLayer(circleId)) return;

    map.setLayoutProperty(circleId, "visibility", visible ? "visible" : "none");
  };

  useEffect(() => {
    purgeExpiredLayerCaches();
  }, []);

  useEffect(() => {
    return () => {
      popupRef.current?.remove();
    };
  }, []);

  const openFeatureDetails = (details: SelectedFeatureDetails) => {
    setSelectedFeatureDetails(details);
    setIsDetailsMinimized(false);
  };

  const closeFeatureDetails = () => {
    setSelectedFeatureDetails(null);
    setIsDetailsMinimized(false);
  };

  const resolveLayerData = async (layer: LayerItem): Promise<SchoolsFeatureCollection> => {
    const memoryCached = inMemoryCacheRef.current[layer.id];
    if (memoryCached) {
      return memoryCached;
    }

    const localCached = readLayerLocalCache(layer.id);
    if (localCached) {
      inMemoryCacheRef.current[layer.id] = localCached;
      return localCached;
    }

    setLoadingLayerId(layer.id);

    try {
      const onlineData = await getSchoolsOSM();
      const selectedData = onlineData.features.length > 0 ? onlineData : schools;

      if (onlineData.features.length === 0) {
        console.warn("OSM sin resultados, usando data offline");
      }

      inMemoryCacheRef.current[layer.id] = selectedData;
      saveLayerLocalCache(layer.id, selectedData);
      return selectedData;
    } catch (error) {
      console.warn("No fue posible consultar OSM, usando data offline", error);
      inMemoryCacheRef.current[layer.id] = schools;
      saveLayerLocalCache(layer.id, schools);
      return schools;
    } finally {
      setLoadingLayerId(null);
    }
  };

  const fetchData = async (layer: LayerItem) => {
    if (!map) return;

    const sourceId = getSourceId(layer.id);
    const circleId = getCircleId(layer.id);
    const data = await resolveLayerData(layer);

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data,
      });
    }

    if (!map.getLayer(circleId)) {
      map.addLayer({
        id: circleId,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": 6,
          "circle-color": "#2563eb",
          "circle-opacity": layer.opacity,
          "circle-stroke-width": 1,
          "circle-stroke-color": "white",
        },
      });

      map.on("click", circleId, (e) => {
        const f = e.features?.[0];
        if (!f || f.geometry.type !== "Point") return;

        const [lon, lat] = f.geometry.coordinates as [number, number];
        const featureName = String(
          (f.properties as { nombre?: string })?.nombre || "Sin nombre",
        );

        openFeatureDetails({
          featureName,
          lon,
          lat,
        });

        const popupContent = document.createElement("div");
        popupContent.className = "feature-popup";

        const title = document.createElement("p");
        title.className = "feature-popup__name";
        title.textContent = featureName;

        const coord = document.createElement("p");
        coord.className = "feature-popup__coords";
        coord.textContent = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;

        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.className = "feature-popup__button";
        detailsButton.textContent = "Ver detalles";
        detailsButton.addEventListener("click", () => {
          openFeatureDetails({
            featureName,
            lon,
            lat,
          });
        });

        popupContent.append(title, coord, detailsButton);

        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup()
          .setLngLat([lon, lat])
          .setDOMContent(popupContent)
          .addTo(map);
      });
    } else {
      map.setPaintProperty(circleId, "circle-opacity", layer.opacity);
    }

    if (!map.getLayer(circleId)) return;

    setLayerVisibility(layer.id, true);
  };

  const toggleLayer = async (layerId: string) => {
    const targetLayer = layers.find((layer) => layer.id === layerId);
    if (!targetLayer) return;

    const newVisible = !targetLayer.visible;

    if (map) {
      if (newVisible) {
        await fetchData(targetLayer);
      } else {
        setLayerVisibility(layerId, false);
      }
    }

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: newVisible } : layer,
      ),
    );
  };

  /* const updateOpacity = (layerId: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id === layerId) {
          if (map && map.getLayer(`${layer.id}-circle`)) {
            map.setPaintProperty(
              `${layer.id}-circle`,
              "circle-opacity",
              opacity,
            );
          }

          return {
            ...layer,
            opacity,
          };
        }

        return layer;
      }),
    );
  };

  const moveLayerUp = (layerId: string) => {
    const index = layers.findIndex((l) => l.id === layerId);
    if (index <= 0) return;

    const reordered = [...layers];
    [reordered[index - 1], reordered[index]] = [
      reordered[index],
      reordered[index - 1],
    ];

    setLayers(reordered);
  };

  const moveLayerDown = (layerId: string) => {
    const index = layers.findIndex((l) => l.id === layerId);
    if (index === layers.length - 1) return;

    const reordered = [...layers];
    [reordered[index + 1], reordered[index]] = [
      reordered[index],
      reordered[index + 1],
    ];

    setLayers(reordered);
  }; */

  const loadingLayer = layers.find((l) => l.id === loadingLayerId);

  return (
    <div className="layer-manager">
      {selectedFeatureDetails && (
        <FeatureDetailsPanel
          details={selectedFeatureDetails}
          minimized={isDetailsMinimized}
          onToggleMinimize={() => setIsDetailsMinimized((prev) => !prev)}
          onClose={closeFeatureDetails}
        />
      )}

      {loadingLayer && (
        <LayerLoading layerName={loadingLayer.name} />
      )}

      {/* HEADER */}

      <div className="layer-manager__header">
        <span>Contenido</span>

        <button
          onClick={() => setExpanded(!expanded)}
          className="layer-manager__toggle-btn"
        >
          {expanded ? "▾" : "▸"}
        </button>
      </div>

      {expanded && (
        <div className="layer-manager__body">
          {/* GROUP */}

          <div className="layer-manager__group-title">
            Educación
          </div>

          {layers.map((layer) => (
            <div key={layer.id} className="layer-manager__card">
              <div className="layer-manager__row">
                <div className="layer-manager__left">
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => toggleLayer(layer.id)}
                  />

                  <div>
                    <div>{layer.name}</div>

                    <div
                      className="layer-manager__description"
                    >
                      ● Centros educativos en Villagarzón
                    </div>
                  </div>
                </div>

                {/* <div
                  style={{
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <button onClick={() => moveLayerUp(layer.id)} style={iconBtn}>
                    ↑
                  </button>

                  <button
                    onClick={() => moveLayerDown(layer.id)}
                    style={iconBtn}
                  >
                    ↓
                  </button>
                </div> */}
              </div>

              {/* TRANSPARENCIA */}

              {/* <div
                style={{
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    marginBottom: "4px",
                  }}
                >
                  Transparencia
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step=".1"
                  value={layer.opacity}
                  onChange={(e) =>
                    updateOpacity(layer.id, Number(e.target.value))
                  }
                  style={{
                    width: "100%",
                  }}
                />
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* const iconBtn = {
  border: "none",
  background: "#e2e8f0",
  borderRadius: "6px",
  cursor: "pointer",
  padding: "4px 7px",
}; */
