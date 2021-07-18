public class getIpCalloutController {

    
    @AuraEnabled
    public static String getIpValue() {
        HttpRequest req = new HttpRequest();

        req.setMethod('GET');

        //Set HTTPRequest header properties
        req.setHeader('content-type', 'application/json');
 
        req.setEndpoint('https://www.trackip.net/ip?json');

        //Set the HTTPRequest body	
        // req.setBody(); 	

        Http http = new Http();
        HTTPResponse res=null;
        try {
 
            //Execute web service call here		
            res = http.send(req);	

            //Helpful debug messages
            System.debug('result: '+res.getBodyAsBlob().toString());
            System.debug(res.getBody());
            System.debug('STATUS:'+res.getStatus());
            System.debug('STATUS_CODE:'+res.getStatusCode());
		
		}
        catch(System.CalloutException e) {
	        //Exception handling goes here....
            System.debug('Error: '+e.getMessage());
		}

        return res.getBody();
	}

}
