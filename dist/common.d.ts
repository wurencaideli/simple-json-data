/** 按照配置格式化一个实例数据 */
export declare function completionData(data: any, config: any): any;
/** 创建任务队列 */
export declare class SerialQueue {
    promise: any;
    constructor();
    /**
     * 添加异步任务，返回该任务的完成 Promise
     */
    push(fn: any): Promise<unknown>;
}
/** 深度复制一个对象 */
export declare function deepCopy(data: any): any;
