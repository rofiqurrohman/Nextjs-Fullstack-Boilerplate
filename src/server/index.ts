import { z } from "zod";
import { authedProcedure, publicProcedure, router } from "./trpc";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  profile: publicProcedure.query(async ({}) => {
    return await auth()
  }),

  user: authedProcedure.query(async ({ ctx }) => {
    
    const user = await prisma.user.findUnique({
      where: { email: ctx.session?.user?.email as string },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return user;
  }),
});

export type AppRouter = typeof appRouter;