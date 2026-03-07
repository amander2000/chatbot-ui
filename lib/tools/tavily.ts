export interface TavilySearchResult {
  url: string
  title: string
  content: string
  score: number
}

export interface TavilySearchResponse {
  query: string
  answer?: string
  results: TavilySearchResult[]
}

export async function tavilySearch(
  query: string,
  options?: {
    maxResults?: number
    searchDepth?: "basic" | "advanced"
    includeAnswer?: boolean
  }
): Promise<TavilySearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured")
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: options?.searchDepth ?? "basic",
      include_answer: options?.includeAnswer ?? true,
      include_images: false,
      max_results: options?.maxResults ?? 5
    })
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Tavily API error ${response.status}: ${errorBody}`)
  }

  return response.json()
}
