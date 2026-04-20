import { SerialQueue } from './common.js';
export type Config = {
    idKey?: string;
};
/**
 * 简单的json数据库，数据必须以数组存在，适用于小量数据
 * 数据都是读取到内存中作为缓存操作，读写速度较快，又外部操作写入文件
 * 外部获取都是复制的，防止数据在未知情况下窜改
 */
export declare class SimpleJsonData {
    #private;
    jsonPath: string;
    keyConfig: any;
    isError: boolean;
    isInitialized: boolean;
    queueInstance: SerialQueue;
    constructor(jsonPath: string, keyConfig: any, config?: Config);
    /** 从本地提取数据 */
    init(): Promise<unknown>;
    /** 写入文件，由外部手动操作写入 */
    save(): Promise<unknown>;
    /** 返回数据列表 */
    list(): any;
    /** 查找单个实例 */
    find(fn?: any): any;
    /** 统计 */
    count(fn?: any): number;
    /** 删除第一个 */
    shift(): any;
    /** 删除最后一个 */
    pop(): any;
    /** 直接写入新的list */
    setList(list: any): void;
    /** 数据过滤 */
    filter(fn: any): any;
    /** 添加一个数据 */
    add(data: any): void;
    /** 更新一个数据 */
    update(instance: any, data: any): any;
    /** 删除个体，参数是实例 || [实例] */
    delete(instance: any): void;
}
