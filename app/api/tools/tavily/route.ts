import { tavilySearch } from "@/lib/tools/tavily"

export async function POST(request: Request) {
  try {
    const { query, maxResults, searchDepth } = await request.json()

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'query' parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const results = await tavilySearch(query, { maxResults, searchDepth })

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error: any) {
    const errorMessage = error.message || "Internal Server Error"
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
