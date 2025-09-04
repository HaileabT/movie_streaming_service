import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const watchLater = await prisma.watchLater.findMany({
      where: { userId: user.userId },
      include: {
        movie: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(watchLater);
    return NextResponse.json(watchLater, { status: 200 });
  } catch (error) {
    console.error("Get watch later error:", error);
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

    const existingUserWatchLater = await prisma.watchLater.findUnique({
      where: {
        userId_movieId: {
          userId: user.userId,
          movieId: movieId,
        },
      },
    });
    if (existingUserWatchLater) {
      return NextResponse.json({ error: "Movie already in watch later" }, { status: 409 });
    }

    // Add to watch later
    const watchLater = await prisma.watchLater.create({
      data: {
        userId: user.userId,
        movieId: movieId,
      },
      include: {
        movie: true,
      },
    });

    return NextResponse.json(watchLater, { status: 201 });
  } catch (error) {
    console.error("Add to watch later error:", error);
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

    await prisma.watchLater.deleteMany({
      where: {
        userId: user.userId,
        movieId: parseInt(movieId),
      },
    });

    return NextResponse.json({ message: "Removed from watch later" }, { status: 200 });
  } catch (error) {
    console.error("Remove from watch later error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
