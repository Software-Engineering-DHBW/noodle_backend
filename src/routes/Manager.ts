import { getManager, EntityManager } from 'typeorm';

/**
 * @exports
 * @async
 * Saves or overwrites an object in the Repository
 * @param {object} object - The object to be saved
 * @param {Function} objectType - Repository where the object should be saved
 */
export const saveObject = async (obj: object, objectType: Function) => {
  await getManager().transaction(async (transactionManager) => {
    const classObject = transactionManager.create(objectType, obj);
    await transactionManager.save(classObject);
  });
};

/**
 * @exports
 * @async
 * Returns one object that meets the conditions
 * @param {object} findOptions - Repository with the object
 * @param {Function} objectType - SQL statement to identify the objects
 * @returns {Promise<object>} - Returns the objects that was found
 */
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

/**
 * @exports
 * @async
 * Returns any object that meets the conditions
 * @param {object} findOptions - Repository with the objects
 * @param {Function} objectType - SQL statement to identify the objects
 * @returns {Promise<object[]>} - Returns the list of objects that where found
 */
export const getObjects = async (
  findOptions: object,
  objectType: Function,
): Promise<object[]> => {
  const manager: EntityManager = getManager();
  return manager.find(objectType, findOptions);
};

/**
 * @exports
 * @async
 * Deletes objects in the given Repository
 * @param {object} findOptions - Repository with the objects to be deleted
 * @param {Function} objectType - SQL statement to identify those to be deleted
 */
export const deleteObjects = async (
  findOptions: object,
  objectType: Function,
) => {
  await getManager().transaction(async (transactionManager) => {
    await transactionManager.delete(objectType, findOptions);
  });
};
