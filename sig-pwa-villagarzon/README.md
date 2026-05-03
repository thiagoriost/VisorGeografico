# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Ajustes funcionales recientes (Visor)

Se implementaron mejoras en la gestion de detalles de features para mantener componentes desacoplados y mejorar la experiencia en mapa:

- `FeatureDetailsPanel` ahora es arrastrable (drag and drop) desde su cabecera.
- `FeatureDetailsPanel` maneja internamente estado de minimizar/expandir y cierre.
- `FeatureDetailsPanel` se renderiza en `MapView` para flotar sobre todo el mapa, no dentro del contenedor de `LayerManager`.
- `LayerManager` ahora solo emite el feature seleccionado mediante `onFeatureDetailsChange`, quedando independiente de la UI de detalles.
- Al cerrar o remover el popup de MapLibre (incluyendo click fuera), tambien se cierra el panel de detalles.
- El panel de detalles incluye un espacio preparado para imagen (`imageUrl`) con placeholder cuando aun no hay foto.

### Contrato de comunicacion

`LayerManager` y `MapView` se comunican con el tipo `FeatureDetailsData` definido en `src/utils/interfaces.ts`:

- `featureName: string`
- `lat: number`
- `lon: number`
- `imageUrl?: string`

`LayerManager` invoca `onFeatureDetailsChange(details)` para abrir/actualizar detalles y `onFeatureDetailsChange(null)` para cerrarlos.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
