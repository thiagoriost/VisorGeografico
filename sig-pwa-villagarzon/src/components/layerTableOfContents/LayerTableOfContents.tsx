/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import schoolsRaw from "../../data/centrosEducativos.geojson?raw";
import maplibregl from "maplibre-gl";

const schools = JSON.parse(schoolsRaw);

interface Props {
  map: any;
}

export default function LayerTableOfContents({ map }: Props) {
  const [active, setActive] = useState(false);

  const toggleLayer = () => {
    if (!map) return;

    map.on("click","schools-circle",(e: { features: any[]; })=>{
        console.log({e})
        const feature=e.features[0];

        new maplibregl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
        feature.properties.nombre
        )
        .addTo(map);
    });

    if (!active) {
      if (!map.getSource("schools")) {
        map.addSource("schools", {
          type: "geojson",
          data: schools,
        });

        map.addLayer({
          id: "schools-circle",
          type: "circle",
          source: "schools",
          paint: {
            "circle-radius": 6,
            "circle-color": "#2563eb",
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "white",
          },
        });
      }
    } else {
        if (map.getLayer("schools-circle")) {
            map.removeLayer("schools-circle");
        }

      if (map.getSource("schools")) {
        map.removeSource("schools");
      }
    }

    setActive(!active);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        right: 20,
        width: "280px",
        zIndex: 1000,
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(8px)",
        borderRadius: "14px",
        boxShadow: "0 6px 20px rgba(0,0,0,.12)",
        padding: "14px",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: "12px",
          fontSize: "14px",
        }}
      >
        Capas
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px",
          borderRadius: "8px",
          background: "#f8fafc",
        }}
      >
        <input type="checkbox" checked={active} onChange={toggleLayer} />

        <span>Centros educativos</span>
      </div>
    </div>
  );
}
