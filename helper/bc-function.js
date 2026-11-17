const axios = require('axios');
const qs = require('querystring');
const bcServices = require('./bc-services');

// sensible defaults when BC calls fail
const defaultObj = {
  openSoAmount: [],
  ledgerAmount: []
};

// function extractResponseData(settledResponse, fallback) {
//   if (!settledResponse) return fallback;
//   if (settledResponse.status === 'fulfilled') {
//     const respData = settledResponse.value && settledResponse.value.data;
//     // Business Central sometimes returns an object with `value` array
//     return respData && respData.value ? respData.value : respData;
//   }
//   return fallback;
// }


async function getAccessToken() {
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${process.env.BC_TENANT_ID}/oauth2/v2.0/token`,
      qs.stringify({
        client_id: process.env.BC_CLIENT_ID,
        scope: process.env.BC_SCOPE,
        client_secret: process.env.BC_CLIENT_SECRET,
        grant_type: process.env.BC_GRANT_TYPE || 'client_credentials'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to get access token', { cause: error });
  }
}


exports.bc_fetchCustomerId = async (newEnquiryId) => {
  try {
    const accessToken = await getAccessToken();

    const getAddressUrl = `${process.env.LOCAL_URL}api/v1/sales/get-address/${newEnquiryId}`;

    // fetch address payload
    const addressResponse = await axios.get(getAddressUrl);
    const addressPayload = addressResponse.data;

    // Use JSON.stringify replacer to trim all strings automatically!
    const bcPayload = {
      ccustomer: JSON.stringify(addressPayload, (key, value) =>
        typeof value === 'string' ? value.trim() : value
      )
    };
    console.log("Payload to BC:", bcPayload);

    const response = await axios.post(
      `${getCodeUnitBaseUrl()}CustomerCreateMgt_CreateCustomerJson`,
      bcPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        params: {
          company: getCompanyNameForBC()
        }
      }
    );

    return response?.data?.value;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("BC Error Status:", error.response?.status);
      console.error("BC Error Data:", error.response?.data);
      console.error("BC Payload Sent:", JSON.stringify(error.config?.data));
    } else {
      console.error("Unexpected Error:", error);
    }

    throw error;
  }
};

exports.bc_customerOutstandingAmount = async (customerId) => {
  try {
    const accessToken = await getAccessToken();

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        company: getCompanyNameForBC(),
        $filter: `customerNo eq '${customerId}'`,
      },
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
      },
    };

    const [openSoAmountResponse, ledgerAmountResponse] =
      await Promise.allSettled([
        axios.get(`${getPageApiBaseUrl()}customerBalances`, axiosConfig),
        axios.get(`${getPageApiBaseUrl()}customerOutstandings`, axiosConfig),
      ]);

    if (openSoAmountResponse.status === "rejected" || ledgerAmountResponse.status === "rejected") {
      console.warn("BC call partial failure:", openSoAmountResponse.status, ledgerAmountResponse.status, customerId);
    }

    const openSoData = extractResponseData(openSoAmountResponse, defaultObj.openSoAmount);

    const ledgerData = extractResponseData(ledgerAmountResponse, defaultObj.ledgerAmount);

    const openSoAmount = getFirstValue(openSoData, "balanceAmount");
    const ledgerAmount = getFirstValue(ledgerData, "outstandingBalance");

    return {
      openSoAmount,
      ledgerAmount,
    };
  } catch (error) {
    console.error(
      "Business Central Outstanding Error Occurred:",
      error?.message || error
    );

    return {
      openSoAmount: 0,
      ledgerAmount: 0,
    };
  }
};


// enquiry outstanding amount
exports.bc_enquiryOutstandingAmount = async (customerId, enquiryId) => {
  try {

    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${getCodeUnitBaseUrl()}EnquiryOutstandingAPI_GetCustomerEnquiryOutstanding`,
      {
        customerNo: customerId,
        enquiryId: enquiryId
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        params: {
          company: getCompanyNameForBC()
        }
      }
    );

    return response.data?.value || 0;

  } catch (error) {

    console.error(
      "BC Enquiry Outstanding Error:",
      error?.message || error
    );

    throw error;
  }
};

