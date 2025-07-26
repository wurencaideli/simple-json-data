export declare class SimpleScrollTo {
    #private;
    target: any;
    isX: boolean;
    start: number;
    end: number;
    distance: number;
    duration: number;
    animation: any;
    taskNumber: any;
    callback: any;
    constructor(option: any);
    /** 开始滚动 */
    scrollTo(): void;
    cancel(): void;
}
