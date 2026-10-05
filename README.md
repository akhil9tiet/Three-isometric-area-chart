# Data Atlas

An interactive area chart for comparing historical cost of living across US cities and illustrative technology stock prices.

![Data Atlas demo](./assets/threeChartDemo.gif)


When GitHub Pages is enabled, the site is published at <https://akhil9tiet.github.io/Three-isometric-area-chart/>.

## Enable GitHub Pages

For the first deployment, open the repository's **Settings > Pages** and set **Build and deployment > Source** to **GitHub Actions**. Then run the `Deploy to GitHub Pages` workflow from the Actions tab, or push a commit to `main`.

## Views and controls

- Switch between the Cities and Stocks datasets in the header.
- In 3D view, scroll to navigate through the series.
- Turn on 2D view to collapse the series into an overlapping, front-facing area chart with axes and a color legend.
- Hover over a series in 2D view to see its value for the nearest year.

## Requirements

- Node.js 24 or newer (through Node.js 26)
- npm

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Build

```sh
npm run build
npm run preview
```

## Data

Edit `COST_OF_LIVING_DATA` and `STOCK_DATA` in `constants.ts` to change the sample data. Stock values are illustrative and are not investment data.
