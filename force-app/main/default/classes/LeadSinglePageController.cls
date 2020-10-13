public class LeadSinglePageController {

  @AuraEnabled
  public static Lead getAllInfoLead(String idLead) {        
    Lead leadTmp = [SELECT Name, Description, Phone, lastConnection__c, Website, Address, Rating, LastModifiedDate, CreatedDate, Street, City, Country, PostalCode FROM Lead WHERE Id=:idLead];    
    return leadTmp;
  }

  @AuraEnabled
  public static Lead getBasicInfoLead(String idLead) {        
    Lead leadTmp = [SELECT Id, Name, Company, Title, Phone, Email FROM Lead WHERE Id=:idLead];    
    return leadTmp;
  }

  @AuraEnabled
  public static Map<String, String> getEmailInfo(String idLead) {        
    Map<String, String> resmap = new Map<String, String>{
      'emailAmount' => '0', 
      'delay_7_days' => '0', 
      'delay_30_days' => '0',
      'subjectEmail' => 'none',
      'dateEmail' => 'none',
      'bodyEmail' => 'none'
    };
    List<EmailMessage> emailList = [SELECT Id, Lead__c, CreatedDate, Subject, TextBody FROM EmailMessage WHERE Lead__c=:idLead ORDER BY CreatedDate DESC];                
    Lead leadTmp = [SELECT Id, Name, delay_7_days__c, delay_30_days__c FROM Lead WHERE Id=:idLead LIMIT 1];    
    List<DelayLead__c> delays = [SELECT Id, Lead__c, Name, delay__c FROM DelayLead__c WHERE Lead__c=:idLead];
    
    if (emailList != null && !emailList.isEmpty()) {      
      resmap.put('emailAmount', string.valueOf(emailList.size()));
      resmap.put('subjectEmail', emailList[0].Subject);
      resmap.put('dateEmail', string.valueOfGmt(emailList.get(0).CreatedDate));
      resmap.put('bodyEmail', emailList[0].TextBody);
    }
    if (delays != null) {
      Integer delay7 = 0;
      Integer delay30 = 0;
      for (DelayLead__c d : delays) {
        if (d.delay__c == '7') delay7++;
        if (d.delay__c == '30') delay30++;
      }
      resmap.put('delay_7_days', string.valueOf(delay7));
      resmap.put('delay_30_days', string.valueOf(delay30));     
    }    
    return resmap;
  }

  @AuraEnabled
  public static Boolean addDays(String idLead, String amount) {        
    DelayLead__c DelayTmp = New DelayLead__c();
    DelayTmp.delay__c = amount;
    DelayTmp.Lead__c = idLead;    

    try {
      insert DelayTmp;
      // return true;
    } catch (DMLException e) {      
      throw new AuraHandledException(e.getMessage());
      // return false;
    }     
    Lead leadRecord = [SELECT Id, delay_7_days__c, delay_30_days__c FROM Lead WHERE Id=:idLead];
    switch on amount {
      when '7' {
        leadRecord.delay_7_days__c = leadRecord.delay_7_days__c + 1;
        try {
          update leadRecord;
          return true;
        } catch (DMLException e) {      
          // throw new AuraHandledException(e.getMessage());      
          return false;
        }          
      }
      when '30' {
        leadRecord.delay_30_days__c = leadRecord.delay_30_days__c + 1;
        try {
          update leadRecord;
          return true;
        } catch (DMLException e) {      
          // throw new AuraHandledException(e.getMessage());      
          return false;
        }        
      }
      when else {
        return false;
      }      
    }              
  }
}
