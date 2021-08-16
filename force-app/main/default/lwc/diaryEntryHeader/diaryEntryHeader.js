import { LightningElement } from 'lwc';
import DiaryEntryResources from '@salesforce/resourceUrl/diaryEntryResources';

export default class DiaryEntryHeader extends LightningElement {
    diaryEntryLogo = DiaryEntryResources + '/diarydory-logo.png';
}