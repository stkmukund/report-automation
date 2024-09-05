import axios from "axios";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  let totalAmount = 0;
  const body = await readBody(event);

  // Convert the array to a comma-separated string
  const queryStringCampaign = body.join(",");

  const config = useRuntimeConfig(event);

  // Cancelled
  const fetchComplete = async () => {
    const { data } = await axios.post(
      `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&dateRangeType=dateUpdated&campaignId=${queryStringCampaign}&status=CANCELLED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1`
    );
    totalAmount += Number(data.message.totalResults);
    return data;
  };

  const dataComplete = await fetchComplete();

  if (!totalAmount) totalAmount = 0;

  return totalAmount;
});
