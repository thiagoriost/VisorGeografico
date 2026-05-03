type OsmElement = {
    type: "node" | "way" | "relation";
    id: number;
    lat?: number;
    lon?: number;
    center?: {
        lat: number;
        lon: number;
    };
    tags?: {
        amenity?: string;
        divipola?: string;
        fixme?: string;
        is_in?: string;
        name?: string;
        note?: string;
        source?: string;
        [key: string]: string | undefined;
    };
};

type OverpassResponse = {
    elements: OsmElement[];
};

type SchoolFeature = {
    type: "Feature";
    properties: {
        nombre: string;
    };
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
};

type SchoolsFeatureCollection = GeoJSON.FeatureCollection<
    GeoJSON.Point,
    { nombre: string }
>;

export async function getSchoolsOSM(): Promise<SchoolsFeatureCollection> {

    const query = `
        [out:json][timeout:25];
        area["name"="Villagarzón"]->.searchArea;

        (
        node["amenity"="school"](area.searchArea);
        way["amenity"="school"](area.searchArea);
        relation["amenity"="school"](area.searchArea);
        );

        out center tags;
        `
    ;

    const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
            method: "POST",
            body: query
        }
    );

    const data: OverpassResponse = await response.json();

    const features: SchoolFeature[] = data.elements
        .map((item): SchoolFeature | null => {
            const lon = item.lon ?? item.center?.lon;
            const lat = item.lat ?? item.center?.lat;

            if (lon === undefined || lat === undefined) {
                return null;
            }

            return {
                type: "Feature",
                properties: {
                    nombre: item.tags?.name || "Sin nombre"
                },
                geometry: {
                    type: "Point",
                    coordinates: [lon, lat]
                }
            };
        })
        .filter((feature): feature is SchoolFeature => feature !== null);

    // Copia este log para hardcodear los datos offline en un .geojson.
    // console.log("offlineSchoolsFeatures", JSON.stringify(features, null, 2));

    return {
        type: "FeatureCollection",
        features
    };

}