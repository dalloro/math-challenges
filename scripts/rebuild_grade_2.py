import json
import glob
import os

def rebuild_grade_2():
    batch_files = glob.glob('seed_content/batches/grade_2_level_*.json')
    all_questions = []
    seen_questions = set()
    duplicate_count = 0
    
    print(f"Found {len(batch_files)} batch files for Grade 2.")
    
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
    
    # Sort questions by level and then by difficulty
    difficulty_order = {"beginner": 1, "intermediate": 2, "advanced": 3, "master": 4, "grandmaster": 5, "gifted": 6}
    all_questions.sort(key=lambda x: (x.get('level', 0), difficulty_order.get(x.get('difficulty', ''), 99)))
    
    output_file = 'seed_content/seed_grade_2.json'
    with open(output_file, 'w') as f:
        json.dump(all_questions, f, indent=2)
        
    print(f"Successfully wrote {len(all_questions)} questions to {output_file}.")

if __name__ == '__main__':
    rebuild_grade_2()
