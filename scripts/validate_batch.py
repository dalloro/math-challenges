import json
import sys

def validate_file(filepath):
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ '{filepath}' is NOT valid JSON: {e}")
        return False
        
    if not isinstance(data, list):
        print(f"❌ Root of '{filepath}' must be a JSON array.")
        return False
        
    if len(data) != 50:
        print(f"❌ Batch '{filepath}' must have exactly 50 questions, found {len(data)}.")
        return False
        
    required_keys = {"grade", "level", "difficulty", "type", "question", "options", "correct_answer", "ideal_solution", "failure_modes"}
    valid = True
    
    for i, q in enumerate(data):
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
    if len(sys.argv) < 2:
        print("Usage: python validate_batch.py <path_to_json>")
        sys.exit(1)
        
    all_passed = True
    for fp in sys.argv[1:]:
        if not validate_file(fp):
            all_passed = False
            
    if not all_passed:
        sys.exit(1)
