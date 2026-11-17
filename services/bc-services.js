const { bc_fetchCustomerId,
    bc_getCommonDetails,
    bc_getSalesOrders,
    bc_getInvoice,
    bc_getInvoiceDetails,
    bc_getAllCurtains,
    bc_getCurtainDetails,
    bc_getCustomers,
    bc_getCustomerPaginated,
    bc_getTotalBalance,
    bc_getAddresses,
    bc_getCollections,
    bc_getAlternateItems,
    bc_getDeliveryNames,
    bc_getItemDetails, 
    bc_getItems,
    bc_getSalesOrderDetails,
    bc_getCustomerLedger,
    bc_getCategory,
    bc_getBrands, 
    mapBCItem,
    bc_getItemDetailsMapped,
    bc_getItemsNM,
} = require("../helper/bc-function");

exports.fetchCustomerIdService = async (newEnquiryId) => {
    try {
        const response = await bc_fetchCustomerId(newEnquiryId);
        return response;
    } catch (error) {
        console.error("Error fetching customer ID from BC:", error);
        throw error;
    }
}

exports.getCommonDetails = async (code) => {
    const result = await bc_getCommonDetails(code);

    if (!result?.Code) return null;
    // exception throw logic is added in the super-admin controller

    const {
        Code,
        Name,
        SearchName,
        Batches = [],
        QtyInv = 0
    } = result;

    return {
        Code,
        Name,
        SearchName,
        Batches,
        QtyInv
    };
};

//total balance service


exports.getTotalBalance = async (customerCode, fromDate, toDate) => {
    const result = await bc_getTotalBalance(customerCode, fromDate, toDate);

    if (!result?.data?.customerCode) return null;

    const {
        customerCode: code,
        totalBalance = 0,
        currency = "",
        fromDate: from,
        toDate: to
    } = result.data;

    return {
        customerCode: code,
        totalBalance,
        currency,
        fromDate: from,
        toDate: to
    };
};

//sales order service

exports.getSalesOrders = async (params) => {
    const result = await bc_getSalesOrders(params);

    // check properly
    if (!result || !result.data) {
        return {
            totalCount: 0,
            data: []
        };
    }

    return {
        totalCount: result.totalCount || 0,
        data: result.data || []
    };
};

//get invoice service

exports.getInvoice = async (params) => {
    const result = await bc_getInvoice(params);

    // check properly
    if (!result || !result.data) {
        return {
            total: 0,
            data: []
        };
    }

    return {
        total: result.total || 0,
        data: result.data || []
    };
};

exports.getInvoiceDetails = async (invoiceId) => {
    const result = await bc_getInvoiceDetails(invoiceId);

    // check properly
    if (!result || !result.data) {
        return null;
    }

    return result.data;
};

//curtain service

const mapCurtain = (row) => ({
    ITEMID: row.itemId,
    NAMEALIAS: row.nameAlias,
    LENGTH: row.length,
    WIDTH: row.width,
    REPEATHORIZONTAL: row.repeatHorizontal,
    REPEATVERTICAL: row.repeatVertical,
    ITEMGROUPID: row.itemGroupId,
    COLLECTIONCODE: row.collectionCode,
    CATEGORYCODE: row.categoryCode,
    BRANDCODE: row.brandCode,
    MAXIMUMRETAILPRICE_IN: row.maximumRetailPriceIn,
    DATAAREAID: row.dataAreaId,
    TAXVALUE: row.taxValue,
    "SALES PRICE": row.salesPrice
});

exports.getAllCurtains = async (params) => {
    const result = await bc_getAllCurtains(params);
    if (!result || !result.data) {
        return { totalCount: 0, data: [] };
    }

    return {
        totalCount: result.totalCount || 0,
        data: result.data.map(mapCurtain)
    };
};

exports.getCurtainDetails = async (itemId) => {
    const result = await bc_getCurtainDetails(itemId);
    if (!result) return [];
    return result.map(mapCurtain);
};

const mapCustomer = (row, totalCount = null) => {
    const mapped = {
        ACCOUNTNUM: row.AccountNum,
        NAME: row.Name,
        CUSTGROUP: row.CustGroup,
        ACX_EMAIL: row.Email,
        ACX_EMAIL2: row.Email2,
        ACX_PHONENO: row.PhoneNo,
        DATAAREAID: "ffg",
        ACX_MOBILENO: row.MobileNo,
        CREATEDDATETIME: row.SystemCreatedAt,
        MODIFIEDDATETIME: row.SystemModifiedAt,
        TYPE: row.Type
    };
    if (totalCount !== null) {
        mapped.TotalCount = totalCount;
    }
    return mapped;
};

exports.getCustomers = async () => {
    const result = await bc_getCustomers();
    if (!result) return [];
    return result.map(row => mapCustomer(row));
};

