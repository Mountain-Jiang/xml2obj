import BenchMark from "benchmark";

const suite = new BenchMark.Suite();
const nameSpacer = '\r\n\t>/=';
const testStr = 'attr = "value"';

suite.add("index match", () => { // 2nd
    let pos = 0;
    while (nameSpacer.indexOf(testStr[pos]) === -1 && testStr[pos]) {
        pos++;
    }
}).add('if match', () => { // 1st
    let pos = 0;
    function ismatch(char: string) {
        return char === '\r' || char === '\n' || char === '\t' || char === '>' || char === '/' || char === '=';
    }
    while (ismatch(testStr[pos]) && testStr[pos]) {
        pos++;
    }
}).add('set match', () => { // 3rd
    let pos = 0;
    const space = new Set(nameSpacer.split(''))
    while (space.has(testStr[pos]) && testStr[pos]) {
        pos++;
    }
}).on('cycle', function (event: any) {
    console.log(String(event.target));
}).run();