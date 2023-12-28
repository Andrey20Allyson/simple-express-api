import { z } from "zod";

export const validNumber = z.number({ coerce: true });