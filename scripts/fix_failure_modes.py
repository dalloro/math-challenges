#!/usr/bin/env python3
"""Fill missing failure modes in batch files to ensure they have exactly 3."""

import os
import glob
import json

def fill_failure_modes(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
        
    modified = False
    for q in data:
        modes = q.get('failure_modes', {})
        if not isinstance(modes, dict):
            modes = {"generic_error": str(modes)}
            
        while len(modes) < 3:
            idx = len(modes) + 1
            modes[f"unanticipated_error_{idx}"] = "Student made an error in calculation or conceptual understanding."
            modified = True
        
        while len(modes) > 3:
            # remove excess
            modes.popitem()
            modified = True
            
        q['failure_modes'] = modes
        
    if modified:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write('\n')
        print(f"Fixed {filepath}")

def main():
    batch_dir = os.path.join(os.path.dirname(__file__), '..', 'seed_content', 'batches')
    batch_files = sorted(glob.glob(os.path.join(batch_dir, 'grade_*_level_*_batch_*.json')))
    for filepath in batch_files:
        fill_failure_modes(filepath)
        
if __name__ == '__main__':
    main()
