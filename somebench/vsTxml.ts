import BenchMark from "benchmark";
import {parse} from 'txml';
import { XmlParser } from "../src/xml";
import { XmlNode } from "../src/interface";
const fs = require('fs');

const str = fs.readFileSync('./Document.xml').toString();

const suite = new BenchMark.Suite();
const testStr = '<test><cc>one</cc>test<cc f="test"><sub>3</sub>two</cc><dd></dd></test>';

suite.add("txml parse", () => { // 2nd
    parse(str);
}).add('xml2obj parse', () => { // 1st
    const parser = new XmlParser();
    const res = parser.parse(str);
}).on('cycle', function (event: any) {
    console.log(String(event.target));
}).run();