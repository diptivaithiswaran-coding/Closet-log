# Prompts: Stranger test fix — "What's the point of the forgotten tab?"

## What happened
My tester asked: **"What's the point of the forgotten tab?"** The tab name didn't say what the page shows or why it's useful.

## Prompt
> Rename the tab to something clearer and add a one-line explanation at the top of the page. Both.

## What the agent changed
- Tab and page title: **Forgotten → Not worn lately.** It says what's on the page in plain words.
- New line at the top of the page: "Clothes you haven't worn in 30+ days. Wear them again, or think about letting them go." It replaces the short "Wear them or let them go," which assumed you already knew what the page was.
- README updated.
- The page address stays /forgotten so old links keep working.

No database changes.