exports.getCustomerPaginated = async (params) => {
    const result = await bc_getCustomerPaginated(params);
    if (!result || !result.data) {
        return { totalCount: 0, data: [] };
    }

    // Inject TotalCount into every mapped row just like the old CTE SQL query did
    return {
        totalCount: result.totalCount || 0,
        data: result.data.map(row => mapCustomer(row, result.totalCount || 0))
    };
};

//get address

const mapAddress = (row) => ({
    AccountNum: row.accountNum,
    ISPRIMARY: row.isPrimary,
    LOCATIONNAME: row.locationName,
    CITY: row.city,
    STATE: row.state,
    ZIPCODE: row.zipCode,
    COUNTRYREGIONID: row.countryRegionId,
    ADDRESS: row.address,
    VALIDFROM: row.validFrom,
    VALIDTO: row.validTo
});

exports.getAddresses = async () => {
    const result = await bc_getAddresses();
    if (!result) return [];
    return result.map(mapAddress);
};

exports.getCollections = async (searchText, categoryCode, brandCode) => {
    const result = await bc_getCollections(searchText, categoryCode, brandCode);
    return result;
};

exports.getAlternateItems = async (productLook, categoryCode, colorCode, searchText) => {
    const result = await bc_getAlternateItems(productLook, categoryCode, colorCode, searchText);
    return result;
};


// delivery Name Service 

exports.getDeliveryNames = async (params) => {
    try {

        const bcRes = await bc_getDeliveryNames(params);

        // transform same as old API
        const deliveryNames = (bcRes.data || []).map(item => ({
            deliveryName: item.deliveryName
        }));

        return {
            message: "query",
            status: true,
            data: deliveryNames
        };

    } catch (error) {
        throw error;
    }
};

// get item details service 
exports.getItemDetails = async (params) => {
    try {
        const bcRes = await bc_getItemDetails(params);

        // Safely get the first item or empty object
        const itemRaw =
            (Array.isArray(bcRes?.value) && bcRes.value.length
                ? bcRes.value[0]
                : Array.isArray(bcRes) && bcRes.length
                    ? bcRes[0]
                    : bcRes) || {};

        // Helper: safely get property ignoring case
        const getField = (obj, ...keys) => {
            for (const key of keys) {
                if (key in obj) return obj[key];
                // try case-insensitive match
                const match = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
                if (match) return obj[match];
            }
            return undefined;
        };

        // Map BC fields → OLD API format
        const item = {
            ITEMID: getField(itemRaw, "itemNo", "No", "Item_No") ?? "",
            CompanyCode: getField(itemRaw, "companyCode", "Company_Code") ?? "",

            QtySO: getField(itemRaw, "QtySO") ?? 0,
            QtyPO: getField(itemRaw, "QtyPO") ?? 0,
            QtyInv: getField(itemRaw, "QtyInv") ?? 0,
            QtyFree: Math.max((getField(itemRaw, "QtyInv") ?? 0) - (getField(itemRaw, "QtySO") ?? 0), 0),

            ItemFamilyCode: getField(itemRaw, "itemFamilyCode") ?? "",
            VendorGroup: getField(itemRaw, "VendorGroup") ?? "",
            Color: getField(itemRaw, "Color") ?? null,
            ProductLook: getField(itemRaw, "ProductLook") ?? "",
            CategoryCode: getField(itemRaw, "CategoryCode") ?? "",
            ExternalItemId: getField(itemRaw, "ExternalItemId") ?? "",
            VendorName: getField(itemRaw, "VendorName") ?? "",
            ContactNo: getField(itemRaw, "ContactNo") ?? "",
            PurchasePrice: getField(itemRaw, "PurchasePrices") ?? "",
            SearchName: getField(itemRaw, "SearchName", "SerachName") ?? "",

            MRP: getField(itemRaw, "mrp") ?? null,
            UOM: getField(itemRaw, "UOM") ?? "",

            Length: getField(itemRaw, "length") ?? null,
            Width: getField(itemRaw, "width") ?? null,
            GSM: getField(itemRaw, "GSM") ?? null,
            HSN: getField(itemRaw, "HSN") ?? null,
            compositionCode: getField(itemRaw, "compositionCode") ?? null,
            RepeatVertical: getField(itemRaw, "RepeatVertical", "Repeatvertical") ?? null,
            RepeatHorizontal: getField(itemRaw, "RepeatHorizontal", "Repeathorizontal") ?? null,

            DeliveryDate: getField(itemRaw, "DeliveryDate") ?? "",
            DeliveryStatus: getField(itemRaw, "DeliveryStatus") ?? "",

            LeadPeriod: getField(itemRaw, "LeadPeriod") ?? null,
            ReorderQty: getField(itemRaw, "ReorderQty") ?? 0,

            Currency: getField(itemRaw, "Currency") ?? ""
        };

        return {
            message: Object.keys(itemRaw).length ? "Item details retrieved" : "No item found",
            status: !!Object.keys(itemRaw).length,
            data: item
        };

    } catch (error) {
        console.error("getItemDetails ERROR:", error.response?.data || error.message);
        throw error;
    }
};

