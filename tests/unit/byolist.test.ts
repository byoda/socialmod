/**
 * @jest-environment jsdom
 */

import ByoList from './../../src/lib/list';
import { socialNetworks } from '../../src/lib/datatypes';

const TestList: string = 'https://byomod.org/lists/dathes.yaml';
const TestFile: string = 'tests/collateral/content-moderation.yaml';
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
                byo_list.from_file(TestFile);
                expect(byo_list).toBeInstanceOf(ByoList);
                expect(byo_list.list?.block_list).toHaveLength(2);
            }
        );

    }
);