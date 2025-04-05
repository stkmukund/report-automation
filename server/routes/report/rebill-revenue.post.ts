import axios from "axios";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  const body = await readBody(event);

  const config = useRuntimeConfig(event);
  let rebillRevenue = 0;
  let rebillApprovedPerc = 0;
  let rebillDeclinePerc = 0;
  let rebillRefundRev = 0;
  let chargebackCnt = 0;
  let rebillApproveCount = 0;
  let rebillDeclineCount = 0;

  // rebill-revenue
  const fetchComplete = async () => {
    const { data } = await axios.post(
      `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&reportType=currency&productId=RECURRING&campaignCategory=${body}`
    );
    if (data.result === "SUCCESS") {
      rebillRevenue += Number(data.message[0].rebillRev);
      rebillApproveCount += Number(data.message[0].rebillCnt);
      rebillDeclineCount += Number(data.message[0].rebillDeclinesCnt);
      rebillApprovedPerc += Number(data.message[0].rebillApprovedPerc);
      rebillDeclinePerc += rebillDeclineCount / (rebillApproveCount + rebillDeclineCount);
      if (isNaN(rebillDeclinePerc)) rebillDeclinePerc = 0;
      rebillRefundRev += Number(data.message[0].refundRev);
      chargebackCnt += Number(data.message[0].chargebackCnt);
      return {
        rebillApproveCount,
        rebillDeclineCount,
        rebillRevenue,
        rebillApprovedPerc,
        rebillDeclinePerc,
        rebillRefundRev,
        chargebackCnt,
      };
    } else {
      return {
        rebillApproveCount,
        rebillDeclineCount,
        rebillRevenue,
        rebillApprovedPerc,
        rebillDeclinePerc,
        rebillRefundRev,
        chargebackCnt,
      };
    }
  };

  const dataComplete = await fetchComplete();

  return dataComplete;
});
