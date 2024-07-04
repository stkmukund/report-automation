<script>
import axios from 'axios';
import Loading from '~/components/Loading.vue';
import TableLoading from '~/components/tableLoading.vue';

export default {
    data() {
        return {
            loading: false,
            campaignCategory: ["Secret Lane™", "Lash Cosmetics™", "Brow Charm™", "Floral Secrets™", "InvisiLift™", "Indestructible Tights™", "MangoLift™", "FitCharm™", "BrowPro™"],
            tableData: [],
            finalData: false,
        }
    },
    methods: {
        async handleClick() {
            this.loading = true;
            await this.initialSales();
            await this.partialSales();
            await this.ccinitialSales();
            await this.ppinitialSales();
            this.finalData = true;
            this.loading = false;
        },

        async initialSales() {
            try {
                let response = await
                    axios.get("/api/order-query/initialSales");
                let keys = Object.keys(response.data);
                let values = Object.values(response.data);
                for (let index = 0; index < keys.length; index++) {
                    let obj = { name: keys[index], initialSale: values[index] }
                    this.tableData.push(obj)
                }
            } catch (error) {
                console.log("getting error initialSales");
            }
        },

        async partialSales() {
            try {
                let response = await
                    axios.get("/api/order-query/partialSales");
                let values = Object.values(response.data);
                for (let index = 0; index < values.length; index++) {
                    this.tableData[index].partialSales = values[index]
                }
            } catch (error) {
                console.log("getting error partialSales");
            }
        },

        async ccinitialSales() {
            try {
                let response = await
                    axios.get("/api/order-query/ccinitialSales");
                let values = Object.values(response.data);
                for (let index = 0; index < values.length; index++) {
                    this.tableData[index].ccinitialSales = values[index]
                }
            } catch (error) {
                console.log("getting error ccinitialSales");
            }
        },

        async ppinitialSales() {
            try {
                let response = await
                    axios.get("/api/order-query/ppinitialSales");
                let values = Object.values(response.data);
                for (let index = 0; index < values.length; index++) {
                    this.tableData[index].ppinitialSales = values[index]
                }
            } catch (error) {
                console.log("getting error ppinitialSales");
            }
        },

    },
    mounted() {

    },
}
</script>
<template>
    <main class="p-5">
        <button @click="handleClick" :disabled="loading" type="button"
            class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none flex gap-2 items-center ">
            Calculate VIPs
            <div v-if="loading">
                <Loading />
            </div>
        </button>

        <!-- Table -->
        <div v-if="!finalData">
            <TableLoading />
        </div>
        <div v-if="finalData" class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Campaign Category
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Sales Total
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Initial Sales
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Declines
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Partials
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Rebill Revenue
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Rebill Approval
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Rebill Refunds
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Front-end Refunds
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Rebill Refunds
                        </th>
                        <th scope="col" class="px-6 py-3">
                            CC initial Sales
                        </th>
                        <th scope="col" class="px-6 py-3">
                            PP Initial Sales
                        </th>
                        <th scope="col" class="px-6 py-3">
                            CC New VIPs
                        </th>
                        <th scope="col" class="px-6 py-3">
                            PP New VIPs
                        </th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(item, index) in tableData" class="bg-white border-b hover:bg-gray-50 ">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                            {{ item.name }}
                        </th>
                        <td class="px-6 py-4">
                            {{ item.initialSale }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.partialSales }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.ccinitialSales }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.ppinitialSales }}
                        </td>
                        <td class="px-6 py-4">
                            Not Calculated
                        </td>
                        <td class="px-6 py-4">
                            Not Calculated
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>