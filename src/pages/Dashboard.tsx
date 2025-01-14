import { Container, Group, Stack, Tabs } from "@mantine/core";
import MyProducts from "../components/dashboardTabs/myProducts/MyProducts";
import ProductCreate from "../components/product/create/ProductCreate";

function Dashboard() {
  return (
    <Container size={"xl"}>
      <Stack>
        <ProductCreate />
        <Tabs defaultValue="my_products">
          <Tabs.List>
            <Tabs.Tab value="my_products">My Products</Tabs.Tab>
            <Tabs.Tab value="bought">Bought Products</Tabs.Tab>
            <Tabs.Tab value="sold">Sold Products</Tabs.Tab>
            <Tabs.Tab value="rentedOut">Rented Out Products</Tabs.Tab>
            <Tabs.Tab value="lendedIn">Lended In Products</Tabs.Tab>
          </Tabs.List>

          <Group pt={20}>
            <Tabs.Panel
              value="my_products"
              w={{ base: "98vw", lg: "98vw", xl: "80vw" }}
            >
              <MyProducts />
            </Tabs.Panel>
            <Tabs.Panel
              value="bought"
              w={{ base: "98vw", lg: "98vw", xl: "80vw" }}
            >
              Bought Products
            </Tabs.Panel>
            <Tabs.Panel
              value="sold"
              w={{ base: "98vw", lg: "98vw", xl: "80vw" }}
            >
              Sold Products
            </Tabs.Panel>
            <Tabs.Panel
              value="rentedOut"
              w={{ base: "98vw", lg: "98vw", xl: "80vw" }}
            >
              Rented Out Products
            </Tabs.Panel>
            <Tabs.Panel
              value="lendedIn"
              w={{ base: "98vw", lg: "98vw", xl: "80vw" }}
            >
              Lended In Products
            </Tabs.Panel>
          </Group>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default Dashboard;
