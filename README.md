# Sheber

A fault-finding trainer for electronics and Arduino. Every mission is a project that
doesn't work: you read the circuit and the code and find the fault. No kit is needed, so
it works for schools that have no robotics equipment.

The interface, missions and lessons are in English, Kazakh and Russian.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` makes the production build and
`npm run lint` checks the code.

## Where things live

| Path | What it holds |
| --- | --- |
| `lib/missions.ts` | The missions: texts, circuit data, code, options, answer. `LEVELS` at the bottom sets their order and level |
| `lib/lessons.ts` | The lessons; `ORDER` at the bottom sets their order |
| `lib/extras.ts` | Per-mission extras: what to highlight when the fault is revealed, documentation links, the demo tour, option shuffling |
| `lib/glossary.ts` | Glossary terms and how they are spotted in mission text |
| `lib/ui.ts` | Interface strings in all three languages |
| `lib/store.ts` | Settings and answers, kept in the browser's localStorage |
| `lib/stats.ts` | Scores, the copyable result text, and parsing it back for the class summary |
| `components/Diagram.tsx` | Draws a circuit from mission data as SVG |

## Adding a mission

1. Add an entry to `catalog` in `lib/missions.ts` and its id to a level in `LEVELS`.
2. Add its fault locations to `highlights` in `lib/extras.ts`, and a documentation link to
   `sources` if there is one.
3. Open the mission in the browser and check the diagram: wires must not cross parts.

## Data

Answers are stored only on the visitor's device. There are no accounts and nothing is
sent to a server. A tester copies their result as text from the Results page; whoever
runs the test pastes those texts into `/teacher` to see the class as a whole.

A mission is marked "checked on a real board" only when its id is listed in
`verifiedOnHardware` in `lib/extras.ts`. Add an id there only after reproducing the
symptom on hardware.
