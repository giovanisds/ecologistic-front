import { emailRegex, passwordRegex } from "../regex";

export const requiredField = {
  required: {
    message: "Campo obrigatório.",
    value: true,
  },
};

export const passwordValidation = {
  ...requiredField,
  pattern: {
    value: passwordRegex,
    message: "A senha deve ter no mínimo 8 caracteres e uma letra maiúscula",
  },
};

export const emailValidation = {
  ...requiredField,
  pattern: {
    value: emailRegex,
    message: "Digite um e-mail válido",
  },
};
