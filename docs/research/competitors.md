# xTrain competitor teardown (landing page rebuild)

Captured 2026-10-10 with headless Chrome (`tools/shoot.mjs` plus a variant that declines cookie banners and closes popups before scrolling). Desktop 1440x900 for every site, mobile 390x844 for Runna, Ladder, HomeCourt and Techne. Hex values come from computed styles (`info.json` topColors) and were checked against the screenshots. Screenshot folders are named `research/competitors/<slug>/`.

**Loaded and reviewed (16 sites, 22 captures):** Runna, Ladder, Future, Techne Futbol, HomeCourt, PLAYERMAKER, Veo, DribbleUp (home + Smart Soccer Ball page), Anytime Soccer Training (home + 7-day plan + plan builder), Dribly (AI football coach, 2026), Trainsolo, Sorare, MOJO, Catapult One. Onboarding first screens were captured for Runna, Ladder, Future, Techne and Anytime. Nothing was submitted and no data was entered.

**Failed:** JOGO (jogo.ai) and aiScout (aiscout.io) both fail the TLS handshake from this network (`tlsv1 alert internal error`, same result with curl), so they were skipped. Nike Football loaded as a product grid only and isn't useful, so Sorare is the single culture reference. footly.app returned an empty page. toptekkers.com is now a casino domain.

---

## Part 1: Site by site

### Runna (runna.com): best plan-generation landing in the set
- **Hero:** H1 "Real coaching from real runners" (5 words), Manrope 700 at 96px, letter-spacing -4.8px (-0.05em), with "coaching" and "runners" in coral. Sub: "Get the support you need as a runner with tailored running plans to achieve your goals, from training for a faster 5k to completing your first marathon." (27 words). CTA "Start Your Free Trial", microcopy below it "First week free. Cancel anytime." Focal visual: a row of 5 real app screens plus 2 watches along the bottom edge, product UI only with no athlete photo. In the first viewport you can do one thing, click the CTA.
- **The key mechanic sits one scroll down:** "Run your personal best. Want to know what you're capable of achieving with a Runna plan? Use our estimated race time calculator and find out." Three phones walk through it: level chips (Beginner / Intermediate / Advanced / Elite), then distance chips (5k / 10k / Half / Marathon), then recent 5k time, then a days-per-week slider (1-7), then plan length chips (8 / 10 / 12 weeks), then "Generate my predicted race time", which shows "Estimated Marathon time in 10 weeks: 3:40 - 3:45", then "Build My Plan". Caption: "We'll give your estimated race time straight away. Let's get started…" The result comes before the account. On the landing page it's shown as static phones with a CTA "Hit Your PB"; it doesn't run inline.
- **Signup:** every CTA goes to `web.runna.com/survey`, a single phone-shaped card with a photo of a laughing runner, "Start your journey / Tell us about yourself and get a personalized plan that will help you become a better runner.", and the buttons "Create My Plan" / "Existing User". The first question is "How can we help you? I want to... Train for a race / Start running / Return to running / Improve my general fitness", one tap per option. Email comes after the plan.
- **Visual system:** #161616 / #333333 dark hero, #EDEDED and #FFFFFF body sections, a single coral accent #F07561 used on the CTA, the H1 highlight and the price line. Manrope for display, Inter for body. Diagonal section cuts. Medium density, about 1,700 words.
- **Motion:** Webflow plus Swiper carousels and a logo marquee ("As featured in"). Restrained, nothing gimmicky.
- **Steal:** a prediction or preview before signup; chip inputs instead of form fields; the plain price line "Start your plan today for just $19.99 per month / $119.99 per year"; "Your first week is on us."; coach cards with concrete credentials ("Fastest GB marathoner at the Tokyo 2020 Olympics").
- **Avoid:** the 5-phone row is generic at 390px, where it shrinks to unreadable thumbnails (see `runna-m/00c-hero-clean.png`). On mobile the calculator phones turn into a horizontal carousel you have to swipe to understand.

