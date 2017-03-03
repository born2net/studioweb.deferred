import {BlockTypeEnum} from "./BlockTypeEnum";

export interface IAddContents {
    id: any;
    type:BlockTypeEnum;
    name: string;
    allow: boolean;
    fa: string;
    description: string;
    data?: any;
    size?:string;
    specialJsonItemName?: string;
    specialJsonItemColor?: string;
}