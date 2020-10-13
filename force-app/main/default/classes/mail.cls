public with sharing class mail {
    @AuraEnabled
    public static void testMail(){        
      // Http http = new Http();
      // HttpRequest request = new HttpRequest();
      // request.setEndpoint(ENDPOINT);
      // request.setMethod('POST');
      // request.setHeader('Content-Type', 'application/json;charset=UTF-8');
      // request.setBody(body_json);
      // HttpResponse response = http.send(request);

      // List<String> ids = new List<String>();
      // if (response.getStatusCode() == 200) {
      //   Map<String, Object> body = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
      //     List<Map<String, Object>> results = new List<Map<String, Object>>();
      //     for (Object i : (List<Object>)body.get('results')) {
      //         results.add((Map<String, Object>)i);
      //     }
      //     for (Map<String, Object> i : results) {
      //         if (Integer.valueOf(i.get('status')) == 200) {
      //             ids.add(i.get('lead').toString());
      //         }
      //     }
      // }
      // return ids;      
      Http http = new Http();
      HttpRequest request = new HttpRequest();
      request.setEndpoint('https://testappmailer3.herokuapp.com/');
      request.setMethod('POST');
      request.setHeader('Content-Type', 'application/json;charset=UTF-8'); 
      // Set the body as a JSON object
      Opportunity op = new Opportunity(Name='NewOpportunity');
      request.setBody(JSON.serialize(op));
      HttpResponse response = http.send(request);
      System.debug(response.getStatusCode() + ' ' + response.getStatus()); 
      System.debug(response.getBody());
    }
}
