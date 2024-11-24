// Get unique prompts
export const getUniquePrompts = (prompts: string[]): string[] => {
  return [...new Set(prompts)];
};