// backend/routes/exchange_token.js

app.post('/api/exchange_public_token', async (req, res) => {
  const { public_token } = req.body;

  try {
    // 1. Exchange public_token for access_token
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: public_token,
    });
    const accessToken = exchangeResponse.data.access_token;

    // 2. Fetch Liabilities (The specific endpoint for Credit Card data)
    const liabilitiesResponse = await client.liabilitiesGet({
      access_token: accessToken,
    });

    const creditAccounts = liabilitiesResponse.data.liabilities.credit;

    // 3. Log the data to prove it worked
    console.log(`Found ${creditAccounts.length} Credit Cards:`);
    creditAccounts.forEach(card => {
      console.log(`- Card: ${card.meta.name} (Limit: $${card.meta.limit})`);
      console.log(`  Balance: $${card.last_payment_amount}`);
      console.log(`  APR: ${card.purchase_apr * 100}%`);
    });

    res.json(creditAccounts);
  } catch (error) {
    console.error(error);
  }
});