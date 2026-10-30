<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public news is fetched through a read-only TanStack server function with a fixed Google News Brazil RSS query; no credentials or database writes are needed.
- Keep news parsing, query options and server fetching in separate modules to avoid circular imports and test the parser independently.
- Use the shared site header for search and navigation; video and searchable page data share a single content catalog to stay consistent.
