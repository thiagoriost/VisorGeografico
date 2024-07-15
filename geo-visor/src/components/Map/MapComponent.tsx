// src/components/MapComponent.tsx

import React, { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
// import WebMap from 'esri/WebMap';
import WebMap from '@arcgis/core/WebMap';
import Search from "@arcgis/core/widgets/Search.js";

// import "../../styles/search.css";


const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapView, setMapView] = useState<__esri.MapView>();

  // Función para mostrar las coordenadas del centro del mapa
  const logCenterCoordinates = (view: __esri.MapView) => {
    const center = view.center;
    console.log(`Centro del mapa: [${center.longitude}, ${center.latitude}]`);
  };

  const getCoordOnClick = (event: { mapPoint: { latitude: any; longitude: any; }; }) => {
    const lat = event.mapPoint.latitude;
    const lon = event.mapPoint.longitude;
    console.log(`Coordenadas del clic: [${lon}, ${lat}]`);
  }

  useEffect(() => {
    let view: __esri.MapView;
    

    loadModules(['esri/Map', 'esri/views/MapView', 
      'esri/widgets/BasemapGallery'])
      .then(([Map, MapView, BasemapGallery]) => {

        /**
         * Ejemplos de mapa base
         * streets, satellite, hybrid, terrain, topo, gray, dark-gray, oceans, national-geographic, osm (OpenStreetMap)
         */
        const map = new Map({          
          basemap: 'hybrid',
          // layers: additionalLayers             // Optionally, add additional layers collection
        });

        const webMap = new WebMap({                        // Define the web map reference
          portalItem: {
            id: "df5821f221224aa09be58392c2738bf1",
            // portal: "https://www.arcgis.com"               // Default: The ArcGIS Online Portal
          }
        });

        view = new MapView({
          // map: webMap,
          map,
          container: mapRef.current as HTMLDivElement,
          // center: [-74.08175, 4.60971], // Coordenadas de Bogotá
          // center: [-76.61655948592366, 1.025683904723693], // Coordenadas de Villagarzon
          center: [-76.65095851826268, 1.0699055401066724], // Nando          
          zoom: 18
        });

        const basemapGallery = new BasemapGallery({
          view: view,
          // source: new LocalBasemapsSource()
        });

        view.ui.add(basemapGallery, 'top-right');

        // Evento de clic para capturar coordenadas
        // const onCLickGeoCoo = view.on('click', getCoordOnClick);
        setTimeout(() => {
          console.log("removeindo onCLickGeoCoo")
          // onCLickGeoCoo.remove()
        }, 60000);

        setMapView(view);
        console.log(1111111111)
        /* var searchWidget = new Search({
          view
        });
      
        // Add the search widget to the top right corner of the view
        view.ui.add(searchWidget, {
          position: "top-right"
        }); */

        
      })
      .catch(err => console.error(err));

      // Llama a la función cada minuto
      const intervalId = setInterval( ()=>logCenterCoordinates(view), 60000);
      

      

    return () => {
      clearInterval(intervalId);
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return(
    <div style={{height: '100vh', position: 'relative'}} ref={mapRef}></div>
  );
};

export default MapComponent;
