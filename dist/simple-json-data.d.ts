type SearchOption = {
    page: number;
    size: number;
    sortBy?: any;
    searchBy?: any;
    fuseOptions?: any;
    filterFn?: any;
};
export declare class SimpleJsonData {
    #private;
    jsonPath: string;
    config: any;
    isError: boolean;
    isInited: boolean;
    constructor(jsonPath: string, config: any);
    /** 从本地提取数据 */
    init(): Promise<void>;
    /** 写入文件 */
    save(): Promise<void>;
    /** 返回数据列表，可外部传入参数进行筛选 */
    list(optios: SearchOption): {
        list: any;
        total: any;
        page: number;
        size: number;
    };
    /** 查找单个实例 */
    find(fn?: any): any;
    /** 统计 */
    count(fn?: any): number;
    /** 删除第一个 */
    shift(): any;
    /** 删除最后一个 */
    pop(): any;
    /** 内部排序 */
    sort(fn: any): any;
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
export {};
