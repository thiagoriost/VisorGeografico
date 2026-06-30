# SIG-PWA-VILLAGARZON

Visor geografico web desarrollado con React, TypeScript, Vite y MapLibre GL para consulta territorial en el municipio de Villagarzon.

Este documento resume el estado funcional actual de la aplicacion para auditoria tecnica y deja recomendaciones de evolucion.

## 1. Alcance funcional actual

### 1.1 Vista principal de mapa

- Renderiza un mapa base configurable con centro inicial en Villagarzon.
- Muestra encabezado institucional con titulo, subtitulo y logo.
- Dispone de controles flotantes para navegacion y utilidades cartograficas.
- Soporta modo escritorio y modo movil con widgets desacoplados.

Archivos clave:
- src/components/MapView.tsx
- src/config/mapConfig.ts
- src/components/mapHeader/MapHeader.tsx

### 1.2 Mapas base

Mapas base disponibles:
- Politico (demo MapLibre)
- OpenStreetMap (OpenFreeMap Liberty)
- Satelital 1 (MapTiler Hybrid con API key via variables de entorno)
- Satelital 2 (ArcGIS World Imagery como raster, con token opcional via variables de entorno)

Comportamiento:
- Al cambiar mapa base se reinicia el zoom al nivel configurado por defecto.

Archivos clave:
- src/components/basemapSwitcher/BasemapSwitcher.tsx
- src/config/basemaps.ts

### 1.3 Controles de mapa

Controles implementados:
- Home (volver a vista inicial)
- Zoom in
- Zoom out
- Mi ubicacion (geolocalizacion + marcador con toggle)
- Vista anterior
- Vista siguiente

Notas:
- Se mantiene historial de navegacion por vistas con pilas de backward/forward.

Archivo clave:
- src/components/mapControls/MapControls.tsx

### 1.4 Barra de estado y sistemas de coordenadas

Muestra coordenadas en:
- EPSG:4686
- EPSG:3116
- EPSG:9377
- UTM (zona automatica)
- WGS84

Adicional:
- Muestra zoom actual.
- Modo compacto y expandido.

Archivos clave:
- src/components/mapStatusBar/MapStatusBar.tsx
- src/utils/projections.ts

### 1.5 Escala

Widgets de escala:
- Barra grafica de escala dinamica por movimiento del mapa.
- Control de escala nominal con selector (ajusta zoom por escala seleccionada).

Archivos clave:
- src/components/scaleBar/ScaleBar.tsx
- src/components/scaleControl/ScaleControl.tsx

### 1.6 Gestion de capas tematicas

Capa implementada actualmente:
- Centros educativos (puntos)

Comportamiento:
- Activacion/desactivacion por checkbox.
- Simbolizacion circular en mapa.
- Popup por feature con boton Ver detalles.
- Cierre de popup cierra tambien panel de detalles.
- Si se apaga la capa, se cierra popup y panel de detalles.

Datos:
- Fuente online prioritaria: Overpass API (OSM) filtrada por amenity=school en Villagarzon.
- Fallback offline: src/data/centrosEducativos.geojson.

Cache y persistencia:
- Cache en memoria por sesion para evitar recargas repetidas.
- Cache en localStorage por capa con TTL de 6 horas.
- Limpieza automatica de entradas expiradas.
- Persistencia de checks de visibilidad en localStorage.
- En recarga dura del navegador se limpia el estado de visibilidad persistido.

Archivos clave:
- src/components/layerManager/LayerManager.tsx
- src/services/osmService.ts
- src/data/centrosEducativos.geojson

### 1.7 Panel de detalles de feature

Caracteristicas:
- Panel flotante global (independiente del widget de capas).
- Arrastrable desde cabecera.
- Minimizar / expandir.
- Cierre manual.
- Presenta nombre, latitud, longitud e imagen opcional.
- Placeholder cuando no existe imageUrl.

Contrato entre componentes:
- Tipo FeatureDetailsData: featureName, lat, lon, imageUrl opcional.
- LayerManager emite detalles via onFeatureDetailsChange.
- MapView mantiene el estado del feature seleccionado y renderiza el panel.

Archivos clave:
- src/components/layerManager/FeatureDetailsPanel.tsx
- src/utils/interfaces.ts
- src/components/MapView.tsx

### 1.8 Modo movil