### Ladder (joinladder.com): best conversion pressure, aggressive look
- **Hero:** H1 "HILARY DUFF TRAINS ON LADDER" (5 words) in EK Modena Extended Heavy at 50px, uppercase, with no sub. CTA "FIND YOUR PLAN" (neon pill) and the microcopy "No Credit Card To Start • Cancel anytime", plus laurel badges "App Store 100k+ Reviews" and "Apple Finalist App of the Year 2025". Focal visual: a full-bleed celebrity photo. The only first-viewport action is the CTA.
- **Signup:** "FIND YOUR PLAN" appears about 12 times, including a mini pill in the sticky header. It goes to `/quiz`, which first shows a gallery of 10 named programs, each tied to a named coach and a one-line style ("Stevie Griffin IGNITE: Beginner-Friendly Progressive Overload", "Aria Vince ASCEND: Traditional Bodybuilding"), then "FIND YOUR PLAN" again to start the questions. An "Ask Maive" AI chat bubble sits on every page.
- **Second funnel, the strongest mechanic here:** the nav link "FREE WORKOUT OF THE DAY" goes to `/app/workout/today`. The whole session is public: workout name ("FLEXOR CAPACITOR, 52 Min, Upper Body Strength"), every exercise with thumbnail, duration and an audio-cue icon ("Arm Circles - Forward 0:30"), a countdown "ENDS IN 9 HR 47 MIN 39 SEC", a counter "466,904 workouts completed", and a sticky bottom bar "Enter Your Email | GET FREE WORKOUTS". You see the product before you're asked for anything.
- **Visual system:** #0E0E0E black, #FAFAFA off-white, and one acid accent #E6FF00. Extended-heavy caps for display, SF Pro for body. Pricing is drawn as embossed metal credit cards ("PRO ANNUAL $14.99/mo", "JOHN SMITH TEAM FORGED"). About 2,100 words.
- **Motion:** Next.js with 7 videos. Phones sit inside glowing neon rings, an Apple Watch shows a live timer, AirPods give off pulse rings. It feels polished but loud, close to gimmicky.
- **Steal:** the public, playable session with a daily countdown; one verb-led CTA repeated everywhere with a sticky mini version; programs that have names and an owner.
- **Avoid:** #E6FF00 on black (MOJO uses #CEFF1A the same way, so acid lime now reads as generic fitness app); celebrity-as-headline; repeating the CTA 12 times.

### Future (future.co): calmest, most premium onboarding
- **Hero:** H1 "Personal training, reimagined" (3 words) in a serif (seasonMix 84px, weight 400, -0.84px). Sub: "Dedicated coaching and support to help you train for what's next." (11 words). CTA "Find Your Coach", with the price stated under it: "$50 first month, then $199/month. Cancel within 30 days for a full refund." Focal visual: a muted full-bleed athlete photo behind a phone showing a coach message, "Hey Tom, shorter + lighter workouts to fit this week's travels!"
- **Signup:** goes to `/survey/intro`, headed "Match with an expert fitness coach". It explains the whole funnel up front in a 3-step card ("Take the 5-step quiz / Meet your coach / Start your plan") and puts the price next to the button ("~~$199~~ $50 first month"). The first question, "What's your top fitness goal?", is 6 full-width tap rows. Progress is shown as named tabs across the top ("Your Goal · Age · Coach Gender · Coach Style · Coach Intensity") instead of a bar, so you always know what's left.
- **Visual system:** #FFFFFF, #F5F6F6, #1C2127, #272A2B, with no brand color at all. Serif display with seasonSans body. Cards with 24px+ radii, lots of whitespace, about 560 words.
- **Motion:** 4 background videos and a horizontal card carousel ("Never train alone", "Designed for real life"). Premium and slow.
- **Steal:** show adaptation as a message inside the UI rather than a feature bullet; named-step progress; price and refund terms beside the CTA; "Move workouts, adjust days, and adapt your plan at any time without penalty."
- **Avoid:** "reimagined" and "A 360° roadmap that's uniquely yours" read as filler.

