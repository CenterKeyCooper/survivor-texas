import Airtable from 'airtable';

// Initialize Airtable base
// You'll need to set AIRTABLE_PAT and AIRTABLE_BASE_ID in your .env.local file
export function getAirtableBase() {
  const personalAccessToken = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!personalAccessToken || !baseId) {
    throw new Error('Airtable configuration missing. Please set AIRTABLE_PAT and AIRTABLE_BASE_ID in your .env.local file.');
  }

  // Configure Airtable with personal access token
  const base = new Airtable({
    apiKey: personalAccessToken,
    endpointUrl: 'https://api.airtable.com',
  }).base(baseId);

  return base;
}

