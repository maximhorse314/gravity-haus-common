import { Model } from 'sequelize-typescript';

import Audit from '../models/audit.model';

export const createAudit = async (instance: Model<any>): Promise<Audit> => {
  return Audit.create({
    modelName: instance.constructor.name,
    modelId: instance.id,
    // @ts-ignore
    values: JSON.stringify(instance._previousDataValues),
    // @ts-ignore
    changedValues: JSON.stringify(instance._changed),
  });
};



export const getAudits = async (modelName: string, modelId: number): Promise<Audit[]> => {
  return Audit.findAll({
    where: {
      modelName,
      modelId,
    },
  });
};
