
export function last<T extends any>(list: T[]): T {
    return list[list.length - 1];
}

export function isLetter(char: string): boolean {
    const num = char.charCodeAt(0);
    return (num >= 65 && num <= 90) || (num >= 97 && num <= 122);
}

export function isNum(char: string): boolean {
    return char >= '0' && char <= '9';
}

export function isSpace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
}

export function isNameSpacer(char: string): boolean {
    return isSpace(char) || char === '>' || char === '/' || char === '=' || char === '?';
}