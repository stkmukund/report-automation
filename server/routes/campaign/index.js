export const campaignCategory = {
  10: {
    campaignId: [39, 42, 41],
    campaignProductId: [471, 1256, 518, 478],
    name: "Secret Lane™",
  },
  12: {
    campaignId: [1, 68, 61, 47, 9, 6, 67, 69, 70],
    campaignProductId: [
      1011, 1030, 591, 610, 7, 463, 1177, 1196, 30, 1152, 1171, 1174, 1222,
    ],
    name: "Lash Cosmetics™",
  },
  13: {
    campaignId: [8, 45, 48, 88, 24, 20, 10, 28, 34, 35, 82, 83],
    campaignProductId: [
      2827, 2845, 2848, 612, 354, 101, 462, 1255, 160, 363, 432, 441, 569,
    ],
    name: "Brow Charm™",
  },
  15: {
    campaignId: [12, 46, 38, 85, 55, 21, 15, 71],
    campaignProductId: [572, 1655, 1673, 180, 1201, 716, 213, 1260, 1278],
    name: "Floral Secrets™",
  },
  16: {
    campaignId: [16, 53, 31, 19],
    campaignProductId: [257, 1202, 709, 286],
    name: "InvisiLift™",
  },
  21: {
    campaignId: [56, 58, 59],
    campaignProductId: [746, 1199, 930, 940],
    name: "Indestructible Tights™",
  },
  23: {
    campaignId: [72, 73, 75],
    campaignProductId: [1313, 1420, 1352],
    name: "MangoLift™",
  },
  25: {
    campaignId: [76, 81, 79],
    campaignProductId: [1435, 1522],
    name: "FitCharm™",
  },
  28: {
    campaignId: [97, 99, 101],
    campaignProductId: [3029, 3105, 3074],
    name: "BrowPro™",
  },
};

export const getYesterdayDate = () => {
  // Get today's date
  const today = new Date();

  // Subtract one day
  today.setDate(today.getDate() - 1);

  // Format the new date
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();

  return `${month}/${day}/${year}`;
}

export const getStartAndEndDate = (type) => {
  const today = new Date();

  if (type === "monthly") {
    // Check if today is the first day of the month
    if (today.getDate() === 1) {
      // Set start date as the first day of the previous month
      const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      // Set end date as the last day of the previous month
      const endDate = new Date(today.getFullYear(), today.getMonth(), 0); // 0 means last day of the previous month
      return { startDate: formatDate(startDate), endDate: formatDate(endDate) };
    }
  } else if (type === "quarterly") {
    const month = today.getMonth(); // Get current month (0-based index, so Jan = 0)
    const isFirstDayOfQuarter = today.getDate() === 1 && (month % 3 === 0);

    if (isFirstDayOfQuarter) {
      // Determine the current quarter
      const currentQuarter = Math.floor(month / 3) + 1;
      let previousQuarterStartMonth, previousQuarterEndMonth, previousQuarterYear;

      // Calculate previous quarter's start and end months
      if (currentQuarter === 1) {
        // If current quarter is Q1, previous quarter is Q4 of the previous year
        previousQuarterStartMonth = 9;  // October
        previousQuarterEndMonth = 11;   // December
        previousQuarterYear = today.getFullYear() - 1;
      } else {
        // For other quarters, just subtract 1 quarter
        previousQuarterStartMonth = (currentQuarter - 2) * 3;
        previousQuarterEndMonth = previousQuarterStartMonth + 2;
        previousQuarterYear = today.getFullYear();
      }

      // Create the start and end dates for the previous quarter
      const startDate = new Date(previousQuarterYear, previousQuarterStartMonth, 1);
      const endDate = new Date(previousQuarterYear, previousQuarterEndMonth + 1, 0); // Last day of the quarter

      return { startDate: formatDate(startDate), endDate: formatDate(endDate) };
    }
  }

  return `Today is not the first day of the ${type}.`; // If conditions are not met, return null
}

function formatDate(date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export const updateSheet = async (item, type = 'daily') => {
  const requestOptions = {
    method: "POST",
    redirect: "follow",
    body: JSON.stringify(item)
  };

  const response = await $fetch(`/api/google-sheets/google-api?type=${type}`, requestOptions)
    .then((result) => {
      return result
    })
    .catch((error) => {
      return error
    });

  return response

}

export const filterOrdersByStatus = async (orders) => {
  let ordersComplete = [];
  let ordersRefunded = [];
  let ordersCancelled = [];
  let totalOrderAmount = 0;
  let refundedOrderAmount = 0;
  let creditCardOrders = 0;
  let payPalOrders = 0;
  orders.map((order) => {
    if (order.orderStatus === "COMPLETE") {
      totalOrderAmount += +order.totalAmount;
      ordersComplete.push(order);
      if (order.paySource === "CREDITCARD") {
        creditCardOrders++;
      }
      if (order.paySource === "PAYPAL") {
        payPalOrders++;
      }
    }
    if (order.orderStatus === "REFUNDED") {
      totalOrderAmount += +order.totalAmount;
      ordersRefunded.push(order);
      refundedOrderAmount += +order.totalAmount;
      if (order.paySource === "CREDITCARD") {
        creditCardOrders++;
      }
      if (order.paySource === "PAYPAL") {
        payPalOrders++;
      }
    }
    if (order.orderStatus === "CANCELLED") {
      totalOrderAmount += +order.totalAmount;
      ordersCancelled.push(order);
      if (order.paySource === "CREDITCARD") {
        creditCardOrders++;
      }
      if (order.paySource === "PAYPAL") {
        payPalOrders++;
      }
    }
  });

  console.log("OrderSummary",ordersComplete.length , ordersRefunded.length , ordersCancelled.length );
  

  return {
    totalOrderAmount,
    refundedOrderAmount,
    creditCardOrders,
    payPalOrders,
    initialOrder:
      ordersComplete.length + ordersRefunded.length + ordersCancelled.length,
  };
};