// Get today's date
const today = new Date();

// Get the date one week earlier
const oneWeekEarlier = new Date();
oneWeekEarlier.setDate(today.getDate() - 6);

// Format the dates to a readable format (e.g., 'yyyy-MM-dd')
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
};

const todayFormatted = formatDate(today);
const oneWeekEarlierFormatted = formatDate(oneWeekEarlier);

// console.log("Today's Date:", todayFormatted);
// console.log("One Week Earlier:", oneWeekEarlierFormatted);

// Get Vip sales

let campaignCategory = {
  10: {
    name: "Secret Lane™",
    productId: 160,
  },
  12: {
    name: "Lash Cosmetics™",
    productId: 1,
  },
  13: {
    name: "Brow Charm™",
    productId: 69,
  },
  15: {
    name: "Floral Secrets™",
    productId: 95,
  },
  16: {
    name: "InvisiLift™",
    productId: 160,
  },
  21: {
    name: "Indestructible Tights™",
    productId: 677,
  },
  23: {
    name: "MangoLift™",
    productId: 699,
  },
  25: {
    name: "FitCharm™",
    productId: 771,
  },
  28: {
    name: "BrowPro™",
    productId: 1563,
  },
};
let campaignCategoryKeys = Object.keys(campaignCategory);

async function fetchSales(startDate, endDate) {
  let newSaleCnt = [];
  let rebillDeclinesCnt = [];
  // console.log(campaignCategory[campaignCategoryKeys[0]].productId);

  for (let index = 0; index < campaignCategoryKeys.length; index++) {
    const response = await fetch(
      `https://api.checkoutchamp.com/transactions/summary/?loginId=revboostapirs.nymbus&password=RSsfFrR2nN5PcC6L1pSRs&startDate=${startDate}&endDate=${endDate}&reportType=product&productId=${
        campaignCategory[campaignCategoryKeys[index]].productId
      }&campaignCategory=${campaignCategoryKeys[index]}`
    );
    const data = await response.json();
    // console.log(index);

    newSaleCnt.push(data.message[0].newSaleCnt);
    rebillDeclinesCnt.push(data.message[0].rebillRev);
  }

  return [newSaleCnt,rebillDeclinesCnt];
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  // Now you can access your query parameters using the query object
  // console.log("quey",query);
  if(!query.startDate || !query.endDate) return "provide startDate and endDate";
  //   await test();

  // fetch total data

  // Calculate VIP

  const [newSaleCnt, rebillDeclinesCnt]  = await fetchSales(query.startDate, query.endDate);
  
  let finalResult = [];
  for (let index = 0; index < newSaleCnt.length; index++) {
    let name = campaignCategory[campaignCategoryKeys[index]].name;
    finalResult[index] = { name: name, sales: newSaleCnt[index], rebillDeclines: rebillDeclinesCnt[index] };
  }
  // await sheetUpdate();
  //   console.log("totalData.length", totalData.length);

  let res = {
    DateRange: { startDate: query.startDate, endDate: query.endDate },
    VipSales: finalResult,
  };

  return res;
});
