import { v4 as createUId } from 'uuid';
import { promises as fs } from 'fs';

import { completionData, SerialQueue, deepCopy } from './common.js';

export type Config = {
    idKey?: string;
};
/**
 * 简单的json数据库，数据必须以数组存在，适用于小量数据
 * 数据都是读取到内存中作为缓存操作，读写速度较快，又外部操作写入文件
 * 外部获取都是复制的，防止数据在未知情况下窜改
 */
export class SimpleJsonData {
    jsonPath = '';
    keyConfig: any = {};
    isError = false;
    isInitialized = false;
    queueInstance: SerialQueue;
    #list: any = [];
    #idKey: string = 'id__local__';
    constructor(jsonPath: string, keyConfig: any, config?: Config) {
        if (config?.idKey) {
            this.#idKey = config.idKey;
        }
        this.queueInstance = new SerialQueue();
        this.jsonPath = jsonPath;
        this.keyConfig = Object.assign({}, keyConfig);
        this.keyConfig[this.#idKey] = {
            default: () => {
                return createUId();
            },
        };
    }
    /** 从本地提取数据 */
    async init() {
        const taskRes = await this.queueInstance.push(async () => {
            try {
                let list: any = [];
                const fileExists = await fs
                    .access(this.jsonPath)
                    .then(() => true)
                    .catch(() => false);
                if (!fileExists) {
                    await fs.writeFile(this.jsonPath, '[]', 'utf8');
                    list = [];
                } else {
                    const listContent = await fs
                        .readFile(this.jsonPath, 'utf8')
                        .then((c) => c.trim());
                    if (listContent === '') {
                        await fs.writeFile(this.jsonPath, '[]', 'utf8');
                        list = [];
                    } else {
                        list = JSON.parse(listContent);
                        if (!Array.isArray(list)) {
                            throw 'ERROR: Data is not an array json string.';
                        }
                        list = list.map((item) => {
                            return completionData(item, this.keyConfig);
                        });
                    }
                }
                this.#list = list;
                this.isError = false;
                this.isInitialized = true;
                return deepCopy(list);
            } catch (error) {
                this.isError = true;
                throw error;
            }
        });
        return taskRes;
    }
    /** 写入文件，由外部手动操作写入 */
    async save() {
        const taskRes = await this.queueInstance.push(async () => {
            if (!this.isInitialized) {
                throw 'ERROR: Instance data is not initialized';
            }
            if (this.isError) {
                throw 'ERROR: The instance data is corrupted';
            }
            return fs.writeFile(this.jsonPath, JSON.stringify(this.#list, null, 2), 'utf8');
        });
        return taskRes;
    }
    /** 返回数据列表 */
    list() {
        const list = this.#list;
        return deepCopy(list);
    }
    /** 查找单个实例 */
    find(fn?: any) {
        if (typeof fn !== 'function') return;
        const list = this.list();
        return list.find(fn);
    }
    /** 统计 */
    count(fn?: any): number {
        if (typeof fn !== 'function') return this.#list.length;
        const list = this.list();
        return list.filter(fn).length;
    }
    /** 删除第一个 */
    shift() {
        const target = this.#list.shift();
        return target ? deepCopy(target) : undefined;
    }
    /** 删除最后一个 */
    pop() {
        const target = this.#list.pop();
        return target ? deepCopy(target) : undefined;
    }
    /** 直接写入新的list */
    setList(list: any) {
        list = list.map((item: any) => {
            return completionData(item, this.keyConfig);
        });
        this.#list = deepCopy(list);
    }
    /** 数据过滤 */
    filter(fn: any) {
        if (typeof fn !== 'function') return;
        const list = this.list();
        return list.filter(fn);
    }
    /** 添加一个数据 */
    add(data: any) {
        if (this.#list.find((item: any) => item[this.#idKey] === data[this.#idKey])) {
            throw 'ERROR: Repeating Instances';
        }
        data = completionData(data, this.keyConfig);
        data = deepCopy(data);
        this.#list.push(data);
    }
    /** 更新一个数据 */
    update(instance: any, data: any) {
        const target = this.#list.find((item: any) => item[this.#idKey] == instance[this.#idKey]);
        if (!target) {
            throw 'ERROR: No corresponding instance found';
        }
        Object.keys(target).forEach((key) => {
            if (key === this.#idKey) return;
            if (!this.keyConfig.hasOwnProperty(key)) return;
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
            signMap[item[this.#idKey]] = true;
        });
        this.#list = this.#list.filter((item: any) => {
            return !signMap[item[this.#idKey]];
        });
    }
}
