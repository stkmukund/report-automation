import axios from "axios";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  let page = 1;
  let count = 1;
  let totalAmount = 0;
  const body = await readBody(event);

  // Convert the array to a comma-separated string
  const campaignIdString = body.join(",");

  const config = useRuntimeConfig(event);

  // PARTIAL
  const fetchComplete = async () => {
    const { data } = await axios.post(
      `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${campaignIdString}&orderStatus=PARTIAL&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1`
    );
    totalAmount += Number(data.message.totalResults);
    return "";
  };

  const dataComplete = await fetchComplete();
  if (!totalAmount) totalAmount = 0;

  return totalAmount;
});
