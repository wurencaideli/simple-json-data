import { SimpleJsonData } from './dist/simple-json-data.esm.js';

const instance = new SimpleJsonData('./demo-data.json', {
    idU: {
        default: '',
    },
    content: {
        default: '',
    },
});
async function start() {
    console.log(instance);
    await instance.init();
    console.log(
        instance.list({
            page: 1,
            size: 3,
            filterFn(item) {
                return item.idU == 'true';
            },
            fuseOptions: {
                keys: ['content'],
            },
            searchBy: '4',
            sortBy: [{ asc: (u) => u.content }],
        }),
    );
    instance.add({
        id: 123123,
        content: '456',
    });
    await instance.save();
}
start();
