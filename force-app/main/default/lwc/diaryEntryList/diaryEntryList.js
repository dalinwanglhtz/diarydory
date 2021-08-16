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
    { label: 'Edit', name: 'edit'},
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
    isLoading = false;

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
        this.isLoading = true;
        const fields = {};
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[CREATED_DATE_FIELD.fieldApiName] = event.detail.draftValues[0].CreatedDate;
        fields[DETAIL_FIELD.fieldApiName] = event.detail.draftValues[0].Detail__c;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            console.log('Saved!');
            this.isLoading = false;
            return refreshApex(this.wiredDiaryEntryList).then(() => {
                this.draftValues = [];
            });
        })
        .catch(error => {
            this.error = error;
            this.isLoading = false;
        })
    }

    handleDeleteRow(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        console.log('Selected row: ', row);
        switch (action.name) {
            case 'edit':
                publish(this.messageContext, interDomChannel, { rowData: row });
                break;
            case 'delete':
                deleteDiaryEntry({rowId: row.Id});
                location.reload();
                break;
        }
    }

    handleDeleteSelected() {
        let selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
        console.log('Rows selected: ', selectedRows);
        selectedRows.forEach(element => {
            deleteDiaryEntry({rowId: element.Id});
        });
        location.reload();
    }
}