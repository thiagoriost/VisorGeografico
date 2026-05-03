import { Map as MaplibreMap } from "maplibre-gl";

export type FeatureDetailsData = {
  featureName: string;
  lat: number;
  lon: number;
  imageUrl?: string;
};

 
export interface Props {
  map?: MaplibreMap | null | undefined;
  onChange?: (style: string | object) => void;
  mapaBase?: string | object;
  onFeatureDetailsChange?: (details: FeatureDetailsData | null) => void;
}