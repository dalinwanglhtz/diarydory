public class DiaryEntryController {

    @AuraEnabled
    public static void saveDiaryEntry(String entryData) {
        Diary_Entry__c de = new Diary_Entry__c();
        de.Detail__c = entryData;
        
        insert de;
    }
}