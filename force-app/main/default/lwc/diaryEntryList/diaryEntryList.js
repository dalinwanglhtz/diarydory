import { LightningElement, wire, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import USER_ID from '@salesforce/user/Id';
import getDiaryEntryList from '@salesforce/apex/DiaryEntryController.getDiaryEntry';
import CREATED_DATE_FIELD from '@salesforce/schema/Diary_Entry__c.CreatedDate';
import DETAIL_FIELD from '@salesforce/schema/Diary_Entry__c.Detail__c';
import ID_FIELD from '@salesforce/schema/Diary_Entry__c.Id';
import {
    subscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import interDomChannel from '@salesforce/messageChannel/InterDomMessageChannel__c';

const COLS = [
    { label: 'Notes', fieldName: 'Detail__c', editable: true}
]

export default class DiaryEntryList extends LightningElement {
    subscription = null;
    userid = USER_ID;
    columns = COLS;
    @track diaryEntryList;
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

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                interDomChannel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(message) {
        console.log('Received message: ', message.updated);
        location.reload();
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
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