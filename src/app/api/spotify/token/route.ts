import { getSpotifyAccessToken } from "~/server/utils";

export async function GET(request: Request) {
  const token = await getSpotifyAccessToken();

  return Response.json({ access_token: token });
}
