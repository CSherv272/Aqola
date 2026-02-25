export type School = {
    urn: string;
    lsoa_id: string;
    school_name: string;
    postcode: string;
    is_primary: boolean;
    is_secondary: boolean;
    is_post16: boolean;
    gender: string;
    year_range: string;
    ofsted_ranking: number;
    latitude: number;
    longitude: number;
};

export type Crime = {
    lsoa_id: string;
    date: Date; //may need changing
    latitude: number;
    longitude: number;
    crime_type: string;
};

export type CrimeTypes = {
    values: string[]
}

export type UniqueMonths = {
    values: Date[]
}