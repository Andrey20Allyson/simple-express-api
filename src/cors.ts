import cors from "cors";

export const corsMiddleware = cors({
  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],
});