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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  // Now you can access your query parameters using the query object
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  // fetch sales total
  let pageNo = 1;
  const fetchSales = async () => {
    let totalAmount = 0;
    // const queryStringCampaign = campaignId.join(",");
    let response = await fetch(
      `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=1,68,61,47,9,6,67,69,70&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200`
    );
    const data = await response.json();
    let iteration = Math.ceil(data.message.totalResults / 200);
    console.log(iteration);
    for (let index = 1; index <= iteration; index++) {
      let responseNew = await fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=1,68,61,47,9,6,67,69,70&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200&page=${index}`
      );
      const dataNew = await responseNew.json();
      const allData = dataNew.message.data;
      allData.forEach((item) => {
        // if(item.totalAmount != )
        // console.log(typeof(item.totalAmount));
        if (typeof(item.totalAmount) !== "string") {
            item.totalAmount = 0;
        }
        
        totalAmount += parseInt(item.totalAmount);
      });
    }

    return totalAmount;
  };

  //   let finalValues = [];
  let finalValues = await fetchSales();
  //   let values = Object.values(campaignCategory);
  //   let categoryCampaignId = values.map((value) => value.campaignId);
  //   for (let index = 0; index < categoryCampaignId.length; index++) {
  //     let res = await fetchSales(categoryCampaignId[index]);
  //     finalValues = res;
  //     // console.log(res.length);

  //     // finalValues.push(res.message.totalResults);
  //   }

  return finalValues;
});
