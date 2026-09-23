# Rebuild Bundler from the uploaded Figma

## Goal
Match the uploaded Bundler Figma as closely as its extracted design data allows, while keeping the existing dashboard interactions working.

## Implementation
- Replace the current Plus Jakarta styling with the Figma’s Inter and Bricolage Grotesque type system.
- Rebuild the shared navigation, header, content width, spacing, corners, borders, and shadows from the Figma’s 1440 px desktop frames.
- Apply the exact extracted palette, including the primary `#3847D2`, neutral surfaces, referral green, plan navy, and status colors.
- Recompose the home dashboard to match the Figma’s hierarchy: welcome header, referral feature, current plan, service credentials list, and quick actions.
- Restyle subscription, payment history, settings, referrals, support, and service-detail views using the same exact visual language without removing working controls.
- Add the Figma’s missing account-entry flow: sign in, create account, plan selection, password reset, and password creation states.
- Fix the current server/client date mismatch so the first render is stable.

## Validation
- Compare the implemented desktop view at 1440×900 against the Figma reference.
- Check mobile behavior and all key interactions.
- Verify every page renders without console errors or clipped/overlapping content.

## Reference limitation
The uploaded extraction includes exact colors, typography, frame names, and a whole-canvas thumbnail, but not element-level coordinates or full-size frame renders. The implementation will faithfully use all available values; pixel-level comparison would require exported full-size frame images or a live Figma desktop connection.
