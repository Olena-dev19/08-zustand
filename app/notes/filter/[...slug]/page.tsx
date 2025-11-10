import { fetchNotes } from "@/lib/api";

import { NoteTag } from "@/types/note";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesPageDefault from "./Notes.client";

interface NotesByCategoryProps {
  params: Promise<{ slug: string[] }>;
}
const NotesByCategory = async ({ params }: NotesByCategoryProps) => {
  const { slug } = await params;
  const tag = slug?.[0];
  const searchTag = tag === "all" ? undefined : tag;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", { currentPage: 1, search: "", searchTag }],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: "",
        perPage: 12,
        tag: searchTag as NoteTag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesPageDefault tag={searchTag as NoteTag} />
    </HydrationBoundary>
  );
};
export default NotesByCategory;
