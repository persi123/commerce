import { render, screen } from "@testing-library/react";
import OTP from "./index";

describe("App component", () => {
  test("it renders", () => {
    render(<OTP />);

    // expect(screen.getByText("Users:")).toBeInTheDocument();
  });
});
