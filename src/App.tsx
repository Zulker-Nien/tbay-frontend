import { ApolloProvider } from "@apollo/client";
import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { client } from "./graphql/apollo-client";
import { AppRoutes } from "./routes";
import { Notifications } from "@mantine/notifications";

function App() {
  const theme = createTheme({
    primaryColor: "indigo",
  });
  return (
    <ApolloProvider client={client}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MantineProvider>
    </ApolloProvider>
  );
}
export default App;