### Techne Futbol (technefutbol.com): closest solo-soccer competitor
- **Hero:** H1 "THE SOCCER TRAINING APP DESIGNED BY PROS" (7 words), Roboto Condensed italic uppercase at 48px. Sub: "For the motivated player looking to improve on their own" (10 words). CTA "START YOUR FREE TRIAL" as a sky-blue pill. Focal visual: a 3-phone fan labeled TRACK / TRAIN / COMPETE above an SVG wave divider.
- **Signup:** on desktop the CTA lands on `app.technefutbol.com/.../launch`, a dead-end page, "Open Techne on your phone", with a 5-step numbered list (open the email on your phone, install, register, tap the link again). There's no value before the install.
- **Good content further down:** drill names that sound real ("Drag Push Across", "Drag Fake Outside", "Drag Inside Outside Through"); a Days & Time scheduler with toggles ("Tuesday 10m, Thursday 15m, Saturday 10m"); and the **Training Sock System**, "like the belt system in martial arts", with 9 colored sock levels at 0 / 10 / 25 / 50 / 75 / 100 / 250 / 500 / 1000 hrs ("WHITE SOCK LEVEL, +1 MIN TRAINED, White signifies birth or beginning."). Leaderboards rank by hours trained (Global / State-wide / Club and Team, e.g. "Meredith G., Missouri, 370h 50m"). Founder quote: "This is the tool I would have gone crazy for as a player!" from Yael Averbuch, U.S. National Team 2006-2013.
- **Visual system:** #133140 navy, #414042 charcoal, #F2F2F2, accent #73C0D3 sky. Roboto, Roboto Condensed, Inter. Webflow, 5 videos, wave dividers. It looks about 2018.
- **Mobile:** the H1 wraps to 4 italic lines, the CTA stays above the fold, and the phone fan gets cropped by the wave.
- **Steal:** progression tied to something physical that teens get (sock colors); ranking by hours trained rather than by talent; real drill names.
- **Avoid:** condensed italic caps; the desktop dead end; "designed by pros".

### HomeCourt (homecourt.ai): the basketball analog
- **Hero:** H1 "UPGRADE YOUR GAME." (3 words) in DIN Condensed caps. The sub is 37 words: "HomeCourt is the interactive basketball app that takes your skills to the next level. It's the personal skills trainer that's always with you, capturing your performance, and providing you with guided feedback. With HomeCourt, every shot counts." The only CTA is an App Store badge. Focal visual: a background video of a smiling player.
- **Signup:** goes straight to the App Store. Nothing to try on the web.
- **Content:** sections "TRAIN SMARTER." / "LOVE THE GRIND." / "GET BETTER TOGETHER." / "SHOWCASE YOUR SKILLS." with tilted phones showing camera-tracking overlays ("CATCH AND SHOOT 129° LEG ANGLE 51° RELEASE ANGLE 1.0s"), plus NBA partnership and pro endorsements (Sue Bird, Steve Nash).
- **Visual system:** #1F1F1F and #000 with #FF4000 orange; DIN 2014, Oswald; jQuery. Feels dated.
- **Mobile:** the 37-word paragraph wraps to 7 lines in the first viewport, and there's no sticky CTA.
- **Steal:** camera-overlay numbers (angles, release time) make "AI feedback" concrete. Relevant only once Coach AI ships, and not to be claimed before then.
- **Avoid:** "Upgrade your game", "takes your skills to the next level", "UNLOCK THE PRO WITHIN.", store-only CTA.

### PLAYERMAKER (playermaker.com): hardware wearable
- **Hero:** H1 "BECOME THE PLAYER YOU'RE MEANT TO BE" (7 words), Maison Neue bold italic caps. Sub: "The foot-mounted wearable transforming every ball touch and every move into actionable insights, and proven, lasting improvement." (18 words). CTAs "BUY NOW" in hot pink and "DISCOVER HOW IT WORKS ▶". Focal visual: a tilted phone with skill dials (69 Two-footed, 76 Dribbling, 70 First touch, 88 Agility) and floating sensors over blurry grass. FIFA Quality badges sit top-left.
- **Friction:** an exit-style popup, "STOP. This offer's for you." / "Yes, give me $50 OFF" / "Maybe later".
- **Visual system:** #001838 navy, #121212, #FF0083 hot pink, sky-to-white gradients. 20 videos. Stat row "AVERAGE IMPROVEMENT... IN 90 DAYS: 34% / 27% / 18% / 45%". Man City "CITYPLAY" sub-brand with a Playercard.
- **Steal:** almost nothing for a no-hardware product. The weak-foot usage stat (45%) is a good example of a specific claim.
- **Avoid:** radar charts and 0-100 rating dials, FIFA-card language, "actionable insights", popups.

