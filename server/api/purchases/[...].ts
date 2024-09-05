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

// initial-vip (New VIPs)
router.get(
  "/initial-vip",
  defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate or endDate";

    if (!query.startDate && !query.endDate)
      return "provide startDate and endDate";

    if (!query.campaignId) return "what about campaignId?";

    // fetch new VIPs
    let creditCard = 0;
    let payPal = 0;
    let pageNo = 1;
    const fetch = async () => {
      const { data } = await axios.get(
        `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.campaignId}&status=ACTIVE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200&page=${pageNo}`
      );
      if (data.message.data) {
        const orders = data.message.data;
        const count = Number(data.message.totalResults) / 200;
        orders.map((item) => {
          if(item.transactions[0].paySource === "CREDITCARD"){
            creditCard++;
          } else if(item.transactions[0].paySource === "PAYPAL"){
            payPal++;
          }
        });
        if(count > pageNo){
          pageNo++;
          await fetch();
        }
        return { totalResults: data.message.totalResults, creditCard, payPal };
      } else {
        return { totalResults: 0, creditCard, payPal, message: data.message };
      }
    };
    const response = await fetch();
    return response;
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
      return "provide startDate or endDate";

    if (!query.startDate && !query.endDate)
      return "provide startDate and endDate";

    if (!query.campaignId) return "what about campaignId?";

    // fetch new VIPs
    const { data } = await axios.get(
      `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&dateRangeType=dateUpdated&campaignId=${query.campaignId}&status=CANCELLED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1`
    );
    if (data.message.totalResults) {
      return { totalResults: data.message.totalResults };
    } else {
      return { totalResults: 0, message: data.message };
    }
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

export default useBase("/api/purchases", router.handler);
