import { NextResponse } from "next/server";
import { getGenres } from "@/lib/tmdb";

export async function GET() {
  try {
    const genres = await getGenres();
    return NextResponse.json(genres, { status: 200 });
  } catch (error) {
    console.error("Genres API error:", error);
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}
