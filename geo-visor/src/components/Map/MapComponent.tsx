// src/components/MapComponent.tsx

import React, { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
// import WebMap from 'esri/WebMap';
import WebMap from '@arcgis/core/WebMap';
import Search from "@arcgis/core/widgets/Search.js";

import "../../styles/rrhStyles.css";
import DrawPointComponent from '../DrawPointComponent/DrawPointComponent';


const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapView, setMapView] = useState<__esri.MapView | null>(null);
  const [showMapBaseGallery, setShowMapBaseGallery] = useState(false);
  const [baseGallery, setBasemapGallery] = useState(undefined);
  const [openWidgets1, setOpenWidgets1] = useState(false);
  const [openWidgwt_1, setOpenWidgwt_1] = useState(false)

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

  const removeBaseMapGallery = (baseGallerya: any) => {
    // baseGallerya.destroy();
    baseGallerya.container.style.display = "none"
    // setBasemapGallery(undefined)
  }
  const showBaseMapGallery = (baseGallerya: any) => {
    // baseGallerya.destroy();
    baseGallerya.container.style.display = "block"
    // setBasemapGallery(undefined)
  }

  const renderMapGalery = async() => {
    const [BasemapGallery] = await loadModules(['esri/widgets/BasemapGallery']);
    // let baseMapGalleryTemp = undefined;
    console.log(555555555)
    if (mapView) { // valida si existe el mapaBase ya renderizado
      if (!showMapBaseGallery) { // valida si el widget baseMapGalery esta desplegado, para pasar al realizar el despliegue
        if (!baseGallery) { // valida si el baseGallery ya se ha creado, para pasar al crearlo si no reutiliza el ya creado
          const baseMapGalleryTemp = new BasemapGallery({
            view: mapView,
            // source: new LocalBasemapsSource()
          });
          setBasemapGallery(baseMapGalleryTemp);
          mapView.ui.add(baseMapGalleryTemp, 'top-right');               
        }else{
          showBaseMapGallery(baseGallery)
        }
      }else if(baseGallery){
        removeBaseMapGallery(baseGallery)
      }
    }

    

    setShowMapBaseGallery(!showMapBaseGallery);
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

        /* const webMap = new WebMap({                        // Define the web map reference
          portalItem: {
            id: "df5821f221224aa09be58392c2738bf1",
            // portal: "https://www.arcgis.com"               // Default: The ArcGIS Online Portal
          }
        }); */

        view = new MapView({
          // map: webMap,
          map,
          container: mapRef.current as HTMLDivElement,
          // center: [-74.08175, 4.60971], // Coordenadas de Bogotá
          // center: [-76.61655948592366, 1.025683904723693], // Coordenadas de Villagarzon
          center: [-76.65095851826268, 1.0699055401066724], // Nando          
          // zoom: 18
        });

        /* const basemapGallery = new BasemapGallery({
          view: view,
          // source: new LocalBasemapsSource()
        });

        view.ui.add(basemapGallery, 'top-right'); */

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
      const intervalId = setInterval( ()=>logCenterCoordinates(view), 10000);
      

      

    return () => {
      clearInterval(intervalId);
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return(
    <>
      <div style={{height: '100vh', position: 'relative'}} ref={mapRef}></div>
      {
        mapView &&
          <button 
            className="btn btn-outline-primary btn-float" // Clase de Bootstrap para estilizar el botón
            style={{
              position: 'absolute', 
              top: 15, 
              left: 51, 
              zIndex: 1000, 
              /* padding: '10px 15px', 
              backgroundColor: '#007ACC', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer' */
            }}
            onClick={renderMapGalery}
          >
            BMG
          </button>
      }
      <button style={{
              position: 'absolute', 
              top: 15, 
              left: 123, 
              zIndex: 1000, }} className="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample"
              onClick={()=>{setOpenWidgets1(!openWidgets1)}}
              >
        Toggle width collapse
      </button>
      {
        openWidgets1 &&
          <div style={{
                  position: 'absolute', 
                  top: 55, 
                  left: 51, 
                  zIndex: 1000, }}
          >        
            <div style={{minHeight:"120px"}}>
                <div className="card card-body" style={{width: "300px"}}>
                  <button className="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample"
                  onClick={()=>setOpenWidgwt_1(!openWidgwt_1)}
                  >
                    Widget_1
                  </button>
                </div>
              </div>
          </div>

      }

      {
       openWidgwt_1 && 
        <div id='id_Widgwt_1' style={{
          position: 'absolute', 
          top: 6, 
          left: 320, 
          zIndex: 1000, color:'white'
        }}>
          <div style={{ left: '80px', position: 'relative' }}>
            <div ref={mapRef} style={{ width: '100%', height: '80%' }}></div>
            <DrawPointComponent view={mapView} />
          </div>
        </div>
      }

    </>
  );
};

export default MapComponent;
