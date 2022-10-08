import { CenterModel, HistoryModel, PeopleModel } from '@beta-titan/shared/database-model'
import { ICenter, IHistory, IPeople } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

export async function writeHistory (log: IHistory) {
    const history = new HistoryModel(log)
    await history.save()
}