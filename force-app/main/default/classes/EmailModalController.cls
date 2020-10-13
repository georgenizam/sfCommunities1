public class EmailModalController {

  @AuraEnabled
  public static List<EmailTemplate> getEmailTemplates() {
    List<EmailTemplate> listEmailTemplates = [SELECT Id, RelatedEntityType, Name FROM EmailTemplate WHERE RelatedEntityType='Lead'];
    return listEmailTemplates;
  }

  @AuraEnabled
  public static string getEmailTemplateLead(String leadId) {
    Lead tmpLead = [SELECT Id, emailTemplateId__c FROM Lead WHERE Id=:leadId LIMIT 1];
    System.debug(tmpLead);
    if (tmpLead.emailTemplateId__c != null) {      
      EmailTemplate emailTemplateTmp = [SELECT Id, Name FROM EmailTemplate WHERE Id=:tmpLead.emailTemplateId__c LIMIT 1];
      return emailTemplateTmp.Name;
    }
    return '';    
  }

  @AuraEnabled
  public static void setEmailTemplateLead(String newEmailTemplateId, String leadId) {
    Lead tmpLead = [SELECT Id, emailTemplateId__c FROM Lead WHERE Id=:leadId LIMIT 1];    
    EmailTemplate emailTemplateTmp = [SELECT Id, Name FROM EmailTemplate WHERE Name=:newEmailTemplateId LIMIT 1];
    tmpLead.emailTemplateId__c = emailTemplateTmp.Id;
    update tmpLead;
  }  
  
}
