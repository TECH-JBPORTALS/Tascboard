"use client";

import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useQueryState } from "nuqs";

export function SearchInput() {
  const [q, setQuery] = useQueryState("q", {
    defaultValue: "",
    clearOnDefault: true,
  });

  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        value={q}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search employees..."
      />
    </InputGroup>
  );
}
