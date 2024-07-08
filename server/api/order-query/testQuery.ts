

export default defineEventHandler( async (event)=> {
    // let response = await fetch(`https://api.checkoutchamp.com/transactions/summary/?loginId=revboostapirs.nymbus&password=RSsfFrR2nN5PcC6L1pSRs&startDate=07/01/2024&endDate=07/08/2024&reportType=campaign&campaignCategory=16`);
    let response = await fetch(`https://api.checkoutchamp.com/order/query/?loginId=revboostapirs.nymbus&password=RSsfFrR2nN5PcC6L1pSRs&campaignId=61,47,1,68,9,6,67,69,70&startDate=07/01/2024&endDate=07/08/2024&resultsPerPage=1&orderStatus=DECLINED&campaignProductId=7`);

    return await response.json();
})