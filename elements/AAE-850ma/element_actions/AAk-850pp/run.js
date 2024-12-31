function(instance, properties, context) {
    
    // Check if the PayPal button generation function is available
    
    if (instance.data.generatePayPalButton) {
        
        // Call the function to generate or display the PayPal button
        
        instance.data.generatePayPalButton(`#paypal-container-${instance.data.uniqueId}`);
    } else {
        console.error("PayPal button generation function is not available.");
    }
}
