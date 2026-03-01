#!/usr/bin/env python3
import json

def balance_levels():
    filepath = 'seed_content/seed_grade_2.json'
    with open(filepath, 'r') as f:
        questions = json.load(f)

    # Dictionary to keep track of count per level
    level_counts = {i: 0 for i in range(1, 11)}
    balanced_questions = []

    for q in questions:
        lvl = q.get('level', 1)
        if level_counts[lvl] < 100:
            balanced_questions.append(q)
            level_counts[lvl] += 1
        # If it's over 100, we simply skip adding it

    with open(filepath, 'w') as f:
        json.dump(balanced_questions, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f"Balanced {filepath}. New counts:")
    for lvl in range(1, 11):
        print(f"Level {lvl}: {level_counts[lvl]} questions")

if __name__ == '__main__':
    balance_levels()
