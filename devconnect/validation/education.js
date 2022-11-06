const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateEducatonInput = data => {
  let errors = {};
  
  data.school = !isEmpty(data.school) ? data.school : '';
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.from = !isEmpty(data.from) ? data.from : '';


  if(Validator.isEmpty(data.school)){
    errors.school = "School field is required";
  } 

  if(Validator.isEmpty(data.degree)){
    errors.degree = "Degree field is required";
  } 

  if(Validator.isEmpty(data.fieldOfStudy)){
    errors.fieldOfStudy = "Field of Study is required";
  }

  if(Validator.isEmpty(data.from)){
    errors.from = "From date is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
