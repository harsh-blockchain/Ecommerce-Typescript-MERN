import express from "express";

module.exports =
  (theFunction: any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
