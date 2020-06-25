//VALIDATION
const joi = require('@hapi/joi');

const registerValid = (data) =>{
  const schema = joi.object({
  name: joi.string().min(6).required(),
  password: joi.string().min(8).required(),
  email: joi.string().min(6).required().email(),
});
return schema.validate(data);
}

const registerValidAdmin = (data) =>{
    const schema = joi.object({
        name: joi.string().min(6).required(),
        password: joi.string().min(8).required(),
        email: joi.string().min(6).required().email(),
      });
      return schema.validate(data);
}

const questionValid = (data) =>{
  const schema = joi.object({
      columns: joi.array(),
      adminId: joi.string(),
      questionName: joi.string(),
    });
    return schema.validate(data);
}

const answerValid = (data) =>{
  const schema = joi.object({
      userId: joi.string(),
      answers: joi.array(),
      questionName: joi.string(),
    });
    return schema.validate(data);
}

const loginvalid = (data) =>{
    const schema = joi.object({
        email:joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    });
    return schema.validate(data);
}
module.exports.registerValid = registerValid;
module.exports.registerValidAdmin = registerValidAdmin;
module.exports.loginvalid = loginvalid;
module.exports.questionValid = questionValid;
module.exports.answerValid = answerValid;