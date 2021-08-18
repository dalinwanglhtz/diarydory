import { LightningElement } from 'lwc';
import DiaryEntryResources from '@salesforce/resourceUrl/diaryEntryResources';
import { NavigationMixin } from 'lightning/navigation';

export default class DiaryEntryHelp extends NavigationMixin(LightningElement) {
    helpVideoUrl = DiaryEntryResources + '/diaryDory-demo.mp4';

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