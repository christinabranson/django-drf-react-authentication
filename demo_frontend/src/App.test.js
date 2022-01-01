import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login form", () => {
  render(<App />);
  const loginFormElement = screen.getByTestID("loginForm");
  expect(loginFormElement).toBeInTheDocument();
});
