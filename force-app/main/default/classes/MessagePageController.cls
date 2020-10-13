public class MessagePageController {    

    @AuraEnabled
    public static List <Map<String, String>> getListEmail(Integer recordLimit, Integer recordOffset) {
      List <Map<String, String>> resList = new List<Map<String, String>>();

      Integer intLimit = Integer.valueof(recordLimit);
      Integer intOffset = Integer.valueof(recordOffset);             
      for (EmailMessage emailMesTmp : [SELECT Id, EmailTemplateId, Subject, CreatedDate FROM EmailMessage WHERE Id IN (SELECT EmailMessageId FROM EmailMessageRelation WHERE RelationObjectType = 'Lead' AND RelationType = 'ToAddress') LIMIT :intLimit Offset :intOffset]) {        
        EmailMessageRelation tmpEmailMesRelation = ([SELECT Id, RelationId, EmailMessageId FROM EmailMessageRelation WHERE EmailMessageId =: emailMesTmp.Id AND RelationObjectType = 'Lead' LIMIT 1]);
        String id = string.valueOf(tmpEmailMesRelation.RelationId);
        Lead leadTmp = [SELECT Id, Name FROM Lead WHERE Id=:id];        
        // String name = string.valueOf([SELECT Id, Name FROM Lead WHERE Id=:id]);
        Map<String, String> resmap = new Map<String, String>();
        resmap.put('Id', string.valueOf(leadTmp.Id));
        resmap.put('Name', leadTmp.Name);
        resmap.put('EmailTemplateId',  emailMesTmp.EmailTemplateId);
        resmap.put('Subject',  emailMesTmp.Subject);
        resmap.put('CreatedDate',  string.valueOfGmt(emailMesTmp.CreatedDate));  
        resList.add(resmap);        
      }            
      System.debug(resList);
      return resList;
    }

    @AuraEnabled
    public static Integer getTotalEmails() {
      return [SELECT Count() From EmailMessage];    
    }

    @AuraEnabled
    public static Map<String, String> getEmailMessage(String idLead) {          
      // List<EmailMessage> listEmails = [SELECT Id, Lead__r.Name, Subject, TextBody, CreatedDate FROM EmailMessage WHERE Id =: idLead order by CreatedDate ASC];
      // return listEmails[0];
      Map<String, String> resMap = new Map<String, String>();
      EmailMessageRelation tmpEmailMesRelation = ([SELECT Id, RelationId, EmailMessageId FROM EmailMessageRelation WHERE RelationId =: idLead AND RelationObjectType = 'Lead' LIMIT 1]);
      List<EmailMessage> listEmails = [SELECT Id, Subject, TextBody, CreatedDate FROM EmailMessage WHERE Id =: tmpEmailMesRelation.EmailMessageId order by CreatedDate ASC];      
      Lead leadTmp = [SELECT Id, Name FROM Lead WHERE Id=:tmpEmailMesRelation.RelationId];
      resMap.put('Name', leadTmp.Name);
      resMap.put('Subject', listEmails[0].Subject);
      resMap.put('TextBody', listEmails[0].TextBody);
      resMap.put('CreatedDate', string.valueOfGmt(listEmails[0].CreatedDate));
      
      return resMap;
      
    }
}
