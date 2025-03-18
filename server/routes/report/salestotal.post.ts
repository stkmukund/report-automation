import axios from 'axios';

const fetchData = async (
  status: string,
  config: any,
  campaignIdString: string,
  query: any,
  page: number
) => {
  try {
    const { data } = await axios.post(
      `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${campaignIdString}&orderStatus=${status}&startDate=${query.startDate}&endDate=${query.endDate}&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
    );

    return data.message;
  } catch (error) {
    console.error(`Error fetching ${status} data on page ${page}:`, error);
    return null;
  }
};

const processOrders = (orders: object[], totals: any, paySources: any, status: string) => {
  orders.forEach((item) => {
    const totalAmount = Number(item.totalAmount);
    totals.totalAmount += totalAmount;

    // Calculate refundedAmount (only if refundRemaining is available)
    if (item.refundRemaining) {
      const refundedAmount = totalAmount - Number(item.refundRemaining);
      totals.refundedAmount += refundedAmount;
    }

    if (item.paySource === 'CREDITCARD') {
      paySources.creditCard++;
    } else if (item.paySource === 'PAYPAL') {
      paySources.payPal++;
    }
  });

  // Return the number of orders processed for this status
  return orders.length;
};

const fetchAllPages = async (
  status: string,
  config: any,
  campaignIdString: string,
  query: any,
  totals: any,
  paySources: any
) => {
  let page = 1;
  let totalResults = 0;
  let ordersProcessed = 0;

  // Fetch the first page
  const data = await fetchData(status, config, campaignIdString, query, page);
  if (data) {
    totalResults = data.totalResults; // Initial totalResults from the first page
    const orders = data.data;
    if(!orders) return 0;

    if (orders.length > 0) {
      ordersProcessed += processOrders(orders, totals, paySources, status);
    }
  }

  // If totalResults exceeds 200, continue fetching the next pages
  while (totalResults > 200) {
    page++;
    const data = await fetchData(status, config, campaignIdString, query, page);

    if (data && data.data.length > 0) {
      ordersProcessed += processOrders(data.data, totals, paySources, status);
    }

    totalResults -= 200; // Decrease totalResults by 200 as we're fetching in chunks of 200
  }

  // Return the number of orders processed for this status
  return ordersProcessed;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.startDate || !query.endDate) {
    return 'Provide startDate and endDate';
  }

  const body = await readBody(event);
  const campaignIdString = body.join(',');

  const config = useRuntimeConfig(event);

  let totalAmount: number = 0;
  let refundedAmount: number = 0;
  let creditCard = 0;
  let payPal = 0;
  let completeCount = 0;
  let refundCount = 0;
  let cancelCount = 0;

  const totals = { totalAmount, refundedAmount };
  const paySources = { creditCard, payPal };

  // Fetch Complete Orders
  completeCount = await fetchAllPages('COMPLETE', config, campaignIdString, query, totals, paySources);

  // Fetch Refunded Orders
  refundCount = await fetchAllPages('REFUNDED', config, campaignIdString, query, totals, paySources);

  // Fetch Cancelled Orders
  // cancelCount = await fetchAllPages('CANCELLED', config, campaignIdString, query, totals, paySources);

  // Fetch Declined Orders (This one fetches only the first page since the total count is usually small)
  const declinedData = await fetchData('DECLINED', config, campaignIdString, query, 1);
  const declined = declinedData.totalResults ? declinedData.totalResults : 0;

  // **Initial Sales is the number of orders being processed (for all statuses)**
  const initialSales = completeCount + refundCount + cancelCount;

  return {
    totalAmount: totals.totalAmount,
    refundedAmount: totals.refundedAmount,
    initialSales, // This now reflects the number of orders
    declined,
    creditCard: paySources.creditCard,
    payPal: paySources.payPal,
  };
});
