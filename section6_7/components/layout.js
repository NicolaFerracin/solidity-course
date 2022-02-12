import { Container } from "semantic-ui-react";
import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <Container>
      <Navbar />
      <main>{children}</main>
    </Container>
  );
}
