declare global {
  namespace Express {
    interface Request {
      user?: import("./auth.js").AuthenticatedUser;
    }
  }
}

export {};
