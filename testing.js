const campaignCategory = {
  10: {
    campaignId: [39, 42, 41],
    campaignProductId: [741, 1256],
    name: "Secret Lane™",
  },
  12: {
    campaignId: [1, 68, 61, 47, 9, 6, 67, 69, 70],
    campaignProductId: [7, 463],
    name: "Lash Cosmetics™",
  },
  13: {
    campaignId: [8, 45, 48, 88, 24, 20, 10, 28, 34, 35, 82, 83],
    campaignProductId: [462, 1255],
    name: "Brow Charm™",
  },
  15: {
    campaignId: [12, 46, 38, 46, 85, 12, 55, 21, 15, 71],
    campaignProductId: [180, 1201],
    name: "Floral Secrets™",
  },
  16: {
    campaignId: [16, 53, 31, 19],
    campaignProductId: [746, 1199],
    name: "InvisiLift™",
  },
  21: {
    campaignId: [56, 58, 59],
    campaignProductId: [257, 1202],
    name: "Indestructible Tights™",
  },
  23: {
    campaignId: [72, 73, 75],
    campaignProductId: [1313],
    name: "MangoLift™",
  },
  25: {
    campaignId: [76, 81, 79],
    campaignProductId: [1435],
    name: "FitCharm™",
  },
  28: {
    campaignId: [97, 99, 101],
    campaignProductId: [3029],
    name: "BrowPro™",
  },
};

let finalResult = [];

let finalKeys = Object.values(campaignCategory)
let key = finalKeys.map(k => k.name)

let values = [1,2,3,4,5,6,7,8,9]

values.map((k,i)=>{
  let obj = {name:key[i]}
  finalResult.push(obj)
})
console.log(finalResult);

finalResult.map((k,i)=>{
  let obj = {...k, values:values[i]}
  finalResult[i] = obj
})

// console.log(finalResult);