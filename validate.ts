import fs from 'fs'

const clients = fs.readdirSync('./assets/exports')
.filter((file)=>{
  if(file.endsWith('.mp4')){
    return true 
  } else {
    return false
  }
})
.map((file)=> {
  const fileNameSplitted = file.split('_')
  const id = parseInt(fileNameSplitted[fileNameSplitted.length - 1].split('.')[0], 10)
  if (isNaN(id)) {
    throw new Error('Invalid ID =>>>>>> ' + file);
  }
  return id

})

const overlay1 = fs.readdirSync('./assets/input/overlay1').filter((file)=>{

  if(file.endsWith('.jpg')){
    return true 
  } else {
    return false
  }
}).map((file)=> {
  const fileNameSplitted = file.split('_')
  const id = parseInt(fileNameSplitted[fileNameSplitted.length - 1].split('.')[0], 10)
  if (isNaN(id)) {
    throw new Error('Invalid ID =>>>>>> ' + file);
  }
  return id

})

const overlay2 = fs.readdirSync('./assets/input/overlay2').filter((file)=>{
  if(file.endsWith('.jpg')){
    return true 
  } else {
    return false
  }
}).map((file)=> {
  const fileNameSplitted = file.split('_')
  const id = parseInt(fileNameSplitted[fileNameSplitted.length - 1].split('.')[0], 10)

  if (isNaN(id)) {
    throw new Error('Invalid ID =>>>>>> ' + file);
  }
  return id
})



function findMissing(ids: number[], overlay1: number[], overlay2: number[]) {

  return ids.filter((id: any) => !overlay1.includes(id) && !overlay2.includes(id));
}


const clientsSUM = clients.reduce((acc, client) => acc + client, 0);
const overlay1SUM = overlay1.reduce((acc, client) => acc + client, 0);
const overlay2SUM = overlay2.reduce((acc, client) => acc + client, 0);


function checkDifference(array: number[]) {

  array.sort((a, b) => {
    return a - b;
  })

  // console.log(array.slice(0,10))

  const erros = []

  for (let i = 1; i < array.length; i++) {
    if (Math.abs(array[i] - array[i - 1]) > 1) {
      erros.push(array[i - 1])

    }
  }

  console.log(erros)
}


function findById(array: number[], idToFind: number): number | undefined {
  return array.find((id: number) => +id == +idToFind);
}

const x = findById(clients, 21265)

// console.log(x)

// checkDifference(clients)
// checkDifference(overlay1)
// checkDifference(overlay2)


function findUniqueInArray(array1: number[], array2: number[]): number[] {
  return array1.filter((element: number) => !array2.includes(element));
}

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [1, 2, 3, 4, 5, 6];

// console.log(findUniqueInArray(clients, overlay2)); // Output: [6]

function findDuplicates(array: number[]): number[] {
  const counts: { [key: number]: number } = {};
  const duplicates: number[] = [];

  // Conta a frequência de cada elemento
  array.forEach((element) => {
    if (counts[element]) {
      counts[element]++;
    } else {
      counts[element] = 1;
    }
  });

  // Encontra os elementos duplicados
  for (const key in counts) {
    if (counts[key] > 1) {
      duplicates.push(parseInt(key)); // Converte a chave de volta para um número
    }
  }

  return duplicates;
}

const arr = [1, 2, 3, 4, 2, 5, 1, 6, 4];

console.log(findDuplicates(overlay1)); // Output: [1, 2, 4]



// console.log({
//   clients: clients.length,
//   overlay1: overlay1.length,
//   overlay2: overlay2.length,
//   uniqueInOverlay1
//   // clientsSUM,
//   // overlay1SUM,
//   // overlay2SUM
// })