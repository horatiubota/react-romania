import React from "react";
import Example from "./components/Example";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

export default function App(props) {
  return (
    <Container maxWidth="md">
      <Box m={5}></Box>
      <Example />
      <Box m={5}></Box>
    </Container>
  );
}
