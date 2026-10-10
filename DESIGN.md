---
name: xTrain
description: A training ground seen from straight above. Concrete, asphalt ink, and saucer-cone orange.
colors:
  ground: "oklch(0.928 0.004 150)"
  ground-deep: "oklch(0.895 0.005 150)"
  paper: "oklch(0.978 0.002 150)"
  joint: "oklch(0.86 0.005 150)"
  slab: "oklch(0.885 0.005 150)"
  slab-joint: "oklch(0.8 0.007 150)"
  ink: "oklch(0.2 0.008 255)"
  ink-2: "oklch(0.42 0.008 255)"
  ink-3: "oklch(0.49 0.006 255)"
  cone: "oklch(0.69 0.19 44)"
  cone-top: "oklch(0.77 0.16 56)"
  cone-deep: "oklch(0.6 0.18 38)"
  ball: "oklch(0.985 0.002 100)"
  error: "oklch(0.5 0.17 30)"
typography:
  display:
    fontFamily: "Anybody, Hanken Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(46px, min(6.4vw, 10.4svh), 96px)"
    fontWeight: 800
    lineHeight: 0.93
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Anybody, Hanken Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(34px, 4.3vw, 62px)"
    fontWeight: 790
    lineHeight: 0.98
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Anybody, Hanken Grotesk, ui-sans-serif, sans-serif"
    fontSize: "19px"
    fontWeight: 760
    lineHeight: 1.3
    fontVariation: "'wdth' 104"
  numeral:
    fontFamily: "Anybody, Hanken Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(40px, 3.8vw, 56px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 104"
  lead:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 480
    lineHeight: 1.4
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 440
    lineHeight: 1.5
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 620
    lineHeight: 1.3
  meta:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 520
    lineHeight: 1.4
    fontFeature: "'tnum' 1"
rounded:
  none: "0px"
  focus: "6px"
  screen: "26px"
  sheet: "28px"
  device: "34px"
  control: "999px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "64px"
  s9: "96px"
  gutter: "clamp(20px, 3.4vw, 56px)"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "52px"
  button-ink-small:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "40px"
  button-text:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "12px 8px"
  chip:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  chip-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
  kit-chip:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 15px 0 5px"
    height: "46px"
  kit-chip-on:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  signup-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "6px"
  minutes-segment:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    width: "46px"
    height: "40px"
  minutes-segment-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  phone:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.device}"
    padding: "9px"
    width: "clamp(180px, 15vw, 224px)"
  phone-screen:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.screen}"
    padding: "22px 16px"
  slab-window:
    backgroundColor: "{colors.slab}"
    rounded: "{rounded.none}"
  join-field:
    backgroundColor: "{colors.cone}"
    textColor: "{colors.ink}"
  dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    width: "min(560px, calc(100vw - 32px))"
---

# Design System: xTrain

## Overview

**Creative North Star: "The Driveway From Above"**

Every surface is a training ground seen from straight overhead. Cool poured concrete is the page, asphalt ink draws everything that is placed or written on it, and saucer-cone orange belongs to the kit. Drills are not illustrated; they are set out, as top-down coaching diagrams on a flat slab cut by a hard grid of expansion joints. The slab is never tilted into perspective: it is the ground itself, seen through square-cornered windows that may bleed off the page edge.

The page is quiet and dense with meaning rather than with words. Type is achromatic and large; diagrams carry the explanation. One kit state (gear plus minutes) feeds every live surface, so when the visitor changes what they have, the hero field, the session lane, the phone, and the join plan all move together. Motion has mass: objects slide to new spots, routes draw themselves on, numbers count and settle.

Depth is physical, not optical. Things sit on the ground in flat layers (a cone on the slab, a phone lying beside it) and nothing casts a shadow, glows, or frosts. The page refuses the category look: night-stadium athlete photography, neon-green buttons, floating phones, and grids of feature cards.

