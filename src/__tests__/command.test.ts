import { VimState, Mode } from "../state";

// Create mock state before the imports
const mockState = new VimState();

jest.mock("../content", () => ({
  setMode: jest.fn(),
  state: mockState,
}));

import { handleCommand } from "../commands";

describe("Command Handler", () => {
  let state: VimState;

  beforeEach(() => {
    state = new VimState();
    document.body.innerHTML = `
      <iframe class="docs-texteventtarget-iframe">
        <html><body></body></html>
      </iframe>
    `;
  });

  describe("Command Mode", () => {
    beforeEach(() => {
      state.setMode(Mode.COMMAND);
    });

    test("should handle mode switching commands", () => {
      handleCommand("i", state);
      expect(state.mode).toBe(Mode.INSERT);

      state.setMode(Mode.COMMAND);
      handleCommand("v", state);
      expect(state.mode).toBe(Mode.VISUAL);
    });

    test("should handle colon commands", () => {
      handleCommand(":", state);
      expect(state.pendingCommand).toBe(":");

      handleCommand("q", state);
      expect(state.mode).toBe(Mode.OFF);
    });

    test("should handle double-letter commands", () => {
      handleCommand("g", state);
      expect(state.pendingCommand).toBe("g");

      handleCommand("g", state);
      expect(state.pendingCommand).toBe("");
      expect(state.lastCommand).toBe("g");
    });
  });

  describe("Insert Mode", () => {
    beforeEach(() => {
      state.setMode(Mode.INSERT);
    });

    test("should exit to command mode on escape", () => {
      handleCommand("Escape", state);
      expect(state.mode).toBe(Mode.COMMAND);
    });
  });

  describe("Visual Mode", () => {
    beforeEach(() => {
      state.setMode(Mode.VISUAL);
    });

    test("should handle visual mode commands", () => {
      handleCommand("y", state);
      expect(state.mode).toBe(Mode.COMMAND);

      state.setMode(Mode.VISUAL);
      handleCommand("d", state);
      expect(state.mode).toBe(Mode.COMMAND);
    });

    test("should exit to command mode on escape", () => {
      handleCommand("Escape", state);
      expect(state.mode).toBe(Mode.COMMAND);
    });
  });
});
