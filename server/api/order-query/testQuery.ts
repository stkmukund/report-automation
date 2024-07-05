

export default defineEventHandler( async (event)=> {
    let response = await fetch(`https://api.checkoutchamp.com/transactions/summary/?loginId=revboostapirs.nymbus&password=RSsfFrR2nN5PcC6L1pSRs&startDate=07/01/2024&endDate=07/05/2024&reportType=product&productId=1&campaignCategory=12`);

    return await response.json();
})