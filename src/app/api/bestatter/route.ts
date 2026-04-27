import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plz = searchParams.get('plz');
  if (!plz) return NextResponse.json({ error: 'PLZ required' }, { status: 400 });

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Bestattungsinstitut+${encodeURIComponent(plz)}&language=de&key=${apiKey}`,
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results = (data.results || []).slice(0, 12).map((r: any) => ({
        id: r.place_id,
        name: r.name,
        addr: r.formatted_address,
        rating: r.rating ?? null,
        reviews: r.user_ratings_total ?? 0,
        lat: r.geometry?.location?.lat,
        lng: r.geometry?.location?.lng,
        open: r.opening_hours?.open_now ?? null,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`,
        source: 'google',
      }));
      return NextResponse.json({ results });
    } catch {
      return NextResponse.json({ error: 'Google API failed' }, { status: 500 });
    }
  }

  // Fallback: Nominatim (OpenStreetMap)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=Bestattung+${encodeURIComponent(plz)}&format=json&limit=10&addressdetails=1&countrycodes=de`,
      { headers: { 'User-Agent': 'Nachlass-Begleiter/1.0 (contact@nachlass.app)' }, next: { revalidate: 3600 } }
    );
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = data.map((r: any) => ({
      id: String(r.place_id),
      name: r.namedetails?.name || r.display_name.split(',')[0],
      addr: r.display_name,
      rating: null,
      reviews: 0,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      open: null,
      mapsUrl: `https://www.openstreetmap.org/${r.osm_type}/${r.osm_id}`,
      source: 'osm',
    }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
