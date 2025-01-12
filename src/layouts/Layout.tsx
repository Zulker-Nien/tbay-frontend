import { useAuthStore } from "../store/authStore";
import { Navbar } from "../components/navbar/Navbar";
import { HoverCard, Group, Button, Text, Avatar } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";

export const Layout = () => {
  const { isAuthenticated, user, clearTokens } = useAuthStore();
  const navigate = useNavigate();
  const authButtons = isAuthenticated ? (
    <HoverCard
      // width={200}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
    >
      <HoverCard.Target>
        <Group gap="xs">
          <Avatar size={20} radius="xl" />
          <Text size="sm">Hi, {user?.firstName}</Text>
          <IconChevronDown size={12} />
        </Group>
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
    <div>
      <Navbar authButtons={authButtons} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
