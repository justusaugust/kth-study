import { ComputeEngine } from "@cortex-js/compute-engine";

export type MathCheck =
  | { status: "equivalent" }
  | { status: "different" }
  | { status: "unsupported"; reason: string };

const engine = new ComputeEngine();

export function checkEquivalent(
  lhsLatex: string,
  rhsLatex: string,
): MathCheck {
  try {
    const lhs = engine.parse(lhsLatex, { diagnostics: true });
    const rhs = engine.parse(rhsLatex, { diagnostics: true });
    const diagnostics = [
      ...(lhs.parseDiagnostics ?? []),
      ...(rhs.parseDiagnostics ?? []),
    ].filter((diagnostic) => diagnostic.code !== "undeclared-symbol");
    if (!lhs.isValid || !rhs.isValid || diagnostics.length > 0) {
      return {
        status: "unsupported",
        reason:
          diagnostics.map((diagnostic) => diagnostic.code).join(", ") ||
          "The expression contains a parse error.",
      };
    }

    const difference = lhs.sub(rhs).simplify();
    if (difference.isSame(0)) return { status: "equivalent" };
    if (difference.isEqual(0) === false) return { status: "different" };

    const identity = lhs.isIdenticallyEqual(rhs);
    if (identity === true) return { status: "equivalent" };
    if (identity === false) return { status: "different" };
    return {
      status: "unsupported",
      reason: "The symbolic engine could not decide equivalence.",
    };
  } catch (error) {
    return { status: "unsupported", reason: String(error) };
  }
}
