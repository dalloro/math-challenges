import json
import glob

def rebuild_grade_5():
    batch_files = glob.glob('seed_content/batches/grade_5_level_*.json')
    all_questions = []
    seen_questions = set()
    duplicate_count = 0
    
    print(f"Found {len(batch_files)} batch files for Grade 5.")
    
    for bf in sorted(batch_files):
        with open(bf, 'r') as f:
            data = json.load(f)
            for q in data:
                q_text = q['question'].strip()
                if q_text not in seen_questions:
                    seen_questions.add(q_text)
                    all_questions.append(q)
                else:
                    duplicate_count += 1
                    
    print(f"Processed {len(all_questions) + duplicate_count} total questions.")
    print(f"Removed {duplicate_count} duplicates.")
    print(f"Final count: {len(all_questions)} unique questions.")
    
    # Sort questions by level
    all_questions.sort(key=lambda x: x.get('level', 0))
    
    output_file = 'seed_content/seed_grade_5.json'
    with open(output_file, 'w') as f:
        json.dump(all_questions, f, indent=2)
        
    print(f"Successfully wrote {len(all_questions)} questions to {output_file}.")

if __name__ == '__main__':
    rebuild_grade_5()
