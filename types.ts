export interface DataPoint {
  year: number;
  city: string;
  value: number;
}

export interface CitySeries {
  city: string;
  color: string;
  data: { year: number; value: number }[];
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}
