public without sharing class DiaryEntryController {

    @AuraEnabled
    public static void saveDiaryEntry(String entryData, Id entryId) {
        Diary_Entry__c de;
        if(entryId != null) {
            de = [SELECT Id, Detail__c  
                  FROM Diary_Entry__c
                  WHERE Id = :entryId];
            de.Detail__c = entryData;
        } else {
            de = new Diary_Entry__c();
            de.Detail__c = entryData;
        }
        
        upsert de;
    }

    @AuraEnabled(cacheable=true)
    public static LIst<Diary_Entry__c> getDiaryEntry(Id userId){
        List<Diary_Entry__c> des;
        try {
            des = [SELECT Id, Detail__c, CreatedDate
                   FROM Diary_Entry__c
                   WHERE OwnerId = :userId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return des;
    }

    @AuraEnabled
    public static void deleteDiaryEntry(Id rowId){
        try {
            Diary_Entry__C de = [SELECT Id
                                FROM Diary_Entry__c
                                WHERE Id = :rowId
                                LIMIT 1];
            delete de;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String getNumberOfUsedLicenses(){
        Integer numUsers;
        Integer totalLicense;
        try {
            List<User> users = [SELECT Id
                                FROM User 
                                WHERE Profile.UserLicense.Name = 'External Apps Login'];
            totalLicense = [SELECT TotalLicenses 
                            FROM UserLicense 
                            WHERE Name = 'External Apps Login'
                            LIMIT 1][0].TotalLicenses;
            numUsers = users.size();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return (totalLicense - numUsers) + '/' + totalLicense;
    }
}