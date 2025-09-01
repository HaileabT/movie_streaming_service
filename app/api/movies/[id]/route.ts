import { NextRequest, NextResponse } from "next/server";
import { getMovieDetail } from "@/lib/tmdb";

export async function GET(request: NextRequest, paramsPromise: { params: Promise<{ id: string }> }) {
  try {
    const params = await paramsPromise.params;
    const movieId = Number(params.id);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const movie = await getMovieDetail(movieId);

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("Movie detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 });
  }
}
