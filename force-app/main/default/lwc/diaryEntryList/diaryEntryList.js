import { LightningElement, wire, api } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getDiaryEntryList from '@salesforce/apex/DiaryEntryController.getDiaryEntry';
import CREATED_DATE_FIELD from '@salesforce/schema/Diary_Entry__c.CreatedDate';
import DETAIL_FIELD from '@salesforce/schema/Diary_Entry__c.Detail__c';
import ID_FIELD from '@salesforce/schema/Diary_Entry__c.Id';

const COLS = [
    { label: 'Created Date', fieldName: 'CreatedDate'},
    { label: 'Notes', fieldName: 'Detail__c', editable: true}
]

export default class DiaryEntryList extends LightningElement {
    @api userid;
    columns = COLS;
    diaryEntryList;
    wiredDiaryEntryList;
    draftValues = [];
    error;

    @wire(getDiaryEntryList, {userId: '$userid'})
    loadDiaryEntries(result) {
        console.log('Result: ', result);
        this.wiredDiaryEntryList = result;

        if(result.data) {
            this.diaryEntryList = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.diaryEntryList = [];
        }
    }


    handleSave(event) {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[CREATED_DATE_FIELD.fieldApiName] = event.detail.draftValues[0].CreatedDate;
        fields[DETAIL_FIELD.fieldApiName] = event.detail.draftValues[0].Detail__c;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            console.log('Saved!');
            return refreshApex(this.wiredDiaryEntryList).then(() => {
                this.draftValues = [];
            });
        })
        .catch(error => {
            this.error = error;
        })
    }
}