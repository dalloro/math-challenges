import json
import sys
import argparse

def validate_file(filepath, target_total, target_level):
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ '{filepath}' is NOT valid JSON: {e}")
        return False
        
    if not isinstance(data, list):
        print(f"❌ Root of '{filepath}' must be a JSON array.")
        return False

    # Deduplicate
    seen_questions = set()
    deduped_data = []
    duplicates_removed = 0
    
    for q in data:
        if isinstance(q, dict) and 'question' in q:
            q_text = q['question'].strip()
            if q_text in seen_questions:
                duplicates_removed += 1
                continue
            seen_questions.add(q_text)
        deduped_data.append(q)
        
    if duplicates_removed > 0:
        print(f"⚠️ Removed {duplicates_removed} duplicate questions from '{filepath}'.")
        data = deduped_data
        # Rewrite the file with duplicates removed
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write('\n')

    valid = True

    if target_total is not None and len(data) != target_total:
        print(f"❌ '{filepath}' must have exactly {target_total} questions (found {len(data)}).")
        valid = False

    # Check exactly `target_level` per level if provided
    if target_level is not None:
        level_counts = {}
        for q in data:
            if isinstance(q, dict) and 'level' in q:
                lvl = q['level']
                level_counts[lvl] = level_counts.get(lvl, 0) + 1

        for lvl in range(1, 11):
            count = level_counts.get(lvl, 0)
            if count != target_level:
                print(f"❌ Level {lvl} in '{filepath}' has {count} questions, expected {target_level}.")
                valid = False

    required_keys = {"grade", "level", "difficulty", "type", "question", "options", "correct_answer", "ideal_solution", "failure_modes"}
    
    for i, q in enumerate(data):
        if not isinstance(q, dict):
            print(f"❌ Item {i} is not a JSON object.")
            valid = False
            continue

        missing = required_keys - set(q.keys())
        if missing:
            print(f"❌ Item {i} missing keys: {missing}")
            valid = False
            
        if "options" in q and "correct_answer" in q:
            if q["correct_answer"] not in q["options"]:
                print(f"❌ Item {i} correct_answer ('{q['correct_answer']}') not in options: {q['options']}")
                valid = False
                
        if "failure_modes" in q:
            fm = q["failure_modes"]
            if not isinstance(fm, dict):
                print(f"❌ Item {i} failure_modes is not an object/dictionary.")
                valid = False
            elif len(fm) != 3:
                print(f"❌ Item {i} does NOT have exactly 3 failure modes. Found {len(fm)}.")
                valid = False

    if valid:
        print(f"✅ '{filepath}' passed all validations! ({len(data)} questions)")
    else:
        print(f"❌ '{filepath}' failed validation.")
        
    return valid

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Validate merged grade JSON files.")
    parser.add_argument("--target-total", type=int, default=1000, help="Target total number of questions per file (default: 1000)")
    parser.add_argument("--target-level", type=int, default=100, help="Target number of questions per level (default: 100)")
    parser.add_argument("files", nargs="+", help="JSON files to validate")
    
    args = parser.parse_args()
        
    all_passed = True
    for fp in args.files:
        if not validate_file(fp, args.target_total, args.target_level):
            all_passed = False
            
    if not all_passed:
        sys.exit(1)
