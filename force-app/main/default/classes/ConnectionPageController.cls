public class ConnectionPageController {

  @AuraEnabled  
  public static Lead getLeadBaseInfo(String leadId) {    
    Lead leadTmp = [SELECT Id, Name, Company, Title, Phone, Email, lastConnection__c, Street, City, State, PostalCode, Country FROM Lead WHERE Id=:leadId LIMIT 1];
    return leadTmp;
  }

  @AuraEnabled
  public static List<EmailMessage> getEmailMessages(String idLead) {          
    List<EmailMessage> listEmails = new List<EmailMessage>();
    for (EmailMessageRelation tmpEmailMesRelation : [SELECT Id, RelationId, RelationObjectType, EmailMessageId FROM EmailMessageRelation WHERE RelationId =: idLead AND RelationObjectType = 'Lead']) {    
      listEmails.addall([SELECT Id, Subject, CreatedDate, TextBody FROM EmailMessage WHERE Id =: tmpEmailMesRelation.EmailMessageId order by CreatedDate ASC]);
    }
    return listEmails;
  }

  @AuraEnabled
  public static List<Lead> getListLead() {    
    List<Lead> listLead = [SELECT Id, Name, Company, lastConnection__c FROM Lead order by CreatedDate desc LIMIT 500];
    return listLead;
  }

  @AuraEnabled
  public static List<Lead> getListLeadForAction() {
    DateTime todayDate = System.today();
    List<Lead> listLead = [SELECT Id, Name, Company, lastConnection__c FROM Lead WHERE lastConnection__c < :todayDate LIMIT 7];
    return listLead;
  }

  // @AuraEnabled
  // public static List<Lead> getListLeads(Integer recordLimit, Integer recordOffset) {
  //   Integer intLimit = Integer.valueof(recordLimit);
  //   Integer intOffset = Integer.valueof(recordOffset); 
  //   List<Lead> listLeads = [SELECT Name, Company, Title, Phone, Email, CreatedDate, lastConnection__c, id FROM Lead LIMIT :intLimit Offset :intOffset];
  //   return listLeads;
  // }
  
}