Comportamiento:
- Activacion automatica por media query max-width 767px.
- Menu hamburguesa para widgets.
- Solo un widget activo a la vez.
- Cierre del menu al interactuar con mapa.
- Cierre completo del widget de capas desde callback onRequestClose.

Widgets movil:
- Mapas base
- Barra de escala
- Escala
- Capas
- Barra de estado

Archivos clave:
- src/components/mobileMenu/MobileWidgetsMenu.tsx
- src/components/MapView.tsx

## 2. Estado tecnico

### 2.1 Stack y librerias

- React 19
- TypeScript 6
- Vite 7
- MapLibre GL JS
- proj4
- React Compiler habilitado mediante plugin Babel

Archivos clave:
- package.json
- vite.config.ts

### 2.2 Estado PWA

Se encuentra integrado vite-plugin-pwa con registerType autoUpdate.

Observacion de auditoria:
- No se evidencian en el repositorio configuraciones explicitas de manifest personalizado, iconos PWA dedicados ni estrategia de runtime caching definida en el plugin.
- El proyecto tiene base para PWA, pero la madurez PWA aun parece inicial/intermedia.

Archivo clave:
- vite.config.ts

### 2.3 Seguridad de credenciales cartograficas

Estado actual:
- La clave de MapTiler ya no esta embebida en codigo fuente.
- Se utilizan variables de entorno de Vite para credenciales de proveedores cartograficos.

Variables esperadas en `.env.local`:
- VITE_MAPTILER_API_KEY
- VITE_ARCGIS_API_KEY (opcional, solo si el servicio ArcGIS requiere token)

Recomendacion operativa obligatoria:
- Restringir dominios permitidos de la API key en la consola del proveedor (MapTiler/ArcGIS) para aceptar unicamente dominios de despliegue autorizados.
- Mantener entornos separados (desarrollo, pruebas, produccion) con claves distintas y rotacion periodica.


## 3. Recomendaciones futuras (priorizadas)

### Prioridad alta

1. Seguridad de credenciales cartograficas
- Hecho: API key de MapTiler movida a variables de entorno Vite.
- Hecho: soporte de token ArcGIS via variables de entorno.
- Pendiente operativo: restringir dominios permitidos desde consola del proveedor.

2. Endurecer flujo de datos OSM
- Manejar errores HTTP y timeouts de forma explicita en servicio OSM.
- Registrar metrica de uso de fallback offline para monitoreo.

3. Fortalecer contrato de datos de features
- Incluir id unico de feature en FeatureDetailsData.
- Agregar campos tematicos adicionales para el panel de detalle.

### Prioridad media

4. Cobertura de pruebas
- Tests unitarios para proyecciones y transformaciones.
- Tests de componentes para LayerManager y FeatureDetailsPanel.
- Pruebas de integracion de flujo: capa -> popup -> detalles -> cierre.

5. Evolucion de capacidades SIG
- Multiples capas tematicas con configuracion declarativa.
- Leyenda por capa y filtros por atributos.
- Control de orden de capas y opacidad (ya hay base comentada).

6. Madurez PWA
- Definir manifest completo (nombre, short_name, iconos, colores).
- Configurar cache offline de assets criticos y datos base.
- Implementar flujo de actualizacion con aviso al usuario.

### Prioridad baja

7. Observabilidad y telemetria tecnica
- Tiempos de carga por capa.
- Tasa de fallos de Overpass.
- Errores de geolocalizacion en cliente.

8. Documentacion funcional continua
- Mantener una seccion de changelog por sprint.
- Agregar matriz de trazabilidad: requisito funcional -> componente -> prueba.

## 4. Ejecucion del proyecto

Comandos principales:
- npm install
- npm run dev
- npm run build
- npm run preview
- npm run lint

## 5. Estructura funcional de referencia

- src/components/MapView.tsx: orquestacion principal del visor.
- src/components/layerManager/LayerManager.tsx: gestion de capas, cache y popup.
- src/components/layerManager/FeatureDetailsPanel.tsx: panel de detalle flotante.
- src/services/osmService.ts: consulta de centros educativos a Overpass.
- src/utils/projections.ts: conversiones EPSG y UTM.

## 6. Nota de mantenimiento

Cada cambio funcional debe reflejarse en este README para conservar valor de auditoria. Se recomienda actualizar este documento en el mismo PR donde se modifica la funcionalidad.
