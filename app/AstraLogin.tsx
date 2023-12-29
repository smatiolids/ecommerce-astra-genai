import * as React from "react";
import { useLogin, useNotify, Login, LoginForm, TextInput } from "react-admin";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Button, CardContent, CircularProgress } from "@mui/material";
import { Form, required, useTranslate, useSafeSetState } from "ra-core";
import { Typography } from "@mui/material";
import { FieldValues } from "react-hook-form";

const AstraLoginPage = () => {
  return (
    <Login backgroundImage="bg-login.png">
      <AstraLoginForm />
    </Login>
  );
};

export default AstraLoginPage;

export const AstraLoginForm = (props: LoginFormProps) => {
  const { redirectTo, className } = props;
  const [loading, setLoading] = useSafeSetState(false);
  const login = useLogin();
  const translate = useTranslate();
  const notify = useNotify();
  // const { handleSubmit } = useForm<FormData>();

  const submit : SubmitHandler<any> = (data) => {
    setLoading(true);
    login(data, redirectTo)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error)
        setLoading(false);
        notify(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
            ? "ra.auth.sign_in_error"
            : error.message,
          {
            type: "error",
            messageArgs: {
              _:
                typeof error === "string"
                  ? error
                  : error && error.message
                  ? error.message
                  : undefined,
            },
          }
        );
      });
  };

  return (
    <StyledForm
      onSubmit={submit}
      mode="onChange"
      noValidate
      className={className}
    >
      <CardContent className={LoginFormClasses.content}>
        <Typography flex="1" variant="h6">
          GenAI Ecommerce powered by DataStax Astra
        </Typography>

        <TextInput
          autoFocus
          source="username"
          label="Username"
          autoComplete="username"
          validate={required()}
          fullWidth
        />
        <TextInput
          source="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          validate={required()}
          fullWidth
        />

        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={loading}
          fullWidth
          className={LoginFormClasses.button}
        >
          {loading ? (
            <CircularProgress
              className={LoginFormClasses.icon}
              size={19}
              thickness={3}
            />
          ) : (
            translate("ra.auth.sign_in")
          )}
        </Button>
      </CardContent>
    </StyledForm>
  );
};

const PREFIX = "RaLoginForm";

export const LoginFormClasses = {
  content: `${PREFIX}-content`,
  button: `${PREFIX}-button`,
  icon: `${PREFIX}-icon`,
};

const StyledForm = styled(Form, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${LoginFormClasses.content}`]: {
    width: 600,
  },
  [`& .${LoginFormClasses.button}`]: {
    marginTop: theme.spacing(2),
  },
  [`& .${LoginFormClasses.icon}`]: {
    margin: theme.spacing(0.3),
  },
}));

type SubmitHandler<T> = (values: T) => void;

export interface LoginFormProps {
  redirectTo?: string;
  className?: string;
}

interface FormData extends FieldValues  {
  username: string;
  password: string;
}

LoginForm.propTypes = {
  redirectTo: PropTypes.string,
};
