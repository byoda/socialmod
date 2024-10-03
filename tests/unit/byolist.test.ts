/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';

import ByoList from './../../src/lib/list';
import { iByoList } from './../../src/lib/list';
// import { socialNetworks } from '../../src/lib/datatypes';
import { SocialNetwork } from '../../src/lib/datatypes';

const TestList: string = 'https://byomod.org/lists/dathes.yaml';
const TestFile: string = 'tests/collateral/content-moderation.yaml';
interface Dictionary<T> {
    [key: string]: T
};

const socialNetworks: Dictionary<SocialNetwork> = {
    'x.com': new SocialNetwork('Twitter', 'x.com'),
    'youtube.com': new SocialNetwork('YouTube', 'youtube.com'),
    'facebook.com': new SocialNetwork('Facebook', 'facebook.com'),
    'instagram.com': new SocialNetwork('Instagram', 'instagram.com')
};

describe(
    'testing ByoList class', () => {
        test(
            'should return a ByoList', () => {
                const byo_list = new ByoList(
                    socialNetworks['Twitter'], TestList
                );
                expect(byo_list).toBeInstanceOf(ByoList);
            }
        );
        test(
            'should load ByoList from file', () => {
                const byo_list = new ByoList(
                    socialNetworks['Twitter'], TestList
                );
                expect(byo_list).toBeInstanceOf(ByoList);
                let data: iByoList = byo_list.from_file(TestFile);
                expect(data.block_list).toHaveLength(992);
            }
        );
        test(
            'should download ByoList from the network', async () => {
                const byo_list = new ByoList(
                    socialNetworks['Twitter'], TestList
                );
                expect(byo_list).toBeInstanceOf(ByoList);
                await byo_list.download();
                expect(byo_list.list).toBeDefined();
                expect(byo_list.list!.block_list).toHaveLength(992);
            }
        );

    }
);