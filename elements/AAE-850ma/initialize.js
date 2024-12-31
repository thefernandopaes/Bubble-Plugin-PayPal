function(instance, context) {
    instance.data.paypalInstance = false;
    instance.data.paypalFetching = false;
    instance.data.key = context.keys["Client ID"];
    
    instance.data.loadPayPal = function(callback) {
        if (instance.data.debug_mode) console.info("Loading PayPal SDK...");
        
        if (instance.data.key && instance.data.currency && !instance.data.paypalFetching) {
            instance.data.paypalFetching = true;

            $.getScript(`https://www.paypal.com/sdk/js?client-id=${context.keys["Client ID"]}&currency=${instance.data.currency}&locale=${instance.data.locale}`, function() {
                instance.data.paypalInstance = true;
                instance.data.paypalFetching = false;
                if (instance.data.debug_mode) console.log("PayPal SDK Loaded");

                if (callback) callback();
            });
        }
    };

    instance.data.generatePayPalButton = function(containerId) {
        if (instance.data.debug_mode) console.log("Generating PayPal Button...");

        paypal.Buttons({
            style: {
                layout: instance.data.layout,
                color: instance.data.color,
                shape: instance.data.shape,
                label: instance.data.label,
                height: instance.data.size === "Small" ? 25 : instance.data.size === "Large" ? 55 : 35,
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: instance.data.currency,
                            value: instance.data.amount,
                        },
                        shipping_preference: instance.data.shipping_preference,
                    }],
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    instance.publishState("orderid", details.id);
                    instance.publishState("captureid", details.purchase_units[0].payments.captures[0].id);
                    instance.publishState("orderstatus", details.status);
                    instance.publishState("payername", `${details.payer.name.given_name} ${details.payer.name.surname}`);
                    instance.publishState("payeremail", details.payer.email_address);
                    instance.publishState("payerid", details.payer.payer_id);
                    instance.triggerEvent("payment_successful");
                }).catch(function(err) {
                    instance.publishState("error", JSON.stringify(err));
                    instance.triggerEvent("payment_failed");
                });
            },
            onError: function(err) {
                console.error("Error:", err);
                instance.publishState("error", JSON.stringify(err));
                instance.triggerEvent("error");
            },
        }).render(containerId);
    };
}
