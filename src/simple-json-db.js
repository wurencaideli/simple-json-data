/**
 * 简单的json数据库，数据必须以数组存在，适用于小量数据
 */
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';

export class SimpleJsonDb {
    #idField = 'id__local__';
    #listFidld = 'list__local__';
    jsonPath = '';
    config = {};
    isError = false;
    constructor(jsonPath, config) {
        this.jsonPath = jsonPath;
        this.config = Object.assign({}, config);
        this.config[this.#idField] = {
            default: () => {
                return uuidv4();
            },
        };
        this[this.#listFidld] = [];
    }
    /** 深度复制一个对象 */
    deepCopy(data) {
        return JSON.parse(JSON.stringify(data));
    }
    /** 按照配置格式化一个实例数据 */
    completionData(data) {
        const data_ = {};
        const configKeys = Object.keys(this.config);
        configKeys.forEach((key) => {
            if (data.hasOwnProperty(key) && data[key] !== undefined) {
                data_[key] = data[key];
                return;
            }
            const config = this.config[key];
            if (typeof config.default == 'function') {
                data_[key] = config.default();
            } else {
                data_[key] = config.default;
            }
        });
        return data_;
    }
    /** 从本地提取数据 */
    async init() {
        try {
            const listContent = await fs.readFile(this.jsonPath, 'utf8');
            const list = JSON.parse(listContent);
            if (!Array.isArray(list)) {
                throw 'data is not an array json string.';
            }
            list = list.map((item) => {
                return this.completionData(item);
            });
            this[this.#listFidld] = list;
            this.isError = false;
        } catch (error) {
            this.isError = true;
            throw error;
        }
    }
    /** 写入文件 */
    async save() {
        if (this.isError) {
            throw 'The instance data is corrupted';
        }
        return fs.writeFile(this.jsonPath, JSON.stringify(this[this.#listFidld], null, 2), 'utf8');
    }
    /** 返回数据列表，可外部传入过滤函数进行筛选 */
    list(fn) {
        if (typeof fn !== 'function') {
            const list = this.deepCopy(this[this.#listFidld]);
            return list;
        } else {
            const list = this.deepCopy(
                this[this.#listFidld].filter((item) => {
                    return fn(item);
                }),
            );
            return list;
        }
    }
    /** 是否含有某个实例 */
    has(fn) {
        if (typeof fn !== 'function') return;
        const target = this[this.#listFidld].find((item) => {
            return fn(item);
        });
        return !!target;
    }
    /** 查找单个实例 */
    find(fn) {
        if (typeof fn !== 'function') return;
        const target = this[this.#listFidld].find((item) => {
            return fn(item);
        });
        return target ? this.deepCopy(target) : undefined;
    }
    /** 统计 */
    count(fn) {
        if (typeof fn !== 'function') return this[this.#listFidld].length;
        return this[this.#listFidld].filter((item) => {
            return fn(item);
        }).length;
    }
    /** 删除第一个 */
    shift() {
        const target = this[this.#listFidld].shift();
        return target ? this.deepCopy(target) : undefined;
    }
    /** 删除最后一个 */
    pop() {
        const target = this[this.#listFidld].pop();
        return target ? this.deepCopy(target) : undefined;
    }
    /** 内部排序 */
    sort(fn) {
        if (typeof fn !== 'function') return;
        return this.deepCopy(this[this.#listFidld].sort(fn));
    }
    /** 直接写入新的list */
    setList(list) {
        list = list.map((item) => {
            return this.completionData(item);
        });
        this[this.#listFidld] = list;
    }
    /** 数据清理，外部调用清理一些不需要的数据 */
    clear(fn) {
        if (typeof fn !== 'function') return;
        this[this.#listFidld] = this[this.#listFidld].filter((item) => {
            return fn(item);
        });
    }
    /** 添加一个数据 */
    add(data) {
        if (this[this.#listFidld].find((item) => item[this.#idField] === data[this.#idField])) {
            throw 'ERROR: Repeating Instances';
        }
        data = this.completionData(data);
        data = this.deepCopy(data);
        this[this.#listFidld].push(data);
    }
    /** 更新一个数据 */
    update(instance, data) {
        let target = this[this.#listFidld].find(
            (item) => item[this.#idField] == instance[this.#idField],
        );
        if (!target) {
            throw '修改失败: No corresponding instance found';
        }
        Object.keys(target).forEach((key) => {
            if (key === this.#idField) return;
            if (!this.config.hasOwnProperty(key)) return;
            if (data.hasOwnProperty(key) && data[key] !== undefined) {
                target[key] = data[key];
            }
        });
        return this.deepCopy(target);
    }
    /** 删除个体，参数是实例 || [实例] */
    delete(instance) {
        if (!Array.isArray(instance)) {
            instance = [instance];
        }
        const signMap = {};
        instance.forEach((item) => {
            signMap[item[this.#idField]] = true;
        });
        this[this.#listFidld] = this[this.#listFidld].filter((item) => {
            return !signMap[item[this.#idField]];
        });
    }
}
