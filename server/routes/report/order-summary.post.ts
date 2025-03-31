import { filterOrdersByStatus } from "../campaign";

export default defineEventHandler(async (event) => {
  // return "aya"
  // Variables
  let page = 1;
  let count = 1;
  let totalAmount: number = 0;
  let refundedAmount: number = 0;
  let creditCard = 0;
  let payPal = 0;
  let totalOrders: any = [];
  let initialSales = 0;

  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";
  // if (!query.id)
  // return { result: "ERROR", message: "Provide id for campaignCategory" };

  // query.id = getCampaignIdById(+query.id);
  query.id = "1, 6, 9, 47, 61, 67, 68, 69, 70";

  // Complete
  const fetchComplete = async () => {
    try {
      const response = await $fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
      ).then((data) => JSON.parse(data));

      if (response.result === "ERROR") {
        throw new Error(response.message);
      }

      if (response.result === "SUCCESS") {
        totalOrders.push(response.message.data);
      }

      if (response.message.totalResults > 200) {
        count = Math.ceil(response.message.totalResults / 200);
      }

      if (count > page) {
        page++;
        await fetchComplete();
      }

      page = 1;
      count = 1;

      return totalAmount;
    } catch (error) { }
  };

  // Refunded
  const fetchRefunded = async () => {
    try {
      const response = await $fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
      ).then((data) => JSON.parse(data));

      if (response.result === "ERROR") {
        throw new Error(response.message);
      }

      if (response.result === "SUCCESS") {
        totalOrders.push(response.message.data);
      }
      if (response.message.totalResults > 200) {
        count = Math.ceil(response.message.totalResults / 200);
      }

      if (count > page) {
        console.log("count", count, page);

        page++;
        await fetchRefunded();
      }

      page = 1;
      count = 1;

      return totalAmount;
    } catch (error) { }
  };

  // DECLINED
  const fetchDeclined = async () => {
    const data = await $fetch(
      `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&orderStatus=DECLINED&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&page=${page}`
    ).then((data) => JSON.parse(data));
    return data.message.totalResults;
  };

  // PARTIAL
  const fetchPartial = async () => {
    const data = await $fetch(
      `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&orderStatus=PARTIAL&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=1&orderType=NEW_SALE&page=${page}`
    ).then((data) => JSON.parse(data));
    return data.message.totalResults;
  };

  await fetchComplete();
  await fetchRefunded();
  const declined = await fetchDeclined();
  const partial = await fetchPartial();

  await totalOrders.map(async (orders) => {
    const {
      totalOrderAmount,
      refundedOrderAmount,
      creditCardOrders,
      payPalOrders,
      initialOrder,
    } = await filterOrdersByStatus(orders);
    totalAmount += totalOrderAmount;
    refundedAmount += refundedOrderAmount;
    initialSales += initialOrder;
    creditCard += creditCardOrders;
    payPal += payPalOrders;
  });

  let declinePerc = (declined / (initialSales + declined)).toFixed(4);
  if (declinePerc == "NaN") declinePerc = "0";

  let avgTicket = (+totalAmount / initialSales).toFixed(2);
  if (avgTicket == "NaN" || avgTicket == "Infinity") avgTicket = "0";

  let frontendRefundPerc = (refundedAmount / totalAmount).toFixed(4);
  if (frontendRefundPerc == "NaN") frontendRefundPerc = "0";

  return {
    totalAmount: +totalAmount.toFixed(2),
    initialSales,
    declined,
    declinePerc: +declinePerc,
    partial,
    avgTicket: +avgTicket,
    refundedAmount: +refundedAmount.toFixed(2),
    frontendRefundPerc: +frontendRefundPerc,
    creditCard,
    payPal,
  };
});
