import { LightningElement, track, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import saveDiaryEntry from '@salesforce/apex/DiaryEntryController.saveDiaryEntry';
import {
    subscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import interDomChannel from '@salesforce/messageChannel/InterDomMessageChannel__c';

export default class DiaryEntryCanvas extends LightningElement {
    subscription = null;
    currIp;
    diaryEntryId;

    @track errorMessage;

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
        this.currIp = message.IpAddress;
        console.log('Received message: ', message.IpAddress);
        if(message.rowData != null) {
            console.log('Row data: ', message.rowData);
            this.template.querySelector('textarea').value = message.rowData.Detail__c;
            this.diaryEntryId = message.rowData.Id;
        }
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    handleClick() {
        let value = this.template.querySelector('textarea').value.replace(/<([^>]+)>/ig, '');

        if(value == null || value == '') {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please enter something before save.',
                    variant: 'error'
                })
            )
            return;
        }

        saveDiaryEntry({entryData:value, entryId: this.diaryEntryId})
        .then(result => {
            const toastEvent = new ShowToastEvent({
                title: 'Success!',
                message: 'Record saved successfully!',
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);
            console.log('Result: ', result);
        })
        .then(result => {
            this.clearData();
            location.reload();
        })
        .catch(error => {
            this.errorMessage = error.body.message;
            console.log('Error: ', this.errorMessage);
        });
    }

    handleClear() {
        this.clearData();
    }

    clearData() {
        this.template.querySelector('form').reset();
        this.template.querySelector('textarea').value = null;
    }
}