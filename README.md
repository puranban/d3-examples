# Weather Data Visualization Dashboard

## Overview
Interactive dashboard visualizing Kathmandu weather data with D3.js and React, featuring:
- Filter to see forecast of 1, 3, 7, 14, and 16 days
- Multi-line chart (hourly temperature trends)
- Grouped bar chart (temperature + precipitation)
- Scatter plot (precipitation vs. humidity)
- Visit live here https://d3-examples-drab.vercel.app/

## Tech Stack
- **Core**: React + TypeScript
- **Visualization**: D3.js
- **Utilities**: shadcn
- **Build**: Vite
- **Deployment**: Vercel

## Key Features
- **Responsive** designs
- **Interactive** tooltips and filtering
- **Color-coded** multi-day comparisons
- **Proper axis labeling** with units

## Main Components
1. `LineChart.tsx` - Multi-day hourly trends 
2. `BarChart.tsx` - Daily temperature/precipitation comparison
3. `ScatterPlot.tsx` - Precipitation-humidity correlation

## Challenges & Solutions
| Challenge | Solution |
|-----------|----------|
| D3+React integration | Used refs for D3 DOM manipulation |
| API for realtime weather data | Use [open-meteo](https://open-meteo.com/) public api|
| Temporal data | Normalized hourly data across days |
| Multiple scales | Dual measurement system with legends |
| TypeScript typing | Created custom interfaces for D3 |

### Setup Prerequisites

To begin, ensure you have network access. Then, you'll need the following:

1. [Git](https://git-scm.com/)
2. [Node.JS](https://nodejs.org/en/) version >=22
3. [Pnpm](https://pnpm.io/)

### Local development

Clone the repository using HTTPS, SSH, or Github CLI

```bash
git@github.com:puranban/d3-examples.git #SSH
https://github.com/puranban/d3-examples.git #HTTPS
gh repo clone puranban/d3-examples #Github CLI
```
* Navigate to the project directory
```bash
cd d3-examples
```
* Create environment variables
```bash
touch .env
```

* Update the .env file with the API url
```bash
APP_TITLE=d3-visualization
APP_API_ENDPOINT=https://api.open-meteo.com/v1
```

* Install dependencies
```bash
pnpm install
```

* Start local development server
```bash
pnpm dev
```
