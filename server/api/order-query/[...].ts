const router = createRouter();

const campaignCategory = {
  10: {
    campaignId: [39, 42, 41],
    campaignProductId: [471, 1256, 518, 478],
    name: "Secret Lane™",
  },
  12: {
    campaignId: [1, 68, 61, 47, 9, 6, 67, 69, 70],
    campaignProductId: [
      1011, 1030, 591, 610, 7, 463, 1177, 1196, 30, 1152, 1171, 1174, 1222,
    ],
    name: "Lash Cosmetics™",
  },
  13: {
    campaignId: [8, 45, 48, 88, 24, 20, 10, 28, 34, 35, 82, 83],
    campaignProductId: [
      2827, 2845, 2848, 612, 354, 101, 462, 1255, 160, 363, 432, 441, 569,
    ],
    name: "Brow Charm™",
  },
  15: {
    campaignId: [12, 46, 38, 85, 55, 21, 15, 71],
    campaignProductId: [572, 1655, 1673, 180, 1201, 716, 213, 1260, 1278],
    name: "Floral Secrets™",
  },
  16: {
    campaignId: [16, 53, 31, 19],
    campaignProductId: [257, 1202, 709, 286],
    name: "InvisiLift™",
  },
  21: {
    campaignId: [56, 58, 59],
    campaignProductId: [746, 1199, 930, 940],
    name: "Indestructible Tights™",
  },
  23: {
    campaignId: [72, 73, 75],
    campaignProductId: [1313, 1420, 1352],
    name: "MangoLift™",
  },
  25: {
    campaignId: [76, 81, 79],
    campaignProductId: [1435, 1522],
    name: "FitCharm™",
  },
  28: {
    campaignId: [97, 99, 101],
    campaignProductId: [3029, 3105, 3074],
    name: "BrowPro™",
  },
};
// Sales Total - Not using
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
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200`
      );
      const data = await response.json();

      return data.message.data;
    };

    let finalValues = [];
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      console.log(res.length);
      // finalValues.push(res.message.totalResults);
    }

    return "finalValues";
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
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };

    // for refunded one
    const fetchSales2 = async (campaignId: any) => {
      const queryStringCampaign = campaignId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };

    let finalValues = [];
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      let res2 = await fetchSales2(categoryCampaignId[index]);
      finalValues.push(res + res2);
    }

    return finalValues;
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
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      finalValues.push(res.message.totalResults);
    }

    return finalValues;
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
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      finalValues.push(res.message.totalResults);
    }

    return finalValues;
  })
);
// Rebill Revenue
router.get(
  "/rebill-revenue",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignCategoryId) => {
      let response = await fetch(
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=product&productId=RECURRING&campaignCategory=${campaignCategoryId}`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let keys = Object.keys(campaignCategory);
    for (let index = 0; index < keys.length; index++) {
      let res = await fetchSales(keys[index]);
      finalValues.push(res.message[0].rebillRev);
    }

    return finalValues;
  })
);
// rebillApprovedPerc
router.get(
  "/rebillApprovedPerc",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignCategoryId) => {
      let response = await fetch(
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=product&productId=RECURRING&campaignCategory=${campaignCategoryId}`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let keys = Object.keys(campaignCategory);
    for (let index = 0; index < keys.length; index++) {
      let res = await fetchSales(keys[index]);
      finalValues.push(res.message[0].rebillApprovedPerc);
    }

    return finalValues;
  })
);
// Rebill refundRev
router.get(
  "/rebill-refundRev",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignCategoryId) => {
      let response = await fetch(
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=product&productId=RECURRING&campaignCategory=${campaignCategoryId}`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let keys = Object.keys(campaignCategory);
    for (let index = 0; index < keys.length; index++) {
      let res = await fetchSales(keys[index]);
      finalValues.push(res.message[0].refundRev);
    }

    return finalValues;
  })
);
// Rebill refundPerc
router.get(
  "/rebill-refundPerc",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignCategoryId) => {
      let response = await fetch(
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=product&productId=RECURRING&campaignCategory=${campaignCategoryId}`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let keys = Object.keys(campaignCategory);
    for (let index = 0; index < keys.length; index++) {
      let res = await fetchSales(keys[index]);
      finalValues.push(res.message[0].refundPerc);
    }

    return finalValues;
  })
);
// frontend-refundRev
router.get(
  "/frontend-refundRev",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignCategoryId) => {
      let response = await fetch(
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=campaign&productId=ONE_TIME&campaignCategory=${campaignCategoryId}`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let keys = Object.keys(campaignCategory);
    for (let index = 0; index < keys.length; index++) {
      let res = await fetchSales(keys[index]);
      let data = res.message;
      let finalRefund = 0;
      for (let i = 0; i < data.length; i++) {
        finalRefund += Number(data[i].refundRev);
      }
      finalValues.push(finalRefund.toFixed(2));
    }

    return finalValues;
  })
);
// frontend-refundPerc
router.get(
  "/frontend-refundPerc",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignCategoryId) => {
      let response = await fetch(
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=campaign&productId=ONE_TIME&campaignCategory=${campaignCategoryId}`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let keys = Object.keys(campaignCategory);
    for (let index = 0; index < keys.length; index++) {
      let res = await fetchSales(keys[index]);
      let data = res.message;
      let finalRefund = 0;
      for (let i = 0; i < data.length; i++) {
        finalRefund += Number(data[i].refundPerc);
      }
      finalValues.push(finalRefund.toFixed(2));
    }

    return finalValues;
  })
);
// chargebackCnt
router.get(
  "/chargebackCnt",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignCategoryId) => {
      let response = await fetch(
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=campaign&campaignCategory=${campaignCategoryId}`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let keys = Object.keys(campaignCategory);
    for (let index = 0; index < keys.length; index++) {
      let res = await fetchSales(keys[index]);
      let data = res.message;
      let finalRefund = 0;
      for (let i = 0; i < data.length; i++) {
        finalRefund += Number(data[i].chargebackCnt);
      }
      finalValues.push(finalRefund.toFixed(2));
    }

    return finalValues;
  })
);
// initial-vip (New VIPs)
router.get(
  "/initial-vip",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignId: any, campaignProductId: any) => {
      const queryStringCampaign = campaignId.join(",");
      const queryStringCampaignProductId = campaignProductId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&campaignProductId=${queryStringCampaignProductId}`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };
    const fetchSales2 = async (campaignId: any, campaignProductId: any) => {
      const queryStringCampaign = campaignId.join(",");
      const queryStringCampaignProductId = campaignProductId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&campaignProductId=${queryStringCampaignProductId}`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };

    let finalValues = [];
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    let campaignProductId = values.map((value) => value.campaignProductId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index], campaignProductId);
      let res2 = await fetchSales2(categoryCampaignId[index], campaignProductId);
      finalValues.push(res + res2);
    }

    return finalValues;
  })
);
// declined-vip (VIP Cancellations)
router.get(
  "/declined-vip",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignId: any, campaignProductId: any) => {
      const queryStringCampaign = campaignId.join(",");
      const queryStringCampaignProductId = campaignProductId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=DECLINED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&campaignProductId=${queryStringCampaignProductId}`
      );
      const data = await response.json();

      return data;
    };

    let finalValues = [];
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    let campaignProductId = values.map((value) => value.campaignProductId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index], campaignProductId);
      finalValues.push(res.message.totalResults);
    }

    return finalValues;
  })
);
// CCinitial-vip (CC New VIPs)
router.get(
  "/CCinitial-vip",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignId: any, campaignProductId: any) => {
      const queryStringCampaign = campaignId.join(",");
      const queryStringCampaignProductId = campaignProductId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&campaignProductId=${queryStringCampaignProductId}&paySource=CREDITCARD`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };
    const fetchSales2 = async (campaignId: any, campaignProductId: any) => {
      const queryStringCampaign = campaignId.join(",");
      const queryStringCampaignProductId = campaignProductId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&campaignProductId=${queryStringCampaignProductId}&paySource=CREDITCARD`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };

    let finalValues = [];
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    let campaignProductId = values.map((value) => value.campaignProductId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index], campaignProductId);
      let res2 = await fetchSales2(categoryCampaignId[index], campaignProductId);
      finalValues.push(res + res2);
    }

    return finalValues;
  })
);
// CCinitial-sale
router.get(
  "/CCinitial-sale",
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
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&paySource=CREDITCARD`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };
    const fetchSales2 = async (campaignId: any) => {
      const queryStringCampaign = campaignId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&paySource=CREDITCARD`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };

    let finalValues = [];
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      let res2 = await fetchSales2(categoryCampaignId[index]);
      finalValues.push(res + res2);
    }

    return finalValues;
  })
);
// PPinitial-sale
router.get(
  "/PPinitial-sale",
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
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&paySource=PAYPAL`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };
    const fetchSales2 = async (campaignId: any) => {
      const queryStringCampaign = campaignId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&paySource=PAYPAL`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };

    let finalValues = [];
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index]);
      let res2 = await fetchSales2(categoryCampaignId[index]);
      finalValues.push(res + res2);
    }

    return finalValues;
  })
);
// PPinitial-vip (PP New VIPs)
router.get(
  "/PPinitial-vip",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignId: any, campaignProductId: any) => {
      const queryStringCampaign = campaignId.join(",");
      const queryStringCampaignProductId = campaignProductId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&campaignProductId=${queryStringCampaignProductId}&paySource=PAYPAL`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };
    const fetchSales2 = async (campaignId: any, campaignProductId: any) => {
      const queryStringCampaign = campaignId.join(",");
      const queryStringCampaignProductId = campaignProductId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&campaignProductId=${queryStringCampaignProductId}&paySource=PAYPAL`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };

    let finalValues = [];
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    let campaignProductId = values.map((value) => value.campaignProductId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index], campaignProductId);
      let res2 = await fetchSales2(categoryCampaignId[index], campaignProductId);
      finalValues.push(res + res2);
    }

    return finalValues;
  })
);
// total-vip (Total VIPs)
router.get(
  "/total-vip",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";

    // fetch sales total
    const fetchSales = async (campaignId: any, campaignProductId: any) => {
      const queryStringCampaign = campaignId.join(",");
      const queryStringCampaignProductId = campaignProductId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&campaignProductId=${queryStringCampaignProductId}`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };
    const fetchSales2 = async (campaignId: any, campaignProductId: any) => {
      const queryStringCampaign = campaignId.join(",");
      const queryStringCampaignProductId = campaignProductId.join(",");
      let response = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&campaignProductId=${queryStringCampaignProductId}`
      );
      const data = await response.json();
      if (!data.message.totalResults) {
        return 0;
      }
      return data.message.totalResults;
    };

    let finalValues = [];
    let values = Object.values(campaignCategory);
    let categoryCampaignId = values.map((value) => value.campaignId);
    let campaignProductId = values.map((value) => value.campaignProductId);
    for (let index = 0; index < categoryCampaignId.length; index++) {
      let res = await fetchSales(categoryCampaignId[index], campaignProductId);
      let res2 = await fetchSales2(categoryCampaignId[index], campaignProductId);
      finalValues.push(res + res2);
    }

    return finalValues;
  })
);

export default useBase("/api/order-query", router.handler);