// Sales Quatation Amount BC Implementation
exports.bc_enquirySalesQuotationAmount = async (enquiryId) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(`${getCodeUnitBaseUrl()}SalesQuoteAmountMgt_GetSalesQuotationAmount`,
      {
        enquiryId: enquiryId
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        params: {
          company: getCompanyNameForBC()
        }
      }
    );
    return response.data?.value || 0;

  } catch (error) {

    console.error(
      "BC Enquiry Sales Quotation Amount Error:",
      error?.message || error
    );

    throw error;
  }
}

//get-common-details 
exports.bc_getCommonDetails = async (itemCode) => {
  try {

    const reqBody = {
      itemCode: itemCode
    }
    const response = await Post(
      "ServiceEnabledCodeUnit_GetCommonDetails",
      reqBody,
      false // CodeUnit
    );

    const rawValue = response.data?.value;

    if (!rawValue) return {};

    if (typeof rawValue === "string") {
      return JSON.parse(rawValue);
    }

    return rawValue;

  } catch (error) {
    console.error("BC Common Details Error:", error?.message || error);
    throw error;
  }
};

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d)) return null;
  return d.toISOString().split("T")[0];
};

//Total Balance API 
exports.bc_getTotalBalance = async (customerCode, fromDate, toDate) => {
  try {

    const today = new Date().toISOString().split("T")[0];

    const reqBody = {
      customerNo: customerCode,
      fromDate: formatDate(fromDate) || "2020-01-01",
      toDate: formatDate(toDate) || today
    };


    const response = await Post(
      "ServiceEnabledCodeUnit_CustomerLedger_TotalBalance",
      reqBody,
      false // CodeUnit
    );
    // console.log("RAW BC RESPONSE:", JSON.stringify(response?.data, null, 2));

    const rawValue = response?.data?.value;

    //  handle string response
    let parsed = rawValue;

    if (typeof rawValue === "string") {
      try {
        parsed = JSON.parse(rawValue);
      } catch (e) {
        console.error("JSON parse failed:", rawValue);
        parsed = {};
      }
    }
    // console.log("PARSED VALUE:", parsed);
    return parsed;

  } catch (error) {
    console.error("BC Total Balance Error:", error?.message || error);
    console.log("BC Error Response:", error.response?.data);
    throw error;
  }
};

// Sales Order API 

exports.bc_getSalesOrders = async (params) => {
  try {
    const { customerCode = '', fromDate, toDate, page, pageSize } = params;

    const reqBody = {
      customerCode,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      pageNo: page || 1,
      pageSize: pageSize || 10,
      searchText: "",
      statusCode: "",
      deliveryName: ""
    };

    console.log("REQ BODY:", reqBody);

    const response = await Post(
      "ServiceEnabledCodeUnit_GetSalesOrders",
      reqBody,
      false
    );

    let data = response?.data?.value;

    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    return data;

  } catch (error) {
    console.error("BC Sales Orders Error:", error?.message || error);
    console.log("BC Error Response:", error.response?.data);
    throw error;
  }
};

// get invoice Api 

exports.bc_getInvoice = async (params) => {
  try {
    const { customerCode = '', fromDate, toDate, page, pageSize, typeCode = '', searchText = '', deliveryName = '' } = params;

    const reqBody = {
      customerCode,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      pageNo: page || 1,
      pageSize: pageSize || 10,
      searchText: searchText || "",
      typeCode: typeCode || "",
      deliveryName: deliveryName || ""
    };

    console.log("REQ BODY GET INVOICE:", reqBody);

    const response = await Post(
      "ServiceEnabledCodeUnit_GetInvoices",
      reqBody,
      false
    );

    let data = response?.data?.value;

    if (!data) return {};

    if (typeof data === "string") {
      return JSON.parse(data);
    }

    return data;

  } catch (error) {
    console.error("BC Invoice Error:", error?.message || error);
    console.log("BC Error Response:", error.response?.data);
    throw error;
  }
};

//get invoice details Api 

