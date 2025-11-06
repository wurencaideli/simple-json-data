/**
 * 简单的json数据库，数据必须以数组存在，适用于小量数据
 */
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import Fuse from 'fuse.js';
import { sort } from 'fast-sort';
type SearchOption = {
    page: number;
    size: number;
    sortBy?: any;
    searchBy?: any;
    fuseOptions?: any;
    filterFn?: any;
};
/** 深度复制一个对象 */
function deepCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
}
/** 按照配置格式化一个实例数据 */
function completionData(data: any, config: any) {
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

export class SimpleJsonData {
    jsonPath = '';
    config: any = {};
    isError = false;
    isInited = false;
    #list__local__: any = [];
    constructor(jsonPath: string, config: any) {
        this.jsonPath = jsonPath;
        this.config = Object.assign({}, config);
        this.config['id__local__'] = {
            default: () => {
                return uuidv4();
            },
        };
    }
    /** 从本地提取数据 */
    async init() {
        try {
            const listContent = await fs.readFile(this.jsonPath, 'utf8');
            let list: any = JSON.parse(listContent);
            if (!Array.isArray(list)) {
                throw 'data is not an array json string.';
            }
            list = list.map((item) => {
                return completionData(item, this.config);
            });
            this.#list__local__ = list;
            this.isError = false;
            this.isInited = true;
        } catch (error) {
            this.isError = true;
            throw error;
        }
    }
    /** 写入文件 */
    async save() {
        if (!this.isInited) {
            throw 'Instance data is not initialized';
        }
        if (this.isError) {
            throw 'The instance data is corrupted';
        }
        return fs.writeFile(this.jsonPath, JSON.stringify(this.#list__local__, null, 2), 'utf8');
    }
    /** 返回数据列表，可外部传入参数进行筛选 */
    list(optios: SearchOption) {
        optios = optios || {};
        const page = optios.page || 1;
        const size = optios.size || 15;
        const filterFn = optios.filterFn;
        const sortBy = optios.sortBy;
        const searchBy = optios.searchBy;
        const fuseOptions = optios.fuseOptions;
        let list = this.#list__local__;
        let star = (page - 1) * size;
        let end = star + size;
        // 优先手动过滤
        if (filterFn) {
            list = list.filter((item: any) => {
                return filterFn(item);
            });
        }
        if (
            (typeof searchBy === 'object' && Object.keys(searchBy).length > 0) ||
            (searchBy && typeof searchBy === 'string')
        ) {
            const fuse = new Fuse(list, fuseOptions);
            list = fuse.search(searchBy).map((item) => item.item);
        }
        /** 然后进行排序 */
        if (sortBy && sortBy.length >= 1) {
            list = sort(list).by(sortBy);
        }
        return {
            list: deepCopy(list.slice(star, end)),
            total: list.length,
            page,
            size,
        };
    }
    /** 查找单个实例 */
    find(fn?: any) {
        if (typeof fn !== 'function') return;
        const target = this.#list__local__.find((item: any) => {
            return fn(item);
        });
        return target ? deepCopy(target) : undefined;
    }
    /** 统计 */
    count(fn?: any): number {
        if (typeof fn !== 'function') return this.#list__local__.length;
        return this.#list__local__.filter((item: any) => {
            return fn(item);
        }).length;
    }
    /** 删除第一个 */
    shift() {
        const target = this.#list__local__.shift();
        return target ? deepCopy(target) : undefined;
    }
    /** 删除最后一个 */
    pop() {
        const target = this.#list__local__.pop();
        return target ? deepCopy(target) : undefined;
    }
    /** 内部排序 */
    sort(fn: any) {
        if (typeof fn !== 'function') return;
        return deepCopy(this.#list__local__.sort(fn));
    }
    /** 直接写入新的list */
    setList(list: any) {
        list = list.map((item: any) => {
            return completionData(item, this.config);
        });
        this.#list__local__ = deepCopy(list);
    }
    /** 数据过滤 */
    filter(fn: any) {
        if (typeof fn !== 'function') return;
        return deepCopy(
            this.#list__local__.filter((item: any) => {
                return fn(item);
            }),
        );
    }
    /** 添加一个数据 */
    add(data: any) {
        if (this.#list__local__.find((item: any) => item.id__local__ === data.id__local__)) {
            throw 'ERROR: Repeating Instances';
        }
        data = completionData(data, this.config);
        data = deepCopy(data);
        this.#list__local__.push(data);
    }
    /** 更新一个数据 */
    update(instance: any, data: any) {
        let target = this.#list__local__.find(
            (item: any) => item.id__local__ == instance.id__local__,
        );
        if (!target) {
            throw 'ERROR: No corresponding instance found';
        }
        Object.keys(target).forEach((key) => {
            if (key === 'id__local__') return;
            if (!this.config.hasOwnProperty(key)) return;
            if (data.hasOwnProperty(key) && data[key] !== undefined) {
                target[key] = data[key];
            }
        });
        return deepCopy(target);
    }
    /** 删除个体，参数是实例 || [实例] */
    delete(instance: any) {
        if (!Array.isArray(instance)) {
            instance = [instance];
        }
        const signMap: any = {};
        instance.forEach((item: any) => {
            signMap[item.id__local__] = true;
        });
        this.#list__local__ = this.#list__local__.filter((item: any) => {
            return !signMap[item.id__local__];
        });
    }
}
