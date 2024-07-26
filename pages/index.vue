<script>
import axios from "axios";
// import Loading from "~/components/Loading.vue";
// import TableLoading from "~/components/TableLoading.vue";

export default {
  data() {
    return {
      loading: false,
      campaignData: [
        { name: "Secret Lane™" },
        { name: "Lash Cosmetics™" },
        { name: "Brow Charm™" },
        { name: "Floral Secrets™" },
        { name: "InvisiLift™" },
        { name: "Indestructible Tights™" },
        { name: "MangoLift™" },
        { name: "FitCharm™" },
        { name: "BrowPro™" },
      ],
      tableHead: [
        "Campaign Category",
        "Sales Total",
        "Initial Sales",
        "Declines",
        "Partials",
        "Rebill Revenue",
        "Rebill Approval %",
        "Rebill Refunds",
        "Front-end Refund Amt",
        "Front-end Refund %",
        "Rebill refund %",
        "Chargebacks",
        "New VIPs",
        "VIP Cancellation",
        "CC New VIPs",
        "CC Initial Sales",
        "PP Initial Sales",
        "PP New VIPs",
        "Total VIPs",
      ],
      finalData: false,
      startDate: "",
      endDate: "",
      config: useRuntimeConfig().public,
      salesRefund: [],
    };
  },
  methods: {
    async handleClick() {
      if (!this.startDate && !this.endDate) return "";
      this.loading = true;
      await this.salesTotal();
      await this.initialSales();
      await this.declined();
      await this.partialSales();
      await this.rebillRev();
      await this.rebillApprovedPerc();
      await this.rebillRefundRev();
      await this.frontendRefundRev();
      await this.frontendRefundPerc();
      await this.rebillRefundPerc();
      await this.chargebackCnt();
      await this.initialVip();
      await this.declinedVip();
      await this.CCinitialVip();
      await this.CCinitialSale();
      await this.PPinitialSale();
      await this.PPinitialVip();
      await this.totalVip();
      this.loading = false;
    },

    // salesTotal
    async salesTotal() {
      const campaignCategory = {
        10: {
          campaignId: [39, 42, 41],
          campaignProductId: [471, 1256, 518, 478],
          name: "Secret Lane™",
        },
        12: {
          campaignId: [1, 68, 61, 47, 9, 6, 67, 69, 70],
          campaignProductId: [
            1011, 1030, 591, 610, 7, 463, 1177, 1196, 30, 1152, 1171, 1174,
            1222,
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
      try {
        // for COMPLETE status
        const fetchSales = async (campaignId) => {
          const queryStringCampaign = campaignId.join(",");
          let totalAmount = 0;
          let response = await fetch(
            `https://api.checkoutchamp.com/order/query/?loginId=${this.config.CC_LOGIN_ID}&password=${this.config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${this.startDate}&endDate=${this.endDate}&resultsPerPage=200&orderType=NEW_SALE`
          );
          const data = await response.json();
          let iteration = Math.ceil(data.message.totalResults / 200);
          for (let index = 1; index <= iteration; index++) {
            let responseNew = await fetch(
              `https://api.checkoutchamp.com/order/query/?loginId=${this.config.CC_LOGIN_ID}&password=${this.config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=COMPLETE&startDate=${this.startDate}&endDate=${this.endDate}&resultsPerPage=200&orderType=NEW_SALE&page=${index}`
            );
            const dataNew = await responseNew.json();
            const allData = dataNew.message.data;
            allData.forEach((item) => {
              if (typeof item.totalAmount !== "string") {
                item.totalAmount = 0;
              }

              totalAmount += Number(item.totalAmount);
            });
          }

          return totalAmount;
        };
        // for REFUND status
        const fetchSales2 = async (campaignId) => {
          const queryStringCampaign = campaignId.join(",");
          let totalAmount = 0;
          let response = await fetch(
            `https://api.checkoutchamp.com/order/query/?loginId=${this.config.CC_LOGIN_ID}&password=${this.config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=REFUNDED&startDate=${this.startDate}&endDate=${this.endDate}&resultsPerPage=200&orderType=NEW_SALE`
          );
          const data = await response.json();
          let iteration = Math.ceil(data.message.totalResults / 200);
          for (let index = 1; index <= iteration; index++) {
            let responseNew = await fetch(
              `https://api.checkoutchamp.com/order/query/?loginId=${this.config.CC_LOGIN_ID}&password=${this.config.CC_PASSWORRD}&campaignId=${queryStringCampaign}&orderStatus=REFUNDED&startDate=${this.startDate}&endDate=${this.endDate}&resultsPerPage=200&orderType=NEW_SALE&page=${index}`
            );
            const dataNew = await responseNew.json();
            const allData = dataNew.message.data;
            allData.forEach((item) => {
              // if(item.totalAmount != )
              // console.log(typeof(item.totalAmount));
              if (typeof item.totalAmount !== "string") {
                item.totalAmount = 0;
              }

              totalAmount += Number(item.totalAmount);
            });
          }

          return totalAmount;
        };

        let finalValues = [];
        let values = Object.values(campaignCategory);
        let categoryCampaignId = values.map((value) => value.campaignId);

        for (let index = 0; index < categoryCampaignId.length; index++) {
          let res = await fetchSales(categoryCampaignId[index]);
          let res2 = await fetchSales2(categoryCampaignId[index]);
          this.salesRefund.push(res2);
          finalValues.push((res + res2).toFixed(2));
          this.campaignData.map((k, i) => {
            let obj = { ...k, salesTotal: finalValues[i] };
            this.campaignData[i] = obj;
          });
          this.finalData = true;
        }

        // this.finalData = true;
      } catch (error) {
        console.log("getting error salesTotal");
        this.finalData = true;
      }
    },

    // initialSales
    async initialSales() {
      try {
        let response = await axios.get(
          `/api/order-query/initial-sale/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, initialSales: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error initialSales");
      }
    },

    // Declined
    async declined() {
      try {
        let response = await axios.get(
          `/api/order-query/declined/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, declined: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error declined");
      }
    },

    // partial
    async partialSales() {
      try {
        let response = await axios.get(
          `/api/order-query/partial/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, partial: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error partialSales");
      }
    },

    // Rebill revenue
    async rebillRev() {
      try {
        let response = await axios.get(
          `/api/order-query/rebill-revenue/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, rebillRev: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error rebillRevenue");
      }
    },

    // rebillApprovedPerc
    async rebillApprovedPerc() {
      try {
        let response = await axios.get(
          `/api/order-query/rebillApprovedPerc/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, rebillApprovedPerc: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error rebillApprovedPerc");
      }
    },

    // rebill-refundRev
    async rebillRefundRev() {
      try {
        let response = await axios.get(
          `/api/order-query/rebill-refundRev/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, rebillRefundRev: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error rebillRefundRev");
      }
    },

    // frontend-refundRev
    async frontendRefundRev() {
      try {
        let response = await axios.get(
          `/api/order-query/frontend-refundRev/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, frontendRefundRev: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error frontendRefundRev");
      }
    },

    // frontend-refundPerc
    async frontendRefundPerc() {
      try {
        let response = await axios.get(
          `/api/order-query/frontend-refundPerc/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, frontendRefundPerc: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error frontendRefundPerc");
      }
    },

    // rebill-refundPerc
    async rebillRefundPerc() {
      try {
        let response = await axios.get(
          `/api/order-query/rebill-refundPerc/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, rebillRefundPerc: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error rebillRefundPerc");
      }
    },

    // chargebackCnt
    async chargebackCnt() {
      try {
        let response = await axios.get(
          `/api/order-query/chargebackCnt/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, chargebackCnt: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error chargebackCnt");
      }
    },

    // initial-vip
    async initialVip() {
      try {
        let response = await axios.get(
          `/api/order-query/initial-vip/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, initialVip: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error initialVip");
      }
    },

    // declined-vip
    async declinedVip() {
      try {
        let response = await axios.get(
          `/api/order-query/declined-vip/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, declinedVip: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error declinedVip");
      }
    },

    // CCinitial-vip
    async CCinitialVip() {
      try {
        let response = await axios.get(
          `/api/order-query/CCinitial-vip/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, CCinitialVip: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error CCinitialVip");
      }
    },

    // CCinitial-sale
    async CCinitialSale() {
      try {
        let response = await axios.get(
          `/api/order-query/CCinitial-sale/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, CCinitialSale: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error CCinitialSale");
      }
    },

    // PPinitial-sale
    async PPinitialSale() {
      try {
        let response = await axios.get(
          `/api/order-query/PPinitial-sale/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, PPinitialSale: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error PPinitialSale");
      }
    },

    // PPinitial-vip
    async PPinitialVip() {
      try {
        let response = await axios.get(
          `/api/order-query/PPinitial-vip/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, PPinitialVip: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error PPinitialVip");
      }
    },

    // total-vip
    async totalVip() {
      try {
        let response = await axios.get(
          `/api/order-query/total-vip/?startDate=${this.startDate}&endDate=${this.endDate}`
        );
        this.campaignData.map((k, i) => {
          let obj = { ...k, totalVip: response.data[i] };
          this.campaignData[i] = obj;
        });
      } catch (error) {
        console.log("getting error totalVip");
      }
    },

    // Formate date
    formatDate() {
      let value1 = this.startDate.replace(/\D/g, ""); // Remove all non-digit characters
      let value2 = this.endDate.replace(/\D/g, ""); // Remove all non-digit characters
      // for startDate
      if (value1.length >= 3 && value1.length <= 4) {
        this.startDate = value1.slice(0, 2) + "/" + value1.slice(2);
      } else if (value1.length >= 5) {
        this.startDate =
          value1.slice(0, 2) +
          "/" +
          value1.slice(2, 4) +
          "/" +
          value1.slice(4, 8);
      } else {
        this.startDate = value1;
      }

      // for endDate
      if (value2.length >= 3 && value2.length <= 4) {
        this.endDate = value2.slice(0, 2) + "/" + value2.slice(2);
      } else if (value2.length >= 5) {
        this.endDate =
          value2.slice(0, 2) +
          "/" +
          value2.slice(2, 4) +
          "/" +
          value2.slice(4, 8);
      } else {
        this.endDate = value2;
      }
    },
  },
  mounted() {},
};
</script>
<template>
  <main class="p-5">
    <div class="flex">
      <button
        @click="handleClick"
        :disabled="loading"
        type="button"
        class="max-w-48 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 focus:outline-none flex gap-2 items-center h-10"
      >
        Calculate
        <div v-if="loading">
          <Loading />
        </div>
      </button>
      <div class="date-inputs w-full">
        <input
          v-model="startDate"
          @input="formatDate"
          maxlength="10"
          placeholder="Start Date: MMDDYYYY"
          type="text"
          id="small-input"
          class="mr-3 w-2/12 h-10 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          v-model="endDate"
          @input="formatDate"
          maxlength="10"
          placeholder="End Date: MMDDYYYY"
          type="text"
          id="small-input"
          class="w-2/12 h-10 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <!-- Table -->
    <div v-if="!finalData">
      <TableLoading />
    </div>
    <div
      id="tableDiv"
      v-if="finalData"
      class="relative overflow-x-auto shadow-md sm:rounded-lg"
    >
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th
              v-for="(item, index) in tableHead"
              scope="col"
              class="px-6 py-3"
            >
              {{ tableHead[index] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in campaignData"
            class="bg-white border-b hover:bg-gray-50"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              {{ item.name }}
            </th>
            <td class="px-6 py-4">${{ item.salesTotal }}</td>
            <td class="px-6 py-4">
              {{ item.initialSales }}
            </td>
            <td class="px-6 py-4">
              {{ item.declined }}
            </td>
            <td class="px-6 py-4">
              {{ item.partial }}
            </td>
            <td class="px-6 py-4">${{ item.rebillRev }}</td>
            <td class="px-6 py-4">
              {{ item.rebillApprovedPerc }}
            </td>
            <td class="px-6 py-4 text-red-500">${{ item.rebillRefundRev }}</td>
            <td class="px-6 py-4 text-red-500">
              <!-- ${{
                item.frontendRefundRev != "NaN"
                  ? item.frontendRefundRev
                  : "0.00"
              }} -->
              <!-- Updated Formula -->
              ${{ salesRefund[index].toFixed(2) }}
            </td>
            <!-- <td class="px-6 py-4 text-red-500">
              {{
                item.frontendRefundPerc != "NaN"
                  ? item.frontendRefundPerc
                  : "0.00"
              }}
            </td>  -->
            <!-- Updated formula -->
            <td class="px-6 py-4 text-red-500">
              {{ ((salesRefund[index] / item.salesTotal) * 100).toFixed(2) }}
            </td>
            <!-- Rebill Refund % -->
            <!-- <td class="px-6 py-4">{{ item.rebillRefundPerc }}</td> -->
            <!-- Updated Formula -->
            <td class="px-6 py-4">
              {{
                Math.abs((item.rebillRefundRev / item.rebillRev) * 100).toFixed(
                  2
                )
              }}
            </td>
            <td class="px-6 py-4">
              {{
                item.chargebackCnt
                  ? parseInt(item.chargebackCnt)
                  : item.chargebackCnt
              }}
            </td>
            <td class="px-6 py-4">{{ item.initialVip }}</td>
            <td class="px-6 py-4">{{ item.declinedVip }}</td>
            <td class="px-6 py-4">{{ item.CCinitialVip }}</td>
            <td class="px-6 py-4">{{ item.CCinitialSale }}</td>
            <td class="px-6 py-4">{{ item.PPinitialSale }}</td>
            <td class="px-6 py-4">{{ item.PPinitialVip }}</td>
            <td class="px-6 py-4">{{ item.totalVip }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
