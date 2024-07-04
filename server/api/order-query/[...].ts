const router = createRouter();

const campaignCategory = {
  secretLane: {
    campaignId: [39],
    campaignProductId: [741, 1256],
  },
  lashCosmetics: {
    campaignId: [1, 68],
    campaignProductId: [7, 463],
  },
  browCharm: {
    campaignId: [8, 45, 48],
    campaignProductId: [462, 1255],
  },
  floralSecrets: {
    campaignId: [12, 46],
    campaignProductId: [180, 1201],
  },
  invisiLift: {
    campaignId: [56],
    campaignProductId: [746, 1199],
  },
  indestructibleTights: {
    campaignId: [16, 53],
    campaignProductId: [257, 1202],
  },
  mangoLift: {
    campaignId: [72],
    campaignProductId: [1313],
  },
  fitCharm: {
    campaignId: [76],
    campaignProductId: [1435],
  },
  browPro: {
    campaignId: [97],
    campaignProductId: [3029],
  },
};

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
      let res = await fetchSales(
        categoryCampaignId[index]
      );
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

export default useBase("/api/order-query", router.handler);
