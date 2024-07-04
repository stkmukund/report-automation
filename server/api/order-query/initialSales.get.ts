import axios from "axios";

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

const fetchSales = async (campaignProductId,campaignId) => {
  const queryStringProduct = campaignProductId.join(',');
  const queryStringCampaign = campaignId.join(',');
  // let response = await fetch(`https://api.checkoutchamp.com/order/query/?loginId=revboostapirs.nymbus&password=RSsfFrR2nN5PcC6L1pSRs&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=06/01/2024&endDate=07/01/2024&resultsPerPage=200&campaignProductId=${queryStringProduct}&orderType=NEW_SALE`);
  let response = await fetch(`https://api.checkoutchamp.com/order/query/?loginId=revboostapirs.nymbus&password=RSsfFrR2nN5PcC6L1pSRs&campaignId=39&startDate=06/01/2024&endDate=07/01/2024&resultsPerPage=200`);
  const data = await response.json();

  return data;
};

export default defineEventHandler(async (event) => {
  let finalValues = [];
  let finalKeys = Object.keys(campaignCategory);
  // const query = getQuery(event);
  // Now you can access your query parameters using the query object
  //   if (!query.startDate || !query.endDate)
  //     return "provide startDate and endDate";
  //   campaignCategory
  let values = Object.values(campaignCategory);
  let categoryProductId = values.map(value => value.campaignProductId)
  let categoryCampaignId = values.map(value => value.campaignId);
  // console.log(...categoryProductId[1]);
  for (let index = 0; index < categoryProductId.length; index++) {
    let res = await fetchSales(categoryProductId[index],categoryCampaignId[index]);
    finalValues.push(res.message.totalResults);
  }

  const finalResult = {};
  finalKeys.forEach((key, index) => {
    if(finalValues[index] === undefined) finalValues[index] = 0;
    finalResult[key] = finalValues[index];
  });
  

    

  return finalResult;
});
