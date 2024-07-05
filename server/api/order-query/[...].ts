const router = createRouter();

const campaignCategory = {
  10: {
    campaignId: [39, 42, 41],
    campaignProductId: [741, 1256],
    name: "Secret Lane™",
  },
  12: {
    campaignId: [1, 68, 61, 47, 9, 6, 67, 69, 70],
    campaignProductId: [7, 463],
    name: "Lash Cosmetics™",
  },
  13: {
    campaignId: [8, 45, 48, 88, 24, 20, 10, 28, 34, 35, 82, 83],
    campaignProductId: [462, 1255],
    name: "Brow Charm™",
  },
  15: {
    campaignId: [12, 46, 38, 46, 85, 12, 55, 21, 15, 71],
    campaignProductId: [180, 1201],
    name: "Floral Secrets™",
  },
  16: {
    campaignId: [16, 53, 31, 19],
    campaignProductId: [746, 1199],
    name: "InvisiLift™",
  },
  21: {
    campaignId: [56, 58, 59],
    campaignProductId: [257, 1202],
    name: "Indestructible Tights™",
  },
  23: {
    campaignId: [72, 73, 75],
    campaignProductId: [1313],
    name: "MangoLift™",
  },
  25: {
    campaignId: [76, 81, 79],
    campaignProductId: [1435],
    name: "FitCharm™",
  },
  28: {
    campaignId: [97, 99, 101],
    campaignProductId: [3029],
    name: "BrowPro™",
  },
};
// Sales Total
router.get(
  "/sales-total",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignId: any) => {
      const queryStringCampaign = campaignId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let finalKeys = Object.keys(campaignCategory);
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      finalValues.push(res.message.totalResults);
    }

    return finalValues;
  })
);
// Initial Sale
router.get(
  "/initial-sale",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignId: any) => {
      const queryStringCampaign = campaignId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let finalKeys = Object.keys(campaignCategory);
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      finalValues.push(res.message.totalResults);
    }

    const finalResult = {};
    finalKeys.forEach((key, index) => {
      if (finalValues[index] === undefined) finalValues[index] = 0;
      finalResult[key] = finalValues[index];
    });

    return finalResult;
  })
);
// Declined
router.get(
  "/declined",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignId: any) => {
      const queryStringCampaign = campaignId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=DECLINED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let finalKeys = Object.keys(campaignCategory);
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      finalValues.push(res.message.totalResults);
    }

    const finalResult = {};
    finalKeys.forEach((key, index) => {
      if (finalValues[index] === undefined) finalValues[index] = 0;
      finalResult[key] = finalValues[index];
    });

    return finalResult;
  })
);
// Partials
router.get(
  "/partial",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignId: any) => {
      const queryStringCampaign = campaignId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=PARTIAL&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let finalKeys = Object.keys(campaignCategory);
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      finalValues.push(res.message.totalResults);
    }

    const finalResult = {};
    finalKeys.forEach((key, index) => {
      if (finalValues[index] === undefined) finalValues[index] = 0;
      finalResult[key] = finalValues[index];
    });

    return finalResult;
  })
);
// Rebill Revenue

export default useBase("/api/order-query", router.handler);
