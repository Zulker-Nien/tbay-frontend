import { useAuthStore } from "../store/authStore";
import { Navbar } from "../components/navbar/Navbar";
import {
  HoverCard,
  Button,
  Text,
  Avatar,
  Stack,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthRefresh } from "../hooks/useAuthRefresh";

export const Layout = () => {
  const { isAuthenticated, user, clearTokens } = useAuthStore();
  const navigate = useNavigate();
  useAuthRefresh();

  const authButtons = isAuthenticated ? (
    <HoverCard position="bottom" radius="md" shadow="md" withinPortal>
      <HoverCard.Target>
        <Button variant="subtle">
          <Avatar size={"sm"} radius="xl" mr={"xs"} />
          <Text size="sm">Hi, {user?.firstName}</Text>
          <IconChevronDown size={12} />
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown p={"xs"}>
        <Button
          variant="subtle"
          fullWidth
          onClick={() => {
            clearTokens();
          }}
        >
          Logout
        </Button>
      </HoverCard.Dropdown>
    </HoverCard>
  ) : (
    <>
      <Button variant="default" onClick={() => navigate("login")}>
        Log in
      </Button>
      <Button onClick={() => navigate("register")}>Register</Button>
    </>
  );

  return (
    <Stack>
      <Navbar authButtons={authButtons} />
      <main>
        <Outlet />
      </main>
    </Stack>
  );
};
