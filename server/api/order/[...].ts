import axios from "axios";

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
// Sales Total - Not using (shifted to client side)
router.get(
  "/sales-total",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate or endDate";

    if (!query.startDate && !query.endDate)
      return "provide startDate and endDate";

    if (!query.campaignId) return "what about campaignId?";

    let page = 1;
    let count = 1;
    let totalAmount: number = 0;
    let refundedAmount: number = 0;
    let completeCount = 0;
    let refundCount = 0;
    let cancelCount = 0;
    let creditCard = 0;
    let payPal = 0;

    // Complete
    const fetchComplete = async () => {
      // const campaignIdString = campaignId.join(",");
      const { data } = await axios.post(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.campaignId}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
      );
      const orders: object[] = data.message.data;
      if (!data.message.data) {
        return 0;
      } else {
        orders.map((item) => {
          totalAmount += Number(item.totalAmount);
          if(item.paySource === "CREDITCARD") {
            creditCard++;
          } else if(item.paySource === "PAYPAL"){
            payPal++;
          }
        });
      }
      completeCount = Number(data.message.totalResults);
      if (data.message.totalResults > 200) {
        count = Math.ceil(data.message.totalResults / 200);
      }
      if (count > page) {
        page++;
        await fetchComplete();
      }

      page = 1;

      return totalAmount;
    };

    // Refunded
    const fetchRefunded = async () => {
      // const campaignIdString = campaignId.join(",");
      const { data } = await axios.post(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.campaignId}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
      );
      const orders: object[] = data.message.data;
      if (!data.message.data) {
        return 0;
      } else {
        orders.map((item) => {
          totalAmount += Number(item.totalAmount);
          refundedAmount += Number(item.totalAmount);
          if(item.paySource === "CREDITCARD") {
            creditCard++;
          } else if(item.paySource === "PAYPAL"){
            payPal++;
          }
        });
      }
      refundCount = Number(data.message.totalResults);
      if (data.message.totalResults > 200) {
        count = Math.ceil(data.message.totalResults / 200);
      }
      if (count > page) {
        page++;
        await fetchRefunded();
      }

      page = 1;

      return totalAmount;
    };

    // Cancelled
    const fetchCancelled = async () => {
      // const campaignIdString = campaignId.join(",");
      const { data } = await axios.post(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.campaignId}&orderStatus=CANCELLED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
      );
      const orders: object[] = data.message.data;
      if (!data.message.data) {
        return 0;
      } else {
        orders.map((item) => {
          totalAmount += Number(item.totalAmount);
          if(item.paySource === "CREDITCARD") {
            creditCard++;
          } else if(item.paySource === "PAYPAL"){
            payPal++;
          }
        });
      }
      cancelCount = Number(data.message.totalResults);
      if (data.message.totalResults > 200) {
        count = Math.ceil(data.message.totalResults / 200);
      }
      if (count > page) {
        page++;
        await fetchCancelled();
      }

      page = 1;

      return totalAmount;
    };

    // DECLINED
    const fetchDeclined = async () => {
      // const campaignIdString = campaignId.join(",");
      const { data } = await axios.post(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.campaignId}&orderStatus=DECLINED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&page=${page}`
      );
      const orders: object[] = data.message.data;
      if (!data.message.data) {
        return 0;
      }
      let declineCount = Number(data.message.totalResults);
      return declineCount;
    };

    await fetchComplete();
    await fetchRefunded();
    await fetchCancelled();
    const declined = await fetchDeclined();

    if (!totalAmount) totalAmount = 0;
    let initialSales = completeCount + refundCount + cancelCount;

    return { totalAmount, refundedAmount, initialSales, declined, creditCard, payPal };
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
      let result = res.message.totalResults;
      if (!result) result = 0;
      finalValues.push(result);
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
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=currency&productId=RECURRING&campaignCategory=${campaignCategoryId}`
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
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=currency&productId=RECURRING&campaignCategory=${campaignCategoryId}`
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
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=currency&productId=RECURRING&campaignCategory=${campaignCategoryId}`
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
        `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=currency&productId=RECURRING&campaignCategory=${campaignCategoryId}`
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
    const fetchSales = async (campaignCategoryId: number) => {
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
      if (!finalRefund) finalRefund = 0;
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
    const fetchSales = async (campaignCategoryId: number) => {
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
      if (!finalRefund) finalRefund = 0;
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
      let res2 = await fetchSales2(
        categoryCampaignId[index],
        campaignProductId
      );
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
      // Old One
      // let response = await fetch(
      //   `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=DECLINED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&campaignProductId=${queryStringCampaignProductId}`
      // );

      // New One
      let response = await fetch(
        `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&dateRangeType=dateUpdated&campaignId=${queryStringCampaign}&status=CANCELLED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1`
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
      let res2 = await fetchSales2(
        categoryCampaignId[index],
        campaignProductId
      );
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
      let res2 = await fetchSales2(
        categoryCampaignId[index],
        campaignProductId
      );
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
      let res2 = await fetchSales2(
        categoryCampaignId[index],
        campaignProductId
      );
      finalValues.push(res + res2);
    }

    return finalValues;
  })
);

export default useBase("/api/order/", router.handler);
