import { Response } from 'express';
import File from '../entity/File';
import ModuleItem from '../entity/ModuleItem';
import { moduleItem } from './Module';

// interface ModuleItem {
//     id?: number;
//     moduleId?: number;
//     content?: string;
//     webLink?: string;
//     downloadableFile?: File;
//     hasFileUpload: boolean;
//     uploadedFiles?: File[];
//     isVisible: boolean;
//   }

const createModuleItem = async (data: RegisterModuleItem) => {

};

const createFile = async (data: RegisterFile) => {

};

const saveNewModuleItem = async (moduleItem:ModuleItem, file: File, res: Response) => {

};

export const addItem = (data: moduleItem, res: Response) => {

};
