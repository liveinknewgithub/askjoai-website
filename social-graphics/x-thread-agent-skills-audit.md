# X Thread: Agent Skills Audit

Post as a thread. Each `---` is a new tweet.

---

I scraped 4,784 AI agent skills from 5 registries and scored every single one.

59% ship executable scripts.
12% are completely empty.
28% are duplicates.

And some are shipping malware.

Here's what I found:

---

First — what are "skills"?

They're folders with a SKILL.md file that load into your AI agent's context. Think plugins, but made of markdown and shell scripts.

The agent reads the markdown. Then runs whatever scripts come with it.

No review process. No signing. No verification.

---

I pulled skills from 5 registries:

- clawdhub: 3,764 skills (community)
- skillssh: 968 skills (community)
- OpenAI official: 31
- Anthropic official: 16
- OpenAI experimental: 5

clawdhub alone has 28% duplicates. "auto-updater" appears 40 times. "polymarket" appears 38 times.

---

Here's the part that should worry you.

~460 skills run `npm install`.
~467 run `pip install`.

These execute through your agent's bash access. No sandbox. No permission prompt. No package verification.

Your agent just... runs them.

---

1Password already documented infostealing malware hiding in skill registries. Active tracking campaigns. Real credentials stolen.

This isn't theoretical. It's happening now.

---

I built a quality scoring system. Base score of 50, adjusted by what's actually in the skill:

+15 for structured workflow
+12 for code examples
+10 for bundled scripts
+8 for clear usage triggers
-20 for empty content
-15 for placeholder text

Average score across all 4,784: 78.

---

The best line I can give you about this whole ecosystem:

"Markdown isn't content in an agent ecosystem. Markdown is an installer."

We treat these files like documentation. They're not. They're unsigned, unverified software packages that execute code on your machine.

---

What's missing from the entire ecosystem:

- No signed releases
- No provenance tracking
- No identity verification
- No dependency resolution
- No version pinning
- No evaluation criteria
- 51 skill names exist across multiple registries with different code

---

The whole thing looks like npm circa 2013. Useful primitives, zero trust infrastructure.

The difference: npm packages don't get injected directly into an AI agent that has bash access to your machine.

I published the full database — 4,784 skills, searchable, with quality scores.

Link in replies.
