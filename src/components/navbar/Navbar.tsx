import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import { NavbarProps } from "../../types/auth.types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function Navbar({ authButtons }: NavbarProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const navigate = useNavigate();

  const handleClick = (content: string) => {
    navigate(`/${content}`);
  };
  const { isAuthenticated } = useAuthStore();

  return (
    <Box pb={20}>
      <Group
        justify="space-between"
        h="100%"
        bg={"dark"}
        px={{ base:20, lg: 100 }}
        py={5}
      >
        <MantineLogo size={30} />
        <Group h="100%" gap={10} visibleFrom="sm">
          <Button
            h={50}
            variant="transparent"
            color="blue"
            onClick={() => handleClick("")}
          >
            Home
          </Button>
          {isAuthenticated && (
            <Button
              h={50}
              variant="transparent"
              color="blue"
              onClick={() => handleClick("dashboard")}
            >
              Dashboard
            </Button>
          )}
        </Group>
        <Group visibleFrom="sm">{authButtons}</Group>
        <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
      </Group>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

          <Button h={50} variant="light">
            Home
          </Button>

          {authButtons}
          <Divider my="sm" />
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
