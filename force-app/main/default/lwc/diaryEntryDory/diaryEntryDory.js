import { LightningElement } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import DiaryEntryResources from '@salesforce/resourceUrl/diaryEntryResources';

export default class DiaryEntryDory extends LightningElement {
    loggedIn = (USER_ID != null);
    doryPic = DiaryEntryResources + '/diaryDoryPic.jpg';
}