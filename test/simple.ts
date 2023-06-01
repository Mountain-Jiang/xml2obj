import { XmlNode } from "../src/interface";
import { XmlParser } from "../src/xml";
import {parse} from 'txml';


function test() {
    const parser = new XmlParser({
        callback: (bStart: boolean, node: XmlNode) => {
            // console.log(bStart, node.tagName);
        }
    });
    const res = parser.parse('<test><cc>one</cc>test<cc f="test"><sub>3</sub>two</cc><dd></dd></test>');
    const tres = parse('<test><cc>one</cc>test<cc f="test"><sub>3</sub>two</cc><dd></dd></test>');
    console.log(JSON.stringify(res))
    console.log(JSON.stringify(tres))
    console.log(JSON.stringify(res) === JSON.stringify(tres))
}

test();