### Veo (veo.co, redirects to veo.com): most premium motion in the category
- **Hero:** H1 "Record, analyse, and livestream every match" (6 words), Oldschool Grotesk 500 at 64px. Sub: "Veo is the ultimate solution for coaches, players, and teams at every level." CTAs "Buy now" / "Book a call". Focal visual: a photo of the lime-green camera on a pole against the sky. A language-picker modal ("Welcome, Choose your language") blocks the page on load.
- **Visual system:** warm paper neutrals #F7F6F3 / #EFEDE7 / #E6E3DC, deep green #093E14 and #1B221B, black. Protokoll condensed for huge step numerals ("01 / 02 / 03" at about 200px).
- **Motion:** GSAP + ScrollTrigger + SplitText, Swiper, and 50 `<video>` elements. Numbered steps scroll beside sticky video cards, and the analytics section shows floating stat tiles ("Distance tracked 116.5 km", pass network, heatmap). Premium, but heavy.
- **Steal:** the warm paper palette (no consumer soccer app uses it); big numerals for a 3-step "how it works"; stat tiles floating around one central object.
- **Avoid:** "the ultimate solution", "Turn key moments into winning insights", blocking modal on load.

### DribbleUp (dribbleup.com + /products/smart-soccer-ball): parent-facing e-commerce
- **Home hero:** a holiday sale banner, "SPECIAL HOLIDAY OFFER, 50% OFF SPORTS, Best Sale of the Season", plus a yellow top bar "50% OFF & Free Speed Program 10:01:07" with a ticking countdown and a modal "Unlock 10% off your order" that asks you to pick a sport. Title tag: "Perfect Gifts For Kids".
- **Soccer page:** an advertorial listicle, "7 Reasons Why 100,000+ Players Have Trained with the Dribbleup Smart Soccer Ball", with the subhead "The training ball that's quietly changing how kids develop their touch and confidence on the ball". The reasons are written well and plainly: "More Touches in 15 Minutes Than Most Kids Get All Week", "Your Kids Will Actually Want to Practice", "4. Train Any Time, Anywhere: Backyard, basement, driveway, it doesn't matter." Sticky buy box: $29.99 (was $59.99), "Membership separate. Unlimited soccer classes free for 10 days, then $19.99/mo+tax."
- **Visual system:** white, #000, the ball's yellow, sale red #CC0000, link blue #0D6DE8. Soin Sans Neue. Real backyard and living-room photos (phone on a tripod pointed at a kid on grass).
- **Steal:** the setting-specific copy ("backyard, basement, driveway"), the "touches in 15 minutes" style of comparison, and photos taken where the training actually happens.
- **Avoid:** countdown timers, discount modals, and writing to parents when the user is the teen.

### Anytime Soccer Training (anytime-soccer.com): youth soccer, parent/coach-facing
- **Hero:** H1 "The Complete Soccer Training Platform for Youth Players" (8 words), 64px 800, in a navy rounded panel. Sub: "Structured programs, expert-led follow-along videos, and coach-assigned homework, so players build real skill at home." (17 words). CTAs "Start Training Free →", which actually goes to /pricing, and "Request Team Demo". Focal visual: a muted YouTube-style video ("DON'T LET IT BOUNCE"). Trustpilot "4.9 (9,651)" and "Trusted by 50,000+ players in 80+ countries worldwide".
- **Skill tabs:** "GET YOUR FREE 7-DAY TRAINING PLAN" with a left rail of 5 tabs (Ball Mastery / Dribbling / Juggling / Passing / 1v1) that swap a large drill video ("NEXT UP: V-Pulls Switch Feet with Inside Foot Touches").
- **7-day plan page** (`/free-soccer-drills-for-kids`): the plan is listed before the form ("1 Ball Mastery 10 min • Follow-along, 2 Juggling Basics, 3 Cone Drills, 4 Dribbling Skills, 5 + 3 More Days... Passing, Shooting & Skills Test"), then First name / Last name / Email / "Send My Free Plan". Testimonial: "Finally, a plan I can just hand to my daughter. She presses play and knows exactly what to do."
- **Plan builder** (`/free-training-plan`): "Stop Guessing. Start Training. A personalized plan for your player, free, in 60 seconds." A 3-step stepper (1 Your Info, 2 Skill Areas, 3 Preferences) whose **first step asks for Player's name and Your email** ("We'll email the PDF directly to you."). That's email first with nothing shown yet, the exact pattern xTrain should avoid.
- **Visual system:** #0F3154 navy, #DC373E red, #F5F7FA, Tailwind default type (ui-sans-serif). Emoji icons. Lots of ebooks and blog thumbnails with stock-thumbnail type.
- **Steal:** listing the plan days with durations before the ask; skill tabs that swap a real drill video; the "presses play" line as a model of plain copy.
- **Avoid:** navy plus red; email at step 1; "The Complete ... Platform"; a CTA labeled "Free" that lands on pricing.

