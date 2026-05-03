 
import { useEffect, useState } from "react";
import schoolsRaw from "../../data/centrosEducativos.geojson?raw";
import type { Props } from "../../utils/interfaces";
import maplibregl from "maplibre-gl";
import { getSchoolsOSM } from "../../services/osmService";

const schools = JSON.parse(schoolsRaw);

export default function LayerManager({ map }: Props) {
  const [expanded, setExpanded] = useState(true);

  const [layers, setLayers] = useState([
    {
      id: "schools",
      name: "Centros educativos",
      visible: false,
      opacity: 1,
    },
  ]);

  const toggleLayer = (layerId: string) => {
    const updated = layers.map(async (layer) => {
      if (layer.id === layerId) {
        const newVisible = !layer.visible;

        if (newVisible && map) {
          if (!map.getSource(layer.id)) {
            /* map.addSource(layer.id, {
              type: "geojson",
              // data: schools,
              data: await getSchoolsOSM(),
            });

            map.addLayer({
              id: `${layer.id}-circle`,
              type: "circle",
              source: layer.id,
              paint: {
                "circle-radius": 7,
                "circle-color": "#2563eb",
                "circle-opacity": layer.opacity,
                "circle-stroke-width": 1.5,
                "circle-stroke-color": "white",
              },
            }); */
            fetchData()
          }          
        } else if(map){
          if (map.getLayer(`${layer.id}-circle`))
            map.removeLayer(`${layer.id}-circle`);

          if (map.getSource(layer.id)) map.removeSource(layer.id);
        }

        if (map) {
          map.on("click","schools-circle",(e)=>{
              console.log({e})
              const feature=e.features?.[0];
              if (!feature) return;
              
              const geometry = feature.geometry as GeoJSON.Point;
              if (geometry.type !== "Point" || !geometry.coordinates) return;
      
              new maplibregl.Popup()
              .setLngLat(geometry.coordinates as [number, number])
              .setHTML(
              feature.properties.nombre
              )
              .addTo(map);
          });

          
        }

        return {
          ...layer,
          visible: newVisible,
        };
      }

      return layer;
    });

    setLayers(updated);
  };

  const updateOpacity = (layerId: string, opacity: number) => {
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
  };

  const fetchData = async () => {
    if (map) {
      const data = await getSchoolsOSM();
      if (data) {
        map.addSource(
          "osm-schools",
          {
            type: "geojson",
            data
          }
        );
  
        map.addLayer({
          id: "osm-schools",
          type: "circle",
          source: "osm-schools",
          paint: {
            "circle-radius": 6,
            "circle-color": "#2563eb",
            "circle-stroke-width": 1,
            "circle-stroke-color": "white"
          }
        });
  
        map.on( "click", "osm-schools", (e)=>{
          console.log(
            {
              puntoSelected: e.features?.[0],
              lngLat: e.lngLat,
              point: e.point,
  
            }
          )
          const f=e.features?.[0];
          new maplibregl.Popup().setLngLat(f.geometry.coordinates).setHTML(`<b>${f.properties.name}</b>`).addTo(map)
        });        
      }
    }
  };
  useEffect(() => {
    // fetchData();
  }, [map])

  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        right: 18,
        width: "320px",
        zIndex: 1200,
        background: "rgba(255,255,255,.95)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,.14)",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 600,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <span>Contenido</span>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {expanded ? "▾" : "▸"}
        </button>
      </div>

      {expanded && (
        <div style={{ padding: "10px" }}>
          {/* GROUP */}

          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#475569",
            }}
          >
            Educación
          </div>

          {layers.map((layer) => (
            <div
              key={layer.id}
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => toggleLayer(layer.id)}
                  />

                  <div>
                    <div>{layer.name}</div>

                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                      }}
                    >
                      ● Puntos azules
                    </div>
                  </div>
                </div>

                <div
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
                </div>
              </div>

              {/* TRANSPARENCIA */}

              <div
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const iconBtn = {
  border: "none",
  background: "#e2e8f0",
  borderRadius: "6px",
  cursor: "pointer",
  padding: "4px 7px",
};
