function(instance, properties, context) {
    instance.data.amount = properties.amount || "0.00";
    instance.data.currency = properties.currency || "USD";
    instance.data.layout = properties.layout.toLowerCase();
    instance.data.color = properties.color.toLowerCase();
    instance.data.shape = properties.shape.toLowerCase();
    instance.data.label = properties.label.toLowerCase();
    instance.data.size = properties.size || "Medium";
    instance.data.shipping_preference = properties.shipping_preference || "GET_FROM_FILE";
    instance.data.locale = properties.locale || "en_US";
    instance.data.debug_mode = properties.debug_mode;

    if (properties.bubble.is_visible() && context.keys["Client ID"]) {
        instance.data.loadPayPal(function() {
            instance.data.generatePayPalButton(`#paypal-container-${instance.data.uniqueId}`);
        });
    }
}
