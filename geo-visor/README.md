# Geo-Visor — Visor Geográfico

Aplicación web de visualización geográfica construida con React y TypeScript que permite explorar mapas interactivos, cambiar mapas base y dibujar puntos con transformación de coordenadas.

## Descripción

Geo-Visor es un visor de mapas interactivo centrado inicialmente en coordenadas de la zona de Putumayo, Colombia. Permite al usuario interactuar con el mapa, alternar entre diferentes mapas base y dibujar puntos geográficos a partir de coordenadas ingresadas manualmente o predefinidas, con soporte para transformación de sistemas de referencia espacial (EPSG:3115 — Colombia Bogotá zone → WGS84).

## Características

- **Mapa interactivo** con mapa base híbrido (satélite + etiquetas).
- **Galería de mapas base (Basemap Gallery):** permite cambiar dinámicamente el mapa base desde un panel desplegable.
- **Dibujo de puntos:** ingreso manual de coordenadas (latitud/longitud) para dibujar marcadores sobre el mapa.
- **Transformación de coordenadas:** convierte coordenadas desde el sistema EPSG:3115 (origen Bogotá, Colombia) al sistema de referencia del mapa (WGS84).
- **Ejecución de puntos predefinidos:** ploteo por lotes de conjuntos de coordenadas configuradas en el código.
- **Panel de widgets** extensible con sistema de apertura/cierre.
- **Registro periódico** de las coordenadas del centro del mapa en consola.
- **Componente alternativo (MapWebComponent)** que consume un WebMap de ArcGIS Online mediante Web Components.

## Tecnologías y Librerías

### Librerías propietarias (NO open source)

| Librería | Versión | Descripción |
|---|---|---|
| **@arcgis/core** | ^4.30.8 | SDK de ArcGIS Maps para JavaScript de Esri. Licencia propietaria; requiere cuenta de ArcGIS Developer (nivel gratuito disponible para desarrollo y pruebas, licencia comercial para producción). |
| **@arcgis/map-components-react** | ^4.30.5 | Web Components de ArcGIS para React. Misma licencia propietaria de Esri. |
| **esri-loader** | ^3.7.0 | Utilidad para cargar módulos de la ArcGIS API de forma dinámica. Es un wrapper open source (Apache-2.0), pero los módulos que carga (esri/*) son propietarios de Esri. |

> **Nota:** El núcleo de la funcionalidad de mapas depende del ecosistema **ArcGIS de Esri**, que es **software propietario**. Aunque existe un nivel gratuito para desarrollo, el despliegue en producción puede requerir una suscripción o licencia comercial. Consultar: https://developers.arcgis.com/pricing/

### Librerías open source

| Librería | Versión | Licencia | Descripción |
|---|---|---|---|
| **React** | ^18.3.1 | MIT | Biblioteca principal para la interfaz de usuario. |
| **React DOM** | ^18.3.1 | MIT | Renderizado de React en el navegador. |
| **TypeScript** | ^4.9.5 | Apache-2.0 | Superset tipado de JavaScript. |
| **Bootstrap** | ^5.3.3 | MIT | Framework CSS para estilos y componentes UI. |
| **react-scripts** | 5.0.1 | MIT | Configuración de Create React App (Webpack, Babel, ESLint). |

## Estructura del Proyecto

```
geo-visor/
├── public/                         # Archivos estáticos
├── src/
│   ├── App.tsx                     # Componente raíz
│   ├── App.css                     # Estilos globales
│   ├── index.tsx                   # Punto de entrada
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapComponent.tsx    # Mapa principal (esri-loader + @arcgis/core)
│   │   │   └── MapWebComponent.tsx # Mapa alternativo (ArcGIS Web Components)
│   │   └── DrawPointComponent/
│   │       └── DrawPointComponent.tsx  # Dibujo de puntos y transformación de coordenadas
│   └── styles/
│       ├── rrhStyles.css           # Estilos personalizados
│       └── search.css              # Estilos del buscador
├── package.json
├── tsconfig.json
└── README.md
```

## Requisitos Previos

- **Node.js** >= 16
- **npm** >= 8
- Cuenta de [ArcGIS Developer](https://developers.arcgis.com/) (para acceso completo a los servicios de mapas de Esri)

## Instalación

```bash
cd geo-visor
npm install
```

## Scripts Disponibles

### `npm start`

Inicia la aplicación en modo desarrollo en [http://localhost:3000](http://localhost:3000).

### `npm run build`

Genera el build de producción optimizado en la carpeta `build/`.

### `npm test`

Ejecuta los tests con Jest en modo interactivo.

## Notas Importantes

- El mapa se inicializa centrado en coordenadas de la zona de Nando, Putumayo, Colombia ([-76.65, 1.07]).
- La transformación de coordenadas utiliza el sistema de referencia EPSG:3115 (Magna-Sirgas / Colombia Bogota zone), típico de cartografía oficial colombiana.
- El componente `MapWebComponent` es una implementación alternativa que utiliza ArcGIS Web Components y carga un WebMap publicado en ArcGIS Online.
