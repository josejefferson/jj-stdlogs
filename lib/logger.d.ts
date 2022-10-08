declare class Logger {
    date: Date;
    lastUpdate: Date;
    length: number;
    content: string;
    pendingLogContent: string;
    preview: string;
    previewDone: boolean;
    createdOnDB: boolean;
    constructor();
    append(str: string): void;
    makePreview(str: string): void;
    sendToServer(): Promise<void>;
}
export declare const logger: Logger;
export {};
