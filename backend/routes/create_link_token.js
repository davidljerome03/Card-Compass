// backend/routes/create_link_token.js
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

app.post('/api/create_link_token', async (req, res) => {
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: 'user-id-123', // Unique ID for your user in your DB
      },
      client_name: 'My Credit Card App',
      // 'liabilities' is REQUIRED to get credit limits, APR, and overdue status
      products: ['liabilities', 'transactions'], 
      country_codes: ['US'],
      language: 'en',
      // REQUIRED for Capital One (OAuth). Must match "Allowed Redirect URIs" in Dashboard.
      redirect_uri: 'http://localhost:3000/', 
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error(error);
  }
});