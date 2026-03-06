"use client";

import { InstantSearch, Configure } from "react-instantsearch";
import { getSearchClient, MEILI_INDEX } from "@/lib/search/meili";
import { SearchBarInner } from "./SearchBarInner";
import { FallbackSearchBar } from "./FallbackSearchBar";

export function SearchBar() {
  const client = getSearchClient();
  if (!client) {
    return <FallbackSearchBar />;
  }
  return (
    <InstantSearch searchClient={client} indexName={MEILI_INDEX}>
      <Configure hitsPerPage={6} />
      <SearchBarInner />
    </InstantSearch>
  );
}
