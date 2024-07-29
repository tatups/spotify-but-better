import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers);
  //set a new header for the request url path
  requestHeaders.set("x-app-url", request.url);

  //console.log("we are in middleware.ts");

  requestHeaders.set("x-hello-from-middleware1", "Hello from middleware1");

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  return response;
}
