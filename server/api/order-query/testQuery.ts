

export default defineEventHandler( async (event)=> {
    let response = await fetch(`https://api.checkoutchamp.com/order/query/?loginId=revboostapirs.nymbus&password=RSsfFrR2nN5PcC6L1pSRs&campaignId=39&startDate=06/01/2024&endDate=07/01/2024&resultsPerPage=200`);

    return await response.json();
})