export interface XmlNode {
    attributes: { [key: string]: string };
    cData?: boolean;
    children: (XmlNode | string)[];
    tagName: string;
    text?: string;
}

type ChildrenType<T> = T extends (infer R)[] ? R : T;

export type XmlNodeChildren = ChildrenType<XmlNode['children']>;

export interface IParserOptions {
    /**
     * 遇到节点标签时的回调函数
     * @param start 是否是开始标签
     * @param node xml节点
     */
    callback?: (start: boolean, node: XmlNode) => void;
    /** 需要触发回调函数的节点列表，默认为全部 */
    callbackFilter?: string[];
    /** 忽略节点上的命名空间，如"w:text" => "text"，默认保留命名空间 */
    ignoreNamespacing?: boolean;
    /** 字符串解析偏移量 */
    offset?: number;
}