import { XmlNode } from "../src/interface";
import { XmlParser } from "../src/xml";
import {parse} from 'txml';
import * as fs from 'fs';

const buf = fs.readFileSync('./Document.xml');
const str = buf.toString();

function test() {
    const parser = new XmlParser({
        callback: (bStart: boolean, node: XmlNode) => {
            // console.log(bStart, node.tagName);
        }
    });
    const str = `
    <svg xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="583.029px" height="45px" viewBox="0 0 583.029 45" enable-background="new 0 0 583.029 45" xml:space="preserve">
    <input id="test">
    </svg>`;
    const res = JSON.stringify(parser.parse(str));
    const tres = JSON.stringify(parse(str));
    let i = 0;
    while (i < res.length || i < tres.length) {
        console.log(res.substring(i, i + 10), '  --  ', tres.substring(i, i + 10));
        i += 10;
    }
    // fs.writeFileSync('res.json', JSON.stringify(res))
    // fs.writeFileSync('tres.json', JSON.stringify(tres))
    // console.log(JSON.stringify(res) === JSON.stringify(tres))
    // const resStr = JSON.stringify(res).substring(0, 10000);
    // const tresStr = JSON.stringify(tres).substring(0,10000);
    // console.log(resStr.length, tresStr.length)

    // const minlen = Math.min(resStr.length, tresStr.length);
    // for (let i = 0; i < 10000; i++) {
    //     const a = resStr[i];
    //     const b = tresStr[i];
    //     if (a !== b) {
    //         console.log(i);
    //         console.log(resStr.substring(i - 100, i + 100))
    //         console.log(tresStr.substring(i - 100, i + 100))
    //         break;
    //     }
    // }

}

test();