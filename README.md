# HubSpot Duplicate Company Merger

This script automatically detects and merges duplicate companies in HubSpot CRM based on the company name (case-insensitive).

## How it works

- Fetches all companies from HubSpot
- Groups by lowercase company name
- Keeps the oldest company record
- Merges all others into it using the HubSpot Merge API

## Technologies

- JavaScript (Node.js)
- Axios
- HubSpot CRM API (v3)

## Usage

Replace the API key in the script:
```js
const API_KEY = "pat-eu1-12345678-abcdefgh12345678abcdef12";
