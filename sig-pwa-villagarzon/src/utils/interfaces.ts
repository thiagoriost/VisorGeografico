import { Map as MaplibreMap } from "maplibre-gl";

 
export interface Props {
  map?: MaplibreMap | null | undefined;
  onChange?: (style: string | object) => void;
  mapaBase?: string | object;
}