public class CredentialPageController {
    @AuraEnabled
    public static map<String, String> getCredential() {
      Credential__mdt obj = [SELECT salesforce_username__c, password_gmail__c, username_gmail__c FROM Credential__mdt LIMIT 1];
      Map<String, String> resmap = new Map<String, String>();      
      resmap.put('salesforceUsername', obj.salesforce_username__c);
      resmap.put('usernameGmail', obj.username_gmail__c); 
      resmap.put('passwordGmail', obj.password_gmail__c);
      return resmap;
    }

    @AuraEnabled
    public static Boolean saveCredential(Credential__mdt newCred) {      
      try{
          Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
          Credential__mdt objMetadata = [SELECT DeveloperName, MasterLabel, salesforce_username__c, password_gmail__c, username_gmail__c FROM Credential__mdt LIMIT 1];
          
          Metadata.CustomMetadata metadataRec =  new Metadata.CustomMetadata();              
          metadataRec.fullName = 'Credential__mdt.'+objMetadata.DeveloperName;
          metadataRec.label = objMetadata.MasterLabel;              
          
          Metadata.CustomMetadataValue customFieldtoUpdate = new Metadata.CustomMetadataValue();
          customFieldtoUpdate.field = 'username_gmail__c';
          customFieldtoUpdate.value = newCred.username_gmail__c;
          metadataRec.values.add(customFieldtoUpdate);

          customFieldtoUpdate = new Metadata.CustomMetadataValue();
          customFieldtoUpdate.field = 'salesforce_username__c';
          customFieldtoUpdate.value = newCred.salesforce_username__c;
          metadataRec.values.add(customFieldtoUpdate);

          customFieldtoUpdate = new Metadata.CustomMetadataValue();
          customFieldtoUpdate.field = 'password_gmail__c';
          customFieldtoUpdate.value = newCred.password_gmail__c;
          metadataRec.values.add(customFieldtoUpdate);

          mdContainer.addMetadata(metadataRec);          
          
          Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, null);
          // system.debug('jobId***'+jobId);    
          return true;                               
      } catch(exception ex) {
          // system.debug('exception '+ex.getMessage());  
          return false;                               
      }               
    }
}

