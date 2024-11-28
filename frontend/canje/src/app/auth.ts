/* eslint-disable */

import axios from "axios";
import NextAuth, {CredentialsSignin} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Response, Usuario } from "./types";

class InvalidLoginError extends CredentialsSignin {
  code: string;

  constructor(message = "Invalid identifier or password") {
    super(message);
    this.code = message;
  }
}

class UnknownLoginError extends CredentialsSignin {
  code = "Ocurrio un error inesperado. Intenta de nuevo.";
}

function getCookieHostname() {
  const hostname = new URL(process.env.NEXT_PUBLIC_APP_URL!).hostname;
  const [subDomain] = hostname.split(".");

  const cookieDomain = hostname.replace(`${subDomain}.`, "");
  return cookieDomain;
}

//const domain = getCookieHostname();
const domain = process.env.NEXT_PUBLIC_APP_URL?.includes("localhost") ? "localhost" : getCookieHostname();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      //@ts-ignore
      authorize: async (credentials) => {
        const { email, password } = credentials;

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
            db_info: data.result,
          };
        } catch (error) {
          if (error instanceof InvalidLoginError) {
            throw new InvalidLoginError(error.code);
          }

          throw new UnknownLoginError();
        }
      },
    }),
    Google({}),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (user && account?.provider === "google") {
          const response: Response<Usuario> = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/usuarios/loginGoogle`,
            {
              email: user.email,
              nombre: profile?.given_name || user.name || "",
              apellido: profile?.family_name || "",
              imagenperfil: profile?.picture || user.image || "",
            }
          );

          if (response.data.status !== "Success") {
            return `/login?error=SigninError&code=${response.data.message}`;
          }
          //@ts-ignore
          user.db_info = response.data.result;
        }

        return true;
      } catch (error) {
        console.log("See the error: ", error);
        return `/login?error=SigninError&code=Ups, algo salio mal. Intenta de nuevo.`;
      }
    },
    async jwt({ token, user }) {
      try {
        if (token) {
          //@ts-ignore
          token.sub = user?.db_info?.id || token.sub;
          const user_id = token.sub;

          const response: Response<Usuario> = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/usuarios/${user_id}`
          );

          if (response.data.status !== "Success") {
            console.log(`Error: ${response.data.message}`);
            return null;
          }

          token.db_info = response.data.result;
        }

        return token;
      } catch (error: any) {
        console.log("Error when fetching user data in JWT token: ", error.response);
        return null;
      }
    },
    async session({ token, session }) {
      // console.log("Token db_info: ", token.db_info);
      //@ts-ignore
      session.user.id = token.db_info.id;
      //@ts-ignore
      session.user.email = token.db_info.email;
      //@ts-ignore
      session.user.name = token.db_info.nombre;
      //@ts-ignore
      session.user.db_info = token.db_info;

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return url;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
    // signIn: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    // error: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    // signOut: `${process.env.NEXT_PUBLIC_APP_URL}`,
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