import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../page";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Investor Dashboard Page", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: { count: 3 } });
  });

  it("renders dashboard and fetches investor count", async () => {
    render(<Home />);
    expect(screen.getByText(/Investor Dashboard/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Total Investors in DB:/)).toBeInTheDocument();
    });
  });

  it("shows success message on successful submission", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<Home />);
    fireEvent.change(screen.getByTestId("input-firstName"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByTestId("input-lastName"), { target: { value: "Smith" } });
    fireEvent.change(screen.getByTestId("input-dob"), { target: { value: "1990-05-20" } });
    fireEvent.change(screen.getByTestId("input-phone"), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByTestId("input-street"), { target: { value: "123 Apple St" } });
    fireEvent.change(screen.getByTestId("input-state"), { target: { value: "NY" } });
    fireEvent.change(screen.getByTestId("input-zip"), { target: { value: "10001" } });
    fireEvent.change(screen.getByTestId("input-ssn"), { target: { value: "123-45-6789" } });

    const file = new File(["dummy"], "resume.pdf", { type: "application/pdf" });
    const fileInput = screen.getByTestId("input-document") as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.submit(screen.getByTestId("investor-form"));

    await waitFor(() => {
      expect(screen.getByText(/Investor submitted successfully/i)).toBeInTheDocument();
    });
  });

  it("shows error message on failed submission", async () => {
    mockedAxios.post.mockRejectedValue({
      response: { data: { error: "Submission failed" } },
    });

    render(<Home />);
    fireEvent.change(screen.getByTestId("input-firstName"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByTestId("input-lastName"), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByTestId("input-dob"), {
      target: { value: "1990-05-20" },
    });
    fireEvent.change(screen.getByTestId("input-phone"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByTestId("input-street"), {
      target: { value: "123 Apple St" },
    });
    fireEvent.change(screen.getByTestId("input-state"), {
      target: { value: "NY" },
    });
    fireEvent.change(screen.getByTestId("input-zip"), {
      target: { value: "10001" },
    });
    fireEvent.change(screen.getByTestId("input-ssn"), {
      target: { value: "123-45-6789" },
    });

    const file = new File(["dummy"], "resume.pdf", { type: "application/pdf" });
    const fileInput = screen.getByTestId("input-document") as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.submit(screen.getByTestId("investor-form"));

    await waitFor(() => {
      expect(screen.getByText(/Submission failed/)).toBeInTheDocument();
    });
  });
});