### Dribly (dribly.app): the 2026 "AI football coach" template
- **Hero:** pill "Early access" with 3 avatars and 5 stars, eyebrow "Dribly, Your AI Football Coach App", H1 "Your AI Football Coach" (4 words) in Inter 900 at 80px, -3.2px, with "Football Coach" in blue. Sub: "Improve faster with personalized football drills, AI coaching, and training plans built around your goals." (15 words). CTAs are App Store / Google Play badges. Stat row: "3x Faster football skill improvement · 5 min Daily training commitment · 100% Personalized to your game". Focal visual: 3 glowing phones on a navy-black gradient (Video Analysis 82/100, biomechanics 78/100).
- **Scroll:** a paragraph that fills in word by word as you scroll ("Your AI football coach analyzes every touch, builds personalized drills, plans smarter training sessions, and tracks your football skill improvement."), then a 3-card row (Video Analysis / Training Plan / Nutrition + Streaks), then alternating feature rows with checkmark bullets and phones edged in blue light.
- **Visual system:** #0D0E18 / #111118 background, #3B82F6 blue (Tailwind blue-500), #94A3B8 slate (Tailwind slate-400), Inter only. Copy is SEO-stuffed ("football skill improvement" appears in nearly every block).
- **This is what xTrain must not look like.** It's the default output of an AI site builder: dark navy, Tailwind blue, Inter 900 with tight tracking, glowing tilted phones, an "early access" avatar pill, unsupported 3x / 100% stats, and a word-reveal paragraph.

### Trainsolo (trainsolosoccer.com): solo soccer, Wix
- **Hero:** wordmark "TRAINS⚽LO, ENHANCED INDIVIDUAL TRAINING" in red serif caps, a link "WHAT IS TRAINSOLO ›", App Store / Google Play badges, and a letter-spaced italic tagline "TRAINSOLO GIVES SERIOUS SOCCER PLAYERS THE EDGE TO COMPETE, ACHIEVE THEIR GOALS, AND HELP OTHERS". Background: a stadium action photo of adult players. No real H1 (the first h1 in the DOM is "Learn more about how we designed trainsolo...").
- **The interesting part is the phone mock.** It shows a plan generator: participants 1 / 2; a session-objective grid (Dribbling / Passing / Shooting / Fitness / Juggling / Ball mastery); a number-of-drills ruler 3-7; durations 20 mins / 45 mins / 1 hr+; and buttons "Generate plan" / "Build own plan". Further down is the in-session timer screen ("ROUND: 3 • REPS: 10, 01:54", big red pause). **This is the interaction xTrain should make live on its landing page; Trainsolo only shows a picture of it.**
- **Visual system:** black / white / red #E21C21, with 10 font families loaded (lulo, DIN, Avenir, stencil, Playfair, and others). "What if...?" section headlines.
- **Avoid:** stadium photography of adults for a backyard product, the font soup, store-only CTAs.

### Sorare (sorare.com/football): culture reference
- **Hero:** a promo strip "WELCOME OFFER: GET $100 FREE ON YOUR FIRST CARDS!*", H1 "SCOUT. PLAY. WIN." (3 words, pressio condensed at 69px), sub "Build your 5-player lineups. When they shine on the field, you earn rewards!" (13 words). In the center of the hero is a black card, "YOUR NAME. YOUR LEGEND.", with one text input, "Your Manager name", plus "Add a code" and "Create your team". Player cards with rating hexes (83, 88, 76, 67) fan out on both sides.
- **Mechanic:** the first input is your identity (a manager name), not your email. It's fun to type, it costs nothing, and it commits you.
- **Further down:** a huge counter that ticks up live, "Sorare Managers Playing 5,643,561"; investor/partner portraits (Rio Ferdinand, Kylian Mbappé, Gerard Piqué).
- **Visual system:** #101010, #FFFFFF, #7029FF violet, pixel-glitch stadium textures.
- **Steal:** the name field in the hero; a live counter as social proof.
- **Avoid:** FUT-card rating hexes and the glitch-stadium aesthetic. That's the game's look, not a training app's.

