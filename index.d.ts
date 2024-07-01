declare module "sneakerlib" {
    // Functions
    export function initialRender(Component: any, parent: string): Promise<void>;
    export function initHtml(component: string): Promise<string>;
    export function initRender(html: string, parent: string): void;
    export function render(Component: any, parent: string, state?: {}): Promise<void>;
    export function initCss(script: string): Promise<void>;
    export function DOMLoaded(init: () => void): void;
    export function bindButton(button: string, action: () => void): void;
    export function setInput(InputBind: any): void;
    export function enableRoutes(routes: {[key: string]: any}, executeRoutes: () => void): void;
    export function emit(e: string, data: any): void;
    export function receive(e: string, action: (data: any) => void): void;
    export function populateTable(table: string, tableData: any[], action?: (data: any) => void): void;
    export function uuid(): string;
    export function asLocalStorage(initial: any, name?: string): any;
    export function write(text: string, id: string): void;
    export function read(id: string): string;
    export function renderEach(options: {
        data: any[];
        attach: string;
        elem?: string;
        style?: string | null;
        subElem?: string;
        action?: (data: any) => void;
    }): void;
    export function bindInputs(object: {
        [key: string]: any;
    }): void;
    export function values(object: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
    export function validate(inputObj: {
        [key: string]: string;
    }, pwRegex?: RegExp, pwKey?: string, emailKey?: string): boolean;
    export function applyStyles(...styles: string[]): string;
    export function navigate(url: string, state?: {[key: string]: any}): void
    export function getNavigateState(): any;

    // Utility methods
    export function capitalize(str: string): string;
    export function flatten(arr: any[]): any[];
    export function formatDate(date: Date, format: string): string;
    export function formatCurrency(number: number, currency?: string): string;
    export function roundDecimals(number: number, decimal: number): number;
    export function isEmpty(obj: any): boolean;
    export function mergeObjects(obj1: any, obj2: any): any;
    export let pagMin: number;
    export let pagMax: number;
    export function initializePaginator(min: number, max: number): void;
    export function paginatorNext(amountOfEntries: number, arrayLength: number, action: (data: any) => void): void;
    export function paginatorBack(amountOfEntries: number, action: (data: any) => void): void;
    export function multiRender(Component: any, parent: string, list: any[]): Promise<void>
    export function multiRenderWriteText(state: any, id: string): void
    export function multiRenderWriteImageSrc(state: any, id: string): void
    export function writeImgSrc(src: string, id: string): void

    export class TheComponent {
        constructor();
        name: string;
        title: string;
        state: {};
        init(): Promise<void>;
        bindMethods(): void;
    }

    export class TheService {
        constructor();
        bindMethods(): void;
    }

    export class Examinable {
        constructor(value?: any);
        sneak(extend: any, error?: any): () => void;
        notify(): void;
        fetch(url: string, options?: any): Promise<void>;
        socket(url: string, onClose?: any, onOpen?: any): void;
        enter(newValue: any): void;
    }

    export class InputBind {
        constructor(elem: string);
        clear(): void;
        value: any;
        elem: string;
    }
}