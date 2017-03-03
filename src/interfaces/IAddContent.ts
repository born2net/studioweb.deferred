import {BlockTypeEnum} from "./BlockTypeEnum";

export interface IAddContents {
    resourceId?: number;
    sceneId?:number;
    blockId?:number;
    type:BlockTypeEnum;
    blockCode: number;
    name: string;
    allow: boolean;
    fa: string;
    description: string;
    data?: any;
    size?:string;
    specialJsonItemName?: string;
    specialJsonItemColor?: string;
}