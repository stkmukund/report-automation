<script>
import axios from "axios";
import Loading from "~/components/Loading.vue";
import TableLoading from "~/components/tableLoading.vue";

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
            tableHead: ["Campaign Category","Sales Total","Initial Sales","Declines","Partials","Rebill Revenue","Rebill Approval %","Rebill Refunds","Front-end Refund Amt","Front-end Refund %","Rebill refund %","Chargebacks","New VIPs","VIP Cancellation","CC New VIPs","CC Initial Sales","PP Initial Sales","PP New VIPs","Total VIPs"],
            finalData: false,
            startDate: "",
            endDate: "",
        };
    },
    methods: {
        async handleClick() {
            this.loading = true;
            await this.salesTotal();
            await this.initialSales();
            await this.declined();
            await this.partialSales();
            await this.rebillRev();
            // await this.ppinitialSales();
            this.finalData = true;
            this.loading = false;
        },

        // salesTotal
        async salesTotal() {
            try {
                let response = await axios.get(
                    `/api/order-query/sales-total/?startDate=${this.startDate}&endDate=${this.endDate}`
                );
                this.campaignData.map((k, i) => {
                    let obj = { ...k, salesTotal: response.data[i] }
                    this.campaignData[i] = obj;
                })
            } catch (error) {
                console.log("getting error salesTotal");
            }
        },

        // initialSales
        async initialSales() {
            try {
                let response = await axios.get(
                    `/api/order-query/initial-sale/?startDate=${this.startDate}&endDate=${this.endDate}`
                );
                this.campaignData.map((k, i) => {
                    let obj = { ...k, initialSales: response.data[i] }
                    this.campaignData[i] = obj;
                })
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
                    let obj = { ...k, declined: response.data[i] }
                    this.campaignData[i] = obj;
                })
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
                    let obj = { ...k, partial: response.data[i] }
                    this.campaignData[i] = obj;
                })
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
                    let obj = { ...k, rebillRev: response.data[i] }
                    this.campaignData[i] = obj;
                })
            } catch (error) {
                console.log("getting error rebillRevenue");
            }
        },

        // CC initial
        async ccinitialSales() {
            try {
                let response = await axios.get("/api/order-query/ccinitialSales");
                let values = Object.values(response.data);
                for (let index = 0; index < values.length; index++) {
                    this.tableData[index].ccinitialSales = values[index];
                }
            } catch (error) {
                console.log("getting error ccinitialSales");
            }
        },

        // PP initial
        async ppinitialSales() {
            try {
                let response = await axios.get("/api/order-query/ppinitialSales");
                let values = Object.values(response.data);
                for (let index = 0; index < values.length; index++) {
                    this.tableData[index].ppinitialSales = values[index];
                }
            } catch (error) {
                console.log("getting error ppinitialSales");
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
                class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none flex gap-2 items-center h-10">
                Calculate VIPs
                <div v-if="loading">
                    <Loading />
                </div>
            </button>
            <div class="date-inputs">
                <input v-model="startDate" @input="formatDate" maxlength="10" placeholder="Start Date: MMDDYYYY"
                    type="text" id="small-input"
                    class="mr-3 h-10 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500" />
                <input v-model="endDate" @input="formatDate" maxlength="10" placeholder="End Date: MMDDYYYY" type="text"
                    id="small-input"
                    class="h-10 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>

        <button @click="salesTotal" class="bg-gray-600 mb-3">
            Check sales total
        </button>

        <!-- Table -->
        <!-- <div v-if="!finalData">
            <TableLoading />
        </div> -->
        <div v-if="finalData" class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th v-for="(item, index) in tableHead" scope="col" class="px-6 py-3">{{ tableHead[index] }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in campaignData" class="bg-white border-b hover:bg-gray-50">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {{ item.name }}
                        </th>
                        <td class="px-6 py-4">
                            {{ item.salesTotal }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.initialSales }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.declined }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.partial }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.rebillRev }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.ppinitialSales }}
                        </td>
                        <td class="px-6 py-4">Not Calculated</td>
                        <td class="px-6 py-4">Not Calculated</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>
