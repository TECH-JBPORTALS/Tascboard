/**
 * In this file all search params definition & loaders should be defined.
 * So, it can be re-used in the various components or pages
 *
 * Basic usage of 'nuqs'
 * @link https://nuqs.dev/docs/basic-usage
 *
 * Server side usage of 'nuqs'
 * @link https://nuqs.dev/docs/server-side
 */
import { createLoader, parseAsString } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const authSearchParams = {
  token: parseAsString,
};

export const loadAuthSearchParams = createLoader(authSearchParams);

export const querySearchParams = {
  q: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
};

export const loadQuerySearchParams = createLoader(querySearchParams);
