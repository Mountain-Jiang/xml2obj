import { IParserOptions, XmlNode, XmlNodeChildren } from "./interface";
import { isLetter, isNameSpacer, isNum, isSpace, last } from "./utils";

function getDefaultOptions(): IParserOptions {
    return {
        callback: undefined,
        callbackFilter: undefined,
        ignoreNamespacing: false
    };
}
type NodeCallbackFunc = IParserOptions["callback"];

interface ITag {
    attributes: Record<string, string>;
    cdata?: string;
    isStart: boolean;
    isSingle?: boolean;
    tagName: string;
}


        
const openBracket = '<';
const closeBracket = '>';
const minusCC = '-';
const slash = '/';
const exclamation = '!';
const singleQuote = "'";
const doubleQuote = '"';
const openCornerBracket = '[';
const closeCornerBracket = ']';
const questionMark = '?';

export class XmlParser {
    private cb: NodeCallbackFunc;
    private nodeFilter: Set<string> = new Set();
    private pos: number = 0;
    private xml: string = '';
    private noChildNodes: Set<string> = new Set(['img', 'br', 'input', 'meta', 'link', 'hr']);

    constructor(private readonly options?: IParserOptions) {}

    public parse(xml: string) {
        this.reset(this.options, xml);

        const nodeStack: XmlNode[] = [];
        const root: XmlNodeChildren[] = [];

        function appendToParent(node: XmlNodeChildren) {
            const parent = last(nodeStack);
            if (parent) parent.children.push(node);
            else root.push(node);
        }
        // begin parser xml
        const len = xml.length;
        let textStart = -1;
        while (this.pos < len) {
            const char = this.char();
            let curNode: XmlNode | undefined;
            if (char === openBracket) { // open or clase tag
                const textEnd = this.pos - 1;
                const textNode = textStart !== -1 && this.subStr(textStart, textEnd).trim(); // 去除正式文本前后的空白字符（有时会有缩进）
                const tag = this.parseTag();
                if (tag.isStart) {
                    if (textNode) {
                        appendToParent(textNode);
                    }
                    const node = this.xmlNodeBuild(tag);
                    if (tag.isSingle) {
                        appendToParent(node.cData || node);
                    } else {
                        nodeStack.push(node);
                        curNode = node;
                    }
                } else {
                    const stackTop = nodeStack.pop();
                    if (!stackTop || stackTop.tagName !== tag.tagName) {
                        const parsedText = this.subStr(0, this.pos).split('\n');
                        throw new Error(
                            'Unexpected close tag\nLine: ' + (parsedText.length - 1) +
                            '\nColumn: ' + (parsedText[parsedText.length - 1].length + 1) +
                            '\nChar: ' + this.xml[this.pos]
                        );
                    }
                    curNode = stackTop;
                    if (textNode) {
                        curNode.children.push(textNode)
                    }

                    // append to parent
                    appendToParent(curNode);
                }
                textStart = -1;
                if (this.cb && curNode) this.cb(tag.isStart, curNode);
            } else if (textStart === -1) {
                textStart = this.pos - 1;
            }
        }
        return root;
    }

    private char(inc = true): string {
         const char = this.xml[this.pos];
         if (inc) this.pos++;
         return char;
    }

    private parseTag(): ITag | null {
        const xml = this.xml;
        let pos = this.pos;
        const isStart = xml[pos] !== slash;
        const tag: ITag = {
            tagName: '',
            attributes: {},
            isStart: isStart,
        };
        if (
            isStart && 
            xml[pos] === exclamation &&
            xml[pos + 1] === openCornerBracket &&
            xml.substring(pos + 2, pos + 8).toLowerCase() === 'cdata['
        ) {
            const endIndex = xml.indexOf(']]>', pos);
            tag.cdata = xml.substring(pos + 8, endIndex);
            tag.isSingle = true;
            pos = endIndex + 3;
        } else {
            const len = xml.length;
            let start = isStart ? pos : pos + 1;
            while (pos < len) {
                const char = xml[pos];
                if (isSpace(char) || char === closeBracket) {
                    tag.tagName = xml.substring(start, pos);
                    break;
                }
                pos++;
            }
            let attrName = '';
            while (pos < len) {
                const char = xml[pos++];
                if (char === closeBracket) {
                    const prev = xml[pos - 2];
                    if (prev === slash || prev === questionMark) {
                        tag.isSingle = true;
                    }
                    break;
                }
                if (char === singleQuote || char === doubleQuote) {
                    const start = pos;
                    while (pos < len && xml[pos++] !== char);
                    if (attrName) {
                        tag.attributes[attrName] = xml.substring(start, pos - 1);
                    }
                } else if (!isNameSpacer(char)) {
                    const start = pos - 1;
                    while (pos < len && !isNameSpacer(xml[pos++]));
                    attrName = xml.substring(start, pos - 1);
                }
            }
        }
        this.pos = pos;
        if (this.noChildNodes.has(tag.tagName)) tag.isSingle = true;
        return tag;
    }

    private reset(options: IParserOptions = getDefaultOptions(), xml = '') {
        this.cb = options.callback;
        if (options.callbackFilter) {
            this.nodeFilter = new Set(options.callbackFilter);
        }
        this.pos = options.offset || 0;
        this.xml = xml;
    }

    private subStr(start: number, end: number = this.xml.length): string {
        return this.xml.substring(start, end);
    }

    private xmlNodeBuild(tag: ITag): XmlNode {
        const node: XmlNode = {
            tagName: tag.tagName,
            attributes: tag.attributes,
            children: [],
        };
        // if (tag.cdata) {
        //     node.cData = tag.cdata;
        // }
        // if (tag.isSingle) node.isSingle = true;

        return node;
    }
}