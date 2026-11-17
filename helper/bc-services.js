const axios = require('axios');

async function findCustomerByExternalReference(baseEndpoint, accessToken, externalRef) {
  const filter = `$filter=externalReference eq '${externalRef}'`;
  const url = `${baseEndpoint}?${filter}`;
  const resp = await axios.get(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  // Support OData style `value` wrapper or direct arrays
  const data = resp.data && resp.data.value ? resp.data.value : resp.data;
  return data && data.length ? data[0] : null;
}

async function createCustomerInBC(baseEndpoint, accessToken, payload) {
  const resp = await axios.post(baseEndpoint, payload, {
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
  });
  return resp;
}

function getCustomerBaseEndpoint() {
  const bcBase = process.env.BC_BASE_URL;
  const companyId = process.env.BC_COMPANY_ID;
  if (!bcBase || !companyId) throw new Error('BC_BASE_URL and BC_COMPANY_ID must be set in env');
  const customEndpoint = process.env.BC_CUSTOMER_ENDPOINT;
  if (customEndpoint) return customEndpoint;
  return `${bcBase.replace(/\/$/, '')}/api/v2.0/companies(${companyId})/customers`;
}

exports.createOrGetCustomer = async (accessToken, payload) => {
  const baseEndpoint = getCustomerBaseEndpoint();

  if (payload.externalReference) {
    try {
      const found = await findCustomerByExternalReference(baseEndpoint, accessToken, payload.externalReference);
      if (found) return { data: found };
    } catch (err) {
      // continue to create if lookup fails
      console.warn('BC lookup failed, will attempt create:', err.message || err);
    }
  }

  const created = await createCustomerInBC(baseEndpoint, accessToken, payload);
  return created;
};

exports.createCustomer = async (accessToken, payload) => {
  const baseEndpoint = getCustomerBaseEndpoint();
  return createCustomerInBC(baseEndpoint, accessToken, payload);
};

exports.findCustomerByExternalReference = async (accessToken, externalRef) => {
  const baseEndpoint = getCustomerBaseEndpoint();
  return findCustomerByExternalReference(baseEndpoint, accessToken, externalRef);
};
