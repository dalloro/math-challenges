#!/usr/bin/env python3
"""Scan seed_grade_X.json or batch files for questions incompatible with blind mode.

Blind-mode-incompatible questions can't be answered without seeing the
multiple-choice options. Detects patterns like:
  - "Which of these/the following..."
  - Bare comparatives ("Which is the largest?") without items in question text
  - References to "options", "choices", "above", "below"

Usage:
  python3 scripts/scan_blind_mode.py                           # scan all seed files
  python3 scripts/scan_blind_mode.py seed_content/batches/*.json  # scan specific files
"""

import json
import re
import sys
import os
import glob

PATTERNS = [
    (r'\bwhich of (these|the following|the above)\b', 'References options: "which of these/the following"'),
    (r'\bwhich (one|answer|option|choice)\b', 'References options: "which one/answer/option/choice"'),
    (r'\bfrom the (options|choices|list)\b', 'References options: "from the options/choices"'),
    (r'\b(options|choices) (above|below|given|listed)\b', 'References listed options'),
    (r'\bnone of the above\b', 'References "none of the above"'),
    (r'\ball of the above\b', 'References "all of the above"'),
    (r'^which\b.*\bis (the )?(largest|smallest|greatest|least|biggest|longest|shortest|most|fewest|closest|nearest)\b', 'Comparative "which is the largest/smallest" without specifying items'),
    (r'^which\b.*\bhas (the )?(most|fewest|least|largest|smallest|greatest|longest|shortest)\b', 'Comparative "which has the most/fewest" without specifying items'),
]

def has_items_in_question(question_text):
    """Heuristic: does the question itself embed the items to compare?"""
    q_lower = question_text.lower()
    if 'among ' in q_lower:
        return True
    # Match any list of 3+ items separated by commas and ending with 'and' or 'or'
    if re.search(r'([A-Za-z0-9\-\.\' ]+,\s*){2,}.*\b(and|or)\b', question_text):
        return True
    if re.search(r'[?:]\s*[\d\w/]+(\s*,\s*[\d\w/]+){2,}', question_text):
        return True
    if re.search(r'(greater|larger|smaller|less).+\bor\b', question_text, re.I):
        return True
    return False

def scan_question(question_text):
    """Return list of issue descriptions for flagged patterns."""
    flags = []
    q_lower = question_text.lower().strip()
    for pattern, desc in PATTERNS:
        if re.search(pattern, q_lower):
            flags.append(desc)
    return flags

def scan_file(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)

    flagged = []
    for i, q in enumerate(data):
        question_text = q.get('question', '')
        issues = scan_question(question_text)
        if issues and not has_items_in_question(question_text):
            flagged.append({
                'index': i,
                'grade': q.get('grade'),
                'level': q.get('level'),
                'question': question_text,
                'options': q.get('options', []),
                'correct_answer': q.get('correct_answer', ''),
                'issues': issues
            })
    return flagged

def main():
    if len(sys.argv) > 1:
        files = sys.argv[1:]
    else:
        seed_dir = os.path.join(os.path.dirname(__file__), '..', 'seed_content')
        files = sorted(glob.glob(os.path.join(seed_dir, 'seed_grade_*.json')))

    total_flagged = 0
    for filepath in files:
        basename = os.path.basename(filepath)
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
            total_questions = len(data)
        except Exception as e:
            print(f"❌ Error reading {basename}: {e}")
            continue

        flagged = scan_file(filepath)
        total_flagged += len(flagged)

        if flagged:
            print(f"\n{'='*70}")
            print(f"{basename}: {len(flagged)}/{total_questions} questions flagged")
            print(f"{'='*70}")
            for item in flagged:
                print(f"  [{item['index']}] Grade {item['grade']}, Level {item['level']}")
                print(f"  Q: {item['question']}")
                print(f"  Options: {item['options']}")
                for issue in item['issues']:
                    print(f"  ⚠️  {issue}")
                print()

    if total_flagged == 0:
        print(f"✅ All clear! No blind-mode issues found across {len(files)} files.")
    else:
        print(f"\n❌ {total_flagged} questions flagged across {len(files)} files.")
        sys.exit(1)

if __name__ == '__main__':
    main()
