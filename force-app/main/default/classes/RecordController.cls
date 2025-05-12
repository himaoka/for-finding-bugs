public with sharing class RecordController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getRecords() {
        // Check if the user has read access on Account
        if (!Schema.sObjectType.Account.isAccessible()) {
            throw new System.SecurityException('You do not have the necessary access for Account object');
        }

        return Database.query('SELECT Name, Id, BillingState, CreatedDate FROM Account LIMIT 10');
    }
}