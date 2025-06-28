import {
  Box,
  Button,
  Link,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useForm } from "react-hook-form";
import Wrapper from "../Wrapper";
import { useState } from "react";
import { emailValidation, requiredField } from "../../utils/validation";

import useFieldProps from "../../hooks/useFieldProps";

import { useLogin } from "../../../../services/auth/login";

import { useNavigate } from "react-router-dom";
import { useGlobalKeys } from "../../../../stores/useGlobalKeys";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const setUserKey = useGlobalKeys((state) => state.setUserKey);
  const setUserName = useGlobalKeys((state) => state.setUserName);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useLogin();

  const onSubmit = (values) => {
    mutate(
      {
        email: values.email,
        senha: values.password,
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

  const { getFieldProps } = useFieldProps({ errors, register });

  return (
    <Wrapper text="Bem-vindo de volta">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box width={1} display={"flex"} gap={1.5} flexDirection={"column"}>
          <TextField
            label="E-mail"
            error={!!errors?.email}
            helperText={errors?.email?.message}
            {...getFieldProps("email", emailValidation)}
          />
          <TextField
            label="Senha"
            type={showPassword ? undefined : "password"}
            {...getFieldProps("password", requiredField)}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((state) => !state)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              },
            }}
          />

          <Button variant="contained" type="submit" loading={isPending}>
            Acessar
          </Button>
          <Box display={"flex"} width={1} justifyContent="center" gap={0.5}>
            <Typography>Não tem conta?</Typography>
            <Typography>
              <Link sx={{ userSelect: "none" }} href="/sign-up">
                Registre-se
              </Link>
            </Typography>
          </Box>
        </Box>
      </form>
    </Wrapper>
  );
};
export default Login;
