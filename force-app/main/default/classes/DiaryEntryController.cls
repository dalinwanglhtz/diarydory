public class DiaryEntryController {

    @AuraEnabled
    public static void saveDiaryEntry(String entryData) {
        Diary_Entry__c de = new Diary_Entry__c();
        de.Detail__c = entryData;
        
        insert de;
    }

    @AuraEnabled(cacheable=true)
    public static LIst<Diary_Entry__c> getDiaryEntry(Id userId){
        List<Diary_Entry__c> des = new List<Diary_Entry__c>();
        try {
            des = [SELECT Id, Detail__c, CreatedDate
                   FROM Diary_Entry__c
                   WHERE OwnerId = :userId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return des;
    }
}