exports.bc_getInvoiceDetails = async (invoiceId) => {
  try {
    const reqBody = {
      invoiceId
    };

    console.log("REQ BODY GET INVOICE DETAILS:", reqBody);

    const response = await Post(
      "ServiceEnabledCodeUnit_GetInvoiceDetails",
      reqBody,
      false
    );

    let data = response?.data?.value;

    if (!data) return {};

    if (typeof data === "string") {
      return JSON.parse(data);
    }

    return data;

  } catch (error) {
    console.error("BC Invoice Details Error:", error?.message || error);
    console.log("BC Error Response:", error.response?.data);
    throw error;
  }
};

//get all curtains Api 

exports.bc_getAllCurtains = async (params) => {
  try {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const url = `curtains?$count=true&$top=${pageSize}&$skip=${skip}`;
    const response = await Get(url, null, true);

    let data = response?.data?.value;
    let totalCount = response?.data?.['@odata.count'] || 0;

    if (!data) return { data: [], totalCount: 0 };
    if (typeof data === "string") data = JSON.parse(data);

    return { data, totalCount };
  } catch (error) {
    console.error("BC All Curtains Error:", error?.message || error);
    throw error;
  }
};

exports.bc_getCurtainDetails = async (itemId) => {
  try {
    const response = await Get(`curtains?$filter=itemId eq '${itemId}'`, null, true);

    let data = response?.data?.value;
    if (!data) return [];
    if (typeof data === "string") return JSON.parse(data);
    return data;
  } catch (error) {
    console.error("BC Curtain Details Error:", error?.message || error);
    throw error;
  }
};

exports.bc_getCustomers = async () => {
  try {
    const url = `jdcustomerlists`;
    const response = await Get(url, null, true);

    let data = response?.data?.value;
    if (!data) return [];
    if (typeof data === "string") return JSON.parse(data);

    return data;
  } catch (error) {
    console.error("BC Customers Error:", error?.message || error);
    throw error;
  }
};

