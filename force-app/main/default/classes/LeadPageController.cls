public class LeadPageController {
  
  @AuraEnabled
  public static List<Lead> getListLeads(Integer recordLimit, Integer recordOffset) {
    Integer intLimit = Integer.valueof(recordLimit);
    Integer intOffset = Integer.valueof(recordOffset); 
    List<Lead> listLeads = [SELECT Name, Company, Title, Phone, Email, CreatedDate, lastConnection__c, id FROM Lead LIMIT :intLimit Offset :intOffset];
    return listLeads;
  }

  @AuraEnabled
  public static Integer getTotalLeads() {
    return [SELECT Count() From Lead];    
  } 

}
