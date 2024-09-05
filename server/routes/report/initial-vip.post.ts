import axios from "axios";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  let totalAmount = 0;
  const campaignId = await readBody(event);

  // Convert the array to a comma-separated string
  const campaignIdString = campaignId.join(",");
  // const queryStringCampaignProductId = campaignProductId.join(",");

  const config = useRuntimeConfig(event);

  // fetch new VIPs
  let creditCard = 0;
  let payPal = 0;
  let pageNo = 1;
  const fetch = async () => {
    const { data } = await axios.get(
      `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${campaignIdString}&status=ACTIVE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200&page=${pageNo}`
    );
    if (data.message.data) {
      const orders = data.message.data;
      const count = Number(data.message.totalResults) / 200;
      orders.map((item) => {
        if (item.transactions[0].paySource === "CREDITCARD") {
          creditCard++;
        } else if (item.transactions[0].paySource === "PAYPAL") {
          payPal++;
        }
      });
      if (count > pageNo) {
        pageNo++;
        await fetch();
      }
      return { totalResults: data.message.totalResults, creditCard, payPal };
    } else {
      return { totalResults: 0, creditCard, payPal, message: data.message };
    }
  };
  const response = await fetch();
  console.log("response",response);
  
  return response;
});
