import {
  campaignCategory,
  getStartAndEndDate,
  getYesterdayDate,
  updateSheet,
} from ".";
import {
  DateRange,
  InitialVipResponse,
  RebillRevenueResponse,
  RequestOptions,
  requestOptionsTransaction,
  SalesTotalResponse,
} from "./interfaces";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const yesterdayDate = getYesterdayDate();

  // For monthly and Quarterly Report
  if (query.type) {
    const date: DateRange = getStartAndEndDate(query.type);
    if (date.startDate) {
      query.startDate = date.startDate;
      query.endDate = date.endDate;
    } else {
      return `Today is not the first day of the ${query.type}.`;
    }
  }

  if (!query.startDate || !query.endDate) {
    query.startDate = yesterdayDate;
    query.endDate = yesterdayDate;
  }
  const { campaignId, campaignProductId } = campaignCategory[28];

  const requestOptions: RequestOptions = {
    method: "POST",
    redirect: "follow",
    body: campaignId,
  };
  const requestOptionsTransaction: requestOptionsTransaction = {
    method: "POST",
    redirect: "follow",
    body: JSON.stringify(28),
  };

  //  sales total
  const {
    totalAmount,
    refundedAmount,
    initialSales,
    declined,
    creditCard,
    payPal,
  } = await $fetch<SalesTotalResponse>(
    `/report/salestotal?startDate=${query.startDate}&endDate=${query.endDate}`,
    requestOptions
  );

  // partial
  const partial = await $fetch<number>(
    `/report/partial?startDate=${query.startDate}&endDate=${query.endDate}`,
    requestOptions
  ).then((res) => Number(res));

  // rebill-revenue
  const { rebillApproveCount, rebillDeclineCount, rebillRevenue, rebillApprovedPerc, rebillRefundRev, chargebackCnt } =
    await $fetch<RebillRevenueResponse>(
      `/report/rebill-revenue?startDate=${query.startDate}&endDate=${query.endDate}`,
      requestOptionsTransaction
    );

  // initial-vip
  const {
    totalResults: initialVip,
    creditCard: ccInitialVip,
    payPal: ppInitialVip,
  } = await $fetch<InitialVipResponse>(
    `/report/initial-vip?startDate=${query.startDate}&endDate=${query.endDate}`,
    requestOptions
  );

  // declined-vip
  const declinedVip = await $fetch<number>(
    `/report/declined-vip?startDate=${query.startDate}&endDate=${query.endDate}`,
    requestOptions
  ).then((res) => Number(res));

  // total-vip
  const totalVip = await $fetch<number>(
    `/report/total-vip?startDate=${query.startDate}&endDate=${query.endDate}`,
    requestOptions
  ).then((res) => Number(res));

  // recycle-rebilling
  const recycleRebilling = await $fetch<number>(
    `/report/recycle-rebilling?startDate=${query.startDate}&endDate=${query.endDate}`,
    requestOptions
  ).then((res) => Number(res));

  // Can be calculated feildss
  let declinePerc = (declined / (initialSales + declined)).toFixed(4);
  if (declinePerc == "NaN") declinePerc = "0";
  let avgTicket = (totalAmount / initialSales).toFixed(2);
  if (avgTicket == "NaN" || avgTicket == "Infinity") avgTicket = "0";
  const billableRebillRev = (rebillRevenue - rebillRefundRev).toFixed(2);
  let frontendRefundPerc = (refundedAmount / totalAmount).toFixed(4);
  if (frontendRefundPerc == "NaN") frontendRefundPerc = "0";
  let rebillRefundPerc = (rebillRefundRev / rebillRevenue).toFixed(4);

  if (rebillRefundPerc == "NaN" || rebillRefundPerc == "Infinity")
    rebillRefundPerc = "0";
  let CCoptVip = (ccInitialVip / creditCard).toFixed(4);
  if (CCoptVip == "NaN") CCoptVip = "0";
  let PPoptVip = (ppInitialVip / payPal).toFixed(4);
  if (PPoptVip == "NaN") PPoptVip = "0";
  let TotaloptPPCC = (initialVip / initialSales).toFixed(4);
  if (TotaloptPPCC == "NaN") TotaloptPPCC = "0";

  // Update in google sheet
  const item = [
    "BrowPro™",
    query.startDate,
    Number(totalAmount).toFixed(2),
    initialSales,
    declined,
    Number(declinePerc),
    partial,
    Number(avgTicket),
    rebillRevenue,
    rebillApproveCount,
    rebillDeclineCount,
    rebillApprovedPerc / 100,
    Math.abs(rebillRefundRev),
    Number(billableRebillRev),
    refundedAmount,
    Number(frontendRefundPerc),
    Number(rebillRefundPerc),
    chargebackCnt,
    initialVip,
    declinedVip,
    ccInitialVip,
    Number(CCoptVip),
    creditCard,
    payPal,
    ppInitialVip,
    Number(PPoptVip),
    Number(TotaloptPPCC),
    totalVip,
    recycleRebilling,
  ];
  try {
    let response;
    if (query.type) {
      response = await updateSheet(item, query.type);
    } else {
      response = await updateSheet(item);
    }
    return ["Sheet updated successfully", item, response.data];
  } catch (error) {
    return ["Error updating sheet:", error];
  }
});
