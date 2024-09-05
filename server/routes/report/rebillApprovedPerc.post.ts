import axios from "axios";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  const body = await readBody(event);

  const config = useRuntimeConfig(event);
  let totalAmount = 0;

  // rebillApprovedPerc
  const fetchComplete = async () => {
    const { data } = await axios.post(
      `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=product&productId=RECURRING&campaignCategory=${body}`
    );
    totalAmount += Number(data.message[0].rebillApprovedPerc);
    return "data";
  };

  const dataComplete = await fetchComplete();
  if (!totalAmount) totalAmount = 0;

  return totalAmount;
});
