const axios = require("axios");

const API_KEY = "pat-eu1-12345678-abcdefgh12345678abcdef12";
const BASE_URL = "https://api.hubapi.com";

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

// 1. Fetch all companies from HubSpot
async function getAllCompanies() {
  let companies = [];
  let url = `${BASE_URL}/crm/v3/objects/companies?limit=100&properties=name,createdate`;

  while (url) {
    try {
      const res = await axios.get(url, { headers });
      const data = res.data;
      companies = companies.concat(data.results);

      const nextPage = data.paging?.next?.link;
      url = nextPage || null;
    } catch (err) {
      console.error("Error fetching companies:", err.response?.data || err.message);
      break;
    }
  }

  return companies;
}

// 2. Group companies by lowercased name
function groupCompaniesByName(companies) {
  const groups = {};
  companies.forEach((company) => {
    const name = (company.properties.name || "").toLowerCase();
    if (!groups[name]) groups[name] = [];
    groups[name].push(company);
  });
  return groups;
}

// 3. Merge duplicates into the oldest company
async function mergeCompanies(groups) {
  for (const name in groups) {
    const group = groups[name];
    if (group.length < 2) continue;

    group.sort((a, b) => new Date(a.properties.createdate) - new Date(b.properties.createdate));
    const primary = group[0];

    for (let i = 1; i < group.length; i++) {
      const duplicate = group[i];
      try {
        await axios.post(
          `${BASE_URL}/crm/v3/objects/companies/${primary.id}/merge`,
          { objectId: duplicate.id },
          { headers }
        );
        console.log(`Merged ${duplicate.id} into ${primary.id}`);
      } catch (err) {
        console.error(`Error merging ${duplicate.id}:`, err.response?.data || err.message);
      }
    }
  }
}

// 4. Run the script
async function main() {
  console.log("Fetching companies...");
  const companies = await getAllCompanies();

  console.log(`Grouping ${companies.length} companies by name...`);
  const grouped = groupCompaniesByName(companies);

  console.log("Merging duplicates...");
  await mergeCompanies(grouped);

  console.log("Done.");
}

main();
