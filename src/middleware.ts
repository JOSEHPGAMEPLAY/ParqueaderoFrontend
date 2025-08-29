import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Definimos las rutas que necesitan autenticación
const protectedRoutes = ['/dashboard'];

// Rutas públicas (accesibles sin login)
const publicRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;
    
    // Rutas privadas
    if (protectedRoutes.some((path) => pathname.startsWith(path))) {
        if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        return NextResponse.next();
    }

    // Rutas públicas
    if (publicRoutes.includes(pathname)) {
        if (token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Otras rutas
    if (token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

// El matcher se aplica a TODAS las rutas (menos estáticos/_next)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};