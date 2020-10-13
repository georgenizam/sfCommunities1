public class LeadModalController {

  @AuraEnabled
  public static List<String> getOptionsFields() {
    List<String> plValues = new List<String>();         
    //Get the object type from object name. Here I've used custom object Book.
    Schema.SObjectType objType = Schema.getGlobalDescribe().get('Lead');
      
    //Describe the sObject using its object type.
    Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
      
    //Get the specific field information from field name. Here I've used custom field Genre__c of Book object.
    Schema.DescribeFieldResult objFieldInfo = objDescribe.fields.getMap().get('Rating').getDescribe();
      
    //Get the picklist field values.
    List<Schema.PicklistEntry> picklistvalues = objFieldInfo.getPicklistValues();
      
    //Add the picklist values to list.
    for(Schema.PicklistEntry plv: picklistvalues) {
        plValues.add(plv.getValue());
    }
    plValues.sort();
    return plValues;
  }

  @AuraEnabled
  public static Boolean addNewLead(Lead leadRecord) {    
    try {
      upsert leadRecord;
      return true;
    } catch (DMLException e) {      
      throw new AuraHandledException(e.getMessage());
      // return false;
    }
    // return false;
  }

  @AuraEnabled
  public static Lead getLead(String leadId) {    
    Lead leadTmp = [SELECT Id, FirstName, LastName, Company, Title, Website, Phone, Email, Description, Street, City, State, PostalCode, Country FROM Lead WHERE Id=:leadId LIMIT 1];
    return leadTmp;
  }

  public static String generateRandomString(Integer len) {
    final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    String randStr = '';
    while (randStr.length() < len) {
       Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
       randStr += chars.substring(idx, idx+1);
    }
    return randStr;   
  }

  public static void generateNewLeads(Integer amount) {    
    List<Lead> listLeads = new List<Lead>();
    for (Integer i=0; i<amount; i++) {
      Lead leadTmp = new Lead();
      leadTmp.FirstName = generateRandomString(7);
      leadTmp.LastName = generateRandomString(5);
      leadTmp.Company = generateRandomString(8);
      leadTmp.Title = generateRandomString(10);
      leadTmp.Website = 'http://' + generateRandomString(7) + '.com';
      // leadTmp.Rating = 'hot';
      // leadTmp.Phone = '+375 67 897 65 37';
      leadTmp.Email = generateRandomString(7) + '@gmail.com';
  
      leadTmp.Street = generateRandomString(7);
      leadTmp.City = generateRandomString(7);
      leadTmp.State = generateRandomString(7);
      leadTmp.PostalCode = '78717';
      leadTmp.Country = generateRandomString(7);
  
      leadTmp.Description = generateRandomString(77);
      
      listLeads.add(leadTmp);
    }
    upsert listLeads;
  }


}
