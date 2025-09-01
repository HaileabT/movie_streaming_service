import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.userId },
      include: {
        movie: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { movieId } = await request.json();

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
    }

    // Check if movie exists in MovieMeta, if not create it
    let movieMeta = await prisma.movieMeta.findUnique({
      where: { id: movieId },
    });

    if (!movieMeta) {
      // Fetch movie details from TMDB and create MovieMeta
      const { getMovieDetail } = await import("@/lib/tmdb");
      const tmdbMovie = await getMovieDetail(movieId);

      movieMeta = await prisma.movieMeta.create({
        data: {
          id: tmdbMovie.id,
          title: tmdbMovie.title,
          description: tmdbMovie.overview,
          vote_average: tmdbMovie.vote_average,
          genreIds: tmdbMovie.genre_ids,
          releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : null,
        },
      });
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.userId,
        movieId: movieId,
      },
      include: {
        movie: true,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Add to favorites error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: user.userId,
        movieId: parseInt(movieId),
      },
    });

    return NextResponse.json({ message: "Removed from favorites" }, { status: 200 });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