**Key Characteristics:**
- One ground (concrete), one ink (asphalt), one kit colour (saucer-cone orange).
- Flat top-down diagrams in coaching notation, drawn on a jointed slab.
- Square-cornered ground windows; pill-shaped controls; nothing in between.
- Anybody wide and heavy for display; Hanken Grotesk for everything read.
- A single page state that every live surface renders.
- A static concrete grain over everything, never animated.

## Colors

A near-neutral concrete-and-asphalt palette with a faint green cast in the grounds, a faint blue cast in the inks, and one saturated orange that lives only on the kit.

### Primary
- **Saucer-Cone Orange** (cone): the brim of every cone, the cone glyphs on the kit chips and the session lane, and the one section that floods: the join field. The stuck top bar takes the same orange while it sits over that field.
- **Cone Crown** (cone-top): the lighter top ring of a cone seen from above. Never used on its own.
- **Cone Shade** (cone-deep): the text caret in email fields; reserved for small kit-coloured accents inside inputs.

### Neutral
- **Driveway Concrete** (ground): the page background and the base under the grain. Also the fill of a friend's player disc.
- **Washed Concrete** (ground-deep): the hover wash on unselected minute segments.
- **Poured Slab** (slab): the face of every diagram window and of the library strip; also fills the hole in each cone so the ground shows through.
- **Expansion Joint** (slab-joint): the 3px hard joint lines cut into the slab.
- **Section Joint** (joint): the 1px hairline between page sections and above the session lane, and the top bar's bottom edge once stuck.
- **Chalk Paper** (paper): fields, the active kit chip, the phone screen, the dialog, and text on ink.
- **Asphalt Ink** (ink): all type, walls, players, routes, arrowheads, ball seams, goal frames, primary buttons, selected chips, and the phone body.
- **Worn Ink** (ink-2): secondary text, captions, route labels, meta lines.
- **Faded Ink** (ink-3): inactive run steps, placeholders, the scrollbar thumb. Holds at least 4.4:1 on slab and 5:1 on ground; never go lighter.
- **Ball White** (ball): the skin of the ball, always with ink panel and seam.
- **Error Brick** (error): the single state exception, used only for a failed signup message.

### Named Rules
**The Kit-Only Orange Rule.** Orange appears on cones and on the one flooded join field, nowhere else. No orange buttons, links, headings, or highlights. A second flooded section breaks the system.

**The Ink Is The Only Line Colour Rule.** Every drawn mark (route, arrow, wall, goal frame, net, player, ball seam, button, rule inside the join field) is ink, at full strength or reduced opacity. The only non-ink lines are the ground's own joints (joint and slab-joint), which belong to the concrete, not to the drawing.

**The Achromatic Type Rule.** Text is ink, ink-2, ink-3, or paper. Colour lives on the kit. The error message is the one exception and stays a state, never a style.

## Typography

**Display Font:** Anybody, variable width (with Hanken Grotesk, ui-sans-serif)
**Body Font:** Hanken Grotesk (with ui-sans-serif, system-ui)

**Character:** Anybody is pushed wide (104 to 122 percent width) and heavy (740 to 840) with tight negative tracking, so headlines read like painted lettering on a court. Hanken Grotesk is a calm, slightly heavier-than-regular grotesk (440 body) that stays legible in sun glare.

### Hierarchy
- **Display** (800, 46 to 96px fluid, 0.93, -0.035em, width 112%): the hero headline in two set lines; the join headline uses the same voice at 820 and up to 88px.
- **Headline** (790, 34 to 62px fluid, 0.98, -0.03em, width 112%): one per section. No line of helper text above it; at most one short line below.
- **Title** (740 to 760, 17 to 19px, width 104%): drill names in the library and on the phone; the adapt question rises to 20 to 26px at 720.
- **Numeral** (800, 40 to 56px, tabular figures): the phone's countdown and any number that changes live.
- **Lead** (480, 19px, 1.4, ink-2, 26 to 34ch): the single supporting line under a headline.
- **Body** (440, 17px, 1.5; 16px under 560px): run steps, FAQ answers, capped at 58ch.
- **Label** (600 to 680, 14 to 16px): buttons, chips, captions, figcaptions, step titles.
- **Meta** (500 to 540, 12 to 13px, tabular figures, ink-2): minutes in the lane, drill block and gear, phone counters.
- **Brand mark** (Anybody 820, 22px, width 122%, -0.02em, with the "x" at 520): the wordmark. The footer repeats it at up to 96px, 840, width 118%.

