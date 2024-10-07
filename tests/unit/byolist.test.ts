/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';

import ByoList from './../../src/lib/list';
import { socialNetworks } from '../../src/lib/constants';

const TestList: string = 'https://byomod.org/lists/dathes.yaml';
const TestFile: string = 'tests/collateral/content-moderation.yaml';
interface Dictionary<T> {
    [key: string]: T
};

describe(
    'testing ByoList class', () => {
        test(
            'should return a ByoList', () => {
                const byo_list = new ByoList(
                    socialNetworks['x.com'], TestList
                );
                expect(byo_list).toBeInstanceOf(ByoList);
            }
        );
        test(
            'should load ByoList from file', () => {
                const byo_list = new ByoList(
                    socialNetworks['x.com'], TestList
                );
                expect(byo_list).toBeInstanceOf(ByoList);
                let entries: number = byo_list.from_file(TestFile);
                expect(entries).toBe(992);
                expect(byo_list.list!.block_list).toHaveLength(992);
            }
        );
        // jsdom does not support fetch. This
        // https://github.com/mswjs/jest-fixed-jsdom does but can't get it to
        // work
        // test(
        //     'should download ByoList from the network', async () => {
        //         const byo_list = new ByoList(
        //             socialNetworks['x.com'], TestList
        //         );
        //         expect(byo_list).toBeInstanceOf(ByoList);
        //         await byo_list.download();
        //         expect(byo_list.list).toBeDefined();
        //         expect(byo_list.list!.block_list).toHaveLength(992);
        //     }
        // );
        test(
            'should load ByoList from file and store', async () => {
                const byo_list = new ByoList(
                    socialNetworks['x.com'], TestList
                );
                expect(byo_list).toBeInstanceOf(ByoList);
                let entries: number = byo_list.from_file(TestFile);
                expect(entries).toBe(992);
                expect(byo_list.list!.block_list).toHaveLength(992);
                await byo_list.save(byo_list.list!);
            }
        );
        test(
            'should load ByoList from file and store and retrieve',
            async () => {
                const byo_list = new ByoList(
                    socialNetworks['x.com'], TestList
                );
                expect(byo_list).toBeInstanceOf(ByoList);
                let entries: number = byo_list.from_file(TestFile);
                expect(entries).toBe(992);
                expect(byo_list.list!.block_list).toHaveLength(992);
                await byo_list.save(byo_list.list!);

                const new_list = new ByoList(
                    socialNetworks['x.com'], TestList
                )
                let count: number = await new_list.load();
                expect(count).toBe(992);
                expect(new_list!.list!.block_list).toHaveLength(992);
            }
        );
    }
);