exports.getItems = async (params) => {
  try {
    const bcResponse = await bc_getItems(params);


    return {
      message: bcResponse?.message || "query",
      data: bcResponse?.data || [],
      total: bcResponse?.total || 0,
      status: bcResponse?.status ?? true
    };

  } catch (error) {
    console.error("getItemService Error:", error.message);
    throw error;
  }
};

// sales order service 

exports.getSalesOrderDetails = async (code) => {
  try {
    const bcResponse = await bc_getSalesOrderDetails(code);



    let so = bcResponse?.data || {};

    // 🔥 Transform Transport to match old API
    if (so.Transport) {
      so.Transport = {
        Name: so.Transport,
        Code: so.Transport
      };
    }

    return {
      message: bcResponse?.message || "query",
      data: so,
      status: bcResponse?.status ?? true
    };

  } catch (error) {
    console.error("getSalesOrderDetails Error:", error.message);
    throw error;
  }
};

// customer ledger service

exports.getCustomerLedger = async (params) => {
  try {
    const bcResponse = await bc_getCustomerLedger(params);



    return {
      totalData: bcResponse?.totalData || 0,
      message: bcResponse?.message || "query",
      data: bcResponse?.data || [],
      status: bcResponse?.status ?? true
    };

  } catch (error) {
    console.error("getCustomerLedger Error:", error.message);
    throw error;
  }
};


// get category service

exports.getCategory = async () => {
  try {
    const bcResponse = await bc_getCategory();



    //  Ensure always array
    let categories = Array.isArray(bcResponse?.data)
      ? bcResponse.data
      : [];

    //  Optional: sort like old SQL (sort_order)
    categories = categories.sort((a, b) => {
      const s1 = a.SortOrder || "";
      const s2 = b.SortOrder || "";
      return s1.localeCompare(s2);
    });

    return {
      message: bcResponse?.message || "query",
      data: categories,
      status: bcResponse?.status ?? true
    };

  } catch (error) {
    console.error("getCategory Error:", error.message);
    throw error;
  }
};

// get brands service api 

exports.getBrands = async (params) => {
  try {
    const bcResponse = await bc_getBrands(params);

    let brands = Array.isArray(bcResponse?.data)
      ? bcResponse.data
      : [];

    //  Remove duplicates (important - SQL had DISTINCT)
    const uniqueMap = new Map();

    brands.forEach((item) => {
      if (!uniqueMap.has(item.code)) {
        uniqueMap.set(item.code, item);
      }
    });

    const uniqueBrands = Array.from(uniqueMap.values());

    //  Transform to match old API
    const formatted = uniqueBrands.map((item) => ({
      Code: item.code,
      Name:
        item.name?.charAt(0).toUpperCase() +
        item.name?.slice(1).toLowerCase()
    }));

    return {
      message: "query",
      data: formatted,
      status: true
    };

  } catch (error) {
    console.error("getBrands Error:", error.message);
    throw error;
  }
};

// get items in product list screen admin portal 

exports.getItemsWithDetails = async (params) => {
  try {
    const listRes = await bc_getItems(params);
    const items = listRes?.data || [];

    if (!Array.isArray(items) || items.length === 0) {
      return {
        message: "query",
        status: true,
        data: []
      };
    }

    // Parallel fetch: fire all detail calls at once instead of one-by-one
    const detailPromises = items.map(async (item) => {
      let mapped = mapBCItem(item);

      const itemId = item?.ITEMID || item?.itemNo || item?.itemID || "";
      const collCode = item?.CollectionCode || item?.collectionCode || "";

      if (itemId && collCode) {
        try {
          const details = await bc_getItemDetailsMapped(itemId, collCode);
          mapped = { ...mapped, ...details };
        } catch (err) {
          console.warn("Detail failed:", itemId);
        }
      }

      return mapped;
    });

    const results = await Promise.allSettled(detailPromises);
    const finalData = results
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);

    return {
      message: "query",
      status: true,
      data: finalData
    };

  } catch (error) {
    console.error("Service Error:", error.message);
    throw error;
  }
};

exports.getItemsNM = async (params) => {
  try {
    const listRes = await bc_getItemsNM(params);
  
    if (!Array.isArray(listRes) || listRes.length === 0) {
      return {
        message: "query",
        status: true,
        data: []
      };
    }

    return {
      message: "query",
      status: true,
      data: listRes
    };

  } catch (error) {
    console.error("Service Error:", error.message);
    throw error;
  }
};