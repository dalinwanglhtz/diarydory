import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import USER_ID from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/User.Name';
import getNumLicenses from '@salesforce/apex/DiaryEntryController.getNumberOfUsedLicenses';

export default class DiaryEntrySession extends NavigationMixin(LightningElement) {
    loggedOut = true;
    @track currUserName;
    @track error;
    userId = USER_ID;
    numLicenses;

    @wire(getRecord, {
        recordId: USER_ID,
        fields: [NAME_FIELD]
    })
    currUser({err, data}) {
        if(err) {
            this.error = err;
        } else if(data) {
            this.currUserName = data.fields.Name.value;
            this.loggedOut = false;
        }
    }

    handleClick(event) {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": "/login"
            },
        });
    }

    handleLogout(event) {
        this.loggedOut = true;
        window.location.replace('https://spinosaurus-developer-edition.ap24.force.com/diaryDory/secur/logout.jsp');
    }

    connectedCallback() {
        getNumLicenses()
        .then(result => {
            this.numLicenses = result;
        })
        .catch(err => {
            console.log('Error: ', err.body.message);
        });
    }
}