### Named Rules
**The Wide For Names Rule.** Anybody sets headlines, drill names, the brand mark, and live numerals. Everything a visitor reads in sentences, taps, or scans is Hanken Grotesk.

**The Numbers Have Mass Rule.** Every number that changes (minutes, the countdown) uses tabular figures and tweens to its new value, then settles. Numbers never snap.

## Layout

A full-bleed single column with a fluid gutter (20 to 56px). Sections are separated by hard cuts: a 1px section-joint hairline and a change of composition, never a fade or a tinted band. The hero is a three-row grid (headline across the top; action column and drill field; session lane along the bottom) with the field taking the wider column (6.8 to 5.2) and bleeding off the right edge. The run section is pinned for 220 percent of the viewport and splits 7 to 5 with its slab bleeding off the left edge. The adapt board is today, question, tomorrow. The library is one continuous slab that is dragged and drifts with scroll, every drill drawn at one shared scale so each takes the ground its setup actually needs.

Spacing follows a 4px-based scale (4, 8, 12, 16, 24, 32, 48, 64, 96). Section padding is 96px top on content sections and 64px inside pinned compositions; control gaps are 6 to 8px.

Responsive changes: at 1023px and below the hero becomes one column ordered headline, line, email, field, kit, lane; the field and run slab go edge to edge; the lane turns vertical with cones on an ink spine; the adapt board stacks with the question below today. At 560px the email row stacks into a 26px-radius block with a full-width button.

### Named Rules
**The One State Drives The Page Rule.** There is one kit state (gear and minutes). The hero field, the session lane, the run phone, the adapt drill, and the join plan all render from it and change in lockstep. A new live surface subscribes to that state; it never keeps its own copy.

**The Ground Is A Window Rule.** Diagrams are windows onto one continuous jointed slab, not cards. Windows are square-cornered and may bleed off any page edge.

## Elevation & Depth

