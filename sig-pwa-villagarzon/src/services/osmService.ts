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

export async function getSchoolsOSM() {

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

    const data = await response.json();

    return {
        type: "FeatureCollection",
        features: data.elements.map((item: OsmElement) => {
            console.log({ item })
            const lon = item.lon || item.center?.lon;
            const lat = item.lat || item.center?.lat;

            return {
                type: "Feature",
                properties: {
                    name: item.tags?.name || "Sin nombre"
                },
                geometry: {
                    type: "Point",
                    coordinates: [lon, lat]
                }
            }

        })
    };

}