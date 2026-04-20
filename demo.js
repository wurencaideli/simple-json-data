import { SimpleJsonData } from './dist/simple-json-data.esm.js';

const instance = new SimpleJsonData(
    './demo-data.json',
    {
        idU: {
            default: '',
        },
        content: {
            default: '',
        },
    },
    {
        idKey: 'id__local__',
    },
);
async function start() {
    console.log(instance);
    await instance.init();
    console.log(instance.list());
    instance.add({
        id: 123123,
        content: '456123',
    });
    await instance.save();
    // instance.find(()=>true);
    // instance.filter(()=>true);
    // instance.count();
    // instance.shift();
    // instance.pop();
    // instance.setList([]);
    // instance.update({id__local__:'123});
    // instance.delete({id__local__:'123});
}
start();
