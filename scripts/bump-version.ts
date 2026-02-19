import { execSync } from 'child_process';
import fs from 'fs';

function run() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const currentVersion = packageJson.version;

  // Get the last release tag
  let lastTag = '';
  try {
    lastTag = execSync('git describe --tags --abbrev=0').toString().trim();
  } catch {
    // No tags yet, start from v0.0.0
    lastTag = 'v0.0.0';
  }

  console.log(`Current version: ${currentVersion}`);
  console.log(`Last tag: ${lastTag}`);

  // Get all commit messages since the last tag
  const commitMessages = execSync(`git log ${lastTag}..HEAD --format=%s`).toString();
  
  if (!commitMessages.trim()) {
    console.log("No new commits since last tag. Skipping version bump.");
    process.exit(0);
  }

  let bump: 'major' | 'minor' | 'patch' = 'patch';

  // Logic for semantic versioning using regex to support scopes (e.g., feat(ui):)
  if (/BREAKING CHANGE|major(\(.*\))?:/i.test(commitMessages)) {
    bump = 'major';
  } else if (/feat(\(.*\))?:/i.test(commitMessages)) {
    bump = 'minor';
  }

  console.log(`Bump type identified: ${bump}`);

  // Perform the bump in package.json
  execSync(`npm version ${bump} --no-git-tag-version`);
  
  const newVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
  console.log(`New version: ${newVersion}`);
}

run();
