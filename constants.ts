import { DataPoint } from "./types";

export const COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#d946ef", // Fuchsia
  "#f43f5e", // Rose
];

export const COST_OF_LIVING_DATA: DataPoint[] = [
  { year: 1970, city: "San Francisco", value: 47 },
  { year: 1970, city: "Seattle", value: 42 },
  { year: 1970, city: "New York", value: 50 },
  { year: 1970, city: "Miami", value: 39 },
  { year: 1970, city: "Los Angeles", value: 43 },
  { year: 1970, city: "Las Vegas", value: 35 },
  { year: 1970, city: "Boston", value: 45 },
  { year: 1970, city: "Kansas City", value: 33 },
  { year: 1970, city: "Chicago", value: 39 },

  { year: 1980, city: "San Francisco", value: 115 },
  { year: 1980, city: "Seattle", value: 100 },
  { year: 1980, city: "New York", value: 120 },
  { year: 1980, city: "Miami", value: 85 },
  { year: 1980, city: "Los Angeles", value: 95 },
  { year: 1980, city: "Las Vegas", value: 70 },
  { year: 1980, city: "Boston", value: 105 },
  { year: 1980, city: "Kansas City", value: 75 },
  { year: 1980, city: "Chicago", value: 90 },

  { year: 1990, city: "San Francisco", value: 160 },
  { year: 1990, city: "Seattle", value: 145 },
  { year: 1990, city: "New York", value: 170 },
  { year: 1990, city: "Miami", value: 130 },
  { year: 1990, city: "Los Angeles", value: 140 },
  { year: 1990, city: "Las Vegas", value: 110 },
  { year: 1990, city: "Boston", value: 155 },
  { year: 1990, city: "Kansas City", value: 115 },
  { year: 1990, city: "Chicago", value: 130 },

  { year: 2000, city: "San Francisco", value: 220 },
  { year: 2000, city: "Seattle", value: 200 },
  { year: 2000, city: "New York", value: 240 },
  { year: 2000, city: "Miami", value: 180 },
  { year: 2000, city: "Los Angeles", value: 190 },
  { year: 2000, city: "Las Vegas", value: 150 },
  { year: 2000, city: "Boston", value: 210 },
  { year: 2000, city: "Kansas City", value: 160 },
  { year: 2000, city: "Chicago", value: 175 },

  { year: 2010, city: "San Francisco", value: 270 },
  { year: 2010, city: "Seattle", value: 250 },
  { year: 2010, city: "New York", value: 290 },
  { year: 2010, city: "Miami", value: 220 },
  { year: 2010, city: "Los Angeles", value: 240 },
  { year: 2010, city: "Las Vegas", value: 190 },
  { year: 2010, city: "Boston", value: 260 },
  { year: 2010, city: "Kansas City", value: 200 },
  { year: 2010, city: "Chicago", value: 215 },

  { year: 2020, city: "San Francisco", value: 310 },
  { year: 2020, city: "Seattle", value: 290 },
  { year: 2020, city: "New York", value: 330 },
  { year: 2020, city: "Miami", value: 260 },
  { year: 2020, city: "Los Angeles", value: 280 },
  { year: 2020, city: "Las Vegas", value: 220 },
  { year: 2020, city: "Boston", value: 300 },
  { year: 2020, city: "Kansas City", value: 230 },
  { year: 2020, city: "Chicago", value: 250 },

  { year: 2025, city: "San Francisco", value: 370 },
  { year: 2025, city: "Seattle", value: 340 },
  { year: 2025, city: "New York", value: 390 },
  { year: 2025, city: "Miami", value: 310 },
  { year: 2025, city: "Los Angeles", value: 330 },
  { year: 2025, city: "Las Vegas", value: 260 },
  { year: 2025, city: "Boston", value: 360 },
  { year: 2025, city: "Kansas City", value: 270 },
  { year: 2025, city: "Chicago", value: 300 }
];

