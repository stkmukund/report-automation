const router = createRouter();

router.get("/sales-total",
  defineEventHandler(async (event) => {
    const query = getQuery(event);
    // Now you can access your query parameters using the query object
    if (!query.startDate || !query.endDate)
      return "provide startDate and endDate";
    const config = useRuntimeConfig(event);
    return {
      username: config.CC_LOGIN_ID,
      password: config.CC_PASSWORRD,
      startDate: query.startDate,
      endDate: query.endDate,
    };
  })
);

export default useBase("/api/order-query", router.handler);
