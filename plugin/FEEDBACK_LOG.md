# Plugin Feedback Log

## Latest user feedback

User ran the latest small-batch sample and reported:

- The 30-row sample looks generally usable.
- Some websites are still missing despite being visible after clicking into the business detail panel.
- Long browser sessions can create memory pressure in Chrome.
- The plugin needs probe behavior that helps identify exactly why a visible website was missed.

## Known facts

- List collection works.
- Result-list scrolling works.
- Phone/address/coordinate extraction is commercially useful.
- Website extraction can work, but misses still exist.
- Detail-card lifecycle and DOM variants must be diagnosed with structured logs, not guesses.

## Product decision

The plugin remains a tactical helper and probe. SourcePilot Cloud is the durable business system.
