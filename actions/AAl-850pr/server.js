function(properties, context) {
    const type = properties.type || "Sandbox";
    const baseUrl = type === "Live" ? "https://api.paypal.com" : "https://api.sandbox.paypal.com";

    // Store returned values
    let response, result, error;

    try {
        // Handle different actions based on provided fields
        if (properties.saleId) {
            // Refund Sale
            const refundUrl = `${baseUrl}/v1/payments/sale/${properties.saleId}/refund`;

            let refundBody = {};
            if (properties.amount && properties.currency) {
                refundBody.amount = {
                    total: properties.amount.toString(),
                    currency: properties.currency
                };
            }

            response = context.request({
                method: "POST",
                uri: refundUrl,
                json: true,
                body: refundBody,
                auth: {
                    bearer: properties.atoken
                }
            });

            if (response.statusCode.toString().charAt(0) === "2") {
                result = JSON.parse(response.body);
                return {
                    id: result.id,
                    state: result.state,
                    error: null
                };
            } else {
                throw new Error(`Refund Error: ${response.body}`);
            }
        } else if (properties.authorizationId) {
            // Capture Authorized Payment
            const captureUrl = `${baseUrl}/v1/payments/authorization/${properties.authorizationId}/capture`;

            const captureBody = {
                amount: {
                    total: properties.amount ? properties.amount.toString() : "0.00",
                    currency: properties.currency || "USD"
                },
                is_final_capture: properties.isFinalCapture || true
            };

            response = context.request({
                method: "POST",
                uri: captureUrl,
                json: true,
                body: captureBody,
                auth: {
                    bearer: properties.atoken
                }
            });

            if (response.statusCode.toString().charAt(0) === "2") {
                result = JSON.parse(response.body);
                return {
                    id: result.id,
                    state: result.state,
                    error: null
                };
            } else {
                throw new Error(`Capture Error: ${response.body}`);
            }
        } else if (properties.reauthorizationId) {
            // Reauthorize Payment
            const reauthorizeUrl = `${baseUrl}/v1/payments/authorization/${properties.reauthorizationId}/reauthorize`;

            response = context.request({
                method: "POST",
                uri: reauthorizeUrl,
                json: true,
                auth: {
                    bearer: properties.atoken
                }
            });

            if (response.statusCode.toString().charAt(0) === "2") {
                result = JSON.parse(response.body);
                return {
                    id: result.id,
                    state: result.state,
                    error: null
                };
            } else {
                throw new Error(`Reauthorization Error: ${response.body}`);
            }
        } else {
            throw new Error("Invalid action or missing required fields.");
        }
    } catch (err) {
        error = err.message || "Unknown Error";
        return { id: null, state: null, error };
    }
}
