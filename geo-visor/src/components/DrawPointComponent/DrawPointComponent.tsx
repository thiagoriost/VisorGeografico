// src/components/DrawPointComponent.tsx

import React, { useState } from 'react';
import { loadModules } from 'esri-loader';

const puntos = [
    {
        label:"Potrero_1",
        coordenadas:[
            // [-76.65095851826268, 1.0699055401066724]
            [1047372, 610184],
            // [1047386,	610167],
            // [1047395,	610150],
            // [1047407,	610133],
            // [1047415,	610115],
            // [1047422,	610109],
            // [1047403,	610097],
            // [1047387,	610086],
            // [1047376,	610082],
            // [1047366,	610096],
            // [1047353,	610112],
            // [1047346,	610124],
            // [1047356,	610142],
            // [1047364,	610160],
            // [1047372,	610177],
            // [1047372,	610184],
        ]
    }
]

interface DrawPointComponentProps {
  view: __esri.MapView | null;
}

const DrawPointComponent: React.FC<DrawPointComponentProps> = ({ view }) => {
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  const drawPoint = async (long=0, lati=0, item=0, zoom=false ) => {
    console.log({lati, long})
    if (view) {

      /* loadModules(['esri/Graphic', "esri/geometry/Point", "esri/SpatialReference", 'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol', "esri/Color"
      ])
      .then(([Graphic, Point, SpatialReference, SimpleMarkerSymbol, SimpleLineSymbol, Color]) => {
        
      }); */

      const [FeatureLayer, SimpleFillSymbol, Polygon, Graphic, GraphicsLayer, SimpleMarkerSymbol,SimpleLineSymbol, SpatialReference, Point, Color,
        projection
      ] = await loadModules([
        'esri/layers/FeatureLayer', 'esri/symbols/SimpleFillSymbol', 'esri/geometry/Polygon', 'esri/Graphic', 'esri/layers/GraphicsLayer',
        'esri/symbols/SimpleMarkerSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/geometry/SpatialReference',  "esri/geometry/Point", "esri/Color",
        'esri/geometry/projection'], {
        // url: 'https://js.arcgis.com/4.29/'
      });



      const lat = lati != 0 ? lati:latitude;
      const lon = long != 0 ? long:longitude;
      const point = {
        type: 'point',
      //   longitude: parseFloat(lon),
        longitude: lon,
      //   latitude: parseFloat(lat),
        latitude: lat,
      };

      
      // const inputSpatialReference = new SpatialReference({ wkid: 3857 });
      const inputSpatialReference = new SpatialReference({ wkid: 3115 });
      // Crea un punto en la referencia espacial original
      const originalPoint = new Point({
        // x: parseFloat(xCoord),
        // y: parseFloat(yCoord),
        x: lat,
        y: lon,
        spatialReference: inputSpatialReference
      });
      // const spatialRefSel = new SpatialReference(3115);
      // const spatialRefSel = new SpatialReference();
      // const loc = new Point(lat, lon, spatialRefSel);

      // Transformar el punto a la referencia espacial del mapa (WGS84)
      const transformedPoint = await projection.project(originalPoint, view.spatialReference);

      const simpleMarkerSymbol = {
        type: 'simple-marker',
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 10,
        },
      };
      // var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.3]), 10), new Color([0, 255, 0, 1]));

      const pointGraphic = new Graphic({
        geometry: transformedPoint,
        // geometry: point,
        // geometry: loc,
        symbol: simpleMarkerSymbol,
      });

      view.graphics.add(pointGraphic);
      console.log({point, simpleMarkerSymbol, pointGraphic})
      // Zoom hacia el punto dibujado
      if (zoom) {
        console.log({item, "puntos.length": puntos[0].coordenadas.length-1})
        if (item == puntos[0].coordenadas.length) {
          // Ajustar el extent al punto dibujado
          view.goTo({
            target: pointGraphic,
            zoom: 15, // Ajusta el nivel de zoom según sea necesario
            scale: 5000 // Opcional, ajusta el alcance del zoom según sea necesario
          });          
        }
      }else{
        // Ajustar el extent al punto dibujado
        view.goTo({
          target: pointGraphic,
          zoom: 15, // Ajusta el nivel de zoom según sea necesario
          scale: 5000 // Opcional, ajusta el alcance del zoom según sea necesario
        });
      }
    }
  };

  const ejecutarPuntosQuemados = () => {
    puntos.forEach(punto => {
        punto.coordenadas.forEach((coord, i) => {
            // setLatitude(coord[0]);
            // setLongitude(coord[0]);
            drawPoint(coord[0], coord[1], i, true)
        })
    });
    
  }

  return (
    <div style={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', zIndex: 1000, position: 'relative' }}>
      <div className="form-group">
        <label>Latitud:</label>
        <input
          type="text"
          value={latitude}
          onChange={(e) => setLatitude(Number(e.target.value))}
          className="form-control"
          placeholder="Ingrese latitud"
        />
      </div>
      <div className="form-group">
        <label>Longitud:</label>
        <input
          type="text"
          value={longitude}
          onChange={(e) => setLongitude(Number(e.target.value))}
          className="form-control"
          placeholder="Ingrese longitud"
        />
      </div>
      <button className="btn btn-primary mt-2" onClick={()=>{drawPoint()}}>
        Dibujar
      </button>
      <button className="btn btn-primary mt-2" onClick={ejecutarPuntosQuemados}>
        ejecutarPuntosQuemados
      </button>
    </div>
  );
};

export default DrawPointComponent;
