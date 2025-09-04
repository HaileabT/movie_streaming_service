import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ratings = await prisma.rating.findMany({
      where: { userId: user.userId },
      include: {
        movie: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(ratings, { status: 200 });
  } catch (error) {
    console.error("Get ratings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { movieId, score } = await request.json();

    if (!movieId || !score) {
      return NextResponse.json({ error: "Movie ID and score are required" }, { status: 400 });
    }

    if (score < 1 || score > 5) {
      return NextResponse.json({ error: "Score must be between 1 and 5" }, { status: 400 });
    }

    let movieMeta = await prisma.movieMeta.findUnique({
      where: { id: movieId },
    });

    if (!movieMeta) {
      const { getMovieDetail } = await import("@/lib/tmdb");
      const tmdbMovie = await getMovieDetail(movieId);

      movieMeta = await prisma.movieMeta.create({
        data: {
          id: tmdbMovie.id,
          title: tmdbMovie.title,
          description: tmdbMovie.overview,
          genreIds: tmdbMovie.genre_ids,
          vote_average: tmdbMovie.vote_average,
          releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : null,
        },
      });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_movieId: {
          userId: user.userId,
          movieId: movieId,
        },
      },
      update: {
        score: score,
      },
      create: {
        userId: user.userId,
        movieId: movieId,
        score: score,
      },
      include: {
        movie: true,
      },
    });

    return NextResponse.json(rating, { status: 201 });
  } catch (error) {
    console.error("Add rating error:", error);
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

    await prisma.rating.deleteMany({
      where: {
        userId: user.userId,
        movieId: parseInt(movieId),
      },
    });

    return NextResponse.json({ message: "Rating removed" }, { status: 200 });
  } catch (error) {
    console.error("Remove rating error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
