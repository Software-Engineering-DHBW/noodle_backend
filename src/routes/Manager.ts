import { getManager, EntityManager } from 'typeorm';

export const saveObject = async (obj: object, objectType: Function) => {
  const manager: EntityManager = getManager();
  const classObject = manager.create(objectType, obj);
  await manager.save(classObject);
};

export const getOneObject = async (
  findOptions: object,
  objectType: Function,
): Promise<object> => {
  const hasNull: boolean = Object.values(findOptions)
    .every((x) => x === null || x === '' || x === undefined);
  if (hasNull) {
    throw new Error('Search object undefined');
  }
  const manager: EntityManager = getManager();
  return manager.findOneOrFail(objectType, findOptions);
};

export const getObjects = async (
  findOptions: object,
  objectType: Function,
): Promise<object[]> => {
  const manager: EntityManager = getManager();
  return manager.find(objectType, findOptions);
};

export const deleteObjects = async (
  findOptions: object,
  objectType: Function,
) => {
  const manager: EntityManager = getManager();
  manager.delete(objectType, findOptions);
};
