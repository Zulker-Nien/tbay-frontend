import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import { NavbarProps } from "../../types/auth.types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { IconMoon, IconShoppingCart, IconSun } from "@tabler/icons-react";

export function Navbar({ authButtons }: NavbarProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const navigate = useNavigate();

  const handleClick = (content: string) => {
    navigate(`/${content}`);
  };
  const { isAuthenticated } = useAuthStore();
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  return (
    <Box pb={20}>
      <Group
        justify="space-between"
        h="100%"
        px={{ base: 20, lg: 100 }}
        py={5}
        style={{ borderBottom: "2px solid #3b5bdb" }}
      >
        <MantineLogo size={30} />
        <Group h="100%" gap={10} visibleFrom="sm">
          <Button variant="subtle" onClick={() => handleClick("")}>
            Home
          </Button>
          {isAuthenticated && (
            <Button variant="subtle" onClick={() => handleClick("dashboard")}>
              My Products
            </Button>
          )}
        </Group>
        <Group visibleFrom="sm">
          <Button bg={"indigo"} radius={"xl"}>
            <IconShoppingCart />
          </Button>
          {colorScheme === "light" ? (
            <Button
              bg={"yellow"}
              onClick={() => setColorScheme("dark")}
              radius={"xl"}
              px={10}
            >
              <IconSun />
            </Button>
          ) : (
            <Button
              bg={"indigo"}
              onClick={() => setColorScheme("light")}
              radius={"xl"}
              px={10}
            >
              <IconMoon radius={"xl"} />
            </Button>
          )}
          {authButtons}
        </Group>
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
