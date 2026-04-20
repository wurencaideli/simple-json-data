/** 按照配置格式化一个实例数据 */
export function completionData(data: any, config: any) {
    const data_: any = {};
    const configKeys = Object.keys(config);
    configKeys.forEach((key) => {
        if (data.hasOwnProperty(key) && data[key] !== undefined) {
            data_[key] = data[key];
            return;
        }
        const keyConfig = config[key];
        if (typeof keyConfig.default == 'function') {
            data_[key] = keyConfig.default();
        } else {
            data_[key] = keyConfig.default;
        }
    });
    return data_;
}

/** 创建任务队列 */
export class SerialQueue {
    promise: any;
    constructor() {
        this.promise = Promise.resolve();
    }
    /**
     * 添加异步任务，返回该任务的完成 Promise
     */
    push(fn: any) {
        return new Promise((resolve, reject) => {
            this.promise = this.promise.then(fn).then(resolve).catch(reject);
        });
    }
}

/** 深度复制一个对象 */
export function deepCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
}
