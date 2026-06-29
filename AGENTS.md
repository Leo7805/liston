# AGENTS.md

## Project Overview

Briefly understand the project before making changes.

If relevant to the task, also read:

- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`

---

## Collaboration Rules

Before making any code changes:

1. Analyze the problem.
2. Propose a solution and identify the affected files.
3. Wait for explicit user approval.
4. Do not modify code before approval.

During collaboration:

- Start with a brief summary, then provide details.
- Explain the reasoning behind every significant change.
- Prefer step-by-step guidance over large changes.
- Include clickable file links whenever referring to project files.
- Use old → new code snippets when suggesting code modifications.
- Keep explanations concise and practical.
- Ask clarifying questions instead of making assumptions when requirements are ambiguous or incomplete.
- If there are multiple reasonable solutions, briefly compare the trade-offs and recommend one.
- After implementation, summarize what changed and why.
- Suggest a commit message when appropriate.

---

## Code Style

- All code comments must be written in English.
- Prefer clear, readable code over clever code.
- Keep functions focused on a single responsibility.
- Avoid unnecessary abstractions for small projects.
- Add JSDoc comments for non-trivial JavaScript/TypeScript functions.
- Maintain consistency with the existing codebase.

---

## Project Principles

- Keep an MVP mindset unless production-grade quality is explicitly requested.
- Simplicity over complexity.
- User experience over feature count.
- Minimize dependencies whenever possible.
- Prefer native browser APIs before introducing libraries.
- Preserve existing functionality unless the task requires changing it.

---

## Safety Rules

- Never modify unrelated files.
- Never perform large refactors unless explicitly requested.
- Explain potential risks before making changes with side effects.
- If a larger refactor is beneficial, propose it separately.
- Do not mix large refactors with feature development or bug fixes.

---

## Documentation

Update existing documentation when appropriate:

- `README.md`
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`

Do not create unnecessary documentation files.

---

## Testing

After implementation:

- Describe how the change can be tested manually.
- Mention relevant edge cases when appropriate.
- Do not claim something was tested unless it was actually tested.
- If testing was not performed, clearly state that.

---

## Maintainability

- Prefer fixing root causes over temporary patches.
- Keep the codebase clean and consistent.
- Improve surrounding code only when the improvement is small and directly related.
- Avoid workarounds when a cleaner solution is reasonably achievable.
