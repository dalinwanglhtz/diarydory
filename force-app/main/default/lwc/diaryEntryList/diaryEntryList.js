import { LightningElement, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import USER_ID from '@salesforce/user/Id';
import getDiaryEntryList from '@salesforce/apex/DiaryEntryController.getDiaryEntry';
import deleteDiaryEntry from '@salesforce/apex/DiaryEntryController.deleteDiaryEntry';
import CREATED_DATE_FIELD from '@salesforce/schema/Diary_Entry__c.CreatedDate';
import DETAIL_FIELD from '@salesforce/schema/Diary_Entry__c.Detail__c';
import ID_FIELD from '@salesforce/schema/Diary_Entry__c.Id';
import {
    publish,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import interDomChannel from '@salesforce/messageChannel/InterDomMessageChannel__c';

const actions = [
    { label: 'Show Details', name: 'show_details'},
    { label: 'Delete', name: 'delete' }
];

const COLS = [
    { label: 'Notes', fieldName: 'Detail__c', editable: true},
    { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'auto' } }
]

export default class DiaryEntryList extends LightningElement {
    userid = USER_ID;
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


    @wire(MessageContext)
    messageContext;

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

    handleDeleteRow(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        console.log('Selected row: ', row);
        switch (action.name) {
            case 'show_details':
                publish(this.messageContext, interDomChannel, { rowData: row });
                break;
            case 'delete':
                deleteDiaryEntry({rowId: row.Id});
                location.reload();
                break;
        }
    }
}