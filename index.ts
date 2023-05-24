import { IParserOptions } from "./interface";

function getDefaultOptions(): IParserOptions {
    return {
        callback: undefined,
        callbackFilter: undefined,
        ignoreNamespacing: false
    };
}
type NodeCallbackFunc = IParserOptions["callback"];

export class XmlParser {
    private cb: NodeCallbackFunc;
    private nodeFilter: Set<string>;
    private pos: number;

    constructor(private readonly options?: IParserOptions) {}

    public parse(xml: string): string {
        this.reset(this.options);
        

        return xml;
    }

    private reset(options: IParserOptions = getDefaultOptions()) {
        this.cb = options.callback;
        if (options.callbackFilter) {
            this.nodeFilter = new Set(options.callbackFilter);
        }
        this.pos = options.offset || 0;
    }
}