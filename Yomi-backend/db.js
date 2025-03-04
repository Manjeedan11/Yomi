const mongoose = require("mongoose");

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    
    // Check if DB environment variable is defined
    if (!process.env.DB) {
        console.error("MongoDB URI not found in environment variables.");
        return;
    }

    try {
        mongoose.connect(process.env.DB, connectionParams)
            .then(() => {
                console.log("Connected to database");
            })
            .catch(error => {
                console.error("Error connecting to database:", error);
            });
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}
