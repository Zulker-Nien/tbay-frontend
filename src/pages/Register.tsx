import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Container,
  Divider,
} from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";
import { useAuthStore } from "../store/authStore";
import { SIGN_UP } from "../graphql/mutation";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const [signUp, { loading }] = useMutation(SIGN_UP);
  const setTokens = useAuthStore((state) => state.setTokens);

  const form = useForm<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validate: {
      firstName: (value) => {
        if (!value || value.trim().length === 0)
          return "First name is required";
        return null;
      },
      lastName: (value) => {
        if (!value) return "Last name is required";
        return null;
      },
      email: (value) => {
        if (!value || value.trim().length === 0) return "Email is required";
        if (!isEmail(value)) return "Invalid email address";
        return null;
      },
      password: (value) => {
        if (!value || value.trim().length === 0) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return null;
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const { data } = await signUp({
        variables: values,
      });

      setTokens(
        data.signUp.accessToken,
        data.signUp.refreshToken,
        data.signUp.user
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Registration failed:", error);
      if (error instanceof Error) {
        if (error.message.includes("email")) {
          form.setErrors({ email: "Email already exists" });
        } else {
          form.setErrors({
            email: "Registration failed. Please try again.",
          });
        }
      }
    }
  };

  return (
    <Container size={"xs"}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <h1>Register</h1>
          <Divider size={"md"} />
          <TextInput
            required
            label="First Name"
            placeholder="Enter your first name"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            required
            label="Last Name"
            placeholder="Enter your last name"
            {...form.getInputProps("lastName")}
          />
          <TextInput
            required
            label="Email"
            placeholder="your.email@example.com"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Minimum 8 characters"
            {...form.getInputProps("password")}
          />
          <Button type="submit" loading={loading} disabled={!form.isValid()}>
            Sign Up
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
