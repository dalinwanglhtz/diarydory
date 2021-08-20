import { LightningElement } from 'lwc';
import DiaryEntryResources from '@salesforce/resourceUrl/diaryEntryResources';
import { NavigationMixin } from 'lightning/navigation';

export default class DiaryEntryHeader extends NavigationMixin(LightningElement) {
    diaryEntryLogo = DiaryEntryResources + '/diarydory-logo.png';

    handleHelp(event) {
        // this[NavigationMixin.Navigate]({
        //     "type": "comm__namedPage",
        //     "attributes": {
        //         "pageName": "help"
        //     },
        // });
        location.replace('/s/help');
    }

    handleHome(event) {
        // this[NavigationMixin.Navigate]({
        //     "type": "comm__namedPage",
        //     "attributes": {
        //         "pageName": "home"
        //     },
        // });
        location.replace('/s/');
    }
}