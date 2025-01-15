import { Container, Group, Stack, Tabs } from "@mantine/core";
import MyProducts from "../components/dashboardTabs/myProducts/MyProducts";
import ProductCreate from "../components/product/create/ProductCreate";
import BoughtProducts from "../components/dashboardTabs/boughtProducts/BoughtProducts";
import SoldProducts from "../components/dashboardTabs/soldProducts/SoldProducts";
import RentedProducts from "../components/dashboardTabs/rentedProducts/RentedProducts";
import BorrowedProducts from "../components/dashboardTabs/borrowedProducts/BorrowedProducts";

function Dashboard() {
  return (
    <Container size={"xl"} mt={"xl"}>
      <Stack>
        <ProductCreate />
        <Tabs defaultValue="my_products">
          <Tabs.List>
            <Tabs.Tab value="my_products">My Products</Tabs.Tab>
            <Tabs.Tab value="bought">Bought Products</Tabs.Tab>
            <Tabs.Tab value="sold">Sold Products</Tabs.Tab>
            <Tabs.Tab value="rentedOut">Rented Out Products</Tabs.Tab>
            <Tabs.Tab value="lendedIn">Borrowed Products</Tabs.Tab>
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
              <BoughtProducts />
            </Tabs.Panel>
            <Tabs.Panel
              value="sold"
              w={{ base: "98vw", lg: "98vw", xl: "80vw" }}
            >
              <SoldProducts />
            </Tabs.Panel>
            <Tabs.Panel
              value="rentedOut"
              w={{ base: "98vw", lg: "98vw", xl: "80vw" }}
            >
              <RentedProducts />
            </Tabs.Panel>
            <Tabs.Panel
              value="lendedIn"
              w={{ base: "98vw", lg: "98vw", xl: "80vw" }}
            >
              <BorrowedProducts />
            </Tabs.Panel>
          </Group>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default Dashboard;
