import axios from "axios";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  const body = await readBody(event);

  const config = useRuntimeConfig(event);
  let rebillRevenue = 0;
  let rebillApprovedPerc = 0;
  let rebillRefundRev = 0;
  let chargebackCnt = 0;

  // rebill-revenue
  const fetchComplete = async () => {
    const { data } = await axios.post(
      `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=currency&productId=RECURRING&campaignCategory=${body}`
    );
    if (data.result === "SUCCESS") {
      rebillRevenue += Number(data.message[0].rebillRev);
      rebillApprovedPerc += Number(data.message[0].rebillApprovedPerc);
      rebillRefundRev += Number(data.message[0].refundRev);
      chargebackCnt += Number(data.message[0].chargebackCnt);
      return {
        rebillRevenue,
        rebillApprovedPerc,
        rebillRefundRev,
        chargebackCnt,
      };
    } else {
      return {
        rebillRevenue,
        rebillApprovedPerc,
        rebillRefundRev,
        chargebackCnt,
      };
    }
  };

  const dataComplete = await fetchComplete();

  return dataComplete;
});
