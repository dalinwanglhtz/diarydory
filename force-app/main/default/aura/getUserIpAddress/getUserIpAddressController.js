({

	doInit : function(component) {
        var vfOrigin = 'https://australiacom-dev-ed--c.visualforce.com';
        window.addEventListener("message", $A.getCallback(function(event) {
            if (event.origin !== vfOrigin) {
                // Not the expected origin: Reject the message!
				console.log('Compare origin: ', vfOrigin);
				console.log('Wrong origin: ', event.origin);
				console.log('Event data: ', event.data);
                return;
            }

            var payload = {
                IpAddress: event.data
            };
            component.find("interDomMessageChannel").publish(payload);

            // Handle the message
            console.log('Event data: ', event.data);
        }), false);
    }
})