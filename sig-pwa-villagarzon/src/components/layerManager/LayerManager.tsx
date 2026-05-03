import { useState } from "react";
import schoolsRaw from "../../data/centrosEducativos.geojson?raw";
import type { Props } from "../../utils/interfaces";
import maplibregl from "maplibre-gl";
import { getSchoolsOSM } from "../../services/osmService";
import "./LayerManager.css";

type SchoolsFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  { nombre: string }
>;

const schools = JSON.parse(schoolsRaw) as SchoolsFeatureCollection;

type LayerItem = {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
};

export default function LayerManager({ map }: Props) {
  const [expanded, setExpanded] = useState(true);

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

  const removeLayerFromMap = (layerId: string) => {
    if (!map) return;

    const sourceId = getSourceId(layerId);
    const circleId = getCircleId(layerId);

    if (map.getLayer(circleId)) {
      map.removeLayer(circleId);
    }

    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  };

  const fetchData = async (layer: LayerItem) => {
    if (!map) return;

    let data: SchoolsFeatureCollection;

    try {
      const onlineData = await getSchoolsOSM();
      data = onlineData.features.length > 0 ? onlineData : schools;

      if (onlineData.features.length === 0) {
        console.warn("OSM sin resultados, usando data offline");
      }
    } catch (error) {
      console.warn("No fue posible consultar OSM, usando data offline", error);
      data = schools;
    }

    const sourceId = getSourceId(layer.id);
    const circleId = getCircleId(layer.id);

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

        new maplibregl.Popup()
          .setLngLat([lon, lat])
          .setHTML(`<b>${featureName}</b>`)
          .addTo(map);
      });
    }
  };

  const toggleLayer = async (layerId: string) => {
    const targetLayer = layers.find((layer) => layer.id === layerId);
    if (!targetLayer) return;

    const newVisible = !targetLayer.visible;

    if (map) {
      if (newVisible) {
        await fetchData(targetLayer);
      } else {
        removeLayerFromMap(layerId);
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

  return (
    <div className="layer-manager">
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
