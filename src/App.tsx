import { ApolloProvider } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { client } from "./graphql/apollo-client";
import { AppRoutes } from "./routes";
import { Notifications } from "@mantine/notifications";

function App() {
  return (
    <ApolloProvider client={client}>
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MantineProvider>
    </ApolloProvider>
  );
}
export default App;
