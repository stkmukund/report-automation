<script>
import axios from "axios";

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
      campaignCategory: [
        { name: "Secret Lane™", id: 10, campaignId: [39, 42, 41] },
        { name: "Lash Cosmetics™", id: 12, campaignId: [61, 47, 1, 68, 9, 6, 67, 69, 70] },
        { name: "Brow Charm™", id: 13, campaignId: [88, 48, 24, 8, 20, 10, 28, 34, 35, 45, 83, 82] },
        { name: "Floral Secrets™", id: 15, campaignId: [38, 46, 85, 12, 71, 55, 21, 15] },
        { name: "InvisiLift™", id: 16, campaignId: [16, 53, 31, 19] },
        { name: "Indestructible Tights™", id: 21, campaignId: [56, 58, 59] },
        { name: "MangoLift™", id: 23, campaignId: [72, 75, 73] },
        { name: "FitCharm™", id: 25, campaignId: [76, 81, 79] },
        { name: "BrowPro™", id: 28, campaignId: [97, 101, 99] },
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
      // await this.declinePerc();
      await this.partialSales();
      // // await this.avgTicket();
      await this.rebillRev();
      // await this.rebillApprovedPerc();
      // await this.rebillRefundRev();
      // // await this.billableRebillRev();
      // // await this.frontendRefundRev();
      // // await this.frontendRefundPerc();
      // await this.rebillRefundPerc();
      // await this.chargebackCnt();
      await this.initialVip();
      await this.declinedVip();
      // // await this.CCinitialVip();
      // // await this.CCoptVip();
      // await this.CCinitialSale();
      // // await this.updateCCoptVip();
      // await this.PPinitialSale();
      // // await this.PPinitialVip();
      // // await this.PPoptVip();
      // // await this.TotaloptPPCC();
      await this.totalVip();
      this.loading = false;
    },

    // salesTotal
    // async salesTotal() {
    //   try {
    //     const values = Object.values(this.config.campaignCategory);
    //     const categoryCampaignIds = values.map((value) => value.campaignId);
    //     const fetch = async (value, index) => {
    //       const { data } = await axios.get(
    //         `/api/order/sales-total/?startDate=${this.startDate}&endDate=${this.endDate}&campaignId=${value}`
    //       );
    //       const { totalAmount, refundedAmount, initialSales, declined } =
    //         await data;
    //       this.campaignData[index].salesTotal = Number(totalAmount).toFixed(2);
    //       this.campaignData[index].initialSales = Number(initialSales);
    //       this.campaignData[index].declined = Number(declined);
    //       this.salesRefund.push(Number(refundedAmount).toFixed(2));
    //       return 1;
    //     };
    //     for (const [index, value] of categoryCampaignIds.entries()) {
    //       await fetch(value, index);
    //     }
    //     this.finalData = true;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // salesTotal
    async salesTotal() {
      const ids = this.campaignCategory.map(category => category.campaignId);

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];

        const data = await $fetch(`/report/salestotal?startDate=${this.startDate}&endDate=${this.endDate}`, {
          method: "POST",
          redirect: "follow",
          body: id,
        });

        const { totalAmount, refundedAmount, initialSales, declined, creditCard, payPal } = data;
        this.campaignData[index].salesTotal = Number(totalAmount).toFixed(2);
        this.campaignData[index].initialSales = Number(initialSales);
        this.campaignData[index].declined = Number(declined);
        this.campaignData[index].CCinitialSale = Number(creditCard);
        this.campaignData[index].PPinitialSale = Number(payPal);
        this.salesRefund.push(Number(refundedAmount).toFixed(2));
        this.finalData = true;
      }
    },
    // declinePerc
    // async declinePerc() {
    //   this.campaignData.map((item) => {
    //     let result = item[4] / (item[3] + item[4]);
    //     if (!result) result = 0;
    //     item.push(result.toFixed(2));
    //   });
    // },

    // partial
    // async partialSales() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/partial/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, partial: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log(error, "getting error partialSales");
    //   }
    // },
    async partialSales() {
      const ids = this.campaignCategory.map(category => category.campaignId);

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];

        const partial = await $fetch(`/report/partial?startDate=${this.startDate}&endDate=${this.endDate}`, {
          method: "POST",
          redirect: "follow",
          body: id,
        });
        this.campaignData[index].partial = Number(partial);
      }
    },

    // avgTicket
    // async avgTicket() {
    //   this.googleSheet.map((item) => {
    //     let result = item[2] / item[3];
    //     if (!result) result = 0;
    //     item.push(result.toFixed(2));
    //   });
    // },

    // Rebill revenue
    async rebillRev() {
      const ids = this.campaignCategory.map(category => category.id);

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];

        const { rebillRevenue, rebillApprovedPerc, rebillRefundRev, chargebackCnt } = await $fetch(`/report/rebill-revenue?startDate=${this.startDate}&endDate=${this.endDate}`, {
          method: "POST",
          redirect: "follow",
          body: JSON.stringify(id),
        });
        this.campaignData[index].rebillRev = Number(rebillRevenue);
        this.campaignData[index].rebillApprovedPerc = Number(rebillApprovedPerc);
        this.campaignData[index].rebillRefundRev = Number(rebillRefundRev);
        this.campaignData[index].chargebackCnt = Number(chargebackCnt);
      }
    },

    // rebillApprovedPerc
    // async rebillApprovedPerc() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/rebillApprovedPerc/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, rebillApprovedPerc: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log("getting error rebillApprovedPerc");
    //   }
    // },

    // rebill-refundRev
    // async rebillRefundRev() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/rebill-refundRev/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, rebillRefundRev: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log("getting error rebillRefundRev");
    //   }
    // },

    // billableRebillRev
    // async billableRebillRev() {
    //   this.googleSheet.map((item) => {
    //     let result = item[8] - item[10];
    //     if (!result) result = 0;
    //     item.push(result.toFixed(2));
    //   });
    // },

    // frontend-refundRev
    // async frontendRefundRev() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/frontend-refundRev/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, frontendRefundRev: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log("getting error frontendRefundRev");
    //   }
    // },

    // frontend-refundPerc
    // async frontendRefundPerc() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/frontend-refundPerc/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, frontendRefundPerc: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log("getting error frontendRefundPerc");
    //   }
    // },

    // rebill-refundPerc
    // async rebillRefundPerc() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/rebill-refundPerc/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, rebillRefundPerc: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log("getting error rebillRefundPerc");
    //   }
    // },

    // chargebackCnt
    // async chargebackCnt() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/chargebackCnt/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, chargebackCnt: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log("getting error chargebackCnt");
    //   }
    // },

    // initial-vip
    // async initialVip() {
    //   try {
    //     const values = Object.values(this.config.campaignCategory);
    //     const categoryCampaignIds = values.map((value) => value.campaignId);
    //     const fetch = async (value, index) => {
    //       const { data } = await axios.get(
    //         `/api/purchases/initial-vip/?startDate=${this.startDate}&endDate=${this.endDate}&campaignId=${value}`
    //       );
    //       const { totalResults, creditCard, payPal } = data;
    //       this.campaignData[index].initialVip = Number(totalResults);
    //       this.campaignData[index].CCinitialVip = Number(creditCard);
    //       this.campaignData[index].PPinitialVip = Number(payPal);
    //       return 1;
    //     };
    //     for (const [index, value] of categoryCampaignIds.entries()) {
    //       await fetch(value, index);
    //     }
    //   } catch (error) {
    //     console.log("getting error initialVip");
    //   }
    // },
    async initialVip() {
      const ids = this.campaignCategory.map(category => category.campaignId);

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];

        const { totalResults, creditCard, payPal } = await $fetch(`/report/initial-vip?startDate=${this.startDate}&endDate=${this.endDate}`, {
          method: "POST",
          redirect: "follow",
          body: id,
        });
        this.campaignData[index].initialVip = Number(totalResults);
        this.campaignData[index].CCinitialVip = Number(creditCard);
        this.campaignData[index].PPinitialVip = Number(payPal);
      }
    },

    // declined-vip
    async declinedVip() {
      const ids = this.campaignCategory.map(category => category.campaignId);

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];

        const declinedVip = await $fetch(`/report/declined-vip?startDate=${this.startDate}&endDate=${this.endDate}`, {
          method: "POST",
          redirect: "follow",
          body: id,
        });
        this.campaignData[index].declinedVip = Number(declinedVip);
      }
    },

    // CCinitial-vip
    // async CCinitialVip() {
    //   try {
    //     const values = Object.values(this.config.campaignCategory);
    //     const categoryCampaignIds = values.map((value) => value.campaignId);
    //     const fetch = async (value, index) => {
    //       const { data } = await axios.get(
    //         `/api/purchases/initial-vip/?startDate=${this.startDate}&endDate=${this.endDate}&campaignId=${value}`
    //       );
    //       const { totalResults } = data;
    //       this.campaignData[index].CCinitialVip = Number(totalResults);
    //       return 1;
    //     };
    //     for (const [index, value] of categoryCampaignIds.entries()) {
    //       await fetch(value, index);
    //     }
    //   } catch (error) {
    //     console.log("getting error CCinitialVip");
    //   }
    // },

    // CCoptVip
    // async CCoptVip() {
    //   this.googleSheet.map((item) => {
    //     item.push("");
    //   });
    // },

    // updateCCoptVip
    // async updateCCoptVip() {
    //   this.googleSheet.map((item) => {
    //     let result = item[18] / item[20];
    //     if (!result) result = 0;
    //     item[19] = result.toFixed(2);
    //   });
    // },

    // CCinitial-sale
    // async CCinitialSale() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/CCinitial-sale/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, CCinitialSale: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log("getting error CCinitialSale");
    //   }
    // },

    // PPinitial-sale
    // async PPinitialSale() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/PPinitial-sale/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, PPinitialSale: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log("getting error PPinitialSale");
    //   }
    // },

    // PPinitial-vip
    // async PPinitialVip() {
    //   try {
    //     let response = await axios.get(
    //       `/api/order/PPinitial-vip/?startDate=${this.startDate}&endDate=${this.endDate}`
    //     );
    //     this.campaignData.map((k, i) => {
    //       let obj = { ...k, PPinitialVip: response.data[i] };
    //       this.campaignData[i] = obj;
    //     });
    //   } catch (error) {
    //     console.log("getting error PPinitialVip");
    //   }
    // },

    // PPoptVip
    // async PPoptVip() {
    //   this.googleSheet.map((item) => {
    //     let result = item[22] / item[21];
    //     if (!result) result = 0;
    //     item.push(result.toFixed(2));
    //   });
    // },

    // TotaloptPPCC
    // async TotaloptPPCC() {
    //   this.googleSheet.map((item) => {
    //     let result = item[16] / item[3];
    //     if (!result) result = 0;
    //     item.push(result.toFixed(2));
    //   });
    // },

    // total-vip
    async totalVip() {
      try {
        const ids = this.campaignCategory.map(category => category.campaignId);

        for (let index = 0; index < ids.length; index++) {
          const id = ids[index];

          const totalVip = await $fetch(`/report/total-vip?startDate=${this.startDate}&endDate=${this.endDate}`, {
            method: "POST",
            redirect: "follow",
            body: id,
          });
          this.campaignData[index].totalVip = Number(totalVip);
        }
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
  mounted() { },
};
</script>
<template>
  <main class="p-5">
    <div class="flex">
      <button @click="handleClick" :disabled="loading" type="button"
        class="max-w-48 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 focus:outline-none flex gap-2 items-center h-10">
        Calculate
        <div v-if="loading">
          <Loading />
        </div>
      </button>
      <div class="date-inputs w-full">
        <input v-model="startDate" @input="formatDate" maxlength="10" placeholder="Start Date: MMDDYYYY" type="text"
          id="small-input"
          class="mr-3 w-2/12 h-10 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500" />
        <input v-model="endDate" @input="formatDate" maxlength="10" placeholder="End Date: MMDDYYYY" type="text"
          id="small-input"
          class="w-2/12 h-10 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500" />
      </div>
    </div>

    <!-- Table -->
    <div v-if="!finalData">
      <TableLoading />
    </div>
    <div id="tableDiv" v-if="finalData" class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th v-for="(item, index) in tableHead" scope="col" class="px-6 py-3">
              {{ tableHead[index] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in campaignData" class="bg-white border-b hover:bg-gray-50">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {{ item.name }}
            </th>
            <td class="px-6 py-4">{{ item.salesTotal }}</td>
            <td class="px-6 py-4">
              {{ item.initialSales }}
            </td>
            <td class="px-6 py-4">
              {{ item.declined }}
            </td>
            <td class="px-6 py-4">
              {{ item.partial }}
            </td>
            <td class="px-6 py-4">{{ item.rebillRev }}</td>
            <td class="px-6 py-4">
              {{ item.rebillApprovedPerc }}
            </td>
            <td class="px-6 py-4 text-red-500">{{ item.rebillRefundRev }}</td>
            <td class="px-6 py-4 text-red-500">
              <!-- {{
                item.frontendRefundRev != "NaN"
                  ? item.frontendRefundRev
                  : "0.00"
              }} -->
              <!-- Updated Formula -->
              {{ salesRefund[index] }}
            </td>
            <!-- frontend refund %-->
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
