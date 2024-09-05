export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  // let response = await $fetch(
  //   `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=1, 68, 61, 47, 9, 6, 67, 69, 70&orderStatus=COMPLETE&startDate=08/01/2024&endDate=08/11/2024&resultsPerPage=1&orderType=NEW_SALE&campaignProductId=1011, 1030, 591, 610, 7, 463, 1177, 1196, 30, 1152, 1171, 1174, 1222`
  // );
  let response = await $fetch(
    `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=1, 68, 61, 47, 9, 6, 67, 69, 70&status=ACTIVE&startDate=08/01/2024&endDate=08/11/2024&resultsPerPage=1`
  );
  // let response = await $fetch(
  //   `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=08/11/2024&endDate=08/11/2024&reportType=currency&productId=RECURRING&campaignCategory=21`
  // );

  return response;
});
