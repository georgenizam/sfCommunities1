public class HomePageInfoController {
    @AuraEnabled
    public static Integer getAmountLeadsToday() {
      Integer amount;
      amount = 100;
      return amount;
    }

    @AuraEnabled
    public static map<String, Integer> getListLeadsToday(Long curTime) {
      
      DateTime curDate = DateTime.newInstance(curTime);
      DateTime dayDate = Datetime.newInstance(curDate.year(), curDate.month(), curDate.day(), 0, 0, 0);
      DateTime weekDate = dayDate.addDays(-6);
      DateTime monthDate = dayDate.addMonths(-1);

      List<Lead> listLeadsDate = [SELECT CreatedDate FROM Lead];
      Integer amountToday = 0;
      Integer amountWeek = 0;
      Integer amountMonth = 0;

      Integer[] amountOnWeekday = new Integer[] {0, 0, 0, 0, 0, 0, 0};
      
      for (Lead leadDate : listLeadsDate) {
        if (leadDate.CreatedDate > monthDate) {
          amountMonth++;
          if (leadDate.CreatedDate > weekDate) {
            amountWeek++;
            Integer index = getWeekday(leadDate.CreatedDate, weekDate);             
            if (index >= 0 && index < amountOnWeekday.size()) {
              amountOnWeekday[index]++;
            }                          
            
            if (leadDate.CreatedDate > dayDate) {
              amountToday++;
            }
          }
        }
      }

      Map<String, Integer> resmap = new Map<String, Integer>();
      resmap.put('amountToday', amountToday);
      resmap.put('amountWeek', amountWeek);
      resmap.put('amountMonth', amountMonth);      
      resmap.put('amountAllTime', listLeadsDate.size());
      string weekStr = string.join(amountOnWeekday,',');
      for (Integer i=0; i<amountOnWeekday.size(); i++) {
        resmap.put('weekday-' + String.valueOf(i), amountOnWeekday[i]);
      }
      
      return resmap;
    }

    @AuraEnabled
    public static map<String, Integer> getListEmails(Long curTime) {
      // List<Lead> listLeads = [SELECT  Name FROM  Lead];
      // return listLeads;
      DateTime curDate = DateTime.newInstance(curTime);
      DateTime dayDate = Datetime.newInstance(curDate.year(), curDate.month(), curDate.day(), 0, 0, 0);
      DateTime weekDate = dayDate.addDays(-6);
      DateTime monthDate = dayDate.addMonths(-1);

      List<EmailMessage> listEmailsDate = [SELECT Id, CreatedDate FROM EmailMessage];
      Integer amountToday = 0;
      Integer amountWeek = 0;
      Integer amountMonth = 0;

      Integer[] amountOnWeekday = new Integer[] {0, 0, 0, 0, 0, 0, 0};      
      
      for (EmailMessage emailDate : listEmailsDate) {
        if (emailDate.CreatedDate > monthDate) {
          amountMonth++;
          if (emailDate.CreatedDate > weekDate) {
            amountWeek++;
            Integer index = getWeekday(emailDate.CreatedDate, weekDate);             
            if (index >= 0 && index < amountOnWeekday.size()) {
              amountOnWeekday[index]++;
            }                          
            
            if (emailDate.CreatedDate > dayDate) {
              amountToday++;
            }
          }
        }
      }

      Map<String, Integer> resmap = new Map<String, Integer>();
      resmap.put('amountToday', amountToday);
      resmap.put('amountWeek', amountWeek);
      resmap.put('amountMonth', amountMonth);      
      resmap.put('amountAllTime', listEmailsDate.size());
      string weekStr = string.join(amountOnWeekday,',');
      for (Integer i=0; i<amountOnWeekday.size(); i++) {
        resmap.put('weekday-' + String.valueOf(i), amountOnWeekday[i]);
      }
      
      return resmap;
    }

    @AuraEnabled
    public static map<String, Integer> getListDelays(Long curTime) {      
      DateTime curDate = DateTime.newInstance(curTime);
      DateTime dayDate = Datetime.newInstance(curDate.year(), curDate.month(), curDate.day(), 0, 0, 0);
      DateTime weekDate = dayDate.addDays(-6);
      DateTime monthDate = dayDate.addMonths(-1);

      List<DelayLead__c> listLeadsDate = [SELECT Id, CreatedDate,  Lead__c, delay__c FROM DelayLead__c];      
      Integer amountToday = 0;
      Integer amountWeek = 0;
      Integer amountMonth = 0;
      Integer amountAllTime = 0;
      Integer[] amountOnWeekday = new Integer[] {0, 0, 0, 0, 0, 0, 0};      
      
      for (DelayLead__c leadDate : listLeadsDate) {
        Integer delay7 = leadDate.delay__c == '7' ? 1 : 0;
        Integer delay30 = leadDate.delay__c == '30' ? 1 : 0;
        amountAllTime += delay7 + delay30;        
        if (leadDate.CreatedDate > monthDate) {
          amountMonth += delay7 + delay30;
          if (leadDate.CreatedDate > weekDate) {
            amountWeek += delay7 + delay30;
            Integer index = getWeekday(leadDate.CreatedDate, weekDate);                         
            if (index >= 0 && index < amountOnWeekday.size()) {
              amountOnWeekday[index] += delay7 + delay30;
            }                                      
            if (leadDate.CreatedDate > dayDate) {
              amountToday += delay7 + delay30;
            }
          }
        }
      }

      Map<String, Integer> resmap = new Map<String, Integer>();
      resmap.put('amountToday', amountToday);
      resmap.put('amountWeek', amountWeek);
      resmap.put('amountMonth', amountMonth);      
      resmap.put('amountAllTime', amountAllTime);
      string weekStr = string.join(amountOnWeekday,',');
      for (Integer i=0; i<amountOnWeekday.size(); i++) {
        resmap.put('weekday-' + String.valueOf(i), amountOnWeekday[i]);
      }      
      return resmap;
    }

    public static Integer getWeekday(DateTime dateDay, DateTime startWeek) {
      DateTime [] daysWeek = new List<DateTime>();      
      for (Integer i = 0; i<8; i++) {
        DateTime dateTmp = DateTime.newInstance(startWeek.getTime());
        dateTmp = dateTmp.AddDays(i);                
        daysWeek.add(dateTmp);
      }      
      for (Integer i = 0; i<8; i++) {
        if ((i+1) < daysWeek.size() && dateDay >= daysWeek[i] && dateDay < daysWeek[i+1]) {
          return i;
        }
      }
      return -1;
    }   
}