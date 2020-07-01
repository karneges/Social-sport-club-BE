import { BaseParamsInterface } from '../../type-models/express.models';

export const convertArrayToObject = <T extends BaseParamsInterface>(array: T[], key: string): { [key: string]: T } => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
}