### MOJO (mojo.sport): youth sports, now TeamSnap
- **Hero:** "MOJO IS NOW A TEAMSNAP COMPANY" (corporate news as the hero), CTA "LEARN MORE", a kid in a purple jersey on a blue duotone pitch. Tabs "1 - MEET MOJO / 2 - COACHING, MADE EASY / 3 - TEAM MANAGEMENT, SIMPLIFIED / 4 - NEVER MISS A MOMENT". "GET THE APP FOR FREE" appears 6 times.
- **Visual system:** #1A202C, #8000FF purple, #CEFF1A lime, #0099FF blue; Teko condensed caps with Lato. A lightning "MVP" trading card for a kid.
- **Avoid:** this whole palette (purple + lime + electric blue) and "X, made easy / Y, simplified" headings.

### Catapult One (catapult.com/solutions/catapult-one): B2B wearable
- **Hero:** "CATAPULT ONE TEAM" (Mark Pro Condensed caps with an orange underline). Sub: "Trusted by the world's top teams, Catapult One is the ultimate tracking tool, for players and coaches at all levels." CTA "Speak to Sales". An American college football photo appears on a page that also covers soccer.
- **Visual system:** black, #005BBB blue, #FF5500 orange. Mostly irrelevant. Included as an example of sales-led, "ultimate tool" copy.

---

## Part 2: Synthesis

### 1. Category defaults xTrain must avoid

**Palettes already owned.** Nearly every consumer soccer or sport app is a dark base plus one electric accent:
| Accent | Who |
|---|---|
| Acid lime #E6FF00 / #CEFF1A | Ladder, MOJO (and Veo's camera, Playermaker's CITYPLAY tag) |
| Tailwind blue #3B82F6 on #0D0E18 | Dribly (the AI-template default) |
| Hot pink #FF0083 on navy #001838 | PLAYERMAKER |
| Navy #0F3154 + red #DC373E / #E21C21 | Anytime, Trainsolo |
| Navy #133140 + sky #73C0D3 | Techne |
| Violet #7029FF / #8000FF | Sorare, MOJO |
| Orange #FF4000 / #FF5500 | HomeCourt, Catapult |
| Coral #F07561 | Runna |

