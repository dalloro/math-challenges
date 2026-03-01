#!/usr/bin/env python3
"""Fix all batch files: normalize difficulty by level and fix blind-mode questions.

Difficulty mapping (deterministic from level):
  Level 1-2  → "beginner"
  Level 3-4  → "intermediate"
  Level 5-6  → "advanced"
  Level 7-8  → "expert"
  Level 9-10 → "master"

Blind-mode fixes: rewrites questions that reference the answer choices so they
embed the items in the question text itself.

Usage:
  python3 scripts/fix_batches.py                  # fix all batch files
  python3 scripts/fix_batches.py --dry-run        # preview changes without writing
"""

import json
import re
import sys
import os
import glob

DIFFICULTY_MAP = {
    1: "beginner", 2: "beginner",
    3: "intermediate", 4: "intermediate",
    5: "advanced", 6: "advanced",
    7: "expert", 8: "expert",
    9: "master", 10: "master",
}

# --- Blind-mode detection patterns ---
BLIND_PATTERNS = [
    r'\bwhich of (these|the following|the above)\b',
    r'\bwhich (one|answer|option|choice)\b',
    r'\bfrom the (options|choices|list)\b',
    r'\b(options|choices) (above|below|given|listed)\b',
    r'\bnone of the above\b',
    r'\ball of the above\b',
]

COMPARATIVE_PATTERNS = [
    r'^which\b.*\bis (the )?(largest|smallest|greatest|least|biggest|longest|shortest|most|fewest|closest|nearest)\b',
    r'^which\b.*\bhas (the )?(most|fewest|least|largest|smallest|greatest|longest|shortest)\b',
]

def has_items_in_question(question_text):
    """Check if question already embeds the items (after colon or with commas)."""
    if re.search(r'[?:]\s*[\d\w/]+(\s*,\s*[\d\w/]+){2,}', question_text):
        return True
    if re.search(r'(greater|larger|smaller|less).+\bor\b', question_text, re.I):
        return True
    return False

def needs_blind_fix(question_text):
    """Returns True if question references the answer choices."""
    q_lower = question_text.lower().strip()
    if has_items_in_question(question_text):
        return False
    for pattern in BLIND_PATTERNS:
        if re.search(pattern, q_lower):
            return True
    for pattern in COMPARATIVE_PATTERNS:
        if re.search(pattern, q_lower):
            return True
    return False

def format_items_list(options):
    """Format options as a natural-language list: 'A, B, C, D, and E'."""
    if len(options) <= 1:
        return ', '.join(options)
    return ', '.join(options[:-1]) + ', and ' + options[-1]

def fix_blind_question(question, options):
    """Rewrite a blind-mode-incompatible question to embed items."""
    q = question.strip()
    items_str = format_items_list(options)

    # Pattern: "Which of these/the following X is/are Y?"
    # → "Which of the X A, B, C, D, and E is/are Y?"
    m = re.match(
        r'^(Which of (?:these|the following|the above))\s+(.+)',
        q, re.IGNORECASE
    )
    if m:
        rest = m.group(2)
        # Find the noun + verb: e.g. "numbers is even?" → noun="numbers", verb="is", pred="even?"
        noun_match = re.match(r'^(\w+(?:\s+\w+)?)\s+(is|are|has|have|equals|was|were|does|do|can|cannot|could|should|would|will|leaves|shows|CANNOT)\b(.*)$', rest, re.IGNORECASE)
        if noun_match:
            noun = noun_match.group(1)
            verb = noun_match.group(2)
            predicate = noun_match.group(3)
            return f"Which of the {noun} {items_str} {verb}{predicate}"

        # "Which of these is X?" → "Which of A, B, C, D, and E is X?"
        verb_match = re.match(r'^(is|are|has|have|equals|was|were|does|do|can|could|should|would|will)\b(.*)$', rest, re.IGNORECASE)
        if verb_match:
            verb = verb_match.group(1)
            predicate = verb_match.group(2)
            return f"Which of {items_str} {verb}{predicate}"

        # Other: "Which of these equals 100?" → "Which of A, B, C, D, and E equals 100?"
        return f"Which of {items_str} {rest}"

    # Pattern: bare comparative "Which X is the largest/smallest?"
    for pattern in COMPARATIVE_PATTERNS:
        if re.search(pattern, q.lower()):
            if q.endswith('?'):
                return f"{q[:-1]} among {items_str}?"
            return f"{q} among {items_str}"

    # Pattern: "...Which of these could be the number?"
    m2 = re.match(r'^(.+?)\.\s*Which of these (.+)$', q, re.IGNORECASE)
    if m2:
        prefix = m2.group(1)
        rest = m2.group(2)
        return f"{prefix}. Which of {items_str} {rest}"

    # Generic fallback: rephrase to include items
    if q.endswith('?'):
        return f"Among {items_str}, {q[0].lower()}{q[1:]}"
    return f"Among {items_str}, {q[0].lower()}{q[1:]}"



def fix_file(filepath, dry_run=False):
    """Fix a single batch file. Returns (difficulty_fixes, blind_fixes)."""
    with open(filepath, 'r') as f:
        data = json.load(f)

    difficulty_fixes = 0
    blind_fixes = 0
    modified = False

    for q in data:
        level = q.get('level', 0)
        expected_diff = DIFFICULTY_MAP.get(level)

        # Fix difficulty
        if expected_diff and q.get('difficulty') != expected_diff:
            if dry_run:
                print(f"  DIFF: [{q.get('difficulty')}] → [{expected_diff}] (level {level})")
            q['difficulty'] = expected_diff
            difficulty_fixes += 1
            modified = True

        # Fix blind-mode questions
        question_text = q.get('question', '')
        options = q.get('options', [])
        if needs_blind_fix(question_text) and options:
            new_question = fix_blind_question(question_text, options)
            if new_question != question_text:
                if dry_run:
                    print(f"  BLIND: {question_text}")
                    print(f"      → {new_question}")
                q['question'] = new_question
                blind_fixes += 1
                modified = True

    if modified and not dry_run:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write('\n')

    return difficulty_fixes, blind_fixes


def main():
    dry_run = '--dry-run' in sys.argv

    batch_dir = os.path.join(os.path.dirname(__file__), '..', 'seed_content', 'batches')
    batch_files = sorted(glob.glob(os.path.join(batch_dir, 'grade_*_level_*_batch_*.json')))

    if not batch_files:
        print("No batch files found!")
        sys.exit(1)

    total_diff = 0
    total_blind = 0

    for filepath in batch_files:
        basename = os.path.basename(filepath)
        diff_fixes, blind_fixes = fix_file(filepath, dry_run)

        if diff_fixes or blind_fixes:
            action = "Would fix" if dry_run else "Fixed"
            print(f"{action} {basename}: {diff_fixes} difficulty, {blind_fixes} blind-mode")

        total_diff += diff_fixes
        total_blind += blind_fixes

    print(f"\n{'DRY RUN — ' if dry_run else ''}Summary:")
    print(f"  Files processed: {len(batch_files)}")
    print(f"  Difficulty fixes: {total_diff}")
    print(f"  Blind-mode fixes: {total_blind}")

    if dry_run:
        print("\nRe-run without --dry-run to apply changes.")


if __name__ == '__main__':
    main()
