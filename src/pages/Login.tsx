import { useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Container,
} from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";
import { useAuthStore } from "../store/authStore";
import { SIGN_IN } from "../graphql/mutation";
import { RegisterFormValues } from "../types/auth.types";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [signIn, { loading }] = useMutation(SIGN_IN);
  const setTokens = useAuthStore((state) => state.setTokens);

  const form = useForm<Partial<RegisterFormValues>>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        if (!value) return "Email is required";
        if (!isEmail(value)) return "Your email or password is incorrect";
        return null;
      },
      password: (value) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Your email or password is incorrect";
        return null;
      },
    },
  });

  const handleSubmit = async (values: Partial<RegisterFormValues>) => {
    try {
      const { data } = await signIn({
        variables: values,
      });

      setTokens(
        data.signIn.accessToken,
        data.signIn.refreshToken,
        data.signIn.user
      );

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      form.setErrors({ email: "Invalid credentials" });
    }
  };

  return (
    <Container size={"xs"}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack align="stretch" justify="center" w={"100%"}>
          <h1>Login</h1>
          <TextInput required label="Email" {...form.getInputProps("email")} />
          <PasswordInput
            required
            label="Password"
            {...form.getInputProps("password")}
          />
          <Button type="submit" loading={loading} disabled={!form.isValid()}>
            Sign In
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
