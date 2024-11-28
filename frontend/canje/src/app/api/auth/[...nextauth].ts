import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Response, Usuario } from "@/app/types";  // Ajustar la ruta si es necesario

class InvalidLoginError extends Error {
  constructor(message = "Invalid identifier or password") {
    super(message);
    this.name = "InvalidLoginError";
  }
}

class UnknownLoginError extends Error {
  constructor() {
    super("Ocurrio un error inesperado. Intenta de nuevo.");
    this.name = "UnknownLoginError";
  }
}

const getCookieHostname = () => {
  const hostname = new URL(process.env.NEXT_PUBLIC_APP_URL!).hostname;
  const [subDomain] = hostname.split(".");
  const cookieDomain = hostname.replace(`${subDomain}.`, "");
  return cookieDomain;
};

const domain = process.env.NEXT_PUBLIC_APP_URL?.includes("localhost") ? "localhost" : getCookieHostname();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as { email: string; password: string };

        try {
          const response: Response<Usuario> = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth`, {
            email: email,
            password: password,
          });

          const data = response.data;

          if (data.status !== "Success") {
            throw new InvalidLoginError(data.message);
          }

          return {
            id: data.result.id,
            name: data.result.nombre,
            email: data.result.correo,
            image: data.result.imagenperfil,
          };
        } catch (error) {
          if (error instanceof InvalidLoginError) {
            throw error;
          }
          throw new UnknownLoginError();
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id ?? '';
      session.user.name = token.name ?? '';
      session.user.email = token.email ?? '';
      session.user.image = token.image ?? null;
      return session;
    },
  },
  pages: {
    signIn: "https://landing.heladosvillaizan.tech/login",
  },
  cookies: {
    sessionToken: {
      name: domain === "localhost" ? "authjs.session-token" : `__Secure-next-auth.session-token`,
      options: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        path: "/",
        domain,
      },
    },
    callbackUrl: {
      name: domain === "localhost" ? "authjs.callback-url" : `__Secure-next-auth.callback-url`,
      options: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        path: "/",
        domain,
      },
    },
    csrfToken: {
      name: domain === "localhost" ? "authjs.csrf-token" : `next-auth.csrf-token`,
      options: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        path: "/",
        domain,
      },
    },
  },
});

