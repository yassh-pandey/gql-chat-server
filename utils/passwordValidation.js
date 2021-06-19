const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
passwordSchema
.is().min(6)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.has().symbols(1);                              // Should have atleast 1 special characte


const passwordSchemaErrorMapper = {
    min: "atleast 6 characters.",
    max: "less than 100 characters.",
    lowercase: "atleast 1 lower case character.",
    uppercase: "atleast 1 upper case character.",
    digits: "atleast 1 digit.",
    spaces: "should not contain any white spaces.",
    symbols: "atleast 1 special character."
};

module.exports = {
    passwordSchema,
    passwordSchemaErrorMapper,
}