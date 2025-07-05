import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("Utils", () => {
  it("deve combinar classes CSS", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("deve lidar com classes condicionais", () => {
    expect(cn("base", true && "conditional")).toBe("base conditional");
    expect(cn("base", false && "conditional")).toBe("base");
  });

  it("deve combinar strings corretamente", () => {
    expect(cn("base", "test")).toBe("base test");
  });
});