Open territory: a **light, warm-neutral base** (only Veo #F7F6F3 and Future #FFFFFF/#F5F6F6 are light, and neither sells a consumer soccer app) with one accent outside the table above. Lime is the most overused, so skip it even though it feels "sporty".

**Type defaults.** Condensed or extended caps, often italic: Techne (Roboto Condensed italic), PLAYERMAKER (Maison Neue bold italic), HomeCourt (DIN Condensed), MOJO (Teko), Catapult (Mark Pro Condensed), Ladder (EK Modena Extended Heavy), Sorare (pressio). The AI-template alternative is Inter 900 at -0.04em (Dribly). Future's serif display is the only one that stands out, and it's for adults.

**Imagery defaults.**
- Tilted floating phones with glow or neon rings (Dribly, Ladder, PLAYERMAKER, HomeCourt), or a row of 3-5 phones (Techne, Runna).
- Floodlit stadium or match photography of adults (Trainsolo, Catapult, Veo), when the xTrain user is a 15-year-old in a driveway.
- 0-100 skill dials, radar charts and FUT-style rating cards (PLAYERMAKER 69/76/70, Dribly 78/100, Sorare 83/88). xTrain has skill ratings; show them as progress over sessions, not as a player card.
- Pro or celebrity endorsement as the hero (Hilary Duff, NBA, Man City, "designed by pros").

**Copy defaults.** "Upgrade your game", "Become the player you're meant to be", "Unlock the pro within", "takes your skills to the next level", "Your AI Football Coach", "3x faster", "100% personalized", "the ultimate solution/tool", "The Complete ... Platform", "reimagined", "actionable insights".

**Funnel defaults.** App Store badges as the hero CTA, which leaves a desktop visitor nowhere to go (HomeCourt, Dribly, Trainsolo; Techne's desktop CTA ends on "Open Techne on your phone"). Discount pressure such as countdowns and "STOP. This offer's for you." popups (DribbleUp, PLAYERMAKER). Copy written to parents ("your player", "your kids") when the user is the teen.

### 2. Most steal-worthy mechanics for "interact right away and get pulled in"

1. **Prediction before account (Runna).** 4-5 chip or slider inputs, then a concrete result ("Estimated Marathon time in 10 weeks: 3:40 - 3:45"), then "Build My Plan". xTrain version: pick position, minutes and equipment in the hero, and Week 1 renders immediately with real drill names and durations. Runna only shows its calculator as static phones; xTrain should make it run inline.
2. **A public, playable session (Ladder Free Workout of the Day).** The whole session is listed (exercise, thumbnail, 0:30, audio icon), with a daily countdown ("ENDS IN 9 HR 47 MIN"), a running counter ("466,904 workouts completed"), and a sticky email bar at the bottom. xTrain version: "Today's session" (wall passes, cone dribbling) that starts in the browser with the real timer, cues and rest screen, plus "Save this and get tomorrow's" as the email ask.
3. **Identity input instead of email first (Sorare).** "YOUR NAME. YOUR LEGEND." with a single "Your Manager name" field. xTrain version: the first typed input is a first name or nickname, which then labels everything ("Maya's 6-week plan"). It's cheap to give and it creates ownership.
4. **Named-step quiz with one tap per screen (Future, Runna).** Future explains "Take the 5-step quiz / Meet your coach / Start your plan" before you start, and shows progress as named tabs ("Your Goal · Age · Coach Style"). Runna's first question, "I want to... Train for a race / Start running / Return to running", is one tap.
5. **Adaptation shown as a message in the UI (Future).** "Hey Tom, shorter + lighter workouts to fit this week's travels!" sells adaptivity better than any bullet. xTrain version: after a demo session, the visitor taps "Too easy" and sees Thursday's wall passes change in place (two-touch to one-touch, 30 to 40 reps), with a one-line note explaining why.
6. **Progression with a physical metaphor (Techne sock levels).** 9 sock colors at 0 to 1000 hrs, "like the belt system in martial arts", and leaderboards by hours trained. xTrain's XP and streaks need a metaphor like that, not a bare number.
7. **The plan listed before the ask (Anytime 7-day page).** "1 Ball Mastery, 10 min • Follow-along ... 5 + 3 More Days". Anytime then breaks its own pattern on the builder page by asking for email at step 1; copy the list, not the builder.
8. **Honest terms under the CTA (Runna, Ladder, Future).** "First week free. Cancel anytime." / "No Credit Card To Start • Cancel anytime" / "$50 first month, then $199/month." The xTrain equivalent: "Free during early access. No app to download yet."

### 3. First-viewport recipe for xTrain

- **Headline:** 4-8 words, sentence case, naming the setting or the job. Runna's 5-word H1 is the right length. Sub at most 20 words (Runna's 27 and HomeCourt's 37 are too long on mobile). The headline should state who it's for and where: alone, a ball, a wall, a driveway.
- **One focal object:** a live plan card, not a phone mock or a stadium photo. It holds 3 chip rows (Position · Minutes per session 15/20/30/45 · Equipment: Ball / + Wall / + Cone) and below them a Week 1 preview that re-renders on every tap (day, drill names, durations, one coaching cue). The 3D technique demo is the one thing in this category nobody else has (no site loaded three.js or WebGL), so use it inside that card or one scroll down, tied to a drill ("plant foot here"), never as a spinning hero ornament.
- **What the visitor can do in about 5 seconds:** tap a chip and watch the plan change. Secondary action: "Try today's session", which opens the in-browser session player.
- **CTA wording (plain verbs plus a noun, no hype):** "Build my plan", "See week 1", "Try a session", "Save my plan". Not "Unlock", "Elevate", "Get started", "Join the revolution", "Start your journey".
- **Proof line under the CTA:** one honest line, such as "Free during early access. Web app now, phone app later."
- **Mobile (390px):** headline in 2-3 lines, chips scroll horizontally in one row each, the Week 1 preview shows its first 2 days above the fold, and a sticky bottom CTA appears after the first chip tap (Ladder's sticky pill is the model).

### 4. Signup flow recommendation

- **Step 0, on the landing page with no navigation:** 3 chips (position, minutes, equipment) produce the Week 1 preview.
- **"Build my plan" opens a full-screen flow, one question per screen with big tap rows and named progress tabs (Future):**
  1. Level (4 options with a one-line description each, e.g. "I can do 20 juggles")
  2. Goals, pick up to 2 (weak foot, first touch, finishing, passing range, 1v1)
  3. Days: weekday toggles in the style of Techne's "Tuesday 10m / Thursday 15m"
  4. First name or nickname (the Sorare move), used to title the plan

  Minutes and equipment carry over from step 0. That's about 6 taps and under 45 seconds.
- **Reveal:** "Maya's 6-week plan", with Week 1 in full detail, weeks 2-6 titled with their focus, a baseline for the skill ratings, and one example of what changes after "too easy" / "too hard".
- **Email last, one field:** "Save this plan and get early access". Add an age-band checkbox (13+, or a parent's email under 13). No password and no app-store redirect.
- **After submit:** their place in line, plus "Start session 1 now", which opens the web session player so they leave having trained once.
- **Ruled out:** email at step 1 (Anytime), store-only CTAs (HomeCourt, Dribly, Trainsolo), the desktop dead end (Techne), a blocking modal on load (Veo's language picker, DribbleUp's discount).

### 5. Copy observations: human vs AI-sounding

**Sounds human (specific place, number, action or feeling):**
- DribbleUp: "More Touches in 15 Minutes Than Most Kids Get All Week"; "Backyard, basement, driveway, it doesn't matter."; "Your Kids Will Actually Want to Practice"
- Anytime testimonial: "She presses play and knows exactly what to do."
- Ladder: "Know exactly what workout to do, every day"
- Techne: "For the motivated player looking to improve on their own"; founder quote "This is the tool I would have gone crazy for as a player!"
- Runna: "Your first week is on us."; "We'll give your estimated race time straight away."; cookie banner "Cookies aren't just great for fuelling your long runs..."
- Future: "Move workouts, adjust days, and adapt your plan at any time without penalty."
- Sorare: "When they shine on the field, you earn rewards!"

**Sounds AI-written or generic (abstraction, triads, superlatives):**
- Dribly: "Your AI football coach analyzes every touch, builds personalized drills, plans smarter training sessions, and tracks your football skill improvement."; "3x Faster football skill improvement"; "100% Personalized to your game"; "Everything you need to improve your football skills."
- PLAYERMAKER: "transforming every ball touch and every move into actionable insights, and proven, lasting improvement"
- Veo: "Veo is the ultimate solution for coaches, players, and teams at every level."; "Turn key moments into winning insights"
- HomeCourt: "takes your skills to the next level"; "UNLOCK THE PRO WITHIN."
- Future: "Personal training, reimagined"; "A 360° roadmap that's uniquely yours"
- Catapult: "the ultimate tracking tool... Elevate your team's training, mitigate injury risks"
- Anytime: "The Complete Soccer Training Platform for Youth Players"
- Trainsolo: "gives serious soccer players the edge to compete, achieve their goals, and help others"

**Rule of thumb from the set:** the human lines name a place (driveway), a duration (15 minutes), a body action (presses play), or a real feeling ("would have gone crazy for"). The AI-sounding lines name abstractions (insights, potential, next level, solution) and list three things. For xTrain, write as if to a 15-year-old who trains alone after school, never to "athletes" or "players at every level".

---

## Appendix: capture index
| Slug | URL | Notes |
|---|---|---|
| runna, runna-m, runna-survey, runna-q | runna.com, web.runna.com/survey | desktop + mobile + onboarding Q1 |
| ladder, ladder-m, ladder-quiz, ladder-wod | joinladder.com, /quiz, /app/workout/today | |
| future, future-survey, future-q | future.co, /survey/intro, /survey/fitness_goal | |
| techne, techne-m, techne-signup | technefutbol.com, app.technefutbol.com launch | |
| homecourt, homecourt-m | homecourt.ai | |
| playermaker | playermaker.com | |
| veo | veo.co → veo.com | GSAP/ScrollTrigger/SplitText |
| dribbleup, dribbleup-soccer | dribbleup.com, /products/smart-soccer-ball | |
| anytime, anytime-7day, anytime-builder | anytime-soccer.com, /free-soccer-drills-for-kids, /free-training-plan | |
| dribly | dribly.app | |
| trainsolo | trainsolosoccer.com | Wix |
| sorare | sorare.com/football | |
| mojo | mojo.sport | |
| catapult | catapult.com/solutions/catapult-one | |
| jogo, aiscout | jogo.ai, aiscout.io | TLS handshake failed, skipped |
| nike | nike.com/w/soccer | product grid only, not used |
