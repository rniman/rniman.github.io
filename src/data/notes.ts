import type { MarkdownInstance } from 'astro';
export interface NoteFrontmatter { title: string; description: string; date: string; category: string; }
const entries = import.meta.glob<MarkdownInstance<NoteFrontmatter>>('../pages/notes/*.md', { eager: true });
export const notes = Object.values(entries).sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
