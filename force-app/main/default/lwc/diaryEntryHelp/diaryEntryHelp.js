import { LightningElement } from 'lwc';
import DiaryEntryResources from '@salesforce/resourceUrl/diaryEntryResources';

export default class DiaryEntryHelp extends LightningElement {
    helpVideoUrl = DiaryEntryResources + '/diaryDory-demo.mp4';
}