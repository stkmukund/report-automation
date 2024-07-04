import axios from "axios";

const campaignCategory = {
  secretLane: {
    campaignId: [39,42,41],
    campaignProductId: [741, 1256],
  },
  lashCosmetics: {
    campaignId: [1, 68,61,47,9,6,67,69,70],
    campaignProductId: [7, 463],
  },
  browCharm: {
    campaignId: [8, 45, 48,88,24,20,10,28,34,35,82,83],
    campaignProductId: [462, 1255],
  },
  floralSecrets: {
    campaignId: [12, 46,38,46,85,12,55,21,15,71],
    campaignProductId: [180, 1201],
  },
  invisiLift: {
    campaignId: [16,53,31,19],
    campaignProductId: [746, 1199],
  },
  indestructibleTights: {
    campaignId: [56,58,59],
    campaignProductId: [257, 1202],
  },
  mangoLift: {
    campaignId: [72,73,75],
    campaignProductId: [1313],
  },
  fitCharm: {
    campaignId: [76,81,79],
    campaignProductId: [1435],
  },
  browPro: {
    campaignId: [97,99,101],
    campaignProductId: [3029],
  },
};

const fetchSales = async (campaignProductId, campaignId) => {
  const queryStringProduct = campaignProductId.join(",");
  const queryStringCampaign = campaignId.join(",");
  let response = await fetch(
    `https://api.checkoutchamp.com/order/query/?loginId=revboostapirs.nymbus&password=RSsfFrR2nN5PcC6L1pSRs&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=06/01/2024&endDate=07/01/2024&resultsPerPage=200&campaignProductId=${queryStringProduct}&orderType=NEW_SALE`
  );
  const data = await response.json();

  return data;
};

export default defineEventHandler(async (event) => {
  let finalValues = [];
  let finalKeys = Object.keys(campaignCategory);
  let values = Object.values(campaignCategory);
  let categoryProductId = values.map((value) => value.campaignProductId);
  let categoryCampaignId = values.map((value) => value.campaignId);
  for (let index = 0; index < categoryProductId.length; index++) {
    let res = await fetchSales(
      categoryProductId[index],
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
});
