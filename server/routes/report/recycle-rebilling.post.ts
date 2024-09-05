import axios from "axios";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  let totalAmount = 0;
  const campaignId = await readBody(event);

  // Convert the array to a comma-separated string
  const campaignIdString = campaignId.join(",");

  const config = useRuntimeConfig(event);

  // Complete
  const totalActiveVip = async () => {
    const { data } = await axios.post(
      `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${campaignIdString}&status=RECYCLE_BILLING&startDate=01/01/2010&endDate=${query.endDate}&resultsPerPage=1`
    );
    totalAmount += Number(data.message.totalResults);
    
    return "data";
  };

  await totalActiveVip();

  if (!totalAmount) totalAmount = 0;

  return totalAmount;
});
