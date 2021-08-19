@isTest
public with sharing class DiaryEntryControllerTest {

    @isTest static void testSaveNewDiaryEntry() {
        Diary_Entry__c de = new Diary_Entry__c();
        String testData1 = 'Test Data 2';

        Test.startTest();
        DiaryEntryController.saveDiaryEntry(testData1, null);
        Test.stopTest();

        List<Diary_Entry__c> desSaved = [SELECT Id, Detail__c
                                 FROM Diary_Entry__c];
        Boolean foundDE = false;
        for(Diary_Entry__c d : desSaved) {
            if(d.Detail__c == 'Test Data 2') {
                foundDE = true;
            }
        }
        System.assert(foundDe == true, 'Should be found');
    }

    @isTest static void testSaveExistingDiaryEntry() {
        Diary_Entry__c de1 = new Diary_Entry__c();
        de1.Detail__c = 'Test Data';
        insert de1;

        ID existingDEId = de1.Id;
        
        String testData2 = 'Test Data 3';

        System.debug('Existing ID: '+existingDEId);
        Test.startTest();
        DiaryEntryController.saveDiaryEntry(testData2, existingDEId);
        Test.stopTest();

        Diary_Entry__c deSaved = [SELECT Id, Detail__c
                                        FROM Diary_Entry__c
                                        WHERE Id = :existingDEId];
        System.assertEquals(testData2, deSaved.Detail__c, 'Diary Entry saved should contain Test Data 3');
    }

    @isTest static void testGetAllDiaryEntriesByUserId() {
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' LIMIT 1];

        
        Diary_Entry__c de1 = new Diary_Entry__c();
        de1.OwnerId = admin.Id;
        de1.Detail__c = 'Test Data';
        insert de1;

        Diary_Entry__c de2 = new Diary_Entry__c();
        de2.OwnerId = admin.Id;
        de2.Detail__c = 'Test Data 2';
        insert de2;

        List<Diary_Entry__c> deByUser;
        Test.startTest();
        deByUser = DiaryEntryController.getDiaryEntry(admin.Id);
        Test.stopTest();

        System.assertEquals(2, deByUser.size(), 'Should return 2 entries');

    }

    @isTest static void testDeleteExistingDiaryEntry() {
        Diary_Entry__c de1 = new Diary_Entry__c();
        de1.Detail__c = 'Test Data';
        insert de1;

        ID existingDEId = de1.Id;

        Test.startTest();
        DiaryEntryController.deleteDiaryEntry(existingDEId);
        Test.stopTest();

        String errorMsg;
        try {
            Diary_Entry__c deDeleted = [SELECT Id
                                       FROM Diary_Entry__c
                                       WHERE Id = :existingDEId];
        } catch(QueryException e) {
            errorMsg = e.getMessage();
        }

        System.assert(errorMsg.startsWith('List has no rows for assignment'), 'Exception should be thrown');
    }
}