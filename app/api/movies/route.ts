import { NextRequest, NextResponse } from 'next/server'
import { getPopularMovies } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const query = searchParams.get('query')
    const genreId = searchParams.get('genreId')

    let movies
    if (query) {
      const { searchMovies } = await import('@/lib/tmdb')
      movies = await searchMovies(query, page)
    } else if (genreId) {
      const { getMoviesByGenre } = await import('@/lib/tmdb')
      movies = await getMoviesByGenre(parseInt(genreId), page)
    } else {
      movies = await getPopularMovies(page)
    }

    return NextResponse.json(movies, { status: 200 })
  } catch (error) {
    console.error('Movies API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
  }
}
