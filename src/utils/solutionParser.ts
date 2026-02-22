export function parseIdealSolution(input: string) {
  if (!input) {
    return { socraticHint: null, finalIdealSolution: '' };
  }

  const delimiter = 'socratic hint:';
  const lowerInput = input.toLowerCase();
  const index = lowerInput.indexOf(delimiter);

  if (index === -1) {
    return { socraticHint: null, finalIdealSolution: input.trim() };
  }

  const finalIdealSolution = input.slice(0, index).trim();
  const socraticHint = input.slice(index + delimiter.length).trim();

  return { socraticHint: socraticHint || null, finalIdealSolution };
}