The system is flat. There are no box shadows, drop shadows, glows, glass, or tonal gradients anywhere. Depth comes only from flat layers overlapping in a physical order: slab, then fixtures (wall, goal), routes, labels, cones, players, and the ball on top. The phone lies flat on the slab beside the drill, rotated -7deg, casting nothing. The step-two dialog sits over a flat ink scrim at 55 percent. Hard-stop gradients are allowed only as drawing tools (a cone's concentric rings in the lane, the joint grid on the library slab, the FAQ plus mark); they never shade.

### Named Rules
**The Depth By Overlap Only Rule.** Something is above something else because it covers it. Never because of a shadow, a blur, or a lighter tone.

**The Still Grain Rule.** A single static concrete grain (fractal noise at 7 percent, multiplied) sits over the whole page. It never moves.

## Shapes

Two shape families and nothing in between. Controls are full pills (999px): buttons, chips, kit chips, minute segments, the email row. Ground is square: every slab window and the library strip have 0 radius. Objects use their real silhouettes seen from above: round cones with a centre hole, a round ball with a pentagon panel, round player discs with a chevron for facing, a wall as one solid ink bar, a goal as a three-sided frame with a fine net. The phone (34px body, 26px screen) and the dialog (28px) are the only rounded rectangles. Drill zones are dashed ink rectangles at 6px corners and 35 percent opacity. Strokes are mostly 1.5px on controls and 3 to 4px on routes.

## Components

### Buttons
Solid, confident, and always ink.
- **Shape:** full pill (999px).
- **Primary (ink):** ink fill, paper label at 620, 52px tall (48px inside the email row, 40px small in the top bar), 24px side padding, trailing arrow icon at 15px.
- **Hover / Focus:** fill lifts to a slightly lighter ink (oklch 0.28) and the arrow steps 3px right; press scales to 0.97; focus is a 2px ink outline at 3px offset.
- **Text button:** ink-2, underlined at 0.25em offset, 12px by 8px padding. Used for "Skip".

### Chips
- **Style:** transparent pill, 44px tall, 1.5px border of ink at 22 percent, label 560 at 15px.
- **State:** selected fills ink with paper text; hover on unselected darkens the border to full ink; press scales to 0.97.

### Kit chips (signature)
The gear toggles. Each carries a 32px top-down glyph of the real object drawn with the field's own marks.
- **Off:** 1.5px dashed border at ink 38 percent, ink-2 text, glyph at 55 percent opacity, transparent.
- **On:** paper fill, solid 1.5px ink border, ink text, glyph at full strength. The ball chip is always on and fixed.

### Inputs / Fields
- **Style:** the email field and its submit button live in one paper pill with a 6px inset and a 1.5px border at ink 14 percent; inside the orange join field the border is transparent.
- **Focus:** the row border turns full ink; the caret is cone-deep.
- **Error / Done:** the status line under the row turns error for failures; on success the row border holds at ink.

### Navigation
The top bar is only the wordmark and a small ink button. It starts transparent over the hero, gains a ground fill and a joint hairline once scrolled 40px, and swaps to cone orange with an ink-14-percent hairline while over the join field.

### Session lane (signature)
Today's session as a row of cones on the ground. A cone marks the start of each drill and one closes the lane; a 2px ink line joins them at 18 percent, full ink for the focused drill. Segment widths are proportional to minutes and tween when the session changes. A 15 / 30 / 45 segmented control sits at the left. When the session changes, a ball rolls along the lane while the old names slide out under a mask. The join field repeats the lane vertically on an ink spine with inverted cones.

### Drill field (signature)
**The Coaching Notation Rule.** Routes follow coaching-diagram notation and nothing else: a solid ink line with an arrowhead for a pass, a dotted ink line (round caps, 1 on 11) for a run without the ball, a wavy ink line for a dribble. Labels are lowercase, one or two words ("pass", "back", "first touch"), set in Hanken 600 at ink-2, placed on the side away from the nearest other route, and never smaller than 14px on screen. Routes draw themselves on, arrowheads appear only once the line is complete, then the ball and player travel the routes on a loop. When the drill changes, the same cones slide to their new spots rather than being redrawn.

### Session phone (signature)
**The Phone Lies Flat Rule.** The phone is an object on the ground, not a floating device: it lies on the slab beside the drill, rotated -7deg, with an ink body, a paper screen, a counter, the drill name, a huge countdown, one cue, an ink progress bar that drains, and the next drill. It never tilts in 3D, levitates, or casts a shadow.

### FAQ
Ink rules at 30 percent between items, 19px questions at 660, a drawn plus that turns 45deg to close, answers that open by animating height.

## Do's and Don'ts

### Do:
- **Do** draw every new diagram with the shared field marks: cones, ball, wall, goal, player discs, and coaching notation, on a flat jointed slab.
- **Do** keep orange on cones and on the one flooded join field only.
- **Do** make every changing number tabular and tween it to rest.
- **Do** render every live surface from the one kit state.
- **Do** use the three motion curves by job: out for states and hovers, reveal for entrances, inOut for large moves; headlines rise line by line through a mask; the hero headline comes into focus from a 12px blur.
- **Do** give every motion a still path under prefers-reduced-motion: diagrams snap into place, the run section stops pinning, transitions drop to near zero.
- **Do** keep touch targets at 44px or more and focus visible as a 2px ink ring.

### Don't:
- **Don't** add box shadows, drop shadows, glows, glass, or shading gradients; depth is overlap only.
- **Don't** tilt the slab into perspective or round the corners of a ground window.
- **Don't** colour type; colour lives on the kit.
- **Don't** float the phone or show it in a device mockup with a shadow; it lies on the ground.
- **Don't** use night-stadium athlete photography, neon-green buttons, or grids of feature cards.
- **Don't** put helper lines or small labels above headlines.
- **Don't** invent route styles; pass, run, and dribble are the whole notation.
- **Don't** animate the concrete grain.
