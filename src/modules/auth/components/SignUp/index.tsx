import {
  Box,
  Button,
  IconButton,
  TextField,
  Link,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Wrapper from "../Wrapper";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useCallback, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  emailValidation,
  passwordValidation,
  requiredField,
} from "../../utils/validation";

import { useSignUp } from "../../../../services/auth/login";

import useFieldProps from "../../hooks/useFieldProps";
import { useGlobalKeys } from "../../../../stores/useGlobalKeys";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const setUserKey = useGlobalKeys((state) => state.setUserKey);
  const setUserName = useGlobalKeys((state) => state.setUserName);

  const navigate = useNavigate();

  const { mutate, isPending } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { getFieldProps } = useFieldProps({ errors, register });

  const onSubmit = (values) => {
    mutate(
      {
        email: values.email,
        senha: values.password,
        nome: values.userName,
      },
      {
        onSuccess: (res) => {
          navigate("/dashboard");
          setUserKey(res.id);
          setUserName(res.nome);
        },
      }
    );
  };

  const getVisibility = useCallback((show) => {
    if (show) return <Visibility />;
    return <VisibilityOff />;
  }, []);

  const getAddornment = useCallback(
    (show, toggle) => {
      return {
        type: show ? undefined : "password",
        slotProps: {
          input: {
            endAdornment: (
              <IconButton onClick={() => toggle((state) => !state)}>
                {getVisibility(show)}
              </IconButton>
            ),
          },
        },
      };
    },
    [getVisibility]
  );

  return (
    <Wrapper text="Faça seu cadastro" handleBack={() => navigate("/login")}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box width={1} display={"flex"} gap={1.5} flexDirection={"column"}>
          <TextField
            label="E-mail"
            {...getFieldProps("email", emailValidation)}
          />
          <TextField
            label="Nome Completo"
            {...getFieldProps("userName", requiredField)}
          />
          <TextField
            label="Senha"
            {...getFieldProps("password", passwordValidation)}
            {...getAddornment(showPassword, setShowPassword)}
          />
          <TextField
            label="Confirme sua senha"
            {...getFieldProps("password-confirmation", passwordValidation)}
            {...getAddornment(showConfirmPassword, setShowConfirmPassword)}
          />
          <Button variant="contained" type="submit" loading={isPending}>
            Cadastrar
          </Button>{" "}
          <Box display={"flex"} width={1} gap={0.5} justifyContent="center">
            <Typography>Já tem cadastro?</Typography>
            <Typography>
              <Link sx={{ userSelect: "none" }} href="/login">
                Faça login
              </Link>
            </Typography>
          </Box>
        </Box>
      </form>
    </Wrapper>
  );
};
export default Login;
