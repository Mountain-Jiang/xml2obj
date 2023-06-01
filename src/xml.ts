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
    isStart: boolean;
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
                const textNode = textStart !== -1 && this.subStr(textStart, textEnd);
                const tag = this.parseTag();
                if (tag.isStart) {
                    if (textNode) {
                        appendToParent(textNode);
                    }
                    const node = this.xmlNodeBuild(tag);
                    nodeStack.push(node);
                    curNode = node;
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
                        // curNode.text = this.subStr(textStart, textEnd);
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
        const isStart = this.xml[this.pos] !== slash;
        let start = isStart ? this.pos : this.pos + 1;
        const len = this.xml.length;
        const attributes: Record<string, string> = {};
        let tagName = '';
        while (this.pos < len) {
            const char = this.char();
            if (isSpace(char) || char === closeBracket) {
                this.pos--;
                tagName = this.subStr(start, this.pos);
                break;
            }
        }
        let attrName = '';
        while (this.pos < len) {
            const char = this.char();
            if (char === closeBracket) break;
            if (char === singleQuote || char === doubleQuote) {
                const start = this.pos;
                while (this.pos < len && this.char() !== char);
                if (attrName) {
                    attributes[attrName] = this.subStr(start, this.pos - 1);
                }
            } else if (!isNameSpacer(char)) {
                const start = this.pos - 1;
                while (this.pos < len && !isNameSpacer(this.char()));
                attrName = this.subStr(start, this.pos - 1);
            }
        }

        const tag: ITag = {
            tagName,
            attributes,
            isStart,
        };
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
        return {
            tagName: tag.tagName,
            attributes: tag.attributes,
            children: [],
        };
    }
}