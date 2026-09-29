# Chibi asset slots

Current status: fourteen individual transparent PNG characters generated from the supplied reference are included. Classic artwork remains a fallback. Generation prompts are recorded in docs/chibi-reference-prompts.md.

Place transparent WebP or PNG files in `warfall/` and `starforge/`:
`general.webp`, `guard.webp`, `elephant.webp`, `horse.webp`, `chariot.webp`, `cannon.webp`, `soldier.webp`.

Use centered square 512×512 images with clear silhouettes and transparent padding. Each file contains exactly one character; do not use a sprite atlas. Run `npm run dev` again or `npm run build` to discover new assets automatically. The manifest avoids requests for missing files. Corrupt images fall back to Classic and then text. Fine-tune scale and percentage offsets in `src/skins/chibi.ts`; animation assets remain optional.