exports.bc_getCustomerPaginated = async (params) => {
  try {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const searchText = params?.searchText || "";
    const skip = (page - 1) * pageSize;

    let filterQuery = "";
    if (searchText) {
      // Escape single quotes 
      const safeSearch = searchText.replace(/'/g, "''");
      filterQuery = `&$filter=contains(Name, '${safeSearch}')`;
    }

    const url = `jdcustomerlists?$count=true&$top=${pageSize}&$skip=${skip}${filterQuery}`;
    const response = await Get(url, null, true);

    let data = response?.data?.value;
    let totalCount = response?.data?.['@odata.count'] || 0;

    if (!data) return { data: [], totalCount: 0 };
    if (typeof data === "string") data = JSON.parse(data);

    return { data, totalCount };
  } catch (error) {
    console.error("BC Customer Paginated Error:", error?.message || error);
    throw error;
  }
};

// get address api 

exports.bc_getAddresses = async () => {
  try {
    const url = `customerAddresses`;
    const response = await Get(url, null, true);

    let data = response?.data?.value;
    if (!data) return [];
    if (typeof data === "string") return JSON.parse(data);

    return data;
  } catch (error) {
    console.error("BC Customer Addresses Error:", error?.message || error);
    throw error;
  }
};

// get collections api 

exports.bc_getCollections = async (searchText, categoryCode, brandCode) => {
  try {
    const reqBody = {
      searchText: searchText || "",
      categoryCode: categoryCode || "FABRIC",
      brandCode: brandCode || ""
    };

    const response = await Post(
      "ServiceEnabledCodeUnit_GetCollections",
      reqBody,
      false
    );

    const rawValue = response.data?.value;
    if (!rawValue) return { data: [] };

    if (typeof rawValue === "string") {
      return JSON.parse(rawValue);
    }
    return rawValue;

  } catch (error) {
    console.error("BC Get Collections Error:", error?.message || error);
    throw error;
  }
};

// get alternate items api 

exports.bc_getAlternateItems = async (productLook, categoryCode, colorCode, searchText) => {
  try {
    const reqBody = {
      productLook: productLook || "",
      categoryCode: categoryCode || "",
      colorCode: colorCode || "",
      searchText: searchText || ""
    };

    const response = await Post(
      "ServiceEnabledCodeUnit_GetAlternateItems",
      reqBody,
      false
    );

    const rawValue = response.data?.value;
    if (!rawValue) return { data: [] };

    if (typeof rawValue === "string") {
      return JSON.parse(rawValue);
    }
    return rawValue;

  } catch (error) {
    console.error("BC Get Alternate Items Error:", error?.message || error);
    throw error;
  }
};

//get delivery names api 

exports.bc_getDeliveryNames = async (params) => {
  try {
    const {
      customerCode = '',
      fromDate,
      toDate,
      orderBy,
      page = 1,
      pageSize = 10,
      searchText = '',
      typeCode = ''
    } = params;

    const reqBody = {
      customerCode,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),

      // ✅ REQUIRED → send empty string
      searchText: searchText || "",

      // try with empty string first
      typeCode: typeCode,
      page: page,
      pageSize: pageSize,
      orderBy: orderBy
    };

    const response = await Post(
      "ServiceEnabledCodeUnit_GetDeliveryNames",
      reqBody,
      false
    );

    // BC response comes inside "value" as string
    // const parsed = JSON.parse(response.data.value);
    const parsed = response.data?.value;

    if (!parsed) return { data: [] };

    if (typeof parsed === "string") {
      return JSON.parse(parsed);
    }

    return parsed;

  } catch (error) {
    console.error("BC DELIVERY ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// get item details api 
exports.bc_getItemDetails = async (params) => {
  try {
    const { code, pageNo, pageSize, sortBy, sortOrder } = params;

    const reqBody = {
      collectionCode: "",
      brand: "",
      category: "",
      searchText: code,
      pageNo: pageNo ?? 1,
      pageSize: pageSize ?? 100,
      sortBy: sortBy ?? "itemName",
      sortOrder: sortOrder ?? "ASC"
    };

    const response = await Post(
      "ServiceEnabledCodeUnit_SearchStock",
      reqBody,
      false
    );


    const raw = response.data?.value;

    if (!raw) { return { value: [] }; }

    // DOUBLE PARSE (VERY IMPORTANT)
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parsed;

  } catch (error) {
    console.error("BC ITEM DETAILS ERROR:", error.response?.data || error.message);
    throw error;
  }
};

//get item api 

const formatString = (val) => val || "";

exports.bc_getItems = async (params) => {
  try {
    const {
      name = "",
      collectionCode = "",
      brandCode = "",
      categoryCode = "",
      page = 1,
      pageSize = 10
    } = params;

    const reqBody = {
      name: formatString(name),
      collectionCode: formatString(collectionCode),
      brandCode: formatString(brandCode),
      categoryCode: formatString(categoryCode),
      page,
      pageSize
    };

    const response = await Post(
      "ServiceEnabledCodeUnit_GetItems",
      reqBody,
      false
    );
    let parsed = {};

    if (response?.data?.value) {
      parsed = JSON.parse(response.data.value);
    }

    return parsed;

  } catch (error) {
    console.error("bc_getItem Error:", error.message);
    throw error;
  }
};

// mapping the get item api so to get all field for front-end

const getField = (obj, ...keys) => {
  if (!obj || typeof obj !== "object") return "";

  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      return obj[key];
    }

    const foundKey = Object.keys(obj).find(
      k => k.toLowerCase() === key.toLowerCase()
    );

    if (
      foundKey &&
      obj[foundKey] !== undefined &&
      obj[foundKey] !== null &&
      obj[foundKey] !== ""
    ) {
      return obj[foundKey];
    }
  }

  return "";
};

exports.mapBCItem = (item = {}) => {

  return {

    item_id: getField(item, "itemNo", "ITEMID"),
    fabric: getField(item, "itemName", "Name"),
    category: getField(item, "CategoryCode"),
    item_group: getField(item, "inventoryPostingGroup"),

    price: parseFloat(getField(item, "mrp")) || 0,
    sales_price: parseFloat(getField(item, "SalesPrices")) || 0,

    brand_name: getField(item, "bandname", "VendorName", "brandName", "BRANDCODE"),
    book_name: getField(item, "collectionCode", "CollectionCode"),

    repeat_horizontal: getField(item, "Repeathorizontal"),
    repeat_vertical: getField(item, "Repeatvertical"),
    width: getField(item, "width"),

    tax: getField(item, "tax") || "",
    status: getField(item, "Status") || "Active",

    is_blocked: getField(item, "Blocked") || false,
  };
};


exports.bc_getItemDetailsMapped = async (
  searchText,
  collectionCode,
  brandCode = "",
  categoryCode = ""
) => {
  try {

    const reqBody = {
      searchText: searchText,
      collectionCode: collectionCode || "",
      brand: brandCode || "",
      category: categoryCode || "",
      pageNo: 1,
      pageSize: 1,
      sortBy: "itemName",
      sortOrder: "ASC"
    };

    const response = await Post(
      "ServiceEnabledCodeUnit_SearchStock",
      reqBody,
      false
    );

    let item = {};

    try {
      let data = response;

      // axios case
      if (data?.data) {
        data = data.data;
      }

      // sometimes inside value
      if (data?.value) {
        data = data.value;
      }

      // string case
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      // final extraction
      if (Array.isArray(data?.value)) {
        item = data.value[0] || {};
      } else if (Array.isArray(data)) {
        item = data[0] || {};
      }

    } catch (err) {
      console.error("Parsing Error:", err.message);
    }
    return exports.mapBCItem(item);

  } catch (error) {
    console.error("BC ITEM ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// sales order detail api 

exports.bc_getSalesOrderDetails = async (code) => {
  try {
    const reqBody = {
      salesOrderNo: code
    };

    const response = await Post(
      "ServiceEnabledCodeUnit_GetSalesOrderDetails",
      reqBody,
      false
    );

    // console.log("REQ BODY TO BC:", reqBody);
    // console.log("RAW BC RESPONSE:", response?.data);

    let parsed = {
      message: "error",
      data: null,
      status: false
    };

    if (response?.data?.value) {
      try {
        parsed = JSON.parse(response.data.value);
      } catch (e) {
        console.error("JSON parse error:", e.message);
      }
    }

    return parsed;

  } catch (error) {
    console.error("bc_getSalesOrderDetails Error:", error.message);
    throw error;
  }
};

// bc customer ledger api 

exports.bc_getCustomerLedger = async (params) => {
  try {
    const {
      customerCode,
      customerNo,
      fromDate,
      toDate
    } = params;

    const normalizedCustomerNo = customerCode || customerNo || "";

    const reqBody = {
      customerNo: normalizedCustomerNo,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate)
    };

    // console.log("REQ BODY TO BC:", reqBody);
    const response = await Post(
      "ServiceEnabledCodeUnit_GetCustomerLedgerEntries",
      reqBody,
      false
    );

    // console.log("RAW BC RESPONSE:", response?.data);

    let parsed = {
      totalData: 0,
      message: "error",
      data: [],
      status: false
    };

    if (response?.data?.value) {
      try {
        parsed = JSON.parse(response.data.value);
      } catch (e) {
        console.error("Parse error:", e.message);
      }
    }

    return parsed;

  } catch (error) {
    console.error(" BC ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// get category api

exports.bc_getCategory = async () => {
  try {
    const response = await Post(
      "ServiceEnabledCodeUnit_GetCategory", // update if needed
      {}, // no body required
      false
    );

    // console.log("RAW BC RESPONSE:", response?.data);

    let parsed = {
      message: "error",
      data: [],
      status: false
    };

    if (response?.data?.value) {
      try {
        parsed = JSON.parse(response.data.value);
      } catch (e) {
        console.error("Parse error:", e.message);
      }
    } else {
      console.error("BC value missing:", response?.data);
    }

    return parsed;

  } catch (error) {
    console.error(" BC ERROR:", error?.response?.data || error?.message);
    throw error;
  }
};

// get brands api 

exports.bc_getBrands = async (params) => {
  try {
    const {
      collectionCode = "",
      searchText = "",
      categoryCode = "",
      orderBy = "",
      page = 1,
      pageSize = 10
    } = params;

    const queryParams = {
      collectionCode,
      searchText,
      categoryCode,
      orderBy: orderBy || "DESCRIPTION",
      pageNo: page,
      pageSize
    };

    const response = await Get(
      "jdbrandlists",   // endpoint name
      queryParams,
      true              // ✅ API page
    );

    let parsed = {
      data: [],
      status: false
    };

    if (response?.data?.value) {
      parsed = {
        data: response.data.value,
        status: true
      };
    }

    return parsed;

  } catch (error) {
    console.error("BC ERROR:", error?.response?.data || error?.message);
    throw error;

  }
}

function extractResponseData(settledResponse, fallback) {
  if (!settledResponse) return fallback;

  if (settledResponse.status === "fulfilled") {
    const respData = settledResponse.value?.data;
    return respData?.value ? respData.value : respData;
  }

  return fallback;
}

function getFirstValue(arr, key) {
  return arr?.[0]?.[key] ?? 0;
}

function getApiBaseUrl() {
  return `${process.env.BC_API_BASE_URL}${process.env.BC_TENANT_ID}/${process.env.BC_SYS_ENV}`;
}


function getPageApiBaseUrl() {
  return `${getApiBaseUrl()}/api/${process.env.BC_API_USER}/floorfurnishing/v2.0/`;
}

function getCodeUnitBaseUrl() {
  return `${getApiBaseUrl()}/ODataV4/`;
}
function getCompanyNameForBC() {
  return process.env.BC_COMPANY_NAME;
}



async function Get(url, body, isPage = true) {

  const accessToken = await getAccessToken();

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      company: getCompanyNameForBC(),
    },
    paramsSerializer: (params) => {
      return new URLSearchParams(params).toString();
    },
  };


  const finalUrl = `${isPage ? getPageApiBaseUrl() : getCodeUnitBaseUrl()}${url}`;
  return axios.get(finalUrl, axiosConfig);
}

//post -- 
async function Post(url, body, isPage = true) {

  const accessToken = await getAccessToken();

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    params: {
      company: getCompanyNameForBC(),
    },
    paramsSerializer: (params) => {
      return new URLSearchParams(params).toString();
    },
  };

  const finalUrl = `${isPage ? getPageApiBaseUrl() : getCodeUnitBaseUrl()}${url}`;

  return axios.post(finalUrl, body, axiosConfig);
}


exports.bc_getItemsNM = async (params) => {
  try {
    const {
      name = "",
      collectionCode = "",
      brandCode = "",
      categoryCode = "",
      page = 1,
      pageSize = 10
    } = params;

    const reqBody = {
      searchText: name || "",
      collectionCode: collectionCode || "",
      brand: brandCode || "",
      category: categoryCode || "",
      pageNo: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      sortBy: "itemName",
      sortOrder: "ASC"
    };


    const response = await Post(
      "ServiceEnabledCodeUnit_SearchStock",
      reqBody,
      false
    );

    let item = {};

    try {
      let data = response;

      // axios case
      if (data?.data) {
        data = data.data;
      }

      if (data?.value) {
        data = data.value;
      }
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const source = Array.isArray(data?.value) ? data.value : Array.isArray(data) ? data : [];

      const result = [];

      for (const item of source) {
        const mapped = exports.mapBCItem(item);
        result.push(mapped);
      }

      return result;
    } catch (err) {
      console.error("Parsing Error:", err.message);
    }
    return exports.mapBCItem(item);

  } catch (error) {
    console.error("BC ITEM ERROR:", error.response?.data || error.message);
    throw error;
  }
};

exports.bc_createAmount = async (payload) => {
    try {

        const item = payload.data[0];
        const reqBody = {
                  customerNo: item.customerId,
                  enquiryId: item.enquiryId,
                  paymentId: item.paymentId,
                  amount: item.amount,
                  createdAt: item.createdAt
          };
        const result = await Post('enquiryPayments', reqBody, true);
        return result;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Create Amount In AX Error:-', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}
