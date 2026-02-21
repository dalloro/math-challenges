# Math Challenges — Seed Content Generation Plan

Generate 12,000 math questions (12 grades × 10 levels × 100 questions) using the prompt in `CONTENT-GENERATOR-PROMPT.md`, calibrated to each grade's curriculum scope as defined in `seed_content/CURRICULUM_GUIDE.md`.

## Updated Pseudo-Code

```
BATCH_SIZE = 50

for grade = 1 to 12:
    all_questions = []
    filename = "seed_content/seed_grade_" + grade + ".json"

    for level = 1 to 10:
        level_questions = []

        while len(level_questions) < 100:
            batch = execute_LLM("CONTENT-GENERATOR-PROMPT.md", BATCH_SIZE, grade, level)

            # Deduplicate: reject questions whose `question` text
            # already exists in level_questions OR all_questions
            for q in batch:
                if q.question not in [x.question for x in all_questions + level_questions]:
                    level_questions.append(q)

            # Save checkpoint
            save_batch("seed_content/batches/grade_{grade}_level_{level}_batch_{n}.json", batch)
            update_progress("seed_content/progress.json", grade, level, len(level_questions))
        end

        # Trim to exactly 100 if we overshot
        level_questions = level_questions[:100]
        all_questions.extend(level_questions)
    end

    # all_questions is a FLAT array of 1000 question objects
    # (not nested by level — each object has its own "level" field)
    save_to_file(all_questions, filename)
end
```

## Key Details

| Parameter | Value |
|---|---|
| Batch size per LLM call | 50 |
| Batches per (grade, level) | 2 (minimum, more if dedup removes items) |
| Questions per level | 100 |
| Levels per grade | 10 |
| Questions per grade | 1,000 |
| Total questions | 12,000 |
| Total LLM calls | ~240 (more if dedup triggers extra batches) |

## Directory Layout

```
math-challenges/
└── seed_content/
    ├── progress.json            # Resumability tracker
    ├── batches/                  # Intermediate files
    │   ├── grade_1_level_1_batch_0.json
    │   ├── grade_1_level_1_batch_1.json
    │   └── ...
    ├── seed_grade_1.json         # Final merged output
    ├── seed_grade_2.json
    └── ...
```

## Deduplication

- Each question's `question` field is compared against **all previously accepted questions within the same grade file**.
- If a duplicate is found, it is silently dropped and extra batches are generated to fill the gap.

## Resumability

`progress.json` tracks which (grade, level) pairs are complete:

```json
{
  "completed": [
    {"grade": 1, "level": 1, "count": 100},
    {"grade": 1, "level": 2, "count": 100}
  ],
  "current": {"grade": 1, "level": 3, "count": 50}
}
```

On resume, the pipeline:
1. Reads `progress.json`
2. Reloads all completed batch files from `batches/`
3. Continues from where it left off

## Verification Plan

### Automated Checks (after each grade completes)
- Validate each `seed_grade_X.json` is valid JSON
- Verify exactly 1,000 questions per file
- Verify 100 questions per level within each file
- Check no duplicate `question` fields within a file
- Verify all required JSON fields are present (`grade`, `level`, `difficulty`, `type`, `question`, `options`, `correct_answer`, `ideal_solution`, `failure_modes`)
- Verify `correct_answer` is contained in `options`

### Spot Check
- Manually review a sample of questions from different grades/levels for quality
