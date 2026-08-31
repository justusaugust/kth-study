import MiniSearch from "minisearch";
import {
  buildGraph,
  buildSearchIndex,
  loadCorpus,
  validateCorpus,
  type Corpus,
  type CurriculumGraph,
  type SearchDocument,
} from "../domain";

export interface StudyContext {
  root: string;
  corpus: Corpus;
  graph: CurriculumGraph;
  search: MiniSearch<SearchDocument>;
  refreshedAt: string;
}

export async function createStudyContext(root: string): Promise<StudyContext> {
  const corpus = await loadCorpus(root);
  const issues = validateCorpus(corpus);
  if (issues.length > 0) {
    throw new Error(
      `Study corpus validation failed: ${issues
        .map((issue) => `${issue.code}: ${issue.message}`)
        .join("; ")}`,
    );
  }
  return {
    root,
    corpus,
    graph: buildGraph(corpus),
    search: buildSearchIndex(corpus),
    refreshedAt: new Date().toISOString(),
  };
}

export async function refreshStudyContext(
  previous: StudyContext,
): Promise<StudyContext> {
  try {
    return await createStudyContext(previous.root);
  } catch {
    return previous;
  }
}
