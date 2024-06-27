export interface GetDirectionsProps {
  origin: `${string},${string}`;
  destination: `${string},${string}`;
  departure_time: number;
}

export interface GetDirectionsResponse {
  status: string;
  routes: Array<{
    legs: Array<{ distance?: { text: string; value: number } }>;
  }>;
}

export interface GetGeocodeResponse {
  status: string;
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
}
