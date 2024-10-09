import ByoList from './list';

export default async function load_all_lists(lists: string[]): Promise<Map<string, ByoList>> {

    let all_lists: Map<string, ByoList> = new Map<string, ByoList>();
    for (let mod_list of lists) {
        console.log('Reading URL: ', mod_list);
        let byo_list: ByoList = new ByoList(mod_list);
        await byo_list.initialize();
        all_lists.set(mod_list, byo_list);
    }
    return all_lists;
}