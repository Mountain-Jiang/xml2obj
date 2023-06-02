import BenchMark from "benchmark";
import {parse} from 'txml';
import { XmlParser } from "../src/xml";
import { XmlNode } from "../src/interface";
const fs = require('fs');

const buf = fs.readFileSync('./Document.xml');
const str = buf.toString();

const suite = new BenchMark.Suite();
// const str = '<test><cc>one</cc>test<cc f="test">  <sub>323  43</sub>two</cc><dd></dd></test>';

suite.add("txml parse", () => { // 2nd
    parse(str);
}).add('xml2obj parse', () => { // 1st
    const parser = new XmlParser();
    const res = parser.parse(str);
}).on('cycle', function (event: any) {
    console.log(String(event.target));
}).on('complete', function () {
    this.forEach(item => {
        console.log(item.name + ': ' + item.stats.mean + 's')
    })
}).run();

console.log('is equals: ', JSON.stringify(parse(str)) === JSON.stringify(new XmlParser().parse(str)));