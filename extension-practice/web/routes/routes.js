import { Router } from "express"
import { getQuestionController, postQuestionController } from "../controller/index.js";

export const Faq = Router();

Faq.post("/question-post" , postQuestionController);
Faq.get("/question-get" , getQuestionController);