// Approximate Split-Adjusted Historical Stock Prices (2016-2024)
export const STOCK_DATA: DataPoint[] = [
  // Microsoft (MSFT)
  { year: 2016, city: "Microsoft", value: 60 },
  { year: 2017, city: "Microsoft", value: 85 },
  { year: 2018, city: "Microsoft", value: 100 },
  { year: 2019, city: "Microsoft", value: 155 },
  { year: 2020, city: "Microsoft", value: 220 },
  { year: 2021, city: "Microsoft", value: 335 },
  { year: 2022, city: "Microsoft", value: 240 },
  { year: 2023, city: "Microsoft", value: 375 },
  { year: 2024, city: "Microsoft", value: 420 },

  // Google (GOOGL)
  { year: 2016, city: "Google", value: 40 },
  { year: 2017, city: "Google", value: 52 },
  { year: 2018, city: "Google", value: 52 },
  { year: 2019, city: "Google", value: 67 },
  { year: 2020, city: "Google", value: 88 },
  { year: 2021, city: "Google", value: 145 },
  { year: 2022, city: "Google", value: 88 },
  { year: 2023, city: "Google", value: 140 },
  { year: 2024, city: "Google", value: 175 },

  // Nvidia (NVDA) - Split Adjusted
  { year: 2016, city: "Nvidia", value: 7 },
  { year: 2017, city: "Nvidia", value: 15 },
  { year: 2018, city: "Nvidia", value: 20 },
  { year: 2019, city: "Nvidia", value: 15 },
  { year: 2020, city: "Nvidia", value: 32 },
  { year: 2021, city: "Nvidia", value: 75 },
  { year: 2022, city: "Nvidia", value: 48 },
  { year: 2023, city: "Nvidia", value: 120 },
  { year: 2024, city: "Nvidia", value: 135 },

  // Meta (META)
  { year: 2016, city: "Meta", value: 115 },
  { year: 2017, city: "Meta", value: 175 },
  { year: 2018, city: "Meta", value: 130 },
  { year: 2019, city: "Meta", value: 205 },
  { year: 2020, city: "Meta", value: 270 },
  { year: 2021, city: "Meta", value: 335 },
  { year: 2022, city: "Meta", value: 120 },
  { year: 2023, city: "Meta", value: 350 },
  { year: 2024, city: "Meta", value: 500 },

  // Amazon (AMZN)
  { year: 2016, city: "Amazon", value: 40 },
  { year: 2017, city: "Amazon", value: 58 },
  { year: 2018, city: "Amazon", value: 75 },
  { year: 2019, city: "Amazon", value: 92 },
  { year: 2020, city: "Amazon", value: 160 },
  { year: 2021, city: "Amazon", value: 165 },
  { year: 2022, city: "Amazon", value: 85 },
  { year: 2023, city: "Amazon", value: 150 },
  { year: 2024, city: "Amazon", value: 185 },

  // Tesla (TSLA)
  { year: 2016, city: "Tesla", value: 15 },
  { year: 2017, city: "Tesla", value: 20 },
  { year: 2018, city: "Tesla", value: 22 },
  { year: 2019, city: "Tesla", value: 28 },
  { year: 2020, city: "Tesla", value: 150 },
  { year: 2021, city: "Tesla", value: 350 },
  { year: 2022, city: "Tesla", value: 120 },
  { year: 2023, city: "Tesla", value: 250 },
  { year: 2024, city: "Tesla", value: 220 },

  // Netflix (NFLX)
  { year: 2016, city: "Netflix", value: 100 },
  { year: 2017, city: "Netflix", value: 190 },
  { year: 2018, city: "Netflix", value: 270 },
  { year: 2019, city: "Netflix", value: 320 },
  { year: 2020, city: "Netflix", value: 500 },
  { year: 2021, city: "Netflix", value: 600 },
  { year: 2022, city: "Netflix", value: 200 },
  { year: 2023, city: "Netflix", value: 480 },
  { year: 2024, city: "Netflix", value: 650 },

  // Palantir (PLTR) - IPO 2020
  { year: 2016, city: "Palantir", value: 0 },
  { year: 2017, city: "Palantir", value: 0 },
  { year: 2018, city: "Palantir", value: 0 },
  { year: 2019, city: "Palantir", value: 0 },
  { year: 2020, city: "Palantir", value: 10 },
  { year: 2021, city: "Palantir", value: 25 },
  { year: 2022, city: "Palantir", value: 7 },
  { year: 2023, city: "Palantir", value: 17 },
  { year: 2024, city: "Palantir", value: 25 },
];