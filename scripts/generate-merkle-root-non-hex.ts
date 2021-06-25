import { program } from 'commander'
import fs from 'fs'
import { parseBalanceMap } from '../src/parse-balance-map'

program
  .version('0.0.0')
  .requiredOption(
    '-i, --input <path>',
    'input JSON file location containing a map of account addresses and balances'
  )
  .requiredOption(
    '-i, --output <path>',
    'Output JSON file location containing a map of account addresses and hex balances'
  )

program.parse(process.argv)

let csv = fs.readFileSync(program.input);
let array = csv.toString().split("\r\n");
let json: any = {};

for (let x = 0 ; x < array.length ; x++ ){
  let currentline = array[x].split(",");
  
  json[currentline[0]] = currentline[1];
}

console.log(json)

// let json = JSON.parse(fs.readFileSync(program.input, { encoding: 'utf8' }))

if (typeof json !== 'object') throw new Error('Invalid JSON')

let keys = Array.from( Object.keys(json) );

for (let x = 0 ; x < keys.length ; x++ ){
    json[String(keys[x])] = (json[String(keys[x])] * ( 10 ** 18 )).toString(16);
}

fs.writeFile (program.output, JSON.stringify(parseBalanceMap(json), null, 4), function(err) {
    if (err) throw err;
    console.log('complete');
    }
);
