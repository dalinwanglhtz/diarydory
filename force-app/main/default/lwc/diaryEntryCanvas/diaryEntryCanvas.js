import { LightningElement, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import saveDiaryEntry from '@salesforce/apex/DiaryEntryController.saveDiaryEntry';

export default class DiaryEntryCanvas extends LightningElement {

    @track errorMessage;

    handleClick() {
        let value = this.template.querySelector('lightning-textarea').value.replace(/<([^>]+)>/ig, '');

        saveDiaryEntry({entryData:value})
        .then(result => {
            const toastEvent = new ShowToastEvent({
                title: 'Success!',
                message: 'Record saved successfully!',
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);
            console.log('Result: ', result);
        })
        .catch(error => {
            this.errorMessage = error.body.message;
            console.log('Error: ', this.errorMessage);
        });
    }

    handleClear() {
        this.template.querySelector('form').reset();
       // this.template.querySelector('lightning-textarea').value = null;
    }
}