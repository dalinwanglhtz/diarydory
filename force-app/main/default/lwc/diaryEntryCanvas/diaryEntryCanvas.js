import { LightningElement, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import saveDiaryEntry from '@salesforce/apex/DiaryEntryController.saveDiaryEntry';

export default class DiaryEntryCanvas extends LightningElement {

    @track errorMessage;

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

        this.clearData();
    }

    handleClear() {
        this.clearData();
    }

    clearData() {
        this.template.querySelector('form').reset();
        this.template.querySelector('textarea').value = null;
    }
}