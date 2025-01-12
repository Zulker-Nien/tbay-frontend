import { ApolloProvider } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import { client } from "./graphql/apollo-client";
import { AppRoutes } from "./routes";
function App() {
  return (
    <ApolloProvider client={client}>
      <MantineProvider defaultColorScheme="dark">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MantineProvider>
    </ApolloProvider>
  );
}
export default App;
