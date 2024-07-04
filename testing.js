let finalData = []


let finalKeys = ['secretLane', 'lashCosmetics', 'browCharm', 'floralSecrets', 'invisiLift', 'indestructibleTights', 'fitCharm', 'browPro'];

let value = [78, 3123, 590, 1710, 488, 1136, 678, 1372]

for (let index = 0; index < finalKeys.length; index++) {
  let obj = {name:finalKeys[index],initialSale: value[index]}
  finalData.push(obj)
}

console.log(finalData);

for (let index = 0; index < finalKeys.length; index++) {
  finalData[index].partial = value[index]
}

console.log(finalData);